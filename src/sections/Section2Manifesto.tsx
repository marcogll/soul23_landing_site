import { useRef, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Section2Manifesto() {
  const sectionRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const ctx = gsap.context(() => {
      section.querySelectorAll('.reveal').forEach((el, i) => {
        gsap.fromTo(el, { y: 20, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.5, delay: i * 0.08, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 80%', toggleActions: 'play none none reverse' }
        })
      })
    }, section)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="resumen" className="relative w-full bg-dark-secondary z-20">
      <div className="max-w-6xl mx-auto px-6 lg:px-12 py-24 lg:py-32 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <div>
          <span className="reveal font-mono text-[10px] uppercase tracking-[0.18em] text-cream-muted mb-6 block" style={{ opacity: 0 }}>Resumen</span>
          <h2 className="reveal font-serif font-semibold text-cream leading-[1.05] mb-6" style={{ fontSize: 'clamp(28px, 3.5vw, 56px)', opacity: 0 }}>
            Diseño de <span className="text-gold">operación,</span><br />no solo desarrollo.
          </h2>
          <p className="reveal text-cream-muted text-sm leading-relaxed max-w-md mb-8" style={{ opacity: 0 }}>
            No hacemos páginas web. Hacemos sistemas que organizan citas, ventas, personal 
            y comunicación para que tu negocio funcione sin depender de procesos manuales.
            <br /><br />
            Cada acción dentro del negocio se convierte en un registro y dispara una respuesta. 
            La operación puede arrancar por agenda, venta, personal, feedback o una idea nueva.
          </p>
          <a href="#servicios" onClick={(e) => { e.preventDefault(); document.getElementById('servicios')?.scrollIntoView({ behavior: 'smooth' }) }}
            className="reveal inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-gold hover:text-gold-light transition-colors" style={{ opacity: 0 }}>
            Ver sistemas <span>→</span>
          </a>
        </div>
        <div className="reveal" style={{ opacity: 0 }}>
          <img src="/images/operacion-flow.jpg" alt="Flujo de operación automatizada" className="w-full" />
        </div>
      </div>
    </section>
  )
}
