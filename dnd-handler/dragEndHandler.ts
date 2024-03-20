import { Dispatch, SetStateAction } from "react";
import { actionUpdateTasksPositions } from "@/app/actions/actions";
import { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { Column, Task } from "@prisma/client";

async function updateTasksPositions(tasks : Task[]) {
	await actionUpdateTasksPositions({ tasks })
}
type CustomCol = ({ 
	tasks: { 
		id: number; 
		created_at: Date; 
		title: string | null; 
		content: string | null; 
		position: number | null; 
		columnId: number | null; 
	}[]; 
} & { 
	id: number; 
	created_at: Date; 
	title: string | null; 
	position: number | null; 
})[]

export default function dragEndHandler(
	setActiveColumn: Dispatch<SetStateAction<Column | null>>,
	setActiveTask: Dispatch<SetStateAction<Task | null>>,
	setColumns: Dispatch<SetStateAction<Column[] | null>>,
	tasks: Task[] | null,
	setTrigger: Dispatch<SetStateAction<boolean>>
) {
	return (event: DragEndEvent) => {
		tasks && updateTasksPositions(tasks)
		setTrigger(prev => !prev)
		
		setActiveColumn(null);
		setActiveTask(null);
		const { active, over } = event;
		if (!over) return;

		const activeId = active.id;
		const overId = over.id;
		if (activeId === overId) return;

		const isActiveAColumn = active.data.current?.type === "Column";
		if (!isActiveAColumn) return;
		
		setColumns((columns) => {

			const activeColumnIndex = columns?.findIndex((col) => col.title === activeId);
			const overColumnIndex = columns?.findIndex((col) => col.title === overId);
			
			if (activeColumnIndex != undefined && overColumnIndex != undefined) {
				const res = (
					arrayMove(
						(
							columns as unknown) as CustomCol[],
							activeColumnIndex, 
							overColumnIndex
					) as unknown
				) as Column[]
				return res
			} else {
				const res : Column[] = []
				return res
			}
		})
	};
}
