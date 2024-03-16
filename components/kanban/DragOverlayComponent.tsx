import { DragOverlay } from "@dnd-kit/core";
import Column from "./Column";
import Task from "./Task";
import { ColumnType, TaskType } from "./types";

type Props = {
	activeColumn: ColumnType | null,
	activeTask: TaskType | null,
	tasks: TaskType[]
}
export default function DragOverlayComponent({activeColumn, activeTask, tasks } : Props) {

	return (
		<DragOverlay>
			{activeColumn && (
				<Column
					column={activeColumn}
					tasks={tasks.filter(
						(task) => task.columnId === activeColumn.id
					)}
					overlay={true}
				/>
			)}
			{activeTask && (
				<Task
					task={activeTask}
					column={{ 
						id: activeTask.columnId,
						title: ""
					}}
				/>
			)}
		</DragOverlay>
	)
}
