import { DragStartEvent } from "@dnd-kit/core";
import { Dispatch, SetStateAction } from "react";
import { Task } from "@prisma/client";
import { Column } from "@prisma/client";

type Props = {
	setActiveColumn: Dispatch<SetStateAction<Column | null>>,
	setActiveTask: Dispatch<SetStateAction<Task | null>>
}
export default function dragStartHandler({setActiveColumn, setActiveTask}: Props) {
	return (event: DragStartEvent) => {
		if (event.active.data.current?.type === "Column") {
			setActiveColumn(event.active.data.current.column);
			return;
		}
		if (event.active.data.current?.type === "Task") {
			setActiveTask(event.active.data.current.task);
			return;
		}
	}
}
