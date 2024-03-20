'use server'
import { getTasks, updateTasksPositions } from "@/prisma/queries"
import { Task } from "@prisma/client"
import { revalidateTag } from "next/cache"


export async function actionGetTasks() {
	try {
		const res = await getTasks()
		return res
	} catch(error) {
		console.error(error) 
	}
}


export async function actionUpdateTasksPositions({ tasks } : { tasks: Task[] }) {
	try {
		await updateTasksPositions({ tasks })
		revalidateTag("getTasks")
	} catch(error) {
		console.error(error)
	}
}






