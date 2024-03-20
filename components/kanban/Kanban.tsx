'use client'
import { useEffect, useState } from "react"
import { SortableContext, rectSwappingStrategy } from "@dnd-kit/sortable"
import { useMemo } from "react"
import ColumnComp from "./Column"
import { defaultColumns } from "./mock-data"
import { DndContext, useSensors, PointerSensor, useSensor, UniqueIdentifier } from "@dnd-kit/core"
import dragStartHandler from "@/dnd-handler/dragStartHandler"
import dragEndHandler from "@/dnd-handler/dragEndHandler"
import dragOverHandler from "@/dnd-handler/dragOverHandler"
import DragOverlayComponent from "./DragOverlayComponent"
//import { actionGetTasks } from "@/app/actions/actions"
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
	const [_, setTrigger] = useState(false)
	const columnsIds = useMemo(()=> columns?.map(column => column.title as UniqueIdentifier), [columns])

	useEffect(()=>{
		console.log("useEffect")
		dbTasks && setTasks(dbTasks)
		dbColumns && setColumns(dbColumns)
	},[])
	console.log("Kanban tasks: ", tasks)

	return (
		<div className="flex flex-row flex-wrap gap-y-8 w-full justify-center gap-x-8">
			<DndContext
				id="list"
				sensors={sensors}
				onDragStart={dragStartHandler(setActiveColumn, setActiveTask)}
				onDragEnd={dragEndHandler(setActiveColumn, setActiveTask, setColumns, tasks, setTrigger )}
				onDragOver={dragOverHandler({setTasks})}
			>
				{columnsIds && <SortableContext 
					items={columnsIds}
					strategy={rectSwappingStrategy}
				>
					{columns && columns.map(column => {
						//console.log("column.title: ", column.title)
						const columnTasks = tasks?.filter(t => t.columnId === column.title)
						//console.log("columnTasks: ", columnTasks)
						return <ColumnComp 
							key={column.id}
							column={column}
							tasks={columnTasks}
						/>
					})}
				</SortableContext>}
				<DragOverlayComponent 
					activeColumn={activeColumn}
					activeTask={activeTask}
					tasks={tasks}
					columns={columns}
				/>
			</DndContext>
		</div>
	)
}
