import { useRef, useLayoutEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

gsap.registerPlugin(ScrollTrigger)

export default function Section5Testimonials() {
  const { t } = useLanguage()
  const testimonials = [
    { text: t('testimonios.0.text'), name: t('testimonios.0.name'), business: t('testimonios.0.business') },
    { text: t('testimonios.1.text'), name: t('testimonios.1.name'), business: t('testimonios.1.business') },
    { text: t('testimonios.2.text'), name: t('testimonios.2.name'), business: t('testimonios.2.business') },
  ]
  const sectionRef = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)

  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const ctx = gsap.context(() => {
      section.querySelectorAll('.reveal').forEach((el, i) => {
        gsap.fromTo(el, { y: 15, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.5, delay: i * 0.08, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' }
        })
      })
    }, section)
    return () => ctx.revert()
  }, [])

  const next = () => setActive((prev) => (prev + 1) % testimonials.length)
  const prev = () => setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length)

  return (
    <section ref={sectionRef} className="relative w-full bg-dark-primary z-50">
      <div className="max-w-3xl mx-auto px-6 py-24 lg:py-32">
        <h2 className="reveal font-serif font-semibold text-cream text-2xl lg:text-3xl text-center mb-12" style={{ opacity: 0 }}>
          {t('testimonios.titulo')}
        </h2>

        <div className="reveal" style={{ opacity: 0 }}>
          <div className="bg-dark-secondary/50 border border-cream/10 p-8 lg:p-10">
            <p className="text-cream-muted text-sm lg:text-base leading-relaxed italic mb-8">
              &ldquo;{testimonials[active].text}&rdquo;
            </p>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-serif text-cream font-semibold">{testimonials[active].name}</p>
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-cream-muted">{testimonials[active].business}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={prev} className="w-8 h-8 border border-cream/20 flex items-center justify-center text-cream-muted hover:text-gold hover:border-gold/40 transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button onClick={next} className="w-8 h-8 border border-cream/20 flex items-center justify-center text-cream-muted hover:text-gold hover:border-gold/40 transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, i) => (
              <button key={i} onClick={() => setActive(i)} className={`w-2 h-2 rounded-full transition-colors ${i === active ? 'bg-gold' : 'bg-cream/20'}`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
