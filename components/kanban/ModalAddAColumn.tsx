import { CirclePlus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Column } from "@prisma/client"
import { Dispatch, SetStateAction, useState } from "react"
import { supabase } from "./Kanban"
import { Button } from "../ui/button"

type Props = {
	setTriggerUpdate: Dispatch<SetStateAction<boolean>>
	setColumns: Dispatch<SetStateAction<Column[] | null>>
	setUpdating: Dispatch<SetStateAction<boolean>>,
	numOfCols: number | undefined
}
export default function ModalAddAColumn({ setTriggerUpdate, setColumns, setUpdating, numOfCols } : Props) {
	const [open, setOpen] = useState(false)

	async function createColumn(data: FormData) {
		setUpdating(true)
		const newColumn : Column = {
				id: 9999,
				title: data.get('title') as string,
				created_at: new Date(), 
				position: numOfCols ? numOfCols : 99999
			}
			setColumns((c) => {
				if (c) return [...c, newColumn]
				else return [newColumn]
			})
			try {
			await supabase.from('Column')
				.insert([
					{
						title: data.get('title'),
						position: numOfCols ? numOfCols : 99999
					}
				])
			setTriggerUpdate(prev => !prev)
		} catch(error) {
			console.error(error)
		}
	}

	return (
		<div className="flex flex-col self-center h-full justify-center ">
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogTrigger>
				<div className="group p-4 flex flex-col justify-center border-2 rounded-lg border-border hover:border-muted-foreground hover:cursor-pointer border-dashed transition ">
					<div className="flex flex-col h-6 hover:cursor-pointer rounded-full w-6 transition">
						<CirclePlus className="text-border group-hover:text-muted-foreground transition" />
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
									createColumn(data)
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