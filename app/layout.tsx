import type { Metadata } from 'next';
import { Inter, Noto_Sans_Devanagari, Playfair_Display, Tiro_Devanagari_Hindi } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/components/cart/CartContext';
import { LanguageProvider } from '@/lib/i18n/LanguageContext';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const devanagari = Noto_Sans_Devanagari({ subsets: ['devanagari'], variable: '--font-devanagari' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });
const tiro = Tiro_Devanagari_Hindi({ subsets: ['devanagari'], weight: '400', variable: '--font-tiro' });

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
    <html
      lang="hi"
      className={`h-full ${inter.variable} ${devanagari.variable} ${playfair.variable} ${tiro.variable}`}
    >
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <script src="https://checkout.razorpay.com/v1/checkout.js" async />
      </head>
      <body className="font-sans min-h-full flex flex-col bg-slate-50 text-slate-900">
        <LanguageProvider>
          <CartProvider>{children}</CartProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
