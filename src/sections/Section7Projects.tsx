import { useRef, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const projects = [
  {
    title: 'Cursos Vanity Experience',
    category: 'Ecommerce · Tutoriales',
    description: 'Plataforma de ecommerce para vender cursos y productos educativos de la marca.',
    image: '/images/vanity_academy.png',
    link: 'https://cursos.vanityexperience.mx/',
  },
  {
    title: 'Vanity Experience',
    category: 'Salud · Agenda · Venta',
    description: 'Plataforma de terapia con agenda de citas, venta de cursos y artículos digitales.',
    image: '/images/vanityexp.png',
    link: 'https://vanityexperience.mx/',
  },
  {
    title: 'Daniela Flores',
    category: 'Landing · Agenda',
    description: 'Landing de redirección para consulta médica y contacto de pacientes.',
    image: '/images/dradfg.jpg',
    link: 'https://dradfg.soul23.mx/',
  },
  {
    title: 'Gloria',
    category: 'Salud · Sitio web',
    description: 'Sitio de presentación para servicios de salud y contacto directo.',
    image: '/images/gloria_demo.png',
    link: 'https://gloria.soul23.mx/',
  },
  {
    title: 'Surveys con IA',
    category: 'Survey · IA · Reporte',
    description: 'Formulario que recibe respuestas, analiza la información y genera un reporte accionable sin captura manual.',
    image: '/images/ai-survey.jpg',
    link: 'https://feedback.soul23.mx/',
  },
]

export default function Section7Projects() {
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
    <section ref={sectionRef} id="despliegues" className="relative w-full bg-dark-primary" style={{ zIndex: 70 }}>
      <div className="max-w-6xl mx-auto px-6 lg:px-12 py-24 lg:py-32">
        <h2 className="reveal text-center font-serif font-semibold text-cream mb-4" style={{ fontSize: 'clamp(22px, 2.5vw, 38px)', opacity: 0 }}>
          Despliegues
        </h2>
        <p className="reveal text-center text-cream-muted text-sm max-w-lg mx-auto mb-12" style={{ opacity: 0 }}>
          Sistemas implementados en operación real. Cada caso resuelve una parte específica: captación, agenda, venta o control interno.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <a key={i} href={project.link} target="_blank" rel="noopener noreferrer" className="reveal group block" style={{ opacity: 0 }}>
              <div className="overflow-hidden mb-4 bg-dark-secondary">
                <img src={project.image} alt={project.title} className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-cream-muted/60 mb-1">{project.category}</p>
              <h3 className="font-serif font-semibold text-cream text-lg mb-2 group-hover:text-gold transition-colors">{project.title}</h3>
              <p className="text-sm text-cream-muted leading-relaxed">{project.description}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
