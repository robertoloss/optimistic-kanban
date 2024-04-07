'use server'
import { revalidateTag } from "next/cache"
import { createClient } from "@/utils/supabase/server"
import { Column, Project } from "@prisma/client"
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

export async function actionFetchCols({ projectId } : { projectId: string }) {
	try {
		const { data: { user } } = await supabase.auth.getUser()
		let { data }  = await supabase
			.from('Column')
			.select('*')
			.eq('owner', user?.id)
			.eq('project', projectId)
		if (data) {
			const res : Column[] = [...data]
			return res
		}
	} catch(error) {
		console.error("Error: ", error)
	}
}

export async function actionFetchAllProjects() {
	try {
		const { data: { user } } = await supabase.auth.getUser()
		console.log('supaFetchAllProjects: user: ', user)
		const { data } = await supabase
			.from('Project')
			.select()
		if (data) {
			const res : Project[] = [...data]
			return res
		}
		return data
	} catch (error) {
		console.error(error)
	}
}










