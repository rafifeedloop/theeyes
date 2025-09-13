'use client'

import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { Users, Building, Share2, Maximize } from 'lucide-react'

interface Node {
  id: string
  type: 'person' | 'company' | 'location'
  label: string
}

interface Edge {
  from: string
  to: string
  type: string
  weight?: number
}

interface RelationshipGraphProps {
  nodes: Node[]
  edges: Edge[]
  onExpand?: () => void
}

export default function RelationshipGraph({ nodes, edges, onExpand }: RelationshipGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  
  useEffect(() => {
    if (!svgRef.current || nodes.length === 0) return
    
    // Clear previous graph
    d3.select(svgRef.current).selectAll('*').remove()
    
    const width = 350
    const height = 300
    
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
    
    // Transform edges to D3 format
    const transformedEdges = edges.map(edge => ({
      ...edge,
      source: edge.from,
      target: edge.to
    }))
    
    // Filter valid edges
    const nodeIds = new Set(nodes.map(n => n.id))
    const validEdges = transformedEdges.filter(edge => 
      nodeIds.has(edge.source) && nodeIds.has(edge.target)
    )
    
    // Create force simulation
    const simulation = d3.forceSimulation(nodes as any)
      .force('link', d3.forceLink(validEdges as any)
        .id((d: any) => d.id)
        .distance(60))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(25))
    
    // Add edges
    const link = svg.append('g')
      .selectAll('line')
      .data(validEdges)
      .enter().append('line')
      .attr('stroke', '#94A3B8')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', (d: any) => Math.sqrt(d.weight || 0.5) * 2)
      .attr('stroke-dasharray', (d: any) => {
        if (d.type === 'family') return 'none'
        if (d.type === 'owns') return '5,5'
        return '2,2'
      })
    
    // Add edge labels
    const linkLabel = svg.append('g')
      .selectAll('text')
      .data(validEdges)
      .enter().append('text')
      .attr('font-size', '10px')
      .attr('fill', '#64748B')
      .attr('text-anchor', 'middle')
      .text((d: any) => d.type)
    
    // Add nodes
    const node = svg.append('g')
      .selectAll('g')
      .data(nodes)
      .enter().append('g')
      .call(d3.drag<any, any>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended) as any)
    
    // Node circles
    node.append('circle')
      .attr('r', 20)
      .attr('fill', (d: any) => {
        if (d.type === 'person') return '#7DD3C0'
        if (d.type === 'company') return '#FCA5A5'
        return '#FDE68A'
      })
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
    
    // Node icons
    node.append('text')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('font-size', '16px')
      .text((d: any) => {
        if (d.type === 'person') return '👤'
        if (d.type === 'company') return '🏢'
        return '📍'
      })
    
    // Node labels
    node.append('text')
      .attr('y', 32)
      .attr('text-anchor', 'middle')
      .attr('font-size', '11px')
      .attr('fill', '#475569')
      .text((d: any) => {
        const label = d.label
        return label.length > 15 ? label.substring(0, 12) + '...' : label
      })
    
    // Update positions on simulation tick
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y)
      
      linkLabel
        .attr('x', (d: any) => (d.source.x + d.target.x) / 2)
        .attr('y', (d: any) => (d.source.y + d.target.y) / 2)
      
      node.attr('transform', (d: any) => `translate(${d.x},${d.y})`)
    })
    
    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart()
      d.fx = d.x
      d.fy = d.y
    }
    
    function dragged(event: any, d: any) {
      d.fx = event.x
      d.fy = event.y
    }
    
    function dragended(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0)
      d.fx = null
      d.fy = null
    }
    
    return () => {
      simulation.stop()
    }
  }, [nodes, edges])
  
  const getRelationshipStats = () => {
    const personCount = nodes.filter(n => n.type === 'person').length - 1 // Exclude self
    const companyCount = nodes.filter(n => n.type === 'company').length
    const familyCount = edges.filter(e => e.type === 'family').length
    
    return { personCount, companyCount, familyCount }
  }
  
  const stats = getRelationshipStats()
  
  return (
    <div className="card h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Relationships & Influence</h3>
        <button 
          onClick={onExpand}
          className="p-1.5 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <Maximize className="w-4 h-4 text-[var(--text-muted)]" />
        </button>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-teal-50 rounded-lg p-2 text-center">
          <Users className="w-4 h-4 mx-auto text-teal-600 mb-1" />
          <p className="text-xl font-semibold text-teal-700">{stats.personCount}</p>
          <p className="text-xs text-teal-600">Associates</p>
        </div>
        <div className="bg-red-50 rounded-lg p-2 text-center">
          <Building className="w-4 h-4 mx-auto text-red-600 mb-1" />
          <p className="text-xl font-semibold text-red-700">{stats.companyCount}</p>
          <p className="text-xs text-red-600">Companies</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-2 text-center">
          <Share2 className="w-4 h-4 mx-auto text-blue-600 mb-1" />
          <p className="text-xl font-semibold text-blue-700">{stats.familyCount}</p>
          <p className="text-xs text-blue-600">Family</p>
        </div>
      </div>
      
      {/* Graph */}
      <div className="bg-gray-50 rounded-lg p-2 flex items-center justify-center">
        <svg ref={svgRef}></svg>
      </div>
      
      {/* Top Connections */}
      <div className="mt-4">
        <h4 className="text-sm font-semibold text-[var(--text-muted)] mb-2">TOP CONNECTIONS</h4>
        <div className="space-y-2">
          {edges.slice(0, 3).map((edge, idx) => {
            const targetNode = nodes.find(n => n.id === edge.to)
            if (!targetNode) return null
            
            return (
              <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  {targetNode.type === 'person' ? (
                    <Users className="w-4 h-4 text-teal-600" />
                  ) : (
                    <Building className="w-4 h-4 text-red-600" />
                  )}
                  <div>
                    <p className="text-sm font-medium">{targetNode.label}</p>
                    <p className="text-xs text-[var(--text-muted)]">{edge.type}</p>
                  </div>
                </div>
                <div className="text-xs text-[var(--text-muted)]">
                  {edge.weight ? `${(edge.weight * 100).toFixed(0)}%` : '-'}
                </div>
              </div>
            )
          })}
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="mt-4 flex gap-2">
        <button className="flex-1 px-3 py-1.5 text-sm border border-[var(--border)] rounded-lg hover:bg-gray-50">
          View Full Graph
        </button>
        <button className="flex-1 px-3 py-1.5 text-sm bg-[var(--primary-600)] text-white rounded-lg hover:bg-[var(--primary-700)]">
          Export Data
        </button>
      </div>
    </div>
  )
}