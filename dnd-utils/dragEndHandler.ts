import { Dispatch, SetStateAction, TransitionStartFunction } from "react";
import { DragEndEvent } from "@dnd-kit/core";
import { Column, Task } from "@prisma/client";
import { actionUpdateColumns, actionUpdateTasks } from "@/app/actions/actions";

type Props = {
	setActiveColumn: Dispatch<SetStateAction<Column | null>>,
	setActiveTask: Dispatch<SetStateAction<Task | null>>,
	tasks: Task[] | null,
	columns: Column[] | null
	setUpdating: Dispatch<SetStateAction<boolean>>
	setTriggerUpdate: Dispatch<SetStateAction<boolean>>
	updateOptimisticTasks: (action: {
		action: string;
		tasks?: Task[];
		newTask?: Task;
		id?: string;
	}) => void
	updateOptimisticColumns: (action: {
			action: string;
			cols?: Column[];
			newCol?: Column;
			id?: string;
		}) => void
		startTransition: TransitionStartFunction
	}
export default function dragEndHandler({
	setActiveColumn,
	setActiveTask,
	tasks,
	columns,
	updateOptimisticTasks,
	updateOptimisticColumns,
	startTransition
} : Props) {
	
	return (_event: DragEndEvent) => {
		if (columns && tasks) {
			startTransition(()=>updateOptimisticTasks({action: "update", tasks}))	
			startTransition(()=>updateOptimisticColumns({action: "update", cols: columns}))	
			actionUpdateColumns(columns)
			actionUpdateTasks(tasks)
		} 
		setActiveColumn(null);
		setActiveTask(null);
	};
}
