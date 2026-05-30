import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import gsap from 'gsap'

export default function Navigation() {
  const navRef = useRef<HTMLElement>(null)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const isHome = location.pathname === '/'

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(navRef.current, { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, delay: 0.8, ease: 'power2.out' })
    })
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (!location.hash) return
    const id = location.hash.slice(1)
    const timer = window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 80)
    return () => window.clearTimeout(timer)
  }, [location.pathname, location.hash])

  const scrollTo = (id: string) => {
    if (!isHome) {
      navigate(`/#${id}`)
      return
    }
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      window.history.replaceState(null, '', `/#${id}`)
    }
  }

  return (
    <nav ref={navRef} className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between transition-all duration-500 opacity-0 ${scrolled ? 'bg-dark-primary/90 backdrop-blur-md' : ''}`} style={{ margin: '10px' }}>
      <Link to="/" className="hover:opacity-80 transition-opacity">
        <img src="/images/soul23_logo_boxed.svg" alt="soul:23" className="h-7 md:h-8" />
      </Link>

      <div className="hidden md:flex items-center gap-6">
        <button onClick={() => scrollTo('como-funciona')} className="text-[11px] uppercase tracking-[0.14em] text-cream-muted hover:text-cream transition-colors">Cómo funciona</button>
        <button onClick={() => scrollTo('feedback')} className="text-[11px] uppercase tracking-[0.14em] text-cream-muted hover:text-cream transition-colors">Feedback</button>
        <button onClick={() => scrollTo('proyectos')} className="text-[11px] uppercase tracking-[0.14em] text-cream-muted hover:text-cream transition-colors">Proyectos</button>
        <button onClick={() => scrollTo('contacto')} className="text-[11px] uppercase tracking-[0.14em] text-cream-muted hover:text-cream transition-colors">Contacto</button>
        {!isHome && (
          <Link to="/" className="text-[11px] uppercase tracking-[0.14em] text-cream-muted hover:text-cream transition-colors">Inicio</Link>
        )}
        <a href="https://calendly.com/alma_dev/30min" target="_blank" rel="noopener noreferrer" className="pill-accent">Agendar cita</a>
      </div>
    </nav>
  )
}
