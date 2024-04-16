import { Dispatch, SetStateAction } from "react";
import AddAProject from "./kanban/AddAProject";
import SidebarButton from "./SidebarButton";
import { useStore } from "@/utils/store/useStore";

type Props = {
	hover: boolean
	setHover: Dispatch<SetStateAction<boolean>>			
}
export function SiderbarContent({ hover, setHover } : Props) {
	const { store } = useStore(s=>s)

	return (
		<div className="flex flex-col gap-y-2">
			<div className="flex flex-col gap-y-2">
				{store.projects?.sort((a,b) => Number(a.created_at.getTime) - Number(b.created_at.getTime)).map(project => (
					<SidebarButton 
						hover={hover}
						key={project.id}
						project={project}
					/>
				))}
			</div>
			<div className="flex flex-row justify-end w-full ">
				<AddAProject 
					hover={hover}
					setHover={setHover}
				/>
			</div>
		</div>
	)
}
