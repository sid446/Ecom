// FILE: app/layout.tsx

import type { Metadata } from 'next';
import { Kalnia } from 'next/font/google'; // Import Kalnia
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { ProductsProvider} from '@/context/ProductContext';
import { UserProvider } from '@/context/UserContext';

// Configure the Kalnia font to be used as a CSS variable
const kalnia = Kalnia({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-kalnia', // We are creating a variable named --font-kalnia
});

export const metadata: Metadata = {
  title: 'Kashé',
  description: 'something you will love',
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
        <UserProvider>
        <ProductsProvider cacheStrategy="session" cacheDuration={30}>
          <CartProvider>{children}</CartProvider>
        </ProductsProvider>
        </UserProvider>
      </body>
    </html>
  );
}