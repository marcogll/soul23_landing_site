import { useRef, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Section5SocialProof() {
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
    <section ref={sectionRef} id="proposito" className="relative w-full bg-dark-primary z-50">
      <div className="max-w-6xl mx-auto px-6 lg:px-12 py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Headline */}
          <div>
            <div className="reveal" style={{ opacity: 0 }}>
              <h2 className="font-serif font-semibold text-cream leading-[1.05]" style={{ fontSize: 'clamp(36px, 5vw, 72px)' }}>
                Creado con
              </h2>
              <h2 className="font-serif font-semibold leading-[1.05]" style={{ fontSize: 'clamp(36px, 5vw, 72px)', color: '#C8B26B' }}>
                propósito.
              </h2>
            </div>

            <p className="reveal mt-8 text-cream-muted text-sm leading-relaxed max-w-md" style={{ opacity: 0 }}>
              Cada sistema que construimos tiene un objetivo claro: darte control sobre tu operación. 
              No implementamos tecnología por moda. Resolvemos problemas reales con datos e inteligencia artificial.
            </p>

            <a href="#despliegues" onClick={(e) => { e.preventDefault(); document.getElementById('despliegues')?.scrollIntoView({ behavior: 'smooth' }) }}
              className="reveal mt-8 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-gold hover:text-gold-light transition-colors" style={{ opacity: 0 }}>
              Ver despliegues <span>→</span>
            </a>
          </div>

          {/* Right: Dashboard image */}
          <div className="reveal" style={{ opacity: 0 }}>
            <img src="/images/manifesto.jpg" alt="Diseño con propósito" className="w-full h-auto shadow-2xl" />
          </div>
        </div>
      </div>
    </section>
  )
}
