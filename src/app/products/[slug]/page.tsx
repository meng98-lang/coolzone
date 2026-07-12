import { products } from '@/lib/products';
import { notFound } from 'next/navigation';
import { ProductDetail } from './product-detail';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return products.map((product) => ({
    slug: product.id,
  }));
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = products.find((p) => p.id === slug);
  if (!product) return { title: 'Product Not Found' };
  return {
    title: `${product.name} - CoolZone Premium Air Conditioning`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [{ url: product.image, width: 1024, height: 768 }],
      type: 'website',
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = products.find((p) => p.id === slug);

  if (!product) {
    notFound();
  }

  // JSON-LD structured data for product
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
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'Cooling Capacity',
        value: product.coolingCapacity,
      },
      {
        '@type': 'PropertyValue',
        name: 'Energy Class',
        value: product.energyClass,
      },
      {
        '@type': 'PropertyValue',
        name: 'Noise Level',
        value: product.noiseLevel,
      },
      {
        '@type': 'PropertyValue',
        name: 'Coverage Area',
        value: product.specs['Room Size'] || 'N/A',
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetail product={product} />
    </>
  );
}
