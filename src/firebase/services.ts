import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, logAnalyticsEvent, auth } from './config';
import { handleFirestoreError, OperationType } from './errorHandler';
import { Product, Order, CartItem, User, UserRole } from '../types';
import { INITIAL_PRODUCTS, CATEGORIES } from '../data/mockData';

// Collection paths
export const PRODUCTS_COLLECTION = 'products';
export const CATEGORIES_COLLECTION = 'categories';
export const USERS_COLLECTION = 'users';
export const CARTS_COLLECTION = 'carts';
export const ORDERS_COLLECTION = 'orders';
export const WISHLISTS_COLLECTION = 'wishlists';
export const ADMINS_COLLECTION = 'admins';

/**
 * Seed initial catalog data to Cloud Firestore if collections are empty.
 * Guarded to execute writes only when an authorized admin is signed in.
 */
export async function seedInitialDataIfEmpty(adminEmail?: string) {
  // Only attempt writes if authenticated as admin to avoid permission errors
  if (!auth.currentUser) {
    return;
  }
  const isAuthorizedAdmin =
    auth.currentUser.email === 'fatiufaruk7@gmail.com' ||
    (adminEmail && auth.currentUser.email === adminEmail);

  if (!isAuthorizedAdmin) {
    return;
  }

  try {
    const productsSnapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));
    if (productsSnapshot.empty) {
      console.log('Seeding initial JUMIA catalog products to Cloud Firestore...');
      for (const product of INITIAL_PRODUCTS) {
        await setDoc(doc(db, PRODUCTS_COLLECTION, product.id), product);
      }
    }

    const categoriesSnapshot = await getDocs(collection(db, CATEGORIES_COLLECTION));
    if (categoriesSnapshot.empty) {
      console.log('Seeding JUMIA categories to Cloud Firestore...');
      for (const cat of CATEGORIES) {
        await setDoc(doc(db, CATEGORIES_COLLECTION, cat.id), cat);
      }
    }

    // Ensure default admin document exists
    const adminDocRef = doc(db, ADMINS_COLLECTION, auth.currentUser.uid);
    await setDoc(
      adminDocRef,
      {
        email: auth.currentUser.email,
        role: 'admin',
        createdAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    console.warn('Initial seeding encountered an error:', error);
  }
}

/**
 * Subscribe to Products from Cloud Firestore.
 * Public collection: accessible with or without authentication.
 */
export function subscribeProducts(
  onSuccess: (products: Product[]) => void,
  onError?: (error: unknown) => void
) {
  return onSnapshot(
    collection(db, PRODUCTS_COLLECTION),
    (snapshot) => {
      if (snapshot.empty) {
        onSuccess(INITIAL_PRODUCTS);
        return;
      }
      const items: Product[] = [];
      snapshot.forEach((docSnap) => {
        items.push({ id: docSnap.id, ...docSnap.data() } as Product);
      });
      onSuccess(items);
    },
    (error) => {
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.GET, PRODUCTS_COLLECTION);
    }
  );
}

/**
 * Add or create a product in Cloud Firestore (Sellers & Admins)
 */
