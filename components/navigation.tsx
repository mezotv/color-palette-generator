import Link from 'next/link'
import { HugeiconsIcon } from '@hugeicons/react'
import { Sparkles, Library } from '@hugeicons/core-free-icons'
import { BrutalButton } from './ui/brutal-button'
import { AuthUserControls } from './auth-user-controls'

export function Navigation() {
  return (
    <nav className="mb-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2 md:flex md:w-auto md:flex-wrap md:gap-3">
          <Link href="/">
            <BrutalButton variant="primary" className="w-full sm:w-auto">
              <HugeiconsIcon icon={Sparkles} className="h-4 w-4 mr-2"   aria-hidden="true" />
              Generator
            </BrutalButton>
          </Link>
          <Link href="/palettes">
            <BrutalButton variant="secondary" className="w-full sm:w-auto">
              <HugeiconsIcon icon={Library} className="h-4 w-4 mr-2"   aria-hidden="true" />
              My Palettes
            </BrutalButton>
          </Link>
        </div>
        <AuthUserControls />
      </div>
    </nav>
  )
}
