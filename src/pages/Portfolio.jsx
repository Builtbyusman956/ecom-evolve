// Portfolio page — real stores with product images + Instagram CTA
import { motion } from 'framer-motion'

const up = (d = 0) => ({
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, delay: d, ease: [0.22, 1, 0.36, 1] } },
})

// ─── Store Data ──────────────────────────────────────────────────────────────

const STORES = [
  {
    name: 'Elegance Universe',
    niche: 'Smart Living',
    tag: 'STORE',
    url: 'https://eleganceuniverse.com/',
    handle: 'eleganceuniverse.com',
    platform: 'Shopify',
    color: '#6C47FF',
    desc: 'Premium smart living essentials — home tech, lifestyle, and modern convenience.',
    image: 'https://images.stockcake.com/public/6/2/c/62c9c8a2-7962-4730-b52e-9979b61e3450_large/modern-smart-home-stockcake.jpg',
  },
  {
    name: 'SW Builds',
    niche: 'Baby Store',
    tag: 'STORE',
    url: 'https://sw-builds.myshopify.com/',
    handle: 'sw-builds',
    platform: 'Shopify',
    color: '#8B6FFF',
    desc: 'Curated baby essentials for new parents — safe, soft, and thoughtfully made.',
    image:'https://us.123rf.com/450wm/actiongp/actiongp2206/actiongp220600163/187289529-baby-accessories-concept-top-view-photo-of-pink-shirt-booties-pacifier-chain-knitted-bunny-toy.jpg?ver=6',
  },
  {
    name: 'Andrew Omnix',
    niche: 'Fitness',
    tag: 'STORE',
    url: 'https://andrewomnix.com/',
    handle: 'andrewomnix.com',
    platform: 'Custom Store',
    color: '#10B981',
    desc: 'High-performance fitness gear and training products built for serious athletes.',
    image: 'https://t3.ftcdn.net/jpg/04/29/35/62/360_F_429356296_CVQ5LkC6Pl55kUNLqLisVKgTw9vjyif1.jpg',
  },
  {
    name: 'God Scent Sanctuary',
    niche: 'Baby & Fragrance',
    tag: 'STORE',
    url: 'https://godscent-sanctuary.myshopify.com/',
    handle: 'godscent-sanctuary',
    platform: 'Shopify',
    color: '#F59E0B',
    desc: 'Fragrance-infused baby products — gentle, aromatic, and beautifully crafted.',
    image: 'https://kangaroocareindia.com/static/media/blog-120.7629f9879cab648cc6a4.png',
  },
  {
    name: 'X22TVB',
    niche: 'Self Care',
    tag: 'STORE',
    url: 'https://x22tvb-mw.myshopify.com',
    handle: 'x22tvb-mw',
    platform: 'Shopify',
    color: '#EC4899',
    desc: 'Self care and wellness products — skin, mind, and body essentials.',
    image: 'https://www.heinens.com/content/uploads/2022/08/Heinens-Health-And-Beauty-products-800x550-1.jpg',
  },
]

// ─── Component ───────────────────────────────────────────────────────────────

