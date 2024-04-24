'use client'
import { useHoverStore } from "@/utils/store/useStore"
import { SiderbarContent } from "./SidebarContent"
import { Project } from "@prisma/client"

type Props = {
	projects: Project[] | null
	drawer?: boolean
}
export default function Sidebar({ projects, drawer } : Props) {
	const { setHover } = useHoverStore(s => s)


	return (
		<div 
			className="flex-col p-4 w-full"
			onMouseEnter={()=>setHover(true)}
			onMouseLeave={()=>setHover(false)}
		>
			<div className={`flex flex-col h-full w-full ${drawer ? '' : 'bg-layout'} rounded-xl p-4 border dark:border-none `}>
				<SiderbarContent 
					projects={projects}
					drawer={drawer}
				/>
			</div>
		</div>
	)
}
