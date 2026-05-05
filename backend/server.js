require('dotenv').config()
const express = require('express')
const cors    = require('cors')

const paymentsRouter = require('./routes/payments')

const app  = express()
const PORT = process.env.PORT || 9090

/* ── CORS ────────────────────────────────────────────────────
   Must be registered BEFORE all routes so preflight OPTIONS
   requests get a 200 instead of falling through to 404/405.
──────────────────────────────────────────────────────────── */
const ALLOWED_ORIGINS = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
].filter(Boolean).map(o => o.trim())   // trim() kills accidental spaces

const corsOptions = {
  origin(origin, callback) {
    // Allow requests with no origin (curl, Postman, mobile apps)
    if (!origin) return callback(null, true)
    if (ALLOWED_ORIGINS.includes(origin.trim())) return callback(null, true)
    console.warn(`CORS blocked: ${origin}`)
    callback(new Error(`CORS blocked: ${origin}`))
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200,   // some browsers (IE11) choke on 204
}

// Handle ALL preflight OPTIONS requests globally — must be first
app.options('*', cors(corsOptions))

// Apply CORS to every subsequent request
app.use(cors(corsOptions))

/* ── Body parsers ────────────────────────────────────────── */
// Webhook must receive raw body for signature verification
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }))

// Everything else gets JSON parsing
app.use(express.json())

/* ── Routes ──────────────────────────────────────────────── */
app.use('/api/payments', paymentsRouter)

/* ── Health check ────────────────────────────────────────── */
app.get('/health', (req, res) => {
  res.json({
    status:    'ok',
    timestamp: new Date().toISOString(),
    port:      PORT,
    origins:   ALLOWED_ORIGINS,
  })
})

/* ── 404 fallback ────────────────────────────────────────── */
app.use((req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.path}` })
})

/* ── Global error handler ────────────────────────────────── */
app.use((err, req, res, next) => {
  console.error('Server error:', err.message)
  if (err.message.startsWith('CORS blocked')) {
    return res.status(403).json({ error: err.message })
  }
  res.status(500).json({ error: 'Internal server error' })
})

/* ── Start ───────────────────────────────────────────────── */
app.listen(PORT, '0.0.0.0', () => {
  console.log(`EcomEvolve backend running on port ${PORT}`)
  console.log(`Health check: http://localhost:${PORT}/health`)
  console.log(`Allowed origins: ${ALLOWED_ORIGINS.join(', ')}`)
})