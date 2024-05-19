'use server'
import { revalidateTag } from "next/cache"
import { createClient } from "@/utils/supabase/server"
import { Column, Project, Task } from "@prisma/client"
import { redirect } from "next/navigation";

const supabase = createClient()

export const actionSignOut = async () => {
	await supabase.auth.signOut();
	return redirect("/login");
};


export async function actionRevalidateFetchProjects() {
	revalidateTag("actionFetchAllProjects")
}

export async function actionUpdateProjectTitle({ newTitle, projectId } : {
	newTitle: string,
	projectId: string
}) {
	try {
		await supabase
			.from('Project')
			.update({
				title: newTitle
			})
			.eq('id', projectId)
	} catch(error) {
		console.error(error)
	}
}

export async function actionUpdateProjects(newProjects: Project[]) {
	try {
		if (newProjects.length > 0) {
			await supabase.from('Project')
				.upsert(newProjects)
			revalidateTag("actionFetchAllProjects")
		}
	} catch (error) {
		console.error(error)
	}
}

export async function actionCreateProject({ 
	title,
} : {
	title: string
}) {
	console.log("action create Project: ", title)
	try {
		const { data: { user }} = await supabase.auth.getUser()
		if (user) {
			console.log("User ok: ", user)
			const id = user.id
			const { count } = await supabase
				.from('Project')
				.select('*', { count: 'exact', head: true })
				.eq('owner', id)
			const { data } = await supabase.from('Project')
				.insert({
					title: title,
					owner: id,
					position: count
				})
				.select()
				console.log("DATA: ", data)
			if (data) {
				const res : Project = data[0]
				revalidateTag("actionFetchAllProjects")
				return res
			}
		}
		
	} catch (error) {
		console.error(error)
	}
}

export async function createFirstProjectColumnsTasks() {
	try {
		const { data: { user }} = await supabase.auth.getUser()
		if (!user) return
		const { data } = await supabase
			.from('Project')
			.insert({ title: 'First Project', owner: user.id, position: 0  })
			.select()
		if (!data || data.length === 0) {
			console.log("No data after project creation")
			return
		}
		const project = data[0]	
		const { data: columns } = await supabase
			.from('Column')
			.insert([
				{ title: 'To-Do',  project: project.id, owner: user.id, position: 0},
				{ title: 'In Progress',  project: project.id, owner: user.id, position: 1},
				{ title: 'Completed',  project: project.id, owner: user.id, position: 2 },
			])
			.select()
		if (!columns || columns.length != 3) return
		await supabase
			.from('Task')
			.insert([
				{ 
					title: 'First Task', 
					content: 'This is your first task! Edit it and/or move it to other columns!',
					position: 0,
					columnId: columns[0].id,
					project: project.id,
					owner: user.id
				},
				{ 
					title: 'Second Task', 
					content: 'This is your second task! Edit it and/or move it to other columns!',
					position: 1,
					columnId: columns[0].id,
					project: project.id,
					owner: user.id
				},
				{ 
					title: 'Third Task', 
					content: 'This is your third task! Edit it and/or move it to other columns!',
					position: 2,
					columnId: columns[0].id,
					project: project.id,
					owner: user.id
				},
			])
	} catch(error) {
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
			.order('position', {ascending: true})
		if (data) {
			const res : Project[] = [...data]
			return res
		}
		return data
	} catch (error) {
		console.error(error)
	}
}


export async function actionFetchAllProjectsAlpha() {
	["actionFetchAllProjects"]
	try {
		const { data: { user } } = await supabase.auth.getUser()
		const { data } = await supabase
			.from('Project')
			.select()
			.eq('owner',user?.id)
			.order('title', {ascending: true})
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


export async function actionFetchTasksOfProject({ projectId } : 
{ projectId: string }) {
	try {
		const { data } = await supabase
			.from('Task')
			.select()
			.eq('project', projectId)
		if (data) {
			const tasks : Task[] = data
			return tasks
		}
	} catch(error) {
		console.error(error)
	}
}









