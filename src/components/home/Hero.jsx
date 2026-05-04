import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiArrowRight } from 'react-icons/hi'
import { TbTrendingUp, TbShoppingCart, TbStar, TbShieldCheck } from 'react-icons/tb'

/* ─── animation presets ────────────────────────────── */
const up = (d = 0) => ({
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.65, delay: d, ease: [0.22, 1, 0.36, 1] } },
})
const right = (d = 0) => ({
  hidden: { opacity: 0, x: 36 },
  show:   { opacity: 1, x: 0, transition: { duration: 0.75, delay: d, ease: [0.22, 1, 0.36, 1] } },
})

/* ═══════════════════════════════════════════════════
   CHART — always strictly increasing, no hang
═══════════════════════════════════════════════════ */
const MONTHS = ['J','F','M','A','M','J','J','A','S','O','N','D']

/**
 * Generate 12 data points that ALWAYS go up.
 * seed shifts the noise but the trend is locked upward.
 */
function genUptrend(seed = 0) {
  const points = []
  let val = 12 + (seed % 7)                       // start low
  for (let i = 0; i < 12; i++) {
    const step = 5.5 + (seed % 3)                  // base step up per month
    const jitter = Math.sin(seed * 1.3 + i) * 2.5  // tiny noise, never enough to go down
    val += step + Math.abs(jitter)                  // abs() ensures we never subtract
    points.push(Math.min(val, 100))
  }
  return points
}

/* Build smooth SVG cubic bezier path from data */
function buildPath(data, W, H, pad = 16) {
  const uw = W - pad * 2
  const uh = H - pad * 2
  const mn = data[0]                               // first point is lowest (always increasing)
  const mx = data[data.length - 1]
  const range = mx - mn || 1

  const coords = data.map((v, i) => ({
    x: pad + (i / (data.length - 1)) * uw,
    y: pad + uh - ((v - mn) / range) * uh,
  }))

  let d = `M ${coords[0].x.toFixed(1)} ${coords[0].y.toFixed(1)}`
  for (let i = 1; i < coords.length; i++) {
    const cp1x = (coords[i - 1].x + coords[i].x) / 2
    d += ` C ${cp1x.toFixed(1)} ${coords[i-1].y.toFixed(1)} ${cp1x.toFixed(1)} ${coords[i].y.toFixed(1)} ${coords[i].x.toFixed(1)} ${coords[i].y.toFixed(1)}`
  }
  return { path: d, coords }
}

function buildArea(data, W, H, pad = 16) {
  const { path, coords } = buildPath(data, W, H, pad)
  const lastX = coords[coords.length - 1].x
  const firstX = coords[0].x
  const bottom = H - pad + 3
  return `${path} L ${lastX.toFixed(1)} ${bottom} L ${firstX.toFixed(1)} ${bottom} Z`
}

/* ── Pure SVG chart — re-animates on every data update ── */
function LiveChart({ data }) {
  const W = 320, H = 110, pad = 16
  const { path: linePath, coords } = buildPath(data, W, H, pad)
  const area = buildArea(data, W, H, pad)
  const lastPt = coords[coords.length - 1]

  // Force re-mount the path element on every data change to re-trigger CSS animation
  const [pathKey, setPathKey] = useState(0)
  useEffect(() => { setPathKey(k => k + 1) }, [data])

  return (
    <svg
      width="100%" viewBox={`0 0 ${W} ${H}`}
      style={{ display: 'block', overflow: 'visible' }}
    >
      <defs>
        <linearGradient id="cg-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#6C47FF" stopOpacity="0.20" />
          <stop offset="100%" stopColor="#6C47FF" stopOpacity="0.00" />
        </linearGradient>
        <linearGradient id="cg-line" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#4C2ECC" />
          <stop offset="55%"  stopColor="#6C47FF" />
          <stop offset="100%" stopColor="#2563EB" />
        </linearGradient>
        <filter id="cg-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Subtle grid lines */}
      {[0.3, 0.6].map((t, i) => (
        <line key={i}
          x1={pad} y1={H * t} x2={W - pad} y2={H * t}
          stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="3 5"
        />
      ))}

      {/* Area */}
      <path d={area} fill="url(#cg-area)" />

      {/* Line — key change forces re-mount, re-triggering CSS animation */}
      <path
        key={pathKey}
        d={linePath}
        fill="none"
        stroke="url(#cg-line)"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#cg-glow)"
        style={{
          strokeDasharray: 1200,
          strokeDashoffset: 0,
          animation: 'dash-in 1.2s ease forwards',
        }}
      />

      {/* Dots — every other month, no motion */}
      {coords.filter((_, i) => i % 2 === 0).map((pt, i) => (
        <circle key={i} cx={pt.x} cy={pt.y} r={2.5}
          fill="rgba(108,71,255,0.55)" />
      ))}

      {/* Last dot — highlighted, pulsing via CSS */}
      <circle
        cx={lastPt.x} cy={lastPt.y} r={5}
        fill="#6C47FF" stroke="rgba(255,255,255,0.15)" strokeWidth="2"
        filter="url(#cg-glow)"
        style={{ animation: 'pulse-last 2s ease-in-out infinite' }}
      />

      <style>{`
        @keyframes dash-in {
          from { stroke-dashoffset: 1200; }
          to   { stroke-dashoffset: 0; }
        }
        @keyframes pulse-last {
          0%,100% { r: 5; opacity: 1; }
          50%      { r: 6.5; opacity: 0.75; }
        }
      `}</style>
    </svg>
  )
}

