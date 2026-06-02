import { useRef, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { BarChart3, Brain, Bot, ShieldCheck, Workflow } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const services = [
  {
    icon: BarChart3,
    title: 'Business Intelligence',
    description: 'Dashboards en tiempo real que consolidan datos de ventas, personal, inventario y operación para tomar decisiones con información clara.',
  },
  {
    icon: Brain,
    title: 'IA & Automatización',
    description: 'Sistemas con inteligencia artificial para clasificar información, predecir tendencias, automatizar tareas y detectar patrones.',
  },
  {
    icon: Bot,
    title: 'Bots & Integraciones',
    description: 'Chatbots para WhatsApp y Telegram, conectores con CRMs y ERPs. Flujos automáticos que comunican tus sistemas sin intervención manual.',
  },
  {
    icon: ShieldCheck,
    title: 'Control Operativo',
    description: 'Gestión de inventario, control de asistencia, seguimiento de ventas, administración de citas y alertas automáticas.',
  },
  {
    icon: Workflow,
    title: 'Consultoría en Procesos',
    description: 'Diagnóstico, mapeo y optimización de procesos operativos. Identificamos cuellos de botella y diseñamos flujos automatizados con métricas de impacto real.',
  },
]

export default function Section6Services() {
  const sectionRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      const els = section.querySelectorAll('.reveal')
      els.forEach((el, i) => {
        gsap.fromTo(el, { y: 24, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.5, delay: i * 0.06, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' }
        })
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="servicios" className="relative w-full bg-dark-secondary" style={{ zIndex: 60 }}>
      <div className="max-w-6xl mx-auto px-6 lg:px-12 py-24 lg:py-32">
        <h2 className="reveal text-center font-serif font-semibold text-cream mb-4" style={{ fontSize: 'clamp(22px, 2.5vw, 38px)', opacity: 0 }}>
          Sistemas que transforman datos en control
        </h2>

        <p className="reveal text-center text-cream-muted text-sm max-w-xl mx-auto mb-16" style={{ opacity: 0 }}>
          Cinco pilares que integran datos, inteligencia artificial y automatización para darte control total de tu negocio.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-0">
          {services.map((service, i) => {
            const Icon = service.icon
            return (
              <div key={i} className="reveal relative px-6 lg:px-8 py-8 border-l border-cream/10 first:border-l-0" style={{ opacity: 0 }}>
                <Icon className="w-6 h-6 text-gold mb-6" strokeWidth={1.5} />
                <h3 className="font-serif font-semibold text-cream text-lg mb-4">{service.title}</h3>
                <p className="text-sm text-cream-muted leading-relaxed mb-6">{service.description}</p>
                <a href="#contacto" onClick={(e) => { e.preventDefault(); document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' }) }}
                  className="font-mono text-xs uppercase tracking-[0.14em] text-gold hover:text-gold-light transition-colors inline-flex items-center gap-1">
                  Saber más <span>→</span>
                </a>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
