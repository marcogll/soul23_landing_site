import { useRef, useLayoutEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ChevronLeft, ChevronRight } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const testimonials = [
  {
    text: 'Necesitaba que mi página de verdad transmitiera lo que hago, porque antes se sentía todo muy frío. Ahora mis pacientes entran, ven de qué trata la terapia y agendan su cita sin que yo tenga que estar enviando mensajes de ida y vuelta. Se siente todo mucho más profesional y organizado, pero sobre todo me quitó un peso de encima con la administración.',
    name: 'Gloria',
    business: 'Terapeuta',
  },
  {
    text: 'La verdad es que antes me volvía loca con los cuadernos y las agendas de papel; entre las tres sucursales era un relajo. Lo que más me cambió la vida fue dejar de hacer los pagos de las muchachas a mano y no tener que estar cazando las ventas del día. Ahora todo se calcula solo y por fin sé qué onda con los tiempos muertos sin estar pegada ahí.',
    name: 'Alejandra',
    business: 'Salón de belleza',
  },
  {
    text: 'Yo lo que quería era dejar de perder el tiempo revisando plataformas de encuestas que ni entendía. Ahora las reservas caen solas y lo que dicen los clientes me llega directo al celular. Mi gente y yo ya no tenemos que andar adivinando; tenemos la info ahí mismo al momento. Me ahorré muchísimas vueltas y el sistema se encarga de todo.',
    name: 'Roberto Pérez',
    business: 'Restaurante',
  },
]

export default function Section5Testimonials() {
  const sectionRef = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)

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

  const next = () => setActive((prev) => (prev + 1) % testimonials.length)
  const prev = () => setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length)

  return (
    <section ref={sectionRef} className="relative w-full bg-dark-primary z-50">
      <div className="max-w-3xl mx-auto px-6 py-24 lg:py-32">
        <h2 className="reveal font-serif font-semibold text-cream text-2xl lg:text-3xl text-center mb-12" style={{ opacity: 0 }}>
          Lo que dicen quienes ya lo viven
        </h2>

        <div className="reveal" style={{ opacity: 0 }}>
          <div className="bg-dark-secondary/50 border border-cream/10 p-8 lg:p-10">
            <p className="text-cream-muted text-sm lg:text-base leading-relaxed italic mb-8">
              &ldquo;{testimonials[active].text}&rdquo;
            </p>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-serif text-cream font-semibold">{testimonials[active].name}</p>
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-cream-muted">{testimonials[active].business}</p>
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

          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, i) => (
              <button key={i} onClick={() => setActive(i)} className={`w-2 h-2 rounded-full transition-colors ${i === active ? 'bg-gold' : 'bg-cream/20'}`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
