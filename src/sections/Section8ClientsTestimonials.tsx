import { useRef, useLayoutEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ChevronLeft, ChevronRight } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const testimonials = [
  {
    quote: 'Necesitaba que mi página de verdad transmitiera lo que hago, porque antes se sentía todo muy frío. Ahora mis pacientes entran, ven de qué trata la terapia y agendan su cita sin que yo tenga que estar enviando mensajes de ida y vuelta. Se siente todo mucho más profesional y organizado, pero sobre todo me quitó un peso de encima con la administración.',
    name: 'Gloria',
    role: 'Terapeuta',
  },
  {
    quote: 'La verdad es que antes me volvía loca con los cuadernos y las agendas de papel; entre las tres sucursales era un relajo. Lo que más me cambió la vida fue dejar de hacer los pagos de las muchachas a mano y no tener que estar cazando las ventas del día. Ahora todo se calcula solo y por fin sé qué onda con los tiempos muertos sin estar pegada ahí. Si no fuera por esto, todavía estaría haciendo cuentas en una libreta hasta las 11 de la noche.',
    name: 'Alejandra',
    role: 'Salón de belleza',
  },
  {
    quote: 'Yo lo que quería era dejar de perder el tiempo revisando plataformas de encuestas que ni entendía. Ahora las reservas caen solas y lo que dicen los clientes me llega directo al celular. Mi gente y yo ya no tenemos que andar adivinando; tenemos la info ahí mismo al momento. Me ahorré muchísimas vueltas y el sistema se encarga de todo.',
    name: 'Roberto Pérez',
    role: 'Restaurante',
  },
]

export default function Section8ClientsTestimonials() {
  const sectionRef = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)

  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const ctx = gsap.context(() => {
      section.querySelectorAll('.reveal').forEach((el, i) => {
        gsap.fromTo(el, { y: 20, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.5, delay: i * 0.08, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 80%', toggleActions: 'play none none reverse' }
        })
      })
    }, section)
    return () => ctx.revert()
  }, [])

  const next = () => setActive((prev) => (prev + 1) % testimonials.length)
  const prev = () => setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length)

  return (
    <section ref={sectionRef} id="clientes" className="relative w-full bg-dark-secondary" style={{ zIndex: 80 }}>
      {/* Client */}
      <div className="max-w-6xl mx-auto px-6 lg:px-12 pt-24 lg:pt-32 pb-16 border-b border-cream/10">
        <h2 className="reveal text-center font-serif font-semibold text-cream mb-4" style={{ fontSize: 'clamp(22px, 2.5vw, 38px)', opacity: 0 }}>
          Clientes principales
        </h2>
        <p className="reveal text-center text-cream-muted text-sm max-w-lg mx-auto mb-12" style={{ opacity: 0 }}>
          Marcas con las que se ha trabajado presencia digital, experiencia operativa o sistemas conectados para crecer con más control.
        </p>

        <div className="reveal max-w-sm mx-auto" style={{ opacity: 0 }}>
          <a href="https://vanityexperience.mx/" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-6 p-6 bg-dark-primary/50 border border-cream/10 hover:border-gold/30 transition-colors">
            <div className="w-14 h-14 rounded-full border border-cream/20 flex items-center justify-center flex-shrink-0 group-hover:border-gold/40 transition-colors">
              <span className="font-serif text-xl text-cream-muted group-hover:text-gold transition-colors">V</span>
            </div>
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-cream-muted/60 mb-1">Belleza · bienestar</p>
              <h3 className="font-serif font-semibold text-cream text-lg mb-1 group-hover:text-gold transition-colors">Vanity Salon & Spa</h3>
              <p className="text-sm text-cream-muted">Marca con trabajo en presencia digital y conexión de sistemas alrededor de agenda, venta y experiencia del cliente.</p>
            </div>
          </a>
        </div>
      </div>

      {/* Testimonials */}
      <div className="max-w-4xl mx-auto px-6 lg:px-12 py-16 lg:py-24">
        <h3 className="reveal text-center font-serif font-semibold text-cream text-xl mb-12" style={{ opacity: 0 }}>
          Lo que cambió en la operación
        </h3>

        <div className="reveal relative" style={{ opacity: 0 }}>
          <div className="bg-dark-primary/50 border border-cream/10 p-8 lg:p-12">
            <p className="text-cream-muted text-sm lg:text-base leading-relaxed italic mb-8">
              "{testimonials[active].quote}"
            </p>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-serif text-cream font-semibold">{testimonials[active].name}</p>
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-cream-muted">{testimonials[active].role}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={prev} className="w-8 h-8 border border-cream/20 flex items-center justify-center text-cream-muted hover:text-gold hover:border-gold/40 transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button onClick={next} className="w-8 h-8 border border-cream/20 flex items-center justify-center text-cream-muted hover:text-gold hover:border-gold/40 transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, i) => (
              <button key={i} onClick={() => setActive(i)} className={`w-2 h-2 rounded-full transition-colors ${i === active ? 'bg-gold' : 'bg-cream/20 hover:bg-cream/40'}`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
