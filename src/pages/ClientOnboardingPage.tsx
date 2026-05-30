import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import SurveyEngine from '@/components/SurveyEngine';
import type { SurveyConfig } from '@/components/SurveyEngine';
import { submitToWebhook } from '@/services/webhook';
import { buildSurveyEmailReport } from '@/services/emailReport';

const onboardingConfig: SurveyConfig = {
  id: 's23_client_onboarding',
  name: 'Onboarding de Cliente',
  welcomeCard: {
    headline: 'Bienvenido a soul:23',
    subheader: 'Cuéntanos sobre ti y tu negocio para diseñar la mejor solución para ti.',
    buttonLabel: 'Empezar',
  },
  showProgress: true,
  questions: [
    {
      id: 'nombre',
      type: 'openText',
      headline: '¿Cómo te llamas?',
      required: true,
      placeholder: 'Tu nombre completo',
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
      id: 'nombre_negocio',
      type: 'openText',
      headline: '¿Cómo se llama tu negocio?',
      required: true,
      placeholder: 'Nombre del negocio',
    },
    {
      id: 'giro',
      type: 'multipleChoiceSingle',
      headline: '¿En qué giro está tu negocio?',
      required: true,
      choices: [
        { id: 'belleza', label: 'Belleza / Spa / Salón' },
        { id: 'restaurante', label: 'Restaurante / Alimentos' },
        { id: 'salud', label: 'Salud / Clínica / Consultorio' },
        { id: 'retail', label: 'Retail / Tienda' },
        { id: 'educacion', label: 'Educación / Academia' },
        { id: 'servicios', label: 'Servicios profesionales' },
        { id: 'otro', label: 'Otro' },
      ],
    },
    {
      id: 'tamano',
      type: 'multipleChoiceSingle',
      headline: '¿Cuántas personas trabajan en tu negocio?',
      required: true,
      choices: [
        { id: 'solo', label: 'Solo yo' },
        { id: '2-5', label: '2 - 5 personas' },
        { id: '6-15', label: '6 - 15 personas' },
        { id: '16-50', label: '16 - 50 personas' },
        { id: '>50', label: 'Más de 50 personas' },
      ],
    },
    {
      id: 'sistemas_actuales',
      type: 'multipleChoiceMulti',
      headline: '¿Qué sistemas usas actualmente?',
      subheader: 'Marca todos los que apliquen.',
      required: true,
      choices: [
        { id: 'excel', label: 'Excel / Hojas de cálculo' },
        { id: 'whatsapp', label: 'Solo WhatsApp' },
        { id: 'pos', label: 'Caja / POS' },
        { id: 'crm', label: 'CRM (HubSpot, Salesforce, etc.)' },
        { id: 'contabilidad', label: 'Software de contabilidad' },
        { id: 'nada', label: 'Ninguno, todo manual' },
      ],
    },
    {
      id: 'necesidades',
      type: 'multipleChoiceMulti',
      headline: '¿Qué necesitas automatizar?',
      subheader: 'Marca todas las que apliquen.',
      required: true,
      choices: [
        { id: 'agendas', label: 'Agenda de citas automática' },
        { id: 'ventas', label: 'Control de ventas y pagos' },
        { id: 'reportes', label: 'Reportes y dashboards' },
        { id: 'whatsapp_bot', label: 'Bot de WhatsApp' },
        { id: 'personal_ctrl', label: 'Control de personal' },
        { id: 'inventario', label: 'Inventario' },
        { id: 'marketing', label: 'Marketing automatizado' },
      ],
    },
    {
      id: 'urgencia',
      type: 'multipleChoiceSingle',
      headline: '¿Qué tan urgente es tu proyecto?',
      required: true,
      choices: [
        { id: 'inmediato', label: 'Lo necesito ya' },
        { id: '1mes', label: 'En el próximo mes' },
        { id: '3meses', label: 'En 1-3 meses' },
        { id: 'explorando', label: 'Solo estoy explorando opciones' },
      ],
    },
    {
      id: 'presupuesto',
      type: 'multipleChoiceSingle',
      headline: '¿Tienes un presupuesto en mente?',
      required: false,
      choices: [
        { id: '<15k', label: 'Menos de $15,000 MXN' },
        { id: '15-30k', label: '$15,000 - $30,000 MXN' },
        { id: '30-60k', label: '$30,000 - $60,000 MXN' },
        { id: '>60k', label: 'Más de $60,000 MXN' },
        { id: 'definir', label: 'Quiero que me ayuden a definirlo' },
      ],
    },
    {
      id: 'como_nos_conociste',
      type: 'multipleChoiceSingle',
      headline: '¿Cómo nos encontraste?',
      required: false,
      choices: [
        { id: 'google', label: 'Google' },
        { id: 'instagram', label: 'Instagram' },
        { id: 'referido', label: 'Recomendación / Referido' },
        { id: 'linkedin', label: 'LinkedIn' },
        { id: 'otro', label: 'Otro' },
      ],
    },
    {
      id: 'referido_por',
      type: 'openText',
      headline: '¿Quién te recomendó?',
      subheader: 'Si alguien te refirió, cuéntanos para darle las gracias.',
      required: false,
      placeholder: 'Nombre de quien te recomendó',
    },
    {
      id: 'contacto_preferido',
      type: 'multipleChoiceSingle',
      headline: '¿Cómo prefieres que te contactemos?',
      required: true,
      choices: [
        { id: 'whatsapp', label: 'WhatsApp' },
        { id: 'email', label: 'Email' },
        { id: 'llamada', label: 'Llamada telefónica' },
      ],
    },
    {
      id: 'mensaje',
      type: 'openText',
      headline: '¿Algo más que quieras contarnos?',
      required: false,
      longAnswer: true,
      placeholder: 'Cuéntanos lo que quieras...',
    },
  ],
  ending: {
    headline: '¡Bienvenido a soul:23!',
    subheader: 'Te contactaremos pronto para diseñar la mejor solución para tu negocio.',
  },
};

