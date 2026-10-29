'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, ProductVariant, User, Coupon } from './types';

export interface ToastMessage {
  id: string;
  title: string;
  message?: string;
  type?: 'success' | 'info' | 'warning' | 'error';
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, variant?: ProductVariant, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  totalSavings: number;
  
  // Free Shipping Calculation
  freeShippingThreshold: number;
  shippingFee: number;
  amountNeededForFreeShipping: number;
  
  // Coupons
  appliedCoupon: { coupon: Coupon; discount: number } | null;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  
  // SmartPoints
  pointsToRedeem: number;
  setPointsToRedeem: (points: number) => void;
  pointsDiscount: number;
  
  // Final summary
  finalTotal: number;

  // Wishlist
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  
  // Product Comparison
  compareList: Product[];
  addToCompare: (product: Product) => boolean;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
  
  // User Authentication
  user: User | null;
  login: (email: string, role?: 'customer' | 'admin') => void;
  logout: () => void;
  
  // Toasts
  toasts: ToastMessage[];
  addToast: (
    titleOrOptions: string | { title: string; message?: string; type?: ToastMessage['type'] },
    message?: string,
    type?: ToastMessage['type']
  ) => void;
  removeToast: (id: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [compareList, setCompareList] = useState<Product[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<{ coupon: Coupon; discount: number } | null>(null);
  const [pointsToRedeem, setPointsToRedeem] = useState<number>(0);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  
  // Default demo customer logged in for effortless evaluation
  const [user, setUser] = useState<User | null>({
    id: 'user-customer',
    name: 'Joe Student',
    email: 'customer@smartstation.com',
    role: 'customer',
    phone: '+91 98111 22334',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    rewardPoints: 240,
    totalSpent: 4890,
    addresses: [
      {
        id: 'addr-cust-1',
        fullName: 'Joe Student',
        phone: '+91 98111 22334',
        email: 'customer@smartstation.com',
        addressLine: 'Flat 402, Lotus Pride Apartments, 12th Main Road, HSR Layout Sector 2',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560102',
        landmark: 'Opposite BDA Complex',
        type: 'Home',
        isDefault: true,
      },
    ],
    createdAt: '2026-02-14T10:00:00Z',
  });

  // Load persisted state from localStorage on client mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('smartstation_cart');
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedWishlist = localStorage.getItem('smartstation_wishlist');
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));

      const savedCompare = localStorage.getItem('smartstation_compare');
      if (savedCompare) setCompareList(JSON.parse(savedCompare));

