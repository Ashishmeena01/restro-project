import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/components/cart/CartContext';
import { LanguageProvider } from '@/lib/i18n/LanguageContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'वृंदावन शुद्ध शाकाहारी स्वीट्स & कैफ़े | QR Menu, Ordering & Pay',
  description:
    'Scan QR, browse authentic Indian street food and pure desi ghee sweets, order directly to your table, and pay online with instant digital receipts.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hi" className="h-full">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <script src="https://checkout.razorpay.com/v1/checkout.js" async />
      </head>
      <body className={`${inter.className} min-h-full flex flex-col bg-white text-black`}>
        <LanguageProvider>
          <CartProvider>{children}</CartProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
