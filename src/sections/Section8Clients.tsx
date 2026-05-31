import { useRef, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const clients = [
  { name: 'Vertex', industry: 'Retail' },
  { name: 'Aurum', industry: 'Salud' },
  { name: 'Nexus', industry: 'Logística' },
  { name: 'Lumina', industry: 'Finanzas' },
  { name: 'Cortex', industry: 'Manufactura' },
  { name: 'Pulse', industry: 'Hospitality' },
]

const projects = [
  {
    client: 'Vertex Retail',
    title: 'Dashboard de ventas en tiempo real',
    description: 'Sistema de control de inventario con alertas automáticas de stock bajo y predicción de demanda usando IA. Integrado con su ERP existente.',
    tags: ['Dashboard', 'IA', 'Integración ERP'],
    image: '/images/project-dashboard.jpg',
  },
  {
    client: 'Aurum Clinics',
    title: 'Bot de citas y seguimiento médico',
    description: 'Chatbot de WhatsApp para agendar citas, enviar recordatorios y hacer seguimiento post-consulta. Reducción del 70% en no-shows.',
    tags: ['Bot WhatsApp', 'Automatización', 'Salud'],
    image: '/images/project-bot.jpg',
  },
  {
    client: 'Nexus Logistics',
    title: 'Control de flota y rutas',
    description: 'Dashboard de monitoreo de flota en tiempo real con alertas de desviación, reportes de combustible y integración con GPS.',
    tags: ['Control Operativo', 'GPS', 'Reportes'],
    image: '/images/operacion-flow.jpg',
  },
  {
    client: 'Lumina Capital',
    title: 'Análisis predictivo de mercados',
    description: 'Sistema de análisis de datos financieros con modelos predictivos para identificar tendencias de mercado y oportunidades de inversión.',
    tags: ['IA', 'Data Analytics', 'Predicción'],
    image: '/images/dashboard-hero.jpg',
  },
]

export default function Section8Clients() {
  const sectionRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      const els = section.querySelectorAll('.reveal')
      els.forEach((el, i) => {
        gsap.fromTo(el, { y: 20, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.5, delay: i * 0.06, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' }
        })
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="clientes" className="relative w-full bg-dark-primary" style={{ zIndex: 80 }}>
      {/* Client Logos */}
      <div className="max-w-6xl mx-auto px-6 lg:px-12 pt-24 lg:pt-32">
        <h2 className="reveal text-center font-serif font-semibold text-cream mb-4" style={{ fontSize: 'clamp(22px, 2.5vw, 38px)', opacity: 0 }}>
          Clientes que confían
        </h2>
        <p className="reveal text-center text-cream-muted text-sm max-w-md mx-auto mb-12" style={{ opacity: 0 }}>
          Empresas de distintos sectores que ya operan con nuestros sistemas.
        </p>

        <div className="reveal grid grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-items-center pb-16 border-b border-cream/10" style={{ opacity: 0 }}>
          {clients.map((client, i) => (
            <div key={i} className="flex flex-col items-center gap-2 group cursor-default">
              <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-full border border-cream/20 flex items-center justify-center group-hover:border-gold/50 transition-colors">
                <span className="font-serif text-lg lg:text-xl text-cream-muted group-hover:text-gold transition-colors">
                  {client.name.charAt(0)}
                </span>
              </div>
              <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-cream-muted/60">{client.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Projects */}
      <div className="max-w-6xl mx-auto px-6 lg:px-12 py-16 lg:py-24">
        <h3 className="reveal font-serif font-semibold text-cream text-xl lg:text-2xl mb-12" style={{ opacity: 0 }}>
          Proyectos recientes
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {projects.map((project, i) => (
            <div key={i} className="reveal group" style={{ opacity: 0 }}>
              {/* Image */}
              <div className="overflow-hidden mb-4 bg-dark-secondary">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-48 lg:h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Content */}
              <div className="flex flex-wrap gap-2 mb-3">
                {project.tags.map((tag, j) => (
                  <span key={j} className="font-mono text-[9px] uppercase tracking-[0.14em] text-gold border border-gold/30 px-2 py-1">
                    {tag}
                  </span>
                ))}
              </div>

              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-cream-muted/60 mb-1">
                {project.client}
              </p>
              <h4 className="font-serif font-semibold text-cream text-lg mb-2 group-hover:text-gold transition-colors">
                {project.title}
              </h4>
              <p className="text-sm text-cream-muted leading-relaxed">
                {project.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
