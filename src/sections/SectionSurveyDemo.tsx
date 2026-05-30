import { useRef, useLayoutEffect, useState, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  QrCode, Smartphone, Brain, AlertTriangle, Star, ThumbsUp, ThumbsDown, Meh,
  Send, Check, ChevronRight, RotateCcw, TrendingUp, MessageSquare, Eye,
  Zap, Database, BarChart3
} from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

type Phase = 'intro' | 'survey' | 'analyzing' | 'alert' | 'report'

interface SurveyQ {
  id: number
  text: string
  type: 'emoji' | 'options'
  options?: string[]
  aiTags?: string[]
}

const surveyQuestions: SurveyQ[] = [
  { id: 1, text: '¿Cómo fue tu experiencia hoy?', type: 'emoji', aiTags: ['experiencia', 'cx'] },
  { id: 2, text: '¿El servicio llegó a tiempo?', type: 'options', options: ['Sí, rápido', 'Regular', 'Se tardó'], aiTags: ['tiempo', 'cumplimiento'] },
  { id: 3, text: '¿Qué fue lo más destacado?', type: 'options', options: ['Calidad', 'Trato personal', 'Rapidez'], aiTags: ['calidad', 'servicio'] },
  { id: 4, text: '¿Volverías?', type: 'options', options: ['Definitivamente', 'Tal vez', 'No'], aiTags: ['retención', 'satisfacción'] },
]

const aiCapabilities = [
  { icon: Brain, title: 'Sentiment Analysis', desc: 'Clasifica cada respuesta como positiva, neutral o negativa automáticamente.' },
  { icon: MessageSquare, title: 'Tagging Inteligente', desc: 'Extrae temas clave: calidad, tiempo, precio, servicio, personal.' },
  { icon: TrendingUp, title: 'Detección de Patrones', desc: 'Identifica tendencias: "los viernes hay más quejas", "el servicio X es el mejor calificado".' },
  { icon: AlertTriangle, title: 'Alertas en Tiempo Real', desc: 'Si algo va mal, lo sabes al instante. Sin esperar a revisar encuestas manualmente.' },
]

const dataFlowSteps = [
  { icon: QrCode, label: 'QR / Link', desc: 'El cliente escanea o recibe un link por WhatsApp' },
  { icon: Smartphone, label: 'Encuesta 30s', desc: 'Responde 3-4 preguntas simples, sin fricción' },
  { icon: Brain, label: 'IA Procesa', desc: 'Analiza sentimiento, detecta tags, identifica patrones' },
  { icon: Database, label: 'Data Estructurada', desc: 'Cada respuesta se convierte en datos accionables' },
  { icon: BarChart3, label: 'Reporte / Alerta', desc: 'Dashboard diario + alertas inmediatas para decidir' },
]

