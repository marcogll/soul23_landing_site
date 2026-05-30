import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import SurveyEngine from '@/components/SurveyEngine';
import type { SurveyConfig } from '@/components/SurveyEngine';
import { submitToWebhook } from '@/services/webhook';
import { buildContactEmailReport } from '@/services/emailReport';

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
      id: 'tipo_negocio',
      type: 'multipleChoiceSingle',
      headline: '¿En qué sector está tu negocio?',
      required: true,
      choices: [
        { id: 'belleza', label: 'Salón de belleza / Spa' },
        { id: 'restaurante', label: 'Restaurante / Bar / Cafetería' },
        { id: 'salud', label: 'Consultorio médico / Clínica' },
        { id: 'tienda', label: 'Tienda en línea / Física' },
        { id: 'escuela', label: 'Escuela / Academia' },
        { id: 'industrial', label: 'Industria / Manufactura' },
        { id: 'inmobiliaria', label: 'Inmobiliaria / Construcción' },
        { id: 'servicios', label: 'Servicios profesionales' },
        { id: 'otro', label: 'Otro' },
      ],
    },
    {
      id: 'tipo_encuesta',
      type: 'multipleChoiceMulti',
      headline: '¿Qué tipo de encuestas quieres hacer?',
      subheader: 'Así podemos adaptar preguntas, dashboard y alertas a tu operación.',
      required: true,
      choices: [
        { id: 'satisfaccion_cliente', label: 'Satisfacción de clientes' },
        { id: 'post_servicio', label: 'Post-servicio / post-compra' },
        { id: 'nps', label: 'NPS / recomendación' },
        { id: 'calidad', label: 'Calidad de producto o servicio' },
        { id: 'empleados', label: 'Evaluación de empleados / clima laboral' },
        { id: 'eventos', label: 'Eventos / RSVP / asistencia' },
        { id: 'leads', label: 'Levantamiento de leads' },
        { id: 'diagnostico', label: 'Diagnóstico interno de procesos' },
      ],
    },
    {
      id: 'canal_encuesta',
      type: 'multipleChoiceMulti',
      headline: '¿Dónde quieres aplicar esas encuestas?',
      required: true,
      choices: [
        { id: 'whatsapp', label: 'WhatsApp' },
        { id: 'qr', label: 'QR en sucursal o evento' },
        { id: 'email', label: 'Email' },
        { id: 'web', label: 'Sitio web / landing' },
        { id: 'pos', label: 'Después de venta o pago' },
        { id: 'manual', label: 'Captura interna por staff' },
      ],
    },
    {
      id: 'necesidad',
      type: 'multipleChoiceMulti',
      headline: 'Además de encuestas, ¿qué te gustaría automatizar?',
      subheader: 'Marca todas las que apliquen.',
      required: true,
      choices: [
        { id: 'agenda', label: 'Agenda automática de citas' },
        { id: 'ventas', label: 'Control de ventas y pagos' },
        { id: 'dashboard', label: 'Dashboard para ver mi negocio' },
        { id: 'bots', label: 'Bot de WhatsApp para clientes' },
        { id: 'personal', label: 'Control de personal' },
        { id: 'alertas', label: 'Alertas cuando una respuesta sea crítica' },
        { id: 'reportes_encuestas', label: 'Reportes automáticos de encuestas' },
        { id: 'todo', label: 'Quiero que mi negocio trabaje solo' },
      ],
    },
    {
      id: 'presupuesto',
      type: 'multipleChoiceSingle',
      headline: '¿Tienes un presupuesto en mente?',
      subheader: 'Nos ayuda a dimensionar la solución.',
      required: false,
      choices: [
        { id: '<10k', label: 'Menos de $10,000 MXN' },
        { id: '10-25k', label: '$10,000 - $25,000 MXN' },
        { id: '25-50k', label: '$25,000 - $50,000 MXN' },
        { id: '>50k', label: 'Más de $50,000 MXN' },
        { id: 'no_se', label: 'No sé, quiero opciones' },
      ],
    },
    {
      id: 'descripcion',
      type: 'openText',
      headline: 'Cuéntanos qué quieres aprender con esas encuestas',
      subheader: 'Ejemplo: por qué cancelan, qué servicio falla, cómo atiende mi equipo, qué producto gusta más.',
      required: false,
      longAnswer: true,
      placeholder: 'Quiero medir...',
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
      tags: extractTags(t.text),
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

  const handleSubmit = useCallback(
    async (answers: Record<string, unknown>, metadata: Record<string, unknown>) => {
      const { ratingsSummary, openTextResponses } = analyzeAnswers(answers);
      await submitToWebhook({
        type: 'contact_inquiry',
        form_type: 'contact_survey_full',
        answers,
        ratings_summary: ratingsSummary,
        open_text_responses: openTextResponses,
        email_report: buildContactEmailReport(answers),
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
            />
          )}
        </motion.div>
      </div>
    </div>
  );
}
