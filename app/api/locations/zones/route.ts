import { NextResponse } from 'next/server'
import zones from '@/data/demo/zones.json'

export async function GET() {
  // In production, this would fetch from a real geofencing system
  // and include real-time device counts and status updates
  
  // Simulate dynamic device counts
  const updatedZones = zones.map(zone => ({
    ...zone,
    activeDevices: zone.activeDevices + Math.floor(Math.random() * 500 - 250),
    // Randomly change status occasionally
    status: Math.random() > 0.9 
      ? ['normal', 'warning', 'critical'][Math.floor(Math.random() * 3)] as 'normal' | 'warning' | 'critical'
      : zone.status
  }))

  return NextResponse.json(updatedZones)
}