import { DragOverlay } from "@dnd-kit/core";
import Column from "./Column";
import Task from "./Task";
import { Column as ColumnType, Task as TaskPrismaType } from "@prisma/client";
import { useStore } from "@/utils/store/useStore";

type Props = {
	activeColumn: ColumnType | null,
	activeTask: TaskPrismaType | null | undefined,
	projectId: string
}
export default function DragOverlayComponent({activeColumn, projectId, activeTask, } : Props) {
	const { store } = useStore(s=>s)
	const column = store.columns?.filter((col: ColumnType) => col.id === activeTask?.columnId )[0]
	const columnTasks = store.tasks?.filter(t => t.columnId === activeColumn?.id)

	return (
		<DragOverlay>
			{activeColumn && (
				<Column
					projectId={projectId}
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
