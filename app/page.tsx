import AuthButton from "../components/AuthButton";
import Header from "@/components/Header";
import { getProfiles, getTasks } from "@/prisma/queries";

export const dynamic = 'force-dynamic'

export default async function Index() {
	const profiles = await getProfiles()
	const tasks = await getTasks()
  
  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="w-full max-w-4xl flex justify-end items-center p-3 text-sm">
          <AuthButton />
        </div>
      </nav>

      <div className="flex-1 flex flex-col gap-20  max-w-4xl px-3">
        <Header />
        <main className="flex-1 flex flex-col gap-6">
					{profiles && profiles.map(profile => 
						<h1 key={profile.id}>{profile.first_name} {profile.last_name}</h1>
					)}
					{tasks && tasks.map(task =>
						<div key={task.id}>
							<h1>{task.title}</h1>
							<h1>{task.content}</h1>
						</div>
					)}
        </main>
      </div>

    </div>
  );
}
