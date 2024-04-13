import { DragOverEvent } from "@dnd-kit/core";
import { Column, Task } from "@prisma/client";
import { Dispatch, SetStateAction } from "react";
import updateTaskOverTask from "./updateTaskOverTask";
import updateTaskOverColumn from "./updateTaskOverColumn";
import updateColumnOverColumn from "./updateColumnOverColumn";

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
			updateTaskOverTask({activeId, overId, setTasks})
		}
		if (isActiveATask && isOverAColumn) {
			updateTaskOverColumn({activeId, over, setTasks})
		}
		if (isActiveAColumn && isActiveAColumn) {
			updateColumnOverColumn({setColumns, activeId, overId})
		}
	}
}



