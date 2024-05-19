import Link from "next/link";
import { headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { SubmitButton } from "./submit-button";
import { createFirstProjectColumnsTasks } from "../actions/actions";

export default function Login({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  const signIn = async (formData: FormData) => {
    "use server";

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return redirect("/login?message=Could not authenticate user");
    }

    return redirect("/kanban/home");
  };

  const signUp = async (formData: FormData) => {
    "use server";

    const origin = headers().get("origin");
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = createClient();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });
		createFirstProjectColumnsTasks()


    if (error) {
			console.error(error)
      return redirect("/login?message=Could not authenticate user");
    }

    return redirect(`/login?message=You can now login using these credentials (click "Sign In")`);
  };

	async function sendResetPassword(formData: FormData) {
		"use server"
		const supabase = createClient() 
    const origin = headers().get("origin");
		const { data, error } = await supabase.auth
			.resetPasswordForEmail(
				formData.get("email") as string, {
					redirectTo: `${origin}/update-password`
				}
			)
	}

  return (
		<div className="flex flex-col w-full h-screen items-center justify-center">
			<div className="flex flex-col w-full px-8 sm:max-w-md items-center justify-center gap-2">
				<Link
					href="/"
					className="absolute left-8 top-8 py-2 px-4 rounded-md no-underline 
						text-foreground bg-btn-background hover:bg-btn-background-hover flex items-center group text-sm"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
					>
						<polyline points="15 18 9 12 15 6" />
					</svg>{" "}
					Back
				</Link>

				<form className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground">
					<label className="text-md" htmlFor="email">
						Email
					</label>
					<input
						className="rounded-md px-4 py-2 bg-inherit border mb-6"
						name="email"
						placeholder="you@example.com"
						required
					/>
					<label className="text-md" htmlFor="password">
						Password
					</label>
					<div className="flex flex-col gap-y-2">
						<input
							className="rounded-md px-4 py-2 bg-inherit border"
							type="password"
							name="password"
							placeholder="•••••"
						/>
						<p className="text-sm mb-6 text-muted-foreground">
							Passwords must be at least 6 characters long
						</p>
					</div>
					<SubmitButton
						formAction={signIn}
						className="bg-green-700 rounded-md px-4 py-2 text-foreground mb-2"
						pendingText="Signing In..."
					>
						Sign In
					</SubmitButton>
					<SubmitButton
						formAction={signUp}
						className="border border-foreground/20 rounded-md px-4 py-2 text-foreground mb-2"
						pendingText="Signing Up..."
					>
						Sign Up
					</SubmitButton>
					{searchParams?.message && (
						<p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
							{searchParams.message}
						</p>
					)}
					<SubmitButton
						formAction={sendResetPassword}
						className="self-center mt-2 rounded-md text-foreground mb-2 hover:text-destructive transition w-fit h-fit"
						pendingText="Sendind email to reset password..."
					>
						Forgot Password?	
					</SubmitButton>
				</form>
			</div>
		</div>
  );
}
