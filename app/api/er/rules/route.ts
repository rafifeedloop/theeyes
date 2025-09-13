import { NextResponse } from 'next/server'

export async function GET() {
  const rules = {
    rules: [
      {
        name: 'nik_exact',
        when: [{ field: 'ids.nik', op: 'eq' }],
        effect: 'match',
        weight: 1.0,
        enabled: true
      },
      {
        name: 'passport_exact',
        when: [{ field: 'ids.passport', op: 'eq' }],
        effect: 'match',
        weight: 0.95,
        enabled: true
      },
      {
        name: 'name_dob_fuzzy',
        when: [
          { field: 'name', op: 'jaro_winkler', min: 0.92 },
          { field: 'dob', op: 'eq' }
        ],
        effect: 'match',
        weight: 0.6,
        enabled: true
      },
      {
        name: 'phone_exact',
        when: [{ field: 'ids.msisdn', op: 'eq' }],
        effect: 'match',
        weight: 0.7,
        enabled: true
      },
      {
        name: 'email_exact',
        when: [{ field: 'ids.email', op: 'eq' }],
        effect: 'match',
        weight: 0.5,
        enabled: true
      },
      {
        name: 'npwp_exact',
        when: [{ field: 'ids.npwp', op: 'eq' }],
        effect: 'match',
        weight: 0.98,
        enabled: true
      },
      {
        name: 'company_name_fuzzy',
        when: [{ field: 'name', op: 'levenshtein', max_distance: 3 }],
        effect: 'match',
        weight: 0.4,
        enabled: true
      }
    ],
    thresholds: {
      auto_merge: 0.85,
      queue_review: 0.7,
      possible_match: 0.5
    },
    stats: {
      total_processed: 124567,
      auto_merged: 98234,
      queued_for_review: 15678,
      rejected: 10655,
      last_run: '2025-09-13T12:00:00Z'
    }
  }
  
  return NextResponse.json(rules)
}

export async function PUT(request: Request) {
  const body = await request.json()
  
  return NextResponse.json({
    ...body,
    updated_at: new Date().toISOString(),
    updated_by: 'system'
  })
}

export async function POST(request: Request) {
  const body = await request.json()
  
  const mockResult = {
    entity1: body.entity1,
    entity2: body.entity2,
    matchScore: 0.78,
    matchedRules: ['nik_exact', 'name_dob_fuzzy'],
    recommendation: body.forceMatch ? 'merge' : 'review',
    confidence: 0.78,
    timestamp: new Date().toISOString()
  }
  
  return NextResponse.json(mockResult)
}