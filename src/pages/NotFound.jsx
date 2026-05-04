import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { TbArrowLeft } from 'react-icons/tb'

export default function NotFound() {
  return (
    <section style={{ background:'var(--canvas)', minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'0 1.5rem', textAlign:'center' }}>
      <div>
        <motion.div initial={{ opacity:0, scale:0.88 }} animate={{ opacity:1, scale:1 }} transition={{ duration:0.6 }}>
          <p style={{
            fontFamily:'var(--font-display)', fontWeight:800, lineHeight:1,
            fontSize:'clamp(7rem,20vw,16rem)',
            background:'linear-gradient(135deg, rgba(108,71,255,0.10) 0%, rgba(108,71,255,0.22) 50%, rgba(37,99,235,0.10) 100%)',
            WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text',
            userSelect:'none',
          }}>404</p>
        </motion.div>

        <motion.div initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.25 }}>
          <h2 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'1.6rem', color:'var(--ink)', marginBottom:10 }}>Page not found</h2>
          <p style={{ fontFamily:'var(--font-body)', fontSize:15, color:'var(--ink-soft)', maxWidth:340, margin:'0 auto 32px' }}>
            This page doesn't exist. Let's get you back on track.
          </p>
        </motion.div>

        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.4 }}
          style={{ display:'flex', flexWrap:'wrap', gap:12, justifyContent:'center' }}>
          <Link to="/" style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'13px 28px', borderRadius:100, background:'var(--brand-grad)', color:'#fff', fontFamily:'var(--font-body)', fontWeight:700, fontSize:15, boxShadow:'0 8px 28px rgba(108,71,255,0.32)', textDecoration:'none', transition:'transform 0.2s' }}
            onMouseEnter={e=>e.currentTarget.style.transform='scale(1.04)'}
            onMouseLeave={e=>e.currentTarget.style.transform='scale(1)'}
          >
            <TbArrowLeft /> Back to Home
          </Link>
          <Link to="/book-a-call" style={{ display:'inline-flex', alignItems:'center', padding:'12px 22px', borderRadius:100, border:'1px solid rgba(0,0,0,0.10)', color:'var(--ink-soft)', fontFamily:'var(--font-body)', fontWeight:500, fontSize:14, textDecoration:'none', transition:'color 0.2s' }}
            onMouseEnter={e=>{ e.currentTarget.style.color='var(--violet)'; e.currentTarget.style.borderColor='var(--violet-border)' }}
            onMouseLeave={e=>{ e.currentTarget.style.color='var(--ink-soft)'; e.currentTarget.style.borderColor='rgba(0,0,0,0.10)' }}
          >
            Book a Free Call
          </Link>
        </motion.div>
      </div>
    </section>
  )
}