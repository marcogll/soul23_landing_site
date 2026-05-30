import { useRef, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const stack = [
  {
    category: 'Web y comercio',
    items: ['HTML, CSS, JS', 'Interfaces estáticas', 'Ecommerce', 'Catálogo y checkout', 'Branding', 'Sistema visual'],
  },
  {
    category: 'Salud digital',
    items: ['Agenda y servicios', 'Automatización administrativa', 'Flujos de información'],
  },
  {
    category: 'IA aplicada',
    items: ['Reportes y clasificación', 'Análisis de sentimiento', 'Predicción de patrones'],
  },
  {
    category: 'Formularios',
    items: ['Captura estructurada', 'WhatsApp', 'Contacto directo', 'Reportes', 'Seguimiento interno'],
  },
  {
    category: 'Operación',
    items: ['SEO técnico', 'Base indexable', 'Mantenimiento', 'Ajustes y expansión'],
  },
]

export default function Section5Stack() {
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
    <section ref={sectionRef} id="stack" className="relative w-full bg-dark-primary" style={{ zIndex: 50 }}>
      <div className="max-w-6xl mx-auto px-6 lg:px-12 py-24 lg:py-32">
        <h2 className="reveal text-center font-serif font-semibold text-cream mb-12" style={{ fontSize: 'clamp(22px, 2.5vw, 38px)', opacity: 0 }}>
          Stack · Herramientas listas para producción
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-0">
          {stack.map((group, i) => (
            <div key={i} className="reveal relative px-5 py-6 border-l border-cream/10 first:border-l-0" style={{ opacity: 0 }}>
              <h3 className="font-serif font-semibold text-cream text-base mb-4">{group.category}</h3>
              <ul className="space-y-2">
                {group.items.map((item, j) => (
                  <li key={j} className="text-sm text-cream-muted leading-relaxed">{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