export default function Portfolio() {
  return (
    <section style={{ background: 'var(--bg)', minHeight: '100vh', paddingTop: 120, paddingBottom: 96 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem' }}>

        {/* Header */}
        <motion.div variants={up(0.05)} initial="hidden" animate="show" style={{ maxWidth: 580, marginBottom: 56 }}>
          <span style={{
            display: 'inline-block', fontFamily: 'var(--font-mono)', fontSize: 11,
            letterSpacing: '0.20em', textTransform: 'uppercase', padding: '6px 14px',
            borderRadius: 100, background: 'var(--violet-muted)', border: '1px solid var(--violet-border)',
            color: 'var(--violet)', marginBottom: 18,
          }}>Our Work</span>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontWeight: 800,
            fontSize: 'clamp(2.2rem,4.2vw,3.6rem)', color: 'var(--snow)',
            lineHeight: 1.08, marginBottom: 18,
          }}>
            Stores We've Built & Scaled
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.05rem', color: 'var(--snow-dim)', lineHeight: 1.7 }}>
            Real stores. Real results. Every brand below was built or scaled by our team — click to visit them live.
          </p>
        </motion.div>

        {/* Store Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 24 }}>
          {STORES.map(({ name, niche, tag, url, handle, platform, color, desc, image }, i) => (
            <motion.a
              key={name}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              variants={up(0.1 + i * 0.08)}
              initial="hidden"
              animate="show"
              style={{
                background: 'var(--bg-card)', borderRadius: 20,
                border: '1px solid var(--bg-border)', overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)', transition: 'all 0.3s ease',
                cursor: 'pointer', textDecoration: 'none', display: 'flex',
                flexDirection: 'column', height: '100%',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-8px)'
                e.currentTarget.style.boxShadow = `0 20px 40px rgba(108,71,255,0.25)`
                e.currentTarget.style.borderColor = 'var(--violet-border)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)'
                e.currentTarget.style.borderColor = 'var(--bg-border)'
              }}
            >
              {/* Image Container */}
              <div style={{ 
                height: 200, 
                overflow: 'hidden', 
                position: 'relative',
                background: `linear-gradient(135deg, ${color}22, ${color}11)`,
              }}>
                <img 
                  src={image} 
                  alt={name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.4s ease',
                  }}
                  onLoad={(e) => {
                    const parent = e.currentTarget.parentElement
                    parent.onMouseEnter = () => {
                      e.currentTarget.style.transform = 'scale(1.08)'
                    }
                    parent.onMouseLeave = () => {
                      e.currentTarget.style.transform = 'scale(1)'
                    }
                  }}
                />
                <span style={{
                  position: 'absolute', top: 12, right: 12,
                  fontFamily: 'var(--font-mono)', fontSize: 10,
                  letterSpacing: '0.14em', textTransform: 'uppercase',
                  padding: '5px 11px', borderRadius: 100,
                  background: 'rgba(14, 15, 26, 0.85)',
                  color: color,
                  backdropFilter: 'blur(8px)',
                  border: `1px solid ${color}44`,
                }}>{tag}</span>
                <span style={{
                  position: 'absolute', bottom: 10, right: 12,
                  fontSize: 16,
                  background: 'rgba(14, 15, 26, 0.9)',
                  borderRadius: '50%', width: 32, height: 32,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: color,
                  border: `1px solid ${color}44`,
                }}>↗</span>
              </div>

              {/* Card Body */}
              <div style={{ padding: '20px 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <p style={{
                  fontFamily: 'var(--font-mono)', fontSize: 10,
                  letterSpacing: '0.16em', textTransform: 'uppercase',
                  color: 'var(--snow-muted)', marginBottom: 6,
                }}>{niche}</p>
                <h3 style={{
                  fontFamily: 'var(--font-display)', fontWeight: 700,
                  fontSize: '1.15rem', color: 'var(--snow)', marginBottom: 10,
                  lineHeight: 1.3,
                }}>{name}</h3>
                <p style={{
                  fontFamily: 'var(--font-body)', fontSize: '0.85rem',
                  color: 'var(--snow-dim)', lineHeight: 1.6, marginBottom: 'auto',
                }}>{desc}</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--bg-border)' }}>
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: 9,
                    color: color,
                    background: `${color}22`,
                    padding: '5px 10px', borderRadius: 100,
                    letterSpacing: '0.05em',
                    border: `1px solid ${color}44`,
                  }}>{handle}</span>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'var(--snow-muted)' }}>{platform}</span>
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        {/* ─── Instagram CTA Banner ──────────────────────────────────────── */}
        <motion.a
          href="https://www.instagram.com/ecom_evolve"
          target="_blank"
          rel="noopener noreferrer"
          variants={up(0.55)}
          initial="hidden"
          animate="show"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: 24,
            marginTop: 48, borderRadius: 20, overflow: 'hidden',
            background: 'linear-gradient(135deg, var(--violet-dark) 0%, var(--violet) 50%, var(--blue) 100%)',
            padding: '36px 40px', textDecoration: 'none', cursor: 'pointer',
            boxShadow: '0 8px 32px rgba(108,71,255,0.3)',
            border: '1px solid var(--violet-border)',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-4px)'
            e.currentTarget.style.boxShadow = '0 16px 48px rgba(108,71,255,0.4)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(108,71,255,0.3)'
          }}
        >
          {/* Text */}
          <div style={{ flex: 1, minWidth: 240 }}>
            <p style={{
              fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.18em',
              textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', marginBottom: 8,
            }}>More Proof & Results</p>
            <h3 style={{
              fontFamily: 'var(--font-display)', fontWeight: 800,
              fontSize: 'clamp(1.2rem,2.8vw,1.55rem)',
              color: '#fff', marginBottom: 10, lineHeight: 1.2,
            }}>
              Check @ecom_evolve on Instagram
            </h3>
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: '0.9rem',
              color: 'rgba(255,255,255,0.85)', lineHeight: 1.6,
            }}>
              Real revenue screenshots, store breakdowns, case studies, and client wins — updated regularly. See the results for yourself.
            </p>
          </div>

          {/* Icon + CTA */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, flexShrink: 0 }}>
            <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
              <rect width="56" height="56" rx="16" fill="rgba(255,255,255,0.15)" />
              <rect x="14" y="14" width="28" height="28" rx="8" stroke="white" strokeWidth="2.2" fill="none" />
              <circle cx="28" cy="28" r="7" stroke="white" strokeWidth="2.2" fill="none" />
              <circle cx="38" cy="18" r="2.2" fill="white" />
            </svg>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.12em',
              textTransform: 'uppercase', color: '#fff',
              background: 'rgba(255,255,255,0.18)',
              padding: '8px 18px', borderRadius: 100, whiteSpace: 'nowrap',
              border: '1px solid rgba(255,255,255,0.3)',
            }}>Follow & See More ↗</span>
          </div>
        </motion.a>

        <motion.p
          variants={up(0.65)}
          initial="hidden"
          animate="show"
          style={{
            fontFamily: 'var(--font-body)', fontSize: '0.85rem',
            color: 'var(--snow-muted)', textAlign: 'center', marginTop: 32,
          }}
        >
          Click any store to visit it live · Follow our Instagram for ongoing results, case studies & client testimonials
        </motion.p>
      </div>
    </section>
  )
}