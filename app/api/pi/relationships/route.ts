import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const personId = searchParams.get('personId')
  
  if (!personId) {
    return NextResponse.json({ error: 'personId is required' }, { status: 400 })
  }
  
  // Mock relationship data based on personId
  const relationships = {
    nodes: [
      { id: personId, type: 'person', label: 'Current Person' },
      { id: 'ci_77', type: 'company', label: 'PT Transportindo' },
      { id: 'ci_78', type: 'company', label: 'Global Logistics' },
      { id: 'pers_110', type: 'person', label: 'Ahmad S.' },
      { id: 'pers_103', type: 'person', label: 'Siti M.' },
    ],
    edges: [
      { from: personId, to: 'ci_77', type: 'owns', weight: 0.8 },
      { from: personId, to: 'ci_78', type: 'works_at', weight: 0.6 },
      { from: personId, to: 'pers_110', type: 'family', weight: 0.9 },
      { from: personId, to: 'pers_103', type: 'associate', weight: 0.5 },
    ]
  }
  
  return NextResponse.json(relationships)
}