/**
 * EcomEvolve — API base URL
 *
 * Rules for VITE_API_URL in your .env / Vercel dashboard:
 *   VITE_API_URL=https://ecom-evolve-production.up.railway.app
 *
 *   No trailing slash
 *   No spaces
 *   Must include https://
 */

function resolveApiUrl() {
  const env = import.meta.env.VITE_API_URL

  // Not set at all
  if (!env || typeof env !== 'string') {
    console.warn('[API] VITE_API_URL is not set. Using http://localhost:9090')
    return 'http://localhost:9090'
  }

  // Clean it
  const url = env.trim().replace(/\/+$/, '')

  // Missing protocol — most common mistake
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    console.error(
      `[API] VITE_API_URL is missing the protocol.\n` +
      `  Got:      "${url}"\n` +
      `  Expected: "https://${url}"\n` +
      `  Fix your .env or Vercel env var.`
    )
    // Auto-fix it rather than breaking the app
    return `https://${url}`
  }

  return url
}

export const API_URL = resolveApiUrl()

// Always log so it's visible in browser DevTools console
console.log(`[EcomEvolve] API →`, API_URL)