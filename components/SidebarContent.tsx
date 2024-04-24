import {memo, startTransition, use, useEffect, useOptimistic, useState } from "react";
import AddAProject from "./kanban/AddAProject";
import SidebarButton from "./SidebarButton";
import { Project } from "@prisma/client";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { DndContext, DragOverEvent, MouseSensor, TouchSensor, UniqueIdentifier, useSensor, useSensors } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { actionUpdateProjects } from "@/app/actions/actions";

type Props = {
	projects: Project[] | null
	drawer?: boolean
}
export const SiderbarContent = memo(function({ projects, drawer } : Props) {
	const sensors = useSensors( 
		useSensor(MouseSensor),
		useSensor(TouchSensor),
	)
	const [ dndProjects, setDndProjects ] = useState<Project[] | null>(projects)
	const [ optimisticProjects, updateOptimisticProjects ] = useOptimistic(projects, 
		(state, {action, project, id, newProjects} : 
		{action: string, project?: Project, id?: string, newProjects?: Project[]}) => {
			switch (action) {
				case "create":
					return project && state ? [...state, project] : state || []
				case "delete":
					return id && state ? state.filter(p => p.id != id) : state || []
				case "update":
					return  newProjects || []
				default:
					console.log("DEFAULT")
					return state
			}
	})
	useEffect(() => {
		console.log("useEffect sidebar")
		setDndProjects(projects)
	}, [projects])
	console.log("dndProjects: ", dndProjects)

	return (
		<div className="flex flex-col gap-y-2">
			<div className="flex flex-col gap-y-2">
			<DndContext
				sensors={sensors}
				id="projects"
				onDragStart={() => true}
				onDragEnd={() => {
					if (dndProjects) {
						actionUpdateProjects(dndProjects) 
					}
				}}
				onDragOver={(event: DragOverEvent)=>{
					const {active, over} = event;
					if (active.id !== over?.id && over) {
						//setTimeout(() => 
							setDndProjects(prev => {
							if (prev) {
								const activePos = prev 
									.filter(p => p.id === active.id)
									.at(0)
									?.position || 0
								const overPos = prev
									.filter(p => p.id === over.id)
									.at(0)
									?.position || 0
								console.log("active, over: ", activePos, overPos)
								return prev
									.map(p => {
										if (![active.id, over.id].includes(p.id)) return p
										if (p.id === active.id) return {...p, position: overPos}
										return {...p, position: activePos}
									})
									.sort((a,b) => a.position - b.position)
							} 
							return prev
						})
						//, 1)	
					}
				}}
				modifiers={[restrictToVerticalAxis]}
			>
			<SortableContext
				items={dndProjects?.sort((a,b) => a.position - b.position).map(p => p.id) || []}
				strategy={verticalListSortingStrategy}
			>
				{dndProjects?.sort((a,b) => a.position - b.position).map(project => (
					<SidebarButton 
						key={project.id}
						project={project}
						updateOptimisticProjects={updateOptimisticProjects}
						drawer={drawer}
						setDndProjects={setDndProjects}
					/>
				))}
				</SortableContext>
				</DndContext>
			</div>
			<div className="flex flex-row justify-end w-full ">
				<AddAProject 
					updateOptimisticProjects={updateOptimisticProjects}
					setDndProjects={setDndProjects}
				/>
			</div>
		</div>
	)
})

