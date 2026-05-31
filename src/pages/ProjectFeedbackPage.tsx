import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Check } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import SurveyEngine from '@/components/SurveyEngine';
import type { SurveyConfig } from '@/components/SurveyEngine';
import { submitToWebhook } from '@/services/webhook';
import { buildSurveyEmailReport } from '@/services/emailReport';

const feedbackConfig: SurveyConfig = {
  id: 's23_project_feedback',
  name: 'Feedback Post-Proyecto',
  welcomeCard: {
    headline: '¿Cómo te fue con tu proyecto?',
    subheader: 'Tu feedback nos ayuda a seguir mejorando. Son solo 2 minutos.',
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
      id: 'proyecto',
      type: 'openText',
      headline: '¿En qué proyecto trabajamos?',
      subheader: 'Nombre o descripción breve del proyecto.',
      required: true,
      placeholder: 'Ej: Dashboard de ventas, Bot de WhatsApp...',
    },
    {
      id: 'nps_score',
      type: 'rating',
      headline: 'Del 1 al 10, ¿qué tan probable es que nos recomiendes?',
      subheader: '1 = Nada probable, 10 = Extremely likely',
      range: 10,
      scale: 'number',
      lowerLabel: '1',
      upperLabel: '10',
      required: true,
    },
    {
      id: 'calificacion_proyecto',
      type: 'rating',
      headline: '¿Cómo calificarías el proyecto en general?',
      range: 5,
      scale: 'star',
      lowerLabel: 'Mala',
      upperLabel: 'Excelente',
      required: true,
    },
    {
      id: 'calificacion_comunicacion',
      type: 'rating',
      headline: '¿Qué tal fue la comunicación?',
      range: 5,
      scale: 'star',
      lowerLabel: 'Mala',
      upperLabel: 'Excelente',
      required: true,
    },
    {
      id: 'cumplimiento_fechas',
      type: 'rating',
      headline: '¿Se cumplieron los tiempos?',
      range: 5,
      scale: 'star',
      lowerLabel: 'Nada',
      upperLabel: 'Siempre',
      required: true,
    },
    {
      id: 'calidad_entregables',
      type: 'rating',
      headline: '¿Cómo calificarías la calidad de lo entregado?',
      range: 5,
      scale: 'star',
      lowerLabel: 'Mala',
      upperLabel: 'Excelente',
      required: true,
    },
    {
      id: 'valor_agregado',
      type: 'multipleChoiceSingle',
      headline: '¿Qué valor le dio este proyecto a tu negocio?',
      required: true,
      choices: [
        { id: 'mucho', label: 'Mucho valor, superó expectativas' },
        { id: 'bien', label: 'Buen valor, cumplió lo prometido' },
        { id: 'regular', label: 'Algo de valor, pero esperaba más' },
        { id: 'poco', label: 'Poco valor' },
        { id: 'nada', label: 'No le vi valor' },
      ],
    },
    {
      id: 'volveria',
      type: 'multipleChoiceSingle',
      headline: '¿Contratarías de nuevo con nosotros?',
      required: true,
      choices: [
        { id: 'si', label: 'Sí, definitivamente' },
        { id: 'probable', label: 'Probablemente sí' },
        { id: 'neutral', label: 'No estoy seguro' },
        { id: 'no', label: 'No' },
      ],
    },
    {
      id: 'testimonial_permiso',
      type: 'multipleChoiceSingle',
      headline: '¿Podemos usar tu testimonio en nuestro sitio?',
      subheader: 'Nos encantaría compartir tu experiencia (sin datos sensibles).',
      required: false,
      choices: [
        { id: 'si', label: 'Sí, con gusto' },
        { id: 'nombre', label: 'Sí, pero solo mi nombre' },
        { id: 'anonimo', label: 'Solo de forma anónima' },
        { id: 'no', label: 'No, gracias' },
      ],
    },
  ],
  ending: {
    headline: '¡Gracias por tu feedback!',
    subheader: 'Tu opinión nos ayuda a seguir construyendo mejores sistemas. Si tienes algo más que decir, escríbenos a hi@soul23.mx',
  },
};

function analyzeAnswers(answers: Record<string, unknown>) {
  const ratingsSummary = [
    { category: 'NPS', score: answers.nps_score as number || 0, max: 10 },
    { category: 'Proyecto', score: answers.calificacion_proyecto as number || 0, max: 5 },
    { category: 'Comunicación', score: answers.calificacion_comunicacion as number || 0, max: 5 },
    { category: 'Cumplimiento', score: answers.cumplimiento_fechas as number || 0, max: 5 },
    { category: 'Calidad', score: answers.calidad_entregables as number || 0, max: 5 },
  ];

  const npsScore = (answers.nps_score as number) || 0;
  let npsCategory: 'promoter' | 'passive' | 'detractor' = 'passive';
  if (npsScore >= 9) npsCategory = 'promoter';
  else if (npsScore <= 6) npsCategory = 'detractor';

  return {
    ratingsSummary: [...ratingsSummary, { category: 'NPS_Category', score: npsCategory === 'promoter' ? 10 : npsCategory === 'passive' ? 7 : 3, max: 10 }],
    openTextResponses: [],
  };
}

export default function ProjectFeedbackPage() {
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();
  const closeSurvey = useCallback(() => navigate('/', { replace: true }), [navigate]);

  const handleSubmit = useCallback(
    async (answers: Record<string, unknown>, metadata: Record<string, unknown>) => {
      const { ratingsSummary, openTextResponses } = analyzeAnswers(answers);
      await submitToWebhook({
        type: 'project_feedback',
        answers,
        ratings_summary: ratingsSummary,
        open_text_responses: openTextResponses,
        email_report: buildSurveyEmailReport('project-feedback', answers),
        metadata: {
          ...metadata,
          submittedAt: new Date().toISOString(),
          userAgent: navigator.userAgent,
          source: 'project_feedback_survey',
          survey_name: 'Feedback Post-Proyecto',
          language: navigator.language,
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
                {feedbackConfig.ending?.headline}
              </h2>
              <p className="text-cream-muted text-[14px] leading-relaxed mb-8">
                {feedbackConfig.ending?.subheader}
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
              config={feedbackConfig}
              onSubmit={handleSubmit}
              onClose={closeSurvey}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
}
