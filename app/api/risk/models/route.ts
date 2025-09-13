import { NextResponse } from 'next/server'

export async function GET() {
  const models = [
    {
      id: 'fraud_txn',
      name: 'Transaction Fraud Detection',
      version: '2.1.0',
      status: 'active',
      accuracy: 0.94,
      precision: 0.91,
      recall: 0.89,
      f1Score: 0.90,
      lastTraining: '2025-09-01T00:00:00Z',
      features: ['txn_velocity', 'amount_zscore', 'device_fingerprint', 'merchant_risk'],
      threshold: 0.7,
      dailyInvocations: 125678,
      avgLatencyMs: 45
    },
    {
      id: 'kyc_aml',
      name: 'KYC/AML Risk Scoring',
      version: '1.8.2',
      status: 'active',
      accuracy: 0.92,
      precision: 0.88,
      recall: 0.91,
      f1Score: 0.89,
      lastTraining: '2025-08-15T00:00:00Z',
      features: ['sanctions_match', 'pep_score', 'adverse_media', 'jurisdiction_risk'],
      threshold: 0.65,
      dailyInvocations: 45234,
      avgLatencyMs: 120
    },
    {
      id: 'mobility_anomaly',
      name: 'Mobility Pattern Anomaly',
      version: '1.5.0',
      status: 'active',
      accuracy: 0.88,
      precision: 0.85,
      recall: 0.82,
      f1Score: 0.83,
      lastTraining: '2025-09-05T00:00:00Z',
      features: ['location_jumps', 'time_pattern', 'device_changes', 'velocity_score'],
      threshold: 0.75,
      dailyInvocations: 89456,
      avgLatencyMs: 35
    },
    {
      id: 'disaster_overlap',
      name: 'Disaster Aid Overlap Detection',
      version: '1.2.1',
      status: 'testing',
      accuracy: 0.86,
      precision: 0.83,
      recall: 0.87,
      f1Score: 0.85,
      lastTraining: '2025-09-10T00:00:00Z',
      features: ['geo_proximity', 'time_correlation', 'entity_links', 'claim_patterns'],
      threshold: 0.6,
      dailyInvocations: 12345,
      avgLatencyMs: 78
    },
    {
      id: 'tender_spike',
      name: 'Tender Spike Detection',
      version: '2.0.3',
      status: 'active',
      accuracy: 0.91,
      precision: 0.89,
      recall: 0.86,
      f1Score: 0.87,
      lastTraining: '2025-09-08T00:00:00Z',
      features: ['tender_count_30d', 'median_value_180d', 'zscore', 'win_rate', 'sector_concentration'],
      threshold: 0.7,
      dailyInvocations: 34567,
      avgLatencyMs: 55
    }
  ]
  
  return NextResponse.json(models)
}

export async function POST(request: Request) {
  const body = await request.json()
  
  const newModel = {
    id: `model_${Date.now()}`,
    ...body,
    version: '1.0.0',
    status: 'training',
    createdAt: new Date().toISOString()
  }
  
  return NextResponse.json(newModel, { status: 201 })
}