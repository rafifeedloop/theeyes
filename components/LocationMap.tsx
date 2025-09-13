'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Layers, ZoomIn, ZoomOut, Maximize, Navigation, Shield, Activity } from 'lucide-react'

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/leaflet/marker-icon-2x.png',
  iconUrl: '/leaflet/marker-icon.png',
  shadowUrl: '/leaflet/marker-shadow.png',
})

interface Location {
  id: string
  name: string
  type: string
  coordinates: { lat: number; lng: number }
  risk: {
    overall: number
    [key: string]: number
  }
  metrics: {
    population: number
    [key: string]: number
  }
  alerts: number
}

interface Zone {
  id: string
  name: string
  type: 'restricted' | 'monitored' | 'public'
  polygon: [number, number][]
  activeDevices: number
  status: 'normal' | 'warning' | 'critical'
}

interface LocationMapProps {
  locations: Location[]
  zones: Zone[]
  selectedLocation: Location | null
  viewMode: 'overview' | 'risk' | 'infrastructure' | 'population'
  onLocationSelect?: (location: Location) => void
}

export default function LocationMap({
  locations,
  zones,
  selectedLocation,
  viewMode,
  onLocationSelect
}: LocationMapProps) {
  const mapRef = useRef<L.Map | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const markersRef = useRef<L.Marker[]>([])
  const zonesRef = useRef<L.Polygon[]>([])

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    // Initialize map centered on Jakarta
    const map = L.map(containerRef.current, {
      center: [-6.2088, 106.8456],
      zoom: 11,
      zoomControl: false,
    })

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      opacity: 0.9
    }).addTo(map)

    mapRef.current = map

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [])

  // Update markers when locations change
  useEffect(() => {
    if (!mapRef.current) return

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove())
    markersRef.current = []

    // Add location markers
    locations.forEach(location => {
      const riskLevel = location.risk.overall
      const color = riskLevel < 0.3 ? '#22C55E' : 
                   riskLevel < 0.6 ? '#F59E0B' : '#EF4444'

      const icon = L.divIcon({
        className: 'custom-location-marker',
        html: `
          <div style="position: relative;">
            <div style="
              width: 24px;
              height: 24px;
              background: ${color};
              border: 3px solid white;
              border-radius: 50%;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: bold;
              color: white;
              font-size: 10px;
            ">
              ${location.alerts > 0 ? location.alerts : ''}
            </div>
            ${location.alerts > 0 ? `
              <div style="
                position: absolute;
                top: -4px;
                right: -4px;
                width: 12px;
                height: 12px;
                background: #EF4444;
                border: 2px solid white;
                border-radius: 50%;
                animation: pulse 2s infinite;
              "></div>
            ` : ''}
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      })

      const marker = L.marker([location.coordinates.lat, location.coordinates.lng], { icon })
        .bindPopup(`
          <div style="min-width: 200px;">
            <h4 style="margin: 0 0 8px 0; font-weight: 600;">${location.name}</h4>
            <div style="font-size: 12px; color: #666;">
              <div style="margin-bottom: 4px;">Type: ${location.type.replace('_', ' ')}</div>
              <div style="margin-bottom: 4px;">Risk: <span style="color: ${color}; font-weight: 600;">${(riskLevel * 100).toFixed(0)}%</span></div>
              <div style="margin-bottom: 4px;">Population: ${location.metrics.population.toLocaleString()}</div>
              <div>Alerts: ${location.alerts}</div>
            </div>
          </div>
        `)
        .on('click', () => {
          if (onLocationSelect) {
            onLocationSelect(location)
          }
        })
        .addTo(mapRef.current!)

      markersRef.current.push(marker)
    })
  }, [locations, onLocationSelect])

  // Update zones
  useEffect(() => {
    if (!mapRef.current) return

    // Clear existing zones
    zonesRef.current.forEach(zone => zone.remove())
    zonesRef.current = []

    // Add zone polygons
    zones.forEach(zone => {
      const color = zone.type === 'restricted' ? '#EF4444' :
                   zone.type === 'monitored' ? '#F59E0B' : '#38BDF8'
      
      const opacity = zone.status === 'critical' ? 0.4 :
                      zone.status === 'warning' ? 0.3 : 0.2

      const polygon = L.polygon(zone.polygon as L.LatLngExpression[], {
        color: color,
        weight: 2,
        opacity: 0.8,
        fillColor: color,
        fillOpacity: opacity,
        dashArray: zone.type === 'restricted' ? '5, 5' : undefined
      })
        .bindPopup(`
          <div style="min-width: 180px;">
            <h4 style="margin: 0 0 8px 0; font-weight: 600;">${zone.name}</h4>
            <div style="font-size: 12px; color: #666;">
              <div style="margin-bottom: 4px;">Type: ${zone.type}</div>
              <div style="margin-bottom: 4px;">Status: <span style="color: ${
                zone.status === 'critical' ? '#EF4444' :
                zone.status === 'warning' ? '#F59E0B' : '#22C55E'
              }; font-weight: 600;">${zone.status.toUpperCase()}</span></div>
              <div>Devices: ${zone.activeDevices.toLocaleString()}</div>
            </div>
          </div>
        `)
        .addTo(mapRef.current!)

      zonesRef.current.push(polygon)
    })
  }, [zones])

  // Center on selected location
  useEffect(() => {
    if (!mapRef.current || !selectedLocation) return

    mapRef.current.setView(
      [selectedLocation.coordinates.lat, selectedLocation.coordinates.lng],
      14,
      { animate: true }
    )
  }, [selectedLocation])

  // Add view mode overlays
  useEffect(() => {
    if (!mapRef.current) return

    // Apply different visual overlays based on view mode
    const container = containerRef.current
    if (!container) return

    container.className = ''
    
    switch (viewMode) {
      case 'risk':
        container.classList.add('risk-overlay')
        break
      case 'infrastructure':
        container.classList.add('infra-overlay')
        break
      case 'population':
        container.classList.add('population-overlay')
        break
      default:
        break
    }
  }, [viewMode])

  const handleZoomIn = () => {
    if (mapRef.current) {
      mapRef.current.zoomIn()
    }
  }

  const handleZoomOut = () => {
    if (mapRef.current) {
      mapRef.current.zoomOut()
    }
  }

  const handleRecenter = () => {
    if (mapRef.current) {
      mapRef.current.setView([-6.2088, 106.8456], 11, { animate: true })
    }
  }

  return (
    <div className="card p-0 relative h-[600px] overflow-hidden">
      <style jsx global>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.5);
            opacity: 0.5;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        .risk-overlay {
          filter: contrast(1.1) saturate(1.2);
        }
        
        .infra-overlay {
          filter: hue-rotate(180deg) invert(1) contrast(0.9);
        }
        
        .population-overlay {
          filter: sepia(0.3) contrast(1.1);
        }
        
        .leaflet-popup-content-wrapper {
          border-radius: 12px;
          box-shadow: 0 6px 20px rgba(15, 23, 42, 0.15);
        }
        
        .leaflet-popup-content {
          margin: 12px;
        }
      `}</style>

      <div ref={containerRef} className="w-full h-full" />

      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
        <button 
          onClick={handleRecenter}
          className="bg-white p-2 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          title="Recenter map"
        >
          <Navigation className="w-5 h-5 text-[var(--text-muted)]" />
        </button>
        <button 
          onClick={handleZoomIn}
          className="bg-white p-2 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <ZoomIn className="w-5 h-5 text-[var(--text-muted)]" />
        </button>
        <button 
          onClick={handleZoomOut}
          className="bg-white p-2 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <ZoomOut className="w-5 h-5 text-[var(--text-muted)]" />
        </button>
        <button className="bg-white p-2 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <Layers className="w-5 h-5 text-[var(--text-muted)]" />
        </button>
        <button className="bg-white p-2 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <Maximize className="w-5 h-5 text-[var(--text-muted)]" />
        </button>
      </div>

      {/* View Mode Indicator */}
      <div className="absolute top-4 left-4 z-[1000] bg-white rounded-lg shadow-md px-3 py-2">
        <div className="flex items-center gap-2">
          {viewMode === 'risk' && <Shield className="w-4 h-4 text-red-600" />}
          {viewMode === 'infrastructure' && <Activity className="w-4 h-4 text-blue-600" />}
          <span className="text-sm font-medium capitalize">{viewMode} View</span>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-white rounded-lg shadow-md p-3">
        <p className="text-xs font-semibold text-[var(--text-muted)] mb-2">Risk Levels</p>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-xs">High Risk (60%+)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="text-xs">Medium Risk (30-60%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-xs">Low Risk (&lt;30%)</span>
          </div>
        </div>
        
        <p className="text-xs font-semibold text-[var(--text-muted)] mt-3 mb-2">Zone Types</p>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-400 opacity-40 border border-red-500 border-dashed" />
            <span className="text-xs">Restricted</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-amber-400 opacity-40 border border-amber-500" />
            <span className="text-xs">Monitored</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-400 opacity-40 border border-blue-500" />
            <span className="text-xs">Public</span>
          </div>
        </div>
      </div>
    </div>
  )
}