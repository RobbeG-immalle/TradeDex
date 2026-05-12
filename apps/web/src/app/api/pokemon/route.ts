import { type NextRequest, NextResponse } from 'next/server'
import { searchCards, getCardsBySet } from '@/lib/pokemon/api'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q')
  const setId = searchParams.get('set')
  const page = Number(searchParams.get('page') ?? '1')
  const pageSize = Number(searchParams.get('pageSize') ?? '20')

  try {
    if (query) {
      const data = await searchCards(query, page, pageSize)
      return NextResponse.json(data)
    }

    if (setId) {
      const data = await getCardsBySet(setId, page, pageSize)
      return NextResponse.json(data)
    }

    return NextResponse.json({ error: 'Missing query parameter: q or set' }, { status: 400 })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
