import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: number | string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
  color?: string; 
  size?: string; 
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: any, quantity?: number) => void;
  updateQuantity: (id: number | string, delta: number) => void; 
  removeFromCart: (id: number | string) => void; 
  clearCart: () => void; // THÊM MỚI
  totalItems: number; 
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product: any, quantity: number = 1) => {
    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(item => item.id === product.id);
      if (existingItemIndex >= 0) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantity;
        return updatedItems;
      } else {
        const newItem: CartItem = {
          id: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl || product.image || "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=600",
          quantity: quantity,
          color: product.color || 'Mặc định', 
          size: product.size || 'Tiêu chuẩn'
        };
        return [...prevItems, newItem];
      }
    });
    alert(`Đã thêm ${product.name} vào giỏ hàng!`); 
  };

  const updateQuantity = (id: number | string, delta: number) => {
    setCartItems(prevItems =>
      prevItems.map(item => {
        if (item.id === id) {
          const newQuantity = item.quantity + delta;
          return { ...item, quantity: Math.max(1, newQuantity) };
        }
        return item;
      })
    );
  };

  const removeFromCart = (id: number | string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  // --- HÀM CLEAR CART MỚI ---
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
  };

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, updateQuantity, removeFromCart, clearCart, totalItems }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};