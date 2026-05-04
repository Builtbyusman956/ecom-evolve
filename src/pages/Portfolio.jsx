// Portfolio page
import { motion } from 'framer-motion'
const up = (d=0) => ({ hidden:{opacity:0,y:24}, show:{opacity:1,y:0,transition:{duration:0.65,delay:d,ease:[0.22,1,0.36,1]}} })

const PROJECTS = [
  { name:'NovaSkin Co.',      niche:'Skincare', revenue:'$84k/mo', tag:'US' },
  { name:'UrbanEdge Apparel', niche:'Fashion',  revenue:'$52k/mo', tag:'CA' },
  { name:'PetPure Essentials',niche:'Pet Care', revenue:'$38k/mo', tag:'AU' },
  { name:'FitForge Gear',     niche:'Fitness',  revenue:'$71k/mo', tag:'EU' },
  { name:'HomeNest Decor',    niche:'Home',     revenue:'$29k/mo', tag:'US' },
  { name:'TechWear Labs',     niche:'Tech',     revenue:'$95k/mo', tag:'US' },
]
const HUE = [258,220,175,140,30,200]

export default function Portfolio() {
  return (
    <section style={{ background:'var(--canvas)', minHeight:'100vh', paddingTop:120, paddingBottom:96 }}>
      <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 1.5rem' }}>
        <motion.div variants={up(0.05)} initial="hidden" animate="show" style={{ maxWidth:540, marginBottom:56 }}>
          <span style={{ display:'inline-block', fontFamily:'var(--font-mono)', fontSize:11, letterSpacing:'0.20em', textTransform:'uppercase', padding:'6px 14px', borderRadius:100, background:'var(--violet-muted)', border:'1px solid var(--violet-border)', color:'var(--violet)', marginBottom:18 }}>Our Work</span>
          <h1 style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:'clamp(2.2rem,4.2vw,3.6rem)', color:'var(--ink)', lineHeight:1.08, marginBottom:18 }}>
            Stores We've Built & Scaled
          </h1>
          <p style={{ fontFamily:'var(--font-body)', fontSize:'1.05rem', color:'var(--ink-soft)', lineHeight:1.7 }}>
            Real stores. Real revenue. Browse profitable Shopify businesses we've launched.
          </p>
        </motion.div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:18 }}>
          {PROJECTS.map(({ name, niche, revenue, tag }, i) => (
            <motion.div key={name} variants={up(0.1+i*0.07)} initial="hidden" animate="show"
              style={{ background:'#fff', borderRadius:18, border:'1px solid rgba(0,0,0,0.07)', overflow:'hidden', boxShadow:'0 1px 4px rgba(0,0,0,0.05)', transition:'all 0.25s', cursor:'default' }}
              onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow='0 8px 32px rgba(108,71,255,0.12)'; e.currentTarget.style.borderColor='rgba(108,71,255,0.18)' }}
              onMouseLeave={e=>{ e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 1px 4px rgba(0,0,0,0.05)'; e.currentTarget.style.borderColor='rgba(0,0,0,0.07)' }}
            >
              <div style={{ height:160, background:`linear-gradient(135deg, hsl(${HUE[i]},60%,94%) 0%, hsl(${HUE[i]},50%,88%) 100%)`, display:'flex', alignItems:'center', justifyContent:'center', position:'relative' }}>
                <span style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:'4rem', color:`hsl(${HUE[i]},50%,75%)` }}>{name[0]}</span>
                <span style={{ position:'absolute', top:12, right:12, fontFamily:'var(--font-mono)', fontSize:10, letterSpacing:'0.14em', textTransform:'uppercase', padding:'4px 10px', borderRadius:100, background:'rgba(255,255,255,0.70)', color:`hsl(${HUE[i]},50%,35%)` }}>{tag}</span>
              </div>
              <div style={{ padding:'20px 22px' }}>
                <p style={{ fontFamily:'var(--font-mono)', fontSize:10, letterSpacing:'0.16em', textTransform:'uppercase', color:'var(--ink-muted)', marginBottom:6 }}>{niche}</p>
                <h3 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'1.15rem', color:'var(--ink)', marginBottom:12 }}>{name}</h3>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <span style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'1.1rem', color:'var(--violet)' }}>{revenue}</span>
                  <span style={{ fontFamily:'var(--font-body)', fontSize:12, color:'var(--ink-muted)' }}>avg monthly</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}