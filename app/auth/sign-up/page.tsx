'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowLeft, UserAddIcon } from '@hugeicons/core-free-icons'
import { BrutalButton } from '@/components/ui/brutal-button'
import { BrutalCard, BrutalCardContent, BrutalCardHeader, BrutalCardTitle } from '@/components/ui/brutal-card'
import { BrutalInput } from '@/components/ui/brutal-input'
import { signUpWithEmail } from './actions'

export default function SignUpPage() {
  const [state, formAction, isPending] = useActionState(signUpWithEmail, null)

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-8 md:px-8">
      <div className="pointer-events-none absolute left-6 top-14 h-36 w-36 -rotate-12 border-4 border-black bg-success" />
      <div className="pointer-events-none absolute right-10 bottom-10 h-44 w-44 rotate-6 border-4 border-black bg-accent" />
      <div className="absolute inset-x-0 top-4 z-20 px-4 md:top-8 md:px-8">
        <div className="mx-auto w-full max-w-5xl">
          <Link href="/" className="inline-block">
            <BrutalButton variant="outline" size="sm" className="bg-white">
              <HugeiconsIcon icon={ArrowLeft} className="mr-2 h-4 w-4" aria-hidden="true" />
              Back to Generator
            </BrutalButton>
          </Link>
        </div>
      </div>

      <div className="mx-auto w-full max-w-5xl">
        <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
          <section className="border-3 border-black bg-secondary p-6 text-white shadow-brutal-xl">
            <p className="mb-2 text-sm font-bold uppercase tracking-wide">Neon Auth</p>
            <h1 className="text-4xl font-black leading-tight text-balance md:text-5xl">Create Account</h1>
            <p className="mt-4 max-w-md text-base font-medium md:text-lg">
              Register once and keep every palette tied to your own account.
            </p>
          </section>

          <BrutalCard className="relative z-10">
            <BrutalCardHeader>
              <BrutalCardTitle className="flex items-center gap-2">
                <HugeiconsIcon icon={UserAddIcon} className="h-5 w-5" aria-hidden="true" />
                Join the palette lab
              </BrutalCardTitle>
            </BrutalCardHeader>
            <BrutalCardContent>
              <form action={formAction} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-bold">Name</label>
                  <BrutalInput id="name" name="name" type="text" autoComplete="name" required placeholder="Alex Palette…" className="h-12" />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-bold">Email address</label>
                  <BrutalInput id="email" name="email" type="email" autoComplete="email" spellCheck={false} required placeholder="you@example.com…" className="h-12" />
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-bold">Password</label>
                  <BrutalInput id="password" name="password" type="password" autoComplete="new-password" required placeholder="At least 8 characters…" className="h-12" />
                </div>

                {state?.error ? (
                  <p className="border-3 border-black bg-destructive p-3 text-sm font-bold text-destructive-foreground shadow-brutal-sm">
                    {state.error}
                  </p>
                ) : null}

                <BrutalButton type="submit" variant="success" size="lg" className="w-full" disabled={isPending}>
                  {isPending ? 'Creating account…' : 'Create Account'}
                </BrutalButton>
              </form>

              <p className="mt-5 text-sm font-bold">
                Already registered?{' '}
                <Link href="/auth/sign-in" className="underline underline-offset-2">
                  Sign in
                </Link>
              </p>
            </BrutalCardContent>
          </BrutalCard>
        </div>
      </div>
    </main>
  )
}
