import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useStore } from "@/utils/store/useStore"
import { useState } from "react"

type Props = {
	children: React.ReactNode,
	title: string
	content: string
	action: ()=>void
}
export default function AlertComponent({ children, title, content, action } : Props) {
	const { store }  = useStore(s=>s)
	const [open, setOpen] = useState(false)

	function openModal(shouldOpen: boolean) {
		if (!store.loading) setOpen(shouldOpen)
	}

	return (
		<AlertDialog open={open} onOpenChange={openModal}>
			<AlertDialogTrigger className="flex flex-col justify-start" disabled={store.optimisticUpdate}>
				{ children }
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						{ title }	
					</AlertDialogTitle>
					<AlertDialogDescription>
						{ content }
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction onClick={() => action()}>
						Continue
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
