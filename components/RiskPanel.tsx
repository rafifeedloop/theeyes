'use client'

import { TrendingUp, Building2, Calendar, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getRiskColor, getRiskLabel } from '@/lib/utils'
import type { Person, Company } from '@/lib/types'

interface RiskPanelProps {
  people: Person[]
  companies: Company[]
  loading?: boolean
  onEntityClick?: (type: 'person' | 'company', id: string) => void
}

export default function RiskPanel({ people, companies, loading, onEntityClick }: RiskPanelProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4">Top People at Risk</h3>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="p-3 border border-[var(--border)] rounded-xl animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Top People at Risk */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Top People at Risk</h3>
          <TrendingUp className="w-5 h-5 text-[var(--text-muted)]" />
        </div>

        <div className="space-y-3">
          {people.map(person => (
            <div
              key={person.id}
              className="p-3 border border-[var(--border)] rounded-xl hover:border-[var(--primary-300)] hover:bg-[var(--primary-50)] hover:bg-opacity-30 cursor-pointer transition-all"
              onClick={() => onEntityClick?.('person', person.id)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  {person.avatar ? (
                    <img src={person.avatar} alt={person.display} className="w-10 h-10 rounded-full" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[var(--primary-100)] flex items-center justify-center">
                      <span className="text-sm font-semibold text-[var(--primary-600)]">
                        {person.display.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="font-medium">{person.display}</p>
                    <p className="text-xs text-[var(--text-muted)]">ID: {person.id}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold tabular-nums">
                    {(person.score * 100).toFixed(0)}%
                  </div>
                  <span className={cn('badge text-xs', `badge-${getRiskColor(person.score)}`)}>
                    {getRiskLabel(person.score)}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mt-2">
                {person.signals.slice(0, 3).map((signal, idx) => (
                  <span key={idx} className="text-xs px-2 py-0.5 bg-gray-100 rounded-full">
                    {signal}
                  </span>
                ))}
              </div>

              {person.lastSeen && (
                <p className="text-xs text-[var(--text-muted)] mt-2 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Last seen: {new Date(person.lastSeen).toLocaleString()}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Top Companies at Risk */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Top Companies at Risk</h3>
          <Building2 className="w-5 h-5 text-[var(--text-muted)]" />
        </div>

        <div className="space-y-3">
          {companies.map(company => (
            <div
              key={company.id}
              className="p-3 border border-[var(--border)] rounded-xl hover:border-[var(--primary-300)] hover:bg-[var(--primary-50)] hover:bg-opacity-30 cursor-pointer transition-all"
              onClick={() => onEntityClick?.('company', company.id)}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-medium">{company.display}</p>
                  <p className="text-xs text-[var(--text-muted)]">
                    {company.sector} • {company.employees} employees
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold tabular-nums">
                    {(company.score * 100).toFixed(0)}%
                  </div>
                  <span className={cn('badge text-xs', `badge-${getRiskColor(company.score)}`)}>
                    {getRiskLabel(company.score)}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mt-2">
                {company.signals.map((signal, idx) => (
                  <span key={idx} className="text-xs px-2 py-0.5 bg-gray-100 rounded-full">
                    {signal}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Events Panel */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Recent Events</h3>
          <AlertCircle className="w-5 h-5 text-[var(--text-muted)]" />
        </div>

        <div className="space-y-2">
          <div className="p-2 border-l-2 border-[var(--warning)] pl-3">
            <p className="text-sm font-medium">Traffic congestion detected</p>
            <p className="text-xs text-[var(--text-muted)]">Sudirman area • 2 hours ago</p>
          </div>
          <div className="p-2 border-l-2 border-[var(--danger)] pl-3">
            <p className="text-sm font-medium">Power outage reported</p>
            <p className="text-xs text-[var(--text-muted)]">BSD City • 3 hours ago</p>
          </div>
          <div className="p-2 border-l-2 border-[var(--info)] pl-3">
            <p className="text-sm font-medium">New tender announcement</p>
            <p className="text-xs text-[var(--text-muted)]">Infrastructure sector • 5 hours ago</p>
          </div>
        </div>
      </div>
    </div>
  )
}