const sentimentWords = {
  positive: ['necesito', 'urgente', 'interesa', 'ideal', 'perfecto', 'excelente', 'bueno'],
  negative: ['problema', 'difícil', 'complicado', 'caro', 'lento', 'frustrante'],
};

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
    'automatización': ['automatizar', 'automático', 'proceso'],
    'ventas': ['ventas', 'vender', 'pago', 'factura'],
    'agendas': ['agenda', 'cita', 'reservar'],
    'personal': ['personal', 'empleado', 'equipo'],
    'whatsapp': ['whatsapp', 'bot', 'chat'],
    'dashboard': ['dashboard', 'reporte', 'datos'],
    'inventario': ['inventario', 'stock', 'producto'],
    'clientes': ['clientes', 'clienta', 'lead'],
    'urgencia': ['urgente', 'ya', 'inmediato', 'pronto'],
  };
  const lower = text.toLowerCase();
  return Object.entries(keywords)
    .filter(([, words]) => words.some((w) => lower.includes(w)))
    .map(([tag]) => tag);
}

function analyzeAnswers(answers: Record<string, unknown>) {
  const openTexts = [
    { id: 'mensaje', text: (answers.mensaje as string) || '' },
    { id: 'referido_por', text: (answers.referido_por as string) || '' },
  ];
  return {
    ratingsSummary: [],
    openTextResponses: openTexts
      .filter((t) => t.text.length > 0)
      .map((t) => ({
        question_id: t.id,
        text: t.text,
        sentiment: classifySentiment(t.text, sentimentWords),
        tags: extractTags(t.text),
      })),
  };
}

export default function ClientOnboardingPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = useCallback(
    async (answers: Record<string, unknown>, metadata: Record<string, unknown>) => {
      const { ratingsSummary, openTextResponses } = analyzeAnswers(answers);
      await submitToWebhook({
        type: 'client_onboarding',
        answers,
        ratings_summary: ratingsSummary,
        open_text_responses: openTextResponses,
        email_report: buildSurveyEmailReport('client-onboarding', answers),
        metadata: {
          ...metadata,
          submittedAt: new Date().toISOString(),
          userAgent: navigator.userAgent,
          source: 'client_onboarding_survey',
          survey_name: 'Onboarding de Cliente',
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
                {onboardingConfig.ending?.headline}
              </h2>
              <p className="text-cream-muted text-[14px] leading-relaxed mb-8">
                {onboardingConfig.ending?.subheader}
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
              config={onboardingConfig}
              onSubmit={handleSubmit}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
}
