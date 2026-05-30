import { useRef, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Calendar, CreditCard, BarChart3 } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const steps = [
  {
    icon: Calendar,
    title: 'Agenda automática',
    description: 'Tus clientes agendan por WhatsApp. El sistema confirma, envía recordatorios y reagenda si cancelan. Tú no tocas nada.',
  },
  {
    icon: CreditCard,
    title: 'Ventas registradas solas',
    description: 'Cada cobro se guarda automáticamente. Sabes cuánto vendiste, quién vendió y qué horas son más productivas. Sin calcular nada.',
  },
  {
    icon: BarChart3,
    title: 'Todo visible en tu celular',
    description: 'Un dashboard te muestra lo que pasa en tu negocio en tiempo real. Desde donde estés. Sin depender de que alguien te reporte.',
  },
]

export default function Section3HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const ctx = gsap.context(() => {
      section.querySelectorAll('.reveal').forEach((el, i) => {
        gsap.fromTo(el, { y: 15, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.4, delay: i * 0.1, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' }
        })
      })
    }, section)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="como-funciona" className="relative w-full bg-dark-primary z-30">
      <div className="max-w-4xl mx-auto px-6 py-24 lg:py-32">
        <h2 className="reveal font-serif font-semibold text-cream text-2xl lg:text-3xl text-center mb-4" style={{ opacity: 0 }}>
          Así de simple funciona
        </h2>
        <p className="reveal text-cream-muted text-sm text-center mb-14" style={{ opacity: 0 }}>
          Tres pilares. Todo conectado. Tu negocio opera solo.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <div key={i} className="reveal text-center" style={{ opacity: 0 }}>
                <div className="w-12 h-12 rounded-full bg-gold/15 flex items-center justify-center mx-auto mb-5">
                  <Icon className="w-5 h-5 text-gold" strokeWidth={1.5} />
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold mb-3 block">Paso {i + 1}</span>
                <h3 className="font-serif font-semibold text-cream text-lg mb-3">{step.title}</h3>
                <p className="text-sm text-cream-muted leading-relaxed">{step.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
