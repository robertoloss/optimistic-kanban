import { Over, UniqueIdentifier } from "@dnd-kit/core";
import { Task } from "@prisma/client";

type Props = {
	activeId: UniqueIdentifier,
	over: Over | null,
	tasks: Task[] | null,
	setTasks: (tasks: Task[]) => void,
}
export default function updateTaskOverColumn({ activeId, over, tasks, setTasks } : Props) {	

	setTimeout(() => {		
		console.log("task over col")

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
			setTasks(newTasks)
		}
	}, 0)





	//setTimeout(() => setTasks((tasks) => {
	//	console.log("task over col")
	//	let newTasks : Task[] = []
	//	if (tasks && over) {
	//		const task1 = tasks.filter((t) => (t.id as unknown) as UniqueIdentifier === activeId)[0];
	//		let newTask1: Task = { ...task1, columnId: over.id as string };
	//		const numTasksInColumn = tasks.filter(t => t.columnId === over.id).length 
	//		newTask1 = {
	//			...task1,
	//			columnId: over.id as string,
	//			position: numTasksInColumn 
	//		}
	//		newTasks = [...tasks]
	//		const tasksInOverColumn = newTasks
	//			.filter(t => t.columnId === over.id)
	//			.sort((a,b) => a.position! - b.position!)
	//		tasksInOverColumn.forEach((t,i) => {
	//			t.position = i
	//		})
	//		newTasks = newTasks.filter(t => t.columnId != over.id)
	//		newTasks = [...newTasks, ...tasksInOverColumn]
	//		newTasks = newTasks.map(t => {
	//				if (t.id === newTask1.id) return newTask1;
	//				return t;
	//		});
	//	}
	//	return newTasks
	//}), 0)
}
