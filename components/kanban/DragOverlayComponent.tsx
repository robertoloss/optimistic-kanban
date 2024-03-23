import { DragOverlay } from "@dnd-kit/core";
import Column from "./Column";
import Task from "./Task";
import { Column as ColumnType, Task as TaskPrismaType } from "@prisma/client";

type Props = {
	activeColumn: ColumnType | null,
	activeTask: TaskPrismaType | null | undefined,
	tasks: TaskPrismaType[] | undefined | null,
	columns: ColumnType[] | null
}
export default function DragOverlayComponent({activeColumn, activeTask, columns, tasks } : Props) {
	const column = columns?.filter((col: ColumnType) => col.title === activeTask?.columnId )[0]
	const columnTasks = tasks?.filter(t => t.columnId === activeColumn?.title)

	return (
		<DragOverlay>
			{activeColumn && (
				<Column
					column={activeColumn}
					overlay={true}
					tasks={columnTasks}
				/>
			)}
			{activeTask && (
				<Task
					task={activeTask}
					column={column}				
					overlay={true}
				/>
			)}
		</DragOverlay>
	)
}
