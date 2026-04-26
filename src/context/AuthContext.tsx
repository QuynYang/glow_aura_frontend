import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

export interface User {
  id?: number;
  email: string;
  role: string;
  fullName: string;
  vipLevel: number | string;
  phoneNumber?: string;
  address?: string;
  gender?: string;
  dateOfBirth?: string;
  avatarUrl?: string;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function readStoredUser(): User | null {
  const raw = localStorage.getItem('user') || localStorage.getItem('glow_user');
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => readStoredUser());

  useEffect(() => {
    setUser(readStoredUser());
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    const json = JSON.stringify(userData);
    localStorage.setItem('user', json);
    localStorage.setItem('glow_user', json);
  };

  const logout = () => {
    setUser(null);
    void authService.logout();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};