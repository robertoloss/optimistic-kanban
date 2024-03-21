'use server'
import { updateColumnPositions, updateTasksPositions } from "@/prisma/queries"
import { Column, Task } from "@prisma/client"
import { revalidateTag } from "next/cache"


export async function actionUpdateTasksPositions({ tasks } : { tasks: Task[] }) {
	try {
		await updateTasksPositions({ tasks })
		revalidateTag("getTasks")
	} catch(error) {
		console.error(error)
	}
}

export async function actionUpdateColumnsPositions({ columns } : { columns: Column[]}) {
	try {
		await updateColumnPositions({ columns })
		revalidateTag("getColumns")
	} catch(error) {
		console.error(error)
	}
}






