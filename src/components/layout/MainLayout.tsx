import { Header } from './Header';
import { Footer } from './Footer';
import type { ReactNode } from 'react';

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-900">
      {/* Header  */}
      <Header />
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer  */}
      <Footer />
    </div>
  );
};