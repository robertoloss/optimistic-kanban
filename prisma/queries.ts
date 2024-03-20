import { Task } from "@prisma/client";
import prisma from "./client";

export const getColumns = async () => {
	["getColumns"]
	try {
		const columns = await prisma.column.findMany()
		return columns
	} catch (error) {
		console.error(error)
	}
}

export const getTasks = async () => {
["getTasks"]
try {
		return await prisma.task.findMany();
	} catch( error ) {
		console.log(error);
	}
}

export const updateTasksPositions = async({ tasks } : { tasks: Task[] }) => {
	console.log("updating tasks positions")
	for (const task of tasks) {
		try {
			await prisma.task.update({
				where: { id: task.id },
				data: { 
					position: task.position, 
					columnId: task.columnId,
				}
			})
		} catch(error) {
			console.error(error)
		}
	}
}



