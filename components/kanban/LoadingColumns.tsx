import PlaceHolderColumn from "./PlaceHolderColumn";

type Props = {
	numOfCols: number
}
export default function LoadingColumns({ numOfCols } : Props) {
	const arr = []
	for (let i=0; i<numOfCols; i++) { 
		arr.push(i)
	}

	return (
		<div className="flex flex-row h-full w-fit gap-x-4">
			{arr.map((i) => <PlaceHolderColumn key={i} />)}
		</div>
	)
}
