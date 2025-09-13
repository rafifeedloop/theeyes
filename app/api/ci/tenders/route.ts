import { NextRequest, NextResponse } from 'next/server'

const mockTenders: Record<string, any[]> = {
  'ci_77': [
    { 
      tenderId: 'lkpp_881', 
      title: 'Procurement of trucks', 
      value: 15000000000, 
      date: '2025-07-14' 
    },
    { 
      tenderId: 'lkpp_882', 
      title: 'Logistics services', 
      value: 8000000000, 
      date: '2025-08-10' 
    },
    { 
      tenderId: 'lkpp_883', 
      title: 'Warehouse management system', 
      value: 3500000000, 
      date: '2025-09-05' 
    },
    { 
      tenderId: 'lkpp_884', 
      title: 'Fleet maintenance services', 
      value: 2200000000, 
      date: '2025-09-12' 
    }
  ],
  'ci_88': [
    { 
      tenderId: 'lkpp_901', 
      title: 'Cargo handling equipment', 
      value: 12000000000, 
      date: '2025-06-20' 
    },
    { 
      tenderId: 'lkpp_902', 
      title: 'International freight services', 
      value: 25000000000, 
      date: '2025-07-08' 
    }
  ],
  'ci_89': [
    { 
      tenderId: 'lkpp_911', 
      title: 'Software development services', 
      value: 1800000000, 
      date: '2025-05-15' 
    },
    { 
      tenderId: 'lkpp_912', 
      title: 'Cloud infrastructure', 
      value: 950000000, 
      date: '2025-08-22' 
    },
    { 
      tenderId: 'lkpp_913', 
      title: 'IT consulting services', 
      value: 650000000, 
      date: '2025-09-01' 
    }
  ]
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const companyId = searchParams.get('companyId')

  if (!companyId) {
    return NextResponse.json({ error: 'Company ID is required' }, { status: 400 })
  }

  const tenders = mockTenders[companyId] || []

  return NextResponse.json(tenders)
}