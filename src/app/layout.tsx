import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/lib/store';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { CartSidebar } from '@/components/cart-sidebar';
import { WhatsAppFloat } from '@/components/whatsapp-float';

export const metadata: Metadata = {
  title: {
    default: 'CoolZone - Premium Air Conditioning for Europe',
    template: '%s | CoolZone',
  },
  description:
    'Shop premium air conditioning units for your home. Energy-efficient wall-mounted, portable, and central AC systems with free EU delivery.',
  keywords: ['air conditioning', 'AC', 'cooling', 'Europe', 'energy efficient', 'inverter', 'smart AC'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-white text-gray-900">
        <CartProvider>
          <Header />
          <CartSidebar />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <WhatsAppFloat />
        </CartProvider>
      </body>
    </html>
  );
}
