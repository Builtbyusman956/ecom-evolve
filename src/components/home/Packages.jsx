import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  TbCheck, TbX, TbArrowUpRight, TbLock, TbShieldCheck,
  TbClock, TbCalendar, TbStar, TbX as TbClose,
} from 'react-icons/tb'
import { packages } from '../../data/packages'

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:9090').trim().replace(/\/+$/, '')

/* ── helpers ─────────────────────────────────────────────── */
const up = (d = 0) => ({
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, delay: d, ease: [0.22, 1, 0.36, 1] } },
})

/* ══════════════════════════════════════════════════════════
   CHECKOUT MODAL
══════════════════════════════════════════════════════════ */
function CheckoutModal({ pkg, onClose }) {
  const [form,    setForm]    = useState({ name: '', email: '', business: '' })
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  useEffect(() => {
    if (pkg) { setForm({ name: '', email: '', business: '' }); setError('') }
  }, [pkg])

  // Lock body scroll while modal open
  useEffect(() => {
    if (pkg) document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [pkg])

  const handlePay = async () => {
    if (!form.name.trim() || !form.email.trim()) return
    setLoading(true); setError('')
    try {
      const res  = await fetch(`${API_URL}/api/payments/initiate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageId:     pkg.id,
          customerName:  form.name,
          customerEmail: form.email,
          businessName:  form.business,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Payment initiation failed')
      window.location.href = data.paymentLink
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  if (!pkg) return null

  const Icon = pkg.icon

  return (
    <AnimatePresence>
      {pkg && (
        <>
          {/* Backdrop */}
          <motion.div
            key="bd"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed', inset: 0, zIndex: 60,
              background: 'rgba(0,0,0,0.80)', backdropFilter: 'blur(10px)',
            }}
          />

          {/* Panel */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.93, y: 28 }}
            animate={{ opacity: 1, scale: 1,    y: 0 }}
            exit={{   opacity: 0, scale: 0.93, y: 28 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'fixed', inset: 0, zIndex: 61,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '1rem', pointerEvents: 'none', overflowY: 'auto',
            }}
          >
            <div style={{
              pointerEvents: 'auto',
              width: '100%', maxWidth: 440,
              background: 'var(--bg-card)',
              border: `1px solid ${pkg.color}33`,
              borderRadius: 20,
              overflow: 'hidden',
              boxShadow: `0 8px 60px rgba(0,0,0,0.70), 0 0 0 1px ${pkg.color}18`,
              margin: 'auto',
            }}>

              {/* Modal header */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '18px 22px',
                borderBottom: '1px solid var(--bg-border)',
                background: 'var(--bg-hover)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: `${pkg.color}18`, border: `1px solid ${pkg.color}28`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon size={17} color={pkg.color} />
                  </div>
                  <div>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--snow-muted)', marginBottom: 2 }}>
                      You selected
                    </p>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1rem', color: 'var(--snow)' }}>
                      {pkg.name}
                    </h3>
                  </div>
                </div>
                <button onClick={onClose} style={{
                  width: 30, height: 30, borderRadius: 8,
                  background: 'var(--bg-card)', border: '1px solid var(--bg-border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: 'var(--snow-muted)',
                  transition: 'color 0.2s',
                }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--snow)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--snow-muted)'}
                >
                  <TbX size={15} />
                </button>
              </div>

              <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 16 }}>

                {/* Feature preview */}
                <div style={{
                  background: 'var(--bg-raised)', borderRadius: 12,
                  border: '1px solid var(--bg-border)', padding: '14px 16px',
                  display: 'flex', flexDirection: 'column', gap: 9,
                }}>
                  {pkg.features.slice(0, 4).map(f => (
                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <TbCheck size={13} color={pkg.color} strokeWidth={2.5} />
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--snow-dim)' }}>{f}</span>
                    </div>
                  ))}
                  {pkg.features.length > 4 && (
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--snow-muted)', paddingLeft: 21 }}>
                      + {pkg.features.length - 4} more features included
                    </p>
                  )}
                </div>

                {/* Price */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--snow-muted)' }}>Total (one-time)</span>
                  <span style={{
                    fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.6rem',
                    background: `linear-gradient(135deg, ${pkg.color}, #60A5FA)`,
                    WebkitBackgroundClip: 'text', backgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}>
                    {pkg.priceLabel}
                  </span>
                </div>

                <div style={{ height: 1, background: 'var(--bg-border)' }} />

                {/* Form */}
                {[
                  { key: 'name',     label: 'Full Name *',    placeholder: 'John Doe',              type: 'text'  },
                  { key: 'email',    label: 'Email Address *', placeholder: 'john@example.com',     type: 'email' },
                  { key: 'business', label: 'Business Name',  placeholder: 'Your Brand (optional)', type: 'text'  },
                ].map(({ key, label, placeholder, type }) => (
                  <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--snow-dim)' }}>
                      {label}
                    </label>
                    <input
                      type={type}
                      placeholder={placeholder}
                      value={form[key]}
                      onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                      style={{
                        background: 'var(--bg-raised)',
                        border: '1px solid var(--bg-bordermid)',
                        borderRadius: 10, padding: '10px 14px',
                        fontFamily: 'var(--font-body)', fontSize: 13,
                        color: 'var(--snow)', outline: 'none',
                        transition: 'border-color 0.2s',
                      }}
                      onFocus={e  => e.target.style.borderColor = 'var(--violet-border)'}
                      onBlur={e   => e.target.style.borderColor = 'var(--bg-bordermid)'}
                    />
                  </div>
                ))}

                {/* Error */}
                {error && (
                  <div style={{
                    display: 'flex', alignItems: 'flex-start', gap: 8,
                    background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.20)',
                    borderRadius: 10, padding: '10px 12px',
                  }}>
                    <TbX size={14} color="#EF4444" style={{ flexShrink: 0, marginTop: 1 }} />
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: '#EF4444' }}>{error}</p>
                  </div>
                )}

                {/* Security note */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: 'var(--bg-raised)', border: '1px solid var(--bg-border)',
                  borderRadius: 10, padding: '10px 12px',
                }}>
                  <TbShieldCheck size={16} color="var(--green)" style={{ flexShrink: 0 }} />
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--snow-muted)' }}>
                    Secure payment via Flutterwave · Visa, Mastercard & more accepted
                  </p>
                </div>

                {/* Pay button */}
                <button
                  onClick={handlePay}
                  disabled={loading || !form.name.trim() || !form.email.trim()}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 14,
                    padding: '13px 20px', borderRadius: 100,
                    background: loading || !form.name.trim() || !form.email.trim()
                      ? 'var(--bg-hover)'
                      : 'var(--brand-grad)',
                    color: loading || !form.name.trim() || !form.email.trim() ? 'var(--snow-muted)' : '#fff',
                    border: 'none', cursor: loading || !form.name.trim() || !form.email.trim() ? 'not-allowed' : 'pointer',
                    boxShadow: loading || !form.name.trim() || !form.email.trim() ? 'none' : '0 6px 24px rgba(108,71,255,0.40)',
                    transition: 'all 0.2s',
                  }}
                >
                  {loading ? (
                    <>
                      <div style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.25)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                      Redirecting to checkout...
                    </>
                  ) : (
                    <>
                      <TbLock size={14} />
                      Pay {pkg.priceLabel} Securely
                      <TbArrowUpRight size={14} />
                    </>
                  )}
                </button>
                <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

