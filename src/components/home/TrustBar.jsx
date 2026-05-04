import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  TbRocket, TbStar, TbTrendingUp, TbUsers,
  TbWorldWww, TbShieldCheck, TbMoodSmile,
  TbShoppingBag,
} from 'react-icons/tb'

/* ── animated count-up hook ────────────────── */
function useCountUp(target, duration = 1600, active = false) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!active) return
    let raf
    const t0 = performance.now()
    const tick = (now) => {
      const p = Math.min((now - t0) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setVal(Math.round(eased * target))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, duration, active])
  return val
}

const STATS = [
  { icon: TbRocket,     value: 50,  suffix: '+',  label: 'Stores Launched',    color: '#6C47FF' },
  { icon: TbStar,       value: 5,   suffix: '.0', label: 'Avg Client Rating',  color: '#F59E0B' },
  { icon: TbTrendingUp, value: 186, suffix: '%',  label: 'Avg Revenue Growth', color: '#10B981' },
  { icon: TbUsers,      value: 4,   suffix: '',   label: 'Countries Served',   color: '#2563EB' },
]

const TOOLS = [
  { icon: TbShoppingBag, label: 'Shopify'     },
  { icon: TbWorldWww,     label: 'Meta Ads'    },
  { icon: TbTrendingUp,   label: 'TikTok Ads'  },
  { icon: TbUsers,        label: 'Klaviyo'     },
  { icon: TbShieldCheck,  label: 'ReConvert'   },
  { icon: TbMoodSmile,    label: 'Loox Reviews'},
  { icon: TbRocket,       label: 'PageFly'     },
  { icon: TbStar,         label: 'Vitals'      },
  // duplicated for seamless loop
  { icon: TbShoppingBag, label: 'Shopify'     },
  { icon: TbWorldWww,     label: 'Meta Ads'    },
  { icon: TbTrendingUp,   label: 'TikTok Ads'  },
  { icon: TbUsers,        label: 'Klaviyo'     },
  { icon: TbShieldCheck,  label: 'ReConvert'   },
  { icon: TbMoodSmile,    label: 'Loox Reviews'},
  { icon: TbRocket,       label: 'PageFly'     },
  { icon: TbStar,         label: 'Vitals'      },
]

function StatCard({ icon: Icon, value, suffix, label, color, delay, active }) {
  const count = useCountUp(value, 1600, active)
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={active ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{
        flex: 1, minWidth: 140,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '26px 18px',
        background: 'var(--bg-card)',
        border: '1px solid var(--bg-border)',
        borderRadius: 16,
        transition: 'border-color 0.25s, box-shadow 0.25s',
        cursor: 'default',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = `${color}44`
        e.currentTarget.style.boxShadow   = `0 0 28px ${color}16`
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--bg-border)'
        e.currentTarget.style.boxShadow   = 'none'
      }}
    >
      <div style={{
        width: 42, height: 42, borderRadius: 12, marginBottom: 14,
        background: `${color}15`, border: `1px solid ${color}28`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={19} color={color} strokeWidth={1.8} />
      </div>
      <p style={{
        fontFamily: 'var(--font-display)', fontWeight: 800,
        fontSize: '2rem', letterSpacing: '-0.03em',
        color: 'var(--snow)', lineHeight: 1, marginBottom: 6,
      }}>
        {count}{suffix}
      </p>
      <p style={{
        fontFamily: 'var(--font-body)', fontSize: 12,
        color: 'var(--snow-muted)', textAlign: 'center', lineHeight: 1.5,
      }}>
        {label}
      </p>
    </motion.div>
  )
}

export default function TrustBar() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section
      ref={ref}
      style={{
        background: 'var(--bg-raised)',
        borderTop: '1px solid var(--bg-border)',
        borderBottom: '1px solid var(--bg-border)',
        overflow: 'hidden',
      }}
    >
      {/* Stat counters */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '3.5rem 1.5rem' }}>
        <motion.p
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
          style={{
            fontFamily: 'var(--font-mono)', fontSize: 9,
            letterSpacing: '0.22em', textTransform: 'uppercase',
            color: 'var(--violet-bright)', textAlign: 'center', marginBottom: 26,
          }}
        >
          Trusted Results Across Markets
        </motion.p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
          {STATS.map((s, i) => (
            <StatCard key={s.label} {...s} delay={i * 0.08} active={inView} />
          ))}
        </div>
      </div>

      {/* Scrolling tools strip */}
      <div style={{ borderTop: '1px solid var(--bg-border)', padding: '18px 0', overflow: 'hidden', position: 'relative' }}>
        <p style={{
          fontFamily: 'var(--font-mono)', fontSize: 9,
          letterSpacing: '0.22em', textTransform: 'uppercase',
          color: 'var(--snow-muted)', textAlign: 'center', marginBottom: 14,
        }}>
          Tools & Platforms We Work With
        </p>

        {/* Fade edges */}
        {['left','right'].map(side => (
          <div key={side} style={{
            position: 'absolute', top: 0, bottom: 0, width: 80, zIndex: 2,
            [side]: 0,
            background: `linear-gradient(${side === 'left' ? '90' : '270'}deg, var(--bg-raised) 0%, transparent 100%)`,
            pointerEvents: 'none',
          }} />
        ))}

        <div style={{
          display: 'flex', width: 'max-content',
          animation: 'ticker 24s linear infinite',
        }}>
          {TOOLS.map(({ icon: Icon, label }, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 9,
              padding: '8px 26px',
              borderRight: '1px solid var(--bg-border)',
            }}>
              <Icon size={15} color="var(--snow-muted)" strokeWidth={1.6} />
              <span style={{
                fontFamily: 'var(--font-body)', fontWeight: 500,
                fontSize: 13, color: 'var(--snow-muted)',
                whiteSpace: 'nowrap',
              }}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}