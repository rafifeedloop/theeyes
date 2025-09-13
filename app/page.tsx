'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { AlertTriangle, Users, Building2, Activity, Shield, Briefcase } from 'lucide-react'
import Header from '@/components/Header'
import KpiCard from '@/components/KpiCard'
import AlertList from '@/components/AlertList'
import RiskPanel from '@/components/RiskPanel'
import MiniGraph from '@/components/MiniGraph'
import PersonRiskCard from '@/components/PersonRiskCard'
import useDashboardStore from '@/lib/store'
import type { GraphNode, GraphEdge } from '@/lib/types'

// Dynamic import for MapCanvas to avoid SSR issues with Leaflet
const MapCanvas = dynamic(() => import('@/components/MapCanvas'), {
  ssr: false,
  loading: () => (
    <div className="card p-0 h-full min-h-[500px] flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-[var(--primary-300)] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-sm text-[var(--text-muted)]">Loading map...</p>
      </div>
    </div>
  )
})

export default function Dashboard() {
  const {
    edition,
    setEdition,
    kpis,
    alerts,
    topPeople,
    topCompanies,
    isLoading,
    fetchKPIs,
    fetchAlerts,
    fetchTopRisk,
    selectedEntityId,
    selectEntity
  } = useDashboardStore()

  const [graphData, setGraphData] = useState<{ nodes: GraphNode[], edges: GraphEdge[] }>({
    nodes: [],
    edges: []
  })
  const [highRiskPersons, setHighRiskPersons] = useState<any[]>([])

  // Fetch initial data
  useEffect(() => {
    fetchKPIs()
    fetchAlerts()
    fetchTopRisk()
    // Fetch initial graph data
    fetch('/api/graph/snapshot')
      .then(res => res.json())
      .then(data => setGraphData(data))
      .catch(err => console.error('Failed to fetch initial graph data:', err))
    // Fetch high risk persons
    fetch('/api/pi/profile')
      .then(res => res.json())
      .then(data => {
        const filtered = data.filter((p: any) => p.riskLevel === 'High' || p.riskLevel === 'Medium')
          .sort((a: any, b: any) => b.riskScore - a.riskScore)
        setHighRiskPersons(filtered)
      })
      .catch(err => console.error('Failed to fetch persons:', err))
  }, [])

  // Fetch graph data when entity is selected
  useEffect(() => {
    if (selectedEntityId) {
      fetch(`/api/graph/snapshot?entityId=${selectedEntityId}`)
        .then(res => res.json())
        .then(data => setGraphData(data))
    } else {
      // Fetch full graph if no entity selected
      fetch('/api/graph/snapshot')
        .then(res => res.json())
        .then(data => setGraphData(data))
    }
  }, [selectedEntityId])

  // Auto-refresh data
  useEffect(() => {
    const intervals = [
      setInterval(fetchKPIs, 60000), // KPIs every 60s
      setInterval(fetchAlerts, 10000), // Alerts every 10s
      setInterval(fetchTopRisk, 45000), // Risk every 45s
    ]

    return () => intervals.forEach(clearInterval)
  }, [])

  const handleEntityClick = (type: 'person' | 'company', id: string) => {
    selectEntity(id)
    // In production, would navigate to detail page
    console.log(`Navigate to /${type === 'person' ? 'pi' : 'ci'}/${id}`)
  }

  const handleGraphNodeClick = (node: GraphNode) => {
    selectEntity(node.id)
  }

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <Header />
      
      <main className="p-6">
        {/* Edition Tabs */}
        <div className="mb-6">
          <div className="inline-flex items-center p-1 bg-gray-100 rounded-xl">
            <button
              onClick={() => setEdition('enterprise')}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                edition === 'enterprise'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              Enterprise
            </button>
            <button
              onClick={() => setEdition('gov')}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                edition === 'gov'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Shield className="w-4 h-4" />
              Government
            </button>
          </div>
        </div>

        {/* KPI Strip */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {edition === 'gov' && (
            <KpiCard
              title="Active Alerts"
              value={kpis?.activeAlerts || 0}
              icon={AlertTriangle}
              trend={12}
              loading={isLoading.kpis}
              color="danger"
              onClick={() => console.log('Navigate to /alerts')}
            />
          )}
          <KpiCard
            title="Avg Risk Score"
            value={kpis ? `${(kpis.avgRiskScore * 100).toFixed(0)}%` : '0%'}
            icon={Activity}
            trend={-5}
            loading={isLoading.kpis}
            color="warning"
          />
          <KpiCard
            title="Monitored People"
            value={kpis?.monitoredPeople || 0}
            icon={Users}
            trend={8}
            loading={isLoading.kpis}
            color="primary"
          />
          <KpiCard
            title="Monitored Companies"
            value={kpis?.monitoredCompanies || 0}
            icon={Building2}
            trend={3}
            loading={isLoading.kpis}
            color="success"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Alerts */}
          {edition === 'gov' && (
            <div className="lg:col-span-3">
              <AlertList 
                alerts={alerts} 
                loading={isLoading.alerts}
              />
            </div>
          )}

          {/* Center: Map */}
          <div className={edition === 'gov' ? 'lg:col-span-6' : 'lg:col-span-8'}>
            <MapCanvas 
              onLassoSelect={(polygon) => {
                console.log('Lasso selection:', polygon)
                // Would filter entities by polygon in production
              }}
            />
          </div>

          {/* Right: Risk Panels */}
          <div className={edition === 'gov' ? 'lg:col-span-3' : 'lg:col-span-4'}>
            <div className="space-y-6">
              <RiskPanel
                people={topPeople}
                companies={topCompanies}
                loading={isLoading.risk}
                onEntityClick={handleEntityClick}
              />
              <PersonRiskCard persons={highRiskPersons} />
            </div>
          </div>
        </div>

        {/* Bottom: Knowledge Graph */}
        <div className="mt-6">
          <MiniGraph
            nodes={graphData.nodes}
            edges={graphData.edges}
            onNodeClick={handleGraphNodeClick}
            loading={false}
          />
        </div>
      </main>
    </div>
  )
}