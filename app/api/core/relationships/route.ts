import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const entityId = searchParams.get('entity')
  const type = searchParams.get('type')
  
  const relationships = [
    {
      id: 'rel_778',
      type: 'owns',
      from: 'pers_102',
      to: 'ci_77',
      props: { share: 0.6, since: '2018-05-01' },
      lineage: [{ source: 'AHU', ingestedAt: '2025-09-11T07:00:00Z' }]
    },
    {
      id: 'rel_779',
      type: 'owns',
      from: 'pers_102',
      to: 'ci_88',
      props: { share: 0.4, since: '2019-03-15' },
      lineage: [{ source: 'AHU', ingestedAt: '2025-09-11T07:30:00Z' }]
    },
    {
      id: 'rel_780',
      type: 'worksAt',
      from: 'pers_103',
      to: 'ci_77',
      props: { position: 'Director', since: '2020-01-01' },
      lineage: [{ source: 'AHU', ingestedAt: '2025-09-11T08:00:00Z' }]
    },
    {
      id: 'rel_781',
      type: 'locatedIn',
      from: 'ci_77',
      to: 'loc_1',
      props: { address: 'Jl. Sudirman No. 123' },
      lineage: [{ source: 'AHU', ingestedAt: '2025-09-11T07:00:00Z' }]
    },
    {
      id: 'rel_782',
      type: 'locatedIn',
      from: 'ci_88',
      to: 'loc_1',
      props: { address: 'Jl. Thamrin No. 456' },
      lineage: [{ source: 'AHU', ingestedAt: '2025-09-11T07:30:00Z' }]
    },
    {
      id: 'rel_783',
      type: 'owns',
      from: 'ci_77',
      to: 'asset_1',
      props: { since: '2019-06-01' },
      lineage: [{ source: 'internal', ingestedAt: '2025-09-12T10:00:00Z' }]
    },
    {
      id: 'rel_784',
      type: 'participatedIn',
      from: 'ci_77',
      to: 'event_1',
      props: { role: 'winner', score: 95 },
      lineage: [{ source: 'LPSE', ingestedAt: '2025-08-16T09:00:00Z' }]
    },
    {
      id: 'rel_785',
      type: 'transactsWith',
      from: 'ci_77',
      to: 'ci_88',
      props: { volume: 125, totalValue: 8750000000, period: '2025-Q3' },
      lineage: [{ source: 'bank', ingestedAt: '2025-09-13T04:00:00Z' }]
    }
  ]
  
  let filtered = relationships
  
  if (entityId) {
    filtered = filtered.filter(r => r.from === entityId || r.to === entityId)
  }
  
  if (type) {
    filtered = filtered.filter(r => r.type === type)
  }
  
  return NextResponse.json(filtered)
}

export async function POST(request: Request) {
  const body = await request.json()
  
  const newRelationship = {
    id: `rel_${Date.now()}`,
    ...body,
    lineage: [{ source: 'manual', ingestedAt: new Date().toISOString() }]
  }
  
  return NextResponse.json(newRelationship, { status: 201 })
}