'use client'
import { Menu } from "lucide-react"
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTrigger } from "@/components/ui/drawer"
import Sidebar from "./Sidebar"
import { Project } from "@prisma/client"
import { useDrawerStore } from "@/utils/store/useStore"

type Props = {
	projects: Project[] | null
	children: React.ReactNode
}
export default function MobileDrawer({ projects, children }: Props) {
	const { isOpen, setIsOpen } = useDrawerStore(s=>s)

	return (
		<Drawer
			direction="left"
			open={isOpen}
			onOpenChange={setIsOpen}
		>
			<DrawerTrigger>
				<Menu size={24}/>
			</DrawerTrigger>
			<DrawerContent className="h-full border-none w-[85%] rounded-none p-4">
				<DrawerHeader >
					{ children }
				</DrawerHeader>
				<div className="flex flex-col max-h-[360px] overflow-scroll">
					<Sidebar projects={projects} drawer={true}/>
				</div>
				<DrawerFooter>
					<DrawerClose className="border border-muted px-6 py-2 w-fit self-center">
						Close
					</DrawerClose>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	)
}