/* ══════════════════════════════════════════════════════════
   PACKAGE CARD
══════════════════════════════════════════════════════════ */
function PackageCard({ pkg, index, onSelect }) {
  const Icon = pkg.icon

  return (
    <motion.div
      variants={up(0.10 + index * 0.10)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-40px' }}
      style={{
        position: 'relative',
        display: 'flex', flexDirection: 'column',
        borderRadius: 20,
        border: pkg.popular ? `1px solid ${pkg.color}55` : '1px solid var(--bg-border)',
        background: pkg.popular ? 'var(--bg-card)' : 'var(--bg-raised)',
        overflow: 'hidden',
        boxShadow: pkg.popular ? `0 4px 40px ${pkg.color}18` : 'none',
        transition: 'border-color 0.25s, box-shadow 0.25s, transform 0.25s',
      }}
      onMouseEnter={e => {
        if (!pkg.popular) {
          e.currentTarget.style.borderColor = `${pkg.color}44`
          e.currentTarget.style.boxShadow   = `0 4px 32px ${pkg.color}14`
          e.currentTarget.style.transform   = 'translateY(-4px)'
        } else {
          e.currentTarget.style.transform   = 'translateY(-4px)'
          e.currentTarget.style.boxShadow   = `0 8px 48px ${pkg.color}28`
        }
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = pkg.popular ? `${pkg.color}55` : 'var(--bg-border)'
        e.currentTarget.style.boxShadow   = pkg.popular ? `0 4px 40px ${pkg.color}18` : 'none'
        e.currentTarget.style.transform   = 'translateY(0)'
      }}
    >
      {/* Top accent line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: pkg.popular
          ? `linear-gradient(90deg, transparent, ${pkg.color}, #60A5FA, transparent)`
          : `linear-gradient(90deg, transparent, ${pkg.color}55, transparent)`,
      }} />

      {/* Popular badge */}
      {pkg.popular && (
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 20 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontFamily: 'var(--font-mono)', fontSize: 9,
            letterSpacing: '0.18em', textTransform: 'uppercase',
            padding: '5px 14px', borderRadius: 100,
            background: `${pkg.color}20`, border: `1px solid ${pkg.color}40`,
            color: pkg.color,
          }}>
            <TbStar size={10} />
            {pkg.badge}
          </span>
        </div>
      )}

      <div style={{
        padding: pkg.popular ? '20px 26px 26px' : '28px 26px 26px',
        display: 'flex', flexDirection: 'column', flex: 1,
      }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <div style={{
              width: 44, height: 44, borderRadius: 12, marginBottom: 12,
              background: `${pkg.color}14`, border: `1px solid ${pkg.color}28`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon size={20} color={pkg.color} strokeWidth={1.8} />
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: pkg.color }}>
              {pkg.tag}
            </span>
          </div>
          <span style={{
            display: 'flex', alignItems: 'center', gap: 5,
            fontFamily: 'var(--font-mono)', fontSize: 10,
            color: 'var(--snow-muted)',
            background: 'var(--bg-hover)', border: '1px solid var(--bg-border)',
            padding: '5px 10px', borderRadius: 100,
          }}>
            <TbClock size={11} strokeWidth={1.8} />
            {pkg.delivery}
          </span>
        </div>

        {/* Name + tagline */}
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.25rem', color: 'var(--snow)', marginBottom: 6, lineHeight: 1.15 }}>
          {pkg.name}
        </h3>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--snow-muted)', marginBottom: 20, lineHeight: 1.6 }}>
          {pkg.tagline}
        </p>

        {/* Price */}
        <div style={{ marginBottom: 20 }}>
          <span style={{
            fontFamily: 'var(--font-display)', fontWeight: 800,
            fontSize: '2.2rem', lineHeight: 1, letterSpacing: '-0.03em',
            background: `linear-gradient(135deg, ${pkg.color} 0%, #60A5FA 100%)`,
            WebkitBackgroundClip: 'text', backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            {pkg.priceLabel}
          </span>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--snow-muted)', marginLeft: 8 }}>
            one-time
          </span>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: `linear-gradient(90deg, ${pkg.color}30, rgba(255,255,255,0.04), transparent)`, marginBottom: 20 }} />

        {/* Features */}
        <ul style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20, flex: 1 }}>
          {pkg.features.map(f => (
            <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 9 }}>
              <TbCheck size={14} color={pkg.color} strokeWidth={2.5} style={{ flexShrink: 0, marginTop: 2 }} />
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--snow-dim)', lineHeight: 1.5 }}>{f}</span>
            </li>
          ))}
          {pkg.notIncluded.map(f => (
            <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 9, opacity: 0.45 }}>
              <TbX size={14} color="var(--snow-muted)" strokeWidth={2} style={{ flexShrink: 0, marginTop: 2 }} />
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--snow-muted)', lineHeight: 1.5, textDecoration: 'line-through' }}>{f}</span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        {pkg.ctaType === 'pay' ? (
          <button
            onClick={() => onSelect(pkg)}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 14,
              padding: '13px 20px', borderRadius: 100,
              background: pkg.popular ? 'var(--brand-grad)' : `${pkg.color}14`,
              color: pkg.popular ? '#fff' : pkg.color,
              border: pkg.popular ? 'none' : `1px solid ${pkg.color}35`,
              boxShadow: pkg.popular ? '0 6px 24px rgba(76,46,204,0.40)' : 'none',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.03)'; e.currentTarget.style.boxShadow = pkg.popular ? '0 10px 32px rgba(76,46,204,0.52)' : `0 4px 20px ${pkg.color}30` }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)';    e.currentTarget.style.boxShadow = pkg.popular ? '0 6px 24px rgba(76,46,204,0.40)' : 'none' }}
          >
            <TbLock size={14} />
            {pkg.cta} — {pkg.priceLabel}
            <TbArrowUpRight size={14} />
          </button>
        ) : (
          <Link
            to="/book-a-call"
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 14,
              padding: '13px 20px', borderRadius: 100,
              border: `1px solid ${pkg.color}35`, color: pkg.color,
              background: `${pkg.color}08`,
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = `${pkg.color}16`; e.currentTarget.style.borderColor = `${pkg.color}60`; e.currentTarget.style.transform = 'scale(1.02)' }}
            onMouseLeave={e => { e.currentTarget.style.background = `${pkg.color}08`; e.currentTarget.style.borderColor = `${pkg.color}35`; e.currentTarget.style.transform = 'scale(1)' }}
          >
            <TbCalendar size={14} />
            {pkg.cta} — Let's Talk
            <TbArrowUpRight size={14} />
          </Link>
        )}
      </div>
    </motion.div>
  )
}

