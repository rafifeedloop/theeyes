'use client'

import { AlertTriangle, Clock, MapPin, CheckCircle, UserPlus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatDate } from '@/lib/utils'
import type { Alert } from '@/lib/types'
import useDashboardStore from '@/lib/store'

interface AlertListProps {
  alerts: Alert[]
  loading?: boolean
}

export default function AlertList({ alerts, loading }: AlertListProps) {
  const { acknowledgeAlert, assignAlert, edition } = useDashboardStore()

  const getSeverityColor = (severity: Alert['severity']) => {
    switch (severity) {
      case 'CRITICAL': return 'badge-danger'
      case 'HIGH': return 'badge-warning'
      case 'MEDIUM': return 'badge-info'
      case 'LOW': return 'badge-success'
      default: return 'badge'
    }
  }

  if (loading) {
    return (
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4">Live Alerts</h3>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="p-4 border border-[var(--border)] rounded-xl animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (alerts.length === 0) {
    return (
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4">Live Alerts</h3>
        <div className="text-center py-12 text-[var(--text-muted)]">
          <AlertTriangle className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No active alerts</p>
          <p className="text-sm mt-1">You're all clear</p>
        </div>
      </div>
    )
  }

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Live Alerts</h3>
        {edition === 'gov' && (
          <span className="text-sm text-[var(--text-muted)]">
            {alerts.filter(a => a.status === 'OPEN').length} active
          </span>
        )}
      </div>

      <div className="space-y-3 max-h-[600px] overflow-y-auto">
        {alerts.map(alert => (
          <div
            key={alert.id}
            className={cn(
              "p-4 border rounded-xl transition-all",
              "hover:border-[var(--primary-300)] hover:bg-[var(--primary-50)] hover:bg-opacity-30",
              alert.status === 'ACKNOWLEDGED' && "opacity-70"
            )}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className={cn('badge', getSeverityColor(alert.severity))}>
                  {alert.severity}
                </span>
                {alert.status === 'ACKNOWLEDGED' && (
                  <span className="badge badge-info">ACK</span>
                )}
                {alert.status === 'ASSIGNED' && (
                  <span className="badge badge-primary">ASSIGNED</span>
                )}
              </div>
              <span className="text-xs text-[var(--text-muted)]">
                {formatDate(alert.createdAt)}
              </span>
            </div>

            <h4 className="font-medium mb-2">{alert.title}</h4>

            <div className="flex items-center gap-4 text-sm text-[var(--text-muted)] mb-3">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {alert.source}
              </span>
              {alert.geo && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {alert.geo.lat.toFixed(4)}, {alert.geo.lng.toFixed(4)}
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
              {alert.entities.map((entity, idx) => (
                <span
                  key={idx}
                  className={cn(
                    "badge",
                    entity.type === 'person' && "badge-primary",
                    entity.type === 'company' && "badge-info",
                    entity.type === 'location' && "badge-warning"
                  )}
                >
                  {entity.name || entity.id}
                </span>
              ))}
            </div>

            {edition === 'gov' && alert.status === 'OPEN' && (
              <div className="flex gap-2">
                <button
                  onClick={() => acknowledgeAlert(alert.id)}
                  className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1"
                >
                  <CheckCircle className="w-3 h-3" />
                  Acknowledge
                </button>
                <button
                  onClick={() => assignAlert(alert.id, 'current-user')}
                  className="btn-ghost text-xs py-1.5 px-3 flex items-center gap-1"
                >
                  <UserPlus className="w-3 h-3" />
                  Assign
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}