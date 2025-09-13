'use client'

import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { Users, Building2, MapPin, Package, Calendar } from 'lucide-react'

interface Entity {
  id: string
  type: 'person' | 'company' | 'location' | 'asset' | 'event'
  labels: string[]
  props: Record<string, any>
}

interface Relationship {
  id: string
  type: string
  from: string
  to: string
  props?: Record<string, any>
}

interface GraphCanvasProps {
  entities?: Entity[]
  relationships?: Relationship[]
  onEntityClick?: (entity: Entity) => void
  selectedEntity?: Entity | null
}

export default function GraphCanvas({ 
  entities = [], 
  relationships = [],
  onEntityClick,
  selectedEntity
}: GraphCanvasProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 })

  useEffect(() => {
    if (!svgRef.current) return

    // Clear previous graph
    d3.select(svgRef.current).selectAll('*').remove()

    const svg = d3.select(svgRef.current)
    const width = dimensions.width
    const height = dimensions.height

    // Create mock data if none provided
    const nodes = entities.length > 0 ? entities : getMockNodes()
    const links = relationships.length > 0 ? relationships : getMockLinks()

    // Create simulation
    const simulation = d3.forceSimulation(nodes as any)
      .force('link', d3.forceLink(links as any)
        .id((d: any) => d.id)
        .distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(40))

    // Add container
    const container = svg.append('g')

    // Add zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        container.attr('transform', event.transform)
      })

    svg.call(zoom as any)

    // Add links
    const link = container.append('g')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', 2)

    // Add link labels
    const linkLabel = container.append('g')
      .selectAll('text')
      .data(links)
      .join('text')
      .text((d: any) => d.type || 'relates')
      .attr('font-size', 10)
      .attr('fill', '#666')
      .attr('text-anchor', 'middle')

    // Add nodes
    const node = container.append('g')
      .selectAll('g')
      .data(nodes)
      .join('g')
      .attr('cursor', 'pointer')
      .call(drag(simulation) as any)

    // Add circles for nodes
    node.append('circle')
      .attr('r', 25)
      .attr('fill', (d: any) => getNodeColor(d.type))
      .attr('stroke', (d: any) => 
        selectedEntity?.id === d.id ? '#3b82f6' : '#fff'
      )
      .attr('stroke-width', (d: any) => 
        selectedEntity?.id === d.id ? 4 : 2
      )

    // Add icons
    node.append('text')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('fill', 'white')
      .attr('font-size', '20')
      .text((d: any) => getNodeIcon(d.type))

    // Add labels
    node.append('text')
      .text((d: any) => d.props?.name || d.id)
      .attr('x', 0)
      .attr('y', 35)
      .attr('text-anchor', 'middle')
      .attr('font-size', 12)
      .attr('fill', '#333')

    // Add click handler
    node.on('click', (event, d: any) => {
      event.stopPropagation()
      if (onEntityClick) {
        onEntityClick(d as Entity)
      }
    })

    // Update positions on tick
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

    // Drag behavior
    function drag(simulation: any) {
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

      return d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended)
    }

    // Cleanup
    return () => {
      simulation.stop()
    }
  }, [entities, relationships, selectedEntity, dimensions])

  // Update dimensions on resize
  useEffect(() => {
    const handleResize = () => {
      if (svgRef.current) {
        const { width, height } = svgRef.current.getBoundingClientRect()
        setDimensions({ width, height })
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const getNodeColor = (type: string) => {
    switch (type) {
      case 'person': return '#3b82f6' // blue
      case 'company': return '#10b981' // green
      case 'location': return '#f59e0b' // yellow
      case 'asset': return '#8b5cf6' // purple
      case 'event': return '#ef4444' // red
      default: return '#6b7280' // gray
    }
  }

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'person': return '👤'
      case 'company': return '🏢'
      case 'location': return '📍'
      case 'asset': return '📦'
      case 'event': return '📅'
      default: return '●'
    }
  }

  const getMockNodes = (): Entity[] => [
    {
      id: 'pers_102',
      type: 'person',
      labels: ['person', 'ubo'],
      props: { name: 'Rizal F.' }
    },
    {
      id: 'pers_103',
      type: 'person',
      labels: ['person'],
      props: { name: 'Siti M.' }
    },
    {
      id: 'ci_77',
      type: 'company',
      labels: ['company'],
      props: { name: 'PT Transportindo' }
    },
    {
      id: 'ci_88',
      type: 'company',
      labels: ['company'],
      props: { name: 'PT Cargo Indo' }
    },
    {
      id: 'loc_1',
      type: 'location',
      labels: ['location'],
      props: { name: 'Jakarta' }
    },
    {
      id: 'asset_1',
      type: 'asset',
      labels: ['asset'],
      props: { name: 'Vehicle Fleet' }
    }
  ]

  const getMockLinks = (): Relationship[] => [
    { id: 'rel_1', type: 'owns', from: 'pers_102', to: 'ci_77' },
    { id: 'rel_2', type: 'owns', from: 'pers_102', to: 'ci_88' },
    { id: 'rel_3', type: 'worksAt', from: 'pers_103', to: 'ci_77' },
    { id: 'rel_4', type: 'locatedIn', from: 'ci_77', to: 'loc_1' },
    { id: 'rel_5', type: 'locatedIn', from: 'ci_88', to: 'loc_1' },
    { id: 'rel_6', type: 'owns', from: 'ci_77', to: 'asset_1' }
  ]

  return (
    <div className="w-full h-full relative">
      <svg
        ref={svgRef}
        className="w-full h-full"
        style={{ minHeight: '500px' }}
      />
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg">
        <div className="text-xs font-semibold mb-2">Entity Types</div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-blue-500"></div>
            <span className="text-xs">Person</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500"></div>
            <span className="text-xs">Company</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
            <span className="text-xs">Location</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-purple-500"></div>
            <span className="text-xs">Asset</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-500"></div>
            <span className="text-xs">Event</span>
          </div>
        </div>
      </div>
      
      {/* Controls */}
      <div className="absolute top-4 right-4 bg-white p-2 rounded-lg shadow-lg">
        <div className="flex flex-col gap-2">
          <button
            onClick={() => {
              const svg = d3.select(svgRef.current)
              svg.transition().call(
                d3.zoom().transform as any,
                d3.zoomIdentity.scale(1.2)
              )
            }}
            className="p-2 hover:bg-gray-100 rounded"
            title="Zoom In"
          >
            +
          </button>
          <button
            onClick={() => {
              const svg = d3.select(svgRef.current)
              svg.transition().call(
                d3.zoom().transform as any,
                d3.zoomIdentity.scale(0.8)
              )
            }}
            className="p-2 hover:bg-gray-100 rounded"
            title="Zoom Out"
          >
            -
          </button>
          <button
            onClick={() => {
              const svg = d3.select(svgRef.current)
              svg.transition().call(
                d3.zoom().transform as any,
                d3.zoomIdentity
              )
            }}
            className="p-2 hover:bg-gray-100 rounded"
            title="Reset"
          >
            ⟲
          </button>
        </div>
      </div>
    </div>
  )
}