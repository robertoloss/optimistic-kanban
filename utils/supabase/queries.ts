import { Column, Project, Task } from "@prisma/client"
import { createClient } from "@/utils/supabase/client"

export const supabase = createClient()

export async function supaFetchProject({ projectId } : {
	projectId: string
}) {
	try {
		const { data } = await supabase
			.from('Project')
			.select()
			.eq('id', projectId)
		if (data && data.length > 0) {
			const project : Project = data[0]
			return project
		}
	} catch(error) {
		console.error(error)
	}
}

export async function supaUpdateProject({ newTitle, projectId } : {
	newTitle: string,
	projectId: string
}) {
	try {
		const { data } = await supabase
			.from('Project')
			.update({
				title: newTitle
			})
			.eq('id', projectId)
			.select()
		if (data) {
			const project : Project = data[0] 
			return project
		}
	} catch(error) {
		console.error(error)
	}
}

export async function supaUpdateColumn({ newTitle, columnId } : {
	newTitle: string,
	columnId: string
}) {
	try {
		await supabase
			.from('Column')
			.update({
				title: newTitle
			})
			.eq('id', columnId)
			.select()
	} catch(error) {
		console.error(error)
	}
}

export async function supaUpdateTask({ newTitle, newContent, taskId} : {
	newTitle: string,
	newContent: string
	taskId: string
}) {
	try {
		await supabase
			.from('Task')
			.update({
				title: newTitle,
				content: newContent
			})
			.eq('id', taskId)
	} catch(error) {
		console.error()
	}
}

export async function supaDeleteProject(projectId: string) {
	try {
		const { data } = await supabase
			.from("Project")
			.delete()
			.eq('id', projectId)
			.select()
		if (data) {
			return data[0] as Project
		}
	} catch(error) {
		console.error(error)
	}
}

export async function supaCreateProject(title: string, owner: string) {
	try {
		const { data } = await supabase
			.from("Project")
			.insert({
				title,
				owner
			})
			.select()
		if (data) {
			const project : Project = data[0]
			return project
		}
	} catch (error) {
		console.error(error)
	}
}

export async function supaFetchCols( projectId: string) {
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
export async function supaDeleteColumn(column: Column) {
	//console.log("trying to delete column: ", column)
	try {
		await supabase.from('Column')
			.delete()
			.eq('id', column.id)
	} catch (error) {
		console.error(error)
	}
}
export async function supaDeleteTask(task: Task) {
	try {
		await supabase.from('Task')
			.delete()
			.eq('id', task.id)
	} catch (error) {
		console.error(error)
	}
}
export async function supaCreateColumn(
		data: FormData,
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
) {
	try {
		const { data: { user } } = await supabase.auth.getUser()
		await supabase.rpc(
			'update_position_for_column', 
			{ column_id_value: column.id }
		)
		await supabase.from('Task')
			.insert([ {...input, owner: user?.id }])
	} catch(error) {
		console.error(error)
	}
}

export async function supaFetchProjects(projectId: string) {
	try {
		const { data: { user } } = await supabase.auth.getUser()
		const { data } = await supabase
			.from('Project')
			.select()
			.eq('id', projectId)
			.eq('owner', user?.id)
		if (data) {
			const res : Project[] = [...data]
			return res
		}
		return data
	} catch (error) {
		console.error(error)
	}
}

export async function supaFetchAllProjects() {
	try {
		const { data: { user } } = await supabase.auth.getUser()
		const { data } = await supabase
			.from('Project')
			.select('*')
			.eq('owner', user?.id)
			.order('created_at', { ascending: true })
		if (data) {
			const res : Project[] = [...data]
			return res
		}
		return data
	} catch (error) {
		console.error(error)
	}
}

export async function supaFetchAllCols() {
	try {
		const { data: { user } } = await supabase.auth.getUser()
		let { data }  = await supabase
			.from('Column')
			.select('*')
			.eq('owner', user?.id)
			.order('position', { ascending: true })
		if (data) {
			const res : Column[] = [...data]
			return res
		}
	} catch(error) {
		console.error("Error: ", error)
	}
}

export async function supaFetchAllTasks() {
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



