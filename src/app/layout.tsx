import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.COZE_PROJECT_DOMAIN_DEFAULT ? `https://${process.env.COZE_PROJECT_DOMAIN_DEFAULT}` : 'https://coolzone.vercel.app'),
  title: '济南云顶久嘉商贸有限公司',
  description: 'Shop premium air conditioning units. Energy-efficient wall-mounted, portable, and central AC systems with free EU delivery.',
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  );
}