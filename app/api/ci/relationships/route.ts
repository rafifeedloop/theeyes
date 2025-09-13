import { NextRequest, NextResponse } from 'next/server'

const mockRelationships: Record<string, any> = {
  'ci_77': {
    nodes: [
      { id: 'ci_77', type: 'company', label: 'PT Transportindo' },
      { id: 'pers_102', type: 'person', label: 'Rizal F.' },
      { id: 'pers_103', type: 'person', label: 'Siti M.' },
      { id: 'pers_104', type: 'person', label: 'Ahmad K.' },
      { id: 'ci_88', type: 'company', label: 'PT Cargo Indo' },
      { id: 'ci_90', type: 'company', label: 'PT Logistics Solutions' },
      { id: 'ci_91', type: 'company', label: 'PT Express Delivery' }
    ],
    edges: [
      { from: 'pers_102', to: 'ci_77', type: 'ubo' },
      { from: 'pers_103', to: 'ci_77', type: 'ubo' },
      { from: 'pers_104', to: 'ci_77', type: 'ubo' },
      { from: 'ci_77', to: 'ci_88', type: 'subsidiary' },
      { from: 'ci_77', to: 'ci_90', type: 'affiliate' },
      { from: 'ci_77', to: 'ci_91', type: 'partner' }
    ]
  },
  'ci_88': {
    nodes: [
      { id: 'ci_88', type: 'company', label: 'PT Cargo Indo' },
      { id: 'pers_102', type: 'person', label: 'Rizal F.' },
      { id: 'pers_105', type: 'person', label: 'Budi S.' },
      { id: 'ci_77', type: 'company', label: 'PT Transportindo' },
      { id: 'ci_92', type: 'company', label: 'PT Shipping Lines' }
    ],
    edges: [
      { from: 'pers_102', to: 'ci_88', type: 'ubo' },
      { from: 'pers_105', to: 'ci_88', type: 'ubo' },
      { from: 'ci_88', to: 'ci_77', type: 'parent' },
      { from: 'ci_88', to: 'ci_92', type: 'partner' }
    ]
  },
  'ci_89': {
    nodes: [
      { id: 'ci_89', type: 'company', label: 'PT Tech Innovasi' },
      { id: 'pers_106', type: 'person', label: 'David L.' },
      { id: 'pers_107', type: 'person', label: 'Sarah W.' },
      { id: 'ci_93', type: 'company', label: 'PT Digital Solutions' },
      { id: 'ci_94', type: 'company', label: 'PT Cloud Services' }
    ],
    edges: [
      { from: 'pers_106', to: 'ci_89', type: 'ubo' },
      { from: 'pers_107', to: 'ci_89', type: 'ubo' },
      { from: 'ci_89', to: 'ci_93', type: 'subsidiary' },
      { from: 'ci_89', to: 'ci_94', type: 'partner' }
    ]
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const companyId = searchParams.get('companyId')

  if (!companyId) {
    return NextResponse.json({ error: 'Company ID is required' }, { status: 400 })
  }

  const relationships = mockRelationships[companyId] || {
    nodes: [{ id: companyId, type: 'company', label: 'Unknown Company' }],
    edges: []
  }

  return NextResponse.json(relationships)
}