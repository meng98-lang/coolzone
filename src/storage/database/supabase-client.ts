import { createClient, SupabaseClient } from '@supabase/supabase-js';

let cachedClient: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient {
  if (cachedClient) return cachedClient;

  const url = process.env.COZE_SUPABASE_URL || 'https://placeholder.supabase.co';
  const anonKey = process.env.COZE_SUPABASE_ANON_KEY || 'placeholder-key';

  cachedClient = createClient(url, anonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return cachedClient;
}

export { getSupabaseClient };
