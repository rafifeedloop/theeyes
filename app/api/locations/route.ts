import { NextResponse } from 'next/server'
import locations from '@/data/demo/locations.json'

export async function GET() {
  // In production, this would fetch from a real database
  // and could include real-time updates from telco/IoT sensors
  
  // Simulate some random updates to make it feel live
  const updatedLocations = locations.map(location => ({
    ...location,
    metrics: {
      ...location.metrics,
      population: location.metrics.population + Math.floor(Math.random() * 100 - 50),
      deviceCount: location.metrics.deviceCount + Math.floor(Math.random() * 50 - 25),
      avgMovementSpeed: Math.max(5, Math.min(50, location.metrics.avgMovementSpeed + (Math.random() * 4 - 2)))
    },
    lastUpdate: new Date().toISOString()
  }))

  return NextResponse.json(updatedLocations)
}