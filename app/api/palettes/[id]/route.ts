import { NextRequest, NextResponse } from 'next/server'
import { getPaletteById, updatePalette, deletePalette } from '@/lib/db/palettes'
import { auth } from '@/lib/auth/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { data: session } = await auth.getSession()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 })
    }

    const { id } = await params
    const palette = await getPaletteById(parseInt(id, 10), session.user.id)
    
    if (!palette) {
      return NextResponse.json({ error: 'Palette not found' }, { status: 404 })
    }
    
    return NextResponse.json(palette)
  } catch (error) {
    console.error('[v0] Error fetching palette:', error)
    return NextResponse.json({ error: 'Failed to fetch palette' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { data: session } = await auth.getSession()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const palette = await updatePalette(parseInt(id, 10), body, session.user.id)
    
    if (!palette) {
      return NextResponse.json({ error: 'Palette not found' }, { status: 404 })
    }
    
    return NextResponse.json(palette)
  } catch (error) {
    console.error('[v0] Error updating palette:', error)
    return NextResponse.json({ error: 'Failed to update palette' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { data: session } = await auth.getSession()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 })
    }

    const { id } = await params
    await deletePalette(parseInt(id, 10), session.user.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] Error deleting palette:', error)
    return NextResponse.json({ error: 'Failed to delete palette' }, { status: 500 })
  }
}