/* ══════════════════════════════════════════════════════════
   PACKAGES SECTION — MAIN EXPORT
══════════════════════════════════════════════════════════ */
export default function Packages() {
  const [selectedPkg, setSelectedPkg] = useState(null)

  return (
    <section
      id="packages"
      style={{ background: 'var(--bg)', padding: '6rem 0', position: 'relative', overflow: 'hidden' }}
    >
      {/* Background glow */}
      <div style={{
        position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
        width: 600, height: 300,
        background: 'radial-gradient(ellipse, rgba(108,71,255,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      {/* Top border line */}
      <div style={{
        position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
        width: 500, height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(108,71,255,0.45), transparent)',
      }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem', position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <motion.div
          variants={up(0.05)} initial="hidden"
          whileInView="show" viewport={{ once: true }}
          style={{ textAlign: 'center', maxWidth: 560, margin: '0 auto 56px' }}
        >
          <span style={{
            display: 'inline-block',
            fontFamily: 'var(--font-mono)', fontSize: 9,
            letterSpacing: '0.22em', textTransform: 'uppercase',
            padding: '5px 14px', borderRadius: 100,
            background: 'var(--violet-muted)', border: '1px solid var(--violet-border)',
            color: 'var(--violet-bright)', marginBottom: 20,
          }}>
            Transparent Pricing
          </span>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontWeight: 800,
            fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
            color: 'var(--snow)', lineHeight: 1.1,
            letterSpacing: '-0.02em', marginBottom: 14,
          }}>
            Pick Your{' '}
            <span style={{
              background: 'var(--brand-grad)', backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text', backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Growth Plan
            </span>
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.98rem', color: 'var(--snow-dim)', lineHeight: 1.7 }}>
            Every package is a one-time investment — no hidden fees, no monthly surprises.
            Pick what fits and we'll get to work.
          </p>
        </motion.div>

        {/* Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
          gap: 18,
          alignItems: 'start',
        }}>
          {packages.map((pkg, i) => (
            <PackageCard key={pkg.id} pkg={pkg} index={i} onSelect={setSelectedPkg} />
          ))}
        </div>

        {/* Trust strip */}
        <motion.div
          variants={up(0.45)} initial="hidden"
          whileInView="show" viewport={{ once: true }}
          style={{
            marginTop: 48, display: 'flex', flexWrap: 'wrap',
            alignItems: 'center', justifyContent: 'center', gap: 24,
          }}
        >
          {[
            { icon: TbLock,        text: 'Secure Flutterwave payments' },
            { icon: TbShieldCheck, text: '3 rounds of revisions' },
            { icon: TbClock,       text: 'Fast turnaround guaranteed' },
            { icon: TbCalendar,    text: 'Free discovery call included' },
          ].map(({ icon: Icon, text }) => (
            <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 7, fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--snow-muted)' }}>
              <Icon size={14} color="var(--violet-bright)" strokeWidth={1.8} />
              {text}
            </div>
          ))}
        </motion.div>
      </div>

      <CheckoutModal pkg={selectedPkg} onClose={() => setSelectedPkg(null)} />
    </section>
  )
}