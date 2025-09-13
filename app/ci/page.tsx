'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, Building2, TrendingUp, FileText, Network, AlertTriangle, ChevronRight, ChevronLeft, Users, MapPin, DollarSign, Menu } from 'lucide-react'
import Link from 'next/link'
import Header from '@/components/Header'

interface CompanyProfile {
  id: string
  name: string
  legalRegistry: {
    ahu?: string
    oss?: string
  }
  incorporationDate: string
  sector: string
  hqAddress: string
  ubo: Array<{
    id: string
    name: string
    ownership: number
  }>
  riskScore: number
  riskLevel: 'Low' | 'Medium' | 'High'
}

interface FinancialData {
  revenueProxy: number
  growthRate: number
  plnUsageTrend: number[]
  bankRiskFlags: string[]
  score: number
}

interface Tender {
  tenderId: string
  title: string
  value: number
  date: string
}

interface RelationshipData {
  nodes: Array<{
    id: string
    type: string
    label: string
  }>
  edges: Array<{
    from: string
    to: string
    type: string
  }>
}

export default function CompanyIntelligence() {
  const [selectedCompany, setSelectedCompany] = useState<string>('ci_77')
  const [searchQuery, setSearchQuery] = useState('')
  const [profile, setProfile] = useState<CompanyProfile | null>(null)
  const [financial, setFinancial] = useState<FinancialData | null>(null)
  const [tenders, setTenders] = useState<Tender[]>([])
  const [relationships, setRelationships] = useState<RelationshipData | null>(null)
  const [loading, setLoading] = useState(true)
  const [companies, setCompanies] = useState<any[]>([])
  const [companiesLoading, setCompaniesLoading] = useState(true)
  const [showCompanyList, setShowCompanyList] = useState(true)

  useEffect(() => {
    fetchCompanies()
  }, [])

  useEffect(() => {
    fetchCompanyData()
  }, [selectedCompany])

  const fetchCompanies = async () => {
    setCompaniesLoading(true)
    try {
      const res = await fetch('/api/ci/companies')
      const data = await res.json()
      setCompanies(data)
    } catch (error) {
      console.error('Error fetching companies:', error)
    }
    setCompaniesLoading(false)
  }

  const fetchCompanyData = async () => {
    setLoading(true)
    try {
      const [profileRes, financialRes, tendersRes, relationshipsRes] = await Promise.all([
        fetch(`/api/ci/profile?companyId=${selectedCompany}`),
        fetch(`/api/ci/financial?companyId=${selectedCompany}`),
        fetch(`/api/ci/tenders?companyId=${selectedCompany}`),
        fetch(`/api/ci/relationships?companyId=${selectedCompany}`)
      ])

      const [profileData, financialData, tendersData, relationshipsData] = await Promise.all([
        profileRes.json(),
        financialRes.json(),
        tendersRes.json(),
        relationshipsRes.json()
      ])

      setProfile(profileData)
      setFinancial(financialData)
      setTenders(tendersData)
      setRelationships(relationshipsData)
    } catch (error) {
      console.error('Error fetching company data:', error)
    }
    setLoading(false)
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Low': return 'bg-green-500'
      case 'Medium': return 'bg-yellow-500'
      case 'High': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <Header />

      <main className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Building2 className="w-6 h-6" />
            Company Intelligence
          </h1>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="flex h-[calc(100vh-200px)] bg-white rounded-lg shadow-sm">
          {/* Company List Sidebar */}
          {showCompanyList && (
            <div className="w-64 bg-gray-50 border-r overflow-y-auto">
              <div className="p-4 border-b bg-white">
                <h3 className="font-semibold text-sm text-gray-700 mb-3">Companies ({companies.length})</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Filter companies..."
                    className="w-full pl-9 pr-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => {
                      const query = e.target.value.toLowerCase()
                      if (query) {
                        fetch(`/api/ci/companies?search=${query}`)
                          .then(res => res.json())
                          .then(data => setCompanies(data))
                      } else {
                        fetchCompanies()
                      }
                    }}
                  />
                </div>
              </div>
              
              <div className="p-2">
                {companiesLoading ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {companies.map((company) => (
                      <button
                        key={company.id}
                        onClick={() => setSelectedCompany(company.id)}
                        className={`w-full text-left p-3 rounded-lg transition-all ${
                          selectedCompany === company.id
                            ? 'bg-blue-50 border border-blue-200'
                            : 'hover:bg-white border border-transparent'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm truncate">{company.name}</div>
                            <div className="text-xs text-gray-500 mt-1">{company.sector}</div>
                          </div>
                          <div className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                            company.riskLevel === 'High' ? 'bg-red-100 text-red-700' :
                            company.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {company.riskLevel}
                          </div>
                        </div>
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {company.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {company.employees}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Company Profile Sidebar */}
          <div className="w-80 bg-white border-r p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Company Profile</h2>
              <button
                onClick={() => setShowCompanyList(!showCompanyList)}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                title={showCompanyList ? "Hide company list" : "Show company list"}
              >
                {showCompanyList ? <ChevronLeft className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
            
            {profile && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold">{profile.name}</h3>
                  <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs text-white ${getRiskColor(profile.riskLevel)} mt-2`}>
                    <AlertTriangle className="w-3 h-3" />
                    {profile.riskLevel} Risk ({(profile.riskScore * 100).toFixed(0)}%)
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-500">Legal Registry:</span>
                    <div className="font-medium">
                      {profile.legalRegistry.ahu && <div>AHU: {profile.legalRegistry.ahu}</div>}
                      {profile.legalRegistry.oss && <div>OSS: {profile.legalRegistry.oss}</div>}
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-gray-500">Incorporation:</span>
                    <div className="font-medium">{new Date(profile.incorporationDate).toLocaleDateString()}</div>
                  </div>
                  
                  <div>
                    <span className="text-gray-500">Sector:</span>
                    <div className="font-medium">{profile.sector}</div>
                  </div>
                  
                  <div>
                    <span className="text-gray-500">HQ Address:</span>
                    <div className="font-medium">{profile.hqAddress}</div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Beneficial Ownership (UBO)</h4>
                  <div className="space-y-2">
                    {profile.ubo.map((owner) => (
                      <Link
                        key={owner.id}
                        href={`/pi/${owner.id}`}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
                      >
                        <span className="text-sm font-medium">{owner.name}</span>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {(owner.ownership * 100).toFixed(1)}%
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Center - Activity & Operations */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="space-y-6">
              {/* Financial Health */}
              {financial && (
                <div className="bg-white rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Financial Health
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-gray-500">Revenue Proxy</div>
                      <div className="text-2xl font-bold">{formatCurrency(financial.revenueProxy)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Growth Rate</div>
                      <div className="text-2xl font-bold text-green-600">
                        {financial.growthRate > 0 ? '+' : ''}{(financial.growthRate * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>

                  {/* Financial Score Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-500 mb-1">
                      <span>Financial Score</span>
                      <span>{(financial.score * 100).toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full ${
                          financial.score > 0.7 ? 'bg-green-500' :
                          financial.score > 0.4 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${financial.score * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* PLN Usage Trend */}
                  <div className="mb-4">
                    <div className="text-sm text-gray-500 mb-2">PLN Usage Trend (MWh)</div>
                    <div className="flex items-end gap-2 h-20">
                      {financial.plnUsageTrend.map((value, index) => (
                        <div
                          key={index}
                          className="flex-1 bg-blue-500 rounded-t"
                          style={{ height: `${(value / Math.max(...financial.plnUsageTrend)) * 100}%` }}
                          title={`${value} MWh`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Risk Flags */}
                  {financial.bankRiskFlags.length > 0 && (
                    <div>
                      <div className="text-sm text-gray-500 mb-2">Risk Flags</div>
                      <div className="flex flex-wrap gap-2">
                        {financial.bankRiskFlags.map((flag) => (
                          <span key={flag} className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                            {flag.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tender & Procurement */}
              <div className="bg-white rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Tender & Procurement History
                </h3>
                
                {tenders.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 text-sm font-medium text-gray-600">Tender ID</th>
                          <th className="text-left py-2 text-sm font-medium text-gray-600">Title</th>
                          <th className="text-right py-2 text-sm font-medium text-gray-600">Value</th>
                          <th className="text-right py-2 text-sm font-medium text-gray-600">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tenders.map((tender) => (
                          <tr key={tender.tenderId} className="border-b hover:bg-gray-50">
                            <td className="py-3 text-sm font-mono">{tender.tenderId}</td>
                            <td className="py-3 text-sm">{tender.title}</td>
                            <td className="py-3 text-sm text-right font-medium">{formatCurrency(tender.value)}</td>
                            <td className="py-3 text-sm text-right text-gray-600">
                              {new Date(tender.date).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500">No tender history available</p>
                )}
              </div>

              {/* Market Presence */}
              <div className="bg-white rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Market & Branch Presence
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded">
                    <div className="text-2xl font-bold">12</div>
                    <div className="text-sm text-gray-500">Branches</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded">
                    <div className="text-2xl font-bold">8</div>
                    <div className="text-sm text-gray-500">Provinces</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded">
                    <div className="text-2xl font-bold">15%</div>
                    <div className="text-sm text-gray-500">Market Share</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Relationships & Insights */}
          <div className="w-80 bg-white border-l p-6 overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">Relationships & Insights</h2>
            
            {relationships && (
              <div className="space-y-4">
                {/* Linked Persons */}
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Linked Persons
                  </h4>
                  <div className="space-y-2">
                    {relationships.nodes
                      .filter(node => node.type === 'person')
                      .map(person => (
                        <Link
                          key={person.id}
                          href={`/pi/${person.id}`}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
                        >
                          <span className="text-sm">{person.label}</span>
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        </Link>
                      ))}
                  </div>
                </div>

                {/* Affiliates */}
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    Subsidiaries & Affiliates
                  </h4>
                  <div className="space-y-2">
                    {relationships.nodes
                      .filter(node => node.type === 'company' && node.id !== selectedCompany)
                      .map(company => (
                        <button
                          key={company.id}
                          onClick={() => setSelectedCompany(company.id)}
                          className="w-full flex items-center justify-between p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors text-left"
                        >
                          <span className="text-sm">{company.label}</span>
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        </button>
                      ))}
                  </div>
                </div>

                {/* Graph Preview */}
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Network className="w-4 h-4" />
                    Network Graph
                  </h4>
                  <Link
                    href={`/graph?entity=${selectedCompany}`}
                    className="block p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-center"
                  >
                    <Network className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                    <span className="text-sm text-blue-600 font-medium">
                      View Full Graph →
                    </span>
                  </Link>
                </div>

                {/* Sectoral Intelligence */}
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Sectoral Intelligence
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="p-2 bg-gray-50 rounded">
                      <div className="text-gray-500">Competitors</div>
                      <div className="font-medium">5 major players</div>
                    </div>
                    <div className="p-2 bg-gray-50 rounded">
                      <div className="text-gray-500">Sector Growth</div>
                      <div className="font-medium text-green-600">+12% YoY</div>
                    </div>
                    <div className="p-2 bg-gray-50 rounded">
                      <div className="text-gray-500">Industry Rank</div>
                      <div className="font-medium">#3 of 47</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      </main>
    </div>
  )
}