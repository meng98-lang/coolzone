import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/lib/store';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { CartSidebar } from '@/components/cart-sidebar';
import { WhatsAppFloat } from '@/components/whatsapp-float';
import { TrackingScripts } from '@/components/tracking-scripts';
import { TrafficTracker } from '@/components/traffic-tracker';
import { Suspense } from 'react';

export const metadata: Metadata = {
  metadataBase: new URL('https://coolzone.vercel.app'),
  title: {
    default: 'CoolZone - Premium Air Conditioning for Europe | Energy Efficient AC',
    template: '%s | CoolZone',
  },
  description:
    'Shop premium air conditioning units for your home. Energy-efficient wall-mounted, portable, and central AC systems with free EU delivery. Beat the heat with CoolZone.',
  keywords: [
    'air conditioning',
    'AC units',
    'cooling systems',
    'Europe',
    'energy efficient',
    'inverter AC',
    'smart AC',
    'wall mounted AC',
    'portable AC',
    'central air conditioning',
    'home cooling',
    'summer cooling',
    'heat pump',
    'split system',
  ],
  authors: [{ name: 'CoolZone' }],
  creator: 'CoolZone',
  publisher: 'CoolZone',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: 'https://coolzone.vercel.app',
    siteName: 'CoolZone',
    title: 'CoolZone - Premium Air Conditioning for Europe',
    description: 'Shop premium air conditioning units. Energy-efficient wall-mounted, portable, and central AC systems with free EU delivery.',
    images: [
      {
        url: '/products/hero-bg.jpg',
        width: 1200,
        height: 630,
        alt: 'CoolZone Premium Air Conditioning',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CoolZone - Premium Air Conditioning for Europe',
    description: 'Shop premium air conditioning units. Energy-efficient with free EU delivery.',
    images: ['/products/hero-bg.jpg'],
    creator: '@coolzone',
  },
  alternates: {
    canonical: 'https://coolzone.vercel.app',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-white text-gray-900">
        <TrackingScripts />
        <Suspense fallback={null}>
          <TrafficTracker />
        </Suspense>
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
