'use client'

import { Suspense, useState, useEffect } from 'react'
import Link from 'next/link'
import { useQueryState, parseAsString, parseAsArrayOf, parseAsStringEnum } from 'nuqs'
import { BrutalButton } from '@/components/ui/brutal-button'
import { BrutalInput } from '@/components/ui/brutal-input'
import { BrutalCard, BrutalCardContent, BrutalCardHeader, BrutalCardTitle } from '@/components/ui/brutal-card'
import { ColorSwatch } from '@/components/color-swatch'
import { Navigation } from '@/components/navigation'
import { generateColorHarmony, generateRandomPalette } from '@/lib/utils/color-harmony'
import { HugeiconsIcon } from '@hugeicons/react'
import { Palette, Refresh, Sparkles, Copy, Link, InformationCircleIcon } from '@hugeicons/core-free-icons'
import type { HarmonyType } from '@/lib/types/color'
import { authClient } from '@/lib/auth/client'
import { toast } from 'sonner'

const harmonyTypes = ['complementary', 'analogous', 'triadic', 'monochromatic', 'tetradic', 'split-complementary'] as const

function HomeContent() {
  const [baseColor, setBaseColor] = useQueryState('color', parseAsString.withDefault('#3b82f6'))
  const [harmonyType, setHarmonyType] = useQueryState(
    'harmony',
    parseAsStringEnum<HarmonyType>([...harmonyTypes]).withDefault('complementary')
  )
  const [generatedColors, setGeneratedColors] = useQueryState(
    'palette',
    parseAsArrayOf(parseAsString).withDefault([])
  )
  const [paletteName, setPaletteName] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAuthReady, setIsAuthReady] = useState(false)
  const [announcement, setAnnouncement] = useState('')

  const harmonyOptions: { value: HarmonyType; label: string; description: string }[] = [
    { value: 'complementary', label: 'Complementary', description: 'Two opposite colors' },
    { value: 'analogous', label: 'Analogous', description: 'Adjacent colors' },
    { value: 'triadic', label: 'Triadic', description: 'Three evenly spaced colors' },
    { value: 'monochromatic', label: 'Monochromatic', description: 'Shades of one color' },
    { value: 'tetradic', label: 'Tetradic', description: 'Four colors in pairs' },
    { value: 'split-complementary', label: 'Split Complementary', description: 'Base + two adjacent to complement' },
  ]

  const handleGenerate = () => {
    const colors = generateColorHarmony(baseColor, harmonyType)
    setGeneratedColors(colors)
    setAnnouncement(`Generated ${colors.length} colors using ${harmonyType} harmony`)
  }

  const handleRandomGenerate = () => {
    const colors = generateRandomPalette(harmonyType)
    setGeneratedColors(colors)
    setBaseColor(colors[0])
    setAnnouncement(`Generated random ${harmonyType} palette with ${colors.length} colors`)
  }

  const handleSavePalette = async () => {
    console.log('[v0] Save palette initiated')
    console.log('[v0] Generated colors:', generatedColors)
    console.log('[v0] Palette name:', paletteName)
    console.log('[v0] Is authenticated:', isAuthenticated)
    
    if (!generatedColors.length || !paletteName.trim()) {
      console.log('[v0] Validation failed: missing colors or name')
      return
    }

    if (!isAuthenticated) {
      console.log('[v0] Not authenticated, showing error')
      toast.error('Please sign in to save palettes.')
      return
    }

    setIsSaving(true)
    try {
      const payload = {
        name: paletteName,
        colors: generatedColors,
        harmonyType,
        isFavorite: false,
        tags: [],
      }
      console.log('[v0] Sending payload to API:', payload)
      
      const response = await fetch('/api/palettes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      console.log('[v0] API response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('[v0] Palette saved successfully:', data)
        setPaletteName('')
        toast.success('Palette saved successfully!')
      } else if (response.status === 401) {
        console.log('[v0] Authentication error')
        toast.error('Your session expired. Please sign in again.')
      } else {
        const errorData = await response.json().catch(() => ({}))
        console.error('[v0] Failed to save palette. Status:', response.status, 'Error:', errorData)
        toast.error('Failed to save palette')
      }
    } catch (error) {
      console.error('[v0] Error saving palette:', error)
      toast.error('Failed to save palette')
    } finally {
      setIsSaving(false)
    }
  }

  // Hotkey: Press space to regenerate palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only trigger if not in an input field
      if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault()
        const colors = generateRandomPalette(harmonyType)
        setGeneratedColors(colors)
        setBaseColor(colors[0])
        setAnnouncement(`Generated random ${harmonyType} palette with ${colors.length} colors`)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [harmonyType])

  useEffect(() => {
    let mounted = true

    async function loadSession() {
      const { data } = await authClient.getSession()

      if (!mounted) {
        return
      }

      setIsAuthenticated(Boolean(data?.session && data?.user))
      setIsAuthReady(true)
    }

    loadSession()

    return () => {
      mounted = false
    }
  }, [])

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {announcement}
      </div>
      <div className="max-w-7xl mx-auto">
        <Navigation />
        
        <main>
        {/* Header */}
        <header className="mb-8">
          <div className="bg-primary text-primary-foreground border-3 border-black shadow-brutal-xl p-4 sm:p-6">
            <div className="mb-2 flex items-center gap-3">
              <HugeiconsIcon icon={Palette} className="h-8 w-8" aria-hidden="true" />
              <h1 className="text-2xl font-bold text-balance sm:text-4xl">Color Palette Generator</h1>
            </div>
            <p className="text-base font-medium sm:text-lg">
              Generate beautiful color palettes using color theory
            </p>
          </div>
        </header>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Generator Controls */}
          <div className="lg:col-span-1">
            <BrutalCard>
              <BrutalCardHeader>
                <BrutalCardTitle>Generator Controls</BrutalCardTitle>
              </BrutalCardHeader>
              <BrutalCardContent className="space-y-4">
                {/* Base Color Picker */}
                <div>
                  <label htmlFor="base-color" className="block text-sm font-bold mb-2">Base Color</label>
                  <div className="flex gap-2 items-center">
                    <input
                      id="base-color"
                      name="baseColor"
                      type="color"
                      value={baseColor}
                      onChange={(e) => setBaseColor(e.target.value)}
                      className="h-12 w-12 border-3 border-black cursor-pointer shadow-brutal flex-shrink-0"
                    />
                    <BrutalInput
                      type="text"
                      name="baseColorHex"
                      autoComplete="off"
                      value={baseColor}
                      onChange={(e) => setBaseColor(e.target.value)}
                      placeholder="#000000"
                      className="flex-1 font-mono h-12"
                    />
                  </div>
                </div>

                {/* Harmony Type Selector */}
                <fieldset>
                  <legend className="block text-sm font-bold mb-2">Harmony Type</legend>
                  <div className="space-y-2" role="radiogroup" aria-label="Color harmony type">
                    {harmonyOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        role="radio"
                        aria-checked={harmonyType === option.value}
                        onClick={() => setHarmonyType(option.value)}
                        className={`w-full text-left p-3 border-3 border-black font-bold transition-[transform,box-shadow,background-color,color] ${
                          harmonyType === option.value
                            ? 'bg-accent text-accent-foreground shadow-brutal-sm translate-x-0.5 translate-y-0.5'
                            : 'bg-white hover:bg-gray-50 shadow-brutal hover:shadow-brutal-sm hover:translate-x-0.5 hover:translate-y-0.5'
                        }`}
                      >
                        <div className="font-bold">{option.label}</div>
                        <div className="text-xs mt-1 opacity-70">{option.description}</div>
                      </button>
                    ))}
                  </div>
                </fieldset>

                {/* Generate Buttons */}
                <div className="space-y-2 pt-2">
                  <BrutalButton
                    variant="primary"
                    size="lg"
                    onClick={handleGenerate}
                    className="w-full"
                  >
                    <HugeiconsIcon icon={Sparkles} className="h-5 w-5 mr-2"   aria-hidden="true" />
                    Generate Palette
                  </BrutalButton>
                  <BrutalButton
                    variant="secondary"
                    size="lg"
                    onClick={handleRandomGenerate}
                    className="w-full"
                  >
                    <HugeiconsIcon icon={Refresh} className="h-5 w-5 mr-2"   aria-hidden="true" />
                    Random Palette
                  </BrutalButton>
                </div>
              </BrutalCardContent>
            </BrutalCard>
          </div>

          {/* Generated Palette Display */}
          <div className="lg:col-span-2">
            <BrutalCard>
              <BrutalCardHeader>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <BrutalCardTitle>Generated Palette</BrutalCardTitle>
                  {generatedColors.length > 0 && (
                    <div className="flex gap-2">
                      <BrutalButton
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const link = window.location.href
                          navigator.clipboard.writeText(link)
                          toast.success('Link copied to clipboard!')
                        }}
                      >
                        <HugeiconsIcon icon={Link} className="h-4 w-4 sm:mr-2" aria-hidden="true" />
                        <span className="hidden sm:inline">Share</span>
                      </BrutalButton>
                      <BrutalButton
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(generatedColors.join(', '))
                          toast.success('All colors copied!')
                        }}
                      >
                        <HugeiconsIcon icon={Copy} className="h-4 w-4 sm:mr-2" aria-hidden="true" />
                        <span className="hidden sm:inline">Copy All</span>
                      </BrutalButton>
                    </div>
                  )}
                </div>
              </BrutalCardHeader>
              <BrutalCardContent>
                {generatedColors.length > 0 ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                      {generatedColors.map((color, index) => (
                        <ColorSwatch key={index} color={color} size="lg" />
                      ))}
                    </div>

                    {/* Save Palette Section */}
                     <div className="border-t-3 border-black pt-4 mt-4">
                        <label htmlFor="palette-name" className="block text-sm font-bold mb-2">Palette Name</label>
                        <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
                         <BrutalInput
                           id="palette-name"
                           name="paletteName"
                           type="text"
                           autoComplete="off"
                           value={paletteName}
                           onChange={(e) => setPaletteName(e.target.value)}
                           placeholder="Enter palette name…"
                           className="h-12 flex-1"
                         />
                          <BrutalButton
                            variant="success"
                            onClick={handleSavePalette}
                            disabled={!paletteName.trim() || isSaving || !isAuthenticated || !isAuthReady}
                            className="h-12 w-full sm:w-auto"
                          >
                            {isSaving ? 'Saving…' : 'Save Palette'}
                          </BrutalButton>
                       </div>
                       {!isAuthenticated && isAuthReady ? (
                         <p className="mt-2 text-sm font-bold">
                           Saving is available for signed-in users.{' '}
                           <Link href="/auth/sign-in" className="underline underline-offset-2">
                             Sign in here
                           </Link>
                           .
                         </p>
                       ) : null}
                     </div>
                   </div>
                 ) : (
                  <div className="text-center py-12">
                     <HugeiconsIcon icon={Palette} className="h-16 w-16 mx-auto mb-4 opacity-30" aria-hidden="true" />
                    <p className="text-lg font-bold text-muted-foreground">
                      Generate a palette to get started
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Choose a harmony type and click Generate Palette
                    </p>
                  </div>
                )}
              </BrutalCardContent>
            </BrutalCard>

            {/* Keyboard Shortcuts Info */}
            <div className="mt-6 bg-secondary text-white border-3 border-black shadow-brutal p-4">
              <div className="flex items-center gap-2 mb-3">
                <HugeiconsIcon icon={InformationCircleIcon} className="h-5 w-5" aria-hidden="true" />
                <h3 className="font-bold text-lg">Keyboard Shortcuts</h3>
              </div>
              <div className="space-y-2 text-sm font-medium">
                <div className="flex items-center justify-between">
                  <span>Generate random palette</span>
                  <kbd className="rounded border-2 border-white bg-white/20 px-2 py-1 font-mono text-xs font-bold">Space</kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span>Copy color from swatch</span>
                  <kbd className="rounded border-2 border-white bg-white/20 px-2 py-1 font-mono text-xs font-bold">Click</kbd>
                </div>
              </div>
            </div>

            {/* Color Theory Info */}
            <div className="mt-6 bg-accent text-accent-foreground border-3 border-black shadow-brutal p-4">
              <h3 className="font-bold text-lg mb-2 text-balance">Color Theory Tip</h3>
              <p className="text-sm font-medium">
                {harmonyType === 'complementary' && 'Complementary colors create high contrast and vibrant looks. Great for making elements stand out!'}
                {harmonyType === 'analogous' && 'Analogous colors sit next to each other on the color wheel, creating serene and comfortable designs.'}
                {harmonyType === 'triadic' && 'Triadic colors are evenly spaced around the color wheel, offering vibrant yet balanced palettes.'}
                {harmonyType === 'monochromatic' && 'Monochromatic schemes use variations of a single color, creating a cohesive and sophisticated look.'}
                {harmonyType === 'tetradic' && 'Tetradic schemes use two complementary pairs, offering rich and varied palettes with lots of possibilities.'}
                {harmonyType === 'split-complementary' && 'Split-complementary uses a base color and two adjacent to its complement, providing high contrast with less tension.'}
              </p>
            </div>
          </div>
        </div>
        </main>
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background p-4 md:p-8">
          <div className="mx-auto max-w-7xl">
            <Navigation />
            <div className="border-3 border-black bg-primary p-6 text-primary-foreground shadow-brutal-xl">
              <p className="text-lg font-bold">Loading palette generator…</p>
            </div>
          </div>
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  )
}
