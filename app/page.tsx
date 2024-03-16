import AuthButton from "../components/AuthButton";
import Header from "@/components/Header";
import { prisma } from "@/prisma/client";
import { get } from "http";

export const dynamic = 'force-dynamic'

const getProfiles = async () => {
["getProfiles"]
try {
		const profiles = await prisma.profile.findMany();
		return profiles;
	} catch( error ) {
		console.log(error);
	}
}
const getTasks = async () => {
["getProfiles"]
try {
		return await prisma.task.findMany();
	} catch( error ) {
		console.log(error);
	}
}

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

      <div className="animate-in flex-1 flex flex-col gap-20 opacity-0 max-w-4xl px-3">
        <Header />
        <main className="flex-1 flex flex-col gap-6">
					{profiles && profiles.map(profile => 
						<h1>{profile.first_name} {profile.last_name}</h1>
					)}
					{tasks && tasks.map(task =>
						<div>
							<h1>{task.title}</h1>
							<h1>{task.content}</h1>
						</div>
					)}
        </main>
      </div>

    </div>
  );
}
