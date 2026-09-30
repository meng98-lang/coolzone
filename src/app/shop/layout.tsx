import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'GSJ Outdoor Tech | Premium Performance Compounds',
  description:
    'Premium performance compounds — Testosterone, HGH, Peptides and more. Secure checkout, discreet worldwide shipping. Contact us on WhatsApp for the full price list.',
};

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-[#0a0a0c]">{children}</div>;
}