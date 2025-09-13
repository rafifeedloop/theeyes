import { NextResponse } from 'next/server'
import timelines from '@/data/demo/timelines.json'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const personId = searchParams.get('personId')
  
  if (!personId) {
    return NextResponse.json({ error: 'personId is required' }, { status: 400 })
  }
  
  const timeline = timelines[personId as keyof typeof timelines] || []
  
  return NextResponse.json(timeline)
}