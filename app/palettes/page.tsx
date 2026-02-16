'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import { useQueryState, parseAsString, parseAsStringEnum } from 'nuqs'
import { BrutalButton } from '@/components/ui/brutal-button'
import { BrutalInput } from '@/components/ui/brutal-input'
import { BrutalCard, BrutalCardContent, BrutalCardHeader, BrutalCardTitle } from '@/components/ui/brutal-card'
import { PaletteDisplay } from '@/components/palette-display'
import { HugeiconsIcon } from '@hugeicons/react'
import { Search, Heart, Sparkles, Delete02Icon, Cancel01Icon } from '@hugeicons/core-free-icons'
import Link from 'next/link'
import type { Palette } from '@/lib/types/color'
import { Navigation } from '@/components/navigation'
import { toast } from 'sonner'

function PalettesPageContent() {
  const [palettes, setPalettes] = useState<Palette[]>([])
  const [searchQuery, setSearchQuery] = useQueryState(
    'q',
    parseAsString.withDefault('')
  )
  const [filterMode, setFilterMode] = useQueryState(
    'filter',
    parseAsStringEnum(['all', 'favorites']).withDefault('all')
  )
  const [isLoading, setIsLoading] = useState(true)
  const [pendingFavoriteIds, setPendingFavoriteIds] = useState<Set<number>>(new Set())
  const [deleteTarget, setDeleteTarget] = useState<Palette | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    fetchPalettes()
  }, [])

  useEffect(() => {
    if (!deleteTarget) {
      return
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isDeleting) {
        setDeleteTarget(null)
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [deleteTarget, isDeleting])

  const fetchPalettes = async () => {
    try {
      const response = await fetch('/api/palettes')

      if (response.status === 401) {
        window.location.href = '/auth/sign-in'
        return
      }

      const data = await response.json()
      
      // Ensure data is an array
      if (Array.isArray(data)) {
        setPalettes(data)
      } else {
        console.error('[v0] Invalid data format:', data)
        setPalettes([])
      }
    } catch (error) {
      console.error('[v0] Error fetching palettes:', error)
      setPalettes([])
    } finally {
      setIsLoading(false)
    }
  }

  const filteredPalettes = useMemo(() => {
    if (!Array.isArray(palettes)) {
      return []
    }

    const normalizedQuery = searchQuery.trim().toLowerCase()

    return palettes.filter((palette) => {
      if (filterMode === 'favorites' && !palette.isFavorite) {
        return false
      }

      if (!normalizedQuery) {
        return true
      }

      const matchesName = palette.name.toLowerCase().includes(normalizedQuery)
      const matchesTag = palette.tags?.some((tag) => tag.toLowerCase().includes(normalizedQuery))
      return matchesName || Boolean(matchesTag)
    })
  }, [palettes, searchQuery, filterMode])

  const favoriteCount = useMemo(
    () => palettes.filter((palette) => palette.isFavorite).length,
    [palettes]
  )

  const handleToggleFavorite = async (id: number) => {
    if (pendingFavoriteIds.has(id)) {
      return
    }

    const palette = palettes.find((p) => p.id === id)
    if (!palette) return

    const nextIsFavorite = !palette.isFavorite

    setPendingFavoriteIds((prev) => {
      const next = new Set(prev)
      next.add(id)
      return next
    })

    setPalettes((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isFavorite: nextIsFavorite } : p))
    )

    try {
      const response = await fetch(`/api/palettes/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFavorite: nextIsFavorite }),
      })

      if (!response.ok) {
        setPalettes((prev) =>
          prev.map((p) => (p.id === id ? { ...p, isFavorite: palette.isFavorite } : p))
        )
        toast.error('Could not update favorite right now.')
      } else {
        toast.success(nextIsFavorite ? 'Added to favorites.' : 'Removed from favorites.')
      }
    } catch (error) {
      console.error('[v0] Error toggling favorite:', error)
      setPalettes((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isFavorite: palette.isFavorite } : p))
      )
      toast.error('Could not update favorite right now.')
    } finally {
      setPendingFavoriteIds((prev) => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    }
  }

  const handleDelete = (id: number) => {
    const palette = palettes.find((p) => p.id === id)
    if (!palette) return
    setDeleteTarget(palette)
  }

  const confirmDelete = async () => {
    if (!deleteTarget?.id || isDeleting) {
      return
    }

    const id = deleteTarget.id
    setIsDeleting(true)

    try {
      const response = await fetch(`/api/palettes/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setPalettes((prev) => prev.filter((p) => p.id !== id))
        toast.success('Palette deleted.')
        setDeleteTarget(null)
      } else {
        toast.error('Could not delete palette right now.')
      }
    } catch (error) {
      console.error('[v0] Error deleting palette:', error)
      toast.error('Could not delete palette right now.')
    } finally {
      setIsDeleting(false)
    }
  }



  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <Navigation />

        {/* Header */}
        <header className="mb-8">
          <div className="bg-secondary text-white border-3 border-black shadow-brutal-xl p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-2">
              <HugeiconsIcon icon={Sparkles} className="h-8 w-8" aria-hidden="true" />
              <h1 className="text-2xl font-bold text-balance sm:text-4xl">My Palettes</h1>
            </div>
            <p className="text-base font-medium sm:text-lg">
              Manage your saved color palettes
            </p>
          </div>
        </header>

        {/* Controls */}
        <div className="mb-6">
          <BrutalCard>
            <BrutalCardContent className="p-4">
              <div className="flex flex-col gap-4 md:flex-row">
                {/* Search */}
                <div className="flex-1">
                  <label htmlFor="palette-search" className="sr-only">Search palettes</label>
                  <div className="relative">
                    <HugeiconsIcon icon={Search} className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" aria-hidden="true" />
                    <BrutalInput
                      id="palette-search"
                      type="text"
                      name="palette-search"
                      autoComplete="off"
                      placeholder="Search palettes by name or tags…"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Filter Buttons */}
                <div className="hidden md:flex md:flex-wrap md:gap-2">
                  <BrutalButton
                    variant={filterMode === 'all' ? 'primary' : 'outline'}
                    onClick={() => setFilterMode('all')}
                    className="w-full justify-center text-sm sm:w-auto"
                  >
                    All ({palettes.length})
                  </BrutalButton>
                  <BrutalButton
                    variant={filterMode === 'favorites' ? 'secondary' : 'outline'}
                    onClick={() => setFilterMode('favorites')}
                    className="w-full justify-center text-sm sm:w-auto"
                  >
                    <HugeiconsIcon icon={Heart} className={`h-4 w-4 mr-2 ${filterMode === 'favorites' ? 'fill-current' : ''}`} aria-hidden="true" />
                    Favorites ({favoriteCount})
                  </BrutalButton>
                </div>
              </div>
            </BrutalCardContent>
          </BrutalCard>
        </div>

        <div className="sticky bottom-2 z-30 mt-4 border-3 border-black bg-background/95 p-2 shadow-brutal-sm backdrop-blur-sm md:hidden">
          <div className="grid grid-cols-2 gap-2">
            <BrutalButton
              variant={filterMode === 'all' ? 'primary' : 'outline'}
              onClick={() => setFilterMode('all')}
              className="w-full justify-center text-sm"
            >
              All ({palettes.length})
            </BrutalButton>
            <BrutalButton
              variant={filterMode === 'favorites' ? 'secondary' : 'outline'}
              onClick={() => setFilterMode('favorites')}
              className="w-full justify-center text-sm"
            >
              <HugeiconsIcon icon={Heart} className={`h-4 w-4 mr-2 ${filterMode === 'favorites' ? 'fill-current' : ''}`} aria-hidden="true" />
              Favorites ({favoriteCount})
            </BrutalButton>
          </div>
        </div>

        {/* Palettes Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <p className="mt-4 text-lg font-bold">Loading palettes…</p>
          </div>
        ) : filteredPalettes.length > 0 ? (
          <div className="grid gap-6">
            {filteredPalettes.map((palette) => (
              <PaletteDisplay
                key={palette.id}
                palette={palette}
                onToggleFavorite={handleToggleFavorite}
                onDelete={handleDelete}
                isFavoritePending={palette.id ? pendingFavoriteIds.has(palette.id) : false}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
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
      </div>

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
            <BrutalCardContent className="space-y-5">
              <div id="delete-palette-description" className="border-3 border-black bg-accent p-3 font-bold">
                This will permanently delete <span className="underline">{deleteTarget.name}</span>.
              </div>
              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end">
                <BrutalButton
                  variant="outline"
                  onClick={() => setDeleteTarget(null)}
                  disabled={isDeleting}
                  className="w-full sm:w-auto"
                >
                  <HugeiconsIcon icon={Cancel01Icon} className="mr-2 h-4 w-4" aria-hidden="true" />
                  Cancel
                </BrutalButton>
                <BrutalButton variant="destructive" onClick={confirmDelete} disabled={isDeleting} className="w-full sm:w-auto">
                  <HugeiconsIcon icon={Delete02Icon} className="mr-2 h-4 w-4" aria-hidden="true" />
                  {isDeleting ? 'Deleting…' : 'Delete'}
                </BrutalButton>
              </div>
            </BrutalCardContent>
          </BrutalCard>
        </div>
      ) : null}
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
