'use client'
import { useEffect, useState } from "react"
import { SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable"
import ColumnComp from "./Column"
import { DndContext, useSensors, PointerSensor, useSensor, UniqueIdentifier } from "@dnd-kit/core"
import dragStartHandler from "@/dnd-utils/dragStartHandler"
import dragEndHandler from "@/dnd-utils/dragEndHandler"
import dragOverHandler from "@/dnd-utils/dragOverHandler"
import DragOverlayComponent from "./DragOverlayComponent"
import { Column, Task } from "@prisma/client"

type Props = {
	dbTasks: Task[] | undefined
	dbColumns: Column[] | undefined
}
export default function Kanban({ dbTasks, dbColumns } : Props) {
	const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 0 }})
	)
	const [columns, setColumns] = useState<Column[] | null>(null);
	const [tasks, setTasks] = useState<Task[] | null>(null);
	const [activeColumn, setActiveColumn] = useState<Column | null>(null)
	const [activeTask, setActiveTask] = useState<Task | null>(null)
	const [updating, setUpdating] = useState(false)

	const columnsIds =  columns?.map(column => column.title as UniqueIdentifier)


	useEffect(()=>{
		console.log("useEffect initial")
		dbTasks && setTasks(dbTasks)
		dbColumns && setColumns(dbColumns)
		setUpdating(false)
	},[dbColumns])

	return (
		<div className="flex flex-col w-full h-full items-center">
			<h1 className="h-6">{updating && <p>Saving...</p>}</h1>
			<div className="flex flex-row flex-wrap gap-y-8 w-full justify-center gap-x-8">
				<DndContext
					id="list"
					sensors={sensors}
					onDragStart={dragStartHandler({ setActiveColumn, setActiveTask })}
					onDragEnd={dragEndHandler({setActiveColumn, setActiveTask, tasks, columns, setUpdating })}
					onDragOver={dragOverHandler({ setTasks, setColumns })}
				>
					{columnsIds && 
						<SortableContext 
							items={columnsIds}
							strategy={horizontalListSortingStrategy}
						>
							{columns && columns.map(column => {
								const columnTasks = tasks?.filter(t => t.columnId === column.title)
								return <ColumnComp 
									key={column.id}
									column={column}
									tasks={columnTasks}
								/>
							})}
						</SortableContext>
					}
					<DragOverlayComponent 
						activeColumn={activeColumn}
						activeTask={activeTask}
						tasks={tasks}
						columns={columns}
					/>
				</DndContext>
			</div>
		</div>
	)
}
