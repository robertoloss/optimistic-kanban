import { Dispatch, SetStateAction } from "react";
import { ColumnType, TaskType } from "@/components/kanban/types";
import { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";


export default function dragEndHandler(
	setActiveColumn: Dispatch<SetStateAction<ColumnType | null>>,
	setActiveTask: Dispatch<SetStateAction<TaskType | null>>,
	setColumns: Dispatch<SetStateAction<ColumnType[]>>,
) {
	return (event: DragEndEvent) => {
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
