// FILE: app/layout.tsx

import type { Metadata } from 'next';
import { Kalnia } from 'next/font/google'; // Import Kalnia
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { ProductsProvider} from '@/context/ProductContext';

// Configure the Kalnia font to be used as a CSS variable
const kalnia = Kalnia({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-kalnia', // We are creating a variable named --font-kalnia
});

export const metadata: Metadata = {
  title: 'Simple Store - E-commerce',
  description: 'Simple e-commerce store built with Next.js and MongoDB',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* Apply the font variable to the entire body tag */}
      <body className={kalnia.variable}>
        <ProductsProvider cacheStrategy="session" cacheDuration={30}>
          <CartProvider>{children}</CartProvider>
        </ProductsProvider>
      </body>
    </html>
  );
}