import type { Metadata } from 'next';
import { type Locale } from '@/i18n/config';
import { getTranslations } from '@/i18n/translations';

interface Props {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations(locale);
  return {
    title: `FAQ - Air Conditioning Questions | CoolZone`,
    description: `Frequently asked questions about air conditioning, BTU, installation, energy efficiency. CoolZone expert answers.`,
    keywords: ['air conditioning FAQ', 'AC questions', 'BTU guide', 'air conditioner installation', 'energy efficient AC'],
  };
}

const faqData = [
  {
    category: 'Product Selection',
    questions: [
      {
        q: 'What does BTU mean and how do I choose the right one?',
        a: 'BTU (British Thermal Unit) measures cooling capacity. As a general guide: 9,000 BTU for rooms up to 20m², 12,000 BTU for 20-30m², 18,000 BTU for 30-45m², and 24,000 BTU for spaces over 45m². Factors like ceiling height, insulation, and sun exposure also affect the ideal BTU.'
      },
      {
        q: 'What is the difference between wall-mounted, portable, and floor-standing AC?',
        a: 'Wall-mounted units are the most common and efficient, ideal for bedrooms and living rooms. Portable ACs are flexible and can be moved between rooms but are less powerful. Floor-standing (tower) units offer high capacity for large spaces like open-plan living rooms.'
      },
      {
        q: 'What is an inverter air conditioner?',
        a: 'An inverter AC uses a variable-speed compressor that adjusts its speed to maintain the desired temperature, rather than turning on and off. This results in up to 30-50% energy savings, quieter operation, and more consistent temperature control.'
      },
      {
        q: 'Do you sell central air conditioning systems?',
        a: 'Yes, we offer central air conditioning systems for whole-home cooling. These are ideal for larger properties and provide uniform cooling throughout. Contact us via WhatsApp for a custom quote based on your property size.'
      },
    ]
  },
  {
    category: 'Installation & Usage',
    questions: [
      {
        q: 'Do I need professional installation?',
        a: 'Wall-mounted and central AC systems require professional installation by a certified technician (mandatory in most EU countries for units with refrigerant). Portable ACs require no installation - just plug in and use.'
      },
      {
        q: 'How often should I service my air conditioner?',
        a: 'We recommend annual maintenance before the cooling season. This includes cleaning/replacing filters, checking refrigerant levels, and inspecting electrical components. Regular maintenance ensures optimal efficiency and extends the unit lifespan.'
      },
      {
        q: 'What is the ideal temperature setting?',
        a: 'For comfort and energy efficiency, we recommend setting your AC to 24-26°C during summer. Each degree lower increases energy consumption by approximately 7-10%.'
      },
      {
        q: 'Can I control the AC with my phone?',
        a: 'Yes, all our products support smart WiFi control through a dedicated mobile app. You can control temperature, fan speed, timer, and modes from anywhere with an internet connection.'
      },
    ]
  },
  {
    category: 'Energy & Environment',
    questions: [
      {
        q: 'What does the EU Energy Label mean?',
        a: 'The EU Energy Label rates products from A+++ (most efficient) to D (least efficient). Higher ratings mean lower electricity bills and reduced environmental impact. All our products are rated A++ or above.'
      },
      {
        q: 'What is R32 refrigerant?',
        a: 'R32 is an eco-friendly refrigerant with a Global Warming Potential (GWP) of only 675, which is 68% lower than the older R410A. It is more energy efficient and is the current standard for new air conditioning systems in the EU.'
      },
      {
        q: 'How much electricity does an AC use?',
        a: 'A typical 12,000 BTU inverter AC uses approximately 1-1.2 kWh per hour of operation. With average use of 8 hours per day, this costs roughly EUR 0.50-1.00 per day depending on your electricity tariff.'
      },
    ]
  },
  {
    category: 'Orders & Delivery',
    questions: [
      {
        q: 'Which countries do you ship to?',
        a: 'We ship to all 27 EU member states. Free shipping is available on orders over EUR 500. Standard delivery takes 5-10 business days, and express delivery takes 2-4 business days.'
      },
      {
        q: 'What is your return policy?',
        a: 'In accordance with EU consumer law, you have 14 days from delivery to return any product for a full refund. Products must be in original condition and packaging. See our Return Policy page for full details.'
      },
      {
        q: 'What warranty do you offer?',
        a: 'All products come with a minimum 2-year legal warranty covering manufacturing defects. Some products also include extended manufacturer warranties. Contact us for specific product warranty details.'
      },
    ]
  },
];

export default function FAQPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-3">Frequently Asked Questions</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Find answers to common questions about air conditioning, our products, installation, and orders.
        </p>
      </div>

      <div className="space-y-10">
        {faqData.map((section) => (
          <section key={section.category}>
            <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-blue-100">
              {section.category}
            </h2>
            <div className="space-y-4">
              {section.questions.map((item, idx) => (
                <details
                  key={idx}
                  className="group bg-white border border-gray-200 rounded-xl overflow-hidden"
                >
                  <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors">
                    <span className="font-medium text-gray-800 pr-4">{item.q}</span>
                    <span className="text-blue-500 flex-shrink-0 group-open:rotate-45 transition-transform text-xl font-light">+</span>
                  </summary>
                  <div className="px-4 pb-4 text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                    {item.a}
                  </div>
                </details>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Still have questions */}
      <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 text-center">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Still have questions?</h3>
        <p className="text-gray-600 mb-4">Our team is ready to help you find the perfect cooling solution.</p>
        <a
          href="https://wa.me/49987654321"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          Chat with us on WhatsApp
        </a>
      </div>

      {/* JSON-LD FAQ Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqData.flatMap(section =>
              section.questions.map(item => ({
                '@type': 'Question',
                name: item.q,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: item.a,
                },
              }))
            ),
          }),
        }}
      />
    </div>
  );
}
