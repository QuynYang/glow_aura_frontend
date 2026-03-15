import React, { createContext, useContext, useState, useEffect } from 'react';

// Định nghĩa kiểu dữ liệu User
interface User {
  email: string;
  role: 'admin' | 'customer' | 'Admin' | 'User';
  name: string;
  fullName?: string;
}

// Định nghĩa Context
interface AuthContextType {
  user: User | null;
  login: (email: string) => void;
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
  const login = (email: string) => {
    let userData: User;

    if (email === 'admin@glowaura.com') {
      userData = { email, role: 'admin', name: 'Admin User' };
    } else {
      userData = { email, role: 'customer', name: 'Nguyễn Văn A' }; 
    }

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