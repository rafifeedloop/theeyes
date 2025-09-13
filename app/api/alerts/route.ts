import { NextRequest, NextResponse } from 'next/server'
import alertsData from '@/data/demo/alerts.json'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const severity = searchParams.get('severity')
  const limit = searchParams.get('limit')
  const status = searchParams.get('status')
  const domain = searchParams.get('domain')

  // Transform alerts to include domain based on entities
  const alerts = alertsData.map(alert => {
    let alertDomain = 'location'
    if (alert.entities.some((e: any) => e.type === 'person')) {
      alertDomain = 'person'
    } else if (alert.entities.some((e: any) => e.type === 'company')) {
      alertDomain = 'company'
    }
    
    return {
      ...alert,
      domain: alertDomain,
      location: alert.geo,
      entities: alert.entities.map((e: any) => ({
        ...e,
        label: e.name || e.id
      }))
    }
  })

  let filteredAlerts = [...alerts]

  if (severity) {
    filteredAlerts = filteredAlerts.filter(a => a.severity === severity)
  }

  if (status) {
    filteredAlerts = filteredAlerts.filter(a => a.status === status)
  }

  if (domain) {
    filteredAlerts = filteredAlerts.filter(a => a.domain === domain)
  }

  if (limit) {
    filteredAlerts = filteredAlerts.slice(0, parseInt(limit))
  }

  return NextResponse.json(filteredAlerts)
}