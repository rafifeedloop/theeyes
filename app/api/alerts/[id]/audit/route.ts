import { NextRequest, NextResponse } from 'next/server'

// In-memory storage for audit trails (in production, use database)
const auditTrails: Record<string, any[]> = {}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const trail = auditTrails[id] || []
  
  // Add default view entry if empty
  if (trail.length === 0) {
    const now = new Date().toISOString()
    trail.push({
      action: 'viewed',
      user: 'analyst_01',
      role: 'Analyst',
      time: now
    })
    auditTrails[id] = trail
  }
  
  return NextResponse.json(trail)
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json()
  const { action, user = 'analyst_01', role = 'Analyst' } = body
  
  if (!auditTrails[id]) {
    auditTrails[id] = []
  }
  
  const entry = {
    action,
    user,
    role,
    time: new Date().toISOString()
  }
  
  auditTrails[id].push(entry)
  
  return NextResponse.json(entry)
}