import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseClient: SupabaseClient | null = null;

export function getSupabase() {
  if (!supabaseClient) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing Supabase environment variables');
    }

    supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      realtime: {
        params: {
          eventsPerSecond: 10
        }
      }
    });
  }
  
  return supabaseClient;
}

export const supabase = new Proxy({} as SupabaseClient, {
  get(target, prop, receiver) {
    const client = getSupabase();
    return Reflect.get(client, prop, receiver);
  }
});