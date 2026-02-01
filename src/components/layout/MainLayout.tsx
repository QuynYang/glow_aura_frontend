import { Header } from './Header';
import { Footer } from './Footer';
import type { ReactNode } from 'react';

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-900">
      {/* Header luôn nằm trên cùng */}
      <Header />
      {/* Phần nội dung thay đổi (HomePage, ProductPage...) sẽ nằm ở đây */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer luôn nằm dưới cùng */}
      <Footer />
    </div>
  );
};