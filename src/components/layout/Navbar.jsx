import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { HiMenuAlt3, HiX } from 'react-icons/hi'
import { TbShoppingBag } from 'react-icons/tb'

const LINKS = [
  { label: 'Services',    to: '/services' },
  { label: 'Portfolio',   to: '/portfolio' },
  { label: 'Book a Call', to: '/book-a-call' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const { pathname } = useLocation()

  useEffect(() => { setOpen(false) }, [pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', onResize, { passive: true })
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const navStyle = {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
    transition: 'all 0.35s ease',
    background: scrolled ? 'rgba(11,11,14,0.92)' : 'transparent',
    backdropFilter: scrolled ? 'blur(16px)' : 'none',
    borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
    boxShadow: scrolled ? '0 2px 24px rgba(0,0,0,0.4)' : 'none',
  }

  return (
    <>
      <motion.header
        initial={{ y: -64, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={navStyle}
      >
        <nav style={{
          maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 68,
        }}>

          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10,
              background: 'var(--brand-grad)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(108,71,255,0.35)',
            }}>
              <TbShoppingBag size={17} color="#fff" />
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.1rem', color: 'var(--snow)' }}>
              Ecom<span style={{ color: 'var(--violet)' }}>Evolve</span>
            </span>
          </Link>

          {/* Desktop links — hidden on mobile via inline style, not Tailwind */}
          <ul style={{
            display: isMobile ? 'none' : 'flex',
            alignItems: 'center', gap: 36, listStyle: 'none', margin: 0, padding: 0,
          }}>
            {[{ label: 'Home', to: '/' }, ...LINKS].map(({ label, to }) => (
              <li key={to}>
                <NavLink to={to} end={to === '/'}
                  style={({ isActive }) => ({
                    fontFamily: 'var(--font-body)',
                    fontSize: 14, fontWeight: 500,
                    color: isActive ? 'var(--violet)' : 'var(--snow-muted)',
                    textDecoration: 'none',
                    transition: 'color 0.2s',
                    position: 'relative',
                  })}
                >
                  {({ isActive }) => (
                    <span style={{ position: 'relative' }}>
                      {label}
                      {isActive && (
                        <span style={{
                          position: 'absolute', bottom: -2, left: 0, right: 0,
                          height: 2, borderRadius: 2,
                          background: 'var(--brand-grad)',
                        }} />
                      )}
                    </span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Desktop CTA */}
          <div style={{ display: isMobile ? 'none' : 'flex', alignItems: 'center', gap: 16 }}>
            <Link to="/book-a-call" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14,
              padding: '10px 22px', borderRadius: 100,
              background: 'var(--brand-grad)',
              color: '#fff', textDecoration: 'none',
              boxShadow: '0 4px 18px rgba(108,71,255,0.35)',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(108,71,255,0.45)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 18px rgba(108,71,255,0.35)' }}
            >
              Get Started →
            </Link>
          </div>

          {/* Mobile hamburger — hidden on desktop */}
          <button
            onClick={() => setOpen(p => !p)}
            style={{
              display: isMobile ? 'block' : 'none',
              color: 'var(--snow-muted)',
              background: 'none', border: 'none', cursor: 'pointer', padding: 4,
            }}
          >
            {open ? <HiX size={24} /> : <HiMenuAlt3 size={24} />}
          </button>
        </nav>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && isMobile && (
          <motion.div key="mob"
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 40,
              background: 'rgba(11,11,14,0.97)', backdropFilter: 'blur(20px)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}
          >
            {[{ label: 'Home', to: '/' }, ...LINKS].map(({ label, to }, i) => (
              <motion.div key={to}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}>
                <NavLink to={to} end={to === '/'}
                  style={({ isActive }) => ({
                    display: 'block', padding: '12px 32px',
                    fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.8rem',
                    color: isActive ? 'var(--violet)' : 'var(--snow-muted)',
                    textDecoration: 'none',
                  })}
                >{label}</NavLink>
              </motion.div>
            ))}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.28 }}
              style={{ marginTop: 16 }}>
              <Link to="/book-a-call" style={{
                display: 'inline-block', padding: '14px 40px', borderRadius: 100,
                background: 'var(--brand-grad)', color: '#fff',
                fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 16,
                boxShadow: '0 6px 24px rgba(108,71,255,0.38)',
              }}>
                Get Started Today
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}