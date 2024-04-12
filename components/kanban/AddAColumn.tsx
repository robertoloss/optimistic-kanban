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
import { Button } from "../ui/button"
import { supaCreateColumn, supabase } from "@/utils/supabase/queries"
import { actionFetchAllCols, revalidateActionFetchAllCols } from "@/app/actions/actions"

type Props = {
	setTriggerUpdate: Dispatch<SetStateAction<boolean>>
	setColumns: Dispatch<SetStateAction<Column[] | null>>
	setUpdating: Dispatch<SetStateAction<boolean>>,
	numOfCols: number | undefined
	projectId: string
}
export default function AddAColumn({ setTriggerUpdate, setColumns, setUpdating, numOfCols, projectId } : Props) {
	const [open, setOpen] = useState(false)

	async function createColumn(data: FormData, projectId: string) {
		const { data: { user } } = await supabase.auth.getUser()
		setUpdating(true)
		const newColumn : Column = {
			id: '9999',
			title: data.get('title') as string,
			created_at: new Date(), 
			position: numOfCols ? numOfCols : 0,
			owner: user?.id ? user.id : null,
			project: projectId
		}
		setColumns((c) => {
			if (c) return [...c, newColumn]
			else return [newColumn]
		})
		supaCreateColumn(data, setTriggerUpdate, numOfCols, projectId)
		revalidateActionFetchAllCols()
	}

	return (
		<div className={`flex flex-col mt-[minHeigtColumn] justify-start `}>
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
