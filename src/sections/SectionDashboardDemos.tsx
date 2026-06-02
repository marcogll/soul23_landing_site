import { useRef, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ExternalLink, Monitor } from 'lucide-react'


gsap.registerPlugin(ScrollTrigger)

const dashboards = [
  {
    name: 'Dashboard Beauty',
    type: 'Operación · Salón / Spa',
    description: 'Citas, clientes, staff, ventas, comisiones y rentabilidad por sucursal en tiempo real.',
    image: '/images/business-dashboard.png',
    link: 'https://agytao39e2jhy56eqobo1fqg.soul23.cloud/',
  },
  {
    name: 'Dashboard Industrial',
    type: 'Manufactura · Producción',
    description: 'Panel ejecutivo con producción, partes, kanban, analytics y alertas operativas.',
    image: '/images/industry-dashboard.png',
    link: 'https://h40uopuz4q1ymockyok4mrjn.soul23.cloud/',
  },
  {
    name: 'Massive Dynamic',
    type: 'Time & Attendance · RH',
    description: 'Control de asistencia, retardos, horas extra y cumplimiento de la reforma de 40 hrs. Datos sintéticos basados en cliente real.',
    image: '/images/massive-dynamic-dashboard.png',
    link: 'https://s4d4vlibmubd7vsqanml5u45.soul23.cloud/',
  },
]

export default function SectionDashboardDemos() {
  const sectionRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const ctx = gsap.context(() => {
      section.querySelectorAll('.reveal').forEach((el, i) => {
        gsap.fromTo(el, { y: 20, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.5, delay: i * 0.1, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' }
        })
      })
    }, section)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="demos-dashboards" className="relative w-full bg-dark-secondary z-40">
      <div className="max-w-5xl mx-auto px-6 py-24 lg:py-32">
        <div className="reveal text-center mb-14" style={{ opacity: 0 }}>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-gold mb-4 block">
            Demos en vivo
          </span>
          <h2 className="font-serif font-semibold text-cream leading-[1.05] mb-4" style={{ fontSize: 'clamp(26px, 3vw, 42px)' }}>
            Explora los dashboards<br />
            <span className="text-gold">que tu negocio puede tener</span>
          </h2>
          <p className="text-sm text-cream-muted max-w-xl mx-auto leading-relaxed">
            Sistemas reales funcionando. Haz clic en cualquiera para entrar al demo interactivo.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {dashboards.map((dash) => (
            <a
              key={dash.name}
              href={dash.link}
              target="_blank"
              rel="noopener noreferrer"
              className="reveal group block"
              style={{ opacity: 0 }}
            >
              <div className="relative overflow-hidden mb-4 bg-dark-primary border border-cream/10 group-hover:border-gold/30 transition-colors">
                <img
                  src={dash.image}
                  alt={dash.name}
                  className="w-full h-48 object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-dark-primary/35 transition-colors group-hover:bg-dark-primary/20" />
                <div className="absolute right-3 top-3 flex items-center gap-1.5 border border-cream/15 bg-dark-primary/75 px-2.5 py-1.5 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  <ExternalLink className="w-3 h-3 text-gold" />
                  <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-cream">Ver demo</span>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Monitor className="w-4 h-4 text-gold" strokeWidth={1.5} />
                <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-gold">{dash.type}</p>
              </div>
              <h3 className="font-serif font-semibold text-cream text-lg mb-2">{dash.name}</h3>
              <p className="text-sm text-cream-muted">{dash.description}</p>
            </a>
          ))}
        </div>

        <div className="reveal mt-12 text-center" style={{ opacity: 0 }}>
          <a
            href="/demos"
            className="pill-accent"
          >
            Ver todas las demos
          </a>
        </div>
      </div>
    </section>
  )
}
