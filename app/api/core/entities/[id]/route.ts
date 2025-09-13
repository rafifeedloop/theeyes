import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  
  const entities: Record<string, any> = {
    'pers_102': {
      id: 'pers_102',
      type: 'person',
      labels: ['person', 'ubo'],
      props: {
        name: 'Rizal F.',
        ids: { nik: '3173xxxx', passport: 'C1234567', msisdn: '+62812xxxx' },
        dob: '1987-09-03',
        homeRegion: 'DKI Jakarta',
        riskScore: 0.72,
        activities: [
          { date: '2025-09-01', type: 'tender_submission', value: 450000000000 },
          { date: '2025-08-15', type: 'company_registration', value: 50000000000 }
        ]
      },
      lineage: [{ source: 'dukcapil', ingestedAt: '2025-09-10T02:14:00Z' }],
      resolution: {
        clusterId: 'er_c_991',
        confidence: 0.91,
        mergedFrom: ['raw_p_556', 'raw_p_612']
      }
    },
    'ci_77': {
      id: 'ci_77',
      type: 'company',
      labels: ['company', 'logistics'],
      props: {
        name: 'PT Transportindo',
        npwp: '01.234.567.8-901.000',
        sector: 'Logistics',
        registeredCapital: 50000000000,
        riskScore: 0.65,
        tenderWins: 12,
        avgTenderValue: 37500000000
      },
      lineage: [{ source: 'AHU', ingestedAt: '2025-09-11T07:00:00Z' }]
    }
  }
  
  const entity = entities[id]
  if (!entity) {
    return NextResponse.json(
      { error: 'Entity not found' },
      { status: 404 }
    )
  }
  
  return NextResponse.json(entity)
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  const body = await request.json()
  
  const updatedEntity = {
    id,
    ...body,
    lineage: [
      ...(body.lineage || []),
      { source: 'manual_update', ingestedAt: new Date().toISOString() }
    ]
  }
  
  return NextResponse.json(updatedEntity)
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  
  return NextResponse.json(
    { message: `Entity ${id} deleted successfully` },
    { status: 200 }
  )
}