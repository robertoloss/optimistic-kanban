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
	setUpdating: Dispatch<SetStateAction<boolean>>
	setTasks: Dispatch<SetStateAction<TaskPrismaType[] | null>>
	setColumns: Dispatch<SetStateAction<ColumnType[] | null>>
}
export default function DragOverlayComponent({activeColumn, setColumns, setUpdating, activeTask, columns, tasks, setTriggerUpdate, setTasks} : Props) {
	const column = columns?.filter((col: ColumnType) => col.title === activeTask?.columnId )[0]
	const columnTasks = tasks?.filter(t => t.columnId === activeColumn?.title)

	return (
		<DragOverlay>
			{activeColumn && (
				<Column
					column={activeColumn}
					overlay={true}
					setUpdating={setUpdating}
					setTasks={setTasks}
					tasks={columnTasks}
					setTriggerUpdate={setTriggerUpdate}
					setColumns={setColumns}
				/>
			)}
			{activeTask && (
				<Task
					task={activeTask}
					setTasks={setTasks}
					setTriggerUpdate={setTriggerUpdate}
					setUpdating={setUpdating}
					column={column}				
					overlay={true}
				/>
			)}
		</DragOverlay>
	)
}
