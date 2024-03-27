export const dynamic = 'force-dynamic' // defaults to auto

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url)
	const id = searchParams.get('id')
	console.log(id)

	return Response.json(id)
}
