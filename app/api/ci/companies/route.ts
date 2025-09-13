import { NextRequest, NextResponse } from 'next/server'

export const mockCompanies = [
  {
    id: 'ci_77',
    name: 'PT Transportindo',
    sector: 'Logistics',
    riskLevel: 'Medium',
    riskScore: 0.58,
    revenue: 125000000000,
    employees: 450,
    location: 'Jakarta'
  },
  {
    id: 'ci_88',
    name: 'PT Cargo Indo',
    sector: 'Logistics',
    riskLevel: 'Low',
    riskScore: 0.35,
    revenue: 85000000000,
    employees: 320,
    location: 'Jakarta'
  },
  {
    id: 'ci_89',
    name: 'PT Tech Innovasi',
    sector: 'Technology',
    riskLevel: 'High',
    riskScore: 0.72,
    revenue: 45000000000,
    employees: 150,
    location: 'Jakarta'
  },
  {
    id: 'ci_90',
    name: 'PT Logistics Solutions',
    sector: 'Logistics',
    riskLevel: 'Low',
    riskScore: 0.28,
    revenue: 95000000000,
    employees: 280,
    location: 'Surabaya'
  },
  {
    id: 'ci_91',
    name: 'PT Express Delivery',
    sector: 'Logistics',
    riskLevel: 'Medium',
    riskScore: 0.45,
    revenue: 67000000000,
    employees: 200,
    location: 'Bandung'
  },
  {
    id: 'ci_92',
    name: 'PT Shipping Lines',
    sector: 'Maritime',
    riskLevel: 'High',
    riskScore: 0.68,
    revenue: 230000000000,
    employees: 850,
    location: 'Jakarta'
  },
  {
    id: 'ci_93',
    name: 'PT Digital Solutions',
    sector: 'Technology',
    riskLevel: 'Low',
    riskScore: 0.22,
    revenue: 38000000000,
    employees: 120,
    location: 'Jakarta'
  },
  {
    id: 'ci_94',
    name: 'PT Cloud Services',
    sector: 'Technology',
    riskLevel: 'Medium',
    riskScore: 0.51,
    revenue: 52000000000,
    employees: 180,
    location: 'Jakarta'
  },
  {
    id: 'ci_95',
    name: 'PT Mining Resources',
    sector: 'Mining',
    riskLevel: 'High',
    riskScore: 0.76,
    revenue: 450000000000,
    employees: 2200,
    location: 'Kalimantan'
  },
  {
    id: 'ci_96',
    name: 'PT Energy Bersama',
    sector: 'Energy',
    riskLevel: 'Medium',
    riskScore: 0.54,
    revenue: 320000000000,
    employees: 1100,
    location: 'Jakarta'
  },
  {
    id: 'ci_97',
    name: 'PT Construction Prima',
    sector: 'Construction',
    riskLevel: 'High',
    riskScore: 0.69,
    revenue: 180000000000,
    employees: 650,
    location: 'Jakarta'
  },
  {
    id: 'ci_98',
    name: 'PT Food Industries',
    sector: 'Food & Beverage',
    riskLevel: 'Low',
    riskScore: 0.31,
    revenue: 75000000000,
    employees: 420,
    location: 'Surabaya'
  },
  {
    id: 'ci_99',
    name: 'PT Retail Networks',
    sector: 'Retail',
    riskLevel: 'Medium',
    riskScore: 0.47,
    revenue: 110000000000,
    employees: 890,
    location: 'Jakarta'
  },
  {
    id: 'ci_100',
    name: 'PT Healthcare Systems',
    sector: 'Healthcare',
    riskLevel: 'Low',
    riskScore: 0.25,
    revenue: 65000000000,
    employees: 340,
    location: 'Jakarta'
  },
  {
    id: 'ci_101',
    name: 'PT Finance Corp',
    sector: 'Financial Services',
    riskLevel: 'High',
    riskScore: 0.71,
    revenue: 890000000000,
    employees: 450,
    location: 'Jakarta'
  }
]

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const search = searchParams.get('search')?.toLowerCase()
  const sector = searchParams.get('sector')
  const riskLevel = searchParams.get('riskLevel')
  
  let filteredCompanies = [...mockCompanies]
  
  if (search) {
    filteredCompanies = filteredCompanies.filter(company => 
      company.name.toLowerCase().includes(search) ||
      company.sector.toLowerCase().includes(search) ||
      company.location.toLowerCase().includes(search)
    )
  }
  
  if (sector) {
    filteredCompanies = filteredCompanies.filter(company => 
      company.sector === sector
    )
  }
  
  if (riskLevel) {
    filteredCompanies = filteredCompanies.filter(company => 
      company.riskLevel === riskLevel
    )
  }
  
  return NextResponse.json(filteredCompanies)
}