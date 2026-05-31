import { useRef, useLayoutEffect } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Check, Cloud, Mail, Workflow, Globe2 } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const plans = [
  {
    name: 'Basic',
    price: '$229',
    note: 'USD / mes',
    description: 'Para validar el sistema con una landing, formulario y flujo de contacto medible.',
    features: [
      'Landing o página de captura',
      'Formulario/survey conectado a webhook',
      'Reporte por email para cliente e interno',
      '1 flujo de contacto o seguimiento',
      'Ajustes básicos de copy y diseño',
    ],
  },
  {
    name: 'Techie',
    price: '$349',
    note: 'USD / mes',
    description: 'Para negocios que ya necesitan automatizar operación, respuestas y reportes.',
    features: [
      'Todo lo de Basic',
      'Hasta 3 formularios o flujos',
      'Dashboard ligero o reporte operativo',
      'Integraciones con WhatsApp/email/webhook',
      'Mejoras mensuales priorizadas',
    ],
  },
  {
    name: 'Hacker',
    price: 'Desde $699',
    note: 'USD / mes',
    description: 'Para operar con instancia propia, nube, automatizaciones y sistemas conectados.',
    features: [
      'Todo lo de Techie',
      'Instancia propia en la nube',
      'Emails transaccionales y plantillas HTML',
      'Sitios, landings y funnels por campaña',
      'Flujos n8n/contacto, alertas y CRM ligero',
      'Arquitectura para escalar por servicio o sucursal',
    ],
  },
]

const services = [
  { icon: Globe2, name: 'Landing / sitio de captura', basic: '$229', techie: '$349', hacker: 'Incluido / multi-landing' },
  { icon: Workflow, name: 'Survey + webhook + reporte', basic: '$229', techie: '$349', hacker: 'Incluido / multi-flujo' },
  { icon: Mail, name: 'Emails HTML cliente + interno', basic: '$149 setup', techie: 'Incluido', hacker: 'Incluido avanzado' },
  { icon: Workflow, name: 'Flujo n8n de contacto', basic: '$199 setup', techie: 'Incluido básico', hacker: 'Incluido avanzado' },
  { icon: Cloud, name: 'Instancia propia en nube', basic: 'No incluido', techie: 'Desde $299 setup', hacker: 'Incluido desde plan' },
]

export default function SectionPricing() {
  const sectionRef = useRef<HTMLElement>(null)

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
        <div className="text-center mb-14">
          <span className="reveal font-mono text-[10px] uppercase tracking-[0.18em] text-gold mb-4 block" style={{ opacity: 0 }}>
            Planes
          </span>
          <h2 className="reveal font-serif font-semibold text-cream leading-[1.05] mb-4" style={{ fontSize: 'clamp(26px, 3vw, 46px)', opacity: 0 }}>
            Empieza con un flujo.<br />
            <span className="text-gold">Escala a sistema completo.</span>
          </h2>
          <p className="reveal text-sm text-cream-muted max-w-xl mx-auto leading-relaxed" style={{ opacity: 0 }}>
            Los precios son referencias para dimensionar. Cada servicio puede contratarse solo o entrar dentro de un plan mensual.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-5 mb-14">
          {plans.map((plan) => (
            <div key={plan.name} className="reveal border border-cream/10 bg-dark-secondary p-6 flex flex-col" style={{ opacity: 0 }}>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-gold mb-4">{plan.name}</p>
              <div className="flex items-end gap-2 mb-4">
                <span className="font-serif text-4xl text-cream">{plan.price}</span>
                <span className="text-xs text-cream-muted mb-1">{plan.note}</span>
              </div>
              <p className="text-sm text-cream-muted leading-relaxed mb-6">{plan.description}</p>
              <div className="space-y-3 mt-auto">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex flex-col items-center gap-2 text-center text-sm text-cream-muted sm:flex-row sm:items-start sm:text-left sm:gap-3">
                    <Check className="w-4 h-4 text-gold flex-shrink-0 sm:mt-0.5" strokeWidth={1.5} />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="reveal border border-cream/10 bg-dark-secondary overflow-hidden" style={{ opacity: 0 }}>
          <div className="hidden sm:grid grid-cols-4 border-b border-cream/10 px-4 py-3 font-mono text-[9px] uppercase tracking-[0.14em] text-cream-muted/50">
            <span>Servicio</span>
            <span>Basic</span>
            <span>Techie</span>
            <span>Hacker</span>
          </div>
          {services.map(({ icon: Icon, name, basic, techie, hacker }) => (
            <div key={name} className="grid gap-3 border-b border-cream/10 last:border-b-0 px-4 py-5 text-center text-sm sm:grid-cols-4 sm:items-center sm:text-left sm:py-4">
              <div className="flex flex-col items-center gap-2 text-cream sm:flex-row sm:gap-3">
                <Icon className="w-4 h-4 text-gold flex-shrink-0" strokeWidth={1.5} />
                <span>{name}</span>
              </div>
              <span className="text-cream-muted"><span className="sm:hidden text-gold font-mono text-[9px] uppercase tracking-[0.12em] block mb-1">Basic</span>{basic}</span>
              <span className="text-cream-muted"><span className="sm:hidden text-gold font-mono text-[9px] uppercase tracking-[0.12em] block mb-1">Techie</span>{techie}</span>
              <span className="text-cream-muted"><span className="sm:hidden text-gold font-mono text-[9px] uppercase tracking-[0.12em] block mb-1">Hacker</span>{hacker}</span>
            </div>
          ))}
        </div>

        <div className="reveal mt-10 text-center" style={{ opacity: 0 }}>
          <Link to="/contact-survey" className="pill-accent">Cotizar mi flujo</Link>
        </div>
      </div>
    </section>
  )
}
