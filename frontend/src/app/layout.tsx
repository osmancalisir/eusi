// frontend/src/app/layout.tsx

import { Inter } from 'next/font/google';
import './globals.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
          <main className="flex-grow container mx-auto px-4 py-8">
            {children}
          </main>
          <ToastContainer position="bottom-right" />
      </body>
    </html>
  );
}
