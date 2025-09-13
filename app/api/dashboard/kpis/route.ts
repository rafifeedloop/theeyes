import { NextResponse } from 'next/server'
import alerts from '@/data/demo/alerts.json'
import entities from '@/data/demo/entities.json'

export async function GET() {
  const activeAlerts = alerts.filter(a => a.status === 'OPEN').length
  const allRiskScores = [...entities.people, ...entities.companies].map(e => e.score)
  const avgRiskScore = allRiskScores.reduce((a, b) => a + b, 0) / allRiskScores.length

  return NextResponse.json({
    activeAlerts,
    avgRiskScore: Number(avgRiskScore.toFixed(2)),
    monitoredPeople: entities.people.length,
    monitoredCompanies: entities.companies.length
  })
}