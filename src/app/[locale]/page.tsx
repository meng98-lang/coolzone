import Link from 'next/link';
import { products } from '@/lib/products';
import { ProductCard } from '@/components/product-card';
import { ContactForm } from '@/components/contact-form';
import { getTranslations } from '@/i18n/translations';
import { locales, defaultLocale, type Locale } from '@/i18n/config';
import {
  Snowflake,
  Truck,
  Shield,
  Zap,
  ThermometerSun,
  Headphones,
  ArrowRight,
  Star,
  MessageSquare,
} from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = getTranslations(locale as Locale);
  const baseUrl = process.env.COZE_PROJECT_DOMAIN_DEFAULT ? `https://${process.env.COZE_PROJECT_DOMAIN_DEFAULT}` : 'https://coolzone.vercel.app';

  return {
    title: `CoolZone - ${t['home.hero.title']}`,
    description: t['home.hero.subtitle'],
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: Object.fromEntries(
        locales.map((l) => [l, `${baseUrl}/${l}`])
      ),
    },
    openGraph: {
      title: `CoolZone - ${t['home.hero.title']}`,
      description: t['home.hero.subtitle'],
      locale: locale.toUpperCase(),
      type: 'website',
      siteName: 'CoolZone',
      url: `${baseUrl}/${locale}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `CoolZone - ${t['home.hero.title']}`,
      description: t['home.hero.subtitle'],
    },
  };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = getTranslations(locale as Locale);
  const featuredProducts = products;

  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'CoolZone',
    description: t['home.hero.subtitle'],
    url: process.env.COZE_PROJECT_DOMAIN_DEFAULT ? `https://${process.env.COZE_PROJECT_DOMAIN_DEFAULT}` : 'https://coolzone.vercel.app',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: locales.map(l => l.toUpperCase()),
    },
    areaServed: {
      '@type': 'Place',
      name: 'Europe',
    },
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: locale === 'fr' ? 'Dans quelles zones livrez-vous?' : locale === 'de' ? 'In welche Gebiete liefern Sie?' : locale === 'es' ? '¿A qué zonas entregan?' : 'What areas do you deliver to?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: locale === 'fr' ? 'Nous livrons dans tous les pays européens.' : locale === 'de' ? 'Wir liefern in alle europäischen Länder.' : locale === 'es' ? 'Entregamos en todos los países europeos.' : 'We deliver to all European countries including Germany, France, Italy, Spain, Netherlands, Belgium, Austria, Switzerland, and more.',
        },
      },
      {
        '@type': 'Question',
        name: locale === 'fr' ? 'Offrez-vous des services d\'installation?' : locale === 'de' ? 'Bieten Sie Installationsservices an?' : locale === 'es' ? '¿Ofrecen servicios de instalación?' : 'Do you offer installation services?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: locale === 'fr' ? 'Oui, nous fournissons des services d\'installation professionnels dans toute l\'Europe.' : locale === 'de' ? 'Ja, wir bieten professionelle Installationsdienste in ganz Europa an.' : locale === 'es' ? 'Sí, proporcionamos servicios de instalación profesional en toda Europa.' : 'Yes, we provide professional installation services across Europe. Contact us via WhatsApp for a quote.',
        },
      },
      {
        '@type': 'Question',
        name: locale === 'fr' ? 'Quelle garantie offrez-vous?' : locale === 'de' ? 'Welche Garantie bieten Sie an?' : locale === 'es' ? '¿Qué garantía ofrecen?' : 'What warranty do you offer?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: locale === 'fr' ? 'Tous les produits CoolZone sont livrés avec une garantie constructeur de 5 ans.' : locale === 'de' ? 'Alle CoolZone-Produkte kommen mit 5 Jahren Herstellergarantie.' : locale === 'es' ? 'Todos los productos CoolZone vienen con 5 años de garantía del fabricante.' : 'All CoolZone products come with a 5-year manufacturer warranty covering parts and labor.',
        },
      },
    ],
  };

  // Feature cards data - translated
  const features = [
    {
      icon: Zap,
      title: t['home.features.energy'],
      desc: t['home.features.energyDesc'],
      color: 'text-amber-500',
      bg: 'bg-amber-50',
    },
    {
      icon: ThermometerSun,
      title: t['home.features.cooling'],
      desc: t['home.features.coolingDesc'],
      color: 'text-red-500',
      bg: 'bg-red-50',
    },
    {
      icon: Snowflake,
      title: t['home.features.silent'],
      desc: t['home.features.silentDesc'],
      color: 'text-blue-500',
      bg: 'bg-blue-50',
    },
    {
      icon: Headphones,
      title: t['home.features.support'],
      desc: t['home.features.supportDesc'],
      color: 'text-green-500',
      bg: 'bg-green-50',
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-cyan-200/30 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-100/20 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 text-sm font-medium rounded-full mb-6">
                <Snowflake className="w-3.5 h-3.5" />
                {locale === 'fr' ? 'Vente d\'été - Jusqu\'à -25%' : locale === 'de' ? 'Sommerverkauf - Bis zu 25% Rabatt' : locale === 'es' ? 'Oferta de verano - Hasta 25% descuento' : locale === 'it' ? 'Saldi estivi - Fino al 25% di sconto' : locale === 'nl' ? 'Zomeruitverkoop - Tot 25% korting' : 'Summer Sale - Up to 25% Off'}
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                {locale === 'fr' ? 'Restez au Frais' : locale === 'de' ? 'Bleiben Sie Cool' : locale === 'es' ? 'Manténgase Fresco' : locale === 'it' ? 'Rimani al Fresco' : locale === 'nl' ? 'Blijf Cool' : 'Stay Cool'}
                <span className="block bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                  {locale === 'fr' ? 'Cet Été' : locale === 'de' ? 'Diesen Sommer' : locale === 'es' ? 'Este Verano' : locale === 'it' ? 'Quest\'Estate' : locale === 'nl' ? 'Deze Zomer' : 'This Summer'}
                </span>
              </h1>
              <p className="mt-6 text-lg text-gray-600 leading-relaxed max-w-lg">
                {t['home.hero.subtitle']}
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href={`/${locale}/products`}
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 hover:-translate-y-0.5"
                >
                  {t['home.hero.cta']}
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href={`/${locale}/contact`}
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl transition-colors border border-gray-200"
                >
                  {t['home.hero.secondary']}
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-blue-500" />
                  {locale === 'fr' ? 'Livraison UE gratuite' : locale === 'de' ? 'Kostenlose EU-Lieferung' : locale === 'es' ? 'Envío gratis UE' : locale === 'it' ? 'Spedizione UE gratuita' : locale === 'nl' ? 'Gratis EU-levering' : 'Free EU Delivery'}
                </div>
                <div className="flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-blue-500" />
                  {locale === 'fr' ? 'Garantie 5 ans' : locale === 'de' ? '5 Jahre Garantie' : locale === 'es' ? '5 años de garantía' : locale === 'it' ? '5 anni di garanzia' : locale === 'nl' ? '5 jaar garantie' : '5-Year Warranty'}
                </div>
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  4.8/5
                </div>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="relative w-full aspect-square max-w-lg mx-auto">
                <div className="absolute inset-8 bg-gradient-to-br from-blue-100 to-cyan-50 rounded-full" />
                <img
                  src="/products/hero-bg.jpg"
                  alt="Modern air conditioning in luxury living room"
                  className="relative z-10 w-full h-full object-cover rounded-3xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900">{t['home.features.title']}</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="p-6 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all group"
              >
                <div className={`w-12 h-12 ${feature.bg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                <p className="mt-2 text-sm text-gray-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">{t['home.products.title']}</h2>
              <p className="mt-2 text-gray-500">{t['home.products.subtitle']}</p>
            </div>
            <Link
              href={`/${locale}/products`}
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              {locale === 'fr' ? 'Voir tout' : locale === 'de' ? 'Alle ansehen' : locale === 'es' ? 'Ver todo' : locale === 'it' ? 'Vedi tutto' : locale === 'nl' ? 'Alles bekijken' : 'View All'}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} locale={locale as Locale} />
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link
              href={`/${locale}/products`}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              {locale === 'fr' ? 'Voir tous les produits' : locale === 'de' ? 'Alle Produkte ansehen' : locale === 'es' ? 'Ver todos los productos' : 'View All Products'}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-cyan-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: '50K+', label: locale === 'fr' ? 'Clients satisfaits' : locale === 'de' ? 'Zufriedene Kunden' : locale === 'es' ? 'Clientes satisfechos' : locale === 'it' ? 'Clienti soddisfatti' : locale === 'nl' ? 'Tevreden klanten' : 'Happy Customers' },
              { value: '30+', label: locale === 'fr' ? 'Pays européens' : locale === 'de' ? 'Europäische Länder' : locale === 'es' ? 'Países europeos' : locale === 'it' ? 'Paesi europei' : locale === 'nl' ? 'Europese landen' : 'European Countries' },
              { value: '4.8/5', label: locale === 'fr' ? 'Note moyenne' : locale === 'de' ? 'Durchschnittsbewertung' : locale === 'es' ? 'Valoración media' : locale === 'it' ? 'Valutazione media' : locale === 'nl' ? 'Gemiddelde beoordeling' : 'Average Rating' },
              { value: locale === 'fr' ? '5 Ans' : locale === 'de' ? '5 Jahre' : locale === 'es' ? '5 Años' : locale === 'it' ? '5 Anni' : locale === 'nl' ? '5 Jaar' : '5 Year', label: locale === 'fr' ? 'Garantie' : locale === 'de' ? 'Garantie' : locale === 'es' ? 'Garantía' : locale === 'it' ? 'Garanzia' : locale === 'nl' ? 'Garantie' : 'Warranty' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold">{stat.value}</div>
                <div className="mt-1 text-sm text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact" className="py-20 bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 text-sm font-medium rounded-full mb-4">
              <MessageSquare className="w-3.5 h-3.5" />
              {t['contact.info.title']}
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">{t['home.contact.title']}</h2>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              {t['home.contact.subtitle']}
            </p>
          </div>
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <ContactForm locale={locale as Locale} />
            </div>
            <div className="space-y-8">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {locale === 'fr' ? 'Pourquoi nous contacter?' : locale === 'de' ? 'Warum uns kontaktieren?' : locale === 'es' ? '¿Por qué contactarnos?' : locale === 'it' ? 'Perché contattarci?' : locale === 'nl' ? 'Waarom ons contacteren?' : 'Why Contact Us?'}
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <MessageSquare className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{t['contact.info.whatsapp']}</p>
                      <p className="text-sm text-gray-500">{t['contact.info.response']}</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Shield className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{t['contact.info.eu']}</p>
                      <p className="text-sm text-gray-500">{t['home.features.supportDesc']}</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
