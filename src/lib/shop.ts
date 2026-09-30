/**
 * Shop (GSJ Outdoor Tech / Nexus-style) data layer + Square helpers.
 * Products/categories are the current placeholder catalog; replace with
 * nexuspharma.to data as provided by the site owner.
 */
import { getSupabaseClient } from '@/storage/database/supabase-client';
import { SquareClient, SquareEnvironment } from 'square';

/** Create a Square server client from saved settings (returns null if not configured). */
export function squareClient(accessToken: string, environment: string): SquareClient {
  return new SquareClient({
    token: accessToken,
    environment:
      environment === 'sandbox' ? SquareEnvironment.Sandbox : SquareEnvironment.Production,
  });
}

export function isSquareConfigured(settings: {
  squareAccessToken?: string | null;
  squareApplicationId?: string | null;
  squareLocationId?: string | null;
}): boolean {
  return Boolean(
    settings.squareAccessToken &&
      settings.squareApplicationId &&
      settings.squareLocationId
  );
}

export interface ShopProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  description: string;
  badge?: string;
  inStock?: boolean;
}

export interface ShopOrderItem {
  productId: string;
  name: string;
  price: number;
  qty: number;
  image?: string;
}

export interface ShopOrder {
  id: string;
  order_number: string;
  items: ShopOrderItem[];
  subtotal: number;
  total: number;
  currency: string;
  customer_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  country: string | null;
  address: string | null;
  message: string | null;
  payment_status: string;
  payment_method: string | null;
  square_payment_id: string | null;
  square_order_id: string | null;
  status: string;
  created_at: string;
}

export interface ShopSettings {
  siteName: string;
  whatsappNumber: string;
  whatsappMessage: string;
  adminPassword: string;
  currency: string;
  squareApplicationId: string | null;
  squareAccessToken: string | null;
  squareLocationId: string | null;
  squareWebhookSecret: string | null;
  squareEnvironment: string;
  companyName: string;
  companyAddress: string;
  companyPhone: string;
}

// ============ Placeholder catalog (replace with live nexuspharma data) ============
export const CATEGORIES = ['All', 'Testosterone', 'HGH', 'Peptides', 'AI Wellness'];

export const DEFAULT_PRODUCTS: ShopProduct[] = [
  {
    id: 'testenanth-250',
    name: 'Testosterone Enanthate 250',
    category: 'Testosterone',
    price: 89,
    originalPrice: 119,
    image: '/shop/testost-1.jpg',
    description: 'Premium long-acting testosterone for performance and recovery.',
    badge: 'Popular',
    inStock: true,
  },
  {
    id: 'testprop-100',
    name: 'Testosterone Propionate 100',
    category: 'Testosterone',
    price: 69,
    image: '/shop/testost-2.jpg',
    description: 'Fast-acting testosterone base for rapid results.',
    inStock: true,
  },
  {
    id: 'hgh-somatropin-10iu',
    name: 'Recombinant HGH 10IU',
    category: 'HGH',
    price: 149,
    originalPrice: 179,
    image: '/shop/hgh-1.jpg',
    description: 'Recombinant human growth hormone in lyophilized form.',
    badge: 'Best Seller',
    inStock: true,
  },
  {
    id: 'hgh-ipamorelin',
    name: 'Ipamorelin 5mg',
    category: 'Peptides',
    price: 55,
    image: '/shop/pep-1.jpg',
    description: 'Selective GH secretagogue research peptide.',
    inStock: true,
  },
  {
    id: 'peptide-bpc157',
    name: 'BPC-157 5mg',
    category: 'Peptides',
    price: 49,
    image: '/shop/pep-2.jpg',
    description: 'Body protective compound for recovery and repair.',
    inStock: true,
  },
  {
    id: 'peptide-tb500',
    name: 'TB-500 2mg',
    category: 'Peptides',
    price: 45,
    image: '/shop/pep-3.jpg',
    description: 'Research peptide for healing and mobility.',
    inStock: true,
  },
];

