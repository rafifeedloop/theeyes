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

  // Find related alerts based on shared entities
  const relatedAlerts = alertsData
    .filter(a => a.id !== id)
    .filter(a => {
      // Check if alerts share any entities
      return alert.entities.some((e1: any) => 
        a.entities.some((e2: any) => e1.id === e2.id)
      )
    })
    .map(a => ({
      ...a,
      domain: a.entities.some((e: any) => e.type === 'person') ? 'person' :
              a.entities.some((e: any) => e.type === 'company') ? 'company' : 'location',
      location: a.geo,
      entities: a.entities.map((e: any) => ({
        ...e,
        label: e.name || e.id
      }))
    }))
    .slice(0, 5) // Limit to 5 related alerts

  // Build entity graph
  const nodes: any[] = []
  const edges: any[] = []
  const nodeSet = new Set()

  // Add entities from current alert
  alert.entities.forEach((entity: any) => {
    if (!nodeSet.has(entity.id)) {
      nodes.push({
        id: entity.id,
        type: entity.type,
        label: entity.name || entity.id
      })
      nodeSet.add(entity.id)
    }
  })

  // Add related entities and connections
  if (alert.entities.some((e: any) => e.type === 'person')) {
    // If person alert, add related companies
    const person = alert.entities.find((e: any) => e.type === 'person')
    if (person && person.id === 'pers_102') {
      nodes.push({ id: 'ci_77', type: 'company', label: 'PT Transportindo' })
      nodes.push({ id: 'ci_88', type: 'company', label: 'PT Cargo Indo' })
      edges.push({ from: person.id, to: 'ci_77', type: 'ubo' })
      edges.push({ from: person.id, to: 'ci_88', type: 'ubo' })
    }
  } else if (alert.entities.some((e: any) => e.type === 'company')) {
    // If company alert, add related persons
    const company = alert.entities.find((e: any) => e.type === 'company')
    if (company && company.id === 'ci_88') {
      nodes.push({ id: 'pers_102', type: 'person', label: 'Rizal F.' })
      nodes.push({ id: 'pers_105', type: 'person', label: 'Budi S.' })
      edges.push({ from: 'pers_102', to: company.id, type: 'ubo' })
      edges.push({ from: 'pers_105', to: company.id, type: 'ubo' })
    }
  }

  return NextResponse.json({
    relatedAlerts,
    graph: { nodes, edges }
  })
}