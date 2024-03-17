'use client'
import { useEffect, useState } from "react"
import { ColumnType } from "./types"
import { SortableContext, rectSwappingStrategy } from "@dnd-kit/sortable"
import { useMemo } from "react"
import Column from "./Column"
import { defaultColumns } from "./mock-data"
import { DndContext, useSensors, PointerSensor, useSensor } from "@dnd-kit/core"
import dragStartHandler from "@/dnd-handler/dragStartHandler"
import dragEndHandler from "@/dnd-handler/dragEndHandler"
import dragOverHandler from "@/dnd-handler/dragOverHandler"
import DragOverlayComponent from "./DragOverlayComponent"
//import { actionGetTasks } from "@/app/actions/actions"
import { Task } from "@prisma/client"

type Props = {
	dbTasks: Task[] | undefined
}

export default function Kanban({ dbTasks } : Props) {
	const columnsIds = useMemo(()=> defaultColumns.map(column => column.id),[defaultColumns])
	const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 0 }})
	)
	const [columns, setColumns] = useState<ColumnType[]>(defaultColumns);
	const [tasks, setTasks] = useState<Task[] | null>(null);
	const [activeColumn, setActiveColumn] = useState<ColumnType | null>(null)
	const [activeTask, setActiveTask] = useState<Task | null>(null)
	const [sync, setSync] = useState(false)

	useEffect(()=>{
		dbTasks && setTasks(dbTasks)
		console.log("useEffect")
	},[sync])

	return (
		<div className="flex flex-row flex-wrap gap-y-8 w-full justify-center gap-x-8">
			<DndContext
				id="list"
				sensors={sensors}
				onDragStart={dragStartHandler(setActiveColumn, setActiveTask)}
				onDragEnd={dragEndHandler(setActiveColumn, setActiveTask, setColumns, tasks, setSync)}
				onDragOver={dragOverHandler({setTasks})}
			>
				<SortableContext 
					items={columnsIds}
					strategy={rectSwappingStrategy}
				>
					{columns.map(column => (
						<Column 
							key={column.id}
							column={column}
							tasks={tasks?.filter((task) => task.columnId === column.id)}
						/>
					))}
				</SortableContext>
				<DragOverlayComponent 
					activeColumn={activeColumn}
					activeTask={activeTask}
					tasks={tasks}
				/>
			</DndContext>
		</div>
	)
}
