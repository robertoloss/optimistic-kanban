'use server'
import { revalidatePath, revalidateTag } from "next/cache"
import { createClient } from "@/utils/supabase/server"
import { Column, Project, Task } from "@prisma/client"

const supabase = createClient()

export async function actionCreateProject({ title } : { title: string }) {
	console.log("action create Project")
	try {
		const { data: { user }} = await supabase.auth.getUser()
		if (user) {
			const id = user.id
			const { data } = await supabase.from('Project')
				.insert({
					title: title,
					owner: id
				})
				.select()
			if (data) {
				const res : Project =data[0]
				return res
			}
			revalidatePath('/kanban', 'layout')
		}
	} catch (error) {
		console.error(error)
	}
}

export async function actionDeleteProject({ id } : { id: string }) {
	console.log("action delete Project")
	try {
		await supabase.from('Project')
			.delete()
			.eq('id',id)
		revalidatePath('/kanban', 'layout')
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
	["actionFetchAllProjects"]
	try {
		const { data: { user } } = await supabase.auth.getUser()
		const { data } = await supabase
			.from('Project')
			.select()
			.eq('owner',user?.id)
			.order('created_at', {ascending: true})
		if (data) {
			const res : Project[] = [...data]
			return res
		}
		return data
	} catch (error) {
		console.error(error)
	}
}

export async function actionFetchAllCols() {
	["actionFetchAllCols"]
	try {
		const { data: { user } } = await supabase.auth.getUser()
		let { data }  = await supabase
			.from('Column')
			.select('*')
			.eq('owner', user?.id)
		if (data) {
			const res : Column[] = [...data]
			return res
		}
	} catch(error) {
		console.error("Error: ", error)
	}
}

export async function actionFetchAllTasks() {
	["actionFetchAllTasks"]
	try {
		const { data: { user } } = await supabase.auth.getUser()
		let { data }  = await supabase
			.from('Task')
			.select('*')
			.eq('owner', user?.id)
		if (data) {
			const res : Task[] = [...data]
			return res
		}
	} catch(error) {
		console.error("Error: ", error)
	}
}









