import { useRef, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Section8CaseStudy() {
  const sectionRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      const els = section.querySelectorAll('.reveal')
      els.forEach((el, i) => {
        gsap.fromTo(el, { y: 24, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.5, delay: i * 0.08, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 80%', toggleActions: 'play none none reverse' }
        })
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="despliegues" className="relative w-full bg-dark-secondary" style={{ zIndex: 80 }}>
      <div className="max-w-6xl mx-auto px-6 lg:px-12 py-24 lg:py-32 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Left: Image */}
        <div className="reveal" style={{ opacity: 0 }}>
          <img src="/images/integrations.jpg" alt="System Integrations" className="w-full h-auto shadow-2xl" />
        </div>

        {/* Right: Text */}
        <div>
          <span className="reveal font-mono text-[10px] uppercase tracking-[0.18em] text-gold mb-4 block" style={{ opacity: 0 }}>
            Sistemas en producción
          </span>

          <h2 className="reveal font-serif font-semibold text-cream leading-[1.05] mb-6" style={{ fontSize: 'clamp(26px, 3vw, 48px)', opacity: 0 }}>
            Control total de tu operación con datos e IA.
          </h2>

          <p className="reveal text-sm text-cream-muted leading-relaxed mb-4" style={{ opacity: 0 }}>
            Implementamos sistemas que integran datos de todas las áreas de tu negocio — ventas, 
            personal, inventario, clientes — y los procesan con inteligencia artificial para 
            generar dashboards en tiempo real, alertas automáticas y predicciones de tendencias.
          </p>

          <p className="reveal text-sm text-cream-muted leading-relaxed mb-8" style={{ opacity: 0 }}>
            Bots conectados a WhatsApp y Telegram responden a clientes automáticamente. 
            Integraciones con CRMs y plataformas de terceros aseguran que la información 
            fluye sin intervención manual entre todos tus sistemas.
          </p>

          <div className="reveal grid grid-cols-3 gap-6 mb-8" style={{ opacity: 0 }}>
            <div>
              <p className="font-serif text-2xl text-gold">50+</p>
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-cream-muted">Sistemas activos</p>
            </div>
            <div>
              <p className="font-serif text-2xl text-gold">10M+</p>
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-cream-muted">Datos procesados</p>
            </div>
            <div>
              <p className="font-serif text-2xl text-gold">24/7</p>
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-cream-muted">Monitoreo IA</p>
            </div>
          </div>

          <a href="#contacto" onClick={(e) => { e.preventDefault(); document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' }) }}
            className="reveal pill-accent inline-block" style={{ opacity: 0 }}>
            Ver casos de éxito
          </a>
        </div>
      </div>
    </section>
  )
}
