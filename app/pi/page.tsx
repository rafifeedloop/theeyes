'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, Filter, Users, AlertTriangle, TrendingUp, Shield, Clock, MapPin } from 'lucide-react'
import Header from '@/components/Header'

interface Person {
  id: string
  name: string
  ids: {
    nik: string
    passport: string
    sim: string[]
  }
  demographics: {
    age: number
    gender: string
    occupation: string
  }
  address: {
    current: string
  }
  riskScore: number
  riskLevel: string
  status: string
  lastActivity: string
  avatar?: string
}

export default function PersonIntelligencePage() {
  const [persons, setPersons] = useState<Person[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRisk, setFilterRisk] = useState('all')
  
  useEffect(() => {
    fetch('/api/pi/profile')
      .then(res => res.json())
      .then(data => setPersons(data))
  }, [])
  
  const filteredPersons = persons.filter(person => {
    const matchesSearch = person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          person.ids.nik.includes(searchTerm) ||
                          person.ids.passport.includes(searchTerm)
    
    const matchesRisk = filterRisk === 'all' || person.riskLevel === filterRisk
    
    return matchesSearch && matchesRisk
  })
  
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'High': return 'text-red-600 bg-red-50 border-red-100'
      case 'Medium': return 'text-amber-600 bg-amber-50 border-amber-100'
      case 'Low': return 'text-green-600 bg-green-50 border-green-100'
      default: return 'text-gray-600 bg-gray-50 border-gray-100'
    }
  }
  
  const getRiskBadgeColor = (score: number) => {
    if (score >= 0.7) return 'bg-red-100 text-red-700 ring-1 ring-red-200'
    if (score >= 0.5) return 'bg-amber-100 text-amber-700 ring-1 ring-amber-200'
    return 'bg-green-100 text-green-700 ring-1 ring-green-200'
  }
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Under Monitoring': return 'bg-red-50 text-red-600 ring-1 ring-red-100 font-medium'
      case 'VIP': return 'bg-purple-50 text-purple-600 ring-1 ring-purple-100 font-medium'
      case 'Active': return 'bg-green-50 text-green-600 ring-1 ring-green-100 font-medium'
      default: return 'bg-gray-50 text-gray-600 ring-1 ring-gray-100 font-medium'
    }
  }
  
  const formatLastActivity = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    
    if (hours < 1) return 'Just now'
    if (hours < 24) return `${hours}h ago`
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }
  
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <Header />
      
      <main className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Person Intelligence
              </h1>
            </div>
            <p className="text-gray-600 ml-14">Monitor and analyze individual profiles, activities, and risk indicators</p>
          </div>
          
          {/* Search and Filters */}
          <div className="card mb-6 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[300px]">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name, NIK, or passport..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)] focus:border-transparent placeholder:text-gray-400 text-sm"
                  />
                </div>
              </div>
              
              <select
                value={filterRisk}
                onChange={(e) => setFilterRisk(e.target.value)}
                className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)] focus:border-transparent text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <option value="all">All Risk Levels</option>
                <option value="High">🔴 High Risk</option>
                <option value="Medium">🟡 Medium Risk</option>
                <option value="Low">🟢 Low Risk</option>
              </select>
              
              <button className="px-5 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center gap-2 font-medium text-sm text-gray-700">
                <Filter className="w-4 h-4" />
                More Filters
              </button>
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="card bg-gradient-to-br from-blue-50 to-white border-blue-100 hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 font-medium">Total Persons</p>
                  <p className="text-3xl font-bold text-blue-900">{persons.length}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="card bg-gradient-to-br from-red-50 to-white border-red-100 hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-600 font-medium">High Risk</p>
                  <p className="text-3xl font-bold text-red-900">
                    {persons.filter(p => p.riskLevel === 'High').length}
                  </p>
                </div>
                <div className="p-3 bg-red-100 rounded-xl">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>
            
            <div className="card bg-gradient-to-br from-amber-50 to-white border-amber-100 hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-amber-600 font-medium">Under Monitoring</p>
                  <p className="text-3xl font-bold text-amber-900">
                    {persons.filter(p => p.status === 'Under Monitoring').length}
                  </p>
                </div>
                <div className="p-3 bg-amber-100 rounded-xl">
                  <Shield className="w-6 h-6 text-amber-600" />
                </div>
              </div>
            </div>
            
            <div className="card bg-gradient-to-br from-purple-50 to-white border-purple-100 hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600 font-medium">VIP Status</p>
                  <p className="text-3xl font-bold text-purple-900">
                    {persons.filter(p => p.status === 'VIP').length}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Person Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPersons.map((person) => (
              <Link key={person.id} href={`/pi/${person.id}`}>
                <div className="card hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer h-full border-2 border-transparent hover:border-[var(--primary-200)]">
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--gradient-start)] to-[var(--gradient-end)] flex items-center justify-center flex-shrink-0 shadow-lg">
                        {person.avatar ? (
                          <img src={person.avatar} alt={person.name} className="w-full h-full rounded-2xl object-cover" />
                        ) : (
                          <span className="text-white font-bold text-xl">
                            {person.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        )}
                      </div>
                      {person.status === 'Under Monitoring' && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse ring-2 ring-white" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg text-gray-900 truncate">{person.name}</h3>
                      <p className="text-sm text-gray-600 font-medium">{person.demographics.occupation}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-gray-500">
                          {person.demographics.age} years
                        </span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500">
                          {person.demographics.gender === 'M' ? 'Male' : 'Female'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-bold ${getRiskBadgeColor(person.riskScore)}`}>
                        {(person.riskScore * 100).toFixed(0)}%
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-mono text-gray-500">NIK: •••{person.ids.nik.slice(-4)}</span>
                      <span className={`px-2.5 py-1 rounded-full text-xs ${getStatusColor(person.status)}`}>
                        {person.status}
                      </span>
                    </div>
                    
                    <div className="space-y-1.5">
                      <div className="flex items-start gap-1.5">
                        <MapPin className="w-3 h-3 text-gray-400 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-gray-600 line-clamp-1">{person.address.current}</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-gray-400" />
                        <p className="text-xs text-gray-500">Last activity: <span className="font-medium">{formatLastActivity(person.lastActivity)}</span></p>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}