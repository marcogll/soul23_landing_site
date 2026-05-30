import { useRef, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const capabilities = [
  { title: 'Data & Analytics', items: ['Dashboards en tiempo real', 'KPIs y métricas de negocio', 'Reportes automatizados', 'Visualización de datos', 'Análisis predictivo'] },
  { title: 'IA & Automatización', items: ['Clasificación inteligente', 'Procesamiento de lenguaje', 'Predicción de tendencias', 'Automatización de flujos', 'Detección de anomalías'] },
  { title: 'Integraciones & Bots', items: ['Bots de WhatsApp/Telegram', 'Conectores con CRM/ERP', 'APIs y webhooks', 'Chatbots con IA', 'Integración de plataformas'] },
  { title: 'Control de Negocio', items: ['Gestión de inventario', 'Control de personal', 'Seguimiento de ventas', 'Administración de citas', 'Alertas y notificaciones'] },
]

export default function Section3Capabilities() {
  const sectionRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      const els = section.querySelectorAll('.reveal')
      els.forEach((el, i) => {
        gsap.fromTo(el, { y: 24, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.5, delay: i * 0.06, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' }
        })
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="stack" className="relative w-full bg-dark-primary z-30">
      {/* Banner */}
      <div className="reveal w-full h-[30vh] lg:h-[40vh] overflow-hidden" style={{ opacity: 0 }}>
        <img src="/images/dashboard-wide.jpg" alt="Analytics Dashboard" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dark-primary/60 to-dark-primary" />
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-12 pb-24 lg:pb-32 -mt-16 relative z-10">
        <h2 className="reveal text-center font-serif font-semibold text-cream mb-16" style={{ fontSize: 'clamp(22px, 2.5vw, 38px)', opacity: 0 }}>
          Stack tecnológico para control de negocio
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-0">
          {capabilities.map((cap, i) => (
            <div key={i} className="reveal relative px-5 lg:px-6 py-6 border-l border-cream/10 first:border-l-0" style={{ opacity: 0 }}>
              <h3 className="font-serif font-semibold text-cream text-base lg:text-lg mb-4">{cap.title}</h3>
              <ul className="space-y-2">
                {cap.items.map((item, j) => (
                  <li key={j} className="text-sm text-cream-muted leading-relaxed">{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
