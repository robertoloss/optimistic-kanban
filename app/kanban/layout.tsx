import AuthButton from "@/components/AuthButton";
import Sidebar from "@/components/Sidebar";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

type Props = {
  children: React.ReactNode;
}

export default async function KanbanLayout({ children }: Props ) {
	const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) { return redirect("/login") }

  return (
		<div className="flex flex-col w-screen h-screen overflow-hidden">
			<div className="w-full px-4 pt-4">
				<nav className="w-full flex bg-layout justify-end rounded-xl h-16 border dark:border-none">
					<div className="w-fit max-w-4xl flex justify-between items-center p-3 text-sm">
						<AuthButton />
					</div>
				</nav>
			</div>
			<div className="flex flex-row justify-between w-full h-full pb-4 overflow-hidden">
				<div className={`
					hidden sm:grid sm:grid-cols-[116px] hover:grid-cols-[240px] transition-all
					xl:grid-cols-[240px]
				`}>
					<Sidebar/>
				</div>
				<div className=" w-full overflow-auto h-full">
					{ children }
				</div>
			</div>
		</div>
  );
}
