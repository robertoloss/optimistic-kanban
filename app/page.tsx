import CustomLink from "@/components/CustomLink";
import AuthButton from "../components/AuthButton";
import Header from "@/components/Header";
import Link from "next/link";

export const dynamic = 'force-dynamic'

export default async function Index() {
  
  return (
    <div className="w-full flex flex-col items-center min-h-screen flex-grow">
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="w-full max-w-4xl flex justify-end items-center p-3 text-sm">
          <AuthButton />
        </div>
      </nav>
      <div className="
				flex flex-col h-full flex-grow  justify-between pt-[24px] 
				sm:pt-[80px] pb-4 max-w-4xl px-4 items-center
			">
				<div className="flex flex-col gap-y-[40px] sm:gap-y-[80px] items-center">
					<div className="flex flex-col gap-y-2 items-center">
						<h5 className="
							font-extrabold text-[40px] sm:text-[60px] text-center 
						">
							Optimistic Kanban Board
						</h5>
						<p className="font-mono text-base text-muted-foreground">
							version 1.0
						</p>
					</div>
					<h1 className="text-base sm:text-xl font-light text-center max-w-[640px]">
						A multi-project drag-and-drop task manager built with <CustomLink link="nextjs.org" text="Next.js" />, <CustomLink link="supabase.com" text="Supabase" />, <CustomLink link="tailwindcss.com" text="Tailwind" />, <CustomLink link="ui.shadcn.com" text="shadcn UI" />, and <CustomLink link="dndkit.com" text="dndkit" />. 
					</h1>
					{/*<h1>
						The <CustomLink link="" text="optimistic UI" /> is implemented both using a combination of <CustomLink link="/react.dev/reference/react/useState" text="useState" /> and <CustomLink link="react.dev/reference/react/useEffect" text="useEffect" /> (the old way) and with the new <CustomLink link="react.dev/reference/react/useOptimistic" text="useOptimistic" /> hook (the new way). The app fetches data both on the client and via <CustomLink link="nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations" text="Server Actions"/>
					</h1>*/}
					<Link href='/kanban/home' 
						className={`
							flex flex-row justify-center py-2 px-4 rounded-lg 
							w-fit h-fit bg-primary text-foreground hover:bg-primary-hover transition
						`}>
						Go to Kanban
					</Link>
				</div>
				<div className="flex flex-col items-center">
					<div className="hidden sm:visible">
						<p>
							Powered by:
						</p>
						<Header />
					</div>
				</div>
      </div>
    </div>
  );
}
