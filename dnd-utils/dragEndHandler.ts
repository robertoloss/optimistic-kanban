import { Dispatch, SetStateAction } from "react";
import { DragEndEvent } from "@dnd-kit/core";
import { Column, Task } from "@prisma/client";
import { supabase } from "@/utils/supabase/queries";
import { Store } from "@/utils/store/useStore";

type Props = {
	setActiveColumn: Dispatch<SetStateAction<Column | null>>,
	setActiveTask: Dispatch<SetStateAction<Task | null>>,
	tasks: Task[] | null,
	columns: Column[] | null
	setStore: (store: Store) => void
	store: Store
}
export default function dragEndHandler({ setActiveColumn, setActiveTask, tasks, columns, setStore, store } : Props) {
	async function updateColsAndTasks(columns: Column[], tasks: Task[]) {
		try {
			//console.log("dragEnd: ", columns)
			await supabase
				.from('Column')
				.upsert(columns)
			await supabase
				.from('Task')
				.upsert(tasks)
			setStore({
				...store,
				log: "dragEndHandler",
			})
		} catch (error) {
				console.error("Error updating columns:", error);
		}
		
	}
	return (_event: DragEndEvent) => {
		columns && tasks && updateColsAndTasks(columns,tasks)
		setActiveColumn(null);
		setActiveTask(null);
	};
}
