import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { getEnv } from '../../../OrchestraLayer/Utilities/envUtils';

let client: SupabaseClient | null = null;

export function isSupabaseConfigured(): boolean {
  const url = getEnv('VITE_SUPABASE_URL');
  const key = getEnv('VITE_SUPABASE_ANON_KEY');
  return Boolean(url?.trim() && key?.trim());
}

/** Returns a singleton client, or null if URL / anon key are not set. */
export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;
  if (!client) {
    client = createClient(getEnv('VITE_SUPABASE_URL'), getEnv('VITE_SUPABASE_ANON_KEY'), {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }
  return client;
}
