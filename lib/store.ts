import { create } from 'zustand'
import type { Alert, KPI, Person, Company, Edition } from './types'

interface DashboardState {
  // UI State
  edition: Edition
  timeRange: { start: Date; end: Date }
  region: string
  selectedEntityId: string | null
  selectedPolygon: [number, number][] | null
  mapCenter: [number, number]
  mapZoom: number
  
  // Data State
  kpis: KPI | null
  alerts: Alert[]
  topPeople: Person[]
  topCompanies: Company[]
  isLoading: {
    kpis: boolean
    alerts: boolean
    risk: boolean
    map: boolean
  }
  
  // Actions
  setEdition: (edition: Edition) => void
  setTimeRange: (range: { start: Date; end: Date }) => void
  setRegion: (region: string) => void
  selectEntity: (id: string | null) => void
  setSelectedPolygon: (polygon: [number, number][] | null) => void
  setMapView: (center: [number, number], zoom: number) => void
  
  // Data Actions
  fetchKPIs: () => Promise<void>
  fetchAlerts: () => Promise<void>
  fetchTopRisk: () => Promise<void>
  acknowledgeAlert: (alertId: string) => void
  assignAlert: (alertId: string, userId: string) => void
}

const useDashboardStore = create<DashboardState>((set, get) => ({
  // Initial UI State
  edition: 'enterprise',
  timeRange: {
    start: new Date(Date.now() - 24 * 60 * 60 * 1000),
    end: new Date()
  },
  region: 'jakarta',
  selectedEntityId: null,
  selectedPolygon: null,
  mapCenter: [-6.2088, 106.8456], // Jakarta center
  mapZoom: 12,
  
  // Initial Data State
  kpis: null,
  alerts: [],
  topPeople: [],
  topCompanies: [],
  isLoading: {
    kpis: false,
    alerts: false,
    risk: false,
    map: false
  },
  
  // UI Actions
  setEdition: (edition) => set({ edition }),
  setTimeRange: (timeRange) => set({ timeRange }),
  setRegion: (region) => set({ region }),
  selectEntity: (selectedEntityId) => set({ selectedEntityId }),
  setSelectedPolygon: (selectedPolygon) => set({ selectedPolygon }),
  setMapView: (mapCenter, mapZoom) => set({ mapCenter, mapZoom }),
  
  // Data Actions
  fetchKPIs: async () => {
    // Only run on client side
    if (typeof window === 'undefined') return
    
    set((state) => ({ isLoading: { ...state.isLoading, kpis: true } }))
    try {
      const response = await fetch('/api/dashboard/kpis')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      set({ kpis: data })
    } catch (error) {
      // Use fallback data if fetch fails
      const fallbackKPIs: KPI = {
        activeAlerts: 18,
        avgRiskScore: 0.42,
        monitoredPeople: 1247,
        monitoredCompanies: 523
      }
      set({ kpis: fallbackKPIs })
      console.warn('Using fallback KPIs due to fetch error')
    } finally {
      set((state) => ({ isLoading: { ...state.isLoading, kpis: false } }))
    }
  },
  
  fetchAlerts: async () => {
    // Only run on client side
    if (typeof window === 'undefined') return
    
    set((state) => ({ isLoading: { ...state.isLoading, alerts: true } }))
    try {
      const response = await fetch('/api/alerts')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      set({ alerts: data })
    } catch (error) {
      // Use fallback data if fetch fails
      const fallbackAlerts: Alert[] = []
      set({ alerts: fallbackAlerts })
      console.warn('Using fallback alerts due to fetch error')
    } finally {
      set((state) => ({ isLoading: { ...state.isLoading, alerts: false } }))
    }
  },
  
  fetchTopRisk: async () => {
    // Only run on client side
    if (typeof window === 'undefined') return
    
    set((state) => ({ isLoading: { ...state.isLoading, risk: true } }))
    try {
      const [peopleRes, companiesRes] = await Promise.all([
        fetch('/api/risk/top?type=person&limit=5'),
        fetch('/api/risk/top?type=company&limit=5')
      ])
      
      if (!peopleRes.ok || !companiesRes.ok) {
        throw new Error('Failed to fetch risk data')
      }
      
      const [people, companies] = await Promise.all([
        peopleRes.json(),
        companiesRes.json()
      ])
      set({ topPeople: people, topCompanies: companies })
    } catch (error) {
      // Use fallback data if fetch fails
      const fallbackPeople: Person[] = []
      const fallbackCompanies: Company[] = []
      set({ topPeople: fallbackPeople, topCompanies: fallbackCompanies })
      console.warn('Using fallback risk data due to fetch error')
    } finally {
      set((state) => ({ isLoading: { ...state.isLoading, risk: false } }))
    }
  },
  
  acknowledgeAlert: (alertId) => {
    set((state) => ({
      alerts: state.alerts.map(alert =>
        alert.id === alertId
          ? { ...alert, status: 'ACKNOWLEDGED' as const }
          : alert
      )
    }))
  },
  
  assignAlert: (alertId, userId) => {
    set((state) => ({
      alerts: state.alerts.map(alert =>
        alert.id === alertId
          ? { ...alert, status: 'ASSIGNED' as const, assignedTo: userId }
          : alert
      )
    }))
  }
}))

export default useDashboardStore