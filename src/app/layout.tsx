import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.COZE_PROJECT_DOMAIN_DEFAULT ? `https://${process.env.COZE_PROJECT_DOMAIN_DEFAULT}` : 'https://coolzone.vercel.app'),
  title: 'CoolZone - Premium Air Conditioning for Europe',
  description: 'Shop premium air conditioning units. Energy-efficient wall-mounted, portable, and central AC systems with free EU delivery.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
