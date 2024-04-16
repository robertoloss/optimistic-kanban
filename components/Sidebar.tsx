'use client'
import { useState } from "react"
import { SiderbarContent } from "./SidebarContent"

export default function Sidebar() {
	const [ hover, setHover ] = useState(false)
	//const { store, setStore } = useStore(s=>s)

	//useEffect(() => {
	//	console.log("setting projects")
	//	async function setProjects() {
	//		const projects = await supaFetchAllProjects()
	//		setStore({
	//			...store,
	//			projects: projects || []
	//		})
	//	}
	//	setProjects()
	//},[store.revalidateProjects])

	return (
		<div 
			className="flex-col p-4 w-full"
			onMouseEnter={()=>setHover(true)}
			onMouseLeave={()=>setHover(false)}
		>
			<div className={`flex flex-col h-full w-full bg-layout rounded-xl p-4 border dark:border-none `}>
				<SiderbarContent 
					hover={hover}
					setHover={setHover}
				/>
			</div>
		</div>
	)
}
