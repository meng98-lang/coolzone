/**
 * WhatsApp Configuration
 * ======================
 * Phone number is now read from database settings (admin panel).
 * Functions accept phone number as parameter.
 */

/**
 * Build a WhatsApp deep-link URL.
 * @param phone - WhatsApp phone number (with country code, no + or spaces)
 * @param message - Pre-filled message text (will be URL-encoded)
 */
export function buildWhatsAppUrl(phone: string, message: string): string {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encoded}`;
}

/**
 * Build a WhatsApp link for a specific product inquiry.
 */
export function buildProductInquiryUrl(phone: string, productName: string, productId: string): string {
  const message = `Hi! I'm interested in the ${productName} (ID: ${productId}). Could you provide more details?`;
  return buildWhatsAppUrl(phone, message);
}

/**
 * Build a WhatsApp link for placing an order with multiple items.
 */
export function buildOrderUrl(phone: string, items: { name: string; quantity: number; price: number }[]): string {
  const lines = items.map((item) => `- ${item.name} x${item.quantity} (€${item.price * item.quantity})`);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const message = `Hi! I'd like to place an order:\n\n${lines.join('\n')}\n\nTotal: €${total}\n\nPlease confirm availability and payment details. Thank you!`;
  return buildWhatsAppUrl(phone, message);
}

/**
 * Build a generic contact WhatsApp link.
 */
export function buildContactUrl(phone: string): string {
  return buildWhatsAppUrl(phone, 'Hi! I have a question about your air conditioning products.');
}
