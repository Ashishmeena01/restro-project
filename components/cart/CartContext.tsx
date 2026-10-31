'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  productId: string;
  name: string;
  price: number; // in paise
  quantity: number;
  imageUrl?: string | null;
  isVeg: boolean;
}

interface CartContextType {
  items: CartItem[];
  tableNumber: string | null;
  setTableNumber: (table: string | null) => void;
  addItem: (product: { id: string; name: string; price: number; imageUrl?: string | null; isVeg?: boolean }) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number; // in paise
  tax: number;      // in paise (5%)
  total: number;    // in paise
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [tableNumber, setTableNumber] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedItems = localStorage.getItem('vrindavan_cart');
      const savedTable = localStorage.getItem('vrindavan_table');
      if (savedItems) setItems(JSON.parse(savedItems));
      if (savedTable) setTableNumber(savedTable);
    } catch (e) {
      console.error('Failed to load cart from storage', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('vrindavan_cart', JSON.stringify(items));
      if (tableNumber) {
        localStorage.setItem('vrindavan_table', tableNumber);
      } else {
        localStorage.removeItem('vrindavan_table');
      }
    } catch (e) {
      console.error('Failed to save cart to storage', e);
    }
  }, [items, tableNumber, isLoaded]);

  const addItem = (product: { id: string; name: string; price: number; imageUrl?: string | null; isVeg?: boolean }) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          imageUrl: product.imageUrl,
          isVeg: product.isVeg ?? true,
        },
      ];
    });
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.productId === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = Math.round((subtotal * 5) / 100); // 5% GST
  const total = subtotal + tax;

  return (
    <CartContext.Provider
      value={{
        items,
        tableNumber,
        setTableNumber,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        tax,
        total,
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
