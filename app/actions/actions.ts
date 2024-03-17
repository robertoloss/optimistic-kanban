'use server'
import { getTasks, updateTaskColumn, swapTasksPosition, updateTasksPositions } from "@/prisma/queries"
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


type PropsUpdateTaskColumn = {
	task: Task,
	newColumnId: string
}
export async function actionUpdateTaskColumn({ task, newColumnId } : PropsUpdateTaskColumn) {
	try {
		await updateTaskColumn({task, newColumnId})
		revalidateTag("getTasks")
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

export type PropsSwapTasksPosition = {
	task1: Task,
	task2: Task,
	tasks: Task[]
}
export async function actionSwapTasksPosition({ task1, task2, tasks } : PropsSwapTasksPosition) {
	try {
		await swapTasksPosition({ task1, task2, tasks})
		revalidateTag("getTasks")
	} catch(error) {
		console.error(error)
	}
}



