import type { Metadata } from 'next';
import { type Locale } from '@/i18n/config';

interface Props {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: `Privacy Policy - CoolZone`,
    description: 'CoolZone Privacy Policy. How we collect, use, and protect your personal data in compliance with GDPR.',
  };
}

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Privacy Policy</h1>
      <p className="text-gray-500 mb-8">Last updated: January 2025</p>

      <div className="prose prose-gray max-w-none space-y-8">
        <section>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
            <p className="text-blue-800 font-medium text-lg">
              GDPR Compliance (EU General Data Protection Regulation 2016/679)
            </p>
            <p className="text-blue-700 mt-2">
              CoolZone is committed to protecting your privacy and personal data in accordance with EU GDPR regulations.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">1. Data Controller</h2>
          <p className="text-gray-600 leading-relaxed">
            <strong>Company:</strong> Jinan Yuebei Amusement Equipment Co., Ltd.<br />
            <strong>Address:</strong> Room 2304-24, Jingshu Talent Building, Weihai Road, Xingfu Street, Huaiyin District, Jinan City, Shandong Province, China<br />
            <strong>Email:</strong> privacy@coolzone.eu<br />
            <strong>WhatsApp:</strong> +49 987 654 321
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">2. Data We Collect</h2>
          <p className="text-gray-600 leading-relaxed">We collect the following personal data:</p>
          <ul className="list-disc pl-6 text-gray-600 space-y-1 mt-2">
            <li><strong>Contact Form:</strong> Name, email address, phone number, message content</li>
            <li><strong>Order Processing:</strong> Name, shipping address, phone number, email</li>
            <li><strong>Website Analytics:</strong> IP address, browser type, device type, pages visited, time spent</li>
            <li><strong>Cookies:</strong> Session cookies, preference cookies, analytics cookies</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">3. How We Use Your Data</h2>
          <p className="text-gray-600 leading-relaxed">We use your personal data for:</p>
          <ul className="list-disc pl-6 text-gray-600 space-y-1 mt-2">
            <li>Processing and fulfilling your orders</li>
            <li>Responding to your inquiries and providing customer support</li>
            <li>Sending order confirmations and shipping notifications</li>
            <li>Improving our website and services</li>
            <li>Complying with legal obligations</li>
            <li>Marketing communications (only with your explicit consent)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">4. Legal Basis for Processing</h2>
          <p className="text-gray-600 leading-relaxed">We process your personal data based on:</p>
          <ul className="list-disc pl-6 text-gray-600 space-y-1 mt-2">
            <li><strong>Contract:</strong> Processing necessary to fulfill your order</li>
            <li><strong>Consent:</strong> Marketing emails, cookies (you can withdraw consent anytime)</li>
            <li><strong>Legitimate Interest:</strong> Website analytics, fraud prevention</li>
            <li><strong>Legal Obligation:</strong> Tax records, consumer protection laws</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">5. Data Sharing</h2>
          <p className="text-gray-600 leading-relaxed">We share your data only with:</p>
          <ul className="list-disc pl-6 text-gray-600 space-y-1 mt-2">
            <li><strong>Shipping Partners:</strong> To deliver your orders (DHL, FedEx, UPS)</li>
            <li><strong>Payment Processors:</strong> To process payments (Stripe, PayPal)</li>
            <li><strong>Analytics Services:</strong> Google Analytics (anonymized IP)</li>
            <li><strong>Legal Authorities:</strong> When required by law</li>
          </ul>
          <p className="text-gray-600 leading-relaxed mt-2">
            <strong>We never sell your personal data to third parties.</strong>
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">6. Data Retention</h2>
          <ul className="list-disc pl-6 text-gray-600 space-y-1">
            <li><strong>Order Data:</strong> Retained for 10 years (tax and warranty obligations)</li>
            <li><strong>Contact Form Data:</strong> Retained for 2 years</li>
            <li><strong>Analytics Data:</strong> Retained for 26 months (Google Analytics)</li>
            <li><strong>Cookies:</strong> Session cookies deleted on browser close; preference cookies retained for 12 months</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">7. Your Rights (GDPR)</h2>
          <p className="text-gray-600 leading-relaxed">You have the following rights:</p>
          <ul className="list-disc pl-6 text-gray-600 space-y-1 mt-2">
            <li><strong>Right to Access:</strong> Request a copy of your personal data</li>
            <li><strong>Right to Rectification:</strong> Correct inaccurate or incomplete data</li>
            <li><strong>Right to Erasure:</strong> Request deletion of your data ("right to be forgotten")</li>
            <li><strong>Right to Restrict Processing:</strong> Limit how we use your data</li>
            <li><strong>Right to Data Portability:</strong> Receive your data in a machine-readable format</li>
            <li><strong>Right to Object:</strong> Object to processing based on legitimate interest</li>
            <li><strong>Right to Withdraw Consent:</strong> Withdraw consent for marketing at any time</li>
          </ul>
          <p className="text-gray-600 leading-relaxed mt-2">
            To exercise these rights, contact us at <strong>privacy@coolzone.eu</strong>
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">8. Cookies</h2>
          <p className="text-gray-600 leading-relaxed">We use the following cookies:</p>
          <ul className="list-disc pl-6 text-gray-600 space-y-1 mt-2">
            <li><strong>Essential Cookies:</strong> Required for website functionality (session, cart)</li>
            <li><strong>Analytics Cookies:</strong> Google Analytics (anonymized)</li>
            <li><strong>Marketing Cookies:</strong> Facebook Pixel, Google Ads (only with consent)</li>
          </ul>
          <p className="text-gray-600 leading-relaxed mt-2">
            You can manage cookie preferences in your browser settings.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">9. Security</h2>
          <p className="text-gray-600 leading-relaxed">
            We implement industry-standard security measures to protect your data:
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-1 mt-2">
            <li>SSL/TLS encryption for all data transmission</li>
            <li>Secure servers with regular security updates</li>
            <li>Access controls and authentication</li>
            <li>Regular security audits and penetration testing</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">10. International Data Transfers</h2>
          <p className="text-gray-600 leading-relaxed">
            As an EU-based company, all data is stored and processed within the European Economic Area (EEA). If data is transferred outside the EEA, we ensure adequate protection through Standard Contractual Clauses (SCCs) approved by the European Commission.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">11. Children's Privacy</h2>
          <p className="text-gray-600 leading-relaxed">
            Our website is not intended for children under 16. We do not knowingly collect personal data from children. If you believe we have collected data from a child, please contact us immediately.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">12. Changes to This Policy</h2>
          <p className="text-gray-600 leading-relaxed">
            We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated "Last updated" date. We encourage you to review this policy periodically.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">13. Contact Us</h2>
          <p className="text-gray-600 leading-relaxed">
            For privacy-related questions or to exercise your GDPR rights:<br />
            <strong>Email:</strong> privacy@coolzone.eu<br />
            <strong>WhatsApp:</strong> +49 987 654 321<br />
            <strong>Address:</strong> Room 2304-24, Jingshu Talent Building, Weihai Road, Xingfu Street, Huaiyin District, Jinan City, Shandong Province, China
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">14. Complaints</h2>
          <p className="text-gray-600 leading-relaxed">
            If you believe we have violated your privacy rights, you have the right to lodge a complaint with your local data protection authority (e.g., CNIL in France, BfDI in Germany, Garante in Italy).
          </p>
        </section>
      </div>
    </div>
  );
}
