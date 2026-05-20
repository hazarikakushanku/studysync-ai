import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// create supabase client for use in server components
export async function createClient() {
  let cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://dummy.supabase.co",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "dummy-anon-key",
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: any[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // this error can be ignored if middleware is refreshing sessions
          }
        },
      },
    }
  );
}
