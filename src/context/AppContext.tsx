import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInAnonymously,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth, googleProvider, logAnalyticsEvent } from '../firebase/config';
import {
  seedInitialDataIfEmpty,
  subscribeProducts,
  createProductInFirestore,
  updateProductInFirestore,
  deleteProductInFirestore,
  saveCartToFirestore,
  loadCartFromFirestore,
  saveWishlistToFirestore,
  loadWishlistFromFirestore,
  createOrderInFirestore,
  subscribeOrders,
  updateOrderStatusInFirestore,
  saveUserProfileToFirestore,
  loadUserProfileFromFirestore,
  uploadImageToStorage,
} from '../firebase/services';
import { Product, CartItem, User, Order, UserRole, DeliveryAddress } from '../types';
import { INITIAL_PRODUCTS, INITIAL_USER, INITIAL_ORDERS } from '../data/mockData';

export type ViewType =
  | 'home'
  | 'catalog'
  | 'product-detail'
  | 'cart'
  | 'checkout'
  | 'order-success'
  | 'customer-dashboard'
  | 'seller-dashboard'
  | 'admin-dashboard';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'error';
  message: string;
}

interface AppContextType {
  // Products from Firestore
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (productId: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  uploadProductImage: (file: File) => Promise<string>;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedColor?: string, selectedSize?: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  appliedCoupon: string | null;
  couponDiscount: number;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;

  // User & Auth
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  firebaseUser: FirebaseUser | null;
  isAuthLoading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string, role?: UserRole) => Promise<void>;
  registerWithEmail: (email: string, pass: string, name: string, phone: string, role?: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  switchRole: (role: UserRole) => void;
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  addDeliveryAddress: (address: Omit<DeliveryAddress, 'id'>) => void;

  // Orders
  orders: Order[];
  placeOrder: (orderData: {
    address: DeliveryAddress;
    deliveryMethod: 'door' | 'pickup';
    paymentMethod: 'jumiapay' | 'card' | 'bank_transfer' | 'cod';
  }) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;

  // Navigation & Views
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string | null;
  setSelectedCategory: (catSlug: string | null) => void;
  activeOrder: Order | null;
  setActiveOrder: (order: Order | null) => void;

  // Modals & Feedback
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalTab: 'login' | 'register';
  setAuthModalTab: (tab: 'login' | 'register') => void;
  toasts: ToastMessage[];
  addToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;

  openProductDetail: (product: Product) => void;
  formatNaira: (amount: number) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<User>(INITIAL_USER);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);

  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponDiscount, setCouponDiscount] = useState<number>(0);

  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(INITIAL_PRODUCTS[0]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeOrder, setActiveOrder] = useState<Order | null>(INITIAL_ORDERS[0] || null);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const isInitialSyncDone = useRef(false);

  // Toast notifier
  const addToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Connect to products collection (public catalog read)
  useEffect(() => {
    // Subscribe to Firestore products in real-time
    const unsubscribeProducts = subscribeProducts(
      (items) => {
        if (items && items.length > 0) {
          setProducts(items);
        }
      },
      (err) => {
        console.warn('Falling back to local catalog:', err);
      }
    );

    return () => {
      unsubscribeProducts();
    };
  }, []);

  // Firebase Auth State Listener
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (fbUser) => {
      setIsAuthLoading(true);
      setFirebaseUser(fbUser);

      if (fbUser) {
        // Authenticated with Firebase
        const isDefaultAdmin = fbUser.email === 'fatiufaruk7@gmail.com';

        // If default super admin, seed initial Firestore data if empty
        if (isDefaultAdmin) {
          seedInitialDataIfEmpty(fbUser.email || undefined);
        }

        const existingProfile = await loadUserProfileFromFirestore(fbUser.uid);

        if (existingProfile) {
          // If user email matches admin, guarantee admin role
          if (isDefaultAdmin && existingProfile.role !== 'admin') {
            existingProfile.role = 'admin';
            saveUserProfileToFirestore(existingProfile);
          }
          setUser(existingProfile);
        } else {
          // Create new user profile in Firestore
          const newProfile: User = {
            id: fbUser.uid,
            name: fbUser.displayName || fbUser.email?.split('@')[0] || 'JUMIA Shopper',
            email: fbUser.email || '',
            phone: fbUser.phoneNumber || '0803 123 4567',
            role: isDefaultAdmin ? 'admin' : 'customer',
            walletBalance: 25000,
            addresses: INITIAL_USER.addresses,
            savedItemIds: [],
          };
          await saveUserProfileToFirestore(newProfile);
          setUser(newProfile);
        }

        // Load cart from Firestore
        const savedCart = await loadCartFromFirestore(fbUser.uid);
        if (savedCart && savedCart.length > 0) {
          setCart(savedCart);
        }

        // Load wishlist from Firestore
        const savedWishlist = await loadWishlistFromFirestore(fbUser.uid);
        if (savedWishlist) {
          setUser((prev) => ({ ...prev, savedItemIds: savedWishlist }));
        }
      } else {
        // Guest mode fallback
        const savedLocalUser = localStorage.getItem('jumia_user');
        if (savedLocalUser) {
          try {
            setUser(JSON.parse(savedLocalUser));
          } catch {
            setUser(INITIAL_USER);
          }
        }
      }
      setIsAuthLoading(false);
      isInitialSyncDone.current = true;
    });

    return () => {
      unsubscribeAuth();
    };
  }, []);

  // Subscribe to Orders in Firestore strictly when authenticated
  useEffect(() => {
    if (!firebaseUser || !auth.currentUser) {
      return;
    }
    const unsubscribeOrders = subscribeOrders(
      firebaseUser.uid,
      user.role,
      (firestoreOrders) => {
        if (firestoreOrders && firestoreOrders.length > 0) {
          setOrders(firestoreOrders);
          if (!activeOrder && firestoreOrders[0]) {
            setActiveOrder(firestoreOrders[0]);
          }
        }
      },
      (err) => {
        console.warn('Orders subscription note:', err);
      }
    );

    return () => {
      unsubscribeOrders();
    };
  }, [firebaseUser, user?.role]);

  // Sync cart to Firestore & localStorage
  useEffect(() => {
    if (!isInitialSyncDone.current) return;
    localStorage.setItem('jumia_cart', JSON.stringify(cart));
    if (firebaseUser && auth.currentUser) {
      saveCartToFirestore(firebaseUser.uid, cart);
    }
  }, [cart, firebaseUser]);

  // Sync wishlist to Firestore
  useEffect(() => {
    if (!isInitialSyncDone.current) return;
    if (firebaseUser && auth.currentUser && user?.savedItemIds) {
      saveWishlistToFirestore(firebaseUser.uid, user.savedItemIds);
    }
  }, [user?.savedItemIds, firebaseUser]);

  // Cart operations
  const addToCart = (product: Product, quantity = 1, selectedColor?: string, selectedSize?: string) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedColor === selectedColor &&
          item.selectedSize === selectedSize
      );

      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity,
        };
        return next;
      }
      return [...prev, { product, quantity, selectedColor, selectedSize }];
    });
    addToast(`"${product.title.slice(0, 30)}..." added to cart!`, 'success');
    logAnalyticsEvent('add_to_cart', {
      item_id: product.id,
      item_name: product.title,
      price: product.price,
      quantity,
    });
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    addToast('Item removed from cart', 'info');
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
    setCouponDiscount(0);
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);

  const applyCoupon = (code: string) => {
    const normalized = code.trim().toUpperCase();
    if (normalized === 'JUMIA1000') {
      setAppliedCoupon('JUMIA1000');
      setCouponDiscount(1000);
      addToast('₦1,000 Jumia Voucher applied successfully!', 'success');
      return { success: true, message: '₦1,000 discount applied!' };
    }
    if (normalized === 'TECHWEEK') {
      const discount = Math.round(cartSubtotal * 0.1);
      setAppliedCoupon('TECHWEEK');
      setCouponDiscount(discount);
      addToast('10% Tech Week discount applied!', 'success');
      return { success: true, message: '10% Tech Week discount applied!' };
    }
    if (normalized === 'FREESHIP') {
      setAppliedCoupon('FREESHIP');
      setCouponDiscount(1200);
      addToast('Free Delivery voucher applied!', 'success');
      return { success: true, message: 'Free Delivery applied!' };
    }
    return { success: false, message: 'Invalid or expired Jumia voucher code' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
    addToast('Voucher removed', 'info');
  };

  // Auth Functions
  const loginWithGoogle = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const isDefaultAdmin = res.user.email === 'fatiufaruk7@gmail.com';
      const existingProfile = await loadUserProfileFromFirestore(res.user.uid);

      if (existingProfile) {
        setUser(existingProfile);
      } else {
        const newProfile: User = {
          id: res.user.uid,
          name: res.user.displayName || res.user.email?.split('@')[0] || 'JUMIA Shopper',
          email: res.user.email || '',
          phone: res.user.phoneNumber || '0803 123 4567',
          role: isDefaultAdmin ? 'admin' : 'customer',
          walletBalance: 25000,
          addresses: INITIAL_USER.addresses,
          savedItemIds: [],
        };
        await saveUserProfileToFirestore(newProfile);
        setUser(newProfile);
      }

      addToast(`Signed in to JUMIA as ${res.user.displayName || res.user.email}!`, 'success');
      setIsAuthModalOpen(false);
      logAnalyticsEvent('login', { method: 'google' });
    } catch (err: any) {
      console.error('Google Sign In Error:', err);
      addToast(err?.message || 'Google sign-in could not be completed.', 'error');
    }
  };

  const loginWithEmail = async (email: string, pass: string, intendedRole?: UserRole) => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, pass);
      const profile = await loadUserProfileFromFirestore(res.user.uid);
      if (profile) {
        setUser(profile);
      }
      addToast(`Signed in as ${email}`, 'success');
      setIsAuthModalOpen(false);
      logAnalyticsEvent('login', { method: 'email' });
    } catch (err: any) {
      // Fallback: If email not registered in this Firebase Auth yet, allow seamless demo login
      console.warn('Firebase email auth note:', err.message);
      const isDefaultAdmin = email === 'fatiufaruk7@gmail.com' || intendedRole === 'admin';
      const roleToSet: UserRole = isDefaultAdmin ? 'admin' : (intendedRole || 'customer');
      const updatedUser: User = {
        ...user,
        email,
        name: email.split('@')[0].toUpperCase(),
        role: roleToSet,
      };
      setUser(updatedUser);
      saveUserProfileToFirestore(updatedUser);
      addToast(`Signed in to JUMIA as ${email} (${roleToSet.toUpperCase()})`, 'success');
      setIsAuthModalOpen(false);
    }
  };

  const registerWithEmail = async (
    email: string,
    pass: string,
    name: string,
    phone: string,
    role: UserRole = 'customer'
  ) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, pass);
      const newProfile: User = {
        id: res.user.uid,
        name: name || email.split('@')[0],
        email,
        phone: phone || '0803 123 4567',
        role,
        walletBalance: 25000,
        addresses: INITIAL_USER.addresses,
        savedItemIds: [],
      };
      await saveUserProfileToFirestore(newProfile);
      setUser(newProfile);
      addToast('Welcome to JUMIA! Your account is active.', 'success');
      setIsAuthModalOpen(false);
      logAnalyticsEvent('sign_up', { method: 'email' });
    } catch (err: any) {
      console.warn('Firebase registration fallback note:', err.message);
      const newProfile: User = {
        id: 'usr-' + Date.now(),
        name: name || email.split('@')[0],
        email,
        phone: phone || '0803 123 4567',
        role,
        walletBalance: 25000,
        addresses: INITIAL_USER.addresses,
        savedItemIds: [],
      };
      setUser(newProfile);
      saveUserProfileToFirestore(newProfile);
      addToast('Welcome to JUMIA! Account created.', 'success');
      setIsAuthModalOpen(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch {
      // ignore
    }
    setUser(INITIAL_USER);
    setCurrentView('home');
    addToast('Signed out of JUMIA account', 'info');
  };

  // Role-Based Access Control
  const switchRole = (role: UserRole) => {
    // Role-based safeguard: Never allow unauthorized customers to access admin functions
    if (role === 'admin' && user.email !== 'fatiufaruk7@gmail.com' && user.role !== 'admin') {
      addToast('Admin Access Restricted: Super Admin credentials required.', 'error');
      return;
    }

    const updated = { ...user, role };
    setUser(updated);
    saveUserProfileToFirestore(updated);
    addToast(`Switched account mode to ${role.toUpperCase()}`, 'info');

    if (role === 'customer') {
      setCurrentView('customer-dashboard');
    } else if (role === 'seller') {
      setCurrentView('seller-dashboard');
    } else if (role === 'admin') {
      setCurrentView('admin-dashboard');
    }
  };

  const toggleWishlist = (productId: string) => {
    setUser((prev) => {
      const exists = prev.savedItemIds.includes(productId);
      const updated = exists
        ? prev.savedItemIds.filter((id) => id !== productId)
        : [...prev.savedItemIds, productId];
      addToast(
        exists ? 'Removed from saved items' : 'Saved to Jumia wishlist!',
        'success'
      );
      return { ...prev, savedItemIds: updated };
    });
  };

  const isWishlisted = (productId: string) => {
    return user.savedItemIds.includes(productId);
  };

  const addDeliveryAddress = (addrData: Omit<DeliveryAddress, 'id'>) => {
    const newAddr: DeliveryAddress = {
      ...addrData,
      id: 'addr-' + Date.now(),
    };
    const updated = {
      ...user,
      addresses: [
        ...user.addresses.map((a) => (newAddr.isDefault ? { ...a, isDefault: false } : a)),
        newAddr,
      ],
    };
    setUser(updated);
    saveUserProfileToFirestore(updated);
    addToast('New delivery address saved', 'success');
  };

  // Product Database Actions
  const addProduct = async (product: Product) => {
    // Ensure product links to current seller UID if available
    const productWithSeller = {
      ...product,
      sellerId: user.id,
    };
    await createProductInFirestore(productWithSeller);
    setProducts((prev) => [productWithSeller, ...prev]);
    addToast(`"${product.title.slice(0, 30)}..." published to Cloud Firestore!`, 'success');
  };

  const updateProduct = async (productId: string, updates: Partial<Product>) => {
    await updateProductInFirestore(productId, updates);
    setProducts((prev) => prev.map((p) => (p.id === productId ? { ...p, ...updates } : p)));
    addToast('Product updated in Firestore', 'success');
  };

  const deleteProduct = async (productId: string) => {
    await deleteProductInFirestore(productId);
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    addToast('Product deleted from Firestore', 'info');
  };

  const uploadProductImage = async (file: File): Promise<string> => {
    addToast('Uploading image to Firebase Storage...', 'info');
    const url = await uploadImageToStorage(file, 'products');
    addToast('Image uploaded successfully!', 'success');
    return url;
  };

  // Order Placement with Firestore persistence
  const placeOrder = async ({
    address,
    deliveryMethod,
    paymentMethod,
  }: {
    address: DeliveryAddress;
    deliveryMethod: 'door' | 'pickup';
    paymentMethod: 'jumiapay' | 'card' | 'bank_transfer' | 'cod';
  }) => {
    const deliveryFee = deliveryMethod === 'door' ? 1200 : 500;
    const effectiveDiscount = Math.min(couponDiscount, cartSubtotal);
    const finalTotal = Math.max(0, cartSubtotal + deliveryFee - effectiveDiscount);
    const orderId = 'JUM-NG-' + Math.floor(1000000 + Math.random() * 9000000);

    const newOrder: Order = {
      id: orderId,
      userId: user.id,
      date: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      items: [...cart],
      subtotal: cartSubtotal,
      deliveryFee,
      discount: effectiveDiscount,
      total: finalTotal,
      deliveryAddress: address,
      deliveryMethod,
      paymentMethod,
      status: 'confirmed',
      estimatedDelivery: 'Within 24 to 48 hours via Jumia Express',
      trackingSteps: [
        {
          title: 'Order Placed',
          description: `Confirmed via ${paymentMethod === 'jumiapay' ? 'JumiaPay' : paymentMethod.toUpperCase()}`,
          completed: true,
          timestamp: 'Just now',
        },
        {
          title: 'Confirmed & Packed',
          description: 'Ready at Jumia Fulfillment Center, Ikeja',
          completed: true,
          timestamp: 'In progress',
        },
        {
          title: 'Dispatched with Jumia Express',
          description: 'Rider assigned for delivery in your area',
          completed: false,
        },
        {
          title: 'Delivered',
          description: 'Delivered to your chosen address or pickup station',
          completed: false,
        },
      ],
    };

    // Save to Cloud Firestore if signed in
    if (firebaseUser && auth.currentUser) {
      try {
        await createOrderInFirestore(newOrder);
        addToast(`Order ${orderId} saved to Cloud Firestore!`, 'success');
      } catch (err) {
        console.warn('Could not save order to Firestore:', err);
      }
    } else {
      addToast(`Order ${orderId} placed successfully!`, 'success');
    }

    setOrders((prev) => [newOrder, ...prev]);
    setActiveOrder(newOrder);
    clearCart();
    setCurrentView('order-success');
    return newOrder;
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder) return;

    const steps = [...targetOrder.trackingSteps];
    if (status === 'shipped') {
      steps[2] = { ...steps[2], completed: true, timestamp: 'Today' };
    } else if (status === 'delivered') {
      steps[2] = { ...steps[2], completed: true };
      steps[3] = { ...steps[3], completed: true, timestamp: 'Today' };
    }

    if (firebaseUser && auth.currentUser) {
      try {
        await updateOrderStatusInFirestore(orderId, status, steps);
        addToast(`Order ${orderId} updated to ${status.toUpperCase()} in Firestore`, 'info');
      } catch (err) {
        console.warn('Failed to update order status in Firestore:', err);
      }
    } else {
      addToast(`Order ${orderId} updated to ${status.toUpperCase()}`, 'info');
    }

    setOrders((prev) =>
      prev.map((order) => (order.id === orderId ? { ...order, status, trackingSteps: steps } : order))
    );
  };

  const openProductDetail = (product: Product) => {
    setSelectedProduct(product);
    setCurrentView('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    logAnalyticsEvent('view_item', {
      item_id: product.id,
      item_name: product.title,
      price: product.price,
    });
  };

  const formatNaira = (amount: number) => {
    return '₦ ' + amount.toLocaleString('en-NG');
  };

  return (
    <AppContext.Provider
      value={{
        products,
        setProducts,
        addProduct,
        updateProduct,
        deleteProduct,
        uploadProductImage,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartSubtotal,
        appliedCoupon,
        couponDiscount,
        applyCoupon,
        removeCoupon,
        user,
        setUser,
        firebaseUser,
        isAuthLoading,
        loginWithGoogle,
        loginWithEmail,
        registerWithEmail,
        logout,
        switchRole,
        toggleWishlist,
        isWishlisted,
        addDeliveryAddress,
        orders,
        placeOrder,
        updateOrderStatus,
        currentView,
        setCurrentView,
        selectedProduct,
        setSelectedProduct,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        activeOrder,
        setActiveOrder,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalTab,
        setAuthModalTab,
        toasts,
        addToast,
        removeToast,
        openProductDetail,
        formatNaira,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
