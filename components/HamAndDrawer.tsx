import { Menu } from "lucide-react"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from "./ui/button"
import AuthButton from "./AuthButton"
import Sidebar from "./Sidebar"
import { Project } from "@prisma/client"

type Props = {
	projects: Project[]
}
export default function MobileDrawer({ projects }: Props) {

	return (
		<Drawer
			direction="left"
		>
			<DrawerTrigger>
				<Menu size={24}/>
			</DrawerTrigger>
			<DrawerContent className="h-full border-none w-[85%] rounded-none p-4">
				<DrawerHeader>
					<AuthButton drawer={true}/>
				</DrawerHeader>
				<div className="flex flex-col max-h-[360px] overflow-scroll">
					<Sidebar projects={projects} drawer={true}/>
				</div>
				<DrawerFooter>
					<DrawerClose>
						<Button variant="outline">Close</Button>
					</DrawerClose>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	)
}


