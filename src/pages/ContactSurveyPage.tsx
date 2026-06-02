import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Check } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import SurveyEngine from '@/components/SurveyEngine';
import type { SurveyConfig } from '@/components/SurveyEngine';
import { submitToWebhook } from '@/services/webhook';
import { buildContactEmailReport } from '@/services/emailReport';
import {
  CONTACT_AUTOMATION_CHOICES,
  CONTACT_AUDIENCE_CHOICES,
  CONTACT_BUDGET_CHOICES,
  CONTACT_CHANNEL_CHOICES,
  CONTACT_MOMENT_CHOICES,
  CONTACT_SECTOR_CHOICES,
  CONTACT_SURVEY_TYPE_CHOICES,
  enrichContactAnswers,
  getContactTags,
} from '@/services/contactSurveyPayload';

const contactConfig: SurveyConfig = {
  id: 's23_contact_inquiry',
  name: 'Formulario de Contacto',
  welcomeCard: {
    headline: 'Diseñemos tu encuesta',
    subheader: 'Te preguntaremos giro, tipo de encuesta y canal para enviarte un primer reporte por correo.',
    buttonLabel: 'Empezar',
  },
  showProgress: true,
  questions: [
    {
      id: 'tipo_negocio',
      type: 'multipleChoiceSingle',
      headline: '¿En qué sector está tu negocio?',
      subheader: 'Talia adapta la encuesta, el reporte y las alertas según el giro.',
      required: true,
      choices: CONTACT_SECTOR_CHOICES,
    },
    {
      id: 'tipo_encuesta',
      type: 'multipleChoiceMulti',
      headline: 'Elige el tipo de encuesta que quieres levantar',
      subheader: 'Puedes elegir varias. Esta selección viaja completa al webhook para construir el email del cliente y el reporte interno.',
      required: true,
      choices: CONTACT_SURVEY_TYPE_CHOICES,
    },
    {
      id: 'nombre',
      type: 'openText',
      headline: '¿Cómo te llamas?',
      required: true,
      placeholder: 'Tu nombre',
    },
    {
      id: 'negocio',
      type: 'openText',
      headline: '¿Cómo se llama tu negocio?',
      required: true,
      placeholder: 'Nombre del negocio',
    },
    {
      id: 'email',
      type: 'openText',
      inputType: 'email',
      headline: '¿Cuál es tu correo electrónico?',
      required: true,
      placeholder: 'correo@ejemplo.com',
      validation: { pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$', message: 'Correo electrónico inválido.' },
    },
    {
      id: 'telefono',
      type: 'openText',
      inputType: 'phone',
      headline: '¿Tu número de teléfono?',
      required: true,
      placeholder: '8441234567',
      validation: { pattern: '^\\d{10}$', message: 'Debe tener 10 dígitos.' },
    },
    {
      id: 'canal_encuesta',
      type: 'multipleChoiceMulti',
      headline: '¿Dónde quieres aplicar esas encuestas?',
      required: true,
      choices: CONTACT_CHANNEL_CHOICES,
    },
    {
      id: 'audiencia_encuesta',
      type: 'multipleChoiceMulti',
      headline: '¿Quién responderá la encuesta?',
      subheader: 'Mientras más claro sea esto, más personalizado puede ser el email y el reporte.',
      required: true,
      choices: CONTACT_AUDIENCE_CHOICES,
    },
    {
      id: 'momento_encuesta',
      type: 'multipleChoiceMulti',
      headline: '¿En qué momento quieres pedir la respuesta?',
      subheader: 'Esto define si conviene QR, WhatsApp, email, alerta automática o dashboard.',
      required: true,
      choices: CONTACT_MOMENT_CHOICES,
    },
    {
      id: 'necesidad',
      type: 'multipleChoiceMulti',
      headline: 'Además de encuestas, ¿qué te gustaría automatizar?',
      subheader: 'Marca todas las que apliquen.',
      required: true,
      choices: CONTACT_AUTOMATION_CHOICES.filter((choice) => ['agenda', 'ventas', 'dashboard', 'bots', 'personal', 'alertas', 'reportes_encuestas', 'todo'].includes(choice.id)),
    },
    {
      id: 'presupuesto',
      type: 'multipleChoiceSingle',
      headline: '¿Tienes un presupuesto en mente?',
      subheader: 'Nos ayuda a dimensionar la solución.',
      required: false,
      choices: CONTACT_BUDGET_CHOICES,
    },
    {
      id: 'decision_principal',
      type: 'openText',
      headline: '¿Qué decisión quieres tomar con esas respuestas?',
      subheader: 'Ejemplo: mejorar atención, reducir cancelaciones, saber qué curso vender, detectar empleados saturados.',
      required: true,
      longAnswer: true,
      placeholder: 'Quiero decidir...',
    },
    {
      id: 'pregunta_clave',
      type: 'openText',
      headline: '¿Cuál sería la pregunta más importante para tu negocio?',
      subheader: 'No tiene que estar perfecta; Talia la convierte en una estructura de encuesta.',
      required: false,
      longAnswer: true,
      placeholder: 'Necesito saber si...',
    },
    {
      id: 'alerta_critica',
      type: 'openText',
      headline: '¿Qué respuesta debería activar una alerta interna?',
      subheader: 'Esto ayuda a n8n a decidir cuándo mandar aviso urgente y no solo guardar datos.',
      required: false,
      longAnswer: true,
      placeholder: 'Alertar si...',
    },
    {
      id: 'seguimiento_cliente',
      type: 'openText',
      headline: '¿Qué debería recibir la persona después de contestar?',
      subheader: 'Ejemplo: agradecimiento, cupón, instrucciones, llamada, reporte, confirmación de cita.',
      required: false,
      longAnswer: true,
      placeholder: 'Después de responder debería recibir...',
    },
    {
      id: 'descripcion',
      type: 'openText',
      headline: 'Cuéntanos más contexto para personalizar el reporte',
      subheader: 'Cómo lo miden hoy, volumen aproximado, sucursales, sistema actual o problema principal.',
      required: false,
      longAnswer: true,
      placeholder: 'Hoy medimos esto así...',
    },
  ],
  ending: {
    headline: '¡Gracias por escribirnos!',
    subheader: 'Te contactamos pronto para platicar de tu caso. Mientras tanto, puedes escribirnos a hi@soul23.mx',
  },
};

const sentimentWords = {
  positive: ['bueno', 'bien', 'excelente', 'perfecto', 'ideal', 'me interesa', 'urgente', 'necesito'],
  negative: ['problema', 'difícil', 'complicado', 'lento', 'caro', 'frustrante', 'confuso'],
};

function analyzeAnswers(answers: Record<string, unknown>) {
  const openTextResponses = [
    { id: 'descripcion', text: (answers.descripcion as string) || '' },
  ]
    .filter((t) => t.text.length > 0)
    .map((t) => ({
      question_id: t.id,
      text: t.text,
      sentiment: classifySentiment(t.text, sentimentWords),
      tags: [...getContactTags(answers), ...extractTags(t.text)],
    }));

  return { ratingsSummary: [], openTextResponses };
}

function classifySentiment(text: string, words: { positive: string[]; negative: string[] }): 'positive' | 'neutral' | 'negative' {
  const lower = text.toLowerCase();
  const posCount = words.positive.filter((w) => lower.includes(w)).length;
  const negCount = words.negative.filter((w) => lower.includes(w)).length;
  if (posCount > negCount) return 'positive';
  if (negCount > posCount) return 'negative';
  return 'neutral';
}

function extractTags(text: string): string[] {
  const keywords: Record<string, string[]> = {
    'automatización': ['automatizar', 'automático', 'automatización', 'proceso'],
    'ventas': ['ventas', 'vender', 'pago', 'cobrar', 'factura'],
    'agendas': ['agenda', 'cita', 'citas', 'reservar', 'reserva'],
    'encuestas': ['encuesta', 'encuestas', 'feedback', 'opinión', 'opinion', 'respuestas'],
    'satisfacción': ['satisfacción', 'satisfaccion', 'nps', 'recomendación', 'recomendacion'],
    'calidad': ['calidad', 'servicio', 'producto', 'falla', 'queja'],
    'empleados': ['empleado', 'empleados', 'staff', 'equipo', 'clima'],
    'personal': ['personal', 'empleado', 'equipo', 'staff', 'nómina'],
    'whatsapp': ['whatsapp', 'bot', 'chatbot', 'mensaje'],
    'dashboard': ['dashboard', 'reporte', 'datos', 'analytics', 'métricas'],
    'inventario': ['inventario', 'stock', 'producto', 'productos'],
    'clientes': ['clientes', 'clienta', 'cliente', 'lead', 'leads'],
    'costo': ['costo', 'precio', 'caro', 'económico', 'inversión'],
  };
  const lower = text.toLowerCase();
  return Object.entries(keywords)
    .filter(([, words]) => words.some((w) => lower.includes(w)))
    .map(([tag]) => tag);
}

export default function ContactSurveyPage() {
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();
  const closeSurvey = useCallback(() => navigate('/', { replace: true }), [navigate]);

  const handleSubmit = useCallback(
    async (answers: Record<string, unknown>, metadata: Record<string, unknown>) => {
      const { ratingsSummary, openTextResponses } = analyzeAnswers(answers);
      const enrichedAnswers = enrichContactAnswers(answers);
      await submitToWebhook({
        type: 'contact_inquiry',
        form_type: 'contact_survey_full',
        answers: enrichedAnswers,
        ratings_summary: ratingsSummary,
        open_text_responses: openTextResponses,
        email_report: buildContactEmailReport(enrichedAnswers),
        metadata: {
          ...metadata,
          submittedAt: new Date().toISOString(),
          userAgent: navigator.userAgent,
          source: 'contact_survey',
          form_type: 'contact_survey_full',
          survey_name: 'Formulario de Contacto',
          language: navigator.language,
          phoneNumber: (answers.telefono as string) || undefined,
        },
      });
      setSubmitted(true);
    },
    []
  );

  return (
    <div className="min-h-screen bg-dark-primary">
      <div className="border-b border-cream/10">
        <div className="max-w-[720px] mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-cream-muted text-[13px] font-mono uppercase tracking-wide hover:text-gold transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Volver</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 border border-gold/40 flex items-center justify-center">
              <span className="font-serif text-gold text-[11px]">s:23</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[600px] mx-auto px-6 py-10 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {submitted ? (
            <div className="bg-dark-primary border border-cream/10 p-8 md:p-10 shadow-2xl text-center">
              <div className="w-14 h-14 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-5">
                <Check size={28} className="text-gold" />
              </div>
              <h2 className="font-serif font-semibold text-cream text-2xl mb-3">
                {contactConfig.ending?.headline}
              </h2>
              <p className="text-cream-muted text-[14px] leading-relaxed mb-8">
                {contactConfig.ending?.subheader}
              </p>
              <Link
                to="/"
                className="inline-flex items-center gap-2 py-3 px-6 bg-gold text-dark-primary font-mono text-[11px] uppercase tracking-[0.12em] hover:bg-gold-light transition-colors"
              >
                Volver al inicio
              </Link>
            </div>
          ) : (
            <SurveyEngine
              config={contactConfig}
              onSubmit={handleSubmit}
              onClose={closeSurvey}
              i18nPrefix="survey.contact"
            />
          )}
        </motion.div>
      </div>
    </div>
  );
}
