'use server'
import { revalidateTag } from "next/cache"
import { createClient } from "@/utils/supabase/server"

const supabase = createClient()

export async function actionCreateProject({ 
	title,
} : {
	title: string
}) {
	console.log("action create Project")
	try {
		const { data: { user }} = await supabase.auth.getUser()
		if (user) {
			const id = user.id
			//console.log(id)
			await supabase.from('Project')
				.insert({
					title: title,
					owner: id
				})
			revalidateTag('getProjects')
		}
		
	} catch (error) {
		console.error(error)
	}
}

export async function actionDeleteProject({
	id,
} : {
	id: string
}) {
	console.log("action delete Project")
	try {
		await supabase.from('Project')
			.delete()
			.eq('id',id)
		revalidateTag('getProjects')
	} catch (error) {
		console.error(error)
	}
}










