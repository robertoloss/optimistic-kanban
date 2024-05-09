import {memo, useEffect, useOptimistic, useTransition } from "react";
import { useStore } from "@/utils/store/useStore"
import AddAProject from "./kanban/AddAProject";
import SidebarButton from "./SidebarButton";
import { Project } from "@prisma/client";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { DndContext, MouseSensor, TouchSensor, UniqueIdentifier, useSensor, useSensors } from "@dnd-kit/core";
import { restrictToParentElement, restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { actionUpdateProjects } from "@/app/actions/actions";
import { supaFetchAllProjects } from "@/utils/supabase/queries";

type Props = {
	projects: Project[] | null
	drawer?: boolean
}
export type UpdateOptimisticProjects = (action: {
	action: string;
	project?: {
			id: string;
			created_at: Date;
			title: string | null;
			owner: string | null;
			position: number;
	} | undefined;
	id?: string | undefined;
	newProjects?: {
			id: string;
			created_at: Date;
			title: string | null;
			owner: string | null;
			position: number;
	}[] | undefined;
}) => void

export const SiderbarContent = memo(function({ projects, drawer } : Props) {
	const sensors = useSensors( 
		useSensor(MouseSensor),
		useSensor(TouchSensor),
	)
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
	const { store } = useStore(s=>s)
  useEffect(() => {
		async function update() {
			const newProjects = await supaFetchAllProjects()
			startTransition(() => updateOptimisticProjects({
				action: "update",
				newProjects: newProjects || []
			}))
			newProjects && actionUpdateProjects(newProjects)
		}
		if (!store.project?.id?.includes('dummy') && !store.ignoreUseEffectSidebar) {
			update()
		}
	},[store.project])

	const [ _, startTransition ] = useTransition()	

	const projectsIds = optimisticProjects?.
		sort((a,b) => a.position - b.position).
		map(p => p.id as UniqueIdentifier)


	return (
		<div className="flex flex-col gap-y-2">
			<div className="flex flex-col gap-y-2">
			<DndContext
				sensors={sensors}
				id="projects"
				modifiers={[restrictToVerticalAxis, restrictToParentElement]}
				onDragEnd={(event) => { 
					const { active, over } = event
					const activeProject = optimisticProjects?.find(p => p.id === active.id)	
					const overProject = optimisticProjects?.find(p => p.id === over?.id)
					if (activeProject && overProject && optimisticProjects) {
						const oldIndex = optimisticProjects?.indexOf(activeProject);
						const newIndex = optimisticProjects?.indexOf(overProject);
						
						const tmpArray = arrayMove(optimisticProjects, oldIndex, newIndex);
						const newArray = tmpArray.map((p, i) => {
							return {...p, position: i}
						})
						startTransition(() => updateOptimisticProjects({
							action: "update",
							newProjects: newArray
						}))
						actionUpdateProjects(newArray)
					}
				}}
			>
				{projectsIds && 
					<SortableContext items={projectsIds}>
						{optimisticProjects?.map(project => (
							<SidebarButton 
								key={project.id}
								project={project}
								drawer={drawer}
								updateOptimisticProjects={updateOptimisticProjects}
							/>
						))}
					</SortableContext>
				}
			</DndContext>
			</div>
			<div className="flex flex-row justify-end w-full ">
				<AddAProject 
					updateOptimisticProjects={updateOptimisticProjects}
				/>
			</div>
		</div>
	)
})

