'use client'

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { SubmitButton } from "../login/submit-button";

export default function UpdatePassword() {
  const supabase = createClient();
  const router = useRouter();

	async function resetPassword(formData: FormData) {
		const { error } = await supabase.auth.updateUser(
			{ password: formData.get('password') as string },
		);
		if (error) {
			alert("There was an error updating your password.");
			console.error(error);
		} else {
			alert("Password updated successfully!");
			router.push(`/kanban/home`);
		}
	};


  return ( 
		<div className="flex flex-col w-full h-screen items-center justify-center">
			<div className="flex flex-col w-full px-8 sm:max-w-md items-center justify-center gap-2">
				<form className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground">
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
						formAction={resetPassword}
						className="bg-green-700 rounded-md px-4 py-2 text-foreground mb-2"
						pendingText="Resetting password..."
					>
						Reset Password
					</SubmitButton>
				</form>
			</div>
		</div>
	)
}
