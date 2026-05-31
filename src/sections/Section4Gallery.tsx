import { useRef, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const images = [
  { src: '/images/ai-bot-dashboard.jpg', alt: 'AI Bot Dashboard', span: 'col-span-2 row-span-2' },
  { src: '/images/demo-dashboard.jpg', alt: 'Dashboard operativo en laptop', span: 'col-span-1 row-span-1' },
  { src: '/images/data-flow.jpg', alt: 'Flujo de datos automatizado', span: 'col-span-1 row-span-1' },
]

export default function Section4Gallery() {
  const sectionRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      const els = section.querySelectorAll('.reveal')
      els.forEach((el, i) => {
        gsap.fromTo(el, { y: 30, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.6, delay: i * 0.1, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' }
        })
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="galeria" className="relative w-full bg-dark-primary z-40">
      <div className="max-w-6xl mx-auto px-6 lg:px-12 py-24 lg:py-32">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
          {/* Large featured image */}
          <div className="reveal col-span-2 row-span-2 overflow-hidden" style={{ opacity: 0 }}>
            <img src={images[0].src} alt={images[0].alt} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
          </div>

          {/* Side images */}
          <div className="reveal overflow-hidden" style={{ opacity: 0 }}>
            <img src={images[1].src} alt={images[1].alt} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
          </div>

          <div className="reveal overflow-hidden" style={{ opacity: 0 }}>
            <img src={images[2].src} alt={images[2].alt} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
          </div>
        </div>

        <div className="reveal mt-8 text-center" style={{ opacity: 0 }}>
          <span className="pill bg-dark-secondary text-cream font-mono text-xs uppercase tracking-[0.18em]">
            Sistemas Digitales · Data · IA · Automatización
          </span>
        </div>
      </div>
    </section>
  )
}
