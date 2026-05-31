import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Bot, User, Sparkles } from 'lucide-react'
import gsap from 'gsap'
import { submitToWebhook } from '@/services/webhook'
import { buildContactEmailReport } from '@/services/emailReport'

interface Message {
  id: number
  from: 'talia' | 'user'
  text: string
  options?: string[]
  delay?: number
}

interface LeadData {
  nombre?: string
  tipo_negocio?: string
  necesidad?: string
  email?: string
  telefono?: string
}

type LeadField = 'email' | 'phone' | null

const taliaFlows: Record<string, Message[]> = {
  welcome: [
    { id: 1, from: 'talia', text: '¡Hola! Soy Talia, asistente de soul:23.' },
    { id: 2, from: 'talia', text: 'Estoy aquí para ayudarte a descubrir qué sistema, automatización o encuesta puede hacer más eficiente tu negocio.', options: ['Quiero cotizar un proyecto', 'Empezar diagnóstico', 'Solo estoy viendo'] },
  ],
  name: [
    { id: 3, from: 'talia', text: '¿Cómo te llamas?' },
  ],
  businessType: [
    { id: 4, from: 'talia', text: '¿Qué tipo de negocio tienes?', options: ['Consultorio médico / Clínica', 'Salón de belleza / Spa', 'Restaurante / Bar', 'Tienda física / Online', 'Escuela / Academia', 'Otro'] },
  ],
  painPoints: [
    { id: 5, from: 'talia', text: 'Cuéntame, ¿cuál de estas situaciones te suena más familiar? 👇', options: ['Mensajes constantes para agendar', 'Ventas registradas manualmente', 'No sé qué pasa si no estoy', 'Control de personal difícil', 'Datos dispersos', 'Cancelaciones sin control'] },
  ],
  solution_agenda: [
    { id: 6, from: 'talia', text: 'Eso es super común. Muchos negocios pierden horas al día respondiendo mensajes para agendar o confirmar citas.', delay: 800 },
    { id: 7, from: 'talia', text: 'Con nuestro sistema de agenda, tus clientes agendan solos, se envían confirmaciones automáticas por WhatsApp, y tú solo ves el calendario actualizado.', options: ['Dejar mis datos', '¿Y las cancelaciones?', 'Ver más capacidades'], delay: 1200 },
  ],
  solution_sales: [
    { id: 8, from: 'talia', text: 'Registrar ventas a mano es una de las mayores fuentes de errores y pérdida de tiempo.', delay: 800 },
    { id: 9, from: 'talia', text: 'Nuestro sistema registra cada venta automáticamente, calcula comisiones, genera reportes diarios y alerta si algo no cuadra. Todo sin tocar una calculadora.', options: ['Dejar mis datos', '¿Integra con mi sistema?', 'Ver más capacidades'], delay: 1200 },
  ],
  solution_control: [
    { id: 10, from: 'talia', text: 'Ese es el problema #1 que resolvemos. Muchos dueños sienten que el negocio depende 100% de su presencia.', delay: 800 },
    { id: 11, from: 'talia', text: 'Con nuestros dashboards en tiempo real puedes ver ventas, asistencia, citas y alertas desde tu celular. Tu negocio te habla, incluso cuando no estás.', options: ['Dejar mis datos', '¿Cómo funcionan las alertas?', 'Ver más capacidades'], delay: 1200 },
  ],
  solution_staff: [
    { id: 12, from: 'talia', text: 'Controlar personal sin un sistema claro es agotador. Cuadernos, Excel, mensajes... nada conecta.', delay: 800 },
    { id: 13, from: 'talia', text: 'Registramos asistencia, calculamos nómina, medimos tiempos muertos y generamos reportes automáticos. Todo en un solo lugar.', options: ['Dejar mis datos', '¿Y si tengo varias sucursales?', 'Ver más capacidades'], delay: 1200 },
  ],
  solution_data: [
    { id: 14, from: 'talia', text: 'Datos dispersos = decisiones a ciegas. Si no tienes números claros, no puedes mejorar.', delay: 800 },
    { id: 15, from: 'talia', text: 'Centralizamos toda la información de tu operación en dashboards visuales. Ventas, citas, personal, feedback — todo conectado y visible.', options: ['Dejar mis datos', '¿Qué tipo de reportes?', 'Ver más capacidades'], delay: 1200 },
  ],
  solution_cancellations: [
    { id: 16, from: 'talia', text: 'Las cancelaciones son frustrantes, pero peor aún es no tener un sistema para manejarlas.', delay: 800 },
    { id: 17, from: 'talia', text: 'Nuestro sistema envía recordatorios automáticos, permite reagendar fácilmente, y con IA detecta patrones de cancelación para prevenirlas.', options: ['Dejar mis datos', '¿Cómo funciona la IA?', 'Ver más capacidades'], delay: 1200 },
  ],
  showcase: [
    { id: 18, from: 'talia', text: 'Esto es lo que puedo hacer por tu negocio:', delay: 600 },
    { id: 19, from: 'talia', text: '📅 **Agenda automática** — Tus clientes agendan, confirman y reagendan solos por WhatsApp. Tú solo ves el calendario.', options: ['💰 Ventas automáticas', '📊 Dashboards en vivo', '🤖 Chatbots WhatsApp', '📋 Control de personal', 'Agendar una cita'], delay: 1000 },
  ],
  showcase_sales: [
    { id: 20, from: 'talia', text: '💰 **Venta y registro automático** — Cada cobro, pedido y movimiento se registra solo. Reportes diarios automáticos. Sin calculadoras, sin Excel.', options: ['📊 Dashboards en vivo', '🤖 Chatbots WhatsApp', '📋 Control de personal', '📅 Agenda automática', 'Agendar una cita'], delay: 800 },
  ],
  showcase_dashboard: [
    { id: 21, from: 'talia', text: '📊 **Dashboards en tiempo real** — Ve todo desde tu celular: ventas del día, citas pendientes, alertas de stock, asistencia del personal. Tu negocio te habla.', options: ['💰 Ventas automáticas', '🤖 Chatbots WhatsApp', '📋 Control de personal', '📅 Agenda automática', 'Agendar una cita'], delay: 800 },
  ],
  showcase_bots: [
    { id: 22, from: 'talia', text: '🤖 **Bots de WhatsApp con IA** — ¡Como yo! Respondo a tus clientes 24/7, agendo citas, tomo pedidos y escalo a humanos cuando es necesario.', options: ['💰 Ventas automáticas', '📊 Dashboards en vivo', '📋 Control de personal', '📅 Agenda automática', 'Agendar una cita'], delay: 800 },
  ],
  showcase_staff: [
    { id: 23, from: 'talia', text: '📋 **Control de personal** — Asistencia, tiempos muertos, nómina automática y reportes por empleado. Multi-sucursal incluido.', options: ['💰 Ventas automáticas', '📊 Dashboards en vivo', '🤖 Chatbots WhatsApp', '📅 Agenda automática', 'Agendar una cita'], delay: 800 },
  ],
  closing: [
    { id: 24, from: 'talia', text: 'Creo que ya tengo una buena idea de lo que necesitas. 🎯', delay: 600 },
    { id: 25, from: 'talia', text: 'Puedo dejar tus datos listos para el equipo y mandar un resumen al webhook, o puedes agendar directo.', options: ['Dejar mis datos', 'Agendar llamada', 'Contactar por WhatsApp'], delay: 1200 },
  ],
  just_looking: [
    { id: 26, from: 'talia', text: '¡Perfecto! Puedes explorar el sitio. Si tienes alguna pregunta, aquí estaré. También puedes probar las demos de dashboard y bots más abajo. 👇', options: ['Ver demo dashboard', 'Ver demo bots', 'Gracias'], delay: 600 },
  ],
}

