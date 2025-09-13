'use client'

import { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { 
  Database, GitBranch, Brain, Activity, Server, Shield, Settings, 
  PlayCircle, PauseCircle, RefreshCw, AlertCircle, CheckCircle, 
  Upload, Download, Zap, Users, Building2, MapPin, Package,
  Calendar, Hash, Link2, Search, Filter, Save, Deploy,
  ChevronRight, ChevronDown, Eye, Edit, Trash2, Plus
} from 'lucide-react'
import Link from 'next/link'

// Dynamic import for graph visualization
const GraphCanvas = dynamic(() => import('@/components/GraphCanvas'), {
  ssr: false,
  loading: () => (
    <div className="h-full min-h-[600px] flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  )
})

interface DataSource {
  id: string
  name: string
  type: string
  status: 'connected' | 'disconnected' | 'error'
  lastSync: string
  recordCount: number
  schema: Record<string, string>
}

interface Entity {
  id: string
  type: 'person' | 'company' | 'location' | 'asset' | 'event'
  labels: string[]
  props: Record<string, any>
  lineage: Array<{
    source: string
    ingestedAt: string
  }>
  resolution?: {
    clusterId: string
    confidence: number
    mergedFrom: string[]
  }
}

interface Pipeline {
  name: string
  lagMs: number
  throughput: number
  errorRate: number
  state: 'RUNNING' | 'PAUSED' | 'ERROR'
}

interface RiskModel {
  id: string
  name: string
  version: string
  accuracy: number
  features: string[]
  threshold: number
  status: 'active' | 'inactive'
}

export default function CorePlatform() {
  const [activeTab, setActiveTab] = useState<'sources' | 'graph' | 'resolution' | 'risk' | 'streaming'>('graph')
  const [environment, setEnvironment] = useState<'dev' | 'stage' | 'prod'>('dev')
  const [region, setRegion] = useState('indonesia')
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'error'>('synced')
  
  // Data states
  const [dataSources, setDataSources] = useState<DataSource[]>([])
  const [entities, setEntities] = useState<Entity[]>([])
  const [pipelines, setPipelines] = useState<Pipeline[]>([])
  const [riskModels, setRiskModels] = useState<RiskModel[]>([])
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null)
  const [graphQuery, setGraphQuery] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchPipelineStatus, 5000)
    return () => clearInterval(interval)
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      // Fetch all core platform data
      const [sourcesRes, entitiesRes, pipelinesRes, modelsRes] = await Promise.all([
        fetch('/api/core/sources'),
        fetch('/api/core/entities?limit=100'),
        fetch('/api/streaming/pipelines'),
        fetch('/api/risk/models')
      ])

      const [sources, entitiesData, pipelinesData, models] = await Promise.all([
        sourcesRes.json().catch(() => getMockDataSources()),
        entitiesRes.json().catch(() => getMockEntities()),
        pipelinesRes.json().catch(() => getMockPipelines()),
        modelsRes.json().catch(() => getMockRiskModels())
      ])

      setDataSources(sources)
      setEntities(entitiesData)
      setPipelines(pipelinesData)
      setRiskModels(models)
    } catch (error) {
      console.error('Error fetching core platform data:', error)
      // Use mock data as fallback
      setDataSources(getMockDataSources())
      setEntities(getMockEntities())
      setPipelines(getMockPipelines())
      setRiskModels(getMockRiskModels())
    }
    setLoading(false)
  }

  const fetchPipelineStatus = async () => {
    try {
      const res = await fetch('/api/streaming/pipelines')
      const data = await res.json()
      setPipelines(data)
    } catch (error) {
      // Silent fail for background updates
    }
  }

  const getMockDataSources = (): DataSource[] => [
    {
      id: 'ds_1',
      name: 'Dukcapil',
      type: 'Government Registry',
      status: 'connected',
      lastSync: '2025-09-13T10:30:00Z',
      recordCount: 2847291,
      schema: { nik: 'string', name: 'string', dob: 'date', address: 'string' }
    },
    {
      id: 'ds_2',
      name: 'AHU Online',
      type: 'Corporate Registry',
      status: 'connected',
      lastSync: '2025-09-13T10:28:00Z',
      recordCount: 523412,
      schema: { companyId: 'string', name: 'string', directors: 'array', capital: 'number' }
    },
    {
      id: 'ds_3',
      name: 'Telco Stream',
      type: 'Real-time Stream',
      status: 'connected',
      lastSync: '2025-09-13T10:32:15Z',
      recordCount: 18293847,
      schema: { msisdn: 'string', imei: 'string', location: 'geo', timestamp: 'datetime' }
    },
    {
      id: 'ds_4',
      name: 'Banking Network',
      type: 'Financial',
      status: 'error',
      lastSync: '2025-09-13T08:15:00Z',
      recordCount: 9283741,
      schema: { accountId: 'string', transactions: 'array', balance: 'number' }
    }
  ]

  const getMockEntities = (): Entity[] => [
    {
      id: 'pers_102',
      type: 'person',
      labels: ['person', 'ubo'],
      props: {
        name: 'Rizal F.',
        ids: { nik: '3173xxxx', passport: 'C1234567', msisdn: '+62812xxxx' },
        dob: '1987-09-03',
        homeRegion: 'DKI Jakarta'
      },
      lineage: [{ source: 'dukcapil', ingestedAt: '2025-09-10T02:14:00Z' }],
      resolution: {
        clusterId: 'er_c_991',
        confidence: 0.91,
        mergedFrom: ['raw_p_556', 'raw_p_612']
      }
    },
    {
      id: 'ci_77',
      type: 'company',
      labels: ['company', 'logistics'],
      props: {
        name: 'PT Transportindo',
        registrationNo: 'AHU-2025-XY123',
        capital: 125000000000,
        sector: 'Logistics'
      },
      lineage: [{ source: 'AHU', ingestedAt: '2025-09-11T07:00:00Z' }]
    }
  ]

  const getMockPipelines = (): Pipeline[] => [
    { name: 'telco_enrich_v2', lagMs: 420, throughput: 18500, errorRate: 0.0007, state: 'RUNNING' },
    { name: 'tender_join_v1', lagMs: 15, throughput: 1200, errorRate: 0.0, state: 'RUNNING' },
    { name: 'risk_scoring_v3', lagMs: 892, throughput: 3400, errorRate: 0.0012, state: 'RUNNING' },
    { name: 'entity_resolution_v2', lagMs: 1250, throughput: 890, errorRate: 0.0003, state: 'PAUSED' }
  ]

  const getMockRiskModels = (): RiskModel[] => [
    {
      id: 'model_1',
      name: 'fraud_txn',
      version: '2.3.1',
      accuracy: 0.94,
      features: ['txn_amount', 'merchant_risk', 'velocity_24h', 'device_fingerprint'],
      threshold: 0.75,
      status: 'active'
    },
    {
      id: 'model_2',
      name: 'kyc_aml',
      version: '1.8.0',
      accuracy: 0.89,
      features: ['pep_match', 'sanction_list', 'adverse_media', 'ubo_depth'],
      threshold: 0.65,
      status: 'active'
    },
    {
      id: 'model_3',
      name: 'mobility_anomaly',
      version: '3.1.0',
      accuracy: 0.91,
      features: ['location_history', 'movement_pattern', 'time_of_day', 'zone_risk'],
      threshold: 0.70,
      status: 'active'
    }
  ]

  const handleQueryExecute = () => {
    // Execute graph query
    console.log('Executing query:', graphQuery)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
      case 'RUNNING':
      case 'active':
      case 'synced':
        return 'text-green-600'
      case 'PAUSED':
      case 'inactive':
      case 'syncing':
        return 'text-yellow-600'
      case 'disconnected':
      case 'ERROR':
      case 'error':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              ← Back
            </Link>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Database className="w-6 h-6 text-blue-600" />
              Core Platform
            </h1>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
              Technical Foundation
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Environment Selector */}
            <select
              value={environment}
              onChange={(e) => setEnvironment(e.target.value as any)}
              className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="dev">Development</option>
              <option value="stage">Staging</option>
              <option value="prod">Production</option>
            </select>
            
            {/* Region */}
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span className="font-medium">{region.toUpperCase()}</span>
            </div>
            
            {/* Sync Status */}
            <div className={`flex items-center gap-2 text-sm ${getStatusColor(syncStatus)}`}>
              {syncStatus === 'syncing' ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : syncStatus === 'synced' ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <AlertCircle className="w-4 h-4" />
              )}
              <span className="font-medium capitalize">{syncStatus}</span>
            </div>
            
            {/* Deploy Button */}
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Upload className="w-4 h-4" />
              Deploy
            </button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Left Panel - Sources & Adapters */}
        <div className="w-80 bg-white border-r overflow-y-auto">
          <div className="p-4 border-b">
            <h2 className="font-semibold flex items-center gap-2">
              <Server className="w-4 h-4" />
              Sources & Adapters
            </h2>
          </div>
          
          <div className="p-4">
            {/* Data Sources */}
            <div className="space-y-3">
              {dataSources.map((source) => (
                <div key={source.id} className="border rounded-lg p-3">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-medium">{source.name}</h3>
                      <p className="text-xs text-gray-500">{source.type}</p>
                    </div>
                    <span className={`text-xs font-medium ${getStatusColor(source.status)}`}>
                      {source.status === 'connected' ? <CheckCircle className="w-4 h-4" /> :
                       source.status === 'error' ? <AlertCircle className="w-4 h-4" /> :
                       <Activity className="w-4 h-4" />}
                    </span>
                  </div>
                  
                  <div className="text-xs text-gray-600 space-y-1">
                    <div className="flex justify-between">
                      <span>Records:</span>
                      <span className="font-medium">{source.recordCount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Last Sync:</span>
                      <span className="font-medium">
                        {new Date(source.lastSync).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                  
                  {/* Schema Preview */}
                  <div className="mt-2 pt-2 border-t">
                    <div className="text-xs text-gray-500 mb-1">Schema:</div>
                    <div className="flex flex-wrap gap-1">
                      {Object.keys(source.schema).slice(0, 3).map((field) => (
                        <span key={field} className="px-2 py-1 bg-gray-100 text-xs rounded">
                          {field}
                        </span>
                      ))}
                      {Object.keys(source.schema).length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-xs rounded">
                          +{Object.keys(source.schema).length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Add Source Button */}
            <button className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
              <Plus className="w-4 h-4" />
              <span className="text-sm">Add Data Source</span>
            </button>
          </div>
        </div>

        {/* Center - Knowledge Graph Canvas */}
        <div className="flex-1 flex flex-col">
          {/* Query Builder */}
          <div className="bg-white border-b p-4">
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Enter Cypher/Gremlin query... e.g., MATCH (p:person)-[:owns]->(c:company) RETURN p, c"
                  value={graphQuery}
                  onChange={(e) => setGraphQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={handleQueryExecute}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Execute
              </button>
              <button className="p-2 border rounded-lg hover:bg-gray-50">
                <Save className="w-4 h-4" />
              </button>
            </div>
            
            {/* Quick Queries */}
            <div className="flex gap-2 mt-2">
              <button className="px-3 py-1 bg-gray-100 text-xs rounded hover:bg-gray-200">
                All Persons
              </button>
              <button className="px-3 py-1 bg-gray-100 text-xs rounded hover:bg-gray-200">
                All Companies
              </button>
              <button className="px-3 py-1 bg-gray-100 text-xs rounded hover:bg-gray-200">
                UBO Relationships
              </button>
              <button className="px-3 py-1 bg-gray-100 text-xs rounded hover:bg-gray-200">
                High Risk Entities
              </button>
            </div>
          </div>
          
          {/* Graph Visualization */}
          <div className="flex-1 p-4">
            <div className="h-full bg-white rounded-lg border">
              <GraphCanvas
                entities={entities}
                onEntityClick={setSelectedEntity}
                selectedEntity={selectedEntity}
              />
            </div>
          </div>
          
          {/* Entity Details */}
          {selectedEntity && (
            <div className="bg-white border-t p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold flex items-center gap-2">
                    {selectedEntity.type === 'person' ? <Users className="w-4 h-4" /> :
                     selectedEntity.type === 'company' ? <Building2 className="w-4 h-4" /> :
                     <MapPin className="w-4 h-4" />}
                    {selectedEntity.props.name || selectedEntity.id}
                  </h3>
                  <div className="flex gap-2 mt-1">
                    {selectedEntity.labels.map((label) => (
                      <span key={label} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedEntity(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              {/* Properties */}
              <div className="mt-3 text-sm">
                <div className="font-medium mb-1">Properties:</div>
                <div className="bg-gray-50 rounded p-2">
                  <pre className="text-xs">{JSON.stringify(selectedEntity.props, null, 2)}</pre>
                </div>
              </div>
              
              {/* Lineage */}
              {selectedEntity.lineage && (
                <div className="mt-3 text-sm">
                  <div className="font-medium mb-1">Data Lineage:</div>
                  <div className="space-y-1">
                    {selectedEntity.lineage.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs">
                        <Database className="w-3 h-3 text-gray-400" />
                        <span>{item.source}</span>
                        <span className="text-gray-400">•</span>
                        <span>{new Date(item.ingestedAt).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Panel - Engines */}
        <div className="w-96 bg-white border-l overflow-y-auto">
          {/* Tabs */}
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('resolution')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === 'resolution'
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Entity Resolution
            </button>
            <button
              onClick={() => setActiveTab('risk')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === 'risk'
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Risk Scoring
            </button>
            <button
              onClick={() => setActiveTab('streaming')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === 'streaming'
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Streaming
            </button>
          </div>
          
          {/* Tab Content */}
          <div className="p-4">
            {/* Entity Resolution Tab */}
            {activeTab === 'resolution' && (
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <GitBranch className="w-4 h-4" />
                  Entity Resolution Engine
                </h3>
                
                {/* Resolution Rules */}
                <div className="space-y-2">
                  <div className="text-sm font-medium">Active Rules:</div>
                  <div className="space-y-2">
                    <div className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">NIK Exact Match</span>
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                          Weight: 1.0
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">
                        Match when: ids.nik equals exactly
                      </p>
                    </div>
                    
                    <div className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">Name + DOB Fuzzy</span>
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded">
                          Weight: 0.6
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">
                        Match when: name similarity > 0.92 AND dob equals
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Thresholds */}
                <div className="space-y-2">
                  <div className="text-sm font-medium">Thresholds:</div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span>Auto-merge:</span>
                      <span className="font-medium">≥ 0.85</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Review Queue:</span>
                      <span className="font-medium">0.70 - 0.85</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>No Match:</span>
                      <span className="font-medium">< 0.70</span>
                    </div>
                  </div>
                </div>
                
                {/* Review Queue */}
                <div className="space-y-2">
                  <div className="text-sm font-medium">Review Queue (3):</div>
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Potential Match</span>
                      <span className="text-xs text-yellow-700">Confidence: 0.78</span>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex-1 px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700">
                        Merge
                      </button>
                      <button className="flex-1 px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700">
                        Keep Separate
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Risk Scoring Tab */}
            {activeTab === 'risk' && (
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Brain className="w-4 h-4" />
                  Risk Scoring AI
                </h3>
                
                {/* Active Models */}
                <div className="space-y-2">
                  <div className="text-sm font-medium">Active Models:</div>
                  {riskModels.map((model) => (
                    <div key={model.id} className="p-3 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="font-medium text-sm">{model.name}</div>
                          <div className="text-xs text-gray-500">v{model.version}</div>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded ${
                          model.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {model.status}
                        </span>
                      </div>
                      
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Accuracy:</span>
                          <span className="font-medium">{(model.accuracy * 100).toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Threshold:</span>
                          <span className="font-medium">{model.threshold}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Features:</span>
                          <span className="font-medium">{model.features.length}</span>
                        </div>
                      </div>
                      
                      {/* Feature List */}
                      <div className="mt-2 pt-2 border-t">
                        <div className="flex flex-wrap gap-1">
                          {model.features.slice(0, 3).map((feature) => (
                            <span key={feature} className="px-2 py-1 bg-gray-100 text-xs rounded">
                              {feature}
                            </span>
                          ))}
                          {model.features.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-xs rounded">
                              +{model.features.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Model Performance */}
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="text-sm font-medium mb-2">Performance Metrics</div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span>Avg Inference Time:</span>
                      <span className="font-medium">142ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Daily Predictions:</span>
                      <span className="font-medium">1.2M</span>
                    </div>
                    <div className="flex justify-between">
                      <span>False Positive Rate:</span>
                      <span className="font-medium">3.2%</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Streaming Analytics Tab */}
            {activeTab === 'streaming' && (
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Streaming Analytics
                </h3>
                
                {/* Pipelines */}
                <div className="space-y-2">
                  <div className="text-sm font-medium">Active Pipelines:</div>
                  {pipelines.map((pipeline) => (
                    <div key={pipeline.name} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${
                            pipeline.state === 'RUNNING' ? 'bg-green-500' :
                            pipeline.state === 'PAUSED' ? 'bg-yellow-500' : 'bg-red-500'
                          }`} />
                          <span className="text-sm font-medium">{pipeline.name}</span>
                        </div>
                        <button className="p-1 hover:bg-gray-100 rounded">
                          {pipeline.state === 'RUNNING' ? (
                            <PauseCircle className="w-4 h-4 text-gray-600" />
                          ) : (
                            <PlayCircle className="w-4 h-4 text-gray-600" />
                          )}
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-gray-600">Lag:</span>
                          <span className={`ml-1 font-medium ${
                            pipeline.lagMs > 1000 ? 'text-red-600' :
                            pipeline.lagMs > 500 ? 'text-yellow-600' : 'text-green-600'
                          }`}>
                            {pipeline.lagMs}ms
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Throughput:</span>
                          <span className="ml-1 font-medium">
                            {pipeline.throughput.toLocaleString()}/s
                          </span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-gray-600">Error Rate:</span>
                          <span className={`ml-1 font-medium ${
                            pipeline.errorRate > 0.001 ? 'text-red-600' : 'text-green-600'
                          }`}>
                            {(pipeline.errorRate * 100).toFixed(3)}%
                          </span>
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-1">
                          <div
                            className="bg-blue-600 h-1 rounded-full"
                            style={{ width: `${Math.min(100, (pipeline.throughput / 20000) * 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Stream Metrics */}
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm font-medium mb-2">Overall Metrics</div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span>Total Events/sec:</span>
                      <span className="font-medium">23.5K</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Kafka Lag:</span>
                      <span className="font-medium text-green-600">Healthy</span>
                    </div>
                    <div className="flex justify-between">
                      <span>DLQ Messages:</span>
                      <span className="font-medium text-yellow-600">42</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}