// ============ Settings ============
export async function getShopSettings(): Promise<ShopSettings> {
  const { data } = await getClient().from('shop_settings').select('*').eq('id', 1).maybeSingle();
  return {
    siteName: data?.site_name || 'GSJ',
    whatsappNumber: data?.whatsapp_number || '18014052006',
    whatsappMessage: data?.whatsapp_message || 'Hi, I would like more product information.',
    adminPassword: data?.admin_password || 'gsj2024',
    currency: data?.currency || 'usd',
    squareApplicationId: data?.square_application_id || null,
    squareAccessToken: data?.square_access_token || null,
    squareLocationId: data?.square_location_id || null,
    squareWebhookSecret: data?.square_webhook_secret || null,
    squareEnvironment: data?.square_environment || 'production',
    companyName: data?.company_name || 'GSJ Outdoor Tech LLC',
    companyAddress: data?.company_address || '1500 N Grant St Ste R, Denver, CO 80203, US',
    companyPhone: data?.company_phone || '+1 8014052006',
  };
}

export async function updateShopSettings(updates: Record<string, string>) {
  const keyMap: Record<string, string> = {
    siteName: 'site_name',
    whatsappNumber: 'whatsapp_number',
    whatsappMessage: 'whatsapp_message',
    adminPassword: 'admin_password',
    currency: 'currency',
    squareApplicationId: 'square_application_id',
    squareAccessToken: 'square_access_token',
    squareLocationId: 'square_location_id',
    squareWebhookSecret: 'square_webhook_secret',
    squareEnvironment: 'square_environment',
    companyName: 'company_name',
    companyAddress: 'company_address',
    companyPhone: 'company_phone',
  };
  const payload: Record<string, unknown> = { updated_at: new Date().toISOString() };
  for (const [k, v] of Object.entries(updates)) {
    if (v !== undefined && v !== null) {
      const col = keyMap[k];
      if (col) payload[col] = v;
    }
  }
  const { data, error } = await getClient().from('shop_settings').update(payload).eq('id', 1).select().single();
  if (error) throw new Error(error.message);
  return data;
}

export async function verifyShopAdmin(password: string): Promise<boolean> {
  const s = await getShopSettings();
  return s.adminPassword ? password === s.adminPassword : password === 'gsj2024';
}

// ============ Orders ============
export async function createShopOrder(partial: {
  items: ShopOrderItem[];
  subtotal: number;
  total: number;
  currency: string;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  country?: string;
  address?: string;
  message?: string;
  payment_status?: string;
  square_payment_id?: string;
  square_order_id?: string;
}): Promise<ShopOrder> {
  const orderNumber = 'GSJ' + Date.now().toString().slice(-8);
  const rec = {
    order_number: orderNumber,
    items: partial.items,
    subtotal: partial.subtotal,
    total: partial.total,
    currency: partial.currency,
    customer_name: partial.customer_name || null,
    customer_email: partial.customer_email || null,
    customer_phone: partial.customer_phone || null,
    country: partial.country || null,
    address: partial.address || null,
    message: partial.message || null,
    payment_status: partial.payment_status || 'pending',
    ...(partial.square_payment_id ? { square_payment_id: partial.square_payment_id } : {}),
    ...(partial.square_order_id ? { square_order_id: partial.square_order_id } : {}),
  };
  const { data, error } = await getClient().from('shop_orders').insert(rec).select().single();
  if (error) throw new Error(error.message);
  return data as ShopOrder;
}

export async function updateShopOrderPayment(
  squarePaymentId: string,
  patch: { payment_status: string; payment_method?: string; status?: string }
) {
  const payload: Record<string, unknown> = {
    payment_status: patch.payment_status,
    updated_at: new Date().toISOString(),
  };
  if (patch.payment_method) payload.payment_method = patch.payment_method;
  if (patch.status) payload.status = patch.status;
  const { data, error } = await getClient()
    .from('shop_orders')
    .update(payload)
    .eq('square_payment_id', squarePaymentId)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as ShopOrder;
}

export async function listShopOrders(): Promise<ShopOrder[]> {
  const { data, error } = await getClient().from('shop_orders').select('*').order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data || []) as ShopOrder[];
}

// 按订单主键 id 更新（checkout 同步回写）
export async function updateShopOrder(
  id: string,
  patch: {
    payment_status: string;
    payment_method?: string;
    status?: string;
    square_payment_id?: string;
  }
): Promise<void> {
  const payload: Record<string, unknown> = {
    payment_status: patch.payment_status,
    updated_at: new Date().toISOString(),
  };
  if (patch.payment_method) payload.payment_method = patch.payment_method;
  if (patch.status) payload.status = patch.status;
  if (patch.square_payment_id) payload.square_payment_id = patch.square_payment_id;
  const { error } = await getClient().from('shop_orders').update(payload).eq('id', id);
  if (error) throw new Error(error.message);
}

function getClient() {
  return getSupabaseClient();
}