/* ── Pure CSS bar chart — no motion.div, zero re-mounts ── */
function BarRow({ data }) {
  const max = data[data.length - 1]  // last bar is always tallest (always increasing)
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 40 }}>
      {data.map((v, i) => {
        const pct = (v / max) * 100
        const isLast = i === data.length - 1
        return (
          <div key={i} style={{
            flex: 1,
            height: `${Math.max(pct, 8)}%`,
            borderRadius: '3px 3px 1px 1px',
            background: isLast
              ? 'linear-gradient(180deg, #8B6FFF 0%, #6C47FF 100%)'
              : `rgba(108,71,255,${0.12 + (pct / 100) * 0.32})`,
            boxShadow: isLast ? '0 0 8px rgba(108,71,255,0.45)' : 'none',
            transition: 'height 0.6s ease',     /* smooth when data updates */
          }} />
        )
      })}
    </div>
  )
}

/* ── Dashboard — self-updating, no per-tick re-mounts ── */
function Dashboard() {
  const [seed,   setSeed]   = useState(0)
  const [data,   setData]   = useState(() => genUptrend(0))
  const [rev,    setRev]    = useState(128_400)
  const [orders, setOrders] = useState(3_241)
  const [roas,   setRoas]   = useState(4.2)
  const [yoy,    setYoy]    = useState(186)

  useEffect(() => {
    const id = setInterval(() => {
      setSeed(s => {
        const ns = s + 1
        setData(genUptrend(ns))         // always increasing new dataset
        return ns
      })
      setRev(v    => v + Math.round(800  + Math.random() * 1200))   // always up
      setOrders(v => v + Math.round(8    + Math.random() * 20))      // always up
      setRoas(v   => parseFloat(Math.min(8, v + Math.random() * 0.2).toFixed(1))) // slowly up
      setYoy(v    => v + Math.round(Math.random() * 3))              // always up
    }, 3000)
    return () => clearInterval(id)
  }, [])

  const fmt = v => `$${(v / 1000).toFixed(1)}k`

  return (
    <div style={{
      background: '#181926',
      borderRadius: 18,
      border: '1px solid rgba(108,71,255,0.18)',
      boxShadow: '0 4px 24px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.04)',
      overflow: 'hidden',
    }}>

      {/* ── Header row ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 20px 12px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--snow-muted)', marginBottom: 4 }}>
            EcomEvolve · Revenue
          </p>
          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.3rem', color: 'var(--snow)', letterSpacing: '-0.02em' }}>
            {fmt(rev)}
          </p>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '5px 11px', borderRadius: 100,
          background: 'var(--green-muted)', border: '1px solid var(--green-border)',
          fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--green)',
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', animation: 'pulseV 2s ease-in-out infinite' }} />
          +{yoy}% YoY
        </div>
      </div>

      {/* ── Line chart ── */}
      <div style={{ padding: '12px 16px 4px' }}>
        <LiveChart data={data} />
      </div>

      {/* ── Month labels — FIXED: use index as key to avoid duplicates ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 20px 10px' }}>
        {MONTHS.filter((_, i) => i % 2 === 0).map((m, i) => (
          <span key={i} style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--snow-muted)' }}>{m}</span>
        ))}
      </div>

      {/* ── Bar chart row ── */}
      <div style={{ padding: '0 20px 12px' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 8, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--snow-muted)', marginBottom: 7 }}>
          Orders / Month
        </p>
        <BarRow data={data} />
      </div>

      {/* ── Stats row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        {[
          { label: 'Orders', value: orders.toLocaleString() },
          { label: 'AOV',    value: '$43.2',      up: '+8%' },
          { label: 'ROAS',   value: `${roas}×`,   up: '+0.2' },
        ].map(({ label, value, up: u }, i) => (
          <div key={label} style={{
            padding: '10px 12px', textAlign: 'center',
            borderRight: i < 2 ? '1px solid rgba(255,255,255,0.06)' : 'none',
          }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 8, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--snow-muted)', marginBottom: 4 }}>{label}</p>
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem', color: 'var(--snow)' }}>{value}</p>
            {u && <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--green)', marginTop: 2 }}>↑ {u}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Floating toast (enter once, stays) ── */
function Toast({ icon: Icon, title, sub, accent, delay, pos }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: 'absolute', ...pos,
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '9px 13px', borderRadius: 12,
        background: '#181926',
        border: '1px solid rgba(255,255,255,0.09)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.50)',
        minWidth: 190, zIndex: 10,
      }}
    >
      <div style={{ width: 28, height: 28, borderRadius: 8, flexShrink: 0, background: `${accent}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={13} color={accent} />
      </div>
      <div>
        <p style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 12, color: 'var(--snow)' }}>{title}</p>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--snow-muted)' }}>{sub}</p>
      </div>
    </motion.div>
  )
}

/* ── Ticker strip ── */
const TICKS = [
  '50+ Stores Built','★ 5.0 Rating','USA · Canada · Australia · Europe',
  'First Sales in 14 Days','Full-Service Team','Shopify Experts',
  '50+ Stores Built','★ 5.0 Rating','USA · Canada · Australia · Europe',
  'First Sales in 14 Days','Full-Service Team','Shopify Experts',
]

function Ticker() {
  return (
    <div style={{ overflow: 'hidden', borderTop: '1px solid rgba(255,255,255,0.05)', padding: '11px 0' }}>
      <div style={{ display: 'flex', gap: 44, whiteSpace: 'nowrap', width: 'max-content', animation: 'ticker 26s linear infinite' }}>
        {TICKS.map((t, i) => (
          <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--snow-muted)' }}>
            <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--violet)', flexShrink: 0 }} />
            {t}
          </span>
        ))}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   HERO — MAIN EXPORT
═══════════════════════════════════════════════════ */
export default function Hero() {
  const [ready, setReady] = useState(false)
  useEffect(() => { const t = setTimeout(() => setReady(true), 40); return () => clearTimeout(t) }, [])

  return (
    <section style={{ background: 'var(--bg)', position: 'relative', overflow: 'hidden' }}>

      {/* Background: dot grid + single glow — pure CSS, zero JS */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(rgba(255,255,255,0.032) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
      }} />
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 55% 60% at 68% 40%, rgba(108,71,255,0.10) 0%, transparent 62%)',
      }} />

      {/* ── Content — 100vh, flex centered ── */}
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 1.5rem 40px', width: '100%' }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* ── LEFT: Copy ── */}
            <div>

              {/* Eyebrow */}
              <motion.div variants={up(0.05)} initial="hidden" animate={ready ? 'show' : 'hidden'} style={{ marginBottom: 20 }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 7,
                  fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.20em', textTransform: 'uppercase',
                  padding: '6px 14px', borderRadius: 100,
                  background: 'var(--violet-muted)', border: '1px solid var(--violet-border)',
                  color: 'var(--violet)',
                }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--violet)', animation: 'pulseV 2s ease-in-out infinite' }} />
                  Shopify Growth Partners
                </span>
              </motion.div>

              {/* Headline */}
              <motion.h1 variants={up(0.13)} initial="hidden" animate={ready ? 'show' : 'hidden'}
                style={{
                  fontFamily: 'var(--font-display)', fontWeight: 800,
                  fontSize: 'clamp(2.4rem, 4.8vw, 4.2rem)',
                  lineHeight: 1.07, letterSpacing: '-0.02em',
                  color: 'var(--snow)', marginBottom: 20,
                }}>
                Launch. Scale.{' '}
                <span className="text-brand-grad">Dominate</span>
                <br />Your Market.
              </motion.h1>

              {/* Sub-copy */}
              <motion.p variants={up(0.21)} initial="hidden" animate={ready ? 'show' : 'hidden'}
                style={{
                  fontFamily: 'var(--font-body)', fontSize: '1.05rem',
                  lineHeight: 1.72, color: 'var(--snow-dim)',
                  maxWidth: 420, marginBottom: 30,
                }}>
                We build, optimize, and scale Shopify stores for entrepreneurs in the US,
                Canada, Australia & Europe  from first product to first $100k month.
              </motion.p>

              {/* CTAs */}
              <motion.div variants={up(0.29)} initial="hidden" animate={ready ? 'show' : 'hidden'}
                style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 36 }}>
                <Link to="/book-a-call"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 14,
                    padding: '12px 26px', borderRadius: 100,
                    background: 'var(--brand-grad)', color: '#fff',
                    boxShadow: '0 6px 24px rgba(108,71,255,0.40)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)'; e.currentTarget.style.boxShadow = '0 10px 32px rgba(108,71,255,0.52)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)';    e.currentTarget.style.boxShadow = '0 6px 24px rgba(108,71,255,0.40)' }}
                >
                  Start My Store <HiArrowRight size={15} />
                </Link>

                <Link to="/#packages"
                  style={{
                    display: 'inline-flex', alignItems: 'center',
                    fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14,
                    padding: '11px 22px', borderRadius: 100,
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: 'var(--snow-dim)',
                    transition: 'border-color 0.2s, color 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--violet-border)'; e.currentTarget.style.color = 'var(--violet-bright)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = 'var(--snow-dim)' }}
                >
                  View Packages
                </Link>
              </motion.div>

              {/* Social proof */}
              <motion.div variants={up(0.37)} initial="hidden" animate={ready ? 'show' : 'hidden'}
                style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 18 }}>
                {/* Avatars */}
                <div style={{ display: 'flex' }}>
                  {['#6C47FF','#2563EB','#10B981','#F59E0B','#EF4444'].map((c, i) => (
                    <div key={i} style={{
                      width: 28, height: 28, borderRadius: '50%',
                      background: c, border: '2px solid var(--bg)',
                      marginLeft: i === 0 ? 0 : -8, zIndex: 5 - i,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 10, color: '#fff',
                    }}>
                      {['J','M','S','R','K'][i]}
                    </div>
                  ))}
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 2, marginBottom: 2 }}>
                    {[...Array(5)].map((_, i) => (
                      <TbStar key={i} size={12} color="#F59E0B" fill="#F59E0B" style={{ fill: '#F59E0B' }} />
                    ))}
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--snow-muted)', marginLeft: 5 }}>5.0</span>
                  </div>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--snow-muted)' }}>
                    Trusted by 50+ entrepreneurs
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <TbShieldCheck size={14} color="var(--violet-bright)" />
                  <span style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: 12, color: 'var(--snow-muted)' }}>
                    Shopify Certified
                  </span>
                </div>
              </motion.div>
            </div>

            {/* ── RIGHT: Dashboard ── */}
            <motion.div variants={right(0.25)} initial="hidden" animate={ready ? 'show' : 'hidden'}
              style={{ position: 'relative', paddingTop: 20, paddingBottom: 20 }}>

              <Dashboard />

              {/* Floating toasts — animate in once, never re-render */}
              <Toast
                icon={TbShoppingCart} title="New Order — $127" sub="Austin, TX · just now"
                accent="#6C47FF" delay={1.3}
                pos={{ top: -14, right: 0 }}
              />
              <Toast
                icon={TbTrendingUp} title="Monthly Goal Reached 🎯" sub="+186% revenue this year"
                accent="#10B981" delay={1.7}
                pos={{ bottom: 0, left: -10 }}
              />
            </motion.div>

          </div>
        </div>

        {/* Ticker at bottom of hero */}
        <Ticker />
      </div>
    </section>
  )
}