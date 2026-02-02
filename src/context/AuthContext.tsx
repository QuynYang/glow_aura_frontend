
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// 1. Định nghĩa kiểu dữ liệu User
interface User {
  email: string;
  role: 'admin' | 'customer';
  name: string;
}

// 2. Định nghĩa Context
interface AuthContextType {
  user: User | null;
  login: (email: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. Tạo Provider
export const AuthProvider = ({ children }: { children: ReactNode }) => {
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

    // Giả lập logic check role từ Server
    if (email === 'admin@glowaura.com') {
      userData = { email, role: 'admin', name: 'Admin User' };
    } else {
      userData = { email, role: 'customer', name: 'Nguyễn Văn A' }; // Giả lập tên
    }

    setUser(userData);
    localStorage.setItem('glow_user', JSON.stringify(userData)); // Lưu vào ổ cứng trình duyệt
  };

  // Hàm Đăng xuất
  const logout = () => {
    setUser(null);
    localStorage.removeItem('glow_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

// 4. Hook để các component khác dễ dàng gọi
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};