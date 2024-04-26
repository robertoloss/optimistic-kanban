import {memo, useEffect, useState } from "react";
import AddAProject from "./kanban/AddAProject";
import SidebarButton from "./SidebarButton";
import { Project } from "@prisma/client";
import { SortableContext } from "@dnd-kit/sortable";
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
	useEffect(() => {
		setDndProjects(projects)
	}, [projects])

	const projectsIds = dndProjects?.
		sort((a,b) => a.position - b.position).
		map(p => p.id as UniqueIdentifier)

	return (
		<div className="flex flex-col gap-y-2">
			<div className="flex flex-col gap-y-2">
			<DndContext
				sensors={sensors}
				id="projects"
				onDragStart={() => true}
				onDragEnd={() => { dndProjects && actionUpdateProjects(dndProjects) }}
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
						//, 0)	
					}
				}}
				modifiers={[restrictToVerticalAxis]}
			>
				{projectsIds && 
					<SortableContext items={projectsIds}>
						{dndProjects?.sort((a,b) => a.position - b.position).map(project => (
							<SidebarButton 
								key={project.id}
								project={project}
								drawer={drawer}
								setDndProjects={setDndProjects}
							/>
						))}
					</SortableContext>
				}
			</DndContext>
			</div>
			<div className="flex flex-row justify-end w-full ">
				<AddAProject 
					setDndProjects={setDndProjects}
				/>
			</div>
		</div>
	)
})

