import { Over, UniqueIdentifier } from "@dnd-kit/core";
import { Task } from "@prisma/client";
import { Dispatch, SetStateAction } from "react";

type Props = {
	activeId: UniqueIdentifier,
	over: Over | null,
	setTasks: Dispatch<SetStateAction<Task[] | null >>
}
export default function updateTaskOverColumn({ activeId, over, setTasks } : Props) {	
	setTimeout(() => setTasks((tasks) => {
		let newTasks : Task[] = []
		if (tasks && over) {
			const task1 = tasks.filter((t) => (t.id as unknown) as UniqueIdentifier === activeId)[0];
			let newTask1: Task = { ...task1, columnId: over.id as string };
			const numTasksInColumn = tasks.filter(t => t.columnId === over.id).length 
			newTask1 = {
				...task1,
				columnId: over.id as string,
				position: numTasksInColumn 
			}
			newTasks = [...tasks]
			const tasksInOverColumn = newTasks
				.filter(t => t.columnId === over.id)
				.sort((a,b) => a.position! - b.position!)
			tasksInOverColumn.forEach((t,i) => {
				t.position = i
			})
			newTasks = newTasks.filter(t => t.columnId != over.id)
			newTasks = [...newTasks, ...tasksInOverColumn]
			newTasks = newTasks.map(t => {
					if (t.id === newTask1.id) return newTask1;
					return t;
			});
		}
		return newTasks
	}), 0)
}
