
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "../ui/button"
import { useState } from "react"
import { useStore } from "@/utils/store/useStore"
import { supaFetchAllCols, supaUpdateColumn, supaUpdateProject } from "@/utils/supabase/queries"
import { Column, Project } from "@prisma/client"

type Props = {
	children: React.ReactNode
	column?: Column
	project?: Project
}
export default function({ children, column, project } : Props) {
	const { store, setStore }  = useStore(s=>s)
	const [ open, setOpen] = useState(false)

	async function update(data: FormData) {
		// Updating a column...
		if (column) {
			const newTitle = data.get('title') as string
			const updatedColumn = {
				...column,
				id: 'update',
				title: newTitle,
			}
			setStore({
				...store,
				columns: store.columns ? [...store.columns.filter(col => col.id != column.id), updatedColumn] : [updatedColumn],
				log: "updateTask before",
				optimisticUpdate: true,
				justUpdatedColId: column.id
			}) 
			await supaUpdateColumn({ newTitle, columnId: column.id })
			const newCols = await supaFetchAllCols()
			setTimeout(() => setStore({
				...store,
				columns: newCols || store.columns || [], 
				log: "updatedColumns after supa",
				optimisticUpdate: false
			}), 100) 
		// ...else, if project:
		} else if (project) {
			setOpen(false)
			const newTitle = data.get('title') as string
			const optimisticProject = {
				...project,
				id: 'update',
				title: newTitle,
			}
			setStore({
				...store,
				project: optimisticProject,
				log: "updatedProject before",
				optimisticUpdate: true,
				justUpdatedColId: ""
			}) 
			const updatedProject = await supaUpdateProject({ 
				newTitle, projectId: project.id 
			})
			setTimeout(() => setStore({
				...store,
				project: updatedProject || null,
				log: "updatedProject after supa",
				optimisticUpdate: false
			}), 100) 
		}
	}


	return (
		<div className="flex flex-col">
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogTrigger disabled={store.optimisticUpdate} >
					{ children }
				</DialogTrigger>
				<DialogContent >
					<form action={(data: FormData)=>update(data)}
						className="flex flex-col max-h-[280px] min-h-[120px] justify-between items-start"
					>
					<DialogHeader className="h-full w-full">
						<DialogTitle className="text-md font-semibold w-full h-fit">
							<p className="p-2 font-medium mt-4">
								{column && column.title}
								{project && project.title}
							</p>
							<input
								name="title"
								className="bg-muted rounded-lg p-2 mt-4 w-full font-medium"
								defaultValue={column?.title || project?.title || ""}
							/>
						</DialogTitle>
					</DialogHeader>
					<div className="h-4"/>
					<DialogFooter className="flex flex-row w-full justify-end gap-4">
						<div className="flex flex-row w-full justify-end gap-4 items-center">
							<Button 
								className={`w-16 h-6 py-4 hover:brightness-110 transition`} 
								variant="secondary"
								type="submit"
								onClick={()=>setOpen(false)}
							>
								Save
							</Button>
							<Button
								className="w-16 h-6 py-4 hover:brightness-110 transition"
								variant="outline" onClick={() => setOpen(false)}>
								Cancel
							</Button>
						</div>
					</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</div>
	)
}
