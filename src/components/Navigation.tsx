import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTheme } from 'next-themes'
import gsap from 'gsap'
import { Menu, X, Sun, Moon, DollarSign, Loader2 } from 'lucide-react'
import { useCurrency } from '../contexts/CurrencyContext'
import { useLanguage, type Lang } from '../contexts/LanguageContext'

const langFlags: Record<Lang, string> = {
  ES: '🇲🇽',
  EN: '🇺🇸',
  KO: '🇰🇷',
  ZH: '🇨🇳',
}

export default function Navigation() {
  const navRef = useRef<HTMLElement>(null)
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const isHome = location.pathname === '/'
  const { theme, setTheme } = useTheme()
  const { currency, isLoading, toggle: toggleCurrency } = useCurrency()
  const { lang, setLang, t } = useLanguage()

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
    window.history.replaceState(null, '', location.pathname || '/')
  }, [location.pathname, location.hash])

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  const scrollTo = (id: string) => {
    setMobileOpen(false)
    if (!isHome) {
      navigate('/', { state: { scrollTo: id } })
      return
    }
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const navLinks = [
    { label: t('nav.como-funciona'), action: () => scrollTo('como-funciona'), isScroll: true },
    { label: t('nav.servicios'), to: '/servicios', isScroll: false },
    { label: t('nav.competencias'), href: 'https://carol.soul23.cloud/', isScroll: false, external: true },
    { label: t('nav.demos'), to: '/demos', isScroll: false },
    { label: t('nav.proyectos'), action: () => scrollTo('proyectos'), isScroll: true },
    { label: t('nav.precios'), to: '/precios', isScroll: false },
    { label: t('nav.contacto'), action: () => scrollTo('contacto'), isScroll: true },
  ]

  return (
    <>
      <nav ref={navRef} className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between transition-all duration-500 opacity-0 ${scrolled ? 'bg-dark-primary/90 backdrop-blur-md' : ''}`} style={{ margin: '10px' }}>
        <Link to="/" className="hover:opacity-80 transition-opacity">
          <img src="/images/soul23_logo_boxed.svg" alt="soul:23" className="h-10 md:h-12" />
        </Link>

        {/* Desktop nav + controls */}
        <div className="hidden lg:flex items-center gap-6">
          <div className="flex items-center gap-5">
            {navLinks.map((item, i) =>
              item.isScroll ? (
                <button
                  key={i}
                  onClick={item.action}
                  className="text-[11px] uppercase tracking-[0.16em] text-cream-muted hover:text-cream transition-colors"
                >
                  {item.label}
                </button>
              ) : item.external ? (
                <a
                  key={i}
                  href={item.href!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] uppercase tracking-[0.16em] text-cream-muted hover:text-cream transition-colors"
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={i}
                  to={item.to!}
                  className="text-[11px] uppercase tracking-[0.16em] text-cream-muted hover:text-cream transition-colors"
                >
                  {item.label}
                </Link>
              )
            )}
          </div>

          <div className="flex flex-row items-center gap-3 ml-4 pl-4 border-l border-cream/10">
            {/* Theme toggle: solo icono */}
            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="flex items-center justify-center w-7 h-7 text-cream-muted hover:text-gold transition-colors" title={theme === 'dark' ? t('theme.light') : t('theme.dark')}>
              {theme === 'dark' ? <Sun size={15} className="text-gold" /> : <Moon size={15} className="text-gold" />}
            </button>

            <button onClick={toggleCurrency} disabled={isLoading} className="flex flex-row items-center gap-1 text-[10px] uppercase tracking-[0.14em] text-cream-muted hover:text-gold transition-colors disabled:opacity-40">
              {isLoading ? (
                <Loader2 size={12} className="animate-spin text-gold" />
              ) : (
                <>
                  <span className={currency === 'MXN' ? 'text-gold' : 'text-cream-muted/40'}>MXN</span>
                  <span className="text-cream-muted/20">/</span>
                  <span className={currency === 'USD' ? 'text-gold' : 'text-cream-muted/40'}>USD</span>
                </>
              )}
            </button>

            <div className="flex flex-row items-center gap-1.5 text-sm">
              {(Object.keys(langFlags) as Lang[]).map(code => (
                <button
                  key={code}
                  onClick={() => setLang(code)}
                  className={`transition-opacity ${lang === code ? 'opacity-100 scale-110' : 'opacity-30 hover:opacity-70'}`}
                  title={t('lang.' + code.toLowerCase())}
                >
                  {langFlags[code]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden flex items-center justify-center w-10 h-10 text-cream-muted hover:text-gold transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={t('nav.inicio')}
        >
          {mobileOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-dark-primary backdrop-blur-sm flex flex-col items-center justify-center gap-10 lg:hidden">
          {/* Nav links */}
          <div className="flex flex-col items-center gap-7">
            {navLinks.map((item, i) =>
              item.isScroll ? (
                <button key={i} onClick={item.action} className="text-sm uppercase tracking-[0.18em] text-cream-muted hover:text-cream transition-colors">{item.label}</button>
              ) : item.external ? (
                <a key={i} href={item.href!} target="_blank" rel="noopener noreferrer" className="text-sm uppercase tracking-[0.18em] text-cream-muted hover:text-cream transition-colors">{item.label}</a>
              ) : (
                <Link key={i} to={item.to!} className="text-sm uppercase tracking-[0.18em] text-cream-muted hover:text-cream transition-colors">{item.label}</Link>
              )
            )}
            {!isHome && (
              <Link to="/" className="text-sm uppercase tracking-[0.18em] text-cream-muted hover:text-cream transition-colors">{t('nav.inicio')}</Link>
            )}
          </div>

          <a href="https://calendly.com/alma_dev/30min" target="_blank" rel="noopener noreferrer" className="pill-accent">{t('nav.agendar')}</a>

          {/* Controls — side by side, debajo del boton agendar */}
          <div className="flex flex-row flex-wrap items-center justify-center gap-5">
            {/* Theme toggle: solo icono */}
            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="flex items-center justify-center w-9 h-9 text-cream-muted hover:text-gold transition-colors" title={theme === 'dark' ? t('theme.light') : t('theme.dark')}>
              {theme === 'dark' ? <Sun size={18} className="text-gold" /> : <Moon size={18} className="text-gold" />}
            </button>

            <span className="w-px h-5 bg-cream/10" />

            <button onClick={toggleCurrency} disabled={isLoading} className="flex flex-row items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-cream-muted hover:text-gold transition-colors disabled:opacity-40">
              {isLoading ? (
                <Loader2 size={14} className="animate-spin text-gold" />
              ) : (
                <>
                  <DollarSign size={15} className={currency === 'MXN' ? 'text-gold' : 'text-cream-muted'} />
                  <span className={currency === 'MXN' ? 'text-gold' : 'text-cream-muted/40'}>MXN</span>
                  <span className="text-cream-muted/20">/</span>
                  <span className={currency === 'USD' ? 'text-gold' : 'text-cream-muted/40'}>USD</span>
                </>
              )}
            </button>

            <span className="w-px h-5 bg-cream/10" />

            <div className="flex flex-row items-center gap-2 text-base">
              {(Object.keys(langFlags) as Lang[]).map(code => (
                <button
                  key={code}
                  onClick={() => setLang(code)}
                  className={`transition-opacity ${lang === code ? 'opacity-100 scale-110' : 'opacity-30 hover:opacity-70'}`}
                  title={t('lang.' + code.toLowerCase())}
                >
                  {langFlags[code]}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