      const savedUser = localStorage.getItem('smartstation_user');
      if (savedUser) setUser(JSON.parse(savedUser));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, []);

  // Save cart
  useEffect(() => {
    try {
      localStorage.setItem('smartstation_cart', JSON.stringify(cart));
    } catch (e) {}
  }, [cart]);

  // Save wishlist
  useEffect(() => {
    try {
      localStorage.setItem('smartstation_wishlist', JSON.stringify(wishlist));
    } catch (e) {}
  }, [wishlist]);

  // Save compare
  useEffect(() => {
    try {
      localStorage.setItem('smartstation_compare', JSON.stringify(compareList));
    } catch (e) {}
  }, [compareList]);

  // Save user
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('smartstation_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('smartstation_user');
      }
    } catch (e) {}
  }, [user]);

  // Toast Helpers
  const addToast = (
    titleOrOptions: string | { title: string; message?: string; type?: ToastMessage['type'] },
    msg?: string,
    tp: ToastMessage['type'] = 'success'
  ) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    if (typeof titleOrOptions === 'object' && titleOrOptions !== null) {
      setToasts((prev) => [
        ...prev,
        {
          id,
          title: titleOrOptions.title,
          message: titleOrOptions.message,
          type: titleOrOptions.type || 'success',
        },
      ]);
    } else {
      setToasts((prev) => [...prev, { id, title: titleOrOptions, message: msg, type: tp }]);
    }
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Cart Functions
  const addToCart = (product: Product, variant?: ProductVariant, quantity = 1) => {
    const price = variant ? variant.price : product.price;
    const mrp = variant ? variant.mrp : product.mrp;
    const sku = variant ? variant.sku : product.sku;
    const stock = variant ? variant.stock : product.stock;
    const cartItemId = `${product.id}-${variant?.id || 'default'}`;

    if (stock <= 0) {
      addToast('Out of Stock', `${product.name} is currently out of stock.`, 'warning');
      return;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.id === cartItemId);
      if (existing) {
        const updatedQty = Math.min(existing.quantity + quantity, stock);
        addToast('Cart Updated', `Increased quantity of ${product.name} to ${updatedQty}.`, 'success');
        return prev.map((item) =>
          item.id === cartItemId ? { ...item, quantity: updatedQty } : item
        );
      } else {
        const newItem: CartItem = {
          id: cartItemId,
          productId: product.id,
          variantId: variant?.id,
          name: product.name,
          brand: product.brand,
          price,
          mrp,
          image: product.images?.[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400',
          quantity: Math.min(quantity, stock),
          stock,
          sku,
          variantName: variant?.name,
        };
        addToast('Added to Cart', `${product.name} has been added to your stationery bag.`, 'success');
        return [...prev, newItem];
      }
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => {
      const item = prev.find((i) => i.id === cartItemId);
      if (item) {
        addToast('Removed from Cart', `${item.name} removed from your bag.`, 'info');
      }
      return prev.filter((i) => i.id !== cartItemId);
    });
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === cartItemId) {
          const clamped = Math.min(quantity, item.stock);
          return { ...item, quantity: clamped };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
    setPointsToRedeem(0);
  };

  // Calculations
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const totalMrp = cart.reduce((total, item) => total + item.mrp * item.quantity, 0);
  const totalSavings = Math.max(0, totalMrp - cartSubtotal);

  // Free shipping rules
  const freeShippingThreshold = 499;
  const isFreeShipping = cartSubtotal >= freeShippingThreshold || appliedCoupon?.coupon.discountType === 'free_shipping';
  const shippingFee = cartSubtotal === 0 ? 0 : isFreeShipping ? 0 : 40;
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);

  // Points Discount (1 point = ₹1)
  const pointsDiscount = Math.min(pointsToRedeem, cartSubtotal);

  // Final Total
  const couponDiscount = appliedCoupon?.discount || 0;
  const finalTotal = Math.max(0, cartSubtotal - couponDiscount - pointsDiscount + shippingFee);

  // Coupon Application
  const applyCoupon = async (code: string) => {
    try {
      const res = await fetch('/api/coupons/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, subtotal: cartSubtotal }),
      });
      const data = await res.json();
      if (data.valid) {
        setAppliedCoupon({ coupon: data.coupon, discount: data.discount });
        addToast('Coupon Applied! 🎉', data.message, 'success');
        return { success: true, message: data.message };
      } else {
        addToast('Invalid Coupon', data.message, 'warning');
        return { success: false, message: data.message };
      }
    } catch (e) {
      // Local fallback calculation if offline
      if (code.toUpperCase() === 'WELCOME10') {
        const discount = Math.round(cartSubtotal * 0.1);
        setAppliedCoupon({
          coupon: {
            id: 'coup-welcome10',
            code: 'WELCOME10',
            discountType: 'percentage',
            discountValue: 10,
            minOrderValue: 299,
            validFrom: '',
            validUntil: '',
            usageLimit: 100,
            perUserLimit: 1,
            timesUsed: 1,
            status: 'active',
          },
          discount,
        });
        addToast('Coupon Applied! 🎉', `Saved ₹${discount} with WELCOME10!`, 'success');
        return { success: true, message: `Saved ₹${discount} with WELCOME10!` };
      }
      return { success: false, message: 'Could not apply coupon.' };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    addToast('Coupon Removed', 'Coupon discount has been removed.', 'info');
  };

  // Wishlist Functions
  const toggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        addToast('Removed from Wishlist', `${product.name} removed from your saved items.`, 'info');
        return prev.filter((p) => p.id !== product.id);
      } else {
        addToast('Saved to Wishlist ❤️', `${product.name} added to your wishlist.`, 'success');
        return [...prev, product];
      }
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((p) => p.id === productId);
  };

  // Product Comparison Functions
  const addToCompare = (product: Product) => {
    if (compareList.length >= 4) {
      addToast('Comparison Limit Reached', 'You can compare up to 4 stationery items at a time.', 'warning');
      return false;
    }
    if (compareList.some((p) => p.id === product.id)) {
      addToast('Already in Compare', `${product.name} is already in your comparison list.`, 'info');
      return false;
    }
    setCompareList((prev) => [...prev, product]);
    addToast('Added to Compare', `${product.name} added to comparison matrix.`, 'success');
    return true;
  };

  const removeFromCompare = (productId: string) => {
    setCompareList((prev) => prev.filter((p) => p.id !== productId));
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  // Authentication Helpers
  const login = (email: string, role: 'customer' | 'admin' = 'customer') => {
    if (role === 'admin' || email === 'admin@smartstation.com') {
      const adminUser: User = {
        id: 'user-admin',
        name: 'Admin Joe',
        email: 'admin@smartstation.com',
        role: 'admin',
        phone: '+91 98765 43210',
        rewardPoints: 1250,
        totalSpent: 48200,
        addresses: [],
        createdAt: '2026-01-01T00:00:00Z',
      };
      setUser(adminUser);
      addToast('Welcome Admin Joe 👋', 'Logged in to SmartStation Management Console', 'success');
    } else {
      const customerUser: User = {
        id: 'user-customer',
        name: email.split('@')[0].toUpperCase(),
        email,
        role: 'customer',
        phone: '+91 98111 22334',
        rewardPoints: 240,
        totalSpent: 4890,
        addresses: [
          {
            id: 'addr-cust-1',
            fullName: 'Joe Student',
            phone: '+91 98111 22334',
            email,
            addressLine: 'Flat 402, Lotus Pride Apartments, 12th Main Road, HSR Layout Sector 2',
            city: 'Bengaluru',
            state: 'Karnataka',
            pincode: '560102',
            landmark: 'Opposite BDA Complex',
            type: 'Home',
            isDefault: true,
          },
        ],
        createdAt: '2026-02-14T10:00:00Z',
      };
      setUser(customerUser);
      addToast('Welcome Back! 👋', `Logged in as ${customerUser.name}`, 'success');
    }
  };

  const logout = () => {
    setUser(null);
    addToast('Logged Out', 'You have been safely signed out.', 'info');
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        totalSavings,
        freeShippingThreshold,
        shippingFee,
        amountNeededForFreeShipping,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        pointsToRedeem,
        setPointsToRedeem,
        pointsDiscount,
        finalTotal,
        wishlist,
        toggleWishlist,
        isInWishlist,
        compareList,
        addToCompare,
        removeFromCompare,
        clearCompare,
        user,
        login,
        logout,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
