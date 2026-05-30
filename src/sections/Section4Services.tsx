import { useRef, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Globe, ShoppingCart, CalendarDays, ShieldCheck } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const services = [
  {
    icon: Globe,
    title: 'Captación y presencia',
    description: 'Sitios y páginas que explican, filtran y dirigen a clientes sin depender de conversación.',
  },
  {
    icon: ShoppingCart,
    title: 'Venta y registro',
    description: 'Cobros, pedidos y movimientos registrados automáticamente sin seguimiento manual.',
  },
  {
    icon: CalendarDays,
    title: 'Agenda y operación',
    description: 'Organización de citas, servicios y tiempos sin validaciones manuales constantes.',
  },
  {
    icon: ShieldCheck,
    title: 'Control interno',
    description: 'Registro de actividad, asistencia, ventas y operación con reportes automáticos.',
  },
]

export default function Section4Services() {
  const sectionRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const ctx = gsap.context(() => {
      section.querySelectorAll('.reveal').forEach((el, i) => {
        gsap.fromTo(el, { y: 20, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.5, delay: i * 0.06, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' }
        })
      })
    }, section)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="servicios" className="relative w-full bg-dark-secondary" style={{ zIndex: 40 }}>
      <div className="max-w-6xl mx-auto px-6 lg:px-12 py-24 lg:py-32">
        <h2 className="reveal text-center font-serif font-semibold text-cream mb-12" style={{ fontSize: 'clamp(22px, 2.5vw, 38px)', opacity: 0 }}>
          Áreas que organizamos
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0">
          {services.map((service, i) => {
            const Icon = service.icon
            return (
              <div key={i} className="reveal relative px-6 lg:px-8 py-8 border-l border-cream/10 first:border-l-0" style={{ opacity: 0 }}>
                <Icon className="w-6 h-6 text-gold mb-6" strokeWidth={1.5} />
                <h3 className="font-serif font-semibold text-cream text-lg mb-3">{service.title}</h3>
                <p className="text-sm text-cream-muted leading-relaxed mb-6">{service.description}</p>
                <span className="font-mono text-xs uppercase tracking-[0.14em] text-gold cursor-default">Detalles →</span>
              </div>
            )
          })}
        </div>

        <div className="reveal mt-12 flex flex-wrap justify-center gap-4" style={{ opacity: 0 }}>
          <a href="#stack" onClick={(e) => { e.preventDefault(); document.getElementById('stack')?.scrollIntoView({ behavior: 'smooth' }) }} className="pill text-cream-muted hover:text-gold">
            Ver stack tecnológico
          </a>
          <a href="#paquetes" onClick={(e) => { e.preventDefault(); document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' }) }} className="pill text-cream-muted hover:text-gold">
            Ver paquetes
          </a>
        </div>
      </div>
    </section>
  )
}
