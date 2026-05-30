import { useRef, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Brain, MessageSquare, Sparkles, Zap, Eye, LineChart } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const capabilities = [
  {
    icon: MessageSquare,
    title: 'Chatbots inteligentes',
    description: 'Bots de WhatsApp y Telegram con IA que entienden contexto, recuerdan conversaciones y responden como un humano entrenado. Atienden 24/7, escalan cuando es necesario.',
  },
  {
    icon: Eye,
    title: 'Visión por computadora',
    description: 'Análisis de imágenes y video para inventario visual, reconocimiento facial para control de acceso, y detección de patrones en material visual.',
  },
  {
    icon: LineChart,
    title: 'Predicción y forecasting',
    description: 'Modelos que predicen demanda, detectan anomalías en ventas, previenen cancelaciones y alertan sobre tendencias antes de que sucedan.',
  },
  {
    icon: Sparkles,
    title: 'Generación de contenido',
    description: 'IA que genera descripciones de productos, respuestas a reseñas, copy para redes sociales y reportes ejecutivos automatizados.',
  },
  {
    icon: Zap,
    title: 'Automatización inteligente',
    description: 'Flujos de trabajo que combinan IA con acciones automáticas: clasificar leads, enviar recordatorios, generar reportes y tomar decisiones basadas en datos.',
  },
  {
    icon: Brain,
    title: 'Consultoría en IA',
    description: 'Analizamos tu operación e identificamos los puntos exactos donde la IA puede generar más impacto. Roadmap personalizado de adopción de inteligencia artificial.',
  },
]

const useCases = [
  { business: 'Salón de belleza', use: 'Bot de citas + predicción de cancelaciones', result: '-70% no-shows' },
  { business: 'Restaurante', use: 'Análisis de sentimiento en feedback', result: '+35% satisfacción' },
  { business: 'Clínica', use: 'Clasificación automática de pacientes', result: '-50% tiempo admin' },
  { business: 'Tienda online', use: 'Predicción de demanda + inventario', result: '-25% stockouts' },
]

export default function SectionDesarrolloIA() {
  const sectionRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const ctx = gsap.context(() => {
      section.querySelectorAll('.reveal').forEach((el, i) => {
        gsap.fromTo(el, { y: 20, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.5, delay: i * 0.06, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' }
        })
      })
    }, section)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="ia" className="relative w-full bg-dark-primary" style={{ zIndex: 56 }}>
      <div className="max-w-6xl mx-auto px-6 lg:px-12 py-24 lg:py-32">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="reveal font-mono text-[10px] uppercase tracking-[0.18em] text-gold mb-4 block" style={{ opacity: 0 }}>
            Desarrollo con IA
          </span>
          <h2 className="reveal font-serif font-semibold text-cream leading-[1.05] mb-4" style={{ fontSize: 'clamp(26px, 3vw, 48px)', opacity: 0 }}>
            Tu negocio, más inteligente.<br />
            <span className="text-gold">Automatizado con IA.</span>
          </h2>
          <p className="reveal text-sm text-cream-muted max-w-xl mx-auto" style={{ opacity: 0 }}>
            Implementamos inteligencia artificial en puntos estratégicos de tu operación 
            para reducir carga manual, predecir problemas y tomar decisiones basadas en datos.
          </p>
        </div>

        {/* Capabilities */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 mb-16">
          {capabilities.map((cap, i) => {
            const Icon = cap.icon
            return (
              <div key={i} className="reveal relative px-6 py-8 border-l border-t border-cream/10 first:border-l-0 lg:[&:nth-child(-n+3)]:border-t-0" style={{ opacity: 0 }}>
                <Icon className="w-5 h-5 text-gold mb-4" strokeWidth={1.5} />
                <h3 className="font-serif font-semibold text-cream text-base mb-2">{cap.title}</h3>
                <p className="text-sm text-cream-muted leading-relaxed">{cap.description}</p>
              </div>
            )
          })}
        </div>

        {/* Use cases */}
        <div className="reveal bg-dark-secondary/50 border border-cream/10 p-6 lg:p-8" style={{ opacity: 0 }}>
          <h3 className="font-serif font-semibold text-cream text-lg mb-6 text-center">
            Casos de uso reales
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {useCases.map((uc, i) => (
              <div key={i} className="text-center p-4 bg-dark-primary/50">
                <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-cream-muted/60 mb-1">{uc.business}</p>
                <p className="text-sm text-cream mb-2">{uc.use}</p>
                <p className="font-serif text-lg text-gold">{uc.result}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="reveal mt-12 text-center" style={{ opacity: 0 }}>
          <a href="#contacto" onClick={(e) => { e.preventDefault(); document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' }) }} className="pill-accent">
            Diagnosticar con IA
          </a>
        </div>
      </div>
    </section>
  )
}
