import type { Metadata } from 'next';
import { type Locale } from '@/i18n/config';

interface Props {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: `Shipping Information - CoolZone`,
    description: 'CoolZone Shipping Information. Free shipping on orders over EUR 500 to all 27 EU countries. Standard and express delivery options.',
  };
}

export default function ShippingPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Shipping Information</h1>
      <p className="text-gray-500 mb-8">Delivery across the European Union</p>

      <div className="prose prose-gray max-w-none space-y-8">
        <section>
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
            <p className="text-green-800 font-medium text-lg">
              Free shipping on all orders over EUR 500 to EU countries
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">1. Delivery Areas</h2>
          <p className="text-gray-600 leading-relaxed">We ship to all 27 EU member states:</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-3">
            {[
              'Austria', 'Belgium', 'Bulgaria', 'Croatia', 'Cyprus', 'Czech Republic',
              'Denmark', 'Estonia', 'Finland', 'France', 'Germany', 'Greece',
              'Hungary', 'Ireland', 'Italy', 'Latvia', 'Lithuania', 'Luxembourg',
              'Malta', 'Netherlands', 'Poland', 'Portugal', 'Romania', 'Slovakia',
              'Slovenia', 'Spain', 'Sweden'
            ].map(country => (
              <div key={country} className="flex items-center gap-2 text-gray-600 text-sm">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0" />
                {country}
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">2. Shipping Methods &amp; Costs</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-3 border font-semibold text-gray-700">Method</th>
                  <th className="text-left p-3 border font-semibold text-gray-700">Delivery Time</th>
                  <th className="text-left p-3 border font-semibold text-gray-700">Cost</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-3 border text-gray-600">Standard Shipping</td>
                  <td className="p-3 border text-gray-600">5-10 business days</td>
                  <td className="p-3 border text-gray-600">EUR 29-49</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-3 border text-gray-600">Express Shipping</td>
                  <td className="p-3 border text-gray-600">2-4 business days</td>
                  <td className="p-3 border text-gray-600">EUR 59-89</td>
                </tr>
                <tr>
                  <td className="p-3 border text-gray-600">Free Shipping</td>
                  <td className="p-3 border text-gray-600">5-10 business days</td>
                  <td className="p-3 border text-green-600 font-medium">FREE (orders &gt; EUR 500)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">3. Order Processing</h2>
          <ul className="list-disc pl-6 text-gray-600 space-y-1">
            <li>Orders are processed within <strong>1-2 business days</strong> after payment confirmation.</li>
            <li>You will receive a tracking number via WhatsApp/email once your order is shipped.</li>
            <li>Weekend and holiday orders are processed on the next business day.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">4. Tracking Your Order</h2>
          <p className="text-gray-600 leading-relaxed">
            Once your order is shipped, you will receive:
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-1 mt-2">
            <li>A tracking number via WhatsApp or email</li>
            <li>Real-time tracking updates through the carrier&apos;s website</li>
            <li>Delivery notification when your package arrives</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">5. Customs &amp; Import Duties</h2>
          <p className="text-gray-600 leading-relaxed">
            For deliveries within the EU, there are <strong>no additional customs duties or import taxes</strong>. All prices include applicable VAT. For deliveries to overseas territories or special zones, additional charges may apply.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">6. Delivery Issues</h2>
          <p className="text-gray-600 leading-relaxed">
            If your package is delayed, damaged, or lost:
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-1 mt-2">
            <li>Contact us via WhatsApp for immediate assistance</li>
            <li>We will investigate with the carrier and resolve the issue</li>
            <li>Lost packages will be reshipped or refunded at no extra cost</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">7. Contact</h2>
          <p className="text-gray-600 leading-relaxed">
            For shipping inquiries:<br />
            <strong>WhatsApp:</strong> +49 987 654 321<br />
            <strong>Email:</strong> shipping@coolzone.eu
          </p>
        </section>
      </div>
    </div>
  );
}
