import { useRef, useLayoutEffect, useState, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { QrCode, Smartphone, Brain, Mail, AlertTriangle, Star, ThumbsUp, ThumbsDown, Meh, Send, Check, ChevronRight, RotateCcw } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const surveyQuestions = [
  { id: 1, text: '¿Cómo fue tu experiencia hoy?', emoji: true },
  { id: 2, text: '¿La comida llegó a tiempo?', options: ['Sí, rápido', 'Regular', 'Se tardó'] },
  { id: 3, text: '¿El sabor estuvo?', options: ['Excelente', 'Bueno', 'Puede mejorar'] },
  { id: 4, text: '¿Volverías?', options: ['Definitivamente', 'Tal vez', 'Necesitan mejorar'] },
]

type Phase = 'qr' | 'survey' | 'analyzing' | 'alert' | 'email'

export default function SectionFeedbackLive() {
  const sectionRef = useRef<HTMLElement>(null)
  const [phase, setPhase] = useState<Phase>('qr')
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [showPulse, setShowPulse] = useState(false)

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

  // Pulse animation for alert
  useEffect(() => {
    if (phase === 'alert') {
      const interval = setInterval(() => setShowPulse(p => !p), 800)
      return () => clearInterval(interval)
    }
  }, [phase])

  const handleAnswer = (answer: string) => {
    setAnswers(prev => ({ ...prev, [surveyQuestions[currentQ].id]: answer }))
    if (currentQ < surveyQuestions.length - 1) {
      setTimeout(() => setCurrentQ(prev => prev + 1), 300)
    } else {
      setTimeout(() => setPhase('analyzing'), 400)
      setTimeout(() => setPhase('alert'), 2500)
    }
  }

  const reset = () => {
    setPhase('qr')
    setCurrentQ(0)
    setAnswers({})
  }

  const renderPhase = () => {
    switch (phase) {
      case 'qr':
        return (
          <div className="text-center">
            <div className="w-48 h-48 mx-auto bg-cream rounded-lg flex items-center justify-center mb-6 relative cursor-pointer hover:scale-105 transition-transform" onClick={() => setPhase('survey')}>
              {/* QR Code simulation */}
              <div className="grid grid-cols-7 grid-rows-7 gap-0.5 w-36 h-36">
                {Array.from({ length: 49 }).map((_, i) => (
                  <div key={i} className={`${[0,1,2,5,6,7,8,12,13,14,19,20,26,27,28,33,34,35,36,40,41,42,46,47,48].includes(i) ? 'bg-dark-primary' : 'bg-transparent'} ${i === 24 ? 'bg-gold' : ''}`} />
                ))}
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gold text-dark-primary font-mono text-[8px] uppercase tracking-wider px-3 py-1 whitespace-nowrap">
                Toca para probar
              </div>
            </div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-cream-muted mb-2">En la mesa del restaurante</p>
            <p className="text-sm text-cream">El cliente escanea el QR al terminar de comer</p>
          </div>
        )

      case 'survey':
        return (
          <div className="max-w-xs mx-auto">
            <div className="flex items-center gap-2 mb-4">
              {surveyQuestions.map((_, i) => (
                <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= currentQ ? 'bg-gold' : 'bg-cream/20'}`} />
              ))}
            </div>
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-cream-muted mb-4">Pregunta {currentQ + 1} de {surveyQuestions.length}</p>
            <h4 className="font-serif font-semibold text-cream text-lg mb-6">{surveyQuestions[currentQ].text}</h4>

            {surveyQuestions[currentQ].emoji ? (
              <div className="flex justify-center gap-4">
                {[
                  { icon: ThumbsUp, label: 'Excelente', color: 'text-green-400' },
                  { icon: Meh, label: 'Regular', color: 'text-amber-400' },
                  { icon: ThumbsDown, label: 'Mala', color: 'text-red-400' },
                ].map(({ icon: Icon, label, color }) => (
                  <button key={label} onClick={() => handleAnswer(label)} className="flex flex-col items-center gap-2 p-4 bg-dark-primary border border-cream/10 hover:border-gold/50 transition-colors">
                    <Icon className={`w-7 h-7 ${color}`} strokeWidth={1.5} />
                    <span className="text-[10px] text-cream-muted">{label}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {surveyQuestions[currentQ].options?.map(opt => (
                  <button key={opt} onClick={() => handleAnswer(opt)} className="w-full text-left px-4 py-3 bg-dark-primary border border-cream/10 text-sm text-cream-muted hover:border-gold/50 hover:text-cream transition-colors flex items-center justify-between">
                    {opt}
                    <ChevronRight className="w-3 h-3 text-cream-muted/40" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )

      case 'analyzing':
        return (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-6 relative">
              <Brain className="w-10 h-10 text-gold mx-auto" strokeWidth={1} />
              <div className="absolute inset-0 border border-gold/30 rounded-full animate-ping" />
            </div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-gold mb-2">IA analizando respuestas</p>
            <p className="text-sm text-cream-muted">Clasificando sentimiento, detectando alertas, generando reporte...</p>
            <div className="flex justify-center gap-1 mt-6">
              {[0,1,2,3,4].map(i => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-gold animate-bounce" style={{ animationDelay: `${i * 100}ms` }} />
              ))}
            </div>
          </div>
        )

      case 'alert':
        return (
          <div className="text-center">
            {/* Notification card */}
            <div className={`max-w-xs mx-auto bg-dark-primary border p-4 mb-6 text-left transition-all duration-500 ${showPulse ? 'border-red-400/60 shadow-lg shadow-red-400/10' : 'border-cream/10'}`}>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-red-400/20 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-4 h-4 text-red-400" strokeWidth={1.5} />
                </div>
                <div className="flex-1">
                  <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-red-400 mb-1">Alerta inmediata</p>
                  <p className="text-xs text-cream mb-1">Mesa 4 - Cliente insatisfecho</p>
                  <p className="text-[10px] text-cream-muted">"{answers[1] === 'Mala' ? 'Experiencia mala' : answers[3] === 'Necesitan mejorar' ? 'No quiere volver' : 'Sabor puede mejorar'}"</p>
                  <div className="flex gap-1 mt-2">
                    {[1,2,3].map(i => <Star key={i} className="w-3 h-3 text-gold" fill="currentColor" />)}
                    {[4,5].map(i => <Star key={i} className="w-3 h-3 text-cream/20" />)}
                  </div>
                </div>
                <span className="font-mono text-[8px] text-cream-muted/40">Ahora</span>
              </div>
            </div>

            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-gold mb-2">Así lo recibe el dueño</p>
            <p className="text-sm text-cream-muted mb-6">En su celular, al instante. Sin abrir plataformas complicadas.</p>

            <button onClick={() => setPhase('email')} className="pill-accent inline-flex items-center gap-2">
              Ver reporte por email <Send className="w-3 h-3" />
            </button>
          </div>
        )

      case 'email':
        return (
          <div className="text-center">
            {/* Email preview */}
            <div className="max-w-sm mx-auto bg-cream rounded-sm overflow-hidden text-dark-primary mb-6">
              {/* Email header */}
              <div className="bg-dark-primary px-4 py-3 border-b border-cream/20">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center">
                    <Brain className="w-3 h-3 text-gold" />
                  </div>
                  <div>
                    <p className="text-[10px] text-cream font-medium">soul:23 Feedback AI</p>
                    <p className="text-[8px] text-cream-muted">Reporte diario - Restaurante Don Pepe</p>
                  </div>
                </div>
              </div>
              {/* Email body */}
              <div className="p-5">
                <h4 className="font-serif font-semibold text-lg mb-4">Resumen del día</h4>
                <div className="grid grid-cols-3 gap-3 mb-5">
                  <div className="text-center p-2 bg-dark-primary/5 rounded">
                    <p className="font-serif text-xl text-gold">4.2</p>
                    <p className="text-[8px] text-cream-muted uppercase tracking-wider">Promedio</p>
                  </div>
                  <div className="text-center p-2 bg-dark-primary/5 rounded">
                    <p className="font-serif text-xl text-green-600">23</p>
                    <p className="text-[8px] text-cream-muted uppercase tracking-wider">Encuestas</p>
                  </div>
                  <div className="text-center p-2 bg-red-50 rounded">
                    <p className="font-serif text-xl text-red-500">2</p>
                    <p className="text-[8px] text-red-400 uppercase tracking-wider">Alertas</p>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-[11px]">
                    <Check className="w-3 h-3 text-green-500" />
                    <span>85% calificaron "Excelente" el sabor</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px]">
                    <Check className="w-3 h-3 text-green-500" />
                    <span>78% dijeron que volverían</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px]">
                    <AlertTriangle className="w-3 h-3 text-amber-500" />
                    <span>3 quejas sobre tiempo de espera</span>
                  </div>
                </div>
                <div className="bg-dark-primary/5 p-3 rounded text-[10px] text-cream-muted italic">
                  "La IA detectó un patrón: las mesas 3-6 esperan 15 min más que el promedio los viernes. Recomendación: revisar staffing de cocina."
                </div>
              </div>
              {/* Email footer */}
              <div className="bg-dark-primary/5 px-4 py-2 text-center">
                <p className="text-[8px] text-cream-muted">Powered by soul:23 · Feedback automatizado con IA</p>
              </div>
            </div>

            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-gold mb-2">Reporte automático por email</p>
            <p className="text-sm text-cream-muted mb-6">Cada mañana el dueño recibe un resumen claro con accionables.</p>

            <button onClick={reset} className="pill text-cream-muted hover:text-gold inline-flex items-center gap-2">
              <RotateCcw className="w-3 h-3" /> Probar otra vez
            </button>
          </div>
        )
    }
  }

  return (
    <section ref={sectionRef} id="feedback" className="relative w-full bg-dark-secondary" style={{ zIndex: 55 }}>
      <div className="max-w-4xl mx-auto px-6 lg:px-12 py-24 lg:py-32">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="reveal font-mono text-[10px] uppercase tracking-[0.18em] text-gold mb-4 block" style={{ opacity: 0 }}>
            Feedback Automático
          </span>
          <h2 className="reveal font-serif font-semibold text-cream leading-[1.05] mb-4" style={{ fontSize: 'clamp(24px, 3vw, 42px)', opacity: 0 }}>
            Sabe qué piensan tus clientes.<br />
            <span className="text-gold">Sin preguntar uno por uno.</span>
          </h2>
          <p className="reveal text-cream-muted text-sm max-w-lg mx-auto" style={{ opacity: 0 }}>
            QR en la mesa → Encuesta de 30 segundos → IA analiza → Alerta al instante en tu celular → Reporte diario por email.
            Así de simple.
          </p>
        </div>

        {/* Two columns: explanation + live demo */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left: The flow explanation */}
          <div>
            {[
              { icon: QrCode, step: '1', title: 'QR en cada mesa', desc: 'El cliente escanea al pagar. Sin apps, sin registro.' },
              { icon: Smartphone, step: '2', title: 'Encuesta de 30 segundos', desc: '4 preguntas simples. Emoji, no formularios. El cliente responde sin esfuerzo.' },
              { icon: Brain, step: '3', title: 'IA analiza al instante', desc: 'Clasifica sentimiento, detecta problemas, identifica patrones. Automático.' },
              { icon: Mail, step: '4', title: 'Alerta + reporte diario', desc: 'Alerta inmediata si algo va mal. Reporte claro cada mañana con accionables.' },
            ].map(({ icon: Icon, step, title, desc }, i) => (
              <div key={i} className="reveal flex items-start gap-4 mb-6 last:mb-0" style={{ opacity: 0 }}>
                <div className="w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-gold" strokeWidth={1.5} />
                </div>
                <div>
                  <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-gold">Paso {step}</span>
                  <h4 className="font-serif font-semibold text-cream text-sm mb-1">{title}</h4>
                  <p className="text-xs text-cream-muted leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Live interactive demo */}
          <div className="reveal" style={{ opacity: 0 }}>
            <div className="bg-dark-primary border border-cream/10 p-6 lg:p-8">
              {/* Phase label */}
              <div className="flex items-center justify-between mb-6">
                <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-cream-muted">
                  {phase === 'qr' && '1. QR en la mesa'}
                  {phase === 'survey' && '2. Encuesta del cliente'}
                  {phase === 'analyzing' && '3. IA procesando'}
                  {phase === 'alert' && '4. Alerta al dueño'}
                  {phase === 'email' && '5. Reporte por email'}
                </span>
                <div className="flex gap-1">
                  {(['qr', 'survey', 'analyzing', 'alert', 'email'] as Phase[]).map((p, i) => (
                    <div key={p} className={`w-2 h-2 rounded-full ${
                      ['qr','survey','analyzing','alert','email'].indexOf(phase) >= i ? 'bg-gold' : 'bg-cream/15'
                    }`} />
                  ))}
                </div>
              </div>

              {/* Phase content */}
              {renderPhase()}
            </div>

            {/* Mini features */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              {[
                'Sin formularios largos',
                'Alertas en tiempo real',
                'Reporte diario automático',
                'Detección de patrones con IA',
              ].map((f, i) => (
                <div key={i} className="flex items-center gap-2 text-[11px] text-cream-muted">
                  <Check className="w-3 h-3 text-gold flex-shrink-0" />
                  {f}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="reveal mt-16 text-center" style={{ opacity: 0 }}>
          <a href="#contacto" onClick={(e) => { e.preventDefault(); document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' }) }} className="pill-accent">
            Quiero feedback automático para mi restaurante
          </a>
          <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-cream-muted/40 mt-3">
            Compatible con cualquier giro: restaurantes, spas, clínicas, tiendas
          </p>
        </div>
      </div>
    </section>
  )
}
