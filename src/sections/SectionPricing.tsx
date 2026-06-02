import { useRef, useLayoutEffect } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Check, Star } from 'lucide-react'
import { useCurrency } from '../contexts/CurrencyContext'
import { getRetainers, getProjects, getTimeAttendanceLicenses, getDiscounts } from '../lib/pricing'

gsap.registerPlugin(ScrollTrigger)

export default function SectionPricing() {
  const sectionRef = useRef<HTMLElement>(null)
  const { currency, formatPrice } = useCurrency()

  const retainers = getRetainers()
  const projects = getProjects().slice(0, 4)
  const taLicenses = getTimeAttendanceLicenses()
  const discounts = getDiscounts()

  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const ctx = gsap.context(() => {
      section.querySelectorAll('.reveal').forEach((el, i) => {
        gsap.fromTo(el, { y: 18, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.45, delay: i * 0.06, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' }
        })
      })
    }, section)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="pricing" className="relative w-full bg-dark-primary" style={{ zIndex: 88 }}>
      <div className="max-w-6xl mx-auto px-6 lg:px-12 py-24 lg:py-32">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="reveal font-mono text-[10px] uppercase tracking-[0.18em] text-gold mb-4 block" style={{ opacity: 0 }}>
            Planes
          </span>
          <h2 className="reveal font-serif font-semibold text-cream leading-[1.05] mb-4" style={{ fontSize: 'clamp(26px, 3vw, 46px)', opacity: 0 }}>
            Empieza con un flujo.<br />
            <span className="text-gold">Escala a sistema completo.</span>
          </h2>
          <p className="reveal text-sm text-cream-muted max-w-xl mx-auto leading-relaxed" style={{ opacity: 0 }}>
            Precios en {currency}. Descuentos de lanzamiento disponibles. Todos los retainers incluyen hosting, mantenimiento y soporte.
          </p>
        </div>

        {/* Retainers */}
        <div className="reveal mb-4" style={{ opacity: 0 }}>
          <h3 className="font-serif text-lg text-cream mb-2">Retainers mensuales</h3>
          <p className="text-xs text-cream-muted mb-6">Servicios continuos con pago mensual — operación + atracción + supervisión</p>
        </div>

        <div className="grid lg:grid-cols-2 xl:grid-cols-4 gap-5 mb-16">
          {retainers.map((plan) => (
            <div key={plan.id} className={`reveal border bg-dark-secondary p-6 flex flex-col relative ${plan.recommended ? 'border-gold/40' : 'border-cream/10'}`} style={{ opacity: 0 }}>
              {plan.recommended && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-dark-primary text-[9px] font-mono uppercase tracking-wider px-3 py-1 flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  Recomendado
                </div>
              )}
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-gold mb-4">{plan.name}</p>
              <div className="flex items-end gap-2 mb-1">
                <span className="font-serif text-3xl text-cream">
                  {formatPrice(plan.listMxn)}
                </span>
              </div>
              <p className="text-xs text-cream-muted mb-2">/mes</p>
              <p className="text-xs text-green-400 mb-4">
                Lanzamiento: {formatPrice(plan.onboardingMxn ?? plan.listMxn)}/mes primer mes
              </p>
              <p className="text-sm text-cream-muted leading-relaxed mb-4">{plan.description}</p>
              <div className="space-y-2 mt-auto">
                {plan.includes.slice(0, 5).map((feature: string) => (
                  <div key={feature} className="flex items-start gap-2 text-sm text-cream-muted">
                    <Check className="w-3 h-3 text-gold flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                    <span className="text-xs">{feature}</span>
                  </div>
                ))}
                {plan.includes.length > 5 && (
                  <p className="text-[10px] text-gold/70 ml-5">+{plan.includes.length - 5} más</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Proyectos */}
        <div className="reveal mb-4" style={{ opacity: 0 }}>
          <h3 className="font-serif text-lg text-cream mb-2">Proyectos cerrados</h3>
          <p className="text-xs text-cream-muted mb-6">Entregables de precio fijo — pago único o por hitos</p>
        </div>

        <div className="grid md:grid-cols-2 gap-5 mb-16">
          {projects.map((project) => (
            <div key={project.id} className="reveal border border-cream/10 bg-dark-secondary p-6" style={{ opacity: 0 }}>
              <div className="flex items-start justify-between mb-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-gold">{project.name}</p>
                <span className="font-serif text-xl text-cream">
                  {formatPrice(project.listMxn)}
                </span>
              </div>
              <p className="text-sm text-cream-muted mb-4">{project.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-green-400 border border-green-400/30 px-2 py-1">
                  Lanzamiento {formatPrice(project.onboardingMxn ?? project.listMxn)}
                </span>
                {project.note && (
                  <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-cream-muted border border-cream/20 px-2 py-1">
                    {project.note}
                  </span>
                )}
              </div>
              <div className="space-y-1">
                {project.includes.slice(0, 4).map((inc: string) => (
                  <div key={inc} className="flex items-start gap-2 text-xs text-cream-muted/70">
                    <Check className="w-3 h-3 text-gold/60 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                    <span>{inc}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Time & Attendance */}
        <div className="reveal mb-4" style={{ opacity: 0 }}>
          <h3 className="font-serif text-lg text-cream mb-2">Time & Attendance — Licencias</h3>
          <p className="text-xs text-cream-muted mb-6">Control de tiempo laboral · Cumplimiento Reforma 40 hrs</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {taLicenses.map((lic) => (
            <div key={lic.id} className={`reveal border p-6 text-center ${lic.recommended ? 'border-gold/40 bg-dark-secondary/80' : 'border-cream/10 bg-dark-secondary'}`} style={{ opacity: 0 }}>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-gold mb-3">{lic.name}</p>
              <span className="font-serif text-2xl text-cream block mb-1">
                {formatPrice(lic.listMxn)}
              </span>
              <p className="text-xs text-cream-muted mb-3">{lic.description}</p>
              {lic.recommended && (
                <span className="inline-block font-mono text-[9px] uppercase tracking-[0.12em] text-gold border border-gold/30 px-2 py-0.5 mb-2">
                  Más popular
                </span>
              )}
              <p className="text-[10px] text-green-400">
                Lanz: {formatPrice(lic.onboardingMxn ?? lic.listMxn)}
              </p>
            </div>
          ))}
        </div>

        {/* Discounts banner */}
        <div className="reveal border border-cream/10 bg-dark-secondary p-6 mb-10" style={{ opacity: 0 }}>
          <h4 className="font-serif text-sm text-cream mb-4">Descuentos activos</h4>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(discounts).map(([key, disc]: [string, any]) => (
              <div key={key} className="border border-cream/10 p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-gold">{disc.label}</span>
                  <span className="font-serif text-lg text-cream">-{disc.percentage}%</span>
                </div>
                <p className="text-[10px] text-cream-muted">{disc.description}</p>
                <p className="text-[9px] text-cream-muted/50 mt-1">{disc.conditions}</p>
              </div>
            ))}
          </div>
        </div>

        {/* DIY vs Soul:23 */}
        <div className="reveal border border-cream/10 bg-dark-secondary p-6 mb-10" style={{ opacity: 0 }}>
          <h4 className="font-serif text-sm text-cream mb-4 text-center">
            ¿Por qué contratar soul:23 en vez de hacerlo interno?
          </h4>
          <div className="grid sm:grid-cols-3 gap-4 text-center">
            <div className="border border-cream/10 p-4">
              <p className="font-mono text-[10px] uppercase tracking-wider text-cream-muted mb-2">Dev interno</p>
              <p className="font-serif text-lg text-cream">~$45k/mes</p>
              <p className="text-[10px] text-cream-muted mt-1">+ beneficios + equipo + gestión</p>
            </div>
            <div className="border border-cream/10 p-4">
              <p className="font-mono text-[10px] uppercase tracking-wider text-cream-muted mb-2">Freelance promedio</p>
              <p className="font-serif text-lg text-cream">~$80k+</p>
              <p className="text-[10px] text-cream-muted mt-1">Proyecto similar sin soporte continuo</p>
            </div>
            <div className="border border-gold/30 p-4 relative">
              <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-gold text-dark-primary text-[8px] font-mono uppercase tracking-wider px-2 py-0.5">
                Mejor opción
              </span>
              <p className="font-mono text-[10px] uppercase tracking-wider text-gold mb-2">soul:23</p>
              <p className="font-serif text-lg text-cream">Desde $4,900/mes</p>
              <p className="text-[10px] text-cream-muted mt-1">Sistema + soporte + escalamiento</p>
            </div>
          </div>
          <p className="text-xs text-cream-muted/70 mt-4 text-center">
            A largo plazo, un plan con soul:23 te sale mejor que armarlo tú solo. Para eso existe soul:23.
          </p>
        </div>

        {/* CTA */}
        <div className="reveal mt-10 text-center" style={{ opacity: 0 }}>
          <Link to="/contact-survey" className="pill-accent">Cotizar mi flujo</Link>
          <p className="text-xs text-cream-muted/50 mt-4">
            Los precios se actualizan automáticamente según el catálogo oficial de Soul:23
          </p>
        </div>
      </div>
    </section>
  )
}
