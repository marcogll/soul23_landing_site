import { useRef, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Database, Cpu, BarChart3, Zap } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const processes = [
  { icon: Database, title: 'Captura', subtitle: 'Los datos entran al sistema', steps: ['ventas', 'asistencia', 'inventario', 'feedback'] },
  { icon: Cpu, title: 'Procesamiento IA', subtitle: 'La inteligencia actúa', steps: ['clasifica', 'analiza', 'predice', 'alerta'] },
  { icon: BarChart3, title: 'Visualización', subtitle: 'La información se muestra', steps: ['dashboards', 'reportes', 'KPIs', 'tendencias'] },
  { icon: Zap, title: 'Acción Automática', subtitle: 'El sistema reacciona solo', steps: ['notifica', 'ajusta', 'integra', 'optimiza'] },
]

export default function Section7Process() {
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
    <section ref={sectionRef} id="proceso" className="relative w-full bg-dark-primary" style={{ zIndex: 70 }}>
      <div className="max-w-6xl mx-auto px-6 lg:px-12 py-24 lg:py-32">
        <div className="text-center mb-16">
          <h2 className="reveal font-serif font-semibold text-cream mb-4" style={{ fontSize: 'clamp(22px, 2.5vw, 38px)', opacity: 0 }}>
            De datos a decisiones automáticas
          </h2>
          <p className="reveal text-cream-muted text-sm max-w-xl mx-auto" style={{ opacity: 0 }}>
            Un ciclo continuo donde la información se captura, procesa con IA, se visualiza y genera acciones automáticas.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {processes.map((process, i) => {
            const Icon = process.icon
            return (
              <div key={i} className="reveal bg-dark-secondary/50 border border-cream/10 p-6" style={{ opacity: 0 }}>
                <Icon className="w-5 h-5 text-gold mb-4" strokeWidth={1.5} />
                <h3 className="font-serif font-semibold text-cream text-lg mb-1">{process.title}</h3>
                <p className="text-xs text-cream-muted mb-4">{process.subtitle}</p>
                <div className="flex flex-wrap items-center gap-1 font-mono text-[10px] uppercase tracking-[0.1em] text-cream-muted">
                  {process.steps.map((step, j) => (
                    <span key={j} className="flex items-center gap-1">
                      {step}
                      {j < process.steps.length - 1 && <span className="text-gold">→</span>}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        <div className="reveal mt-12 text-center" style={{ opacity: 0 }}>
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-gold mb-2">
            El ciclo se repite automáticamente
          </p>
          <p className="text-xs text-cream-muted max-w-md mx-auto">
            Cada nuevo dato alimenta el sistema. La IA aprende de patrones y mejora sus predicciones con el tiempo.
          </p>
        </div>
      </div>
    </section>
  )
}
