import { DragStartEvent } from "@dnd-kit/core";
import { ColumnType, TaskType } from "../components-new/types";
import { Dispatch, SetStateAction } from "react";


export default function dragStartHandler(
	setActiveColumn: Dispatch<SetStateAction<ColumnType | null>>,
	setActiveTask: Dispatch<SetStateAction<TaskType | null>>
) {
	return (event: DragStartEvent) => {
		if (event.active.data.current?.type === "Column") {
			//console.log(`Active item is: Column ${event.active.id}`)
			setActiveColumn(event.active.data.current.column);
			return;
		}

		if (event.active.data.current?.type === "Task") {
			//console.log(`Active item is: Task ${event.active.id}`)
			setActiveTask(event.active.data.current.task);
			return;
		}
	}
}
