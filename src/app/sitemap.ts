import { MetadataRoute } from 'next';
import { products } from '@/lib/products';
import { locales, primaryLocales, type Locale } from '@/i18n/config';

export default function sitemap(): MetadataRoute.Sitemap {
  const rawDomain = process.env.COZE_PROJECT_DOMAIN_DEFAULT || 'coolzone.vercel.app';
  const baseUrl = rawDomain.startsWith('http') ? rawDomain : `https://${rawDomain}`;

  // Only generate sitemap entries for primary locales to keep it manageable
  const sitemapLocales = primaryLocales;

  // Static pages with language alternates
  const staticPaths = [
    { path: '', priority: 1, changeFrequency: 'weekly' as const },
    { path: '/products', priority: 0.9, changeFrequency: 'daily' as const },
    { path: '/contact', priority: 0.6, changeFrequency: 'monthly' as const },
  ];

  const staticPages: MetadataRoute.Sitemap = [];
  for (const locale of sitemapLocales) {
    for (const page of staticPaths) {
      const alternates: Record<string, string> = {};
      for (const altLocale of sitemapLocales) {
        alternates[altLocale] = `${baseUrl}/${altLocale}${page.path}`;
      }

      staticPages.push({
        url: `${baseUrl}/${locale}${page.path}`,
        lastModified: new Date(),
        changeFrequency: page.changeFrequency,
        priority: page.priority,
        alternates: {
          languages: alternates,
        },
      });
    }
  }

  // Product pages with language alternates
  const productPages: MetadataRoute.Sitemap = [];
  for (const locale of sitemapLocales) {
    for (const product of products) {
      const alternates: Record<string, string> = {};
      for (const altLocale of sitemapLocales) {
        alternates[altLocale] = `${baseUrl}/${altLocale}/products/${product.id}`;
      }

      productPages.push({
        url: `${baseUrl}/${locale}/products/${product.id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
        alternates: {
          languages: alternates,
        },
      });
    }
  }

  return [...staticPages, ...productPages];
}
