import { NextRequest, NextResponse } from 'next/server'
import graph from '@/data/demo/graph.json'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const entityId = searchParams.get('entityId')

  if (entityId) {
    // Filter graph to only show connections related to this entity
    const relevantNodes = new Set<string>()
    const relevantEdges = graph.edges.filter(edge => 
      edge.from === entityId || edge.to === entityId
    )
    
    relevantEdges.forEach(edge => {
      relevantNodes.add(edge.from)
      relevantNodes.add(edge.to)
    })

    const filteredNodes = graph.nodes.filter(node => relevantNodes.has(node.id))

    return NextResponse.json({
      nodes: filteredNodes,
      edges: relevantEdges
    })
  }

  // Return full graph if no entity specified
  return NextResponse.json(graph)
}