'use client'
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function UpdatePassword() {
	const supabase = createClient()
	const router = useRouter()
	useEffect(() => {
		console.log("use effect")
		supabase.auth.onAuthStateChange(async (event, session) => {
			const newPassword = prompt("What would you like your new password to be?");
			if (newPassword) {
				console.log("new password")
				const { data, error } = await supabase.auth.updateUser({ password: newPassword })
				router.push(`kanban/home`)
			}
		})
	}, [])
	return (
		<div>
			Update Password
		</div>
	)
}
