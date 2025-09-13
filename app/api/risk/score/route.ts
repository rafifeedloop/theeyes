import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json()
  const { entityId, model, features } = body
  
  const models: Record<string, any> = {
    fraud_txn: {
      threshold: 0.7,
      weights: { txn_velocity: 0.3, amount_zscore: 0.4, device_fingerprint: 0.3 }
    },
    kyc_aml: {
      threshold: 0.65,
      weights: { sanctions_match: 0.5, pep_score: 0.3, adverse_media: 0.2 }
    },
    mobility_anomaly: {
      threshold: 0.75,
      weights: { location_jumps: 0.4, time_pattern: 0.3, device_changes: 0.3 }
    },
    disaster_overlap: {
      threshold: 0.6,
      weights: { geo_proximity: 0.5, time_correlation: 0.3, entity_links: 0.2 }
    },
    tender_spike: {
      threshold: 0.7,
      weights: { count_deviation: 0.35, value_deviation: 0.35, pattern_score: 0.3 }
    }
  }
  
  const selectedModel = models[model] || models.tender_spike
  
  let score = 0
  const reasons = []
  
  if (model === 'tender_spike' && features) {
    if (features.tender_count_30d > 10) {
      score += 0.35
      reasons.push('tender_count_30d>p95')
    }
    if (features.zscore > 3) {
      score += 0.36
      reasons.push('zscore>3')
    }
    if (features.median_value_180d > 1e9) {
      score += 0.2
      reasons.push('high_median_value')
    }
  } else {
    score = 0.42 + Math.random() * 0.4
    if (score > 0.7) reasons.push('high_risk_indicators')
    if (score > 0.5) reasons.push('elevated_pattern_score')
  }
  
  const band = score >= 0.7 ? 'High' : score >= 0.5 ? 'Medium' : 'Low'
  
  const response = {
    entityId,
    model,
    score: parseFloat(score.toFixed(2)),
    band,
    reasons,
    features,
    threshold: selectedModel.threshold,
    timestamp: new Date().toISOString(),
    modelVersion: '2.1.0',
    explanations: {
      score_breakdown: Object.entries(selectedModel.weights).map(([feature, weight]) => ({
        feature,
        weight,
        contribution: (score * (weight as number)).toFixed(3)
      }))
    }
  }
  
  return NextResponse.json(response)
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const entityId = searchParams.get('entityId')
  
  const historicalScores = [
    {
      entityId: entityId || 'ci_77',
      model: 'tender_spike',
      score: 0.71,
      band: 'High',
      timestamp: '2025-09-13T10:00:00Z'
    },
    {
      entityId: entityId || 'ci_77',
      model: 'tender_spike',
      score: 0.68,
      band: 'Medium',
      timestamp: '2025-09-12T10:00:00Z'
    },
    {
      entityId: entityId || 'ci_77',
      model: 'kyc_aml',
      score: 0.42,
      band: 'Low',
      timestamp: '2025-09-11T10:00:00Z'
    }
  ]
  
  return NextResponse.json(historicalScores)
}