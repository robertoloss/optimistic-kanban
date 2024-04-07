import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

export function createClient() {

  return (() => {

		return createServerClient(
			process.env.NEXT_PUBLIC_SUPABASE_URL!,
			process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
			{
				cookies: {
					get(name: string) {
						return cookies().get(name)?.value;
					},
					set(name: string, value: string, options: CookieOptions) {
						try {
							cookies().set({ name, value, ...options });
						} catch (error) {
							console.error(error)
						}
					},
					remove(name: string, options: CookieOptions) {
						try {
							cookies().set({ name, value: "", ...options });
						} catch (error) {
							console.error()
						}
					},
				},
			},
		)
	})()
};
