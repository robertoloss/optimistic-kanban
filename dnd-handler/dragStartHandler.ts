import { DragStartEvent } from "@dnd-kit/core";
import { Dispatch, SetStateAction } from "react";
import { Task } from "@prisma/client";
import { Column } from "@prisma/client";


export default function dragStartHandler(
	setActiveColumn: Dispatch<SetStateAction<Column | null>>,
	setActiveTask: Dispatch<SetStateAction<Task | null>>
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
