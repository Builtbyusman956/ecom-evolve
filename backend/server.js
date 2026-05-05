require('dotenv').config()
const express = require('express')
const cors    = require('cors')

const paymentsRouter = require('./routes/payments')

const app = express()

/* ── PORT — Railway sets this automatically, never hardcode ──
   Locally it falls back to 9090.
   On Railway: always use process.env.PORT               ── */
const PORT = process.env.PORT || 9090

/* ── ALLOWED ORIGINS ─────────────────────────────────────── */
const ALLOWED_ORIGINS = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  'http://localhost:4173',   // Vite preview
].filter(Boolean).map(o => o.trim().replace(/\/+$/, ''))

console.log('Allowed origins:', ALLOWED_ORIGINS)

/* ── CORS OPTIONS ─────────────────────────────────────────── */
const corsOptions = {
  origin(origin, callback) {
    // No origin = same-origin, curl, Postman — allow
    if (!origin) return callback(null, true)

    const trimmed = origin.trim().replace(/\/+$/, '')
    if (ALLOWED_ORIGINS.includes(trimmed)) return callback(null, true)

    // On Railway staging/preview branches, origin may vary — allow all
    // subdomains of vercel.app and railway.app for safety
    if (
      trimmed.endsWith('.vercel.app') ||
      trimmed.endsWith('.railway.app') ||
      trimmed.endsWith('.up.railway.app')
    ) {
      return callback(null, true)
    }

    console.warn('CORS blocked origin:', origin)
    callback(new Error('CORS blocked: ' + origin))
  },
  methods:      ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials:  true,
  optionsSuccessStatus: 200,
}

/* ── REGISTER CORS FIRST — before anything else ─────────── */
// This handles the browser's preflight OPTIONS request
app.options('*', cors(corsOptions))
app.use(cors(corsOptions))

/* ── Trust Railway's proxy ────────────────────────────────── */
app.set('trust proxy', 1)

/* ── Body parsers ─────────────────────────────────────────── */
// Webhook needs raw body for Flutterwave signature check
app.use(
  '/api/payments/webhook',
  express.raw({ type: '*/*' })
)
// All other routes get JSON
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

/* ── Routes ───────────────────────────────────────────────── */
app.use('/api/payments', paymentsRouter)

/* ── Health check — Railway pings this to confirm it's live ─ */
app.get('/',        (_req, res) => res.json({ ok: true, service: 'EcomEvolve API' }))
app.get('/health',  (_req, res) => res.json({
  ok:        true,
  timestamp: new Date().toISOString(),
  port:      PORT,
  origins:   ALLOWED_ORIGINS,
  env: {
    NODE_ENV:     process.env.NODE_ENV || 'development',
    FRONTEND_URL: process.env.FRONTEND_URL || 'not set',
    FLW_KEY_SET:  !!process.env.FLW_SECRET_KEY,
    RESEND_SET:   !!process.env.RESEND_API_KEY,
  },
}))

/* ── 404 ──────────────────────────────────────────────────── */
app.use((req, res) => {
  res.status(404).json({
    error:  'Route not found',
    method: req.method,
    path:   req.path,
  })
})

/* ── Global error handler ─────────────────────────────────── */
app.use((err, _req, res, _next) => {
  console.error('Server error:', err.message)
  if (err.message?.startsWith('CORS blocked')) {
    return res.status(403).json({ error: err.message })
  }
  res.status(500).json({ error: 'Internal server error' })
})

/* ── Start ────────────────────────────────────────────────── */
app.listen(PORT, '0.0.0.0', () => {
  console.log(`EcomEvolve backend running → port ${PORT}`)
  console.log(`Health: http://localhost:${PORT}/health`)
})