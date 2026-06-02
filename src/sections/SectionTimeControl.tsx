import { useRef, useLayoutEffect } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CheckCircle } from 'lucide-react'
import { useCurrency } from '../contexts/CurrencyContext'
import { useLanguage } from '../contexts/LanguageContext'

gsap.registerPlugin(ScrollTrigger)

export default function SectionTimeControl() {
  const sectionRef = useRef<HTMLElement>(null)
  const { fmt } = useCurrency()
  const { t } = useLanguage()
  const plans = [
    { period: t('tc.plan1.nombre'), price: '$49.99', sub: t('tc.plan1.sub'), desc: t('tc.plan1.desc') },
    { period: t('tc.plan2.nombre'), price: '$129.99', sub: t('tc.plan2.sub'), desc: t('tc.plan2.desc') },
    { period: t('tc.plan3.nombre'), price: '$219.99', sub: t('tc.plan3.sub'), desc: t('tc.plan3.desc') },
    { period: t('tc.plan4.nombre'), price: '$349.99', sub: t('tc.plan4.sub'), desc: t('tc.plan4.desc') },
  ]

  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const ctx = gsap.context(() => {
      section.querySelectorAll('.reveal').forEach((el, i) => {
        gsap.fromTo(el, { y: 18, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.45, delay: i * 0.06, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' }
        })
      })
    }, section)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="time-control" className="relative w-full bg-dark-secondary z-20">
      <div className="max-w-6xl mx-auto px-6 py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-14">
          <div>
            <span className="reveal font-mono text-[10px] uppercase tracking-[0.18em] text-gold mb-4 block" style={{ opacity: 0 }}>
              {t('tc.label')}
            </span>

            <h2 className="reveal font-serif font-semibold text-cream leading-[1.08] mb-6" style={{ fontSize: 'clamp(28px, 3vw, 42px)', opacity: 0 }}>
              {t('tc.titulo')} <span className="text-gold">{t('tc.titulo2')}</span>
            </h2>

            <p className="reveal text-cream-muted text-sm leading-relaxed mb-8" style={{ opacity: 0 }}>
              {t('tc.desc')}
            </p>

            <div className="reveal flex flex-wrap gap-3" style={{ opacity: 0 }}>
              <a
                href="https://s4d4vlibmubd7vsqanml5u45.soul23.cloud/"
                target="_blank"
                rel="noopener noreferrer"
                className="pill-accent"
              >
                {t('tc.btn1')}
              </a>
              <Link to="/servicios" className="pill text-cream-muted hover:text-gold">
                Ver planes y precios
              </Link>
              <a
                href="https://wa.me/528442278408?text=Hola,%20quiero%20saber%20más%20sobre%20el%20control%20de%20tiempo%20para%20empleados"
                target="_blank"
                rel="noopener noreferrer"
                className="pill text-cream-muted hover:text-gold"
              >
                {t('tc.btn2')}
              </a>
            </div>
          </div>

          <div className="reveal" style={{ opacity: 0 }}>
            <a
              href="https://s4d4vlibmubd7vsqanml5u45.soul23.cloud/"
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <img
                src="/images/timeattendance.png"
                alt={t('tc.img')}
                className="w-full h-auto border border-cream/10 shadow-2xl hover:border-gold/40 transition-colors"
              />
            </a>
            <p className="text-[10px] text-cream-muted/50 text-center mt-3 italic">
              Demo: datos sintéticos basados en un cliente real · Identidad protegida
            </p>
          </div>
        </div>

        {/* Licencias */}
        <div className="mb-8">
          <h3 className="reveal font-serif text-xl text-cream mb-2 text-center" style={{ opacity: 0 }}>
            {t('tc.licencias.titulo')}
          </h3>
          <p className="reveal text-cream-muted text-sm text-center mb-10 max-w-xl mx-auto" style={{ opacity: 0 }}>
            {t('tc.licencias.sub')}
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {plans.map((p, i) => (
              <div key={i} className="reveal flex flex-col items-center text-center border border-cream/10 bg-dark-primary/70 p-6" style={{ opacity: 0 }}>
                <span className="text-xs uppercase tracking-widest text-gold mb-3">{p.period}</span>
                <span className="text-3xl font-serif font-semibold text-cream mb-1">{fmt(p.price)}</span>
                <span className="text-xs text-cream-muted mb-4">{p.sub}</span>
                <p className="text-xs text-cream-muted leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
          <p className="reveal text-center text-xs text-cream-muted/60 mt-4" style={{ opacity: 0 }}>
            {t('tc.especiales')}{' '}
            <a href="https://wa.me/528442278408?text=Hola,%20quiero%20una%20cotización%20especial%20para%20control%20de%20tiempo"
               target="_blank" rel="noopener noreferrer"
               className="text-gold hover:underline">{t('tc.especiales.link')}</a>
          </p>
        </div>

        {/* Self-hosted */}
        <div className="reveal border border-cream/10 bg-dark-primary/70 p-6 max-w-2xl mx-auto" style={{ opacity: 0 }}>
          <div className="flex items-start gap-4">
            <CheckCircle className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" strokeWidth={1.5} />
            <div>
              <h4 className="text-sm font-semibold text-cream mb-1">
                {t('tc.self.title')}
              </h4>
              <p className="text-xs text-cream-muted leading-relaxed mb-3">
                {t('tc.self.desc')}<strong className="text-cream">{fmt('$400/año')}</strong>).
              </p>
              <p className="text-xs text-gold/80 italic">
                {t('tc.self.tax')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
