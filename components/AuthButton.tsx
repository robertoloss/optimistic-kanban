"use server"
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { cn } from "@/lib/utils";
import { actionSignOut } from "@/app/actions/actions";
import { SubmitButton } from "@/app/login/submit-button";

export default async function AuthButton({ drawer } : { drawer? : boolean}) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();


  return user ? (
    <div className={cn(
			`flex items-center gap-4`,
			{
				'flex-col': drawer
			}
		)}>
      Hey, {user.email}!
			<ThemeToggle />
			<form>
				<SubmitButton
					pendingText="Logging out..."	
					formAction={actionSignOut}
				>
					Logout
				</SubmitButton>
			</form>
			{/*<form action={actionSignOut}>
			<button className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover">
			Logout
			</button>
			</form>*/}
    </div>
  ) : (
    <Link
      href="/login"
      className="py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
    >
      Login
    </Link>
  );
}
