import { Project } from "@prisma/client";
import { Dispatch, SetStateAction, useOptimistic } from "react";
import AddAProject from "./kanban/AddAProject";
import SidebarButton from "./SidebarButton";
import { ProjNumCols } from "@/app/kanban/[id]/page";

export type UpdateOptimisticProjects = (action: { action: string; title?: string | undefined; id?: string | undefined; }) => void

type Props = {
	projects: Project[]
	hover: boolean
	setHover: Dispatch<SetStateAction<boolean>>			
	projNumCols: ProjNumCols
}
export function SiderbarContent({ projects, hover, setHover, projNumCols } : Props) {
	const [optimisticProjects, updateOptimisticProjects] = useOptimistic(projects,
    (state, { action, title, id }: { action: string; title?: string; id?: string }) => {
			switch (action) {
				case "create":
					return title ? [
						...state,
						{
							id: 'mock-id',
							created_at: new Date(),
							title: title || '',
							owner: 'mock-owner'
						}
					] : state;
				case "delete":
					return id ? state.filter(i => i.id !== id) : state;
				default: 
					return state;
			}
    }
	);

	return (
		<div className="flex flex-col gap-y-2">
			<div className="flex flex-col gap-y-2">
				{optimisticProjects && optimisticProjects.map(project => (
					<SidebarButton 
						hover={hover}
						key={project.id}
						project={project}
						updateOptimisticProjects={updateOptimisticProjects}
						projNumCols={projNumCols}
					/>
				))}
			</div>
			<div className="flex flex-row justify-end w-full ">
				<AddAProject 
					updateOptimisticProjects={updateOptimisticProjects}
					hover={hover}
					setHover={setHover}
				/>
			</div>
		</div>
	)
}
