'use client'

import { useState, useEffect, useCallback, useMemo, Suspense } from 'react'
import Link from 'next/link'
import { authClient } from '@/lib/auth/client'
import { PaletteDisplay } from '@/components/palette-display'
import { PaletteSkeleton } from '@/components/palette-skeleton'
import { Navigation } from '@/components/navigation'
import { BrutalButton } from '@/components/ui/brutal-button'
import { BrutalInput } from '@/components/ui/brutal-input'
import { BrutalCard, BrutalCardContent, BrutalCardHeader, BrutalCardTitle } from '@/components/ui/brutal-card'
import { HugeiconsIcon } from '@hugeicons/react'
import { Sparkles, Heart, Delete02Icon } from '@hugeicons/core-free-icons'
import { toast } from 'sonner'
import type { Palette } from '@/lib/types/color'

function PalettesPageContent() {
  const [palettes, setPalettes] = useState<Palette[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterMode, setFilterMode] = useState<'all' | 'favorites'>('all')
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchPalettes = useCallback(async () => {
    try {
      const response = await fetch('/api/palettes')
      if (!response.ok) throw new Error('Failed to fetch palettes')
      const data = await response.json()
      if (Array.isArray(data)) {
        setPalettes(data)
      } else {
        console.error('[v0] Invalid data format:', data)
        setPalettes([])
      }
    } catch (error) {
      console.error('[v0] Error fetching palettes:', error)
      toast.error('Failed to load palettes')
      setPalettes([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPalettes()
  }, [fetchPalettes])

  const filteredPalettes = useMemo(() => {
    let filtered = palettes

    if (filterMode === 'favorites') {
      filtered = filtered.filter((p) => p.isFavorite)
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.colors.some((c) => c.toLowerCase().includes(query)) ||
          (p.harmonyType && p.harmonyType.toLowerCase().includes(query))
      )
    }

    return filtered
  }, [palettes, filterMode, searchQuery])

  const favoriteCount = useMemo(() => palettes.filter((p) => p.isFavorite).length, [palettes])

  const handleToggleFavorite = async (paletteId: number) => {
    try {
      const response = await fetch(`/api/palettes/${paletteId}/favorite`, {
        method: 'PATCH',
      })

      if (response.ok) {
        setPalettes((prev) => prev.map((p) => (p.id === paletteId ? { ...p, isFavorite: !p.isFavorite } : p)))
      } else {
        toast.error('Failed to update favorite status')
      }
    } catch (error) {
      console.error('[v0] Error toggling favorite:', error)
      toast.error('Failed to update favorite status')
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/palettes/${deleteTarget}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setPalettes((prev) => prev.filter((p) => p.id !== deleteTarget))
        toast.success('Palette deleted successfully')
        setDeleteTarget(null)
      } else {
        toast.error('Failed to delete palette')
      }
    } catch (error) {
      console.error('[v0] Error deleting palette:', error)
      toast.error('Failed to delete palette')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <Navigation />

        <main>
        <header className="mb-8">
          <div className="bg-secondary text-white border-3 border-black shadow-brutal-xl p-4 sm:p-6">
            <h1 className="text-4xl font-black tracking-tight text-balance sm:text-5xl">My Palettes</h1>
            <p className="mt-2 text-lg font-bold opacity-90">View and manage your saved color palettes</p>
          </div>
        </header>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4 border-3 border-black bg-white p-4 shadow-brutal sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Search */}
            <div className="flex-1">
              <BrutalInput
                type="search"
                placeholder="Search palettes by name, color, or harmony type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              {/* Palette Count */}
              <div className="text-sm font-bold">
                <span className="text-muted-foreground">Showing:</span> {filteredPalettes.length} of {palettes.length}
              </div>

              {/* Filters - Desktop */}
              <div className="hidden md:flex md:flex-wrap md:gap-2" role="group" aria-label="Filter palettes">
                <BrutalButton
                  variant={filterMode === 'all' ? 'primary' : 'outline'}
                  onClick={() => setFilterMode('all')}
                  className="w-full justify-center text-sm sm:w-auto"
                  aria-pressed={filterMode === 'all'}
                >
                  All ({palettes.length})
                </BrutalButton>
                <BrutalButton
                  variant={filterMode === 'favorites' ? 'secondary' : 'outline'}
                  onClick={() => setFilterMode('favorites')}
                  className="w-full justify-center text-sm sm:w-auto"
                  aria-pressed={filterMode === 'favorites'}
                >
                  <HugeiconsIcon icon={Heart} className={`h-4 w-4 mr-2 ${filterMode === 'favorites' ? 'fill-current' : ''}`} aria-hidden="true" />
                  Favorites ({favoriteCount})
                </BrutalButton>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Filter Buttons - Sticky Bottom */}
        <div className="sticky bottom-2 z-30 mt-4 border-3 border-black bg-background/95 p-2 shadow-brutal-sm backdrop-blur-sm md:hidden">
          <div className="grid grid-cols-2 gap-2" role="group" aria-label="Filter palettes">
            <BrutalButton
              variant={filterMode === 'all' ? 'primary' : 'outline'}
              onClick={() => setFilterMode('all')}
              className="w-full justify-center text-sm"
              aria-pressed={filterMode === 'all'}
            >
              All ({palettes.length})
            </BrutalButton>
            <BrutalButton
              variant={filterMode === 'favorites' ? 'secondary' : 'outline'}
              onClick={() => setFilterMode('favorites')}
              className="w-full justify-center text-sm"
              aria-pressed={filterMode === 'favorites'}
            >
              <HugeiconsIcon icon={Heart} className={`h-4 w-4 mr-2 ${filterMode === 'favorites' ? 'fill-current' : ''}`} aria-hidden="true" />
              Favorites ({favoriteCount})
            </BrutalButton>
          </div>
        </div>

        {/* Palettes Grid */}
        <section aria-label="Saved palettes">
        {isLoading ? (
          <div className="grid gap-6" role="status" aria-live="polite">
            <span className="sr-only">Loading palettes…</span>
            {[...Array(3)].map((_, i) => (
              <PaletteSkeleton key={i} />
            ))}
          </div>
        ) : filteredPalettes.length > 0 ? (
          <div className="grid gap-6">
            {filteredPalettes.map((palette) => (
              <PaletteDisplay
                key={palette.id}
                palette={palette}
                onToggleFavorite={handleToggleFavorite}
                onDelete={(id) => setDeleteTarget(id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12" role="status">
            <BrutalCard>
              <BrutalCardContent className="py-12">
                <HugeiconsIcon icon={Sparkles} className="h-16 w-16 mx-auto mb-4 opacity-30" aria-hidden="true" />
                <p className="text-lg font-bold text-muted-foreground">
                  {searchQuery || filterMode === 'favorites'
                    ? 'No palettes found'
                    : 'No palettes saved yet'}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  {searchQuery || filterMode === 'favorites'
                    ? 'Try adjusting your search or filters'
                    : 'Generate and save some palettes to see them here'}
                </p>
                {!searchQuery && filterMode === 'all' && (
                  <Link href="/">
                    <BrutalButton variant="primary" size="lg" className="mt-6">
                      <HugeiconsIcon icon={Sparkles} className="h-5 w-5 mr-2" aria-hidden="true" />
                      Create Your First Palette
                    </BrutalButton>
                  </Link>
                )}
              </BrutalCardContent>
            </BrutalCard>
          </div>
        )}
        </section>

        {deleteTarget ? (
          <div
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-2 pb-[max(env(safe-area-inset-bottom),0.5rem)] overscroll-contain sm:items-center sm:p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-palette-title"
            aria-describedby="delete-palette-description"
            onClick={() => {
              if (!isDeleting) {
                setDeleteTarget(null)
              }
            }}
          >
            <BrutalCard className="max-h-[88svh] w-full overflow-auto border-4 border-black shadow-brutal-xl sm:max-w-md" onClick={(e) => e.stopPropagation()}>
              <BrutalCardHeader>
                <BrutalCardTitle id="delete-palette-title" className="flex items-center gap-2 text-xl">
                  <HugeiconsIcon icon={Delete02Icon} className="h-5 w-5" aria-hidden="true" />
                  Delete Palette?
                </BrutalCardTitle>
              </BrutalCardHeader>
              <BrutalCardContent>
                <p id="delete-palette-description" className="mb-6 text-sm text-muted-foreground">
                  This action cannot be undone. This palette will be permanently deleted.
                </p>
                <div className="flex gap-3">
                  <BrutalButton variant="outline" onClick={() => setDeleteTarget(null)} disabled={isDeleting} className="flex-1">
                    Cancel
                  </BrutalButton>
                  <BrutalButton variant="primary" onClick={handleDelete} disabled={isDeleting} className="flex-1">
                    {isDeleting ? 'Deleting…' : 'Delete'}
                  </BrutalButton>
                </div>
              </BrutalCardContent>
            </BrutalCard>
          </div>
        ) : null}
        </main>
      </div>
    </div>
  )
}

export default function PalettesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background p-4 md:p-8">
          <div className="mx-auto max-w-7xl">
            <Navigation />
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em]" />
              <p className="mt-4 text-lg font-bold">Loading palettes…</p>
            </div>
          </div>
        </div>
      }
    >
      <PalettesPageContent />
    </Suspense>
  )
}
