import { DragOverEvent, UniqueIdentifier } from "@dnd-kit/core";
import { Task } from "@prisma/client";
import { Dispatch, SetStateAction } from "react";


type Props = {
	setTasks: Dispatch<SetStateAction<Task[] | null>>
}
export default function dragOverHandler({ setTasks } : Props) {
	return (event: DragOverEvent) => {
		const { active, over } = event;
		if (!over) return;

		const activeId = active.id;
		const overId = over.id;
		if (activeId === overId) return;

		const isActiveATask = active.data.current?.type === "Task";
		const isOverATask = over.data.current?.type === "Task";
		if (!isActiveATask) return;

		if (isActiveATask && isOverATask) {
			//console.log("task")
			setTimeout(() => setTasks((tasks) => {
				let newTasks : Task[] = []
				if (tasks) {
					const task1 = tasks.filter((t) => (t.id as unknown) as UniqueIdentifier === activeId)[0];
					const task2 = tasks.filter((t) => (t.id as unknown) as UniqueIdentifier === overId)[0];

					const [id1, col1, position1] = [task1.id, task1.columnId, task1.position]
					const [_id2, col2, position2] = [task2.id, task2.columnId, task2.position]

					newTasks = tasks.map(t => ({
						id: t.id,
						created_at: t.created_at,
						title: t?.title,
						content: t?.content,
						columnId: t.id === id1 ? col2 : t.columnId,
						position: col1 === col2 ? 
												position1! < position2! ?
													(t.position! > position1! && t.position! <= position2! && t.id != id1 && t.columnId === col2) ?
														t.position! - 1 :
															t.id === id1 ? position2 : t.position :
													(t.position! >= position2! && t.id != id1 && t.columnId === col2) ?
														t.position! + 1 :
															t.id === id1 ? position2 : t.position :
											(t.position! >= position2! && t.id != id1 && t.columnId == col2) ?
														t.position! + 1 :
															t.id === id1 ? position2 : t.position
					}))
				}
				return newTasks
			}), 50)
		}

		const isOverAColumn = over.data.current?.type === "Column";
		if (isActiveATask && isOverAColumn) {
			//console.log("column")
			setTimeout(() => setTasks((tasks) => {
				let newTasks : Task[] = []
				if (tasks) {
					const task1 = tasks.filter((t) => (t.id as unknown) as UniqueIdentifier === activeId)[0];
					let newTask1: Task = { ...task1, columnId: (over.id as string) };

					const differentColumn = task1.columnId != over.id;
					//const columnIsEmpty = tasks.filter(t => t.columnId === over.id).length === 0 
					const numTasksInColumn = tasks.filter(t => t.columnId === over.id).length 

					if (differentColumn) {
						newTask1 = {
							...task1,
							columnId: over.id as string,
							position: numTasksInColumn 
						}
					}
					newTasks = tasks.map(t => {
							if (t.id === newTask1.id) return newTask1;
							return t;
					});
				}
				return newTasks
			}), 50)
		}
	}
}



