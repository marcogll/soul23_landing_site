import { useRef, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Calendar, CreditCard, Users, MessageSquare } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const processes = [
  {
    icon: Calendar,
    title: 'Agenda',
    trigger: 'Un cliente agenda',
    steps: ['se valida', 'se confirma', 'se registra'],
  },
  {
    icon: CreditCard,
    title: 'Venta',
    trigger: 'Una venta ocurre',
    steps: ['se guarda', 'se calcula', 'se reporta'],
  },
  {
    icon: Users,
    title: 'Personal',
    trigger: 'Un empleado entra',
    steps: ['se registra', 'se almacena', 'se analiza'],
  },
  {
    icon: MessageSquare,
    title: 'Feedback',
    trigger: 'Un cliente deja feedback',
    steps: ['se captura', 'se clasifica', 'se convierte en mejora'],
  },
]

export default function Section6Process() {
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
    <section ref={sectionRef} id="proceso" className="relative w-full bg-dark-secondary" style={{ zIndex: 60 }}>
      <div className="max-w-6xl mx-auto px-6 lg:px-12 py-24 lg:py-32">
        <h2 className="reveal text-center font-serif font-semibold text-cream mb-4" style={{ fontSize: 'clamp(22px, 2.5vw, 38px)', opacity: 0 }}>
          Cómo se organiza la operación
        </h2>
        <p className="reveal text-center text-cream-muted text-sm max-w-xl mx-auto mb-12" style={{ opacity: 0 }}>
          Cada acción dentro del negocio se convierte en un registro y dispara una respuesta.
        </p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {processes.map((proc, i) => {
            const Icon = proc.icon
            return (
              <div key={i} className="reveal bg-dark-primary/50 border border-cream/10 p-6" style={{ opacity: 0 }}>
                <Icon className="w-5 h-5 text-gold mb-4" strokeWidth={1.5} />
                <h3 className="font-serif font-semibold text-cream text-lg mb-1">{proc.title}</h3>
                <p className="text-xs text-cream-muted mb-4">{proc.trigger}</p>
                <div className="flex flex-wrap items-center gap-1 font-mono text-[10px] uppercase tracking-[0.1em] text-cream-muted">
                  {proc.steps.map((step, j) => (
                    <span key={j} className="flex items-center gap-1">
                      {step}
                      {j < proc.steps.length - 1 && <span className="text-gold">→</span>}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        <div className="reveal mt-12 text-center" style={{ opacity: 0 }}>
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-gold mb-3">
            Las ideas son endless
          </p>
          <p className="text-xs text-cream-muted max-w-md mx-auto mb-2">
            Si aparece un nuevo proceso, canal o necesidad, se puede conectar al sistema 
            y volverlo parte de la operación sin empezar desde cero.
          </p>
          <p className="text-xs text-cream font-medium">Todo queda conectado. No depende de seguimiento manual.</p>
        </div>
      </div>
    </section>
  )
}
