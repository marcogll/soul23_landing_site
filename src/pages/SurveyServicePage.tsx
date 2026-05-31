import { useState, useCallback, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Check } from 'lucide-react';
import SurveyEngine from '@/components/SurveyEngine';
import type { SurveyConfig } from '@/components/SurveyEngine';
import { submitToWebhook } from '@/services/webhook';
import { buildSurveyEmailReport } from '@/services/emailReport';
import { classifySentiment, extractTags } from '@/services/aiTags';

const serviceConfig: SurveyConfig = {
  id: 's23_service_feedback',
  name: 'Encuesta de Servicio',
  welcomeCard: {
    headline: 'Cuéntanos cómo fue tu experiencia',
    subheader: 'Tu opinión nos ayuda a mejorar. Son solo 2 minutos.',
    buttonLabel: 'Comenzar',
  },
  showProgress: true,
  questions: [
    {
      id: 'fecha_visita',
      type: 'date',
      headline: '¿Cuándo fue tu última visita?',
      subheader: 'Selecciona la fecha del servicio que nos brindaste.',
      required: true,
      placeholder: 'Fecha de visita',
      recent: true,
    },
    {
      id: 'servicio_recibido',
      type: 'multipleChoiceSingle',
      headline: '¿Qué servicio recibiste?',
      required: true,
      choices: [
        { id: 'automatizacion', label: 'Automatización de procesos' },
        { id: 'dashboard', label: 'Dashboard / BI' },
        { id: 'bots', label: 'Bot de WhatsApp' },
        { id: 'agendas', label: 'Sistema de agendas' },
        { id: 'ventas', label: 'Control de ventas' },
        { id: 'personal', label: 'Control de personal' },
        { id: 'otro', label: 'Otro' },
      ],
    },
    {
      id: 'calificacion_experiencia',
      type: 'rating',
      headline: '¿Cómo calificarías tu experiencia general?',
      range: 5,
      scale: 'star',
      lowerLabel: 'Mala',
      upperLabel: 'Excelente',
      required: true,
    },
    {
      id: 'calificacion_comunicacion',
      type: 'rating',
      headline: '¿Qué tal fue la comunicación durante el proyecto?',
      range: 5,
      scale: 'star',
      lowerLabel: 'Mala',
      upperLabel: 'Excelente',
      required: true,
    },
    {
      id: 'calificacion_cumplimiento',
      type: 'rating',
      headline: '¿Se cumplieron los tiempos acordados?',
      range: 5,
      scale: 'star',
      lowerLabel: 'Nada',
      upperLabel: 'Siempre',
      required: true,
    },
    {
      id: 'calificacion_calidad',
      type: 'rating',
      headline: '¿Cómo calificarías la calidad del entregable?',
      range: 5,
      scale: 'star',
      lowerLabel: 'Mala',
      upperLabel: 'Excelente',
      required: true,
    },
    {
      id: 'problema_resuelto',
      type: 'multipleChoiceSingle',
      headline: '¿Tu problema principal fue resuelto?',
      required: true,
      choices: [
        { id: 'si_completo', label: 'Sí, completamente' },
        { id: 'si_parcial', label: 'Sí, parcialmente' },
        { id: 'no', label: 'No' },
      ],
    },
    {
      id: 'valor_percibido',
      type: 'multipleChoiceSingle',
      headline: '¿Sientes que el servicio valió la pena?',
      required: true,
      choices: [
        { id: 'mucho', label: 'Sí, mucho más de lo esperado' },
        { id: 'bien', label: 'Sí, valió la pena' },
        { id: 'regular', label: 'Más o menos' },
        { id: 'no', label: 'No, no lo sentí así' },
      ],
    },
    {
      id: 'recomendaria',
      type: 'multipleChoiceSingle',
      headline: '¿Nos recomendarías a un conocido?',
      required: true,
      choices: [
        { id: 'definitivamente', label: 'Definitivamente sí' },
        { id: 'probable', label: 'Probablemente sí' },
        { id: 'neutral', label: 'No estoy seguro' },
        { id: 'no', label: 'No' },
      ],
    },
    {
      id: 'comentario_positivo',
      type: 'openText',
      headline: '¿Qué fue lo que más te gustó?',
      subheader: 'Cuéntanos lo positivo para seguir haciéndolo bien.',
      required: false,
      longAnswer: true,
      placeholder: 'Me gustó que...',
    },
    {
      id: 'comentario_mejora',
      type: 'openText',
      headline: '¿Qué podríamos mejorar?',
      subheader: 'Tu feedback nos ayuda a crecer.',
      required: false,
      longAnswer: true,
      placeholder: 'Creo que podrían...',
    },
    {
      id: 'telefono_contacto',
      type: 'openText',
      inputType: 'phone',
      headline: '¿Tu número de teléfono?',
      subheader: 'Solo para contactarte si hay seguimiento.',
      required: false,
      placeholder: '8441234567',
      validation: { pattern: '^\\d{10}$', message: 'Debe tener 10 dígitos.' },
    },
  ],
  ending: {
    headline: '¡Gracias por tu feedback!',
    subheader: 'Tu opinión nos ayuda a construir mejores sistemas. Si tienes algún comentario adicional, escríbenos a hi@soul23.mx',
  },
};

