import { useRef, useLayoutEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Check, Mail, MessageCircle } from 'lucide-react'
import SurveyEngine from '@/components/SurveyEngine'
import type { SurveyConfig } from '@/components/SurveyEngine'
import { submitToWebhook } from '@/services/webhook'
import { buildContactEmailReport } from '@/services/emailReport'

gsap.registerPlugin(ScrollTrigger)

const contactConfig: SurveyConfig = {
  id: 's23_homepage_contact',
  name: 'Mini diagnóstico de encuestas',
  welcomeCard: {
    headline: 'Cuéntanos qué quieres medir',
    subheader: 'Con tus respuestas armamos un primer reporte para tu correo y vemos si conviene una llamada.',
    buttonLabel: 'Empezar',
    enabled: false,
  },
  showProgress: true,
  questions: [
    { id: 'nombre', type: 'openText', headline: '¿Cómo te llamas?', required: true, placeholder: 'Tu nombre' },
    { id: 'negocio', type: 'openText', headline: '¿Cómo se llama tu negocio?', required: true, placeholder: 'Nombre del negocio' },
    {
      id: 'email',
      type: 'openText',
      inputType: 'email',
      headline: '¿A qué correo enviamos el reporte?',
      required: true,
      placeholder: 'correo@ejemplo.com',
      validation: { pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$', message: 'Correo electrónico inválido.' },
    },
    {
      id: 'telefono',
      type: 'openText',
      inputType: 'phone',
      headline: '¿Tu WhatsApp?',
      required: true,
      placeholder: '8441234567',
      validation: { pattern: '^\\d{10}$', message: 'Debe tener 10 dígitos.' },
    },
    {
      id: 'tipo_negocio',
      type: 'multipleChoiceSingle',
      headline: '¿En qué giro está tu negocio?',
      required: true,
      choices: [
        { id: 'belleza', label: 'Belleza / Spa / Salón' },
        { id: 'salud', label: 'Salud / Clínica / Consultorio' },
        { id: 'restaurante', label: 'Restaurante / Alimentos' },
        { id: 'retail', label: 'Retail / Ecommerce' },
        { id: 'educacion', label: 'Educación / Cursos' },
        { id: 'industrial', label: 'Industria / Manufactura' },
        { id: 'servicios', label: 'Servicios profesionales' },
        { id: 'otro', label: 'Otro' },
      ],
    },
    {
      id: 'tipo_encuesta',
      type: 'multipleChoiceMulti',
      headline: '¿Qué tipo de encuesta quieres implementar?',
      subheader: 'Puedes elegir más de una.',
      required: true,
      choices: [
        { id: 'satisfaccion_cliente', label: 'Satisfacción de clientes' },
        { id: 'post_servicio', label: 'Post-servicio / post-compra' },
        { id: 'nps', label: 'NPS / recomendación' },
        { id: 'calidad', label: 'Calidad de producto o servicio' },
        { id: 'empleados', label: 'Empleados / clima laboral' },
        { id: 'eventos', label: 'Eventos / RSVP' },
        { id: 'leads', label: 'Captura y calificación de leads' },
        { id: 'diagnostico', label: 'Diagnóstico interno de procesos' },
      ],
    },
    {
      id: 'canal_encuesta',
      type: 'multipleChoiceMulti',
      headline: '¿Dónde quieres levantar respuestas?',
      required: true,
      choices: [
        { id: 'whatsapp', label: 'WhatsApp' },
        { id: 'qr', label: 'QR en sucursal / evento' },
        { id: 'email', label: 'Email' },
        { id: 'web', label: 'Sitio web / landing' },
        { id: 'pos', label: 'Después de venta o pago' },
        { id: 'staff', label: 'Captura interna por staff' },
      ],
    },
    {
      id: 'necesidad',
      type: 'multipleChoiceMulti',
      headline: '¿Qué debería pasar después de responder?',
      required: true,
      choices: [
        { id: 'email_cliente', label: 'Enviar correo con resumen al cliente' },
        { id: 'alertas', label: 'Alertar si hay una respuesta crítica' },
        { id: 'dashboard', label: 'Actualizar dashboard' },
        { id: 'whatsapp_followup', label: 'Dar seguimiento por WhatsApp' },
        { id: 'crm', label: 'Guardar lead o cliente en CRM' },
        { id: 'reporte_semanal', label: 'Enviar reporte semanal interno' },
      ],
    },
    {
      id: 'urgencia',
      type: 'multipleChoiceSingle',
      headline: '¿Cuándo te gustaría tenerlo funcionando?',
      required: true,
      choices: [
        { id: 'ya', label: 'Lo antes posible' },
        { id: '30_dias', label: 'Este mes' },
        { id: 'trimestre', label: 'Este trimestre' },
        { id: 'explorando', label: 'Estoy explorando' },
      ],
    },
    {
      id: 'descripcion',
      type: 'openText',
      headline: '¿Qué decisión quieres tomar con esos datos?',
      subheader: 'Ejemplo: mejorar atención, detectar quejas, medir empleados, vender más cursos, reducir cancelaciones.',
      required: false,
      longAnswer: true,
      placeholder: 'Quiero saber...',
    },
  ],
  ending: {
    headline: 'Recibimos tu diagnóstico',
    subheader: 'El webhook generará el reporte y lo enviará al correo capturado cuando esté configurado.',
  },
}

function extractTags(answers: Record<string, unknown>) {
  return [
    answers.tipo_negocio && `sector:${answers.tipo_negocio}`,
    ...(Array.isArray(answers.tipo_encuesta) ? answers.tipo_encuesta.map((v) => `survey:${v}`) : []),
    ...(Array.isArray(answers.canal_encuesta) ? answers.canal_encuesta.map((v) => `channel:${v}`) : []),
    ...(Array.isArray(answers.necesidad) ? answers.necesidad.map((v) => `automation:${v}`) : []),
  ].filter(Boolean) as string[]
}

export default function Section9Contact() {
  const sectionRef = useRef<HTMLElement>(null)
  const [submitted, setSubmitted] = useState(false)

  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const ctx = gsap.context(() => {
      section.querySelectorAll('.reveal').forEach((el, i) => {
        gsap.fromTo(el, { y: 15, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.5, delay: i * 0.06, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' }
        })
      })
    }, section)
    return () => ctx.revert()
  }, [])

  const handleSubmit = async (answers: Record<string, unknown>, metadata: Record<string, unknown>) => {
    const result = await submitToWebhook({
      type: 'contact_inquiry',
      form_type: 'homepage_contact_mini_survey',
      answers,
      ratings_summary: [],
      open_text_responses: typeof answers.descripcion === 'string' && answers.descripcion.trim()
        ? [
            {
              question_id: 'descripcion',
              text: answers.descripcion.trim(),
              sentiment: 'neutral',
              tags: extractTags(answers),
            },
          ]
        : [],
      email_report: buildContactEmailReport(answers),
      metadata: {
        ...metadata,
        submittedAt: new Date().toISOString(),
        userAgent: navigator.userAgent,
        source: 'homepage_contact_mini_survey',
        form_type: 'homepage_contact_mini_survey',
        survey_name: 'Mini diagnóstico de encuestas',
        language: navigator.language,
        phoneNumber: (answers.telefono as string) || undefined,
      },
    })

    if (result.success || result.queued) {
      setSubmitted(true)
    }
  }

  return (
    <section ref={sectionRef} id="contacto" className="relative w-full bg-dark-secondary py-24 px-6 z-90" style={{ zIndex: 90 }}>
      <div className="max-w-4xl mx-auto">
        <h2 className="reveal text-center font-serif font-semibold text-cream mb-4" style={{ fontSize: 'clamp(24px, 3vw, 42px)', opacity: 0 }}>
          Platicanos de tu caso
        </h2>
        <p className="reveal text-center text-cream-muted text-sm max-w-md mx-auto mb-14" style={{ opacity: 0 }}>
          Responde el mini diagnóstico. El webhook recibe todo con tipo de formulario y datos listos para generar reporte.
        </p>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Left - Contact */}
          <div className="reveal lg:col-span-2" style={{ opacity: 0 }}>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-cream-muted mb-6 block">Habla con nosotros</span>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full border border-cream/20 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-gold" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-cream-muted mb-1">Email</p>
                  <p className="text-cream text-sm mb-1">hi@soul23.mx</p>
                  <a href="mailto:hi@soul23.mx" className="font-mono text-xs uppercase tracking-[0.14em] text-gold hover:text-gold-light transition-colors">Escribir →</a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full border border-cream/20 flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-4 h-4 text-gold" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-cream-muted mb-1">WhatsApp</p>
                  <p className="text-cream text-sm mb-1">+52 1 844 227 8408</p>
                  <a href="https://wa.me/528442278408?text=Hola,%20me%20gustaría%20plantear%20un%20caso" target="_blank" rel="noopener noreferrer" className="font-mono text-xs uppercase tracking-[0.14em] text-gold hover:text-gold-light transition-colors">Abrir chat →</a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full border border-cream/20 flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-4 h-4 text-gold" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-cream-muted mb-1">Talia · citas</p>
                  <p className="text-cream text-sm mb-1">talia@soul23.mx</p>
                  <a href="mailto:talia@soul23.mx" className="font-mono text-xs uppercase tracking-[0.14em] text-gold hover:text-gold-light transition-colors">Escribir →</a>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Survey */}
          <div className="reveal lg:col-span-3" style={{ opacity: 0 }}>
            {submitted ? (
              <div className="bg-dark-primary border border-cream/10 p-8 md:p-10 shadow-2xl text-center">
                <div className="w-14 h-14 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-5">
                  <Check size={28} className="text-gold" />
                </div>
                <h3 className="font-serif font-semibold text-cream text-2xl mb-3">
                  {contactConfig.ending?.headline}
                </h3>
                <p className="text-cream-muted text-[14px] leading-relaxed mb-8">
                  {contactConfig.ending?.subheader}
                </p>
                <a
                  href="https://calendly.com/alma_dev/30min"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 py-3 px-6 bg-gold text-dark-primary font-mono text-[11px] uppercase tracking-[0.12em] hover:bg-gold-light transition-colors"
                >
                  Agendar llamada
                </a>
              </div>
            ) : (
              <SurveyEngine config={contactConfig} onSubmit={handleSubmit} />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
