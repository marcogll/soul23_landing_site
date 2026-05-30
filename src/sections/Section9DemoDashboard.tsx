import { useRef, useLayoutEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Play, BarChart3, TrendingUp, Users, AlertCircle } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

export default function Section9DemoDashboard() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isActive, setIsActive] = useState(false)

  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      const els = section.querySelectorAll('.reveal')
      els.forEach((el, i) => {
        gsap.fromTo(el, { y: 24, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.5, delay: i * 0.08, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' }
        })
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="demo-dashboard" className="relative w-full bg-dark-secondary" style={{ zIndex: 85 }}>
      <div className="max-w-6xl mx-auto px-6 lg:px-12 py-24 lg:py-32">
        {/* Header */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-16">
          <div>
            <span className="reveal font-mono text-[10px] uppercase tracking-[0.18em] text-gold mb-4 block" style={{ opacity: 0 }}>
              Demo en vivo
            </span>
            <h2 className="reveal font-serif font-semibold text-cream leading-[1.05] mb-4" style={{ fontSize: 'clamp(26px, 3vw, 48px)', opacity: 0 }}>
              Prueba dashboards reales.
            </h2>
            <p className="reveal text-sm text-cream-muted leading-relaxed mb-6" style={{ opacity: 0 }}>
              Explora dashboards interactivos con datos de ejemplo para operación diaria:
              ventas, citas, personal, inventario, alertas y reportes por periodo.
              Son referencias directas del tipo de sistema que construimos.
            </p>
            <div className="reveal flex flex-wrap gap-4" style={{ opacity: 0 }}>
              <a
                href="https://agytao39e2jhy56eqobo1fqg.soul23.cloud/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsActive(true)}
                className="pill-accent inline-flex items-center gap-2"
              >
                <Play className="w-3 h-3" />
                Dashboard negocio
              </a>
              <a
                href="https://h40uopuz4q1ymockyok4mrjn.soul23.cloud/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsActive(true)}
                className="pill text-cream-muted hover:text-gold"
              >
                Dashboard empresa
              </a>
              <a href="#contacto" onClick={(e) => { e.preventDefault(); document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' }) }}
                className="pill text-cream-muted hover:text-gold">
                Solicitar acceso
              </a>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="reveal relative grid gap-4" style={{ opacity: 0 }}>
            <a
              href="https://agytao39e2jhy56eqobo1fqg.soul23.cloud/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsActive(true)}
              className={`group block bg-dark-primary border border-cream/10 shadow-2xl overflow-hidden transition-all duration-500 ${isActive ? 'ring-2 ring-gold/50' : ''}`}
            >
              <img
                src="/images/business-dashboard.png"
                alt="Dashboard de negocio beauty"
                className="w-full aspect-[16/10] object-cover object-top group-hover:scale-[1.02] transition-transform duration-500"
              />
              <div className="flex items-center justify-between px-4 py-3 border-t border-cream/10">
                <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-cream-muted">Dashboard negocio</span>
                <Play className="w-3 h-3 text-gold" fill="currentColor" />
              </div>
            </a>

            <a
              href="https://h40uopuz4q1ymockyok4mrjn.soul23.cloud/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsActive(true)}
              className="group block bg-dark-primary border border-cream/10 shadow-xl overflow-hidden"
            >
              <img
                src="/images/industry-dashboard.png"
                alt="Dashboard industrial"
                className="w-full aspect-[16/10] object-cover object-top group-hover:scale-[1.02] transition-transform duration-500"
              />
              <div className="flex items-center justify-between px-4 py-3 border-t border-cream/10">
                <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-cream-muted">Dashboard empresa</span>
                <Play className="w-3 h-3 text-gold" fill="currentColor" />
              </div>
            </a>
          </div>
        </div>

        {/* Mini widgets */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: BarChart3, label: 'Ventas hoy', value: '$42,580', change: '+12.5%', up: true },
            { icon: TrendingUp, label: 'Tendencia IA', value: 'Alcista', change: '94% confianza', up: true },
            { icon: Users, label: 'Clientes activos', value: '1,248', change: '+8.3%', up: true },
            { icon: AlertCircle, label: 'Alertas', value: '3', change: 'Requieren acción', up: false },
          ].map((widget, i) => {
            const Icon = widget.icon
            return (
              <div
                key={i}
                className={`reveal bg-dark-primary border border-cream/10 p-5 ${isActive ? 'ring-1 ring-gold/20' : ''}`}
                style={{ opacity: 0 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <Icon className="w-4 h-4 text-gold" strokeWidth={1.5} />
                  <span className={`font-mono text-[9px] uppercase tracking-[0.12em] ${widget.up ? 'text-green-400' : 'text-amber-400'}`}>
                    {widget.change}
                  </span>
                </div>
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-cream-muted mb-1">{widget.label}</p>
                <p className="font-serif text-xl text-cream">{widget.value}</p>
              </div>
            )
          })}
        </div>

        {/* Placeholder notice */}
        <div className="reveal mt-8 text-center" style={{ opacity: 0 }}>
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-cream-muted/40">
            Dashboards externos con datos de ejemplo · Se abren en nueva pestaña
          </p>
        </div>
      </div>
    </section>
  )
}
