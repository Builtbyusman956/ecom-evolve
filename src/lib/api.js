/**
 * Central API configuration.
 * Import API_URL from here — never construct it inline.
 */

const raw = import.meta.env.VITE_API_URL ?? ''

// Strip whitespace and trailing slashes
const cleaned = raw.trim().replace(/\/+$/, '')

// If the env var is missing or looks wrong, fall back to localhost
function buildApiUrl(url) {
  if (!url) return 'http://localhost:9090'

  // Must start with http:// or https://
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    console.warn(
      '[EcomEvolve] VITE_API_URL does not start with http:// or https://\n' +
      `  Got: "${url}"\n` +
      '  Falling back to http://localhost:9090\n' +
      '  Fix: set VITE_API_URL=https://your-backend.railway.app in your .env file'
    )
    return 'http://localhost:9090'
  }

  return url
}

export const API_URL = buildApiUrl(cleaned)

// Log in dev so it's easy to confirm
if (import.meta.env.DEV) {
  console.log(`[EcomEvolve] API_URL = ${API_URL}`)
}