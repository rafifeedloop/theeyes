import { NextRequest, NextResponse } from 'next/server'

// In-memory storage for alert statuses (in production, use database)
const alertStatuses: Record<string, string> = {}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json()
  const { status, action } = body
  
  // Update alert status
  alertStatuses[id] = status
  
  // Also log to audit trail
  const auditRes = await fetch(`${request.nextUrl.origin}/api/alerts/${id}/audit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: action || status.toLowerCase(),
      user: 'analyst_01',
      role: 'Analyst'
    })
  })
  
  return NextResponse.json({
    alertId: id,
    status,
    action,
    timestamp: new Date().toISOString()
  })
}