import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'

const Home      = lazy(() => import('./pages/Home'))
const Services  = lazy(() => import('./pages/Services'))
const Portfolio = lazy(() => import('./pages/Portfolio'))
const BookCall  = lazy(() => import('./pages/BookCall'))
const ThankYou  = lazy(() => import('./pages/ThankYou'))
const NotFound  = lazy(() => import('./pages/NotFound'))

function Loader() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--canvas)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          border: '3px solid rgba(108,71,255,0.15)',
          borderTopColor: 'var(--violet)',
          animation: 'spin 0.75s linear infinite',
        }} />
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.15em', color: 'var(--ink-muted)', textTransform: 'uppercase' }}>
          Loading…
        </p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route element={<Layout />}>
            <Route index            element={<Home />} />
            <Route path="services"  element={<Services />} />
            <Route path="portfolio" element={<Portfolio />} />
            <Route path="book-a-call" element={<BookCall />} />
            <Route path="thank-you"   element={<ThankYou />} />
            <Route path="*"           element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}