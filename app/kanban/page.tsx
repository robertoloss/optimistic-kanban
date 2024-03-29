import AuthButton from "@/components/AuthButton";
import Kanban from "@/components/kanban/Kanban";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function KanbanPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) { return redirect("/login") }

  return (
    <div className="w-full flex flex-col items-center overflow-x-auto">
      <div className="w-full">
          <nav className="w-full flex justify-end border-b border-b-muted-foreground h-16">
						<div className="w-fit max-w-4xl flex justify-between items-center p-3 text-sm">
							<AuthButton />
						</div>
        </nav>
      </div>
			<Kanban/>
    </div>
  );
}
