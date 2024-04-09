import { ClipLoader } from "react-spinners";




export default function PlaceHolderColumn() {

	return (
		<div className={`
			flex flex-col min-w-[280px] max-w-[280px] h-full 
			bg-muted rounded-lg border-2 border-secondary
			justify-center items-center
		`}>
			<ClipLoader color="var(--muted-foreground)"/>
		</div>
	)
}
