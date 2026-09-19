import Link from 'next/link';
import { CheckCircle, MessageCircle } from 'lucide-react';
import { buildContactUrl } from '@/lib/whatsapp';
import { getTranslations } from '@/i18n/translations';
import { locales, type Locale } from '@/i18n/config';
import { getSettings } from '@/lib/db';

export const dynamic = 'force-dynamic';

interface ThankYouPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const baseUrl = process.env.COZE_PROJECT_DOMAIN_DEFAULT ? `https://${process.env.COZE_PROJECT_DOMAIN_DEFAULT}` : 'https://coolzone.vercel.app';

  return {
    title: 'Thank You - CoolZone',
    robots: {
      index: false,
      follow: true,
    },
    alternates: {
      canonical: `${baseUrl}/${locale}/ok`,
      languages: Object.fromEntries(
        locales.map((l) => [l, `${baseUrl}/${l}/ok`])
      ),
    },
  };
}

export default async function ThankYouPage({ params }: ThankYouPageProps) {
  const { locale } = await params;
  const t = getTranslations(locale as Locale);

  let whatsappPhone = '491234567890';
  try {
    const settings = await getSettings();
    if (settings.whatsappPhone) {
      whatsappPhone = settings.whatsappPhone;
    }
  } catch {
    // 使用默认号码
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            {locale === 'fr' ? 'Merci!' : locale === 'de' ? 'Vielen Dank!' : locale === 'es' ? '¡Gracias!' : locale === 'it' ? 'Grazie!' : locale === 'nl' ? 'Bedankt!' : 'Thank You!'}
          </h1>

          <p className="text-gray-600 mb-8">
            {locale === 'fr' ? 'Votre message a été envoyé avec succès. Notre équipe vous contactera dans les 24 heures.' : locale === 'de' ? 'Ihre Nachricht wurde erfolgreich gesendet. Unser Team wird sich innerhalb von 24 Stunden bei Ihnen melden.' : locale === 'es' ? 'Su mensaje ha sido enviado con éxito. Nuestro equipo le contactará en 24 horas.' : locale === 'it' ? 'Il tuo messaggio è stato inviato con successo. Il nostro team ti contatterà entro 24 ore.' : locale === 'nl' ? 'Uw bericht is succesvol verzonden. Ons team neemt binnen 24 uur contact met u op.' : 'Your message has been sent successfully. Our team will get back to you within 24 hours.'}
          </p>

          <div className="space-y-3">
            <a
              href={buildContactUrl(whatsappPhone)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold rounded-xl transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              {locale === 'fr' ? 'Discuter sur WhatsApp' : locale === 'de' ? 'Auf WhatsApp chatten' : locale === 'es' ? 'Chatear en WhatsApp' : locale === 'it' ? 'Chatta su WhatsApp' : locale === 'nl' ? 'Chat op WhatsApp' : 'Chat on WhatsApp'}
            </a>
            <Link
              href={`/${locale}`}
              className="block w-full px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors"
            >
              {t['nav.home']}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
