import { cn } from "@/lib/utils"
import { useDrawerStore, useStore } from "@/utils/store/useStore"
import { Home } from "lucide-react"
import { usePathname } from "next/navigation"
import { useRouter } from "next/navigation"

export default function HomeIcon() {
	const { store, setStore } = useStore(s=>s)
	const pathname = usePathname()
	const router = useRouter()
	const { setIsOpen } = useDrawerStore(s=>s)
	const pathLast = pathname.split('/').slice(-1)

	async function goHome() {
		setStore({
			...store,
			loading: true,
			formerProjectId: pathLast.length > 0 ? pathLast[0] : "",
			project: null,
			home: true,
		})
		router.push(`/kanban/home`)
		setIsOpen(false)
	}
	const isNotHome = ( (pathLast.length > 0 && pathLast[0] != 'home') &&  !store.home) 

	return (
		<div className={cn(`mb-[12px] p-1 rounded-lg bg-pure border border-muted-foreground
			hover:border-foreground group opacity-0 transition cursor-pointer hover:bg-background hover:brightness-110`,
			{
				'opacity-100': isNotHome
			})}
		>
			<Home	
				size={20} 
				strokeWidth={1}
				className="text-muted-foreground group-hover:text-foreground cursor-pointer transition"
				onClick={() => goHome()}
			/>
		</div>
	)
}
