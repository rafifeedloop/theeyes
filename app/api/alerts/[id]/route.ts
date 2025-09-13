import { NextRequest, NextResponse } from 'next/server'
import alertsData from '@/data/demo/alerts.json'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const alert = alertsData.find(a => a.id === id)
  
  if (!alert) {
    return NextResponse.json({ error: 'Alert not found' }, { status: 404 })
  }

  // Add timeline data
  const alertDetail = {
    ...alert,
    domain: alert.entities.some((e: any) => e.type === 'person') ? 'person' :
            alert.entities.some((e: any) => e.type === 'company') ? 'company' : 'location',
    location: alert.geo,
    entities: alert.entities.map((e: any) => ({
      ...e,
      label: e.name || e.id
    })),
    timeline: generateTimeline(alert),
    description: generateDescription(alert)
  }

  return NextResponse.json(alertDetail)
}

function generateTimeline(alert: any) {
  const baseTime = new Date(alert.createdAt)
  const timeline = []
  
  // Generate timeline events based on alert type
  if (alert.title.includes('Crowd')) {
    timeline.push(
      { time: new Date(baseTime.getTime() - 30 * 60000).toISOString(), event: 'Initial density increase detected' },
      { time: new Date(baseTime.getTime() - 15 * 60000).toISOString(), event: 'Telco density spike detected' },
      { time: new Date(baseTime.getTime() - 5 * 60000).toISOString(), event: 'Crowd exceeds normal threshold' },
      { time: alert.createdAt, event: 'Alert triggered - crowd anomaly confirmed' }
    )
  } else if (alert.title.includes('transaction')) {
    timeline.push(
      { time: new Date(baseTime.getTime() - 60 * 60000).toISOString(), event: 'First unusual transaction detected' },
      { time: new Date(baseTime.getTime() - 30 * 60000).toISOString(), event: 'Multiple transactions flagged' },
      { time: new Date(baseTime.getTime() - 10 * 60000).toISOString(), event: 'Pattern analysis completed' },
      { time: alert.createdAt, event: 'Alert generated for suspicious activity' }
    )
  } else if (alert.title.includes('person')) {
    timeline.push(
      { time: new Date(baseTime.getTime() - 120 * 60000).toISOString(), event: 'Subject entered monitoring zone' },
      { time: new Date(baseTime.getTime() - 90 * 60000).toISOString(), event: 'First sensitive location visited' },
      { time: new Date(baseTime.getTime() - 45 * 60000).toISOString(), event: 'Second sensitive location visited' },
      { time: new Date(baseTime.getTime() - 15 * 60000).toISOString(), event: 'Third sensitive location visited' },
      { time: alert.createdAt, event: 'Movement pattern alert triggered' }
    )
  } else {
    timeline.push(
      { time: new Date(baseTime.getTime() - 20 * 60000).toISOString(), event: 'Anomaly detection started' },
      { time: new Date(baseTime.getTime() - 10 * 60000).toISOString(), event: 'Threshold exceeded' },
      { time: alert.createdAt, event: 'Alert generated' }
    )
  }
  
  return timeline
}

function generateDescription(alert: any) {
  if (alert.title.includes('Crowd')) {
    return 'Telco density analysis indicates unusual crowd gathering. Current density exceeds normal patterns by 250%. Monitoring for potential escalation.'
  } else if (alert.title.includes('transaction')) {
    return 'Multiple high-value transactions detected outside normal business patterns. Risk scoring indicates potential financial anomaly.'
  } else if (alert.title.includes('person')) {
    return 'Subject has visited multiple sensitive locations within a short timeframe. Movement pattern deviates from historical baseline.'
  } else if (alert.title.includes('Power')) {
    return 'Infrastructure monitoring detected power grid instability. Multiple sectors affected. Emergency response teams notified.'
  }
  return 'Automated monitoring system detected anomaly requiring investigation.'
}