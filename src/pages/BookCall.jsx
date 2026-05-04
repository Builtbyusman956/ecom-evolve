import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { TbCheck, TbCalendar, TbArrowRight, TbPhone, TbMail } from 'react-icons/tb'

const up = (d = 0) => ({
  hidden: { opacity: 0, y: 22 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.65, delay: d, ease: [0.22, 1, 0.36, 1] } },
})

const STEPS = [
  { n: '01', title: 'Book Your Slot',   desc: 'Pick a time — takes under 60 seconds.' },
  { n: '02', title: 'Strategy Session', desc: 'We audit your situation and map a fully custom plan.' },
  { n: '03', title: 'We Get to Work',   desc: 'Choose your package and we start immediately.' },
  { n: '04', title: 'Watch It Scale',   desc: 'Launch, grow, and hit your revenue goals.' },
]

const INCLUDED = [
  'Free 30-min strategy call',
  'Custom store growth roadmap',
  'Zero pressure, zero hard-sell',
  'Actionable advice regardless',
]

export default function BookCall() {
  return (
    <section style={{ background: 'var(--bg)', minHeight: '100vh', paddingTop: 100, paddingBottom: 80 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem' }}>

        {/* ── Header ─────────────────────────────────── */}
        <motion.div
          variants={up(0.05)} initial="hidden" animate="show"
          style={{ textAlign: 'center', maxWidth: 580, margin: '0 auto 52px' }}
        >
          <span style={{
            display: 'inline-block',
            fontFamily: 'var(--font-mono)', fontSize: 9,
            letterSpacing: '0.22em', textTransform: 'uppercase',
            padding: '5px 14px', borderRadius: 100,
            background: 'var(--violet-muted)', border: '1px solid var(--violet-border)',
            color: 'var(--violet-bright)', marginBottom: 20,
          }}>
            Let's Talk
          </span>

          <h1 style={{
            fontFamily: 'var(--font-display)', fontWeight: 800,
            fontSize: 'clamp(2rem, 4vw, 3.2rem)',
            color: 'var(--snow)', lineHeight: 1.1,
            letterSpacing: '-0.02em', marginBottom: 16,
          }}>
            Book Your Free Strategy Call
          </h1>

          <p style={{
            fontFamily: 'var(--font-body)', fontSize: '1rem',
            color: 'var(--snow-dim)', lineHeight: 1.75,
          }}>
            30 minutes. Zero fluff. Walk away with a clear action plan to launch or scale
            your profitable Shopify store.
          </p>
        </motion.div>

        {/* ── Two-column grid ────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 20 }}
          className="lg:grid-cols-2">

          {/* ── Left ───────────────────────────────────── */}
          <motion.div variants={up(0.14)} initial="hidden" animate="show"
            style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

            {/* What's included */}
            <div style={{
              background: 'var(--bg-card)', borderRadius: 16,
              border: '1px solid var(--bg-border)', padding: '24px 26px',
            }}>
              <h3 style={{
                fontFamily: 'var(--font-display)', fontWeight: 700,
                fontSize: '1.05rem', color: 'var(--snow)', marginBottom: 18,
              }}>
                What's Included
              </h3>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
                {INCLUDED.map(item => (
                  <li key={item} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{
                      width: 22, height: 22, borderRadius: 7, flexShrink: 0,
                      background: 'var(--violet-muted)', border: '1px solid var(--violet-border)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <TbCheck size={12} color="var(--violet-bright)" strokeWidth={2.5} />
                    </span>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--snow-dim)' }}>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Process steps */}
            {STEPS.map(({ n, title, desc }, i) => (
              <motion.div
                key={n}
                variants={up(0.20 + i * 0.07)} initial="hidden" animate="show"
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: 14,
                  background: 'var(--bg-card)', borderRadius: 14,
                  border: '1px solid var(--bg-border)', padding: '16px 20px',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'var(--violet-border)'
                  e.currentTarget.style.boxShadow   = '0 0 24px rgba(108,71,255,0.08)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--bg-border)'
                  e.currentTarget.style.boxShadow   = 'none'
                }}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                  background: 'var(--violet-muted)', border: '1px solid var(--violet-border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 500, color: 'var(--violet-bright)' }}>
                    {n}
                  </span>
                </div>
                <div>
                  <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.96rem', color: 'var(--snow)', marginBottom: 4 }}>
                    {title}
                  </h4>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--snow-muted)', lineHeight: 1.6 }}>
                    {desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* ── Right: booking widget ──────────────────── */}
          <motion.div variants={up(0.22)} initial="hidden" animate="show"
            style={{
              background: 'var(--bg-card)', borderRadius: 16,
              border: '1px solid var(--bg-border)', overflow: 'hidden',
              display: 'flex', flexDirection: 'column',
            }}
          >
            {/* Card header */}
            <div style={{
              padding: '24px 26px 18px',
              borderBottom: '1px solid var(--bg-border)',
              background: 'var(--bg-hover)',
            }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--snow)', marginBottom: 4 }}>
                Pick a Time
              </h3>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--snow-muted)' }}>
                Timezone auto-detected · All slots in your local time
              </p>
            </div>

            {/* Calendar embed placeholder */}
            <div style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              gap: 16, padding: '48px 28px',
            }}>
              <div style={{
                width: 60, height: 60, borderRadius: 18,
                background: 'var(--violet-muted)', border: '1px solid var(--violet-border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <TbCalendar size={28} color="var(--violet-bright)" strokeWidth={1.5} />
              </div>

              <div style={{ textAlign: 'center' }}>
                <p style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 15, color: 'var(--snow)', marginBottom: 6 }}>
                  Booking widget goes here
                </p>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--snow-muted)', marginBottom: 28 }}>
                  Drop in your Calendly or TidyCal embed
                </p>

                <Link
                  to="/book-a-call"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 14,
                    padding: '11px 24px', borderRadius: 100,
                    background: 'var(--brand-grad)', color: '#fff',
                    boxShadow: '0 6px 22px rgba(108,71,255,0.40)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(108,71,255,0.52)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)';    e.currentTarget.style.boxShadow = '0 6px 22px rgba(108,71,255,0.40)' }}
                >
                  Email Us Instead <TbArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Bottom trust note */}
            <div style={{
              padding: '14px 26px',
              borderTop: '1px solid var(--bg-border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              background: 'var(--bg-hover)',
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)' }} />
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--snow-muted)' }}>
                Free call · No credit card · No obligation
              </p>
            </div>
          </motion.div>
        </div>

        {/* ── Alternative contact row ─────────────────── */}
        <motion.div
          variants={up(0.55)} initial="hidden" animate="show"
          style={{
            marginTop: 28, display: 'flex', flexWrap: 'wrap',
            gap: 12, justifyContent: 'center',
          }}
        >
          {[
            { icon: TbPhone, label: 'Prefer to call?', value: 'WhatsApp us', href: '#' },
            { icon: TbMail,  label: 'Prefer email?',   value: 'hello@ecomevolve.com', href: 'mailto:hello@ecomevolve.com' },
          ].map(({ icon: Icon, label, value, href }) => (
            <a
              key={label} href={href}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '14px 22px', borderRadius: 14,
                background: 'var(--bg-card)', border: '1px solid var(--bg-border)',
                transition: 'border-color 0.2s, box-shadow 0.2s',
                flex: 1, minWidth: 220,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--violet-border)'
                e.currentTarget.style.boxShadow   = '0 0 24px rgba(108,71,255,0.08)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--bg-border)'
                e.currentTarget.style.boxShadow   = 'none'
              }}
            >
              <div style={{
                width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                background: 'var(--violet-muted)', border: '1px solid var(--violet-border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon size={17} color="var(--violet-bright)" strokeWidth={1.8} />
              </div>
              <div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--snow-muted)', marginBottom: 2 }}>{label}</p>
                <p style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 13, color: 'var(--snow)' }}>{value}</p>
              </div>
            </a>
          ))}
        </motion.div>

      </div>
    </section>
  )
}