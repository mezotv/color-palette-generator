import { NextRequest, NextResponse } from 'next/server'
import { createPalette, getAllPalettes } from '@/lib/db/palettes'
import { auth } from '@/lib/auth/server'

export async function GET() {
  try {
    const { data: session } = await auth.getSession()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 })
    }

    const palettes = await getAllPalettes(session.user.id)
    return NextResponse.json(palettes)
  } catch (error) {
    console.error('[v0] Error fetching palettes:', error)
    return NextResponse.json({ error: 'Failed to fetch palettes' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { data: session } = await auth.getSession()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 })
    }

    const body = await request.json()
    const palette = await createPalette(session.user.id, body)
    return NextResponse.json(palette, { status: 201 })
  } catch (error) {
    console.error('[v0] Error creating palette:', error)
    return NextResponse.json({ error: 'Failed to create palette' }, { status: 500 })
  }
}
