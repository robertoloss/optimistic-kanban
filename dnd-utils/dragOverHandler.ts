import { DragOverEvent } from "@dnd-kit/core";
import { Column, Task } from "@prisma/client";
import updateTaskOverTask from "./updateTaskOverTask";
import updateTaskOverColumn from "./updateTaskOverColumn";
import updateColumnOverColumn from "./updateColumnOverColumn";

type Props = {
	tasks: Task[] | null,
	columns: Column[] | null,
	setTasks: (tasks: Task[]) => void,
	setColumns: (columns: Column[]) => void
}
export default function dragOverHandler({ tasks, columns, setTasks, setColumns } : Props) {
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
			updateTaskOverTask({ activeId, overId, setTasks, tasks })
		}
		if (isActiveATask && isOverAColumn) {
			updateTaskOverColumn({activeId, over, setTasks, tasks })
		}
		if (isActiveAColumn && isActiveAColumn) {
			updateColumnOverColumn({ activeId, overId, setColumns, columns})
		}
	}
}



