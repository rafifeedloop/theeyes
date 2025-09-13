import { NextResponse } from 'next/server'

export async function GET() {
  const pipelines = [
    {
      name: 'telco_enrich_v2',
      description: 'Telco data enrichment pipeline',
      lagMs: 420,
      throughput: 18500,
      errorRate: 0.0007,
      state: 'RUNNING',
      uptime: '15d 4h 23m',
      lastError: null,
      topics: {
        input: 'telco.raw',
        output: 'telco.enriched',
        dlq: 'telco.dlq'
      },
      metrics: {
        processed: 245678901,
        failed: 172,
        inFlight: 234
      }
    },
    {
      name: 'tender_join_v1',
      description: 'Tender data join and scoring',
      lagMs: 15,
      throughput: 1200,
      errorRate: 0.0,
      state: 'RUNNING',
      uptime: '28d 12h 45m',
      lastError: null,
      topics: {
        input: 'lpse.tenders',
        output: 'tenders.scored',
        dlq: 'tenders.dlq'
      },
      metrics: {
        processed: 1456789,
        failed: 0,
        inFlight: 12
      }
    },
    {
      name: 'dukcapil_sync_v3',
      description: 'Population data synchronization',
      lagMs: 1250,
      throughput: 8900,
      errorRate: 0.002,
      state: 'RUNNING',
      uptime: '7d 18h 30m',
      lastError: '2025-09-06T14:23:00Z: Connection timeout',
      topics: {
        input: 'dukcapil.updates',
        output: 'persons.canonical',
        dlq: 'dukcapil.dlq'
      },
      metrics: {
        processed: 5678234,
        failed: 11,
        inFlight: 567
      }
    },
    {
      name: 'bank_txn_stream_v2',
      description: 'Banking transaction stream processing',
      lagMs: 85,
      throughput: 45600,
      errorRate: 0.0001,
      state: 'RUNNING',
      uptime: '45d 2h 15m',
      lastError: null,
      topics: {
        input: 'bank.transactions',
        output: 'txn.enriched',
        dlq: 'bank.dlq'
      },
      metrics: {
        processed: 987654321,
        failed: 98,
        inFlight: 1234
      }
    },
    {
      name: 'osint_crawler_v1',
      description: 'OSINT data crawling and extraction',
      lagMs: 3400,
      throughput: 450,
      errorRate: 0.012,
      state: 'DEGRADED',
      uptime: '2d 5h 10m',
      lastError: '2025-09-13T11:45:00Z: Rate limit exceeded',
      topics: {
        input: 'osint.urls',
        output: 'osint.entities',
        dlq: 'osint.dlq'
      },
      metrics: {
        processed: 234567,
        failed: 28,
        inFlight: 89
      }
    },
    {
      name: 'alert_generator_v4',
      description: 'Real-time alert generation from risk scores',
      lagMs: 25,
      throughput: 2300,
      errorRate: 0.0,
      state: 'RUNNING',
      uptime: '90d 0h 0m',
      lastError: null,
      topics: {
        input: 'risk.scores',
        output: 'alerts.realtime',
        dlq: 'alerts.dlq'
      },
      metrics: {
        processed: 18956234,
        failed: 0,
        inFlight: 45
      }
    }
  ]
  
  return NextResponse.json(pipelines)
}

export async function POST(request: Request) {
  const body = await request.json()
  const { name, action } = body
  
  const response = {
    name,
    action,
    status: 'success',
    message: `Pipeline ${name} ${action} successfully`,
    timestamp: new Date().toISOString()
  }
  
  return NextResponse.json(response)
}