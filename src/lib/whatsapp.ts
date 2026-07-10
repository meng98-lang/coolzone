/**
 * WhatsApp Configuration
 * ======================
 * Replace WHATSAPP_PHONE with your actual WhatsApp number (with country code, no + or spaces).
 * Example: '491234567890' for a German number +49 123 4567890
 */

// >>> REPLACE THIS WITH YOUR ACTUAL WHATSAPP NUMBER <<<
export const WHATSAPP_PHONE = '491234567890';

/**
 * Build a WhatsApp deep-link URL.
 * @param message - Pre-filled message text (will be URL-encoded)
 */
export function buildWhatsAppUrl(message: string): string {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encoded}`;
}

/**
 * Build a WhatsApp link for a specific product inquiry.
 */
export function buildProductInquiryUrl(productName: string, productId: string): string {
  const message = `Hi! I'm interested in the ${productName} (ID: ${productId}). Could you provide more details?`;
  return buildWhatsAppUrl(message);
}

/**
 * Build a WhatsApp link for placing an order with multiple items.
 */
export function buildOrderUrl(items: { name: string; quantity: number; price: number }[]): string {
  const lines = items.map((item) => `- ${item.name} x${item.quantity} (€${item.price * item.quantity})`);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const message = `Hi! I'd like to place an order:\n\n${lines.join('\n')}\n\nTotal: €${total}\n\nPlease confirm availability and payment details. Thank you!`;
  return buildWhatsAppUrl(message);
}

/**
 * Build a generic contact WhatsApp link.
 */
export function buildContactUrl(): string {
  return buildWhatsAppUrl('Hi! I have a question about your air conditioning products.');
}
