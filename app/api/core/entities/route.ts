import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type')
  const limit = parseInt(searchParams.get('limit') || '100')
  
  const entities = [
    {
      id: 'pers_102',
      type: 'person',
      labels: ['person', 'ubo'],
      props: {
        name: 'Rizal F.',
        ids: { nik: '3173xxxx', passport: 'C1234567', msisdn: '+62812xxxx' },
        dob: '1987-09-03',
        homeRegion: 'DKI Jakarta'
      },
      lineage: [{ source: 'dukcapil', ingestedAt: '2025-09-10T02:14:00Z' }],
      resolution: {
        clusterId: 'er_c_991',
        confidence: 0.91,
        mergedFrom: ['raw_p_556', 'raw_p_612']
      }
    },
    {
      id: 'pers_103',
      type: 'person',
      labels: ['person'],
      props: {
        name: 'Siti M.',
        ids: { nik: '3175xxxx', msisdn: '+62813xxxx' },
        dob: '1990-12-15',
        homeRegion: 'DKI Jakarta'
      },
      lineage: [{ source: 'dukcapil', ingestedAt: '2025-09-10T03:00:00Z' }]
    },
    {
      id: 'ci_77',
      type: 'company',
      labels: ['company', 'logistics'],
      props: {
        name: 'PT Transportindo',
        npwp: '01.234.567.8-901.000',
        sector: 'Logistics',
        registeredCapital: 50000000000
      },
      lineage: [{ source: 'AHU', ingestedAt: '2025-09-11T07:00:00Z' }]
    },
    {
      id: 'ci_88',
      type: 'company',
      labels: ['company', 'logistics'],
      props: {
        name: 'PT Cargo Indo',
        npwp: '01.345.678.9-012.000',
        sector: 'Logistics',
        registeredCapital: 25000000000
      },
      lineage: [{ source: 'AHU', ingestedAt: '2025-09-11T07:30:00Z' }]
    },
    {
      id: 'loc_1',
      type: 'location',
      labels: ['location', 'province'],
      props: {
        name: 'DKI Jakarta',
        coordinates: [-6.2088, 106.8456],
        admin_level: 'province',
        population: 10562088
      },
      lineage: [{ source: 'BPS', ingestedAt: '2025-09-01T00:00:00Z' }]
    },
    {
      id: 'asset_1',
      type: 'asset',
      labels: ['asset', 'fleet'],
      props: {
        name: 'Vehicle Fleet',
        assetType: 'vehicles',
        count: 45,
        totalValue: 12500000000
      },
      lineage: [{ source: 'internal', ingestedAt: '2025-09-12T10:00:00Z' }]
    },
    {
      id: 'event_1',
      type: 'event',
      labels: ['event', 'tender'],
      props: {
        name: 'Road Construction Tender',
        eventType: 'tender',
        value: 450000000000,
        date: '2025-08-15',
        status: 'awarded'
      },
      lineage: [{ source: 'LPSE', ingestedAt: '2025-08-16T09:00:00Z' }]
    }
  ]
  
  let filtered = entities
  if (type) {
    filtered = entities.filter(e => e.type === type)
  }
  
  return NextResponse.json(filtered.slice(0, limit))
}

export async function POST(request: Request) {
  const body = await request.json()
  
  const newEntity = {
    id: `${body.type}_${Date.now()}`,
    ...body,
    lineage: [{ source: 'manual', ingestedAt: new Date().toISOString() }]
  }
  
  return NextResponse.json(newEntity, { status: 201 })
}