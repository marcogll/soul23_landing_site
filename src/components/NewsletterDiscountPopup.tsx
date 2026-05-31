import { useEffect, useRef, useState } from 'react'
import { X, Send } from 'lucide-react'
import { submitToWebhook } from '@/services/webhook'
import { buildContactEmailReport } from '@/services/emailReport'

const STORAGE_KEY = 's23-newsletter-discount-dismissed-v1'

const plans = [
  { id: 'basic', label: 'Basic', price: 229 },
  { id: 'techie', label: 'Techie', price: 349 },
  { id: 'hacker', label: 'Hacker', price: 699 },
]

const terms = [
  { id: '1m', label: '1 mes', months: 1 },
  { id: '3m', label: '3 meses', months: 3 },
  { id: '6m', label: '6 meses', months: 6 },
]

export default function NewsletterDiscountPopup() {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [selectedPlan, setSelectedPlan] = useState('techie')
  const [selectedTerm, setSelectedTerm] = useState('3m')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const historyEntryArmed = useRef(false)

  const plan = plans.find((item) => item.id === selectedPlan) || plans[1]
  const term = terms.find((item) => item.id === selectedTerm) || terms[1]
  const subtotal = plan.price * term.months
  const discount = Math.round(subtotal * 0.2)
  const total = subtotal - discount

  const close = () => {
    window.localStorage.setItem(STORAGE_KEY, new Date().toISOString())
    if (historyEntryArmed.current) {
      window.history.back()
      return
    }
    setOpen(false)
  }

  useEffect(() => {
    if (window.localStorage.getItem(STORAGE_KEY)) return
    const timer = window.setTimeout(() => setOpen(true), 4200)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!open) return

    window.history.pushState(
      { ...(window.history.state || {}), s23NewsletterOpen: true },
      '',
      window.location.href
    )
    historyEntryArmed.current = true

    const handlePopState = () => {
      if (!historyEntryArmed.current) return
      historyEntryArmed.current = false
      setOpen(false)
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        close()
      }
    }

    window.addEventListener('popstate', handlePopState)
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('popstate', handlePopState)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Escribe un correo válido.')
      return
    }

    const answers = {
      nombre: name.trim() || 'Newsletter lead',
      email: email.trim(),
      negocio: 'Newsletter descuento soul:23',
      tipo_negocio: 'por_definir',
      tipo_encuesta: ['newsletter_discount'],
      canal_encuesta: ['email'],
      necesidad: ['discount_followup', 'pricing_interest'],
      urgencia: selectedTerm,
      plan_interes: plan.label,
      plazo_interes: term.label,
      precio_base_usd: plan.price,
      meses: term.months,
      descuento_porcentaje: 20,
      descuento_estimado_usd: discount,
      total_estimado_usd: total,
      descripcion: `Interés en plan ${plan.label} por ${term.label} con 20% de descuento.`,
    }

    const result = await submitToWebhook({
      type: 'contact_inquiry',
      form_type: 'newsletter_discount_popup',
      answers,
      ratings_summary: [],
      open_text_responses: [
        {
          question_id: 'newsletter_discount_interest',
          text: answers.descripcion,
          sentiment: 'positive',
          tags: ['source:newsletter_popup', `plan:${selectedPlan}`, `term:${selectedTerm}`, 'discount:20'],
        },
      ],
      email_report: buildContactEmailReport(answers),
      metadata: {
        submittedAt: new Date().toISOString(),
        userAgent: navigator.userAgent,
        source: 'newsletter_discount_popup',
        form_type: 'newsletter_discount_popup',
        survey_name: 'Newsletter descuento 20%',
        language: navigator.language,
      },
    })

    if (result.success || result.queued) {
      window.localStorage.setItem(STORAGE_KEY, new Date().toISOString())
      setSubmitted(true)
    } else {
      setError('No pude enviar el registro. Intenta otra vez.')
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[1200] flex items-end justify-center bg-dark-primary/70 px-4 pb-4 backdrop-blur-sm md:items-center md:pb-0">
      <div className="relative w-full max-w-[460px] border border-cream/15 bg-dark-secondary shadow-2xl">
        <button
          type="button"
          onClick={close}
          aria-label="Cerrar newsletter"
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center text-cream-muted hover:text-gold transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {submitted ? (
          <div className="p-7 md:p-8 text-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-gold mb-3">Descuento guardado</p>
            <h3 className="font-serif text-cream text-3xl mb-3">Revisa tu correo.</h3>
            <p className="text-sm text-cream-muted leading-relaxed mb-6">
              Talia ya recibió tu interés en {plan.label}. El flujo puede enviarte el código y seguimiento desde n8n.
            </p>
            <button type="button" onClick={close} className="pill-accent">Cerrar</button>
          </div>
        ) : (
          <form onSubmit={submit} className="p-7 md:p-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-gold mb-3">Newsletter soul:23</p>
            <h3 className="font-serif text-cream text-3xl leading-tight mb-3">
              Recibe 20% en tu plan.
            </h3>
            <p className="text-sm text-cream-muted leading-relaxed mb-6">
              Déjanos tu correo y te mandamos el descuento para contratar a 1, 3 o 6 meses.
            </p>

            <div className="grid grid-cols-3 gap-2 mb-4">
              {plans.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedPlan(item.id)}
                  className={`border px-3 py-2 text-center transition-colors ${selectedPlan === item.id ? 'border-gold bg-gold/10 text-cream' : 'border-cream/10 text-cream-muted hover:border-gold/40'}`}
                >
                  <span className="block font-mono text-[9px] uppercase tracking-[0.12em]">{item.label}</span>
                  <span className="text-xs">${item.price}/mes</span>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-2 mb-5">
              {terms.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedTerm(item.id)}
                  className={`border px-3 py-2 text-center font-mono text-[10px] uppercase tracking-[0.12em] transition-colors ${selectedTerm === item.id ? 'border-gold bg-gold/10 text-cream' : 'border-cream/10 text-cream-muted hover:border-gold/40'}`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="mb-5 border border-cream/10 bg-dark-primary/70 p-4">
              <div className="flex justify-between text-sm text-cream-muted mb-1">
                <span>Base</span>
                <span>${subtotal} USD</span>
              </div>
              <div className="flex justify-between text-sm text-gold mb-1">
                <span>20% descuento</span>
                <span>-${discount} USD</span>
              </div>
              <div className="flex justify-between border-t border-cream/10 pt-2 text-cream">
                <span>Total estimado</span>
                <span>${total} USD</span>
              </div>
            </div>

            <div className="space-y-3 mb-5">
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Tu nombre"
                className="w-full border border-cream/15 bg-dark-primary px-4 py-3 text-sm text-cream outline-none placeholder:text-cream-muted/35 focus:border-gold/60"
              />
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                type="email"
                placeholder="correo@ejemplo.com"
                className="w-full border border-cream/15 bg-dark-primary px-4 py-3 text-sm text-cream outline-none placeholder:text-cream-muted/35 focus:border-gold/60"
              />
            </div>

            {error && <p className="text-xs text-red-400 mb-4">{error}</p>}

            <button type="submit" className="w-full bg-gold px-5 py-3 text-dark-primary font-mono text-[11px] uppercase tracking-[0.14em] hover:bg-gold-light transition-colors inline-flex items-center justify-center gap-2">
              Recibir descuento <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
