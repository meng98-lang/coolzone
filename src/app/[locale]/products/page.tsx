import { products, categories } from '@/lib/products';
import { ProductCard } from '@/components/product-card';
import { Breadcrumb } from '@/components/breadcrumb';
import { Filter } from 'lucide-react';
import Link from 'next/link';
import { getTranslations } from '@/i18n/translations';
import { locales, type Locale } from '@/i18n/config';

interface ProductsPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = getTranslations(locale as Locale);
  const baseUrl = process.env.COZE_PROJECT_DOMAIN_DEFAULT ? `https://${process.env.COZE_PROJECT_DOMAIN_DEFAULT}` : 'https://coolzone.vercel.app';

  return {
    title: t['products.title'],
    description: t['products.subtitle'],
    keywords: t['seo.keywords'],
    alternates: {
      canonical: `${baseUrl}/${locale}/products`,
      languages: Object.fromEntries(
        locales.map((l) => [l, `${baseUrl}/${l}/products`])
      ),
    },
    openGraph: {
      title: `CoolZone - ${t['products.title']}`,
      description: t['products.subtitle'],
      locale: locale.toUpperCase(),
      type: 'website',
      siteName: 'CoolZone',
    },
  };
}

export default async function ProductsPage({ params, searchParams }: ProductsPageProps) {
  const { locale } = await params;
  const searchP = await searchParams;
  const activeCategory = searchP.category || 'all';
  const t = getTranslations(locale as Locale);

  const filteredProducts =
    activeCategory === 'all'
      ? products
      : products.filter((p) => p.category === activeCategory);

  // Category name translations
  const categoryNames: Record<string, string> = {
    'wall-mounted': t['products.wallMounted'],
    'portable': t['products.portable'],
    'central': t['products.central'],
    'floor-standing': t['products.floorStanding'],
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-3xl font-bold text-gray-900">{t['products.title']}</h1>
          <p className="mt-2 text-gray-500">{t['products.subtitle']}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={[{ label: t['products.title'] }]} locale={locale} />
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-56 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-24">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-4 h-4 text-gray-500" />
                <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                  {t['common.filter']}
                </h2>
              </div>
              <nav className="space-y-1">
                <Link
                  href={`/${locale}/products`}
                  className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeCategory === 'all'
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {t['products.all']}
                  <span className="ml-1.5 text-xs text-gray-400">({products.length})</span>
                </Link>
                {categories.map((cat) => {
                  const count = products.filter((p) => p.category === cat.id).length;
                  const translatedName = categoryNames[cat.id] || cat.name;
                  return (
                    <Link
                      key={cat.id}
                      href={`/${locale}/products?category=${cat.id}`}
                      className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        activeCategory === cat.id
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      {translatedName}
                      <span className="ml-1.5 text-xs text-gray-400">({count})</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-500">
                <span className="font-medium text-gray-900">{filteredProducts.length}</span> {t['products.title'].toLowerCase()}
              </p>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-500">No products found.</p>
                <Link href={`/${locale}/products`} className="mt-4 inline-block text-blue-600 hover:text-blue-700 font-medium text-sm">
                  {t['products.all']}
                </Link>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} locale={locale as Locale} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
