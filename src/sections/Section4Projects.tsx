import { useRef, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const projects = [
  {
    name: 'Vanity Experience',
    type: 'Salón · Spa · Academy',
    what: 'Sitio principal con reservas, servicios, contenido de marca y acceso a academy.',
    result: 'Unifica la experiencia pública de marca y facilita el camino a reserva o curso.',
    image: '/images/vanityexp.png',
    link: 'https://vanityexperience.mx/',
  },
  {
    name: 'Cursos Vanity',
    type: 'Ecommerce · Cursos',
    what: 'Academy con WooCommerce, carrito, checkout y cursos para venta digital.',
    result: 'La venta de formación vive separada del salón, pero conectada a la marca.',
    image: '/images/cursos_vanity.png',
    link: 'https://cursos.vanityexperience.mx/',
  },
  {
    name: 'Dra. Daniela Flores',
    type: 'Salud · Landing',
    what: 'Página de contacto con WhatsApp, Doctoralia, ubicación, pagos y servicios.',
    result: 'Reduce fricción para pacientes que necesitan agendar o encontrar datos clave.',
    image: '/images/dradfg.jpg',
    link: 'https://dradfg.soul23.mx/',
  },
  {
    name: 'Gloria',
    type: 'Salud · Sitio web',
    what: 'Presencia digital clara para servicios profesionales y contacto directo.',
    result: 'Convierte visitas en conversaciones sin depender de mensajes manuales repetidos.',
    image: '/images/gloria_demo.png',
    link: 'https://gloria.soul23.mx/',
  },
  {
    name: 'Dashboard Beauty',
    type: 'Dashboard · Operación',
    what: 'Panel de prueba para citas, clientes, staff, ventas, comisiones y rentabilidad.',
    result: 'Muestra el negocio por sucursal, staff, categoría y periodo en un solo lugar.',
    image: '/images/business-dashboard.png',
    link: 'https://agytao39e2jhy56eqobo1fqg.soul23.cloud/',
  },
  {
    name: 'Dashboard Industrial',
    type: 'Dashboard · Manufactura',
    what: 'Panel ejecutivo para producción, partes, kanban, analytics y alertas operativas.',
    result: 'Convierte datos de planta en decisiones visibles para dirección y operación.',
    image: '/images/industry-dashboard.png',
    link: 'https://h40uopuz4q1ymockyok4mrjn.soul23.cloud/',
  },
]

export default function Section4Projects() {
  const sectionRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const ctx = gsap.context(() => {
      section.querySelectorAll('.reveal').forEach((el, i) => {
        gsap.fromTo(el, { y: 20, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.5, delay: i * 0.1, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' }
        })
      })
    }, section)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="proyectos" className="relative w-full bg-dark-secondary z-40">
      <div className="max-w-5xl mx-auto px-6 py-24 lg:py-32">
        <h2 className="reveal font-serif font-semibold text-cream text-2xl lg:text-3xl text-center mb-4" style={{ opacity: 0 }}>
          Negocios que ya operan solos
        </h2>
        <p className="reveal text-cream-muted text-sm text-center mb-14" style={{ opacity: 0 }}>
          Historias reales de negocios como el tuyo.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <a key={i} href={project.link} target="_blank" rel="noopener noreferrer" className="reveal group block" style={{ opacity: 0 }}>
              <div className="overflow-hidden mb-4 bg-dark-primary">
                <img src={project.image} alt={project.name} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-gold mb-1">{project.type}</p>
              <h3 className="font-serif font-semibold text-cream text-lg mb-2">{project.name}</h3>
              <p className="text-sm text-cream-muted mb-2">{project.what}</p>
              <p className="text-sm text-cream/70 italic">"{project.result}"</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
