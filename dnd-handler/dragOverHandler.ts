import { DragOverEvent } from "@dnd-kit/core";
import { Dispatch, SetStateAction } from "react";
import { TaskType } from "../components-new/types";
import { arrayMove } from "@dnd-kit/sortable";

export default function dragOverHandler(
	setTasks: Dispatch<SetStateAction<TaskType[]>>
) {
	return (event: DragOverEvent) => {
		const { active, over } = event;
		if (!over) return;

		const activeId = active.id;
		const overId = over.id;
		//console.log("\nactiveId: ", activeId)
		//console.log("overId: ", overId)
		if (activeId === overId) return;

		const isActiveATask = active.data.current?.type === "Task";
		const isOverATask = over.data.current?.type === "Task";
		if (!isActiveATask) return;

		if (isActiveATask && isOverATask) {
			setTimeout(() => setTasks((tasks) => {
				const activeIndex = tasks.findIndex((t) => t.id === activeId);
				const overIndex = tasks.findIndex((t) => t.id === overId);

				if (tasks[activeIndex].columnId != tasks[overIndex].columnId) {
					tasks[activeIndex].columnId = tasks[overIndex].columnId;
					return arrayMove(tasks, activeIndex, overIndex );
				}
				return arrayMove(tasks, activeIndex, overIndex);
			}),50);
		}

		const isOverAColumn = over.data.current?.type === "Column";

		if (isActiveATask && isOverAColumn) {
			setTimeout(() => setTasks((tasks) => {
				const activeIndex = tasks.findIndex((t) => t.id === activeId);
				const overIndex = tasks.findIndex((t) => t.id === overId);
				//console.log("activeIndex", activeIndex)
				//console.log("overIndex", activeId)
				tasks[activeIndex].columnId = overId;
				return arrayMove(tasks, activeIndex, overIndex);
			}),50);
		}
	}
}



