import Kanban from "@/components/kanban/Kanban";

type Props = {
	params: {
		id: string
	}
}
export default async function KanbanPage({ params } : Props) {
	console.log("Project id: ", params.id)
  
  return (
    <Kanban projectId={params.id}/>
  );
}
