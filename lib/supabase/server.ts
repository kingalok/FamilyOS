import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

type SupabaseCookie = {
  name: string;
  value: string;
  options?: Record<string, unknown>;
};

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    throw new Error("Supabase server environment variables are missing.");
  }

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: SupabaseCookie[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }: SupabaseCookie) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Components can read cookies but may not always be allowed to write them.
        }
      }
    }
  });
}
