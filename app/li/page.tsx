'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { MapPin, AlertTriangle, Users, Activity, TrendingUp, Shield, Clock, Zap, Building, Wifi, Phone, Eye } from 'lucide-react'
import Header from '@/components/Header'
import { cn } from '@/lib/utils'
import { formatDate } from '@/lib/utils'

// Dynamic import for MapCanvas to avoid SSR issues
const MapCanvas = dynamic(() => import('@/components/MapCanvas'), {
  ssr: false,
  loading: () => (
    <div className="card p-0 h-full min-h-[600px] flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-[var(--primary-300)] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-sm text-[var(--text-muted)]">Loading map...</p>
      </div>
    </div>
  )
})

interface LocationData {
  id: string
  name: string
  type: 'business_district' | 'residential' | 'industrial' | 'entertainment' | 'government' | 'transportation'
  coordinates: { lat: number; lng: number }
  risk: {
    overall: number
    crime: number
    traffic: number
    environmental: number
    infrastructure: number
  }
  metrics: {
    population: number
    populationDensity: number
    avgMovementSpeed: number
    deviceCount: number
    powerUsage: number
    waterUsage: number
  }
  alerts: number
  lastUpdate: string
}

interface Zone {
  id: string
  name: string
  type: 'restricted' | 'monitored' | 'public'
  polygon: [number, number][]
  activeDevices: number
  status: 'normal' | 'warning' | 'critical'
}

