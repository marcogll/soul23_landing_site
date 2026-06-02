import { useRef, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLanguage } from '../contexts/LanguageContext'

gsap.registerPlugin(ScrollTrigger)

export default function Section2Problem() {
  const { t } = useLanguage()
  const problems = [
    t('problem.1'),
    t('problem.2'),
    t('problem.3'),
    t('problem.4'),
    t('problem.5'),
  ]
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
          {t('problem.titulo')}
        </h2>
        <p className="reveal text-cream-muted text-sm text-center mb-10" style={{ opacity: 0 }}>
          {t('problem.sub')}
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
          {t('problem.cta')}
        </p>

        <div className="reveal grid grid-cols-3 gap-3 mt-12" style={{ opacity: 0 }}>
          {[
            { src: '/images/operacion-flow.jpg', alt: t('problem.img.flow') },
            { src: '/images/work4.jpg', alt: t('problem.img.mobile') },
            { src: '/images/collage-tl.jpg', alt: t('problem.img.tools') },
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
