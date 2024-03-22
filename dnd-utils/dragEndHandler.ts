import { Dispatch, SetStateAction } from "react";
import { DragEndEvent } from "@dnd-kit/core";
import { Column, Task } from "@prisma/client";
import { supabase } from "@/components/kanban/Kanban";

type Props = {
	setActiveColumn: Dispatch<SetStateAction<Column | null>>,
	setActiveTask: Dispatch<SetStateAction<Task | null>>,
	tasks: Task[] | null,
	columns: Column[] | null
	setUpdating: Dispatch<SetStateAction<boolean>>
	setTriggerUpdate: Dispatch<SetStateAction<boolean>>
}
export default function dragEndHandler({
	setActiveColumn,
	setActiveTask,
	tasks,
	columns,
	setUpdating,
	setTriggerUpdate,
} : Props) {
	async function updateColsAndTasks(columns: Column[], tasks: Task[]) {
		setUpdating(true);
		try {
			await supabase
				.from('Column')
				.upsert(columns.map((col,i) => ({...col, position: i})))
			await supabase
				.from('Task')
				.upsert(tasks)
		} catch (error) {
				console.error("Error updating columns:", error);
		}
		setTriggerUpdate((prev: boolean) => !prev)
	}
	return (_event: DragEndEvent) => {
		columns && tasks && updateColsAndTasks(columns,tasks)
		setActiveColumn(null);
		setActiveTask(null);
	};
}
