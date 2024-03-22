import { DragOverEvent, UniqueIdentifier } from "@dnd-kit/core";
import { Column, Task } from "@prisma/client";
import { Dispatch, SetStateAction } from "react";

type Props = {
	setTasks: Dispatch<SetStateAction<Task[] | null>>
	setColumns: Dispatch<SetStateAction<Column[] | null>>
}
export default function dragOverHandler({ setTasks, setColumns } : Props) {
	return (event: DragOverEvent) => {
		const { active, over } = event;
		if (!over) return;

		const activeId = active.id;
		const overId = over.id;
		if (activeId === overId) return;

		const isActiveATask = active.data.current?.type === "Task";
		const isOverATask = over.data.current?.type === "Task";
		const isActiveAColumn = active.data.current?.type === "Column";
		const isOverAColumn = over.data.current?.type === "Column";

		if (isActiveATask && isOverATask) {
			//console.log("task")
			setTimeout(() => setTasks((tasks) => {
				let newTasks : Task[] = []
				if (tasks) {
					const task1 = tasks.filter((t) => (t.id as unknown) as UniqueIdentifier === activeId)[0];
					const task2 = tasks.filter((t) => (t.id as unknown) as UniqueIdentifier === overId)[0];
					//console.log("tasks: ", tasks)

					const [id1, col1, position1] = [task1.id, task1.columnId, task1.position]
					const [_id2, col2, position2] = [task2.id, task2.columnId, task2.position]

					//console.log(col1, position1, col2, position2)

					newTasks = tasks.map(t => {
						//console.log(t)
						return {
							id: t.id,
							created_at: t.created_at,
							title: t?.title,
							content: t?.content,
							columnId: t.id === id1 ? col2 : t.columnId,
							position: 
								col1 === col2 ?  
									position1! < position2! ? 
										(t.position! > position1! && t.position! <= position2! && t.id != id1 && t.columnId === col2) ? 
											t.position! - 1
											: t.id === id1 ? 
													position2 
													: t.position 
												: (t.position! >= position2! && t.id != id1 && t.columnId === col2) ?
											t.position! + 1
												: t.id === id1 ? 
													position2 
													: t.position
									: (t.position! >= position2! && t.id != id1 && t.columnId == col2) ?
										t.position! + 1 
										:	t.id === id1 ? 
											position2 
											: t.position
					}})
					//console.log("tasks: ", tasks)
				}
				return newTasks
			}), 0)
		}


		if (isActiveATask && isOverAColumn) {
			//console.log("column")
			setTimeout(() => setTasks((tasks) => {
				let newTasks : Task[] = []
				if (tasks) {
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

		if (isActiveAColumn && isActiveAColumn) {
			setTimeout(() => 
				setColumns((columns) => {
					const activeColumn = columns?.filter((col) => col.title === activeId)[0];
					const overColumn = columns?.filter((col) => col.title === overId)[0];
					if (columns && activeColumn != undefined && overColumn != undefined) {
						const res = columns.map(col => {
							if (col.title === activeId) return {...overColumn, position: activeColumn.position}
							if (col.title === overId) return {...activeColumn, position: overColumn.position};
							return col
						})	
						return res
					} else return [] 
			}), 0)
		}
	}
}



