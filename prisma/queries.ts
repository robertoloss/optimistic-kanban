import { Task, Column } from "@prisma/client";
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

export const updateColumnPositions = async({ columns } : { columns: Column[] }) => {
	console.log("updating columns positions")
	console.log("input: ", columns)
	for (let i=0; i<columns.length; i++) {
		try {
			console.log("COLUMN:", columns[i])
			await prisma.column.update({
				where: { id: columns[i].id},
				data: {
					position: i
				}
			})
		} catch(error) {
		console.log(error)
		}
	}
}



