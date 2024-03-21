import { Dispatch, SetStateAction } from "react";
import { actionUpdateColumnsPositions, actionUpdateTasksPositions } from "@/app/actions/actions";
import { DragEndEvent } from "@dnd-kit/core";
import { Column, Task } from "@prisma/client";

async function updateColumnsPositions(columns: Column[]) {
	await actionUpdateColumnsPositions({ columns })
}
async function updateTasksPositions(tasks : Task[]) {
	await actionUpdateTasksPositions({ tasks })
}
type Props = {
	setActiveColumn: Dispatch<SetStateAction<Column | null>>,
	setActiveTask: Dispatch<SetStateAction<Task | null>>,
	tasks: Task[] | null,
	columns: Column[] | null
	setUpdating: Dispatch<SetStateAction<boolean>>
}
export default function dragEndHandler({
	setActiveColumn,
	setActiveTask,
	tasks,
	columns,
	setUpdating
} : Props) {
	return (_event: DragEndEvent) => {
		tasks && updateTasksPositions(tasks)
		columns && updateColumnsPositions(columns)
		columns && setUpdating(true)

		setActiveColumn(null);
		setActiveTask(null);
		//const { active, over } = event;
		//if (!over) return;

		//const activeId = active.id;
		//const overId = over.id;
		//if (activeId === overId) return;

		//const isActiveAColumn = active.data.current?.type === "Column";
		//if (!isActiveAColumn) return;
		
	};
}
