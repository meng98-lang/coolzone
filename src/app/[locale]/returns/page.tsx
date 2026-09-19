import type { Metadata } from 'next';
import { type Locale } from '@/i18n/config';

interface Props {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: `Return Policy - CoolZone`,
    description: 'CoolZone Return & Refund Policy. 14-day right of withdrawal, free returns for defective products, 2-year warranty.',
  };
}

export default function ReturnsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Return &amp; Refund Policy</h1>
      <p className="text-gray-500 mb-8">Last updated: January 2025</p>

      <div className="prose prose-gray max-w-none space-y-8">
        <section>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
            <p className="text-blue-800 font-medium text-lg">
              14-Day Right of Withdrawal (EU Consumer Rights Directive 2011/83/EU)
            </p>
            <p className="text-blue-700 mt-2">
              As an EU consumer, you have the legal right to return any product within 14 days of delivery, no questions asked.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">1. Return Period</h2>
          <ul className="list-disc pl-6 text-gray-600 space-y-1">
            <li>You have <strong>14 calendar days</strong> from the date of delivery to request a return.</li>
            <li>To initiate a return, contact us via WhatsApp or email within this period.</li>
            <li>Products must be returned within <strong>30 days</strong> of the return request.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">2. Conditions for Returns</h2>
          <p className="text-gray-600 leading-relaxed">To be eligible for a return, products must:</p>
          <ul className="list-disc pl-6 text-gray-600 space-y-1 mt-2">
            <li>Be in their original packaging (unopened or carefully opened)</li>
            <li>Be unused and in the same condition as received</li>
            <li>Include all accessories, manuals, and documentation</li>
            <li>Have proof of purchase (order confirmation)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">3. Non-Returnable Items</h2>
          <ul className="list-disc pl-6 text-gray-600 space-y-1">
            <li>Custom-made or personalized products</li>
            <li>Products that have been installed or used</li>
            <li>Products with damaged or missing original packaging</li>
            <li>Products past the 14-day return window</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">4. Refund Process</h2>
          <ol className="list-decimal pl-6 text-gray-600 space-y-2">
            <li>Contact us via WhatsApp or email to request a return</li>
            <li>Receive return authorization and shipping instructions</li>
            <li>Ship the product back (return shipping costs are borne by the customer unless the product is defective)</li>
            <li>Once received and inspected, we will process your refund</li>
            <li>Refund will be issued to the original payment method within <strong>14 business days</strong></li>
          </ol>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">5. Defective Products</h2>
          <p className="text-gray-600 leading-relaxed">
            If you receive a defective or damaged product:
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-1 mt-2">
            <li>Contact us within 48 hours of delivery with photos of the damage</li>
            <li>We will arrange a free replacement or full refund</li>
            <li>Return shipping for defective products is covered by CoolZone</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">6. Warranty Claims</h2>
          <p className="text-gray-600 leading-relaxed">
            Beyond the 14-day return period, products are covered by our <strong>2-year legal warranty</strong> for manufacturing defects. Warranty claims are handled on a case-by-case basis and may result in repair, replacement, or refund at our discretion.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">7. Contact Us</h2>
          <p className="text-gray-600 leading-relaxed">
            For return requests or questions:<br />
            <strong>WhatsApp:</strong> +49 987 654 321<br />
            <strong>Email:</strong> returns@coolzone.eu
          </p>
        </section>
      </div>
    </div>
  );
}
