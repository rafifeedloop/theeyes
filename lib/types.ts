export interface Alert {
  id: string
  title: string
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  entities: Entity[]
  source: string
  createdAt: string
  status: 'OPEN' | 'ACKNOWLEDGED' | 'ASSIGNED' | 'CLOSED'
  geo?: {
    lat: number
    lng: number
  }
  assignedTo?: string
}

export interface Entity {
  type: 'person' | 'company' | 'location'
  id: string
  name?: string
}

export interface Person {
  id: string
  display: string
  score: number
  signals: string[]
  lastSeen: string
  location?: {
    lat: number
    lng: number
  }
  avatar?: string
}

export interface Company {
  id: string
  display: string
  score: number
  signals: string[]
  lastUpdate: string
  sector?: string
  employees?: number
}

export interface Location {
  id: string
  name: string
  type: string
  risk: number
  population?: number
  geo: {
    lat: number
    lng: number
  }
}

export interface KPI {
  activeAlerts: number
  avgRiskScore: number
  monitoredPeople: number
  monitoredCompanies: number
}

export interface GraphNode {
  id: string
  type: 'person' | 'company' | 'location'
  label: string
  risk: number
}

export interface GraphEdge {
  from: string
  to: string
  type: string
  strength: number
}

export type Edition = 'enterprise' | 'gov'