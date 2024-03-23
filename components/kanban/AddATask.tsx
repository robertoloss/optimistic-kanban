
import { CirclePlus } from "lucide-react"
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



export default function AddATask() {

	return (
		<AlertDialog>
			<AlertDialogTrigger>
				<div className="flex flex-col h-6 hover:cursor-pointer rounded-full w-6">
					<CirclePlus color="#6b7280" />
				</div>
			</AlertDialogTrigger>
			<AlertDialogContent className="bg-gray-600">
				<AlertDialogHeader>
					<AlertDialogTitle className="font-normal text-base">
						Enter the title and the content of your task
					</AlertDialogTitle>
					<AlertDialogDescription className="flex flex-col">
						<div className="flex flex-col w-full">
							<h1>Title</h1>
							<input type="text" className="bg-background rounded-md p-2"/>
						</div>
						<div className="flex flex-col w-full">
							<h1>Title</h1>
							<textarea className="bg-background rounded-md p-2"/>
						</div>
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction>Continue</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
