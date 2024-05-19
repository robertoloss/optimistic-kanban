'use client'
import { createClient } from "@/utils/supabase/client";
import { useEffect } from "react";



export default function UpdatePassword() {
	const supabase = createClient()
	useEffect(() => {
		supabase.auth.onAuthStateChange(async (event, session) => {
			if (event == "PASSWORD_RECOVERY") {
				const newPassword = prompt("What would you like your new password to be?");
				if (newPassword) {
					const { data, error } = await supabase.auth
						.updateUser({ password: newPassword })
					if (data) alert("Password updated successfully!")
					if (error) alert("There was an error updating your password.")
				}
			}
		})
	}, [])
	return (
		<div>
			Update Password
		</div>
	)
}
