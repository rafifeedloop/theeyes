import { NextRequest, NextResponse } from 'next/server'

const mockFinancialData: Record<string, any> = {
  'ci_77': {
    revenueProxy: 125000000000,
    growthRate: 0.08,
    plnUsageTrend: [120, 115, 140, 135, 145, 160],
    bankRiskFlags: ['overdueLoan', 'suspiciousTransfer'],
    score: 0.65
  },
  'ci_88': {
    revenueProxy: 85000000000,
    growthRate: 0.15,
    plnUsageTrend: [80, 85, 90, 95, 100, 110],
    bankRiskFlags: [],
    score: 0.82
  },
  'ci_89': {
    revenueProxy: 45000000000,
    growthRate: -0.05,
    plnUsageTrend: [60, 58, 55, 52, 48, 45],
    bankRiskFlags: ['highDebtRatio', 'cashFlowIssues', 'overdraftWarning'],
    score: 0.38
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const companyId = searchParams.get('companyId')

  if (!companyId) {
    return NextResponse.json({ error: 'Company ID is required' }, { status: 400 })
  }

  const financialData = mockFinancialData[companyId] || {
    revenueProxy: Math.floor(Math.random() * 200000000000),
    growthRate: (Math.random() - 0.5) * 0.4,
    plnUsageTrend: Array.from({ length: 6 }, () => Math.floor(Math.random() * 200)),
    bankRiskFlags: Math.random() > 0.5 ? ['generalRisk'] : [],
    score: Math.random()
  }

  return NextResponse.json(financialData)
}