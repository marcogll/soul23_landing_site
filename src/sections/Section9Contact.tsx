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
import { useLanguage } from '../contexts/LanguageContext'

gsap.registerPlugin(ScrollTrigger)

function buildContactConfig(t: (k: string) => string): SurveyConfig {
  return {
    id: 's23_homepage_contact',
    name: t('contacto.config.name'),
    welcomeCard: {
      headline: t('contacto.config.welcome.headline'),
      subheader: t('contacto.config.welcome.subheader'),
      buttonLabel: t('contacto.config.welcome.buttonLabel'),
      enabled: false,
    },
    showProgress: true,
    questions: [
      { id: 'tipo_negocio', type: 'multipleChoiceSingle', headline: t('contacto.q.tipo_negocio.headline'), subheader: t('contacto.q.tipo_negocio.subheader'), required: true, choices: CONTACT_SECTOR_CHOICES },
      { id: 'tipo_encuesta', type: 'multipleChoiceMulti', headline: t('contacto.q.tipo_encuesta.headline'), subheader: t('contacto.q.tipo_encuesta.subheader'), required: true, choices: CONTACT_SURVEY_TYPE_CHOICES },
      { id: 'nombre', type: 'openText', headline: t('contacto.q.nombre.headline'), required: true, placeholder: t('contacto.q.nombre.placeholder') },
      { id: 'negocio', type: 'openText', headline: t('contacto.q.negocio.headline'), required: true, placeholder: t('contacto.q.negocio.placeholder') },
      { id: 'email', type: 'openText', inputType: 'email', headline: t('contacto.q.email.headline'), required: true, placeholder: t('contacto.q.email.placeholder'), validation: { pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$', message: t('contacto.q.email.validation') } },
      { id: 'telefono', type: 'openText', inputType: 'phone', headline: t('contacto.q.telefono.headline'), required: true, placeholder: t('contacto.q.telefono.placeholder'), validation: { pattern: '^\\d{10,13}$', message: t('contacto.q.telefono.validation') } },
      { id: 'canal_encuesta', type: 'multipleChoiceMulti', headline: t('contacto.q.canal.headline'), required: true, choices: CONTACT_CHANNEL_CHOICES },
      { id: 'audiencia_encuesta', type: 'multipleChoiceMulti', headline: t('contacto.q.audiencia.headline'), subheader: t('contacto.q.audiencia.subheader'), required: true, choices: CONTACT_AUDIENCE_CHOICES },
      { id: 'momento_encuesta', type: 'multipleChoiceMulti', headline: t('contacto.q.momento.headline'), subheader: t('contacto.q.momento.subheader'), required: true, choices: CONTACT_MOMENT_CHOICES },
      { id: 'necesidad', type: 'multipleChoiceMulti', headline: t('contacto.q.necesidad.headline'), required: true, choices: CONTACT_AUTOMATION_CHOICES.filter((c) => ['email_cliente', 'alertas', 'dashboard', 'whatsapp_followup', 'crm', 'reporte_semanal'].includes(c.id)) },
      { id: 'urgencia', type: 'multipleChoiceSingle', headline: t('contacto.q.urgencia.headline'), required: true, choices: CONTACT_URGENCY_CHOICES },
      { id: 'decision_principal', type: 'openText', headline: t('contacto.q.decision.headline'), subheader: t('contacto.q.decision.subheader'), required: true, longAnswer: true, placeholder: t('contacto.q.decision.placeholder') },
      { id: 'pregunta_clave', type: 'openText', headline: t('contacto.q.pregunta_clave.headline'), subheader: t('contacto.q.pregunta_clave.subheader'), required: false, longAnswer: true, placeholder: t('contacto.q.pregunta_clave.placeholder') },
      { id: 'alerta_critica', type: 'openText', headline: t('contacto.q.alerta_critica.headline'), subheader: t('contacto.q.alerta_critica.subheader'), required: false, longAnswer: true, placeholder: t('contacto.q.alerta_critica.placeholder') },
      { id: 'descripcion', type: 'openText', headline: t('contacto.q.descripcion.headline'), subheader: t('contacto.q.descripcion.subheader'), required: false, longAnswer: true, placeholder: t('contacto.q.descripcion.placeholder') },
    ],
    ending: {
      headline: t('contacto.ending.headline'),
      subheader: t('contacto.ending.subheader'),
    },
  }
}

export default function Section9Contact() {
  const sectionRef = useRef<HTMLElement>(null)
  const [submitted, setSubmitted] = useState(false)
  const [contactOpen, setContactOpen] = useState(true)
  const { t } = useLanguage()
  const contactConfig = buildContactConfig(t)

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
        survey_name: t('contacto.config.name'),
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
          {t('contacto.titulo')}
        </h2>
        <p className="reveal text-center text-cream-muted text-sm max-w-md mx-auto mb-14" style={{ opacity: 0 }}>
          {t('contacto.sub')}
        </p>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Left - Contact */}
          <div className="reveal lg:col-span-2" style={{ opacity: 0 }}>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-cream-muted mb-6 block">{t('contacto.habla')}</span>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full border border-cream/20 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-gold" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-cream-muted mb-1">{t('contacto.email.label')}</p>
                  <p className="text-cream text-sm mb-1">hi@soul23.mx</p>
                  <a href="mailto:hi@soul23.mx" className="font-mono text-xs uppercase tracking-[0.14em] text-gold hover:text-gold-light transition-colors">{t('contacto.email.cta')}</a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full border border-cream/20 flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-4 h-4 text-gold" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-cream-muted mb-1">{t('contacto.whatsapp.label')}</p>
                  <p className="text-cream text-sm mb-1">+52 1 844 227 8408</p>
                  <a href="https://wa.me/528442278408?text=Hola,%20me%20gustaría%20plantear%20un%20caso" target="_blank" rel="noopener noreferrer" className="font-mono text-xs uppercase tracking-[0.14em] text-gold hover:text-gold-light transition-colors">{t('contacto.whatsapp.cta')}</a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full border border-cream/20 flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-4 h-4 text-gold" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-cream-muted mb-1">{t('contacto.talia.label')}</p>
                  <p className="text-cream text-sm mb-1">talia@soul23.mx</p>
                  <a href="mailto:talia@soul23.mx" className="font-mono text-xs uppercase tracking-[0.14em] text-gold hover:text-gold-light transition-colors">{t('contacto.talia.cta')}</a>
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
                  {t('contacto.agendar')}
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
                  {t('contacto.closed.title')}
                </h3>
                <p className="text-cream-muted text-[14px] leading-relaxed mb-8">
                  {t('contacto.closed.desc')}
                </p>
                <button
                  type="button"
                  onClick={() => setContactOpen(true)}
                  className="inline-flex items-center gap-2 py-3 px-6 bg-gold text-dark-primary font-mono text-[11px] uppercase tracking-[0.12em] hover:bg-gold-light transition-colors"
                >
                  {t('contacto.closed.btn')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
