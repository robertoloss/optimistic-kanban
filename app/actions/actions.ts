'use server'
import { revalidateTag } from "next/cache"
import { createClient } from "@/utils/supabase/server"
import { Column, Project, Task } from "@prisma/client"

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
			await supabase.from('Project')
				.insert({
					title: title,
					owner: id
				})
			revalidateTag("getNumberOfColumns")
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
		revalidateTag("getNumberOfColumns")
	} catch (error) {
		console.error(error)
	}
}

export async function actionDeleteTask({ id } : { id: string }) {
	console.log("action delete Task")
	try {
		await supabase.from('Task')
			.delete()
			.eq('id',id)
		revalidateTag("actionFetchAllTasks")
	} catch (error) {
		console.error(error)
	}
}
export async function actionCreateTask(task : {
	title: string,
	content:  string,
	columnId:  string,
	position: number,
	owner: string | null,
	project: string
}) {
	console.log("action create Task")
	try {
		await supabase.rpc(
			'update_position_for_column', 
			{ column_id_value: task.columnId}
		)
		await supabase.from('Task')
			.insert(task)
		revalidateTag("actionFetchAllTasks")
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
			console.log("columns fetched")
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
			console.log("tasks fetched")
			return res
		}
	} catch(error) {
		console.error("Error: ", error)
	}
}

export async function actionUpdateTasks(tasks: Task[]) {
	try {
		await supabase
			.from('Task')
			.upsert(tasks)
		revalidateTag("actionFetchAllTasks")
	} catch (error) {
		console.error(error)
	}
}

export async function actionUpdateColumns(columns: Column[]) {
	try {
		await supabase
			.from('Column')
			.upsert(columns.map((col,i) => ({...col, position: i})))
		revalidateTag("actionFetchAllCols")
	} catch (error) {
		console.error(error)
	}
}

export async function revalidateActionFetchAllCols() {
	revalidateTag("actionFetchAllCols")
}
export async function revalidateActionFetchAllTasks() {
	revalidateTag("actionFetchAllTasks")
}







