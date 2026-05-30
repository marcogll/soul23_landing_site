import { useRef, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Target, TrendingUp, Megaphone, BarChart3, Globe, Mail } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const services = [
  {
    icon: Target,
    title: 'Estrategia digital',
    description: 'Definimos el plan de acción para que tu negocio llegue a las personas correctas, en el momento correcto, con el mensaje correcto. Análisis de mercado, buyer persona y funnel de conversión.',
  },
  {
    icon: Megaphone,
    title: 'Publicidad pagada',
    description: 'Campañas en Meta Ads, Google Ads y TikTok optimizadas para conversión. Segmentación precisa, creatividades que venden y reportes claros de ROAS.',
  },
  {
    icon: TrendingUp,
    title: 'SEO y contenido',
    description: 'Posicionamiento orgánico en Google, estrategia de contenidos, copywriting persuasivo y blogs que atraen tráfico cualificado a tu sitio.',
  },
  {
    icon: BarChart3,
    title: 'Analytics y CRO',
    description: 'Configuración completa de Google Analytics 4, eventos personalizados, heatmaps, A/B testing y optimización continua de la tasa de conversión.',
  },
  {
    icon: Globe,
    title: 'Presencia digital',
    description: 'Google Business Profile, redes sociales, directorios locales y reputación online. Todo lo que necesitas para que te encuentren.',
  },
  {
    icon: Mail,
    title: 'Email marketing',
    description: 'Automatizaciones de email y WhatsApp: bienvenida, carrito abandonado, reactivación, post-compra. Flujos que nutren y convierten.',
  },
]

const results = [
  { metric: '3.2x', label: 'ROAS promedio' },
  { metric: '150%', label: 'Aumento en leads' },
  { metric: '-40%', label: 'Costo por adquisición' },
]

export default function SectionAgenciaMarketing() {
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
    <section ref={sectionRef} id="marketing" className="relative w-full bg-dark-secondary" style={{ zIndex: 55 }}>
      <div className="max-w-6xl mx-auto px-6 lg:px-12 py-24 lg:py-32">
        {/* Header */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <span className="reveal font-mono text-[10px] uppercase tracking-[0.18em] text-gold mb-4 block" style={{ opacity: 0 }}>
              Agencia de marketing
            </span>
            <h2 className="reveal font-serif font-semibold text-cream leading-[1.05] mb-4" style={{ fontSize: 'clamp(26px, 3vw, 48px)', opacity: 0 }}>
              Tráfico que convierte.<br />
              <span className="text-gold">Datos que deciden.</span>
            </h2>
            <p className="reveal text-sm text-cream-muted leading-relaxed" style={{ opacity: 0 }}>
              No solo construimos sistemas. También traemos clientes a tu negocio con estrategias 
              de marketing digital basadas en datos, no en suposiciones. Cada peso invertido 
              se mide, se optimiza y se escala.
            </p>
          </div>
          <div className="reveal flex justify-center gap-8" style={{ opacity: 0 }}>
            {results.map((r, i) => (
              <div key={i} className="text-center">
                <p className="font-serif text-3xl lg:text-4xl text-gold">{r.metric}</p>
                <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-cream-muted mt-1">{r.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
          {services.map((service, i) => {
            const Icon = service.icon
            return (
              <div key={i} className="reveal relative px-6 py-8 border-l border-t border-cream/10 first:border-l-0 lg:[&:nth-child(-n+3)]:border-t-0" style={{ opacity: 0 }}>
                <Icon className="w-5 h-5 text-gold mb-4" strokeWidth={1.5} />
                <h3 className="font-serif font-semibold text-cream text-base mb-2">{service.title}</h3>
                <p className="text-sm text-cream-muted leading-relaxed">{service.description}</p>
              </div>
            )
          })}
        </div>

        {/* CTA */}
        <div className="reveal mt-12 text-center" style={{ opacity: 0 }}>
          <a href="#contacto" onClick={(e) => { e.preventDefault(); document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' }) }} className="pill-accent">
            Cotizar estrategia de marketing
          </a>
        </div>
      </div>
    </section>
  )
}
