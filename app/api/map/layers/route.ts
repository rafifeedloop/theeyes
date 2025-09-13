import { NextRequest, NextResponse } from 'next/server'
import mapLayers from '@/data/demo/mapLayers.json'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const bbox = searchParams.get('bbox')
  const zoom = searchParams.get('zoom')

  // In production, filter by bbox and zoom level
  // For demo, return all data
  return NextResponse.json(mapLayers)
}