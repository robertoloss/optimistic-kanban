import { DragOverlay } from "@dnd-kit/core";
import Column from "./Column";
import Task from "./Task";
import { Column as ColumnType, Task as TaskPrismaType } from "@prisma/client";
import { Dispatch, SetStateAction } from "react";

type Props = {
	activeColumn: ColumnType | null,
	activeTask: TaskPrismaType | null | undefined,
	tasks: TaskPrismaType[] | undefined | null,
	columns: ColumnType[] | null
	setTriggerUpdate: Dispatch<SetStateAction<boolean>>
	projectId: string
	updateOptimisticTasks: (action: {
		action: string;
		tasks?: TaskPrismaType[];
		newTask?: TaskPrismaType;
		id?: string;
	}) => void
}
export default function DragOverlayComponent({activeColumn, updateOptimisticTasks, projectId, activeTask, columns, tasks, setTriggerUpdate } : Props) {
	const column = columns?.filter((col: ColumnType) => col.id === activeTask?.columnId )[0]
	const columnTasks = tasks?.filter(t => t.columnId === activeColumn?.id)

	return (
		<DragOverlay>
			{activeColumn && (
				<Column
					projectId={projectId}
					column={activeColumn}
					overlay={true}
					updateOptimisticTasks={updateOptimisticTasks}
					tasks={columnTasks}
					setTriggerUpdate={setTriggerUpdate}
				/>
			)}
			{activeTask && (
				<Task
					task={activeTask}
					updateOptimisticTasks={updateOptimisticTasks}
					setTriggerUpdate={setTriggerUpdate}
					column={column}				
					overlay={true}
				/>
			)}
		</DragOverlay>
	)
}
