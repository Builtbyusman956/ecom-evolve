import { useState, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { TbPlus, TbMinus } from 'react-icons/tb'
import { Link } from 'react-router-dom'

const FAQS = [
  {
    q: 'How long does it take to set up my Shopify store?',
    a: 'Most stores are fully built and ready to launch within 7–14 days, depending on the package and complexity. We move fast without cutting corners — you\'ll have a conversion-optimised store live before most agencies finish their discovery call.',
  },
  {
    q: 'Do I need any technical knowledge or experience?',
    a: 'Zero. We handle everything from domain setup to product listings, theme customisation, payment gateways, and shipping. You just need to show up for the onboarding call and give us your vision — we do the rest.',
  },
  {
    q: 'How do your packages work and what\'s included?',
    a: 'We offer three packages: Starter (store setup + essentials), Growth (setup + product research + ads setup), and Scale (full-service including branding, ads management, and ongoing CRO). Each is a one-time project fee with optional monthly retainers for ongoing management.',
  },
  {
    q: 'Can you help with marketing and running paid ads?',
    a: 'Yes — our Growth and Scale packages include Meta (Facebook/Instagram) and TikTok ad setup with creative strategy. We build campaigns designed for profitable ROAS from day one, not just traffic numbers.',
  },
  {
    q: 'Do you work with entrepreneurs outside the US?',
    a: 'Absolutely. We work with entrepreneurs across the US, Canada, Australia, and Europe. Our team is remote-first and we\'ve successfully launched stores targeting all of these markets with localised strategies that actually convert.',
  },
  {
    q: 'What happens after my store is launched?',
    a: 'We don\'t disappear after launch. You get a 30-day post-launch support window included in every package, plus access to our ongoing Scale retainer if you want us handling ads, optimisation, and growth strategy month to month.',
  },
]

function FAQItem({ q, a, index }) {
  const [open, setOpen] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      style={{
        borderRadius: 14,
        border: `1px solid ${open ? 'var(--violet-border)' : 'var(--bg-border)'}`,
        background: open ? 'var(--bg-card)' : 'var(--bg-raised)',
        overflow: 'hidden',
        transition: 'border-color 0.25s, background 0.25s, box-shadow 0.25s',
        boxShadow: open ? '0 0 32px rgba(108,71,255,0.08)' : 'none',
      }}
    >
      {/* Question row */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', gap: 16,
          padding: '20px 22px', background: 'none', border: 'none',
          cursor: 'pointer', textAlign: 'left',
        }}
      >
        <span style={{
          fontFamily: 'var(--font-display)', fontWeight: 700,
          fontSize: '1rem', color: open ? 'var(--snow)' : 'var(--snow-dim)',
          lineHeight: 1.4, transition: 'color 0.2s',
          flex: 1,
        }}>
          {q}
        </span>
        <div style={{
          width: 30, height: 30, borderRadius: 8, flexShrink: 0,
          background: open ? 'var(--violet-muted)' : 'var(--bg-hover)',
          border: `1px solid ${open ? 'var(--violet-border)' : 'var(--bg-border)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.25s',
        }}>
          {open
            ? <TbMinus size={14} color="var(--violet-bright)" strokeWidth={2.5} />
            : <TbPlus  size={14} color="var(--snow-muted)"   strokeWidth={2.5} />
          }
        </div>
      </button>

      {/* Answer — AnimatePresence for smooth height */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: 14,
              color: 'var(--snow-muted)', lineHeight: 1.75,
              padding: '0 22px 20px',
            }}>
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function FAQ() {
  return (
    <section style={{ background: 'var(--bg)', padding: '6rem 0' }}>
      <div style={{ maxWidth: 780, margin: '0 auto', padding: '0 1.5rem' }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 48 }}
        >
          <span style={{
            display: 'inline-block',
            fontFamily: 'var(--font-mono)', fontSize: 9,
            letterSpacing: '0.22em', textTransform: 'uppercase',
            padding: '5px 14px', borderRadius: 100,
            background: 'var(--violet-muted)', border: '1px solid var(--violet-border)',
            color: 'var(--violet)', marginBottom: 18,
          }}>
            FAQ
          </span>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontWeight: 800,
            fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
            color: 'var(--snow)', lineHeight: 1.1,
            letterSpacing: '-0.02em', marginBottom: 14,
          }}>
            Questions We Get All the Time
          </h2>
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: '1rem',
            color: 'var(--snow-dim)', lineHeight: 1.7, maxWidth: 480, margin: '0 auto',
          }}>
            Everything you need to know before booking your free strategy call.
          </p>
        </motion.div>

        {/* Accordion list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {FAQS.map((item, i) => (
            <FAQItem key={i} index={i} q={item.q} a={item.a} />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.2 }}
          style={{
            marginTop: 48, padding: '28px 32px',
            borderRadius: 16,
            background: 'var(--bg-card)',
            border: '1px solid var(--bg-border)',
            display: 'flex', flexWrap: 'wrap',
            alignItems: 'center', justifyContent: 'space-between', gap: 16,
          }}
        >
          <div>
            <p style={{
              fontFamily: 'var(--font-display)', fontWeight: 700,
              fontSize: '1.05rem', color: 'var(--snow)', marginBottom: 4,
            }}>
              Still have questions?
            </p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--snow-muted)' }}>
              Book a free call — we'll answer everything live.
            </p>
          </div>
          <Link
            to="/book-a-call"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 14,
              padding: '11px 24px', borderRadius: 100,
              background: 'var(--brand-grad)', color: '#fff',
              boxShadow: '0 6px 22px rgba(108,71,255,0.38)',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(108,71,255,0.50)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)';    e.currentTarget.style.boxShadow = '0 6px 22px rgba(108,71,255,0.38)' }}
          >
            Book a Free Call →
          </Link>
        </motion.div>
      </div>
    </section>
  )
}