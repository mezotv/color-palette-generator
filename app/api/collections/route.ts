import { NextRequest, NextResponse } from 'next/server'
import { createCollection, getAllCollections } from '@/lib/db/palettes'

export async function GET() {
  try {
    const collections = await getAllCollections()
    return NextResponse.json(collections)
  } catch (error) {
    console.error('[v0] Error fetching collections:', error)
    return NextResponse.json({ error: 'Failed to fetch collections' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const collection = await createCollection(body)
    return NextResponse.json(collection, { status: 201 })
  } catch (error) {
    console.error('[v0] Error creating collection:', error)
    return NextResponse.json({ error: 'Failed to create collection' }, { status: 500 })
  }
}
