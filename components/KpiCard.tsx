'use client'

import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface KpiCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: number
  loading?: boolean
  onClick?: () => void
  color?: 'primary' | 'success' | 'warning' | 'danger'
}

export default function KpiCard({
  title,
  value,
  icon: Icon,
  trend,
  loading = false,
  onClick,
  color = 'primary'
}: KpiCardProps) {
  const colorClasses = {
    primary: 'from-[var(--gradient-start)] to-[var(--gradient-end)]',
    success: 'from-green-400 to-green-600',
    warning: 'from-amber-400 to-amber-600',
    danger: 'from-red-400 to-red-600'
  }

  if (loading) {
    return (
      <div className="card p-5 animate-pulse">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-200 rounded-xl" />
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-24 mb-2" />
            <div className="h-7 bg-gray-200 rounded w-16" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "card p-5 card-hover cursor-pointer",
        "hover:border-[var(--primary-300)] transition-all"
      )}
      onClick={onClick}
    >
      <div className="flex items-center gap-4">
        <div className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center",
          "bg-gradient-to-br text-white",
          colorClasses[color]
        )}>
          <Icon className="w-6 h-6" />
        </div>
        
        <div className="flex-1">
          <p className="text-sm text-[var(--text-muted)] mb-1">{title}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold tabular-nums">{value}</span>
            {trend !== undefined && (
              <span className={cn(
                "text-sm font-medium",
                trend > 0 ? "text-green-600" : "text-red-600"
              )}>
                {trend > 0 ? '+' : ''}{trend}%
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}