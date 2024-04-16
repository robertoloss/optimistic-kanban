import { Store } from "@/utils/store/useStore";
import { Over, UniqueIdentifier } from "@dnd-kit/core";
import { Task } from "@prisma/client";

type Props = {
	activeId: UniqueIdentifier,
	over: Over | null,
	store: Store
	setStore: (store: Store) => void
}
export default function updateTaskOverColumn({ activeId, over, store, setStore  } : Props) {	
	setTimeout(() =>  {
		let newTasks : Task[] = []
		if (store.tasks && over) {
			const task1 = store.tasks.filter((t) => (t.id as unknown) as UniqueIdentifier === activeId)[0];
			let newTask1: Task = { ...task1, columnId: over.id as string };
			const numTasksInColumn = store.tasks.filter(t => t.columnId === over.id).length 
			newTask1 = {
				...task1,
				columnId: over.id as string,
				position: numTasksInColumn 
			}
			newTasks = [...store.tasks]
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
			setStore({ 
				...store, 
				tasks: newTasks,
				log: "updateTaskOverColumn"
			})
		}
	}, 1)
}
