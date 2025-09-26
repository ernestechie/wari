import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

export const createSupabaseClient = async () => {
  const isServer = typeof window === "undefined";

  if (isServer) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    console.log("USING_SERVER_CLIENT");

    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();

    return createServerClient<Database>(supabaseUrl!, supabaseKey!, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        async setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    });
  } else {
    console.log("USING_BROWSER_CLIENT");

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    return createClient<Database>(supabaseUrl!, supabaseKey!);
  }
};
