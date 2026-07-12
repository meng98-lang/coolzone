import { notFound } from 'next/navigation';
import { locales, defaultLocale, type Locale } from '@/i18n/config';
import { getTranslations } from '@/i18n/translations';
import { CartProvider } from '@/lib/store';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { WhatsAppFloat } from '@/components/whatsapp-float';
import { TrackingScripts } from '@/components/tracking-scripts';
import { TrafficTracker } from '@/components/traffic-tracker';
import { LanguageProvider } from '@/i18n/language-context';
import { Suspense } from 'react';

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = getTranslations(locale as Locale);
  const baseUrl = process.env.COZE_PROJECT_DOMAIN_DEFAULT || 'https://coolzone.eu';

  return {
    title: {
      default: t['seo.siteName'],
      template: `%s | CoolZone`,
    },
    description: t['seo.description'],
    keywords: t['seo.keywords'],
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: Object.fromEntries(
        locales.map((l) => [l, `${baseUrl}/${l}`])
      ),
    },
    openGraph: {
      title: t['seo.siteName'],
      description: t['seo.description'],
      locale: locale.toUpperCase(),
      type: 'website',
      siteName: 'CoolZone',
    },
    twitter: {
      card: 'summary_large_image',
      title: t['seo.siteName'],
      description: t['seo.description'],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const translations = getTranslations(locale as Locale);

  return (
    <html lang={locale}>
      <body className="min-h-screen flex flex-col">
        <LanguageProvider locale={locale as Locale} translations={translations}>
          <CartProvider>
            <Header locale={locale as Locale} />
            <main className="flex-1">{children}</main>
            <Footer locale={locale as Locale} />
            <WhatsAppFloat />
            <TrackingScripts />
            <Suspense fallback={null}>
              <TrafficTracker />
            </Suspense>
          </CartProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
