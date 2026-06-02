import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useLanguage } from '../contexts/LanguageContext'

export default function Section1Hero() {
  const { t } = useLanguage()
  const logoRef = useRef<HTMLDivElement>(null)
  const logoMarkRef = useRef<HTMLImageElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const subRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const visualRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.3 })
      tl.fromTo(logoRef.current, { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' })
      tl.fromTo(headlineRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' })
      tl.fromTo(subRef.current, { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }, '-=0.3')
      tl.fromTo(ctaRef.current, { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }, '-=0.2')
      tl.fromTo(visualRef.current, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }, '-=0.25')

      gsap.to(logoMarkRef.current, {
        y: -4,
        duration: 2.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 1.2,
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <section id="hero" className="relative w-full min-h-[85vh] bg-dark-primary vignette flex items-center justify-center z-10">
      <div className="max-w-6xl mx-auto px-6 pt-28 pb-20 grid lg:grid-cols-[0.95fr_1.05fr] gap-12 lg:gap-16 items-center">
        <div className="text-center lg:text-left">
          <div ref={logoRef} className="mb-8 flex justify-center lg:justify-start" style={{ opacity: 0 }}>
            <img
              ref={logoMarkRef}
              src="/images/soul23_logo_full.svg"
              alt={t('hero.img.soul23')}
              className="h-10 md:h-14 lg:h-16 w-auto opacity-95 brightness-0 invert"
            />
          </div>

          <h1
            ref={headlineRef}
            className="font-serif font-semibold text-cream leading-[1.08] mb-6"
            style={{ fontSize: 'clamp(40px, 7vw, 84px)', opacity: 0 }}
          >
            {t('hero.titulo1')}<br />
            <span className="text-gold">{t('hero.titulo2')}</span>
          </h1>

          <p
            ref={subRef}
            className="text-cream-muted text-lg leading-relaxed max-w-xl mx-auto lg:mx-0 mb-10"
            style={{ opacity: 0 }}
          >
            {t('hero.sub')}
          </p>

          <div ref={ctaRef} className="flex flex-wrap justify-center lg:justify-start gap-4" style={{ opacity: 0 }}>
            <a
              href="#como-funciona"
              onClick={(e) => { e.preventDefault(); document.getElementById('como-funciona')?.scrollIntoView({ behavior: 'smooth' }) }}
              className="pill-accent"
            >
              {t('hero.btn1')}
            </a>
            <a
              href="https://wa.me/528442278408?text=Hola,%20quiero%20saber%20cómo%20hacer%20que%20mi%20negocio%20trabaje%20solo"
              target="_blank"
              rel="noopener noreferrer"
              className="pill text-cream-muted hover:text-gold"
            >
              {t('hero.btn2')}
            </a>
          </div>
        </div>

        <div ref={visualRef} className="relative hidden md:block" style={{ opacity: 0 }}>
          <div className="relative aspect-[1.05/1]">
            <div className="absolute inset-x-0 top-8 overflow-hidden border border-cream/10 bg-dark-secondary shadow-2xl">
              <img
                src="/images/cursos_vanity.png"
                alt={t('hero.img.cursos')}
                className="h-72 lg:h-[360px] w-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-primary/45 via-transparent to-transparent" />
            </div>

            <div className="absolute right-0 top-0 w-[56%] overflow-hidden border border-cream/10 bg-dark-primary shadow-xl">
              <img
                src="/images/industry-dashboard.png"
                alt={t('hero.img.dashboard')}
                className="h-40 lg:h-52 w-full object-cover object-top"
              />
            </div>

            <div className="absolute left-0 bottom-8 w-[44%] overflow-hidden border border-cream/10 bg-dark-primary shadow-xl">
              <img
                src="/images/soytuconta.png"
                alt={t('hero.img.sitio')}
                className="h-32 lg:h-40 w-full object-cover object-top"
              />
            </div>

            <div className="absolute right-6 bottom-0 w-[38%] overflow-hidden border border-cream/10 bg-dark-primary shadow-xl">
              <img
                src="/images/timeattendance.png"
                alt={t('hero.img.reporte')}
                className="h-28 lg:h-36 w-full object-cover object-top"
              />
            </div>

            <div className="absolute left-8 top-2 border border-gold/30 bg-dark-primary/85 px-3 py-2 backdrop-blur-sm">
              <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-gold">{t('hero.floating')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
