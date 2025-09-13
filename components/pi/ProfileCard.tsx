'use client'

import { User, Phone, Mail, MapPin, CreditCard, Calendar, Shield, AlertTriangle } from 'lucide-react'
import useDashboardStore from '@/lib/store'

interface ProfileCardProps {
  person: any
}

export default function ProfileCard({ person }: ProfileCardProps) {
  const { edition } = useDashboardStore()
  
  const maskSensitiveData = (data: string, type: 'nik' | 'phone' | 'email' = 'nik') => {
    if (edition === 'gov') return data
    
    switch (type) {
      case 'nik':
        return data.substring(0, 6) + '********'
      case 'phone':
        return data.substring(0, 4) + '-****-' + data.substring(data.length - 4)
      case 'email':
        const [user, domain] = data.split('@')
        return user.substring(0, 2) + '***@' + domain
      default:
        return data
    }
  }
  
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'High': return 'text-red-700 bg-red-100 ring-2 ring-red-200 shadow-sm'
      case 'Medium': return 'text-amber-700 bg-amber-100 ring-2 ring-amber-200 shadow-sm'
      case 'Low': return 'text-green-700 bg-green-100 ring-2 ring-green-200 shadow-sm'
      default: return 'text-gray-700 bg-gray-100 ring-2 ring-gray-200 shadow-sm'
    }
  }
  
  return (
    <div className="card h-full">
      {/* Profile Header */}
      <div className="flex flex-col items-center pb-6 border-b-2 border-gray-100 bg-gradient-to-b from-gray-50 to-white -m-6 mb-0 p-6 rounded-t-xl">
        <div className="relative">
          <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-[var(--gradient-start)] to-[var(--gradient-end)] flex items-center justify-center mb-4 shadow-xl transform hover:scale-105 transition-transform">
            {person.avatar ? (
              <img src={person.avatar} alt={person.name} className="w-full h-full rounded-2xl object-cover" />
            ) : (
              <User className="w-14 h-14 text-white" />
            )}
          </div>
          {person.status === 'Under Monitoring' && (
            <div className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full animate-pulse ring-4 ring-white" />
          )}
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">{person.name}</h2>
        <p className="text-sm font-medium text-gray-600">{person.demographics.occupation}</p>
        
        {/* Risk Badge */}
        <div className={`mt-4 px-4 py-2 rounded-full text-sm font-bold ${getRiskColor(person.riskLevel)}`}>
          <div className="flex items-center gap-2">
            {person.riskLevel === 'High' && <AlertTriangle className="w-4 h-4" />}
            {person.riskLevel === 'Medium' && <Shield className="w-4 h-4" />}
            <span>Risk Score: {(person.riskScore * 100).toFixed(0)}%</span>
          </div>
        </div>
      </div>
      
      {/* IDs Section */}
      <div className="py-5 border-b border-gray-100">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Identifiers</h3>
        <div className="space-y-2.5 bg-gray-50 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--text-muted)]">NIK</span>
            <span className="text-sm font-mono">{maskSensitiveData(person.ids.nik)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--text-muted)]">Passport</span>
            <span className="text-sm font-mono">{person.ids.passport}</span>
          </div>
          {person.ids.sim.map((sim: string, idx: number) => (
            <div key={idx} className="flex items-center justify-between">
              <span className="text-sm text-[var(--text-muted)]">SIM {idx + 1}</span>
              <span className="text-sm font-mono">{maskSensitiveData(sim, 'phone')}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Demographics */}
      <div className="py-5 border-b border-gray-100">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Demographics</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[var(--text-muted)]" />
            <span className="text-sm">{person.demographics.age} years old</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-[var(--text-muted)]" />
            <span className="text-sm">{person.demographics.gender === 'M' ? 'Male' : 'Female'}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[var(--text-muted)]" />
            <span className="text-sm">{person.demographics.birthPlace}</span>
          </div>
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-[var(--text-muted)]" />
            <span className="text-sm">{person.demographics.education}</span>
          </div>
        </div>
      </div>
      
      {/* Current Address */}
      <div className="py-5 border-b border-gray-100">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Location</h3>
        <div className="bg-blue-50 rounded-lg p-3 space-y-2">
          <p className="text-sm font-medium text-gray-800">{person.address.current}</p>
          <p className="text-xs text-gray-600">
            <span className="font-medium">KTP:</span> {person.address.ktp}
          </p>
        </div>
      </div>
      
      {/* Digital Footprint */}
      <div className="py-5">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Digital Footprint</h3>
        <div className="space-y-2.5">
          {person.digitalFootprint.email.map((email: string, idx: number) => (
            <div key={idx} className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[var(--text-muted)]" />
              <span className="text-sm">{maskSensitiveData(email, 'email')}</span>
            </div>
          ))}
          {person.digitalFootprint.phone.map((phone: string, idx: number) => (
            <div key={idx} className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[var(--text-muted)]" />
              <span className="text-sm">{maskSensitiveData(phone, 'phone')}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Status */}
      <div className="pt-5 mt-5 border-t-2 border-gray-100">
        <div className="flex items-center justify-between bg-gradient-to-r from-gray-50 to-white rounded-lg p-3">
          <span className="text-sm font-medium text-gray-600">Current Status</span>
          <span className={`text-sm font-bold px-3 py-1.5 rounded-full ${
            person.status === 'Under Monitoring' ? 'bg-red-100 text-red-700 ring-1 ring-red-200' :
            person.status === 'VIP' ? 'bg-purple-100 text-purple-700 ring-1 ring-purple-200' :
            'bg-green-100 text-green-700 ring-1 ring-green-200'
          }`}>
            {person.status}
          </span>
        </div>
      </div>
    </div>
  )
}