
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem, CartContextType, ShippingOption, AddressInfo } from './types';

const CartContext = createContext<CartContextType | undefined>(undefined);

const INITIAL_ADDRESS: AddressInfo = {
  logradouro: '',
  bairro: '',
  localidade: '',
  uf: '',
  numero: '',
  complemento: '',
  destinatario: ''
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('bleeshop-cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [notification, setNotification] = useState<string | null>(null);
  const [selectedShipping, setSelectedShipping] = useState<ShippingOption | null>(null);
  const [cep, setCep] = useState(() => localStorage.getItem('bleeshop-cep') || '');
  const [address, setAddress] = useState<AddressInfo>(() => {
    const saved = localStorage.getItem('bleeshop-address');
    return saved ? JSON.parse(saved) : INITIAL_ADDRESS;
  });

  useEffect(() => {
    localStorage.setItem('bleeshop-cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('bleeshop-cep', cep);
  }, [cep]);

  useEffect(() => {
    localStorage.setItem('bleeshop-address', JSON.stringify(address));
  }, [address]);

  const triggerNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    triggerNotification(`${product.name} adicionado à colmeia!`);
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity < 1) return;
    setCart(prev => prev.map(item =>
      item.id === productId ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => {
    setCart([]);
    setSelectedShipping(null);
    triggerNotification("Colmeia limpa.");
  };

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount, notification,
      selectedShipping, setSelectedShipping, cep, setCep, address, setAddress
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
