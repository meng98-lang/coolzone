import { ContactForm } from '@/components/contact-form';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { getTranslations } from '@/i18n/translations';
import { locales, type Locale } from '@/i18n/config';

interface ContactPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = getTranslations(locale as Locale);
  const baseUrl = process.env.COZE_PROJECT_DOMAIN_DEFAULT ? `https://${process.env.COZE_PROJECT_DOMAIN_DEFAULT}` : 'https://coolzone.vercel.app';

  return {
    title: t['contact.title'],
    description: t['contact.subtitle'],
    alternates: {
      canonical: `${baseUrl}/${locale}/contact`,
      languages: Object.fromEntries(
        locales.map((l) => [l, `${baseUrl}/${l}/contact`])
      ),
    },
    openGraph: {
      title: `CoolZone - ${t['contact.title']}`,
      description: t['contact.subtitle'],
      locale: locale.toUpperCase(),
      type: 'website',
      siteName: 'CoolZone',
    },
  };
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await params;
  const t = getTranslations(locale as Locale);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-cyan-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t['contact.title']}</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            {t['contact.subtitle']}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <ContactForm locale={locale as Locale} />
            </div>

            <div className="space-y-8">
              <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{t['contact.info.title']}</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                      <Mail className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Email</h3>
                      <p className="text-gray-600">info@coolzone.eu</p>
                      <p className="text-gray-600">sales@coolzone.eu</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center shrink-0">
                      <Phone className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{t['contact.info.whatsapp']}</h3>
                      <p className="text-gray-600">{t['contact.info.response']}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center shrink-0">
                      <MapPin className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{t['contact.info.eu']}</h3>
                      <p className="text-gray-600">{t['home.features.supportDesc']}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                      <Clock className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {locale === 'fr' ? 'Heures d\'ouverture' : locale === 'de' ? 'Öffnungszeiten' : locale === 'es' ? 'Horario de atención' : locale === 'it' ? 'Orari di apertura' : locale === 'nl' ? 'Openingstijden' : 'Business Hours'}
                      </h3>
                      <p className="text-gray-600">
                        {locale === 'fr' ? 'Lun-Ven: 9h-18h (CET)' : locale === 'de' ? 'Mo-Fr: 9-18 Uhr (MEZ)' : locale === 'es' ? 'Lun-Vie: 9:00-18:00 (CET)' : 'Mon-Fri: 9:00-18:00 (CET)'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
