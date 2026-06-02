import { useRef, useLayoutEffect } from 'react'
import { Award, TrendingUp, Users, ArrowRight, Target, Brain } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLanguage } from '../contexts/LanguageContext'

gsap.registerPlugin(ScrollTrigger)

export default function SectionCompetencyHighlight() {
  const sectionRef = useRef<HTMLElement>(null)
  const { t } = useLanguage()

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
    <section ref={sectionRef} id="evaluacion-competencias" className="relative w-full bg-dark-secondary" style={{ zIndex: 52 }}>
      <div className="max-w-6xl mx-auto px-6 lg:px-12 py-24 lg:py-32">
        {/* Header */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <span className="reveal font-mono text-[10px] uppercase tracking-[0.18em] text-gold mb-4 block" style={{ opacity: 0 }}>
              {t('competenciasHighlight.label')}
            </span>
            <h2 className="reveal font-serif font-semibold text-cream leading-[1.08] mb-4" style={{ fontSize: 'clamp(26px, 3vw, 42px)', opacity: 0 }}>
              {t('competenciasHighlight.titulo')}
            </h2>
            <p className="reveal text-sm text-cream-muted leading-relaxed mb-6 max-w-lg" style={{ opacity: 0 }}>
              {t('competenciasHighlight.sub')}
            </p>
            <div className="reveal flex flex-wrap gap-3" style={{ opacity: 0 }}>
              <a href="https://carol.soul23.cloud/" target="_blank" rel="noopener noreferrer" className="pill-accent">
                {t('competenciasHighlight.cta1')}
                <ArrowRight size={14} className="ml-1" />
              </a>
              <a
                href="https://wa.me/528442278408?text=Hola,%20quiero%20saber%20más%20sobre%20evaluación%20de%20competencias"
                target="_blank"
                rel="noopener noreferrer"
                className="pill text-cream-muted hover:text-gold"
              >
                {t('competenciasHighlight.cta2')}
              </a>
            </div>
          </div>

          {/* Stats cards */}
          <div className="reveal grid grid-cols-2 gap-4" style={{ opacity: 0 }}>
            <div className="border border-cream/10 bg-dark-primary/70 p-5">
              <Brain className="w-5 h-5 text-gold mb-3" strokeWidth={1.5} />
              <div className="font-serif text-2xl text-cream mb-1">3</div>
              <div className="text-[10px] text-cream-muted uppercase tracking-wider">{t('competenciasHighlight.stat1')}</div>
            </div>
            <div className="border border-cream/10 bg-dark-primary/70 p-5">
              <Target className="w-5 h-5 text-green-400 mb-3" strokeWidth={1.5} />
              <div className="font-serif text-2xl text-cream mb-1">7+</div>
              <div className="text-[10px] text-cream-muted uppercase tracking-wider">{t('competenciasHighlight.stat2')}</div>
            </div>
            <div className="border border-cream/10 bg-dark-primary/70 p-5">
              <Users className="w-5 h-5 text-cyan-400 mb-3" strokeWidth={1.5} />
              <div className="font-serif text-2xl text-cream mb-1">6</div>
              <div className="text-[10px] text-cream-muted uppercase tracking-wider">{t('competenciasHighlight.stat3')}</div>
            </div>
            <div className="border border-cream/10 bg-dark-primary/70 p-5">
              <TrendingUp className="w-5 h-5 text-gold mb-3" strokeWidth={1.5} />
              <div className="font-serif text-2xl text-cream mb-1">{t('competenciasHighlight.stat4Val')}</div>
              <div className="text-[10px] text-cream-muted uppercase tracking-wider">{t('competenciasHighlight.stat4')}</div>
            </div>
          </div>
        </div>

        {/* Feature preview */}
        <div className="reveal border border-cream/10 bg-dark-primary/50 p-6 lg:p-8" style={{ opacity: 0 }}>
          <div className="flex items-center gap-3 mb-6">
            <Award className="w-5 h-5 text-gold" strokeWidth={1.5} />
            <div>
              <h3 className="font-serif text-sm text-cream">{t('competenciasHighlight.preview.titulo')}</h3>
              <p className="text-[10px] text-cream-muted">{t('competenciasHighlight.preview.sub')}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="border border-cream/10 p-4 text-center">
              <div className="font-serif text-2xl text-cream mb-1">78.5%</div>
              <div className="text-[10px] text-cream-muted uppercase tracking-wider">{t('competenciasHighlight.preview.score')}</div>
            </div>
            <div className="border border-cream/10 p-4 text-center">
              <div className="font-serif text-2xl text-cream mb-1">5/7</div>
              <div className="text-[10px] text-cream-muted uppercase tracking-wider">{t('competenciasHighlight.preview.cats')}</div>
            </div>
            <div className="border border-cream/10 p-4 text-center">
              <div className="font-serif text-xl text-cream mb-1">{t('competenciasHighlight.preview.level')}</div>
              <div className="text-[10px] text-cream-muted uppercase tracking-wider">{t('competenciasHighlight.preview.levelLabel')}</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-cream-muted text-xs">{t('competenciasHighlight.preview.cat1')}</span>
              <div className="flex items-center gap-3">
                <div className="w-24 h-1.5 bg-cream/10 overflow-hidden">
                  <div className="h-full bg-gold" style={{ width: '85%' }} />
                </div>
                <span className="text-cream text-xs w-8 text-right">85%</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-cream-muted text-xs">{t('competenciasHighlight.preview.cat2')}</span>
              <div className="flex items-center gap-3">
                <div className="w-24 h-1.5 bg-cream/10 overflow-hidden">
                  <div className="h-full bg-green-400" style={{ width: '92%' }} />
                </div>
                <span className="text-cream text-xs w-8 text-right">92%</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-cream-muted text-xs">{t('competenciasHighlight.preview.cat3')}</span>
              <div className="flex items-center gap-3">
                <div className="w-24 h-1.5 bg-cream/10 overflow-hidden">
                  <div className="h-full bg-red-400" style={{ width: '55%' }} />
                </div>
                <span className="text-cream text-xs w-8 text-right">55%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
