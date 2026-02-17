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
    console.log('[v0] POST /api/palettes - Starting')
    const { data: session } = await auth.getSession()

    console.log('[v0] Session:', session ? `User ID: ${session.user?.id}` : 'No session')
    
    if (!session?.user) {
      console.log('[v0] Unauthenticated request')
      return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 })
    }

    const body = await request.json()
    console.log('[v0] Request body:', JSON.stringify(body, null, 2))
    console.log('[v0] Creating palette for user:', session.user.id)
    
    const palette = await createPalette(session.user.id, body)
    console.log('[v0] Palette created successfully:', palette.id)
    return NextResponse.json(palette, { status: 201 })
  } catch (error) {
    console.error('[v0] Error creating palette:', error)
    console.error('[v0] Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    return NextResponse.json({ error: 'Failed to create palette' }, { status: 500 })
  }
}
