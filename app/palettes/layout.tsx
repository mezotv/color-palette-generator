import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Palettes',
  description: 'View, organize, and manage your saved color palettes. Search through your collection and mark favorites.',
  openGraph: {
    title: 'My Palettes | Color Palette Generator',
    description: 'View, organize, and manage your saved color palettes.',
  },
}

export default function PalettesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
