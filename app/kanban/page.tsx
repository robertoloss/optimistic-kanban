import AuthButton from "@/components/AuthButton";
import Kanban from "@/components/kanban/Kanban";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { actionGetTasks } from "../actions/actions";

export default async function KanbanPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) { return redirect("/login") }

	const tasks = await actionGetTasks()
	console.log("geTasks from KB page: ", tasks)
  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <div className="w-full">
          <nav className="w-full flex justify-end border-b border-b-foreground/10 h-16">
						<div className="w-fit max-w-4xl flex justify-between items-center p-3 text-sm">
							<AuthButton />
						</div>
        </nav>
      </div>
			<Kanban dbTasks={tasks} />
    </div>
  );
}
