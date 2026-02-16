'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowLeft, Login } from '@hugeicons/core-free-icons'
import { BrutalButton } from '@/components/ui/brutal-button'
import { BrutalCard, BrutalCardContent, BrutalCardHeader, BrutalCardTitle } from '@/components/ui/brutal-card'
import { BrutalInput } from '@/components/ui/brutal-input'
import { signInWithEmail } from './actions'

export default function SignInPage() {
  const [state, formAction, isPending] = useActionState(signInWithEmail, null)

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-8 md:px-8">
      <div className="pointer-events-none absolute -left-16 top-16 h-44 w-44 rotate-12 border-4 border-black bg-accent" />
      <div className="pointer-events-none absolute -right-12 bottom-12 h-56 w-56 -rotate-12 border-4 border-black bg-secondary" />
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
          <section className="border-3 border-black bg-primary p-6 text-primary-foreground shadow-brutal-xl">
            <p className="mb-2 text-sm font-bold uppercase tracking-wide">Neon Auth</p>
            <h1 className="text-4xl font-black leading-tight text-balance md:text-5xl">Sign In</h1>
            <p className="mt-4 max-w-md text-base font-medium md:text-lg">
              Save your generated palettes to your personal account and manage favorites across sessions.
            </p>
          </section>

          <BrutalCard className="relative z-10">
            <BrutalCardHeader>
              <BrutalCardTitle className="flex items-center gap-2">
                <HugeiconsIcon icon={Login} className="h-5 w-5" aria-hidden="true" />
                Welcome back
              </BrutalCardTitle>
            </BrutalCardHeader>
            <BrutalCardContent>
              <form action={formAction} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-bold">Email address</label>
                  <BrutalInput id="email" name="email" type="email" autoComplete="email" spellCheck={false} required placeholder="you@example.com…" className="h-12" />
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-bold">Password</label>
                  <BrutalInput id="password" name="password" type="password" autoComplete="current-password" required placeholder="Enter your password…" className="h-12" />
                </div>

                {state?.error ? (
                  <p className="border-3 border-black bg-destructive p-3 text-sm font-bold text-destructive-foreground shadow-brutal-sm">
                    {state.error}
                  </p>
                ) : null}

                <BrutalButton type="submit" size="lg" className="w-full" disabled={isPending}>
                  {isPending ? 'Signing in…' : 'Sign In'}
                </BrutalButton>
              </form>

              <p className="mt-5 text-sm font-bold">
                Need an account?{' '}
                <Link href="/auth/sign-up" className="underline underline-offset-2">
                  Create one
                </Link>
              </p>
            </BrutalCardContent>
          </BrutalCard>
        </div>
      </div>
    </main>
  )
}