export default function LocationIntelligence() {
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null)
  const [locations, setLocations] = useState<LocationData[]>([])
  const [zones, setZones] = useState<Zone[]>([])
  const [timeRange, setTimeRange] = useState('24h')
  const [viewMode, setViewMode] = useState<'overview' | 'risk' | 'infrastructure' | 'population'>('overview')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch location data
    fetchLocationData()
    fetchZones()
    
    // Set up refresh interval
    const interval = setInterval(() => {
      fetchLocationData()
    }, 30000) // Refresh every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const fetchLocationData = async () => {
    try {
      const response = await fetch('/api/locations')
      const data = await response.json()
      setLocations(data)
      if (!selectedLocation && data.length > 0) {
        setSelectedLocation(data[0])
      }
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch location data:', error)
      setLoading(false)
    }
  }

  const fetchZones = async () => {
    try {
      const response = await fetch('/api/locations/zones')
      const data = await response.json()
      setZones(data)
    } catch (error) {
      console.error('Failed to fetch zones:', error)
    }
  }

  const getRiskColor = (score: number) => {
    if (score < 0.3) return 'text-green-600'
    if (score < 0.6) return 'text-amber-600'
    return 'text-red-600'
  }

  const getRiskBadgeColor = (score: number) => {
    if (score < 0.3) return 'badge-success'
    if (score < 0.6) return 'badge-warning'
    return 'badge-danger'
  }

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <Header />
      
      <main className="p-6">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold flex items-center gap-2">
              <MapPin className="w-6 h-6 text-[var(--primary-600)]" />
              Location Intelligence
            </h1>
            <p className="text-sm text-[var(--text-muted)] mt-1">
              Real-time monitoring and analysis of {locations.length} locations
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-white rounded-lg p-1 border border-[var(--border)]">
              {(['overview', 'risk', 'infrastructure', 'population'] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={cn(
                    'px-3 py-1.5 rounded-md text-sm font-medium capitalize transition-all',
                    viewMode === mode 
                      ? 'bg-[var(--primary-100)] text-[var(--primary-600)]'
                      : 'text-[var(--text-muted)] hover:bg-gray-50'
                  )}
                >
                  {mode}
                </button>
              ))}
            </div>

            {/* Time Range */}
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="input-field w-32"
            >
              <option value="1h">Last Hour</option>
              <option value="24h">Last 24h</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="card p-5">
            <div className="flex items-center justify-between mb-2">
              <Shield className="w-5 h-5 text-[var(--primary-600)]" />
              <span className="text-xs text-green-600 font-medium">-12%</span>
            </div>
            <div className="text-2xl font-bold">87%</div>
            <div className="text-sm text-[var(--text-muted)]">Security Score</div>
          </div>

          <div className="card p-5">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-5 h-5 text-blue-600" />
              <span className="text-xs text-amber-600 font-medium">+5.2k</span>
            </div>
            <div className="text-2xl font-bold">42.3k</div>
            <div className="text-sm text-[var(--text-muted)]">Active Population</div>
          </div>

          <div className="card p-5">
            <div className="flex items-center justify-between mb-2">
              <Activity className="w-5 h-5 text-amber-600" />
              <span className="text-xs text-red-600 font-medium">High</span>
            </div>
            <div className="text-2xl font-bold">18</div>
            <div className="text-sm text-[var(--text-muted)]">Active Alerts</div>
          </div>

          <div className="card p-5">
            <div className="flex items-center justify-between mb-2">
              <Zap className="w-5 h-5 text-yellow-600" />
              <span className="text-xs text-green-600 font-medium">Normal</span>
            </div>
            <div className="text-2xl font-bold">98.2%</div>
            <div className="text-sm text-[var(--text-muted)]">Infrastructure</div>
          </div>

          <div className="card p-5">
            <div className="flex items-center justify-between mb-2">
              <Eye className="w-5 h-5 text-purple-600" />
              <span className="text-xs font-medium">Live</span>
            </div>
            <div className="text-2xl font-bold">24/7</div>
            <div className="text-sm text-[var(--text-muted)]">Monitoring</div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Location List */}
          <div className="lg:col-span-3">
            <div className="card p-6">
              <h3 className="text-lg font-semibold mb-4">Monitored Locations</h3>
              
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {locations.map(location => (
                  <div
                    key={location.id}
                    onClick={() => setSelectedLocation(location)}
                    className={cn(
                      "p-3 border rounded-xl cursor-pointer transition-all",
                      selectedLocation?.id === location.id 
                        ? "border-[var(--primary-500)] bg-[var(--primary-50)]"
                        : "border-[var(--border)] hover:border-[var(--primary-300)]"
                    )}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium">{location.name}</h4>
                        <p className="text-xs text-[var(--text-muted)] capitalize">
                          {location.type.replace('_', ' ')}
                        </p>
                      </div>
                      <span className={cn('badge text-xs', getRiskBadgeColor(location.risk.overall))}>
                        {(location.risk.overall * 100).toFixed(0)}%
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3 text-[var(--text-muted)]" />
                        <span>{(location.metrics.population / 1000).toFixed(1)}k</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-[var(--text-muted)]" />
                        <span>{location.alerts} alerts</span>
                      </div>
                    </div>

                    {location.alerts > 0 && (
                      <div className="mt-2 p-2 bg-red-50 rounded-lg">
                        <p className="text-xs text-red-700">⚠️ Active incidents</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Center: Map */}
          <div className="lg:col-span-6">
            <div className="card p-0 h-[600px]">
              <MapCanvas 
                center={selectedLocation ? [selectedLocation.coordinates.lat, selectedLocation.coordinates.lng] : [-6.2088, 106.8456]}
                zoom={selectedLocation ? 14 : 12}
                locations={locations.map(loc => ({
                  id: loc.id,
                  position: [loc.coordinates.lat, loc.coordinates.lng] as [number, number],
                  name: loc.name,
                  type: loc.type,
                  risk: loc.risk.overall,
                  alerts: loc.alerts
                }))}
                selectedLocationId={selectedLocation?.id}
                onLocationClick={(id: string) => {
                  const location = locations.find(l => l.id === id)
                  if (location) setSelectedLocation(location)
                }}
                zones={zones.map(zone => ({
                  id: zone.id,
                  name: zone.name,
                  type: zone.type,
                  polygon: zone.polygon,
                  color: zone.status === 'critical' ? '#ef4444' : zone.status === 'warning' ? '#f59e0b' : '#10b981'
                }))}
              />
            </div>
          </div>

          {/* Right: Location Details */}
          <div className="lg:col-span-3">
            {selectedLocation ? (
              <div className="space-y-4">
                {/* Location Overview */}
                <div className="card p-6">
                  <h3 className="text-lg font-semibold mb-4">{selectedLocation.name}</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[var(--text-muted)]">Overall Risk</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={cn(
                              "h-full transition-all",
                              selectedLocation.risk.overall < 0.3 ? "bg-green-500" :
                              selectedLocation.risk.overall < 0.6 ? "bg-amber-500" : "bg-red-500"
                            )}
                            style={{ width: `${selectedLocation.risk.overall * 100}%` }}
                          />
                        </div>
                        <span className={cn('font-semibold', getRiskColor(selectedLocation.risk.overall))}>
                          {(selectedLocation.risk.overall * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>

                    {/* Risk Breakdown */}
                    <div className="pt-3 border-t border-[var(--border)]">
                      <p className="text-sm font-medium mb-2">Risk Factors</p>
                      <div className="space-y-2">
                        {Object.entries(selectedLocation.risk)
                          .filter(([key]) => key !== 'overall')
                          .map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between text-sm">
                              <span className="text-[var(--text-muted)] capitalize">
                                {key}
                              </span>
                              <span className={getRiskColor(value as number)}>
                                {((value as number) * 100).toFixed(0)}%
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Real-time Metrics */}
                <div className="card p-6">
                  <h3 className="text-lg font-semibold mb-4">Live Metrics</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-[var(--text-muted)]" />
                        <span className="text-sm">Population</span>
                      </div>
                      <span className="font-medium">
                        {selectedLocation.metrics.population.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-[var(--text-muted)]" />
                        <span className="text-sm">Density</span>
                      </div>
                      <span className="font-medium">
                        {selectedLocation.metrics.populationDensity}/km²
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-[var(--text-muted)]" />
                        <span className="text-sm">Movement</span>
                      </div>
                      <span className="font-medium">
                        {selectedLocation.metrics.avgMovementSpeed} km/h
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Wifi className="w-4 h-4 text-[var(--text-muted)]" />
                        <span className="text-sm">Devices</span>
                      </div>
                      <span className="font-medium">
                        {selectedLocation.metrics.deviceCount.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-[var(--text-muted)]" />
                        <span className="text-sm">Power</span>
                      </div>
                      <span className="font-medium">
                        {selectedLocation.metrics.powerUsage} MW
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[var(--border)]">
                    <p className="text-xs text-[var(--text-muted)]">
                      Last updated: {formatDate(selectedLocation.lastUpdate)}
                    </p>
                  </div>
                </div>

                {/* Recent Events */}
                <div className="card p-6">
                  <h3 className="text-lg font-semibold mb-4">Recent Events</h3>
                  
                  <div className="space-y-2">
                    <div className="p-2 border-l-2 border-red-500 pl-3">
                      <p className="text-sm font-medium">Traffic congestion detected</p>
                      <p className="text-xs text-[var(--text-muted)]">2 minutes ago</p>
                    </div>
                    <div className="p-2 border-l-2 border-amber-500 pl-3">
                      <p className="text-sm font-medium">Unusual crowd gathering</p>
                      <p className="text-xs text-[var(--text-muted)]">15 minutes ago</p>
                    </div>
                    <div className="p-2 border-l-2 border-blue-500 pl-3">
                      <p className="text-sm font-medium">Infrastructure maintenance</p>
                      <p className="text-xs text-[var(--text-muted)]">1 hour ago</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="card p-6">
                <div className="text-center py-12 text-[var(--text-muted)]">
                  <MapPin className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>Select a location to view details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}