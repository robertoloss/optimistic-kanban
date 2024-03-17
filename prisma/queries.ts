import { Task } from "@prisma/client";
import prisma from "./client";


export const getProfiles = async () => {
["getProfiles"]
try {
		const profiles = await prisma.profile.findMany();
		return profiles;
	} catch( error ) {
		console.log(error);
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

export const updateTaskColumn = async({ 
	task, newColumnId 
} : { 
	task: Task,
	newColumnId: string
}) => {
	["updateTaskColumn"]
	try {
		return await prisma.task.updateMany({
			where: { id: task.id },
			data: { columnId: newColumnId}
		})
	} catch (error) {
		console.error(error)
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

export const swapTasksPosition = async({ 
	task1, task2, tasks
} : { 
	task1: Task,
	task2: Task,
	tasks: Task[]
}) => {
	["swapTasksPosition"]
	try {
		const task1position = task1.position
		const tasksWithPosition2 = tasks.filter((task => task.position === task2.position && task.columnId === task2.columnId ))
		//console.log("tasksWithPosition2[0].id: ", tasksWithPosition2[0].id)
		//console.log("task2.id: ", task2.id)
		if (tasksWithPosition2.length > 1) {
			//console.log("more than one with pos2")
			return
		}
		if (tasksWithPosition2[0].id != task2.id) {
			//console.log(" the one with pos2 is not task2")
			return
		}
		await prisma.task.updateMany({
			where: { id: task1.id },
			data: { position: task2.position}
		})
		const tasksWithPosition1 = tasks.filter((task => 
			task.position === task1position && 
			task.columnId === task1.columnId 
		))
		//console.log("tasks with pos1: ", tasksWithPosition1)
		if (tasksWithPosition1.length > 0) {
			//console.log("tasks with pos1 > 0")
		}
		await prisma.task.updateMany({
			where: { id: task2.id },
			data: {position: task1position}
		})
	} catch (error) {
		console.error(error)
	}
}


