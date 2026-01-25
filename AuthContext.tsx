
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'client' | 'responsible';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, role: UserRole) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isResponsible: boolean;
  favorites: number[];
  toggleFavorite: (productId: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('blee-user');
    return saved ? JSON.parse(saved) : null;
  });

  const [user, setUser] = useState<User | null>(null);
const [favorites, setFavorites] = useState<number[]>([]);

useEffect(() => {
  const savedUser = localStorage.getItem('blee-user');
  if (savedUser) setUser(JSON.parse(savedUser));

  const savedFav = localStorage.getItem('blee-favorites');
  if (savedFav) setFavorites(JSON.parse(savedFav));
}, []);

  const login = (email: string, role: UserRole) => {
    const name = email.split('@')[0];
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: name.charAt(0).toUpperCase() + name.slice(1),
      email,
      role
    };
    setUser(newUser);
    localStorage.setItem('blee-user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('blee-user');
    setFavorites([]);
  };

  const toggleFavorite = (productId: number) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId) 
        : [...prev, productId]
    );
  };

  const isAuthenticated = !!user;
  const isResponsible = user?.role === 'responsible';

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, isResponsible, favorites, toggleFavorite }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
