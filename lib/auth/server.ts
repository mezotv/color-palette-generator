import { createNeonAuth } from '@neondatabase/auth/next/server'

export const auth = createNeonAuth({
  baseUrl: process.env.NEON_AUTH_BASE_URL || 'https://example.com/neondb/auth',
  cookies: {
    secret:
      process.env.NEON_AUTH_COOKIE_SECRET ||
      'development-cookie-secret-change-me-before-production',
  },
})
