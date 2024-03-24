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
}
export default function DragOverlayComponent({activeColumn, activeTask, columns, tasks, setTriggerUpdate } : Props) {
	const column = columns?.filter((col: ColumnType) => col.title === activeTask?.columnId )[0]
	const columnTasks = tasks?.filter(t => t.columnId === activeColumn?.title)

	return (
		<DragOverlay>
			{activeColumn && (
				<Column
					column={activeColumn}
					overlay={true}
					tasks={columnTasks}
					setTriggerUpdate={setTriggerUpdate}
				/>
			)}
			{activeTask && (
				<Task
					task={activeTask}
					setTriggerUpdate={setTriggerUpdate}
					column={column}				
					overlay={true}
				/>
			)}
		</DragOverlay>
	)
}
