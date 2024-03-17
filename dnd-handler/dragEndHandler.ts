import { Dispatch, SetStateAction } from "react";
import { actionUpdateTasksPositions } from "@/app/actions/actions";
import { ColumnType } from "@/components/kanban/types";
import { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { Task } from "@prisma/client";

async function updateTasksPositions(tasks : Task[], setSync: Dispatch<SetStateAction<boolean>>) {
	await actionUpdateTasksPositions({ tasks })
	setTimeout(()=>setSync(prev => !prev),500)
}

export default function dragEndHandler(
	setActiveColumn: Dispatch<SetStateAction<ColumnType | null>>,
	setActiveTask: Dispatch<SetStateAction<Task | null>>,
	setColumns: Dispatch<SetStateAction<ColumnType[]>>,
	tasks: Task[] | null,
	setSync: Dispatch<SetStateAction<boolean>>,
) {
	return (event: DragEndEvent) => {
		tasks && updateTasksPositions(tasks, setSync)
		
		setActiveColumn(null);
		setActiveTask(null);
		const { active, over } = event;
		if (!over) return;

		const activeId = active.id;
		const overId = over.id;
		if (activeId === overId) return;

		const isActiveAColumn = active.data.current?.type === "Column";
		if (!isActiveAColumn) return;
		
		setColumns((columns: ColumnType[]) => {
			const activeColumnIndex = columns.findIndex((col) => col.id === activeId);
			const overColumnIndex = columns.findIndex((col) => col.id === overId);

			return arrayMove(columns, activeColumnIndex, overColumnIndex)
		})
	};
}
