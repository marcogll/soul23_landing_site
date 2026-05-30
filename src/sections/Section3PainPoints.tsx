import { useRef, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MessageSquare, XCircle, CreditCard, EyeOff, Users, Database } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const painPoints = [
  { icon: MessageSquare, text: 'Mensajes constantes para agendar o confirmar' },
  { icon: XCircle, text: 'Cancelaciones sin control' },
  { icon: CreditCard, text: 'Ventas o pagos registrados manualmente' },
  { icon: EyeOff, text: 'No saber qué pasa si no estás presente' },
  { icon: Users, text: 'Control de personal sin sistema claro' },
  { icon: Database, text: 'Datos dispersos o inexistentes' },
]

export default function Section3PainPoints() {
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
    <section ref={sectionRef} className="relative w-full bg-dark-primary z-30">
      <div className="max-w-6xl mx-auto px-6 lg:px-12 py-24 lg:py-32">
        <h2 className="reveal font-serif font-semibold text-cream text-center mb-4" style={{ fontSize: 'clamp(22px, 2.5vw, 38px)', opacity: 0 }}>
          Puntos donde normalmente se pierde control
        </h2>
        <p className="reveal text-cream-muted text-sm text-center max-w-lg mx-auto mb-12" style={{ opacity: 0 }}>
          Si alguno de estos suena familiar, tu operación necesita un sistema.
        </p>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {painPoints.map((point, i) => {
            const Icon = point.icon
            return (
              <div key={i} className="reveal flex items-start gap-4 p-5 bg-dark-secondary/50 border border-cream/10" style={{ opacity: 0 }}>
                <Icon className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                <p className="text-sm text-cream-muted leading-relaxed">{point.text}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
