import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Check, Star, Brain, BarChart3, FileText, Zap, Users, Target, Award, TrendingUp, Layers } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLanguage } from '../contexts/LanguageContext'

gsap.registerPlugin(ScrollTrigger)

const industries = [
  { icon: '🔧', label: 'Manufactura', desc: 'Operadores, técnicos, ingenieros de proceso' },
  { icon: '💉', label: 'Salud', desc: 'Enfermería, técnicos, staff clínico' },
  { icon: '💻', label: 'Tecnología', desc: 'Desarrollo, DevOps, QA, soporte' },
  { icon: '📊', label: 'Administrativo', desc: 'Ventas, RH, contabilidad, logística' },
  { icon: '🎓', label: 'Educación', desc: 'Docentes, coordinadores, facilitadores' },
  { icon: '🏭', label: 'Operaciones', desc: 'Almacén, producción, calidad, mantenimiento' },
]

const levels = [
  {
    id: 'basic',
    color: 'text-green-400',
    border: 'border-green-400/30',
    title: 'Nivel Básico',
    subtitle: 'Operadores · Técnicos junior · 0–2 años',
    questions: '40–60 preguntas',
    time: '45–60 min',
    threshold: '70%',
    categories: ['Conocimiento técnico base', 'Seguridad industrial', 'Procedimientos estándar', 'Calidad básica', 'Comunicación'],
  },
  {
    id: 'medium',
    color: 'text-gold',
    border: 'border-gold/40',
    title: 'Nivel Medio',
    subtitle: 'Técnicos · Supervisores · 2–6 años',
    questions: '50–70 preguntas',
    time: '60–75 min',
    threshold: '75%',
    categories: ['Diagnóstico de procesos', 'Resolución de problemas', 'Liderazgo técnico', 'Optimización', 'Análisis de datos'],
  },
  {
    id: 'advanced',
    color: 'text-cyan-400',
    border: 'border-cyan-400/30',
    title: 'Nivel Avanzado',
    subtitle: 'Ingenieros · Líderes · Especialistas · 6+ años',
    questions: '35–50 preguntas',
    time: '75–90 min',
    threshold: '80%',
    categories: ['Diseño de procesos', 'Mejora continua', 'Estrategia técnica', 'Mentoría', 'Innovación'],
  },
]

const features = [
  { icon: Brain, title: 'Routing adaptivo', desc: 'El sistema asigna el nivel correcto según el rol, experiencia y autovaloración del candidato.' },
  { icon: BarChart3, title: 'Diagnóstico por categoría', desc: 'No solo una calificación: sabes exactamente en qué áreas técnicas domina y en cuáles necesita desarrollo.' },
  { icon: FileText, title: 'Reporte PDF automático', desc: 'Genera un reporte ejecutivo con puntuación, análisis por categoría y plan de desarrollo personalizado.' },
  { icon: Zap, title: 'Webhook a tu sistema', desc: 'Los resultados se envían vía webhook a tu n8n, CRM, Google Sheets o base de datos en tiempo real.' },
  { icon: Users, title: 'Multi-evaluador', desc: 'Soporta evaluación 360: jefe, pares, subordinados y autoevaluación en un solo flujo.' },
  { icon: Target, title: 'Benchmark interno', desc: 'Compara resultados contra promedios históricos y define estándares de competencia por puesto.' },
]

const flowSteps = [
  { step: '01', title: 'Registro inteligente', desc: 'El candidato se registresa con su rol, experiencia y área. El sistema calcula el nivel recomendado automáticamente.' },
  { step: '02', title: 'Evaluación técnica', desc: 'Responde preguntas teóricas y prácticas organizadas por categorías. El tiempo y dificultad se adaptan al nivel.' },
  { step: '03', title: 'Calificación automática', desc: 'El sistema califica cada respuesta, calcula puntaje por categoría y determina si aprueba o necesita desarrollo.' },
  { step: '04', title: 'Reporte + plan de acción', desc: 'Genera un PDF con el diagnóstico completo y un plan de desarrollo con áreas prioritarias a reforzar.' },
]

