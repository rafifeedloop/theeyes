'use client'

import Link from 'next/link'
import { User, AlertTriangle, TrendingUp, ArrowRight } from 'lucide-react'

interface Person {
  id: string
  name: string
  occupation: string
  riskScore: number
  riskLevel: string
  status: string
  avatar?: string
}

interface PersonRiskCardProps {
  persons: Person[]
}

export default function PersonRiskCard({ persons }: PersonRiskCardProps) {
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'High': return 'text-red-600 bg-red-50'
      case 'Medium': return 'text-amber-600 bg-amber-50'
      case 'Low': return 'text-green-600 bg-green-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }
  
  const getStatusIcon = (status: string) => {
    if (status === 'Under Monitoring') return <AlertTriangle className="w-3 h-3 text-red-500" />
    if (status === 'VIP') return <TrendingUp className="w-3 h-3 text-purple-500" />
    return null
  }
  
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">High Risk Persons</h3>
        <Link href="/pi" className="text-sm text-[var(--primary-600)] hover:underline flex items-center gap-1">
          View all
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      
      <div className="space-y-3">
        {persons.slice(0, 3).map((person) => (
          <Link key={person.id} href={`/pi/${person.id}`}>
            <div className="p-3 border border-[var(--border)] rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--gradient-start)] to-[var(--gradient-end)] flex items-center justify-center">
                    {person.avatar ? (
                      <img src={person.avatar} alt={person.name} className="w-full h-full rounded-full" />
                    ) : (
                      <User className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">{person.name}</p>
                      {getStatusIcon(person.status)}
                    </div>
                    <p className="text-xs text-[var(--text-muted)]">{person.occupation}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(person.riskLevel)}`}>
                    {(person.riskScore * 100).toFixed(0)}%
                  </div>
                  <p className="text-xs text-[var(--text-muted)] mt-1">{person.riskLevel} Risk</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-[var(--border)]">
        <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
          <span>{persons.filter(p => p.riskLevel === 'High').length} high risk</span>
          <span>{persons.filter(p => p.status === 'Under Monitoring').length} under monitoring</span>
        </div>
      </div>
    </div>
  )
}