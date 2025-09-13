'use client'

import { Clock, AlertTriangle, Plane, CreditCard, MapPin, Smartphone, Globe, TrendingUp } from 'lucide-react'

interface Event {
  id: string
  date: string
  type: string
  event: string
  details: string
  severity: string
  anomaly: boolean
  location?: { lat: number; lng: number }
  amount?: number
  currency?: string
  flightNumber?: string
  device?: string
  ip?: string
  platform?: string
}

interface ActivityTimelineProps {
  events: Event[]
}

export default function ActivityTimeline({ events }: ActivityTimelineProps) {
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'telco': return <Smartphone className="w-4 h-4" />
      case 'financial': return <CreditCard className="w-4 h-4" />
      case 'travel': return <Plane className="w-4 h-4" />
      case 'location': return <MapPin className="w-4 h-4" />
      case 'digital': return <Globe className="w-4 h-4" />
      case 'social': return <TrendingUp className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }
  
  const getEventColor = (type: string, anomaly: boolean) => {
    if (anomaly) return 'border-red-400 bg-gradient-to-r from-red-50 to-red-100'
    
    switch (type) {
      case 'telco': return 'border-purple-300 bg-gradient-to-r from-purple-50 to-white'
      case 'financial': return 'border-green-300 bg-gradient-to-r from-green-50 to-white'
      case 'travel': return 'border-blue-300 bg-gradient-to-r from-blue-50 to-white'
      case 'location': return 'border-amber-300 bg-gradient-to-r from-amber-50 to-white'
      case 'digital': return 'border-cyan-300 bg-gradient-to-r from-cyan-50 to-white'
      case 'social': return 'border-pink-300 bg-gradient-to-r from-pink-50 to-white'
      default: return 'border-gray-300 bg-gradient-to-r from-gray-50 to-white'
    }
  }
  
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'high':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-red-100 text-red-700 ring-1 ring-red-200">HIGH</span>
      case 'medium':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-amber-100 text-amber-700 ring-1 ring-amber-200">MEDIUM</span>
      case 'low':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-green-100 text-green-700 ring-1 ring-green-200">LOW</span>
      default:
        return null
    }
  }
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    
    if (hours < 1) return 'Just now'
    if (hours < 24) return `${hours}h ago`
    if (hours < 48) return 'Yesterday'
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  
  const formatAmount = (amount: number, currency?: string) => {
    if (currency === 'USD') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(amount)
    }
    
    return `IDR ${new Intl.NumberFormat('id-ID').format(amount)}`
  }
  
  return (
    <div className="card h-full bg-gradient-to-br from-white to-gray-50">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Activity Timeline</h3>
          <p className="text-sm text-gray-500 mt-1">Recent events and anomalies</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 text-sm font-medium rounded-xl bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all">
            Last 24h
          </button>
          <button className="px-4 py-2 text-sm font-medium rounded-xl bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all">
            Filter
          </button>
        </div>
      </div>
      
      <div className="space-y-4 overflow-y-auto max-h-[600px]">
        {events.map((event) => (
          <div
            key={event.id}
            className={`relative border-l-2 pl-4 pb-4 ${getEventColor(event.type, event.anomaly)}`}
          >
            {/* Timeline dot */}
            <div className={`absolute -left-2 top-0 w-4 h-4 rounded-full border-2 border-white ${
              event.anomaly ? 'bg-red-500' : 'bg-gray-400'
            }`}>
              {event.anomaly && (
                <div className="absolute inset-0 rounded-full bg-red-500 animate-ping" />
              )}
            </div>
            
            {/* Event content */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${
                    event.anomaly ? 'bg-red-100 text-red-600 ring-2 ring-red-200' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {getEventIcon(event.type)}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-900">{event.event}</p>
                    <p className="text-xs text-gray-500 font-medium">{formatDate(event.date)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {event.anomaly && (
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                  )}
                  {getSeverityBadge(event.severity)}
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-3 leading-relaxed">{event.details}</p>
              
              {/* Additional metadata */}
              <div className="flex flex-wrap gap-2 text-xs">
                {event.amount && (
                  <span className="px-2 py-1 bg-green-50 text-green-700 rounded">
                    {formatAmount(event.amount, event.currency)}
                  </span>
                )}
                {event.flightNumber && (
                  <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded">
                    Flight: {event.flightNumber}
                  </span>
                )}
                {event.device && (
                  <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded">
                    Device: {event.device}
                  </span>
                )}
                {event.ip && (
                  <span className="px-2 py-1 bg-cyan-50 text-cyan-700 rounded">
                    IP: {event.ip}
                  </span>
                )}
                {event.platform && (
                  <span className="px-2 py-1 bg-pink-50 text-pink-700 rounded">
                    {event.platform}
                  </span>
                )}
                {event.location && (
                  <span className="px-2 py-1 bg-amber-50 text-amber-700 rounded">
                    📍 {event.location.lat.toFixed(4)}, {event.location.lng.toFixed(4)}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Load more */}
      <div className="mt-6 text-center">
        <button className="px-6 py-2.5 text-sm font-medium text-[var(--primary-600)] bg-[var(--primary-50)] rounded-xl hover:bg-[var(--primary-100)] transition-colors">
          Load more events
        </button>
      </div>
    </div>
  )
}