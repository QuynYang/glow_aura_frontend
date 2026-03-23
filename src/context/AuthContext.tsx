import React, { createContext, useContext, useState, useEffect } from 'react';
// Định nghĩa kiểu dữ liệu User
export interface User {
  id?: number;
  email: string;
  role: string;
  fullName: string;
  vipLevel: number|String; // 0: None, 1: Bronze, 2: Silver, 3: Gold, 4: Platinum
  phoneNumber?: string; 
  address?: string;     
  gender?: string;      
  dateOfBirth?: string; 
  avatarUrl?: string;   
}

// Định nghĩa Context
interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);


export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // Khi web vừa tải, kiểm tra xem trong kho (localStorage) có user chưa
  useEffect(() => {
    const storedUser = localStorage.getItem('glow_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Hàm Đăng nhập
  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('glow_user', JSON.stringify(userData)); 
  };

  // Hàm Đăng xuất
  const logout = () => {
    setUser(null);
    localStorage.removeItem('glow_user');
    localStorage.removeItem('accessToken');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook để các component khác dễ dàng gọi
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};