import { createClient } from "@supabase/supabase-js";

function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    throw new Error("Supabase environment variables are missing.");
  }

  return { url, key };
}

export function createSupabaseClient() {
  const { url, key } = getSupabaseEnv();
  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}
