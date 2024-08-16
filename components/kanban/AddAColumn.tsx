import { CirclePlus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Column } from "@prisma/client"
import {  useState } from "react"
import { Button } from "../ui/button"
import { supaCreateColumn, supaFetchAllCols, supabase } from "@/utils/supabase/queries"
import { useStore } from "@/utils/store/useStore"
import { cn } from "@/lib/utils"

type Props = {
	numOfCols: number | undefined
	projectId: string
}
export default function AddAColumn({ numOfCols, projectId } : Props) {
	const { store, setStore } = useStore(s=>s)
	const [open, setOpen] = useState(false)

	async function createColumn(data: FormData, projectId: string) {
		const { data: { user } } = await supabase.auth.getUser()
		const newColumn : Column = {
			id: '9999',
			title: data.get('title') as string,
			created_at: new Date(), 
			position: numOfCols ? numOfCols : 0,
			owner: user?.id ? user.id : null,
			project: projectId
		}
		setStore({
			...store,
			columns: store.columns ? [ ...store.columns, newColumn ] : [ newColumn ],
			log: "AddAColumn"
		})
		await supaCreateColumn(data, numOfCols, projectId)
		const newCols = await supaFetchAllCols()
		setTimeout(() => setStore({
			...store,
			columns: newCols || store.columns || [],
			log: "AddAColumn"
		}), 100)
	}
	function openModal(shouldOpen: boolean) {
		console.log("open modal")
		if (!store.loading) {
			setOpen(shouldOpen)
		}
	}

	return (
		<div className={`flex flex-col mt-[minHeigtColumn] justify-start `}>
			<Dialog open={open} onOpenChange={openModal}>
				<DialogTrigger disabled={store.optimisticUpdate || store.loading}>
					<div className={cn(`
						group bg-background p-4 flex flex-col justify-center border-2 rounded-lg border-muted-foreground 
						hover:border-foreground hover:cursor-pointer border-dashed transition
					`,{
						'border-secondary': store.loading
					})}>
						<div className="flex flex-col h-6 hover:cursor-pointer rounded-full w-6 transition">
							<CirclePlus className={cn(`text-muted-foreground group-hover:text-foreground transition`, {
								'text-secondary': store.loading
							})}/>
						</div>
					</div>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader className="gap-y-8">
						<DialogTitle className="text-md font-normal">
							Add a new column: 
						</DialogTitle>
							<form 
								className="flex flex-col gap-y-4 text-foreground"
								action={(data: FormData)=>{
									setOpen(false)
									createColumn(data, projectId)
								}}
							>
								<div className="flex flex-col w-full">
									Title
									<input 
										type="text" 
										name="title"
										className="bg-pure border border-muted-foreground rounded-md p-2"
									/>
								</div>
								<Button 
									className="w-[180x] self-end"
									type="submit"
								>
										Continue
								</Button>
							</form>
					</DialogHeader>
				</DialogContent>
			</Dialog>
		</div>
	)
}
