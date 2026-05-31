import { useRef, useLayoutEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Check, Mail, MessageCircle } from 'lucide-react'
import SurveyEngine from '@/components/SurveyEngine'
import type { SurveyConfig } from '@/components/SurveyEngine'
import { submitToWebhook } from '@/services/webhook'
import { buildContactEmailReport } from '@/services/emailReport'
import {
  CONTACT_AUTOMATION_CHOICES,
  CONTACT_CHANNEL_CHOICES,
  CONTACT_AUDIENCE_CHOICES,
  CONTACT_MOMENT_CHOICES,
  CONTACT_SECTOR_CHOICES,
  CONTACT_SURVEY_TYPE_CHOICES,
  CONTACT_URGENCY_CHOICES,
  enrichContactAnswers,
  getContactTags,
} from '@/services/contactSurveyPayload'

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
    {
      id: 'tipo_negocio',
      type: 'multipleChoiceSingle',
      headline: 'Primero: ¿en qué giro está tu negocio?',
      subheader: 'Esto cambia el lenguaje, métricas y preguntas que conviene usar.',
      required: true,
      choices: CONTACT_SECTOR_CHOICES,
    },
    {
      id: 'tipo_encuesta',
      type: 'multipleChoiceMulti',
      headline: 'Ahora elige qué tipo de encuesta quieres hacer',
      subheader: 'Puedes elegir más de una. Esto se manda al webhook como selección completa para generar emails y reporte.',
      required: true,
      choices: CONTACT_SURVEY_TYPE_CHOICES,
    },
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
      validation: { pattern: '^\\d{10,13}$', message: 'Debe tener entre 10 y 13 dígitos.' },
    },
    {
      id: 'canal_encuesta',
      type: 'multipleChoiceMulti',
      headline: '¿Dónde quieres levantar respuestas?',
      required: true,
      choices: CONTACT_CHANNEL_CHOICES,
    },
    {
      id: 'audiencia_encuesta',
      type: 'multipleChoiceMulti',
      headline: '¿Quién va a responder esa encuesta?',
      subheader: 'Esto ayuda a que el correo no suene genérico y use el contexto correcto.',
      required: true,
      choices: CONTACT_AUDIENCE_CHOICES,
    },
    {
      id: 'momento_encuesta',
      type: 'multipleChoiceMulti',
      headline: '¿En qué momento quieres pedir la respuesta?',
      subheader: 'El momento define automatizaciones, recordatorios y alertas.',
      required: true,
      choices: CONTACT_MOMENT_CHOICES,
    },
    {
      id: 'necesidad',
      type: 'multipleChoiceMulti',
      headline: '¿Qué debería pasar después de responder?',
      required: true,
      choices: CONTACT_AUTOMATION_CHOICES.filter((choice) => ['email_cliente', 'alertas', 'dashboard', 'whatsapp_followup', 'crm', 'reporte_semanal'].includes(choice.id)),
    },
    {
      id: 'urgencia',
      type: 'multipleChoiceSingle',
      headline: '¿Cuándo te gustaría tenerlo funcionando?',
      required: true,
      choices: CONTACT_URGENCY_CHOICES,
    },
    {
      id: 'decision_principal',
      type: 'openText',
      headline: '¿Qué decisión quieres poder tomar con esas respuestas?',
      subheader: 'Ejemplo: saber por qué cancelan, qué curso vender más, qué empleado necesita apoyo.',
      required: true,
      longAnswer: true,
      placeholder: 'Quiero decidir...',
    },
    {
      id: 'pregunta_clave',
      type: 'openText',
      headline: '¿Cuál es la pregunta que no te puedes quitar de la cabeza?',
      subheader: 'La usaremos como centro del reporte que recibe el cliente.',
      required: false,
      longAnswer: true,
      placeholder: 'Necesito saber si...',
    },
    {
      id: 'alerta_critica',
      type: 'openText',
      headline: '¿Qué respuesta debería prender una alerta inmediata?',
      subheader: 'Ejemplo: mala atención, cancelación, queja grave, empleado saturado, lead urgente.',
      required: false,
      longAnswer: true,
      placeholder: 'Alertar si alguien responde...',
    },
    {
      id: 'descripcion',
      type: 'openText',
      headline: '¿Algo más que deba saber Talia para personalizar el reporte?',
      subheader: 'Contexto operativo, sucursales, volumen, problema actual o cómo hoy levantan feedback.',
      required: false,
      longAnswer: true,
      placeholder: 'Hoy lo hacemos así...',
    },
  ],
  ending: {
    headline: 'Recibimos tu diagnóstico',
    subheader: 'El webhook generará el reporte y lo enviará al correo capturado cuando esté configurado.',
  },
}

export default function Section9Contact() {
  const sectionRef = useRef<HTMLElement>(null)
  const [submitted, setSubmitted] = useState(false)
  const [contactOpen, setContactOpen] = useState(true)

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
    const enrichedAnswers = enrichContactAnswers(answers)
    const result = await submitToWebhook({
      type: 'contact_inquiry',
      form_type: 'homepage_contact_mini_survey',
      answers: enrichedAnswers,
      ratings_summary: [],
      open_text_responses: typeof answers.descripcion === 'string' && answers.descripcion.trim()
        ? [
            {
              question_id: 'descripcion',
              text: answers.descripcion.trim(),
              sentiment: 'neutral',
              tags: getContactTags(answers),
            },
          ]
        : [],
      email_report: buildContactEmailReport(enrichedAnswers),
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
            ) : contactOpen ? (
              <SurveyEngine
                config={contactConfig}
                onSubmit={handleSubmit}
                onClose={() => setContactOpen(false)}
                autoFocus={false}
              />
            ) : (
              <div className="bg-dark-primary border border-cream/10 p-8 md:p-10 shadow-2xl text-center">
                <h3 className="font-serif font-semibold text-cream text-2xl mb-3">
                  Diagnóstico cerrado
                </h3>
                <p className="text-cream-muted text-[14px] leading-relaxed mb-8">
                  Puedes volver a abrirlo cuando quieras para elegir giro, tipo de encuesta y automatizaciones.
                </p>
                <button
                  type="button"
                  onClick={() => setContactOpen(true)}
                  className="inline-flex items-center gap-2 py-3 px-6 bg-gold text-dark-primary font-mono text-[11px] uppercase tracking-[0.12em] hover:bg-gold-light transition-colors"
                >
                  Abrir diagnóstico
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
