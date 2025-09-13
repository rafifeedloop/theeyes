'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Header from '@/components/Header'
import ProfileCard from '@/components/pi/ProfileCard'
import ActivityTimeline from '@/components/pi/ActivityTimeline'
import RelationshipGraph from '@/components/pi/RelationshipGraph'
import { ArrowLeft, Download, Share2, AlertTriangle } from 'lucide-react'

export default function PersonDetailPage() {
  const params = useParams()
  const router = useRouter()
  const personId = params.id as string
  
  const [person, setPerson] = useState<any>(null)
  const [timeline, setTimeline] = useState<any[]>([])
  const [relationships, setRelationships] = useState<any>({ nodes: [], edges: [] })
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    if (!personId) return
    
    Promise.all([
      fetch(`/api/pi/profile?personId=${personId}`).then(res => res.json()),
      fetch(`/api/pi/timeline?personId=${personId}`).then(res => res.json()),
      fetch(`/api/pi/relationships?personId=${personId}`).then(res => res.json())
    ]).then(([profileData, timelineData, relationshipData]) => {
      setPerson(profileData)
      setTimeline(timelineData)
      setRelationships(relationshipData)
      setLoading(false)
    }).catch(err => {
      console.error('Failed to fetch person data:', err)
      setLoading(false)
    })
  }, [personId])
  
  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg)]">
        <Header />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary-600)] mx-auto"></div>
            <p className="mt-4 text-[var(--text-muted)]">Loading person profile...</p>
          </div>
        </div>
      </div>
    )
  }
  
  if (!person) {
    return (
      <div className="min-h-screen bg-[var(--bg)]">
        <Header />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="text-center">
            <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <p className="text-lg font-semibold">Person not found</p>
            <button 
              onClick={() => router.push('/pi')}
              className="mt-4 px-4 py-2 bg-[var(--primary-600)] text-white rounded-lg hover:bg-[var(--primary-700)]"
            >
              Back to Person List
            </button>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <Header />
      
      <main className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/pi')}
                className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold">{person.name}</h1>
                <p className="text-[var(--text-muted)]">Person ID: {person.id}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 border border-[var(--border)] rounded-lg hover:bg-gray-50 flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                Share
              </button>
              <button className="px-4 py-2 bg-[var(--primary-600)] text-white rounded-lg hover:bg-[var(--primary-700)] flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export Report
              </button>
            </div>
          </div>
          
          {/* Risk Signals Alert */}
          {person.riskSignals && person.riskSignals.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-900 mb-1">Active Risk Signals</h3>
                  <div className="flex flex-wrap gap-2">
                    {person.riskSignals.map((signal: string, idx: number) => (
                      <span key={idx} className="px-2 py-1 bg-red-100 text-red-700 rounded text-sm">
                        {signal}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* 3-Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Sidebar - Profile */}
            <div className="lg:col-span-3">
              <ProfileCard person={person} />
            </div>
            
            {/* Center - Timeline */}
            <div className="lg:col-span-6">
              <ActivityTimeline events={timeline} />
            </div>
            
            {/* Right Panel - Relationships */}
            <div className="lg:col-span-3">
              <RelationshipGraph 
                nodes={relationships.nodes}
                edges={relationships.edges}
                onExpand={() => router.push(`/graph?entity=${personId}`)}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}