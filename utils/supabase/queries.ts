import { Column, Project, Task } from "@prisma/client"
import { createClient } from "@/utils/supabase/client"
import { Dispatch, SetStateAction } from "react"

export const supabase = createClient()

export async function supaFetchCols( projectId: string) {
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
}
export async function supaFetchTasks(projectId: string) {
	const { data: { user } } = await supabase.auth.getUser()
	let { data }  = await supabase
		.from('Task')
		.select('*')
		.eq('owner', user?.id)
		.eq('project', projectId)
	if (data) {
		const res : Task[] = [...data]
		return res
	}
}
export async function supaDeleteColumn(column: Column, setTriggerUpdate: Dispatch<SetStateAction<boolean>>) {
	console.log("trying to delete column: ", column)
	try {
		await supabase.from('Column')
			.delete()
			.eq('id', column.id)
		setTriggerUpdate(prev => !prev)
	} catch (error) {
		console.error(error)
	}
}
export async function supaDeleteTask(task: Task, setTriggerUpdate: Dispatch<SetStateAction<boolean>>) {
	try {
		await supabase.from('Task')
			.delete()
			.eq('id', task.id)
		setTriggerUpdate(prev => !prev)
	} catch (error) {
		console.error(error)
	}
}
export async function supaCreateColumn(
		data: FormData,
		setTriggerUpdate: Dispatch<SetStateAction<boolean>>,
		numOfCols: number | undefined,
		projectId: string
) {
	try {
		const { data: { user } } = await supabase.auth.getUser()
		await supabase.from('Column')
			.insert([
				{
					title: data.get('title'),
					position: numOfCols ? numOfCols : 0,
					owner: user?.id,
					project: projectId
				}
			])
		setTriggerUpdate(prev => !prev)
	} catch(error) {
		console.error(error)
	}
} 
export async function supaCreateTask(
	input: {
		title: FormDataEntryValue | null
		content: FormDataEntryValue | null 
		columnId: string | null
		position: number 
	},
	column: Column,
	setTriggerUpdate: Dispatch<SetStateAction<boolean>>
) {
	try {
		const { data: { user } } = await supabase.auth.getUser()
		await supabase.rpc(
			'update_position_for_column', 
			{ column_id_value: column.title }
		)
		await supabase.from('Task')
			.insert([ {...input, owner: user?.id }])
		setTriggerUpdate(prev => !prev)
	} catch(error) {
		console.error(error)
	}
}

export async function supaFetchProjects(projectId: string) {
	try {
		const { data } = await supabase
			.from('Project')
			.select()
			.eq('id', projectId)
		if (data) {
			const res : Project[] = [...data]
			return res
		}
		return data
	} catch (error) {
		console.error(error)
	}
}
