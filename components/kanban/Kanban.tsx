'use client'
import { useEffect, useState } from "react"
import { SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable"
import ColumnComp from "./Column"
import { DndContext, useSensors, useSensor, UniqueIdentifier, MouseSensor, TouchSensor, closestCorners, closestCenter, rectIntersection } from "@dnd-kit/core"
import dragStartHandler from "@/dnd-utils/dragStartHandler"
import dragEndHandler from "@/dnd-utils/dragEndHandler"
import dragOverHandler from "@/dnd-utils/dragOverHandler"
import DragOverlayComponent from "./DragOverlayComponent"
import { Column, Task } from "@prisma/client"
import AddAColumn from "./AddAColumn"
import { minHeigtColumn } from "./Column"
import LoadingColumns from "./LoadingColumns"
import { supaFetchAllCols, supaFetchAllTasks, supaFetchProject } from "@/utils/supabase/queries"
import { useParams, usePathname } from "next/navigation"
import { useStore } from "@/utils/store/useStore"
import { cn } from "@/lib/utils"
import { Pencil } from "lucide-react"
import EditTitle from "./EditTitle"
//import HomeIcon from "./HomeIcon"

export type ProjNumCols = {
	[projectId: string] : number
}
type Props = {
	children: React.ReactNode
}
export default function Kanban({ children } : Props) {
	const sensors = useSensors( 
		useSensor(MouseSensor),
		useSensor(TouchSensor),
	)
	const { store, setStore} = useStore(state => state)
	const [ activeColumn, setActiveColumn ] = useState<Column | null>(null)
	const [ activeTask, setActiveTask ] = useState<Task | null>(null)
	const { loading, numCols } = store

	const pathname = usePathname()
	const pathnameLast = pathname.split('/').slice(-1)
	const params : {id: string} = useParams()
	const projectId = (!store.project?.id || store.project.id === 'update')
										? params.id
										: store.project.id != params.id
											? store.project.id
											: params.id

	const columnsIds =  store.columns?.filter(col => (col.project === projectId && col.id != store.justUpdatedColId))
		.sort((a,b) => a.position! - b.position! )
		.map(column => column.id as UniqueIdentifier)
	const currentColumns = store.columns
		?.filter(col => (col.project === projectId && col.id != store.justUpdatedColId))
		.sort((a,b) => a.position! - b.position!)
	const colJustUpdatedId = store.justUpdatedColId

	useEffect(()=>{
		async function fetchColsAndTasks() {
			const project = await supaFetchProject({ projectId })
			const columns = await supaFetchAllCols();
			const tasks = await supaFetchAllTasks()
			if (columns && tasks ) {
				setStore({
					...store,
					project: project || null,
					columns,
					tasks,
					home: pathnameLast.length > 0 && pathnameLast[0] === 'home',
					loading: false,
					deleting: false,
					log: "Kanban"
				})
			}
		}
		if (!columnsIds) fetchColsAndTasks();
	},[store.project])

	
	return (
		<div className="flex flex-col w-full h-full items-start ">
			<div className="flex flex-row w-full justify-between h-fit mt-2  items-end px-4">
				<div className="flex flex-row h-fit w-fit gap-2 items-center group hover:cursor-pointer">
					<EditTitle project={store.project || undefined}>
						<div className="flex flex-row gap-2 justify-start items-center w-fit h-fit p-2 rounded-lg">
							<div className={cn("text-lg font-semibold group-hover:text-muted-foreground -ml-2 transition", {
								//"text-muted-foreground": !store.project || !store.project.title 
							})}>
								{ store.project?.title
									? store.project?.title
									: store.home 
										? "Home"
										:  "..."
									//(!store.home && store.project) || 
									//store.home && !store.loading && (pathnameLast.length > 0 && pathnameLast[0] != 'home') 
									//	? (store.project?.title || "...") 
									//	: store.home 
									//		? "Home" 
									//		: ""
								}
							</div>
							{!store.home && <div className={`transition opacity-0 group-hover:opacity-100`}>
								<Pencil size={16} className="text-muted-foreground"/>
							</div>}
						</div>
					</EditTitle>
				</div>
				{/* <HomeIcon /> */}
			</div>
			{ 
				!store.project?.title
				&& children 
				|| store.home
						&& <></>
				//(
				//	((pathnameLast.length > 0 && pathnameLast[0] === 'home') && !store.project) 
				//	|| (store.home )
				//) 
				//&& children
			}
			{
			!store.project?.title
				&& <></> 
				|| !store.home
						&& 
				
				//((!store.loading && pathnameLast.length > 0 && pathnameLast[0] != 'home') ||
				//store.project
				//) &&
			<DndContext
				id="list"
				sensors={sensors}
				onDragStart={dragStartHandler({ setActiveColumn, setActiveTask })}
				onDragEnd={dragEndHandler({
					setActiveColumn, setActiveTask, setStore, store,
					tasks: store.tasks, columns: store.columns
				})}
				onDragOver={dragOverHandler({ setStore, store })}
				collisionDetection={rectIntersection}
			>
				<div className={`flex flex-row flex-shrink w-full px-4 h-full items-start   
					justify-start gap-x-4 overflow-x-auto py-8`}
					style={{ 
						scrollbarWidth: 'thin', 
						scrollbarColor: 'dark-gray black', 
						minHeight: `${minHeigtColumn}px`
					}}
				>
				{
					(!loading && columnsIds && params.id === store.project?.id) || true && columnsIds? 
						<>
							<SortableContext 
								items={columnsIds}
								strategy={horizontalListSortingStrategy}
							
							>
							{currentColumns?.map(column => {
								const columnTasks = store.tasks?.filter(t => {
									if ( column.id === 'update' ) {
										return t.columnId === colJustUpdatedId
									}
									return t.columnId === column.id
								})
								return (
									<ColumnComp 
										projectId={projectId}
										key={column.id}
										column={column}
										tasks={columnTasks}
									/>
							)})}
							</SortableContext> 
							{<AddAColumn 
								numOfCols={store.columns?.length} 
								projectId={projectId}
								/>}
						</>
					: (
							loading || 
							!store.tasks
						) 
						&& params.id != 'home'
					? 
						<LoadingColumns numOfCols={numCols}/>
						:  params.id === 'home'?
							<div />
							: <div className="flex flex-row w-[400px]">
									Nothing found
								</div>
				}
				<div className="flex flex-row w-full" />
				</div>	
				<DragOverlayComponent 
					projectId={projectId}
					activeColumn={activeColumn}
					activeTask={activeTask}
				/>
			</DndContext>}
		</div>
	)
}
