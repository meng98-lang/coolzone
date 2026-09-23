import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Prime Compounds | Testosterone, HGH & Peptides',
  description:
    'Sports and performance line — Testosterone, HGH, Peptides and other compounds. Chat with us on WhatsApp for the full price list.',
  openGraph: {
    title: 'Prime Compounds | Testosterone, HGH & Peptides',
    description:
      'Sports and performance compounds. Get the full price list on WhatsApp.',
    type: 'website',
    siteName: 'Prime Compounds',
  },
};

export default function SportsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