export default function CompetencyEvaluationPage() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [activeLevel, setActiveLevel] = useState(0)
  const { t } = useLanguage()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
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
    <div ref={sectionRef} className="min-h-screen bg-dark-primary pt-28 pb-24">
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        {/* Back link */}
        <Link to="/" className="reveal inline-flex items-center gap-2 text-cream-muted text-[13px] font-mono uppercase tracking-wide hover:text-gold transition-colors mb-8">
          <ArrowLeft size={16} />
          <span>{t('competencias.back')}</span>
        </Link>

        {/* Hero */}
        <div className="reveal mb-20">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-gold mb-4 block">
            {t('competencias.label')}
          </span>
          <h1 className="font-serif font-semibold text-cream text-3xl lg:text-5xl leading-[1.08] mb-4 max-w-3xl">
            {t('competencias.titulo')}
          </h1>
          <p className="text-cream-muted text-sm max-w-2xl leading-relaxed mb-8">
            {t('competencias.subtitulo')}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/contact-survey" className="pill-accent">{t('competencias.cta1')}</Link>
            <a
              href="https://wa.me/528442278408?text=Hola,%20quiero%20saber%20más%20sobre%20evaluación%20de%20competencias"
              target="_blank"
              rel="noopener noreferrer"
              className="pill text-cream-muted hover:text-gold"
            >
              {t('competencias.cta2')}
            </a>
          </div>
        </div>

        {/* Industries grid */}
        <div className="reveal mb-20">
          <h2 className="font-serif font-semibold text-cream text-xl mb-2">{t('competencias.industrias.titulo')}</h2>
          <p className="text-xs text-cream-muted mb-8 max-w-xl">{t('competencias.industrias.sub')}</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {industries.map((ind) => (
              <div key={ind.label} className="border border-cream/10 bg-dark-secondary p-5 hover:border-gold/30 transition-colors">
                <div className="text-2xl mb-2">{ind.icon}</div>
                <h3 className="font-serif text-sm text-cream mb-1">{ind.label}</h3>
                <p className="text-xs text-cream-muted">{ind.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Levels tabs */}
        <div className="reveal mb-20">
          <h2 className="font-serif font-semibold text-cream text-xl mb-2">{t('competencias.niveles.titulo')}</h2>
          <p className="text-xs text-cream-muted mb-8 max-w-xl">{t('competencias.niveles.sub')}</p>

          {/* Tabs */}
          <div className="flex gap-2 mb-8 border-b border-cream/10">
            {levels.map((lvl, i) => (
              <button
                key={lvl.id}
                onClick={() => setActiveLevel(i)}
                className={`px-4 py-3 text-[11px] uppercase tracking-[0.14em] font-mono transition-colors border-b-2 ${
                  activeLevel === i
                    ? `border-gold text-gold`
                    : 'border-transparent text-cream-muted hover:text-cream'
                }`}
              >
                {lvl.title}
              </button>
            ))}
          </div>

          {/* Active level content */}
          <div className={`border ${levels[activeLevel].border} bg-dark-secondary p-6 lg:p-8`}>
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-6">
              <div>
                <h3 className={`font-serif text-lg mb-1 ${levels[activeLevel].color}`}>{levels[activeLevel].title}</h3>
                <p className="text-sm text-cream-muted">{levels[activeLevel].subtitle}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-cream-muted border border-cream/10 px-3 py-1.5">
                  {levels[activeLevel].questions}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-cream-muted border border-cream/10 px-3 py-1.5">
                  {levels[activeLevel].time}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-gold border border-gold/30 px-3 py-1.5">
                  Aprobación: {levels[activeLevel].threshold}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs text-cream-muted uppercase tracking-wider mb-3">Categorías evaluadas:</p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {levels[activeLevel].categories.map((cat) => (
                  <div key={cat} className="flex items-center gap-2 text-sm text-cream-muted">
                    <Check className="w-3 h-3 text-gold flex-shrink-0" strokeWidth={1.5} />
                    <span>{cat}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* How it works */}
        <div className="reveal mb-20">
          <h2 className="font-serif font-semibold text-cream text-xl mb-2">{t('competencias.flujo.titulo')}</h2>
          <p className="text-xs text-cream-muted mb-8 max-w-xl">{t('competencias.flujo.sub')}</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {flowSteps.map((step) => (
              <div key={step.step} className="border border-cream/10 bg-dark-secondary p-6 relative">
                <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-gold/60 absolute top-4 right-4">
                  {step.step}
                </span>
                <Layers className="w-5 h-5 text-gold mb-4" strokeWidth={1.5} />
                <h3 className="font-serif text-sm text-cream mb-2">{step.title}</h3>
                <p className="text-xs text-cream-muted leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="reveal mb-20">
          <h2 className="font-serif font-semibold text-cream text-xl mb-2">{t('competencias.features.titulo')}</h2>
          <p className="text-xs text-cream-muted mb-8 max-w-xl">{t('competencias.features.sub')}</p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feat) => (
              <div key={feat.title} className="border border-cream/10 bg-dark-secondary p-6 hover:border-gold/20 transition-colors">
                <feat.icon className="w-5 h-5 text-gold mb-4" strokeWidth={1.5} />
                <h3 className="font-serif text-sm text-cream mb-2">{feat.title}</h3>
                <p className="text-xs text-cream-muted leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Report preview */}
        <div className="reveal mb-20">
          <h2 className="font-serif font-semibold text-cream text-xl mb-2">{t('competencias.reporte.titulo')}</h2>
          <p className="text-xs text-cream-muted mb-8 max-w-xl">{t('competencias.reporte.sub')}</p>

          <div className="border border-cream/10 bg-dark-secondary p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-6">
              <Award className="w-5 h-5 text-gold" strokeWidth={1.5} />
              <div>
                <h3 className="font-serif text-sm text-cream">Reporte de Evaluación Técnica</h3>
                <p className="text-xs text-cream-muted">Ejemplo de salida del sistema</p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div className="text-center border border-cream/10 p-4">
                <TrendingUp className="w-4 h-4 text-gold mx-auto mb-2" strokeWidth={1.5} />
                <div className="font-serif text-2xl text-cream mb-1">78.5%</div>
                <div className="text-[10px] text-cream-muted uppercase tracking-wider">Puntuación global</div>
              </div>
              <div className="text-center border border-cream/10 p-4">
                <Target className="w-4 h-4 text-green-400 mx-auto mb-2" strokeWidth={1.5} />
                <div className="font-serif text-2xl text-cream mb-1">5/7</div>
                <div className="text-[10px] text-cream-muted uppercase tracking-wider">Categorías aprobadas</div>
              </div>
              <div className="text-center border border-cream/10 p-4">
                <Star className="w-4 h-4 text-cyan-400 mx-auto mb-2" strokeWidth={1.5} />
                <div className="font-serif text-2xl text-cream mb-1">Nivel Medio</div>
                <div className="text-[10px] text-cream-muted uppercase tracking-wider">Competencia asignada</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-cream-muted">Procesos técnicos</span>
                <div className="flex items-center gap-3">
                  <div className="w-24 h-1.5 bg-cream/10 overflow-hidden">
                    <div className="h-full bg-gold" style={{ width: '85%' }} />
                  </div>
                  <span className="text-cream text-xs w-8 text-right">85%</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-cream-muted">Seguridad industrial</span>
                <div className="flex items-center gap-3">
                  <div className="w-24 h-1.5 bg-cream/10 overflow-hidden">
                    <div className="h-full bg-green-400" style={{ width: '92%' }} />
                  </div>
                  <span className="text-cream text-xs w-8 text-right">92%</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-cream-muted">Resolución de problemas</span>
                <div className="flex items-center gap-3">
                  <div className="w-24 h-1.5 bg-cream/10 overflow-hidden">
                    <div className="h-full bg-gold" style={{ width: '68%' }} />
                  </div>
                  <span className="text-cream text-xs w-8 text-right">68%</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-cream-muted">Liderazgo técnico</span>
                <div className="flex items-center gap-3">
                  <div className="w-24 h-1.5 bg-cream/10 overflow-hidden">
                    <div className="h-full bg-red-400" style={{ width: '55%' }} />
                  </div>
                  <span className="text-cream text-xs w-8 text-right">55%</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-cream/10">
              <p className="text-xs text-cream-muted">
                <span className="text-gold font-mono uppercase tracking-wider text-[10px]">Plan de desarrollo:</span>{' '}
                Reforzar liderazgo técnico y toma de decisiones bajo presión. Programar mentoría con especialista senior.
              </p>
            </div>
          </div>
        </div>

        {/* Integration banner */}
        <div className="reveal border border-gold/20 bg-dark-secondary p-6 lg:p-8 mb-16">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h3 className="font-serif text-lg text-cream mb-2">{t('competencias.integracion.titulo')}</h3>
              <p className="text-sm text-cream-muted max-w-xl leading-relaxed">{t('competencias.integracion.sub')}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/contact-survey" className="pill-accent">{t('competencias.integracion.cta1')}</Link>
              <a
                href="https://wa.me/528442278408?text=Hola,%20quiero%20una%20demo%20del%20sistema%20de%20evaluación%20de%20competencias"
                target="_blank"
                rel="noopener noreferrer"
                className="pill text-cream-muted hover:text-gold"
              >
                {t('competencias.integracion.cta2')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
