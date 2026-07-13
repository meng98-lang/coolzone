/**
 * WhatsApp Configuration
 * ======================
 * Phone number is now read from database settings (admin panel).
 * Functions accept phone number as optional last parameter.
 */

const DEFAULT_PHONE = '491234567890';

function cleanPhone(phone: string): string {
  return phone.replace(/[^0-9]/g, '');
}

/**
 * Build a WhatsApp deep-link URL.
 */
export function buildWhatsAppUrl(message: string, phone?: string): string {
  const p = cleanPhone(phone || DEFAULT_PHONE);
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${p}?text=${encoded}`;
}

/**
 * Build a WhatsApp link for a specific product inquiry.
 */
export function buildProductInquiryUrl(productName: string, productId: string, phone?: string): string {
  const message = `Hi! I'm interested in the ${productName} (ID: ${productId}). Could you provide more details?`;
  return buildWhatsAppUrl(message, phone);
}

/**
 * Build a WhatsApp link for placing an order with multiple items.
 */
export function buildOrderUrl(items: { name: string; quantity: number; price: number }[], phone?: string): string {
  const lines = items.map((item) => `- ${item.name} x${item.quantity} (€${item.price * item.quantity})`);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const message = `Hi! I'd like to place an order:\n\n${lines.join('\n')}\n\nTotal: €${total}\n\nPlease confirm availability and payment details. Thank you!`;
  return buildWhatsAppUrl(message, phone);
}

/**
 * Build a generic contact WhatsApp link.
 */
export function buildContactUrl(phone?: string): string {
  return buildWhatsAppUrl('Hi! I have a question about your air conditioning products.', phone);
}
