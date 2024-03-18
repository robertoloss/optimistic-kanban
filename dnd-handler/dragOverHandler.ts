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
			setTimeout(() => setTasks((tasks) => {
				let newTasks : Task[] = []
				if (tasks) {
					const task1 = tasks.filter((t) => (t.id as unknown) as UniqueIdentifier === activeId)[0];
					const task2 = tasks.filter((t) => (t.id as unknown) as UniqueIdentifier === overId)[0];

					const newTask1: Task = { 
						...task1, 
						position: task2.position,
						columnId: task1.columnId != task2.columnId ? task2.columnId : task1.columnId
					};
					const newTask2: Task = { ...task2, position: task1.position };

					newTasks = tasks.map(t => {
							if (t.id === newTask1.id) return newTask1;
							if (t.id === newTask2.id) return newTask2;
							return t;
					});
				}
				return newTasks
			}), 50)
		}

		const isOverAColumn = over.data.current?.type === "Column";
		if (isActiveATask && isOverAColumn) {
			setTimeout(() => setTasks((tasks) => {
				let newTasks : Task[] = []
				if (tasks) {
					const task1 = tasks.filter((t) => (t.id as unknown) as UniqueIdentifier === activeId)[0];
					const newTask1: Task = { ...task1, columnId: (over.id as string) };
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



