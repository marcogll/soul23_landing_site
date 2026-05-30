import { useRef, useLayoutEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Play, MessageCircle, Bot, Send } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const sampleMessages = [
  { from: 'user', text: 'Hola, quiero agendar una cita para mañana' },
  { from: 'bot', text: '¡Hola! Con gusto te ayudo. ¿Para qué servicio necesitas la cita?' },
  { from: 'user', text: 'Revisión general' },
  { from: 'bot', text: 'Perfecto. Tengo disponibilidad mañana a las 10:00 AM y 2:30 PM. ¿Cuál te funciona?' },
  { from: 'user', text: 'A las 10:00 por favor' },
  { from: 'bot', text: 'Listo ✅ Tu cita está agendada para mañana a las 10:00 AM. Te enviaré un recordatorio 1 hora antes. ¿Algo más en lo que pueda ayudarte?' },
]

export default function Section10DemoBots() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isActive, setIsActive] = useState(false)
  const [visibleCount, setVisibleCount] = useState(0)

  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      const els = section.querySelectorAll('.reveal')
      els.forEach((el, i) => {
        gsap.fromTo(el, { y: 24, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.5, delay: i * 0.08, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' }
        })
      })
    }, section)

    return () => ctx.revert()
  }, [])

  // Simulate conversation when active
  useLayoutEffect(() => {
    if (!isActive) {
      setVisibleCount(0)
      return
    }
    const interval = setInterval(() => {
      setVisibleCount((prev) => {
        if (prev >= sampleMessages.length) {
          clearInterval(interval)
          return prev
        }
        return prev + 1
      })
    }, 1200)
    return () => clearInterval(interval)
  }, [isActive])

  return (
    <section ref={sectionRef} id="demo-bots" className="relative w-full bg-dark-primary" style={{ zIndex: 87 }}>
      <div className="max-w-6xl mx-auto px-6 lg:px-12 py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Bot Preview */}
          <div className="reveal order-2 lg:order-1" style={{ opacity: 0 }}>
            {/* Phone mockup */}
            <div className="relative mx-auto max-w-sm">
              <div className="bg-dark-secondary border border-cream/15 rounded-2xl overflow-hidden shadow-2xl">
                {/* Header */}
                <div className="flex items-center gap-3 px-4 py-3 border-b border-cream/10 bg-dark-secondary">
                  <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-gold" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-sm text-cream font-medium">soul:23 Bot</p>
                    <p className="font-mono text-[9px] text-green-400 uppercase tracking-wider">
                      {isActive ? 'En línea · Escribiendo...' : 'En línea'}
                    </p>
                  </div>
                </div>

                {/* Messages */}
                <div className="px-4 py-4 h-72 overflow-hidden flex flex-col gap-3">
                  {sampleMessages.slice(0, visibleCount).map((msg, i) => (
                    <div key={i} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-[80%] px-3 py-2 text-xs leading-relaxed ${
                          msg.from === 'user'
                            ? 'bg-gold/20 text-cream rounded-l-lg rounded-tr-lg'
                            : 'bg-cream/10 text-cream rounded-r-lg rounded-tl-lg'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}

                  {visibleCount === 0 && !isActive && (
                    <div className="flex-1 flex items-center justify-center">
                      <p className="text-cream-muted text-xs text-center">
                        Presiona "Iniciar conversación" para ver el demo
                      </p>
                    </div>
                  )}

                  {isActive && visibleCount < sampleMessages.length && (
                    <div className="flex justify-start">
                      <div className="bg-cream/10 rounded-r-lg rounded-tl-lg px-3 py-2">
                        <div className="flex gap-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-cream-muted/50 animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-1.5 h-1.5 rounded-full bg-cream-muted/50 animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-1.5 h-1.5 rounded-full bg-cream-muted/50 animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input */}
                <div className="flex items-center gap-2 px-4 py-3 border-t border-cream/10">
                  <input
                    type="text"
                    placeholder="Escribe un mensaje..."
                    disabled
                    className="flex-1 bg-transparent text-xs text-cream-muted placeholder:text-cream-muted/30 border-none outline-none"
                  />
                  <button className="w-7 h-7 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
                    <Send className="w-3 h-3 text-gold" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Text */}
          <div className="order-1 lg:order-2">
            <span className="reveal font-mono text-[10px] uppercase tracking-[0.18em] text-gold mb-4 block" style={{ opacity: 0 }}>
              Demo en vivo
            </span>

            <h2 className="reveal font-serif font-semibold text-cream leading-[1.05] mb-4" style={{ fontSize: 'clamp(26px, 3vw, 48px)', opacity: 0 }}>
              Bots inteligentes para tu negocio.
            </h2>

            <p className="reveal text-sm text-cream-muted leading-relaxed mb-6" style={{ opacity: 0 }}>
              Chatbots de WhatsApp y Telegram con IA integrada que atienden a tus clientes 
              24/7. Agendan citas, responden preguntas frecuentes, toman pedidos y escalan 
              a un humano cuando es necesario. Todo conectado a tus sistemas.
            </p>

            <ul className="reveal space-y-3 mb-8" style={{ opacity: 0 }}>
              {[
                'Respuestas automáticas 24/7',
                'Integración con CRM y base de datos',
                'Escalación inteligente a humanos',
                'Análisis de sentimiento y métricas',
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-cream-muted">
                  <MessageCircle className="w-3.5 h-3.5 text-gold flex-shrink-0" strokeWidth={1.5} />
                  {item}
                </li>
              ))}
            </ul>

            <div className="reveal flex gap-4" style={{ opacity: 0 }}>
              <button
                onClick={() => {
                  setIsActive(!isActive)
                  if (isActive) setVisibleCount(0)
                }}
                className="pill-accent inline-flex items-center gap-2"
              >
                <Play className="w-3 h-3" />
                {isActive ? 'Reiniciar' : 'Iniciar conversación'}
              </button>
              <a href="#contacto" onClick={(e) => { e.preventDefault(); document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' }) }}
                className="pill text-cream-muted hover:text-gold">
                Configurar bot
              </a>
            </div>
          </div>
        </div>

        {/* Placeholder notice */}
        <div className="reveal mt-12 text-center" style={{ opacity: 0 }}>
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-cream-muted/40">
            Demo interactivo completo próximamente · Conversación simulada con IA
          </p>
        </div>
      </div>
    </section>
  )
}
