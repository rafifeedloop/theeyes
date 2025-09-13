'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { AlertTriangle, Bell, Shield, Filter, Clock, MapPin, User, Building2, X, Check, ChevronRight, AlertCircle, Activity, Users, Eye, UserCheck, FileText, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'

// Dynamic import for MapCanvas to avoid SSR issues
const MapCanvas = dynamic(() => import('@/components/MapCanvas'), {
  ssr: false,
  loading: () => (
    <div className="h-full min-h-[500px] flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  )
})

interface Alert {
  id: string
  title: string
  severity: 'HIGH' | 'MEDIUM' | 'LOW'
  domain: 'location' | 'person' | 'company'
  entities: Array<{
    type: string
    id: string
    label?: string
  }>
  source: string
  createdAt: string
  status: 'OPEN' | 'ACKNOWLEDGED' | 'CLOSED'
  description?: string
  location?: {
    lat: number
    lng: number
  }
}

interface AlertDetail extends Alert {
  timeline: Array<{
    time: string
    event: string
  }>
}

interface Correlation {
  relatedAlerts: Alert[]
  graph: {
    nodes: Array<{
      id: string
      type: string
      label: string
    }>
    edges: Array<{
      from: string
      to: string
      type: string
    }>
  }
}

interface AuditEntry {
  action: string
  user: string
  time: string
  role?: string
}

export default function MonitoringAlerting() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [selectedAlert, setSelectedAlert] = useState<AlertDetail | null>(null)
  const [correlation, setCorrelation] = useState<Correlation | null>(null)
  const [auditTrail, setAuditTrail] = useState<AuditEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    severity: '',
    domain: '',
    status: 'OPEN'
  })
  const [autoRefresh, setAutoRefresh] = useState(true)

  useEffect(() => {
    fetchAlerts()
    
    // Auto-refresh every 10 seconds if enabled
    let interval: NodeJS.Timeout
    if (autoRefresh) {
      interval = setInterval(fetchAlerts, 10000)
    }
    
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [filters, autoRefresh])

  useEffect(() => {
    if (selectedAlert) {
      fetchAlertDetails(selectedAlert.id)
      fetchCorrelation(selectedAlert.id)
      fetchAuditTrail(selectedAlert.id)
    }
  }, [selectedAlert?.id])

  const fetchAlerts = async () => {
    try {
      const params = new URLSearchParams({
        status: filters.status,
        ...(filters.severity && { severity: filters.severity }),
        ...(filters.domain && { domain: filters.domain })
      })
      const res = await fetch(`/api/alerts?${params}`)
      const data = await res.json()
      setAlerts(data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching alerts:', error)
      setLoading(false)
    }
  }

  const fetchAlertDetails = async (alertId: string) => {
    try {
      const res = await fetch(`/api/alerts/${alertId}`)
      const data = await res.json()
      setSelectedAlert(data)
    } catch (error) {
      console.error('Error fetching alert details:', error)
    }
  }

  const fetchCorrelation = async (alertId: string) => {
    try {
      const res = await fetch(`/api/alerts/${alertId}/correlation`)
      const data = await res.json()
      setCorrelation(data)
    } catch (error) {
      console.error('Error fetching correlation:', error)
    }
  }

  const fetchAuditTrail = async (alertId: string) => {
    try {
      const res = await fetch(`/api/alerts/${alertId}/audit`)
      const data = await res.json()
      setAuditTrail(data)
    } catch (error) {
      console.error('Error fetching audit trail:', error)
    }
  }

  const updateAlertStatus = async (alertId: string, status: string, action: string) => {
    try {
      await fetch(`/api/alerts/${alertId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, action })
      })
      fetchAlerts()
      if (selectedAlert?.id === alertId) {
        fetchAuditTrail(alertId)
      }
    } catch (error) {
      console.error('Error updating alert status:', error)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'HIGH': return 'bg-red-500 text-white'
      case 'MEDIUM': return 'bg-yellow-500 text-white'
      case 'LOW': return 'bg-blue-500 text-white'
      default: return 'bg-gray-500 text-white'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN': return 'text-red-600 bg-red-50'
      case 'ACKNOWLEDGED': return 'text-yellow-600 bg-yellow-50'
      case 'CLOSED': return 'text-green-600 bg-green-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getDomainIcon = (domain: string) => {
    switch (domain) {
      case 'person': return Users
      case 'company': return Building2
      case 'location': return MapPin
      default: return AlertCircle
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              ← Back to Dashboard
            </Link>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Shield className="w-6 h-6 text-red-600" />
              Monitoring & Alerting
              <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">GOV ONLY</span>
            </h1>
          </div>
          
          {/* Filters and Controls */}
          <div className="flex items-center gap-3">
            <select
              value={filters.severity}
              onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
              className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Severities</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
            
            <select
              value={filters.domain}
              onChange={(e) => setFilters({ ...filters, domain: e.target.value })}
              className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Domains</option>
              <option value="person">Person</option>
              <option value="company">Company</option>
              <option value="location">Location</option>
            </select>
            
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="OPEN">Open</option>
              <option value="ACKNOWLEDGED">Acknowledged</option>
              <option value="CLOSED">Closed</option>
            </select>
            
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                autoRefresh 
                  ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`} />
              {autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
            </button>
            
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>{new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Left Sidebar - Active Alerts List */}
        <div className="w-96 bg-white border-r overflow-y-auto">
          <div className="p-4 border-b bg-gray-50">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Active Alerts ({alerts.length})</h2>
              <button
                onClick={fetchAlerts}
                className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            </div>
          ) : alerts.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <AlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No alerts matching filters</p>
            </div>
          ) : (
            <div className="divide-y">
              {alerts.map((alert) => {
                const DomainIcon = getDomainIcon(alert.domain)
                return (
                  <div
                    key={alert.id}
                    onClick={() => setSelectedAlert(alert as AlertDetail)}
                    className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                      selectedAlert?.id === alert.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 text-xs font-bold rounded ${getSeverityColor(alert.severity)}`}>
                          {alert.severity}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(alert.status)}`}>
                          {alert.status}
                        </span>
                      </div>
                      <DomainIcon className="w-4 h-4 text-gray-400" />
                    </div>
                    
                    <h3 className="font-medium text-sm mb-2 line-clamp-2">{alert.title}</h3>
                    
                    <div className="flex flex-wrap gap-1 mb-2">
                      {alert.entities.slice(0, 3).map((entity, idx) => (
                        <span key={idx} className="px-2 py-1 bg-gray-100 text-xs rounded">
                          {entity.label || entity.id}
                        </span>
                      ))}
                      {alert.entities.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-xs rounded">
                          +{alert.entities.length - 3} more
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{alert.source}</span>
                      <span>{format(new Date(alert.createdAt), 'HH:mm:ss')}</span>
                    </div>
                    
                    {alert.status === 'OPEN' && (
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            updateAlertStatus(alert.id, 'ACKNOWLEDGED', 'acknowledge')
                          }}
                          className="flex-1 flex items-center justify-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs hover:bg-yellow-200 transition-colors"
                        >
                          <Eye className="w-3 h-3" />
                          Acknowledge
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            updateAlertStatus(alert.id, 'CLOSED', 'close')
                          }}
                          className="flex-1 flex items-center justify-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded text-xs hover:bg-green-200 transition-colors"
                        >
                          <Check className="w-3 h-3" />
                          Close
                        </button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Center - Alert Detail / Map */}
        <div className="flex-1 flex flex-col">
          {selectedAlert ? (
            <>
              {/* Alert Detail Header */}
              <div className="bg-white border-b p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 text-xs font-bold rounded ${getSeverityColor(selectedAlert.severity)}`}>
                        {selectedAlert.severity}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(selectedAlert.status)}`}>
                        {selectedAlert.status}
                      </span>
                      <span className="text-sm text-gray-500">ID: {selectedAlert.id}</span>
                    </div>
                    <h2 className="text-lg font-semibold mb-1">{selectedAlert.title}</h2>
                    <p className="text-sm text-gray-600">{selectedAlert.description}</p>
                  </div>
                  <button
                    onClick={() => setSelectedAlert(null)}
                    className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                {/* Entity Tags */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {selectedAlert.entities.map((entity, idx) => (
                    <Link
                      key={idx}
                      href={`/${entity.type === 'person' ? 'pi' : entity.type === 'company' ? 'ci' : 'li'}/${entity.id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      {entity.type === 'person' ? <User className="w-3 h-3" /> :
                       entity.type === 'company' ? <Building2 className="w-3 h-3" /> :
                       <MapPin className="w-3 h-3" />}
                      <span className="text-sm font-medium">{entity.label || entity.id}</span>
                      <ChevronRight className="w-3 h-3" />
                    </Link>
                  ))}
                </div>
              </div>
              
              {/* Map / Timeline Split View */}
              <div className="flex-1 flex">
                <div className="flex-1">
                  <MapCanvas
                    alerts={alerts.filter(a => a.location).map(a => ({
                      id: a.id,
                      position: [a.location!.lat, a.location!.lng] as [number, number],
                      severity: a.severity,
                      title: a.title
                    }))}
                    selectedAlertId={selectedAlert.id}
                  />
                </div>
                
                {/* Timeline */}
                {selectedAlert.timeline && (
                  <div className="w-80 bg-white border-l p-4 overflow-y-auto">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Activity className="w-4 h-4" />
                      Event Timeline
                    </h3>
                    <div className="space-y-3">
                      {selectedAlert.timeline.map((event, idx) => (
                        <div key={idx} className="flex gap-3">
                          <div className="flex flex-col items-center">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            {idx < selectedAlert.timeline.length - 1 && (
                              <div className="w-0.5 h-12 bg-gray-200 mt-1"></div>
                            )}
                          </div>
                          <div className="flex-1 -mt-0.5">
                            <div className="text-xs text-gray-500 mb-1">
                              {format(new Date(event.time), 'HH:mm:ss')}
                            </div>
                            <div className="text-sm">{event.event}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Select an alert to view details</p>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - Correlation & Audit */}
        {selectedAlert && (
          <div className="w-80 bg-white border-l overflow-y-auto">
            {/* Correlation Section */}
            <div className="p-4 border-b">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Bell className="w-4 h-4" />
                Related Alerts
              </h3>
              {correlation?.relatedAlerts && correlation.relatedAlerts.length > 0 ? (
                <div className="space-y-2">
                  {correlation.relatedAlerts.map((alert) => (
                    <button
                      key={alert.id}
                      onClick={() => setSelectedAlert(alert as AlertDetail)}
                      className="w-full text-left p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`px-1.5 py-0.5 text-xs font-bold rounded ${getSeverityColor(alert.severity)}`}>
                          {alert.severity}
                        </span>
                        <span className="text-xs text-gray-500">
                          {format(new Date(alert.createdAt), 'MMM dd')}
                        </span>
                      </div>
                      <p className="text-sm line-clamp-2">{alert.title}</p>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No related alerts found</p>
              )}
            </div>

            {/* Entity Graph */}
            {correlation?.graph && correlation.graph.nodes.length > 0 && (
              <div className="p-4 border-b">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Linked Entities
                </h3>
                <div className="space-y-2">
                  {correlation.graph.nodes.map((node) => (
                    <Link
                      key={node.id}
                      href={`/${node.type === 'person' ? 'pi' : node.type === 'company' ? 'ci' : 'graph'}/${node.id}`}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        {node.type === 'person' ? <User className="w-4 h-4 text-gray-500" /> :
                         node.type === 'company' ? <Building2 className="w-4 h-4 text-gray-500" /> :
                         <MapPin className="w-4 h-4 text-gray-500" />}
                        <span className="text-sm">{node.label}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </Link>
                  ))}
                </div>
                <Link
                  href={`/graph?alert=${selectedAlert.id}`}
                  className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <Activity className="w-4 h-4" />
                  <span className="text-sm font-medium">View Full Graph</span>
                </Link>
              </div>
            )}

            {/* Audit Trail */}
            <div className="p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Audit Trail
              </h3>
              {auditTrail.length > 0 ? (
                <div className="space-y-2">
                  {auditTrail.map((entry, idx) => (
                    <div key={idx} className="p-2 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium capitalize">{entry.action}</span>
                        <span className="text-xs text-gray-500">
                          {format(new Date(entry.time), 'HH:mm:ss')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <UserCheck className="w-3 h-3" />
                        <span>{entry.user}</span>
                        {entry.role && (
                          <span className="px-1.5 py-0.5 bg-gray-200 rounded">
                            {entry.role}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No audit entries yet</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}