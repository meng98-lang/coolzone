import { products } from '@/lib/products';
import { notFound } from 'next/navigation';
import { ProductDetail } from '@/app/products/[slug]/product-detail';
import { getTranslations } from '@/i18n/translations';
import { locales, primaryLocales, type Locale } from '@/i18n/config';
import { Suspense } from 'react';

interface ProductPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  const paramsList: Array<{ locale: string; slug: string }> = [];
  for (const locale of primaryLocales) {
    for (const product of products) {
      paramsList.push({ locale, slug: product.id });
    }
  }
  return paramsList;
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { locale, slug } = await params;
  const product = products.find((p) => p.id === slug);
  if (!product) return { title: 'Product Not Found' };
  
  const t = getTranslations(locale as Locale);
  const baseUrl = process.env.COZE_PROJECT_DOMAIN_DEFAULT ? `https://${process.env.COZE_PROJECT_DOMAIN_DEFAULT}` : 'https://coolzone.vercel.app';

  return {
    title: `${product.name} - CoolZone`,
    description: product.description,
    keywords: `${t['seo.keywords']}, ${product.name}, ${product.category}, ${product.coolingCapacity} BTU`,
    alternates: {
      canonical: `${baseUrl}/${locale}/products/${slug}`,
      languages: Object.fromEntries(
        locales.map((l) => [l, `${baseUrl}/${l}/products/${slug}`])
      ),
    },
    openGraph: {
      title: product.name,
      description: product.description,
      locale: locale.toUpperCase(),
      images: [{ url: product.image, width: 1024, height: 768 }],
      type: 'website',
      siteName: 'CoolZone',
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { locale, slug } = await params;
  const product = products.find((p) => p.id === slug);

  if (!product) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images || [product.image],
    description: product.description,
    brand: {
      '@type': 'Brand',
      name: 'CoolZone',
    },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'EUR',
      availability: product.inStock !== false ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
        <ProductDetail product={product} locale={locale as Locale} />
      </Suspense>
    </>
  );
}