const sentimentWords = {
  positive: ['gusto', 'bien', 'excelente', 'perfecto', 'increíble', 'mejor', 'encanta', 'recomiendo', 'satisfecho', 'feliz', 'rapido', 'rapida', 'eficiente', 'profesional'],
  negative: ['malo', 'peor', 'lento', 'tardado', 'problema', 'error', 'falla', 'decepcionado', 'molesto', 'confuso', 'caro', 'difícil', 'complicado'],
};

function analyzeAnswers(answers: Record<string, unknown>) {
  const ratingsSummary = [
    { category: 'Experiencia', score: answers.calificacion_experiencia as number || 0, max: 5 },
    { category: 'Comunicación', score: answers.calificacion_comunicacion as number || 0, max: 5 },
    { category: 'Cumplimiento', score: answers.calificacion_cumplimiento as number || 0, max: 5 },
    { category: 'Calidad', score: answers.calificacion_calidad as number || 0, max: 5 },
  ];

  const openTexts = [
    { id: 'comentario_positivo', text: (answers.comentario_positivo as string) || '' },
    { id: 'comentario_mejora', text: (answers.comentario_mejora as string) || '' },
  ];

  const openTextResponses = openTexts
    .filter((t) => t.text.length > 0)
    .map((t) => ({
      question_id: t.id,
      text: t.text,
      sentiment: classifySentiment(t.text, sentimentWords),
      tags: extractTags(t.text),
    }));

  return { ratingsSummary, openTextResponses };
}

export default function SurveyServicePage() {
  const [searchParams] = useSearchParams();
  const [submitted, setSubmitted] = useState(false);
  const [prefillData, setPrefillData] = useState<Record<string, unknown>>({});
  const navigate = useNavigate();
  const closeSurvey = useCallback(() => navigate('/', { replace: true }), [navigate]);

  useEffect(() => {
    const r = searchParams.get('r');
    if (r) {
      try {
        const phone = atob(r);
        setPrefillData({ phone });
      } catch { /* ignore */ }
    }
  }, [searchParams]);

  // 3-minute timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      const storageKey = 's23-survey-s23_service_feedback';
      const saved = localStorage.getItem(storageKey);
      if (saved && !submitted) {
        const data = JSON.parse(saved);
        if (data.answers && Object.keys(data.answers).length > 0) {
          const { ratingsSummary, openTextResponses } = analyzeAnswers(data.answers);
          submitToWebhook({
            type: 'service_feedback',
            status: 'survey_timeout',
            answers: data.answers,
            ratings_summary: ratingsSummary,
            open_text_responses: openTextResponses,
            metadata: {
              submittedAt: new Date().toISOString(),
              userAgent: navigator.userAgent,
              source: 'service_feedback_survey',
              survey_name: 'Encuesta de Servicio',
              language: navigator.language,
            },
          });
          setSubmitted(true);
        }
      }
    }, 180000);
    return () => clearTimeout(timer);
  }, [submitted]);

  const handleSubmit = useCallback(
    async (answers: Record<string, unknown>, metadata: Record<string, unknown>) => {
      const { ratingsSummary, openTextResponses } = analyzeAnswers(answers);
      await submitToWebhook({
        type: 'service_feedback',
        status: 'completed',
        answers,
        ratings_summary: ratingsSummary,
        open_text_responses: openTextResponses,
        email_report: buildSurveyEmailReport('service-feedback', answers),
        metadata: {
          ...metadata,
          submittedAt: new Date().toISOString(),
          userAgent: navigator.userAgent,
          source: 'service_feedback_survey',
          survey_name: 'Encuesta de Servicio',
          language: navigator.language,
          phoneNumber: (answers.telefono_contacto as string) || undefined,
        },
      });
      setSubmitted(true);
    },
    []
  );

  return (
    <div className="min-h-screen bg-dark-primary">
      {/* Header */}
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

      {/* Content */}
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
                {serviceConfig.ending?.headline}
              </h2>
              <p className="text-cream-muted text-[14px] leading-relaxed mb-8">
                {serviceConfig.ending?.subheader}
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
              config={serviceConfig}
              onSubmit={handleSubmit}
              prefillData={prefillData}
              onClose={closeSurvey}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
}
