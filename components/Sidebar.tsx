'use client'
import { Project } from "@prisma/client"
import { useState } from "react"
import { SiderbarContent } from "./SidebarContent"

type Props = {
	projects: Project[]
}
export default function Sidebar({ projects }: Props) {
	const [hover, setHover] = useState(false)

	return (
		<div 
			className="flex-col p-4 w-full"
			onMouseEnter={()=>setHover(true)}
			onMouseLeave={()=>setHover(false)}
		>
			<div className={`flex flex-col h-full w-full bg-layout rounded-xl p-4 border dark:border-none `}>
				<SiderbarContent 
					hover={hover}
					projects={projects}
					setHover={setHover}
				/>
			</div>
		</div>
	)
}
