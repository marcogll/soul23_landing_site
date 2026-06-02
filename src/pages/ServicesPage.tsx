import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Check } from 'lucide-react'
import { useCurrency } from '../contexts/CurrencyContext'
import { useLanguage } from '../contexts/LanguageContext'
import { getRetainers, getProjects, getTimeAttendanceHardware, getTimeAttendanceLicenses, getTimeAttendanceSelfHosted, getDiscounts } from '../lib/pricing'
import gsap from 'gsap'

export default function ServicesPage() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { formatPrice } = useCurrency()
  const { t } = useLanguage()

  const retainers = getRetainers()
  const projects = getProjects()
  const taHardware = getTimeAttendanceHardware()
  const taLicenses = getTimeAttendanceLicenses()
  const taSelf = getTimeAttendanceSelfHosted()
  const discounts = getDiscounts()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const ctx = gsap.context(() => {
      section.querySelectorAll('.reveal').forEach((el, i) => {
        gsap.fromTo(el, { y: 18, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.4, delay: i * 0.04, ease: 'power2.out',
        })
      })
    }, section)
    return () => ctx.revert()
  }, [])

  const bestDiscount = discounts.onboarding.percentage

  return (
    <div ref={sectionRef} className="min-h-screen bg-dark-primary pt-28 pb-24">
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        <Link to="/" className="reveal inline-flex items-center gap-2 text-cream-muted text-[13px] font-mono uppercase tracking-wide hover:text-gold transition-colors mb-8">
          <ArrowLeft size={16} />
          <span>{t('services.back')}</span>
        </Link>

        <h1 className="reveal font-serif font-semibold text-cream text-3xl lg:text-5xl leading-[1.08] mb-4">
          {t('services.title')}
        </h1>
        <p className="reveal text-cream-muted text-sm max-w-2xl mb-16 leading-relaxed">
          {t('services.subtitle')}
        </p>

        {/* Retainers */}
        <div className="reveal mb-12" style={{ opacity: 0 }}>
          <h2 className="font-serif font-semibold text-cream text-xl mb-2">Retainers mensuales</h2>
          <p className="text-xs text-cream-muted mb-6">Servicios continuos con pago mensual. Operación + atracción + supervisión.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-5 mb-16">
          {retainers.map((item) => (
            <div key={item.id} className="reveal border border-cream/10 bg-dark-secondary p-6 lg:p-8" style={{ opacity: 0 }}>
              <div className="flex items-start justify-between mb-5">
                <h3 className="font-serif font-semibold text-cream text-lg">{item.name}</h3>
                <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-green-400 border border-green-400/40 px-2 py-0.5">
                  -{bestDiscount}% OFF
                </span>
              </div>
              <p className="text-sm text-cream-muted mb-4">{item.description}</p>
              <ul className="space-y-3 mb-6">
                {item.includes.map((inc) => (
                  <li key={inc} className="flex items-start gap-3 text-sm text-cream-muted">
                    <Check className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                    <span>{inc}</span>
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-between border-t border-cream/10 pt-4">
                <div>
                  <span className="font-serif text-2xl text-cream">{formatPrice(item.listMxn)}</span>
                  <span className="text-xs text-cream-muted ml-2">/mes</span>
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-gold border border-gold/30 px-2 py-1">
                  Lanz: {formatPrice(item.onboardingMxn ?? item.listMxn)}
                </span>
              </div>
              {item.note && (
                <p className="text-[11px] text-cream-muted/50 mt-3 italic">{item.note}</p>
              )}
            </div>
          ))}
        </div>

        {/* Proyectos */}
        <div className="reveal mb-12" style={{ opacity: 0 }}>
          <h2 className="font-serif font-semibold text-cream text-xl mb-2">Proyectos cerrados</h2>
          <p className="text-xs text-cream-muted mb-6">Entregables de precio fijo — pago único o por hitos.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-5 mb-16">
          {projects.map((item) => (
            <div key={item.id} className="reveal border border-cream/10 bg-dark-secondary p-6 lg:p-8" style={{ opacity: 0 }}>
              <div className="flex items-start justify-between mb-5">
                <h3 className="font-serif font-semibold text-cream text-lg">{item.name}</h3>
                <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-green-400 border border-green-400/40 px-2 py-0.5">
                  -{bestDiscount}% OFF
                </span>
              </div>
              <p className="text-sm text-cream-muted mb-4">{item.description}</p>
              <ul className="space-y-3 mb-6">
                {item.includes.slice(0, 6).map((inc) => (
                  <li key={inc} className="flex items-start gap-3 text-sm text-cream-muted">
                    <Check className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                    <span>{inc}</span>
                  </li>
                ))}
                {item.includes.length > 6 && (
                  <li className="text-[10px] text-gold/70 ml-7">+{item.includes.length - 6} más</li>
                )}
              </ul>
              <div className="flex items-center justify-between border-t border-cream/10 pt-4">
                <div>
                  <span className="font-serif text-2xl text-cream">{formatPrice(item.listMxn)}</span>
                  <span className="text-xs text-cream-muted ml-2">proyecto</span>
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-gold border border-gold/30 px-2 py-1">
                  Lanz: {formatPrice(item.onboardingMxn ?? item.listMxn)}
                </span>
              </div>
              {item.note && (
                <p className="text-[11px] text-cream-muted/50 mt-3 italic">{item.note}</p>
              )}
            </div>
          ))}
        </div>

        {/* Time & Attendance */}
        <div className="reveal mb-12" style={{ opacity: 0 }}>
          <h2 className="font-serif font-semibold text-cream text-xl mb-2">Time & Attendance</h2>
          <p className="text-xs text-cream-muted mb-6">Control de tiempo laboral · Cumplimiento Reforma 40 hrs · Hardware + software.</p>
        </div>

        {/* Hardware */}
        <div className="reveal mb-8" style={{ opacity: 0 }}>
          <h3 className="font-mono text-[10px] uppercase tracking-[0.14em] text-gold mb-4">Dispositivos de registro</h3>
        </div>
        <div className="grid md:grid-cols-3 gap-5 mb-12">
          {taHardware.map((item) => (
            <div key={item.id} className="reveal border border-cream/10 bg-dark-secondary p-6" style={{ opacity: 0 }}>
              <h4 className="font-serif font-semibold text-cream text-base mb-2">{item.name}</h4>
              <p className="text-xs text-cream-muted mb-4">{item.description}</p>
              <div className="flex items-center justify-between mb-4">
                <span className="font-serif text-xl text-cream">{formatPrice(item.listMxn)}</span>
                <span className="font-mono text-[9px] text-gold border border-gold/30 px-2 py-0.5">
                  Lanz: {formatPrice(item.onboardingMxn ?? item.listMxn)}
                </span>
              </div>
              <ul className="space-y-1">
                {item.includes.slice(0, 4).map((inc) => (
                  <li key={inc} className="flex items-start gap-2 text-xs text-cream-muted/70">
                    <Check className="w-3 h-3 text-gold/60 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                    <span>{inc}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Licencias */}
        <div className="reveal mb-8" style={{ opacity: 0 }}>
          <h3 className="font-mono text-[10px] uppercase tracking-[0.14em] text-gold mb-4">Licencias de software</h3>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {taLicenses.map((item) => (
            <div key={item.id} className={`reveal border p-6 text-center ${item.recommended ? 'border-gold/40 bg-dark-secondary/80' : 'border-cream/10 bg-dark-secondary'}`} style={{ opacity: 0 }}>
              <h4 className="font-serif font-semibold text-cream text-base mb-1">{item.name}</h4>
              <p className="text-xs text-cream-muted mb-3">{item.description}</p>
              <span className="font-serif text-2xl text-cream block mb-1">{formatPrice(item.listMxn)}</span>
              {item.recommended && (
                <span className="inline-block font-mono text-[9px] uppercase tracking-[0.12em] text-gold border border-gold/30 px-2 py-0.5 mb-2">
                  Más popular
                </span>
              )}
              <p className="text-[10px] text-green-400">
                Lanz: {formatPrice(item.onboardingMxn ?? item.listMxn)}
              </p>
            </div>
          ))}
        </div>

        {/* Self-hosted */}
        <div className="reveal border border-cream/10 bg-dark-secondary p-6 lg:p-8 mb-16" style={{ opacity: 0 }}>
          <h3 className="font-serif font-semibold text-cream text-lg mb-2">{taSelf.name}</h3>
          <p className="text-sm text-cream-muted mb-4">{taSelf.description}</p>
          <div className="flex items-center gap-4 mb-4">
            <span className="font-serif text-2xl text-cream">{formatPrice(taSelf.listMxn)}</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-gold border border-gold/30 px-2 py-1">
              Licencia perpetua
            </span>
          </div>
          <ul className="grid md:grid-cols-2 gap-2 mb-4">
            {taSelf.includes.map((inc) => (
              <li key={inc} className="flex items-start gap-2 text-sm text-cream-muted">
                <Check className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                <span>{inc}</span>
              </li>
            ))}
          </ul>
          {taSelf.note && (
            <p className="text-[11px] text-cream-muted/50 italic">{taSelf.note}</p>
          )}
        </div>

        {/* Discounts note */}
        <p className="reveal text-[11px] text-cream-muted/50 text-center mt-8" style={{ opacity: 0 }}>
          * Promo lanzamiento · {discounts.onboarding.conditions} · Descuentos aplicados sobre precio lista
        </p>

        <div className="reveal mt-10 text-center" style={{ opacity: 0 }}>
          <p className="text-sm text-cream-muted mb-6">
            {t('services.cta.question')}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/precios" className="pill-accent">{t('services.cta.plans')}</Link>
            <a
              href="https://wa.me/528442278408?text=Hola,%20quiero%20saber%20más%20sobre%20servicios%20individuales"
              target="_blank"
              rel="noopener noreferrer"
              className="pill text-cream-muted hover:text-gold"
            >
              {t('services.cta.whatsapp')}
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
