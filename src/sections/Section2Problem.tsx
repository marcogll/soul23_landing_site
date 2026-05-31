import { useRef, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const problems = [
  'Estás todo el día respondiendo mensajes para agendar citas',
  'Haces cuentas a mano para saber cuánto vendiste',
  'No sabes qué pasa en tu negocio si no estás ahí',
  'Tus empleados llegan tarde y no hay registro de nada',
  'Los clientes cancelan y no tienes control',
]

export default function Section2Problem() {
  const sectionRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const ctx = gsap.context(() => {
      section.querySelectorAll('.reveal').forEach((el, i) => {
        gsap.fromTo(el, { y: 15, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.4, delay: i * 0.08, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' }
        })
      })
    }, section)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="relative w-full bg-dark-secondary z-20">
      <div className="max-w-2xl mx-auto px-6 py-24 lg:py-32">
        <h2 className="reveal font-serif font-semibold text-cream text-2xl lg:text-3xl text-center mb-4" style={{ opacity: 0 }}>
          ¿Te pasa que&hellip;
        </h2>
        <p className="reveal text-cream-muted text-sm text-center mb-10" style={{ opacity: 0 }}>
          No estás solo. La mayoría de negocios en México operan así:
        </p>

        <div className="space-y-0">
          {problems.map((p, i) => (
            <div
              key={i}
              className="reveal flex items-center gap-4 py-4 border-b border-cream/10 last:border-b-0"
              style={{ opacity: 0 }}
            >
              <span className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
                <span className="text-gold text-xs font-serif">{i + 1}</span>
              </span>
              <p className="text-cream-muted text-sm">{p}</p>
            </div>
          ))}
        </div>

        <p className="reveal text-center text-cream text-base mt-10 font-medium" style={{ opacity: 0 }}>
          Eso se puede cambiar. Y no es tan complicado como crees.
        </p>

        <div className="reveal grid grid-cols-3 gap-3 mt-12" style={{ opacity: 0 }}>
          {[
            { src: '/images/collage-tr.jpg', alt: 'Planeación de procesos' },
            { src: '/images/work4.jpg', alt: 'Seguimiento móvil de operación' },
            { src: '/images/collage-tl.jpg', alt: 'Herramientas de trabajo conectadas' },
          ].map((image) => (
            <img
              key={image.src}
              src={image.src}
              alt={image.alt}
              className="h-24 md:h-32 w-full object-cover border border-cream/10"
            />
          ))}
        </div>
      </div>
    </section>
  )
}
