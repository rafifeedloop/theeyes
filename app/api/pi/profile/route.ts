import { NextResponse } from 'next/server'
import persons from '@/data/demo/persons.json'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const personId = searchParams.get('personId')
  
  if (!personId) {
    return NextResponse.json(persons)
  }
  
  const person = persons.find(p => p.id === personId)
  
  if (!person) {
    return NextResponse.json({ error: 'Person not found' }, { status: 404 })
  }
  
  return NextResponse.json(person)
}