export default function TaliaChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [currentFlow, setCurrentFlow] = useState<string>('welcome')
  const [userName, setUserName] = useState('')
  const [leadData, setLeadData] = useState<LeadData>({})
  const [leadField, setLeadField] = useState<LeadField>(null)
  const [leadInput, setLeadInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [hasGreeted] = useState(false)
  const [isBotSectionActive, setIsBotSectionActive] = useState(false)
  const [buttonReady, setButtonReady] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const widgetRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // No auto-open — button pulses subtly instead

  // Play flow messages
  useEffect(() => {
    const flow = taliaFlows[currentFlow]
    if (!flow) return

    let cancelled = false
    const playMessages = async () => {
      setIsTyping(true)
      for (const msg of flow) {
        if (cancelled) break
        await new Promise(r => setTimeout(r, msg.delay || 600))
        if (cancelled) break
        setMessages(prev => [...prev, msg])
        setIsTyping(false)
        if (flow.indexOf(msg) < flow.length - 1) {
          setIsTyping(true)
        }
      }
      setIsTyping(false)
    }

    // Only auto-play talia messages (not user-input flows)
    if (currentFlow !== 'name') {
      playMessages()
    } else {
      setMessages(prev => [...prev, flow[0]])
    }

    return () => { cancelled = true }
  }, [currentFlow])

  // Scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  // Entrance animation
  useEffect(() => {
    if (buttonRef.current) {
      gsap.fromTo(buttonRef.current, { scale: 0, opacity: 0 }, {
        scale: 1,
        opacity: 1,
        duration: 0.4,
        delay: 1.5,
        ease: 'back.out(1.7)',
        onComplete: () => setButtonReady(true),
      })
    }
  }, [])

  useEffect(() => {
    const section = document.getElementById('demo-bots')
    if (!section) return

    const observer = new IntersectionObserver(
      ([entry]) => setIsBotSectionActive(entry.isIntersecting),
      { threshold: 0.35 }
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  const handleOption = (option: string) => {
    // Add user message
    const userMsg: Message = { id: Date.now(), from: 'user', text: option }
    setMessages(prev => [...prev, userMsg])

    // Route to next flow
    setTimeout(() => {
      switch (option) {
        case 'Quiero cotizar un proyecto':
        case 'Empezar':
        case 'Empezar diagnóstico':
          setCurrentFlow('name')
          break
        case 'Solo estoy viendo':
          setCurrentFlow('just_looking')
          break
        case 'Consultorio médico / Clínica':
        case 'Salón de belleza / Spa':
        case 'Restaurante / Bar':
        case 'Tienda física / Online':
        case 'Escuela / Academia':
        case 'Otro':
          setLeadData(prev => ({ ...prev, tipo_negocio: option }))
          setCurrentFlow('painPoints')
          break
        case 'Gracias':
          setMessages(prev => [...prev, { id: Date.now(), from: 'talia', text: '¡Con gusto! Estoy aquí cuando me necesites. 💬' }])
          break
        case 'Ver demo dashboard':
          setIsOpen(false)
          document.getElementById('demo-dashboard')?.scrollIntoView({ behavior: 'smooth' })
          break
        case 'Ver demo bots':
          setIsOpen(false)
          document.getElementById('demo-bots')?.scrollIntoView({ behavior: 'smooth' })
          break
        case 'Mensajes constantes para agendar':
          setLeadData(prev => ({ ...prev, necesidad: option }))
          setCurrentFlow('solution_agenda')
          break
        case 'Ventas registradas manualmente':
          setLeadData(prev => ({ ...prev, necesidad: option }))
          setCurrentFlow('solution_sales')
          break
        case 'No sé qué pasa si no estoy':
          setLeadData(prev => ({ ...prev, necesidad: option }))
          setCurrentFlow('solution_control')
          break
        case 'Control de personal difícil':
          setLeadData(prev => ({ ...prev, necesidad: option }))
          setCurrentFlow('solution_staff')
          break
        case 'Datos dispersos':
          setLeadData(prev => ({ ...prev, necesidad: option }))
          setCurrentFlow('solution_data')
          break
        case 'Cancelaciones sin control':
          setLeadData(prev => ({ ...prev, necesidad: option }))
          setCurrentFlow('solution_cancellations')
          break
        case '¿Y las cancelaciones?':
          setMessages(prev => [...prev, { id: Date.now(), from: 'talia', text: 'El sistema detecta cancelaciones, envía reagendamiento automático y con IA aprende patrones para prevenirlas. 🧠', options: ['Dejar mis datos', 'Ver más capacidades'] }])
          break
        case '¿Integra con mi sistema?':
          setMessages(prev => [...prev, { id: Date.now(), from: 'talia', text: 'Sí. Integramos con CRMs, ERPs, plataformas de pago y cualquier sistema que ya uses. APIs y webhooks disponibles. 🔌', options: ['Dejar mis datos', 'Ver más capacidades'] }])
          break
        case '¿Cómo funcionan las alertas?':
          setMessages(prev => [...prev, { id: Date.now(), from: 'talia', text: 'Alertas por WhatsApp, email o dashboard: stock bajo, venta anómala, empleado sin registrar, cita cancelada. Configuras lo que quieres vigilar. 🔔', options: ['Dejar mis datos', 'Ver más capacidades'] }])
          break
        case '¿Y si tengo varias sucursales?':
          setMessages(prev => [...prev, { id: Date.now(), from: 'talia', text: 'Multi-sucursal incluido. Dashboard central con vista por location. Reportes comparativos y alertas por sucursal. 🏢', options: ['Dejar mis datos', 'Ver más capacidades'] }])
          break
        case '¿Qué tipo de reportes?':
          setMessages(prev => [...prev, { id: Date.now(), from: 'talia', text: 'Ventas diarias/semanales/mensuales, análisis de tendencias, KPIs de personal, satisfacción de clientes, predicciones con IA. Todo exportable. 📈', options: ['Dejar mis datos', 'Ver más capacidades'] }])
          break
        case '¿Cómo funciona la IA?':
          setMessages(prev => [...prev, { id: Date.now(), from: 'talia', text: 'La IA analiza patrones históricos: predice cancelaciones, detecta anomalías en ventas, clasifica feedback automáticamente y mejora con el tiempo. 🤖', options: ['Dejar mis datos', 'Ver más capacidades'] }])
          break
        case 'Ver más capacidades':
          setCurrentFlow('showcase')
          break
        case 'Dejar mis datos':
          setLeadField('email')
          setLeadInput('')
          setMessages(prev => [...prev, { id: Date.now() + 1, from: 'talia', text: 'Perfecto. ¿A qué correo te mando el resumen de tu proyecto?' }])
          break
        case '💰 Ventas automáticas':
          setCurrentFlow('showcase_sales')
          break
        case '📊 Dashboards en vivo':
          setCurrentFlow('showcase_dashboard')
          break
        case '🤖 Chatbots WhatsApp':
          setCurrentFlow('showcase_bots')
          break
        case '📋 Control de personal':
          setCurrentFlow('showcase_staff')
          break
        case '📅 Agenda automática':
          setCurrentFlow('showcase')
          break
        case 'Agendar una cita':
        case 'Agendar llamada':
          setIsOpen(false)
          window.open('https://calendly.com/alma_dev/30min', '_blank')
          break
        case 'Contactar por WhatsApp':
          setIsOpen(false)
          window.open('https://wa.me/528442278408?text=Hola,%20hablé%20con%20Talia%20y%20quiero%20agendar%20una%20llamada', '_blank')
          break
        case 'Ver más info':
          setIsOpen(false)
          document.getElementById('servicios')?.scrollIntoView({ behavior: 'smooth' })
          break
        default:
          break
      }
    }, 400)
  }

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!userName.trim()) return
    setLeadData(prev => ({ ...prev, nombre: userName.trim() }))
    setMessages(prev => [...prev, { id: Date.now(), from: 'user', text: userName }])
    setTimeout(() => {
      setMessages(prev => [...prev, { id: Date.now() + 1, from: 'talia', text: `¡Mucho gusto, ${userName}! 👋` }])
      setTimeout(() => setCurrentFlow('businessType'), 600)
    }, 400)
  }

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (leadField) {
      void handleLeadSubmit()
      return
    }
    if (!userName.trim()) return
    handleNameSubmit(e)
  }

  const submitLead = async (data: LeadData) => {
    const answers = {
      nombre: data.nombre || userName || 'Lead desde Talia',
      negocio: `Proyecto desde chatbot - ${data.tipo_negocio || 'giro por definir'}`,
      email: data.email || '',
      telefono: data.telefono || '',
      tipo_negocio: data.tipo_negocio || 'por definir',
      tipo_encuesta: ['chatbot_funnel', 'diagnostico_proyecto'],
      canal_encuesta: ['web', 'whatsapp'],
      necesidad: data.necesidad ? [data.necesidad] : ['diagnostico_inicial'],
      urgencia: 'por_definir',
      descripcion: `Lead capturado por Talia. Giro: ${data.tipo_negocio || 'por definir'}. Necesidad: ${data.necesidad || 'por definir'}.`,
    }

    return submitToWebhook({
      type: 'contact_inquiry',
      form_type: 'talia_chatbot_funnel',
      answers,
      ratings_summary: [],
      open_text_responses: [
        {
          question_id: 'chatbot_summary',
          text: answers.descripcion,
          sentiment: 'neutral',
          tags: ['source:talia_chatbot', `sector:${answers.tipo_negocio}`, ...(data.necesidad ? [`need:${data.necesidad}`] : [])],
        },
      ],
      email_report: buildContactEmailReport(answers),
      metadata: {
        submittedAt: new Date().toISOString(),
        userAgent: navigator.userAgent,
        source: 'talia_chatbot_funnel',
        form_type: 'talia_chatbot_funnel',
        survey_name: 'Talia Chatbot Funnel',
        language: navigator.language,
        phoneNumber: data.telefono || undefined,
      },
    })
  }

  const handleLeadSubmit = async () => {
    const value = leadInput.trim()
    if (!value) return

    if (leadField === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setMessages(prev => [...prev, { id: Date.now(), from: 'talia', text: 'Ese correo no se ve válido. ¿Me lo compartes otra vez?' }])
      return
    }

    if (leadField === 'phone') {
      const phone = value.replace(/\D/g, '').slice(0, 13)
      if (phone.length < 10) {
        setMessages(prev => [...prev, { id: Date.now(), from: 'talia', text: 'Necesito al menos 10 dígitos para WhatsApp. ¿Me lo compartes otra vez?' }])
        return
      }
      const nextData = { ...leadData, telefono: phone }
      setLeadData(nextData)
      setMessages(prev => [...prev, { id: Date.now(), from: 'user', text: phone }])
      setLeadField(null)
      setLeadInput('')
      const result = await submitLead(nextData)
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          from: 'talia',
          text: result.success || result.queued
            ? 'Listo. Ya envié tu información al equipo de soul:23 con el contexto del proyecto. Puedes agendar llamada o escribir por WhatsApp.'
            : 'Guardé el contexto, pero no pude enviar al webhook en este momento. Puedes escribirnos por WhatsApp para no perder el seguimiento.',
          options: ['Agendar llamada', 'Contactar por WhatsApp'],
        },
      ])
      return
    }

    const nextData = { ...leadData, email: value }
    setLeadData(nextData)
    setMessages(prev => [...prev, { id: Date.now(), from: 'user', text: value }])
    setLeadField('phone')
    setLeadInput('')
    setMessages(prev => [...prev, { id: Date.now() + 1, from: 'talia', text: 'Gracias. ¿Cuál es tu WhatsApp para que podamos dar seguimiento?' }])
  }

  const renderText = (text: string) => {
    // Simple markdown-like bold
    const parts = text.split(/(\*\*.*?\*\*)/g)
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="text-cream font-semibold">{part.slice(2, -2)}</strong>
      }
      return <span key={i}>{part}</span>
    })
  }

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div
          ref={widgetRef}
          className="fixed bottom-20 right-4 lg:right-8 z-[1000] w-[calc(100vw-2rem)] max-w-[380px] bg-dark-secondary border border-cream/15 shadow-2xl flex flex-col"
          style={{ height: 'min(520px, calc(100vh - 7rem))' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-cream/10 bg-dark-primary/80 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gold/20 flex items-center justify-center relative">
                <Bot className="w-4.5 h-4.5 text-gold" strokeWidth={1.5} />
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-dark-secondary" />
              </div>
              <div>
                <p className="text-sm text-cream font-medium flex items-center gap-1.5">
                  Talia
                  <Sparkles className="w-3 h-3 text-gold" />
                </p>
                <p className="font-mono text-[9px] text-green-400 uppercase tracking-wider">En línea · IA</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 flex items-center justify-center text-cream-muted hover:text-cream transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-2 max-w-[85%] ${msg.from === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${
                    msg.from === 'talia' ? 'bg-gold/20' : 'bg-cream/10'
                  }`}>
                    {msg.from === 'talia' ? (
                      <Bot className="w-3 h-3 text-gold" strokeWidth={1.5} />
                    ) : (
                      <User className="w-3 h-3 text-cream-muted" strokeWidth={1.5} />
                    )}
                  </div>
                  <div>
                    <div className={`px-3 py-2 text-xs leading-relaxed ${
                      msg.from === 'user'
                        ? 'bg-gold/20 text-cream rounded-l-lg rounded-tr-lg'
                        : 'bg-dark-primary text-cream-muted rounded-r-lg rounded-tl-lg border border-cream/10'
                    }`}>
                      {renderText(msg.text)}
                    </div>
                    {/* Options */}
                    {msg.options && msg.from === 'talia' && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {msg.options.map((opt, j) => (
                          <button
                            key={j}
                            onClick={() => handleOption(opt)}
                            className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider border border-cream/20 text-cream-muted hover:border-gold/50 hover:text-gold transition-colors rounded-full"
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex gap-2 max-w-[85%]">
                  <div className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-3 h-3 text-gold" strokeWidth={1.5} />
                  </div>
                  <div className="bg-dark-primary border border-cream/10 rounded-r-lg rounded-tl-lg px-3 py-2">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-cream-muted/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-1.5 h-1.5 rounded-full bg-cream-muted/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-1.5 h-1.5 rounded-full bg-cream-muted/40 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Funnel text input form */}
            {((currentFlow === 'name' && messages.length > 0 && messages[messages.length - 1].from === 'talia') || leadField) && !isTyping && (
              <form onSubmit={handleTextSubmit} className="flex gap-2 mt-2">
                <input
                  type={leadField === 'email' ? 'email' : leadField === 'phone' ? 'tel' : 'text'}
                  inputMode={leadField === 'phone' ? 'numeric' : leadField === 'email' ? 'email' : 'text'}
                  value={leadField ? leadInput : userName}
                  onChange={(e) => {
                    const value = leadField === 'phone' ? e.target.value.replace(/\D/g, '').slice(0, 13) : e.target.value
                    leadField ? setLeadInput(value) : setUserName(value)
                  }}
                  placeholder={leadField === 'email' ? 'correo@ejemplo.com' : leadField === 'phone' ? '8441234567' : 'Tu nombre...'}
                  autoFocus
                  className="flex-1 text-xs bg-dark-primary border border-cream/15 px-3 py-2 text-cream placeholder:text-cream-muted/30 outline-none focus:border-gold/50"
                />
                <button
                  type="submit"
                  className="w-8 h-8 bg-gold/20 flex items-center justify-center hover:bg-gold/30 transition-colors"
                >
                  <Send className="w-3.5 h-3.5 text-gold" />
                </button>
              </form>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Footer */}
          <div className="px-4 py-2 border-t border-cream/10 text-center">
            <p className="font-mono text-[8px] uppercase tracking-[0.12em] text-cream-muted/30">
              talia@soul23.mx · asistente de citas
            </p>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      {!isOpen && (
        <style>{`
          @keyframes chatbot-pulse {
            0%, 100% { box-shadow: 0 0 0 0 rgba(200,178,107,0.4); }
            50% { box-shadow: 0 0 0 8px rgba(200,178,107,0); }
          }
          @keyframes chatbot-pulse-strong {
            0%, 100% { box-shadow: 0 0 0 0 rgba(200,178,107,0.58), 0 0 24px rgba(200,178,107,0.28); }
            50% { box-shadow: 0 0 0 14px rgba(200,178,107,0), 0 0 34px rgba(200,178,107,0.45); }
          }
          @keyframes chatbot-vibrate {
            0%, 100% { transform: translate3d(0,0,0) rotate(0deg) scale(1); }
            10% { transform: translate3d(-2px,1px,0) rotate(-5deg) scale(1.04); }
            20% { transform: translate3d(2px,-1px,0) rotate(5deg) scale(1.04); }
            30% { transform: translate3d(-3px,0,0) rotate(-6deg) scale(1.06); }
            40% { transform: translate3d(3px,1px,0) rotate(6deg) scale(1.06); }
            50% { transform: translate3d(-2px,-1px,0) rotate(-4deg) scale(1.04); }
            60% { transform: translate3d(2px,0,0) rotate(4deg) scale(1.04); }
            70% { transform: translate3d(-1px,1px,0) rotate(-3deg) scale(1.02); }
            80% { transform: translate3d(1px,-1px,0) rotate(3deg) scale(1.02); }
            90% { transform: translate3d(0,1px,0) rotate(0deg) scale(1.01); }
          }
        `}</style>
      )}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-4 right-4 lg:right-8 z-[1001] w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${
          isOpen ? 'bg-cream/10 border border-cream/20' : 'bg-gold/90 hover:bg-gold border border-gold/40'
        }`}
        style={{
          opacity: buttonReady ? 1 : 0,
          animation: !isOpen
            ? isBotSectionActive
              ? 'chatbot-vibrate 0.55s linear infinite, chatbot-pulse-strong 1.15s ease-in-out infinite'
              : 'chatbot-pulse 2.5s ease-in-out infinite'
            : 'none',
        }}
      >
        {isOpen ? (
          <X className="w-5 h-5 text-cream" />
        ) : (
          <div className="relative">
            <MessageCircle className="w-5 h-5 text-dark-primary" strokeWidth={2} />
            {!hasGreeted && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-400 rounded-full animate-pulse" />
            )}
          </div>
        )}
      </button>
    </>
  )
}
