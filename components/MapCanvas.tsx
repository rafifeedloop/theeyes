'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Layers, ZoomIn, ZoomOut, Maximize } from 'lucide-react'
import useDashboardStore from '@/lib/store'

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/leaflet/marker-icon-2x.png',
  iconUrl: '/leaflet/marker-icon.png',
  shadowUrl: '/leaflet/marker-shadow.png',
})

interface MapCanvasProps {
  onLassoSelect?: (polygon: [number, number][]) => void
  center?: [number, number]
  zoom?: number
  locations?: Array<{
    id: string
    position: [number, number]
    name: string
    type?: string
    risk?: number
    alerts?: number
  }>
  selectedLocationId?: string
  onLocationClick?: (id: string) => void
  zones?: Array<{
    id: string
    name: string
    type: string
    polygon: [number, number][]
    color: string
  }>
  alerts?: Array<{
    id: string
    position: [number, number]
    severity: string
    title: string
  }>
  selectedAlertId?: string
}

export default function MapCanvas({ 
  onLassoSelect, 
  center,
  zoom,
  locations = [],
  selectedLocationId,
  onLocationClick,
  zones = [],
  alerts = [],
  selectedAlertId
}: MapCanvasProps) {
  const mapRef = useRef<L.Map | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const markersRef = useRef<Map<string, L.Marker>>(new Map())
  const zonesRef = useRef<Map<string, L.Polygon>>(new Map())
  const { mapCenter, mapZoom, setMapView } = useDashboardStore()
  
  const mapCenterToUse = center || mapCenter
  const mapZoomToUse = zoom || mapZoom

  // Initialize map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const map = L.map(containerRef.current, {
      center: mapCenterToUse as L.LatLngExpression,
      zoom: mapZoomToUse,
      zoomControl: false,
    })

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map)
    
    mapRef.current = map
    
    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])
  
  // Update center and zoom when props change
  useEffect(() => {
    if (!mapRef.current) return
    if (center) {
      mapRef.current.setView(center, zoom || mapRef.current.getZoom())
    }
  }, [center, zoom])
  
  // Handle locations
  useEffect(() => {
    if (!mapRef.current) return
    
    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove())
    markersRef.current.clear()
    
    // Add location markers if we have locations prop
    if (locations.length > 0) {
      locations.forEach(location => {
        const isSelected = location.id === selectedLocationId
        const riskColor = location.risk 
          ? location.risk > 0.6 ? '#ef4444' 
          : location.risk > 0.3 ? '#f59e0b' 
          : '#10b981'
          : '#6b7280'
        
        const icon = L.divIcon({
          className: 'custom-marker',
          html: `
            <div style="
              width: ${isSelected ? '40px' : '30px'};
              height: ${isSelected ? '40px' : '30px'};
              background: ${riskColor};
              border: 3px solid ${isSelected ? '#fff' : riskColor};
              border-radius: 50%;
              box-shadow: 0 2px 6px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
              transition: all 0.2s;
              position: relative;
            ">
              ${location.alerts ? `<span style="
                position: absolute;
                top: -5px;
                right: -5px;
                background: #ef4444;
                color: white;
                border-radius: 50%;
                width: 18px;
                height: 18px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 10px;
                font-weight: bold;
                border: 2px solid white;
              ">${location.alerts}</span>` : ''}
              <div style="
                width: 10px;
                height: 10px;
                background: white;
                border-radius: 50%;
              "></div>
            </div>
          `,
          iconSize: isSelected ? [40, 40] : [30, 30],
          iconAnchor: isSelected ? [20, 20] : [15, 15],
        })

        const marker = L.marker(location.position, { icon })
          .bindPopup(`
            <div style="min-width: 150px;">
              <strong>${location.name}</strong><br/>
              ${location.type ? `Type: ${location.type}<br/>` : ''}
              ${location.risk !== undefined ? `Risk: <span style="color: ${riskColor};">${(location.risk * 100).toFixed(0)}%</span><br/>` : ''}
              ${location.alerts ? `Alerts: ${location.alerts}` : ''}
            </div>
          `)
          .addTo(mapRef.current)
        
        if (onLocationClick) {
          marker.on('click', () => onLocationClick(location.id))
        }
        
        markersRef.current.set(location.id, marker)
      })
    } else {
      // Default demo markers if no locations provided
      const demoMarkers = [
        { lat: -6.1754, lng: 106.8272, title: 'Monas Area', risk: 'high' },
        { lat: -6.2088, lng: 106.8456, title: 'Sudirman CBD', risk: 'medium' },
        { lat: -6.3037, lng: 106.6523, title: 'BSD City', risk: 'low' },
        { lat: -6.2607, lng: 106.8134, title: 'Kemang', risk: 'medium' },
      ]

      demoMarkers.forEach(marker => {
        const icon = L.divIcon({
          className: 'custom-marker',
          html: `
            <div class="marker-${marker.risk}">
              <div class="marker-pulse"></div>
            </div>
          `,
          iconSize: [30, 30],
          iconAnchor: [15, 15],
        })

        L.marker([marker.lat, marker.lng], { icon })
          .bindPopup(`
            <div style="min-width: 150px;">
              <strong>${marker.title}</strong><br/>
              Risk: <span style="color: ${
                marker.risk === 'high' ? '#EF4444' : 
                marker.risk === 'medium' ? '#F59E0B' : '#22C55E'
              };">${marker.risk.toUpperCase()}</span>
            </div>
          `)
          .addTo(mapRef.current)
      })
    }
  }, [locations, selectedLocationId, onLocationClick])
  
  // Handle zones
  useEffect(() => {
    if (!mapRef.current) return
    
    // Clear existing zones
    zonesRef.current.forEach(zone => zone.remove())
    zonesRef.current.clear()
    
    // Add zones
    zones.forEach(zone => {
      const polygon = L.polygon(zone.polygon, {
        color: zone.color,
        weight: 2,
        opacity: 0.8,
        fillColor: zone.color,
        fillOpacity: 0.2
      })
        .bindPopup(`<strong>${zone.name}</strong><br/>Type: ${zone.type}`)
        .addTo(mapRef.current!)
      
      zonesRef.current.set(zone.id, polygon)
    })
  }, [zones])
  
  // Handle alerts
  useEffect(() => {
    if (!mapRef.current || alerts.length === 0) return
    
    alerts.forEach(alert => {
      const isSelected = alert.id === selectedAlertId
      const color = alert.severity === 'HIGH' ? '#ef4444' : 
                   alert.severity === 'MEDIUM' ? '#f59e0b' : '#3b82f6'
      
      const icon = L.divIcon({
        className: 'alert-marker',
        html: `
          <div style="
            width: ${isSelected ? '40px' : '30px'};
            height: ${isSelected ? '40px' : '30px'};
            background: ${color};
            border: 3px solid white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: ${alert.severity === 'HIGH' ? 'pulse 2s infinite' : 'none'};
          ">
            <span style="color: white; font-weight: bold;">!</span>
          </div>
        `,
        iconSize: isSelected ? [40, 40] : [30, 30],
        iconAnchor: isSelected ? [20, 20] : [15, 15],
      })
      
      L.marker(alert.position, { icon })
        .bindPopup(`
          <div style="min-width: 150px;">
            <strong>${alert.title}</strong><br/>
            Severity: <span style="color: ${color};">${alert.severity}</span>
          </div>
        `)
        .addTo(mapRef.current)
    })
  }, [alerts, selectedAlertId])

  // Save map state on move/zoom
  useEffect(() => {
    if (!mapRef.current) return

    const handleMoveEnd = () => {
      const center = mapRef.current!.getCenter()
      const zoom = mapRef.current!.getZoom()
      setMapView([center.lat, center.lng], zoom)
    }

    mapRef.current.on('moveend', handleMoveEnd)
    
    return () => {
      mapRef.current?.off('moveend', handleMoveEnd)
    }
  }, [setMapView])

  const handleZoomIn = () => {
    mapRef.current?.zoomIn()
  }

  const handleZoomOut = () => {
    mapRef.current?.zoomOut()
  }

  const handleFullscreen = () => {
    if (containerRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen()
      } else {
        containerRef.current.requestFullscreen()
      }
    }
  }

  return (
    <div className="card p-0 h-full relative">
      <div ref={containerRef} className="w-full h-full rounded-xl overflow-hidden" />
      
      {/* Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-[1000]">
        <button 
          onClick={handleZoomIn}
          className="p-2 bg-white rounded-lg shadow-lg hover:bg-gray-50 transition-colors"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button 
          onClick={handleZoomOut}
          className="p-2 bg-white rounded-lg shadow-lg hover:bg-gray-50 transition-colors"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button 
          onClick={handleFullscreen}
          className="p-2 bg-white rounded-lg shadow-lg hover:bg-gray-50 transition-colors"
        >
          <Maximize className="w-4 h-4" />
        </button>
      </div>

      {/* Layer Toggle */}
      <div className="absolute bottom-4 left-4 z-[1000]">
        <button className="p-2 bg-white rounded-lg shadow-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
          <Layers className="w-4 h-4" />
          <span className="text-sm">Layers</span>
        </button>
      </div>

      <style jsx global>{`
        .custom-marker {
          background: transparent;
          border: none;
        }
        
        .marker-high {
          width: 30px;
          height: 30px;
          background: linear-gradient(45deg, #EF4444, #DC2626);
          border: 3px solid #FFFFFF;
          border-radius: 50%;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          position: relative;
        }
        
        .marker-medium {
          width: 30px;
          height: 30px;
          background: linear-gradient(45deg, #F59E0B, #D97706);
          border: 3px solid #FFFFFF;
          border-radius: 50%;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          position: relative;
        }
        
        .marker-low {
          width: 30px;
          height: 30px;
          background: linear-gradient(45deg, #22C55E, #16A34A);
          border: 3px solid #FFFFFF;
          border-radius: 50%;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          position: relative;
        }
        
        .marker-pulse {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: inherit;
          opacity: 0.8;
          animation: pulse 2s ease-out infinite;
        }
        
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 0.8;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}