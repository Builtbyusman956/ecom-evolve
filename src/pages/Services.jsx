// ── Services page ──────────────────────────────────────────
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { TbBuildingStore, TbSearch, TbSpeakerphone, TbPalette, TbChartLine, TbAdjustments } from 'react-icons/tb'
import { HiArrowRight } from 'react-icons/hi'

const up = (d=0) => ({ hidden:{opacity:0,y:24}, show:{opacity:1,y:0,transition:{duration:0.65,delay:d,ease:[0.22,1,0.36,1]}} })

const SVCS = [
  { icon: TbBuildingStore, title:'Store Setup',        desc:'End-to-end Shopify build theme, pages, checkout engineered to convert from day one.' },
  { icon: TbSearch,       title:'Product Research',   desc:'Data-driven product discovery. We find winning products before you spend on inventory.' },
  { icon: TbSpeakerphone, title:'Paid Advertising',   desc:'Meta & TikTok campaigns built for profitable ROAS, not just clicks or vanity metrics.' },
  { icon: TbPalette,      title:'Brand Identity',     desc:'Logo, colors, tone of voice positioning that builds instant trust in any market.' },
  { icon: TbChartLine,    title:'SEO & Content',      desc:'Organic strategies and content that compound over time and lower your ad dependency.' },
  { icon: TbAdjustments,  title:'Store Optimization', desc:'CRO audits, A/B tests, speed fixes squeeze more revenue from your existing traffic.' },
]

export default function Services() {
  return (
    <section style={{ background:'var(--bg-base)', minHeight:'100vh', paddingTop:120, paddingBottom:96 }}>
      <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 1.5rem' }}>
        <motion.div variants={up(0.05)} initial="hidden" animate="show" style={{ maxWidth:560, marginBottom:56 }}>
          <span style={{ display:'inline-block', fontFamily:'var(--font-mono)', fontSize:11, letterSpacing:'0.20em', textTransform:'uppercase', padding:'6px 14px', borderRadius:100, background:'var(--violet-muted)', border:'1px solid var(--violet-border)', color:'var(--violet-bright)', marginBottom:18 }}>
            What We Do
          </span>
          <h1 style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:'clamp(2.2rem,4.2vw,3.6rem)', color:'var(--snow)', lineHeight:1.08, marginBottom:18 }}>
            Everything Your Store Needs to Win
          </h1>
          <p style={{ fontFamily:'var(--font-body)', fontSize:'1.05rem', color:'var(--snow-muted)', lineHeight:1.7 }}>
            From zero to scaling we handle every layer so you focus on growth.
          </p>
        </motion.div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:18 }}>
          {SVCS.map(({ icon:Icon, title, desc }, i) => (
            <motion.div key={title} variants={up(0.1+i*0.07)} initial="hidden" animate="show"
              style={{ background:'var(--bg-card)', borderRadius:18, border:'1px solid var(--bg-border)', padding:'28px 28px 28px', boxShadow:'none', cursor:'default', transition:'all 0.25s' }}
              onMouseEnter={e=>{ e.currentTarget.style.boxShadow='0 4px 24px rgba(108,71,255,0.12)'; e.currentTarget.style.borderColor='rgba(108,71,255,0.25)'; e.currentTarget.style.transform='translateY(-3px)' }}
              onMouseLeave={e=>{ e.currentTarget.style.boxShadow='none'; e.currentTarget.style.borderColor='var(--bg-border)'; e.currentTarget.style.transform='translateY(0)' }}
            >
              <div style={{ width:44, height:44, borderRadius:12, background:'var(--violet-muted)', border:'1px solid var(--violet-border)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:18 }}>
                <Icon size={20} color="var(--violet-bright)" />
              </div>
              <h3 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'1.2rem', color:'var(--snow)', marginBottom:10 }}>{title}</h3>
              <p style={{ fontFamily:'var(--font-body)', fontSize:14, color:'var(--snow-muted)', lineHeight:1.65 }}>{desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div variants={up(0.7)} initial="hidden" animate="show" style={{ marginTop:56, textAlign:'center' }}>
          <p style={{ fontFamily:'var(--font-body)', fontSize:14, color:'var(--snow-muted)', marginBottom:20 }}>Not sure which service you need? Let's talk.</p>
          <Link to="/book-a-call" style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'13px 28px', borderRadius:100, background:'var(--brand-grad)', color:'#fff', fontFamily:'var(--font-body)', fontWeight:700, fontSize:15, boxShadow:'0 8px 28px rgba(108,71,255,0.35)', textDecoration:'none', transition:'transform 0.2s' }}
            onMouseEnter={e=>e.currentTarget.style.transform='scale(1.04)'}
            onMouseLeave={e=>e.currentTarget.style.transform='scale(1)'}
          >
            Book a Free Strategy Call <HiArrowRight />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}