'use client'

import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { Network, Maximize2 } from 'lucide-react'
import type { GraphNode, GraphEdge } from '@/lib/types'

interface MiniGraphProps {
  nodes: GraphNode[]
  edges: GraphEdge[]
  onNodeClick?: (node: GraphNode) => void
  loading?: boolean
}

export default function MiniGraph({ nodes, edges, onNodeClick, loading }: MiniGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current || loading || nodes.length === 0) return

    const width = svgRef.current.clientWidth
    const height = 250

    // Clear previous graph
    d3.select(svgRef.current).selectAll('*').remove()

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)

    // Create container group
    const g = svg.append('g')

    // Create zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 3])
      .on('zoom', (event) => {
        g.attr('transform', event.transform)
      })

    svg.call(zoom)

    // Transform edges to D3 format (from/to -> source/target)
    const transformedEdges = edges.map(edge => ({
      ...edge,
      source: (edge as any).from || (edge as any).source,
      target: (edge as any).to || (edge as any).target
    }))

    // Validate edges reference existing nodes
    const nodeIds = new Set(nodes.map(n => n.id))
    const validEdges = transformedEdges.filter(edge => 
      nodeIds.has(edge.source) && nodeIds.has(edge.target)
    )

    // Create force simulation
    const simulation = d3.forceSimulation(nodes as any)
      .force('link', d3.forceLink(validEdges)
        .id((d: any) => d.id)
        .distance(60))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(30))

    // Create links
    const link = g.append('g')
      .selectAll('line')
      .data(validEdges)
      .enter().append('line')
      .attr('stroke', '#E0E7FF')
      .attr('stroke-width', (d) => Math.sqrt(d.strength * 3))
      .attr('stroke-opacity', 0.6)

    // Create nodes container
    const node = g.append('g')
      .selectAll('g')
      .data(nodes)
      .enter().append('g')
      .style('cursor', 'pointer')
      .on('click', (event, d) => onNodeClick?.(d as GraphNode))
      .call(d3.drag<any, any>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended) as any)

    // Add circles for nodes
    node.append('circle')
      .attr('r', 20)
      .attr('fill', (d) => {
        if (d.type === 'person') return '#7C8CF8'
        if (d.type === 'company') return '#38BDF8'
        return '#F59E0B'
      })
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)

    // Add icons or text
    node.append('text')
      .text((d) => d.label.charAt(0))
      .attr('text-anchor', 'middle')
      .attr('dy', '.35em')
      .attr('fill', 'white')
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')

    // Add labels
    node.append('text')
      .text((d) => d.label)
      .attr('x', 0)
      .attr('y', 32)
      .attr('text-anchor', 'middle')
      .attr('font-size', '11px')
      .attr('fill', 'var(--text-muted)')

    // Add risk indicator
    node.append('circle')
      .attr('r', 6)
      .attr('cx', 15)
      .attr('cy', -15)
      .attr('fill', (d) => {
        if (d.risk > 0.6) return '#EF4444'
        if (d.risk > 0.3) return '#F59E0B'
        return '#22C55E'
      })
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)

    // Update positions on tick
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y)

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
  }, [nodes, edges, loading, onNodeClick])

  if (loading) {
    return (
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Knowledge Graph</h3>
          <Network className="w-5 h-5 text-[var(--text-muted)]" />
        </div>
        <div className="h-[250px] bg-gray-50 rounded-xl animate-pulse" />
      </div>
    )
  }

  if (nodes.length === 0) {
    return (
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Knowledge Graph</h3>
          <Network className="w-5 h-5 text-[var(--text-muted)]" />
        </div>
        <div className="h-[250px] flex items-center justify-center text-[var(--text-muted)]">
          <div className="text-center">
            <Network className="w-12 h-12 mx-auto mb-2 opacity-30" />
            <p className="text-sm">Select an entity to view connections</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Knowledge Graph</h3>
        <div className="flex items-center gap-2">
          <button className="p-1.5 hover:bg-gray-50 rounded-lg transition-colors">
            <Maximize2 className="w-4 h-4 text-[var(--text-muted)]" />
          </button>
          <Network className="w-5 h-5 text-[var(--text-muted)]" />
        </div>
      </div>
      
      <div className="relative">
        <svg
          ref={svgRef}
          className="w-full h-[250px] border border-[var(--border)] rounded-xl bg-gradient-to-br from-blue-50/20 to-pink-50/20"
        />
        
        <div className="absolute bottom-2 right-2 bg-white/90 rounded-lg p-2 text-xs">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-[#7C8CF8]" />
              <span>Person</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-[#38BDF8]" />
              <span>Company</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-[#F59E0B]" />
              <span>Location</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}