export async function createProductInFirestore(product: Product): Promise<void> {
  const path = `${PRODUCTS_COLLECTION}/${product.id}`;
  try {
    await setDoc(doc(db, PRODUCTS_COLLECTION, product.id), {
      ...product,
      createdAt: serverTimestamp(),
    });
    logAnalyticsEvent('create_product', {
      product_id: product.id,
      title: product.title,
      price: product.price,
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

/**
 * Update an existing product in Cloud Firestore (Sellers & Admins)
 */
export async function updateProductInFirestore(
  productId: string,
  updates: Partial<Product>
): Promise<void> {
  const path = `${PRODUCTS_COLLECTION}/${productId}`;
  try {
    await updateDoc(doc(db, PRODUCTS_COLLECTION, productId), {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

/**
 * Delete a product from Cloud Firestore (Admins & Product Owner)
 */
export async function deleteProductInFirestore(productId: string): Promise<void> {
  const path = `${PRODUCTS_COLLECTION}/${productId}`;
  try {
    await deleteDoc(doc(db, PRODUCTS_COLLECTION, productId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

/**
 * Sync shopping cart to Cloud Firestore
 */
export async function saveCartToFirestore(userId: string, cart: CartItem[]): Promise<void> {
  if (!auth.currentUser || !userId || auth.currentUser.uid !== userId) return;
  const path = `${CARTS_COLLECTION}/${userId}`;
  try {
    await setDoc(
      doc(db, CARTS_COLLECTION, userId),
      {
        userId,
        items: cart,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    console.warn('Unable to sync cart to Firestore:', error);
  }
}

/**
 * Load cart from Cloud Firestore
 */
export async function loadCartFromFirestore(userId: string): Promise<CartItem[] | null> {
  if (!auth.currentUser || !userId || auth.currentUser.uid !== userId) return null;
  try {
    const snap = await getDoc(doc(db, CARTS_COLLECTION, userId));
    if (snap.exists() && snap.data().items) {
      return snap.data().items as CartItem[];
    }
    return null;
  } catch (error) {
    console.warn('Unable to load cart from Firestore:', error);
    return null;
  }
}

/**
 * Sync Wishlist to Cloud Firestore
 */
export async function saveWishlistToFirestore(userId: string, itemIds: string[]): Promise<void> {
  if (!auth.currentUser || !userId || auth.currentUser.uid !== userId) return;
  try {
    await setDoc(
      doc(db, WISHLISTS_COLLECTION, userId),
      {
        userId,
        itemIds,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    console.warn('Unable to sync wishlist to Firestore:', error);
  }
}

/**
 * Load Wishlist from Cloud Firestore
 */
export async function loadWishlistFromFirestore(userId: string): Promise<string[] | null> {
  if (!auth.currentUser || !userId || auth.currentUser.uid !== userId) return null;
  try {
    const snap = await getDoc(doc(db, WISHLISTS_COLLECTION, userId));
    if (snap.exists() && snap.data().itemIds) {
      return snap.data().itemIds as string[];
    }
    return null;
  } catch (error) {
    console.warn('Unable to load wishlist from Firestore:', error);
    return null;
  }
}

/**
 * Create Order in Cloud Firestore
 */
export async function createOrderInFirestore(order: Order): Promise<void> {
  if (!auth.currentUser) {
    console.warn('Cannot persist order to Firestore: user is not signed in.');
    return;
  }
  const path = `${ORDERS_COLLECTION}/${order.id}`;
  try {
    await setDoc(doc(db, ORDERS_COLLECTION, order.id), {
      ...order,
      userId: auth.currentUser.uid,
      createdAt: serverTimestamp(),
    });
    logAnalyticsEvent('purchase', {
      transaction_id: order.id,
      value: order.total,
      currency: 'NGN',
      items: order.items.map((i) => ({
        item_id: i.product.id,
        item_name: i.product.title,
        price: i.product.price,
        quantity: i.quantity,
      })),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

/**
 * Subscribe to Orders from Cloud Firestore.
 * Guaranteed to only query when the user is signed in to avoid permission errors.
 */
export function subscribeOrders(
  userId: string | null,
  role: UserRole,
  onSuccess: (orders: Order[]) => void,
  onError?: (error: unknown) => void
) {
  // If no user is authenticated, return a no-op cleanup
  if (!auth.currentUser || !userId) {
    return () => {};
  }

  const collectionRef = collection(db, ORDERS_COLLECTION);
  let q;

  // Customers see their own orders; sellers and admins see all relevant orders
  if (role === 'customer') {
    q = query(collectionRef, where('userId', '==', auth.currentUser.uid));
  } else {
    q = query(collectionRef);
  }

  return onSnapshot(
    q,
    (snapshot) => {
      const ordersList: Order[] = [];
      snapshot.forEach((d) => {
        ordersList.push({ id: d.id, ...d.data() } as Order);
      });
      onSuccess(ordersList);
    },
    (error) => {
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.GET, ORDERS_COLLECTION);
    }
  );
}

/**
 * Update Order status in Cloud Firestore
 */
export async function updateOrderStatusInFirestore(
  orderId: string,
  status: Order['status'],
  trackingSteps: Order['trackingSteps']
): Promise<void> {
  const path = `${ORDERS_COLLECTION}/${orderId}`;
  try {
    await updateDoc(doc(db, ORDERS_COLLECTION, orderId), {
      status,
      trackingSteps,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

/**
 * Save / Update User Profile in Cloud Firestore
 */
export async function saveUserProfileToFirestore(user: User): Promise<void> {
  if (!auth.currentUser) return;
  const path = `${USERS_COLLECTION}/${user.id}`;
  try {
    await setDoc(
      doc(db, USERS_COLLECTION, user.id),
      {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        walletBalance: user.walletBalance,
        addresses: user.addresses,
        savedItemIds: user.savedItemIds,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Load User Profile from Cloud Firestore
 */
export async function loadUserProfileFromFirestore(userId: string): Promise<User | null> {
  if (!auth.currentUser) return null;
  try {
    const snap = await getDoc(doc(db, USERS_COLLECTION, userId));
    if (snap.exists()) {
      return snap.data() as User;
    }
    return null;
  } catch (error) {
    console.warn('Unable to load user profile from Firestore:', error);
    return null;
  }
}

/**
 * Upload Image to Firebase Storage
 */
export async function uploadImageToStorage(
  file: File,
  folder = 'products'
): Promise<string> {
  try {
    const filename = `${folder}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    const storageRef = ref(storage, filename);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadUrl = await getDownloadURL(snapshot.ref);
    return downloadUrl;
  } catch (error) {
    console.error('Firebase Storage upload error:', error);
    throw error;
  }
}