export default function SectionSurveyDemo() {
  const sectionRef = useRef<HTMLElement>(null)
  const [phase, setPhase] = useState<Phase>('intro')
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [showPulse, setShowPulse] = useState(false)
  const [aiTags, setAiTags] = useState<string[]>([])
  const [sentiment, setSentiment] = useState<'positive' | 'neutral' | 'negative'>('neutral')
  const [typingText, setTypingText] = useState('')
  const [demoStarted, setDemoStarted] = useState(false)

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

  useEffect(() => {
    if (phase === 'alert') {
      const interval = setInterval(() => setShowPulse(p => !p), 800)
      return () => clearInterval(interval)
    }
  }, [phase])

  // AI typing effect
  useEffect(() => {
    if (phase === 'analyzing') {
      const texts = [
        'Clasificando sentimiento...',
        'Extrayendo tags: experiencia, tiempo, calidad...',
        'Detectando patrón: "Rapidez" es el tema #1...',
        'Generando alerta por respuesta negativa...',
        'Compilando reporte...',
      ]
      let idx = 0
      const interval = setInterval(() => {
        if (idx < texts.length) {
          setTypingText(texts[idx])
          idx++
        }
      }, 600)
      return () => clearInterval(interval)
    }
  }, [phase])

  const handleAnswer = (answer: string) => {
    const q = surveyQuestions[currentQ]
    setAnswers(prev => ({ ...prev, [q.id]: answer }))

    // Build tags
    const newTags = [...aiTags, ...(q.aiTags || [])]
    setAiTags(newTags)

    // Determine sentiment
    if (answer === 'Mala' || answer === 'No' || answer === 'Se tardó') {
      setSentiment('negative')
    } else if (answer === 'Definitivamente' || answer === 'Excelente' || answer === 'Sí, rápido') {
      if (sentiment !== 'negative') setSentiment('positive')
    }

    if (currentQ < surveyQuestions.length - 1) {
      setTimeout(() => setCurrentQ(prev => prev + 1), 300)
    } else {
      setTimeout(() => setPhase('analyzing'), 400)
      setTimeout(() => setPhase('alert'), 3000)
    }
  }

  const reset = () => {
    setPhase('intro')
    setCurrentQ(0)
    setAnswers({})
    setAiTags([])
    setSentiment('neutral')
    setTypingText('')
    setDemoStarted(false)
  }

  const startDemo = () => {
    setDemoStarted(true)
    setPhase('survey')
  }

  const renderPhase = () => {
    switch (phase) {
      case 'intro':
        return (
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-gold/10 flex items-center justify-center">
              <Eye className="w-8 h-8 text-gold" strokeWidth={1.5} />
            </div>
            <h4 className="font-serif font-semibold text-cream text-lg mb-3">Prueba el sistema</h4>
            <p className="text-cream-muted text-[13px] mb-6 max-w-xs mx-auto">
              Tómate 30 segundos para responder como lo haría tu cliente. La IA analiza todo al instante.
            </p>
            <button
              onClick={startDemo}
              className="w-full py-3 bg-gold text-dark-primary font-mono text-[11px] uppercase tracking-[0.14em] hover:bg-gold-light transition-colors"
            >
              Iniciar demo
            </button>
          </div>
        )

      case 'survey':
        return (
          <div className="max-w-xs mx-auto">
            <div className="flex items-center gap-2 mb-4">
              {surveyQuestions.map((_, i) => (
                <div key={i} className={`h-1 flex-1 transition-colors ${i <= currentQ ? 'bg-gold' : 'bg-cream/20'}`} />
              ))}
            </div>
            <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-cream-muted/50 mb-4">
              Pregunta {currentQ + 1} de {surveyQuestions.length}
            </p>
            <h4 className="font-serif font-semibold text-cream text-lg mb-6">
              {surveyQuestions[currentQ].text}
            </h4>

            {surveyQuestions[currentQ].type === 'emoji' ? (
              <div className="flex justify-center gap-4">
                {[
                  { icon: ThumbsUp, label: 'Excelente', color: 'text-green-400' },
                  { icon: Meh, label: 'Regular', color: 'text-amber-400' },
                  { icon: ThumbsDown, label: 'Mala', color: 'text-red-400' },
                ].map(({ icon: Icon, label, color }) => (
                  <button
                    key={label}
                    onClick={() => handleAnswer(label)}
                    className="flex flex-col items-center gap-2 p-4 bg-cream/[0.03] border border-cream/10 hover:border-gold/50 transition-colors"
                  >
                    <Icon className={`w-7 h-7 ${color}`} strokeWidth={1.5} />
                    <span className="text-[10px] text-cream-muted/50">{label}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {surveyQuestions[currentQ].options?.map(opt => (
                  <button
                    key={opt}
                    onClick={() => handleAnswer(opt)}
                    className="w-full text-left px-4 py-3 bg-cream/[0.03] border border-cream/10 text-sm text-cream-muted hover:border-gold/50 hover:text-cream transition-colors flex items-center justify-between"
                  >
                    {opt}
                    <ChevronRight className="w-3 h-3 text-cream-muted/30" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )

      case 'analyzing':
        return (
          <div className="text-center py-6">
            <div className="w-16 h-16 mx-auto mb-6 relative">
              <Brain className="w-10 h-10 text-gold mx-auto" strokeWidth={1} />
              <div className="absolute inset-0 border border-gold/30 rounded-full animate-ping" />
            </div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-gold mb-3">Preparando reporte</p>
            <p className="text-[13px] text-cream-muted/70 mb-4 h-5">{typingText}</p>
            <div className="flex justify-center gap-1">
              {[0,1,2,3,4].map(i => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-gold animate-bounce" style={{ animationDelay: `${i * 100}ms` }} />
              ))}
            </div>
          </div>
        )

      case 'alert':
        return (
          <div className="text-center">
            <div className={`max-w-xs mx-auto bg-cream/[0.03] border p-4 mb-6 text-left transition-all duration-500 ${showPulse ? 'border-red-400/60 shadow-lg shadow-red-400/10' : 'border-cream/10'}`}>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-red-400/20 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-4 h-4 text-red-400" strokeWidth={1.5} />
                </div>
                <div className="flex-1">
                  <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-red-400 mb-1">Alerta inmediata</p>
                  <p className="text-xs text-cream mb-1">Cliente insatisfecho detectado</p>
                  <p className="text-[10px] text-cream-muted/50 italic">
                    "{answers[1] === 'Mala' ? 'Experiencia negativa reportada' : answers[3] === 'No' ? 'No quiere volver' : 'Sabor puede mejorar'}"
                  </p>
                  <div className="flex gap-1 mt-2">
                    {[1,2,3].map(i => <Star key={i} className="w-3 h-3 text-gold" fill="currentColor" />)}
                    {[4,5].map(i => <Star key={i} className="w-3 h-3 text-cream/10" />)}
                  </div>
                </div>
                <span className="font-mono text-[8px] text-cream-muted/30">Ahora</span>
              </div>
            </div>

            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-gold mb-2">Así lo recibe el dueño</p>
            <p className="text-[13px] text-cream-muted/50 mb-6">En su celular, al instante. Sin abrir plataformas.</p>

            <button
              onClick={() => setPhase('report')}
              className="pill-accent inline-flex items-center gap-2"
            >
              Ver reporte completo <Send className="w-3 h-3" />
            </button>
          </div>
        )

      case 'report':
        return (
          <div className="text-center">
            <div className="max-w-sm mx-auto bg-dark-primary border border-cream/10 overflow-hidden text-left mb-6">
              {/* Email header */}
              <div className="bg-cream/[0.03] border-b border-cream/10 px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gold/15 flex items-center justify-center">
                    <Brain className="w-3 h-3 text-gold" />
                  </div>
                  <div>
                    <p className="text-[10px] text-cream font-medium">soul:23 Feedback Report</p>
                    <p className="text-[8px] text-cream-muted/40">Reporte de ejemplo generado con respuestas simuladas</p>
                  </div>
                </div>
              </div>
              {/* Email body */}
              <div className="p-5">
                <h4 className="font-serif font-semibold text-cream text-lg mb-4">Resumen del análisis</h4>
                <div className="grid grid-cols-3 gap-3 mb-5">
                  <div className="text-center p-2 bg-cream/[0.03]">
                    <p className="font-serif text-xl text-gold">{sentiment === 'negative' ? 'Alta' : 'Media'}</p>
                    <p className="text-[8px] text-cream-muted/40 uppercase tracking-wider">Prioridad</p>
                  </div>
                  <div className="text-center p-2 bg-cream/[0.03]">
                    <p className="font-serif text-xl text-cream">{Object.keys(answers).length}</p>
                    <p className="text-[8px] text-cream-muted/40 uppercase tracking-wider">Respuestas</p>
                  </div>
                  <div className="text-center p-2 bg-cream/[0.03]">
                    <p className="font-serif text-xl text-red-400">{sentiment === 'negative' ? '1' : '0'}</p>
                    <p className="text-[8px] text-red-400/60 uppercase tracking-wider">Alertas</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-[11px] text-cream-muted">
                    <Check className="w-3 h-3 text-gold flex-shrink-0" />
                    <span>Tags detectados: {aiTags.join(', ')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-cream-muted">
                    <Check className="w-3 h-3 text-gold flex-shrink-0" />
                    <span>Sentimiento general: <span className={
                      sentiment === 'positive' ? 'text-green-400' : sentiment === 'negative' ? 'text-red-400' : 'text-amber-400'
                    }>{sentiment === 'positive' ? 'Positivo' : sentiment === 'negative' ? 'Negativo' : 'Neutral'}</span></span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-cream-muted">
                    <Check className="w-3 h-3 text-gold flex-shrink-0" />
                    <span>Top tema: {aiTags[0] || 'servicio'}</span>
                  </div>
                </div>

                <div className="bg-cream/[0.03] border border-cream/10 p-3 text-[10px] text-cream-muted/60 italic">
                  "El reporte marca {answers[2] === 'Se tardó' ? 'tiempo de espera' : answers[3] === 'Tal vez' ? 'retención' : 'servicio'} como tema a revisar. Con IA conectada al webhook, este bloque puede generar una recomendación real por correo."
                </div>
              </div>
              {/* Email footer */}
              <div className="bg-cream/[0.03] border-t border-cream/10 px-4 py-2 text-center">
                <p className="text-[8px] text-cream-muted/30">Powered by soul:23 · Feedback automatizado con IA</p>
              </div>
            </div>

            <button
              onClick={reset}
              className="pill text-cream-muted hover:text-gold inline-flex items-center gap-2"
            >
              <RotateCcw className="w-3 h-3" /> Probar otra vez
            </button>
          </div>
        )
    }
  }

  return (
    <section ref={sectionRef} id="feedback" className="relative w-full bg-dark-secondary" style={{ zIndex: 55 }}>
      <div className="max-w-5xl mx-auto px-6 lg:px-12 py-24 lg:py-32">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="reveal font-mono text-[10px] uppercase tracking-[0.18em] text-gold mb-4 block" style={{ opacity: 0 }}>
            CX Intelligence
          </span>
          <h2 className="reveal font-serif font-semibold text-cream leading-[1.05] mb-4" style={{ fontSize: 'clamp(24px, 3vw, 42px)', opacity: 0 }}>
            La información que se te escapa,<br />
            <span className="text-gold">ahora trabaja para ti.</span>
          </h2>
          <p className="reveal text-cream-muted text-sm max-w-xl mx-auto" style={{ opacity: 0 }}>
            Cada cliente que se va sin decir nada es información perdida.
                El sistema captura esa retroalimentación, la estructura y la manda al webhook para generar reportes y alertas accionables.
          </p>
        </div>

        {/* Main grid */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left: Explanation */}
          <div>
            <div className="reveal mb-10" style={{ opacity: 0 }}>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-gold mb-4 block">
                El problema
              </span>
              <h3 className="font-serif font-semibold text-cream text-xl mb-3">
                ¿Qué pasa con el feedback que no se recoge?
              </h3>
              <p className="text-sm text-cream-muted leading-relaxed">
                El 90% de los clientes insatisfechos simplemente se van sin decir nada.
                Sin datos, no hay mejora. Sin retroalimentación, repites los mismos errores.
                Tus clientes tienen información valiosa que nunca llega a ti.
              </p>
            </div>

            <div className="reveal mb-10" style={{ opacity: 0 }}>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-gold mb-4 block">
                La solución
              </span>
              <h3 className="font-serif font-semibold text-cream text-xl mb-3">
                Agentes de IA que capturan lo que se pierde
              </h3>
              <div className="space-y-4 mt-6">
                {aiCapabilities.map(({ icon: Icon, title, desc }, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-gold" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h4 className="text-cream text-sm font-medium mb-0.5">{title}</h4>
                      <p className="text-xs text-cream-muted leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="reveal" style={{ opacity: 0 }}>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-gold mb-4 block">
                El flujo de datos
              </span>
              <div className="relative">
                {dataFlowSteps.map(({ icon: Icon, label, desc }, i) => (
                  <div key={i} className="flex items-start gap-4 mb-4 last:mb-0 relative">
                    {i < dataFlowSteps.length - 1 && (
                      <div className="absolute left-5 top-10 w-px h-full bg-cream/10" />
                    )}
                    <div className="w-10 h-10 rounded-full bg-cream/[0.05] border border-cream/10 flex items-center justify-center flex-shrink-0 relative z-10">
                      <Icon className="w-4 h-4 text-gold/70" strokeWidth={1.5} />
                    </div>
                    <div className="pt-1">
                      <p className="text-cream text-[13px] font-medium">{label}</p>
                      <p className="text-[11px] text-cream-muted/50">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Interactive demo */}
          <div className="reveal" style={{ opacity: 0 }}>
            <div className="bg-dark-primary border border-cream/10 p-6 lg:p-8">
              {/* Phase label */}
              <div className="flex items-center justify-between mb-6">
                <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-cream-muted/50">
                  {phase === 'intro' && 'Demo Interactiva'}
                  {phase === 'survey' && 'Encuesta del cliente'}
                  {phase === 'analyzing' && 'IA procesando'}
                  {phase === 'alert' && 'Alerta en tiempo real'}
                  {phase === 'report' && 'Reporte generado'}
                </span>
                <div className="flex gap-1">
                  {(['intro', 'survey', 'analyzing', 'alert', 'report'] as Phase[]).map((p, i) => (
                    <div key={p} className={`w-2 h-2 rounded-full transition-colors ${
                      ['intro', 'survey', 'analyzing', 'alert', 'report'].indexOf(phase) >= i ? 'bg-gold' : 'bg-cream/10'
                    }`} />
                  ))}
                </div>
              </div>

              {renderPhase()}
            </div>

            {/* Mini features */}
            {demoStarted && (
              <div className="grid grid-cols-2 gap-3 mt-4">
                {[
                  'Sin formularios largos',
                  'Alertas en tiempo real',
                  'Reporte diario automático',
                  'Detección de patrones IA',
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-[11px] text-cream-muted/50">
                    <Check className="w-3 h-3 text-gold flex-shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bottom stats */}
        <div className="reveal mt-16 grid grid-cols-3 gap-8 text-center" style={{ opacity: 0 }}>
          {[
            { value: '90%', label: 'de feedback se pierde sin este sistema', icon: Eye },
            { value: '30s', label: 'tiempo promedio de una encuesta', icon: Zap },
            { value: '24/7', label: 'captura de datos automatizada', icon: Database },
          ].map(({ value, label, icon: Icon }, i) => (
            <div key={i} className="flex flex-col items-center">
              <Icon className="w-5 h-5 text-gold/50 mb-3" strokeWidth={1.5} />
              <p className="font-serif text-2xl text-gold mb-1">{value}</p>
              <p className="text-[11px] text-cream-muted/40 max-w-[140px]">{label}</p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="reveal mt-16 text-center" style={{ opacity: 0 }}>
          <a href="#contacto" onClick={(e) => { e.preventDefault(); document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' }) }} className="pill-accent">
            Quiero este sistema para mi negocio
          </a>
          <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-cream-muted/30 mt-3">
            Compatible con cualquier giro: restaurantes, spas, clínicas, tiendas, escuelas
          </p>
        </div>
      </div>
    </section>
  )
}
