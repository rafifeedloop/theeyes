import { NextRequest, NextResponse } from 'next/server'
import entities from '@/data/demo/entities.json'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const type = searchParams.get('type')
  const limit = searchParams.get('limit') || '10'
  const region = searchParams.get('region')

  let data: any[] = []

  if (type === 'person') {
    data = [...entities.people].sort((a, b) => b.score - a.score)
  } else if (type === 'company') {
    data = [...entities.companies].sort((a, b) => b.score - a.score)
  } else {
    // Return both if no type specified
    data = [...entities.people, ...entities.companies].sort((a, b) => b.score - a.score)
  }

  // Apply limit
  data = data.slice(0, parseInt(limit))

  return NextResponse.json(data)
}