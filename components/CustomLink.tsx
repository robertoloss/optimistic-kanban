import Link from "next/link"


type Props = {
	link: string
	text: string
}
export default function CustomLink({ link, text } : Props) {
	return (
		<Link
			href={`https://${link}`} 
			target="_blank"
			className="underline hover:text-destructive transition"
		>
			{text}
		</Link>
	)
}
