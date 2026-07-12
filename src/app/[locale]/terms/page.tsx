import type { Metadata } from 'next';
import { type Locale } from '@/i18n/config';
import Link from 'next/link';

interface Props {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: `Terms & Conditions - CoolZone`,
    description: 'CoolZone Terms and Conditions. Read our policies on orders, payments, shipping, warranty, and consumer rights.',
  };
}

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Terms &amp; Conditions</h1>
      <p className="text-gray-500 mb-8">Last updated: January 2025</p>

      <div className="prose prose-gray max-w-none space-y-8">
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">1. General Information</h2>
          <p className="text-gray-600 leading-relaxed">
            These Terms and Conditions (&quot;Terms&quot;) govern the sale of products through the CoolZone website (coolzone.eu). By placing an order on our website, you agree to be bound by these Terms.
          </p>
          <p className="text-gray-600 leading-relaxed mt-2">
            <strong>Seller:</strong> CoolZone SARL, 123 Commerce Street, 75001 Paris, France<br />
            <strong>Email:</strong> info@coolzone.eu<br />
            <strong>WhatsApp:</strong> +49 987 654 321
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">2. Products &amp; Prices</h2>
          <ul className="list-disc pl-6 text-gray-600 space-y-1">
            <li>All prices are displayed in Euros (EUR) and include VAT where applicable.</li>
            <li>Product descriptions, images, and specifications are provided for informational purposes and may vary slightly from the actual product.</li>
            <li>We reserve the right to modify prices at any time. The price applicable is the one displayed at the time of order.</li>
            <li>Product availability is subject to stock. In case of unavailability, we will notify you promptly.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">3. Ordering Process</h2>
          <p className="text-gray-600 leading-relaxed">
            Orders are placed through WhatsApp communication with our sales team. The order process is as follows:
          </p>
          <ol className="list-decimal pl-6 text-gray-600 space-y-1 mt-2">
            <li>Customer selects products and clicks &quot;Order via WhatsApp&quot;</li>
            <li>Customer confirms order details with our sales representative</li>
            <li>Customer receives order confirmation via WhatsApp</li>
            <li>Payment is arranged through agreed methods</li>
            <li>Product is shipped and tracking information is provided</li>
          </ol>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">4. Payment</h2>
          <p className="text-gray-600 leading-relaxed">
            We accept the following payment methods:
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-1 mt-2">
            <li>Bank transfer (SEPA)</li>
            <li>Credit/Debit card (Visa, Mastercard)</li>
            <li>PayPal</li>
            <li>Other methods as agreed with our sales team</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">5. Shipping &amp; Delivery</h2>
          <ul className="list-disc pl-6 text-gray-600 space-y-1">
            <li>We ship to all EU member states.</li>
            <li>Standard delivery: 5-10 business days</li>
            <li>Express delivery: 2-4 business days (additional charges apply)</li>
            <li>Free shipping on orders over EUR 500</li>
            <li>Shipping costs will be communicated before order confirmation</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">6. Right of Withdrawal</h2>
          <p className="text-gray-600 leading-relaxed">
            In accordance with EU Consumer Rights Directive (2011/83/EU), you have the right to withdraw from this contract within <strong>14 days</strong> without giving any reason. See our <Link href="/returns" className="text-blue-600 hover:underline">Return Policy</Link> for details.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">7. Warranty</h2>
          <p className="text-gray-600 leading-relaxed">
            All products come with a minimum 2-year legal warranty as required by EU law. Additional manufacturer warranties may apply. The warranty covers manufacturing defects and does not cover damage caused by improper use, installation errors, or normal wear and tear.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">8. Liability</h2>
          <p className="text-gray-600 leading-relaxed">
            CoolZone shall not be liable for any indirect, incidental, or consequential damages. Our total liability shall not exceed the purchase price of the product. This does not affect your statutory rights.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">9. Applicable Law &amp; Jurisdiction</h2>
          <p className="text-gray-600 leading-relaxed">
            These Terms are governed by French law. Any disputes shall be subject to the jurisdiction of the courts of Paris, France, without prejudice to mandatory consumer protection laws of your country of residence within the EU.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">10. Contact</h2>
          <p className="text-gray-600 leading-relaxed">
            For any questions regarding these Terms, contact us at:<br />
            Email: info@coolzone.eu<br />
            WhatsApp: +49 987 654 321
          </p>
        </section>
      </div>
    </div>
  );
}
