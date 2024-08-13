import { cn } from "@/lib/utils"
import { useDrawerStore, useStore } from "@/utils/store/useStore"
import { Home } from "lucide-react"
import { usePathname } from "next/navigation"
import { useRouter } from "next/navigation"

type Props = {
	drawer: boolean | undefined
}
export default function SidebarHome({ drawer } : Props) {
	const { store, setStore } = useStore(s=>s)
	const router = useRouter()
	const { setIsOpen } = useDrawerStore(s=>s)
	const pathname = usePathname()
	async function goHome() {
		router.push(`/kanban/home`)
		setStore({
			...store,
			log: "going home",
			formerProjectId: pathname.split('/').slice(-1).length > 0 ? pathname.split('/').slice(-1)[0] : "",
			project: null,
			home: true,
			triggerUpdate: !store.triggerUpdate
		})
		setIsOpen(false)
	}

	return (
		<div
			className={cn(`
				flex flex-row justify-center py-4 px-1 gap-x-2 cursor-pointer rounded-lg dark:text-muted-foreground
				text-foreground bg-muted items-center z-10 text-sm shadow shadow-muted-foreground
				transition hover:text-foreground select-none h-14 border border-muted 
			`,
			{
				'border-foreground border shadow-none': store.home && !store.project || (
					pathname.split('/').slice(-1).length > 0 && 
					pathname.split('/').slice(-1)[0] === 'home' &&
					!store.project
				),
				'shadow-none' : drawer
			})}
			onClick={() => goHome()}
		>
			<Home size={16}/>
			<h1> 
				Home 
			</h1>
			{/*<Home size={16} className="invisible"/>*/}
		</div>
	)
}
