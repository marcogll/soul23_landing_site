import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import SurveyEngine from '@/components/SurveyEngine';
import type { SurveyConfig } from '@/components/SurveyEngine';
import { submitToWebhook } from '@/services/webhook';

const evaluationConfig: SurveyConfig = {
  id: 's23_staff_evaluation',
  name: 'Evaluación de Personal',
  welcomeCard: {
    headline: 'Evaluación de Desempeño',
    subheader: 'Tu evaluación es confidencial. Responde con honestidad para un mejor desarrollo del equipo.',
    buttonLabel: 'Comenzar evaluación',
  },
  showProgress: true,
  questions: [
    // ─── Datos generales ───
    {
      id: 'nombre_evaluador',
      type: 'openText',
      headline: '¿Cuál es tu nombre?',
      subheader: 'Nombre de quien realiza la evaluación.',
      required: true,
      placeholder: 'Tu nombre',
    },
    {
      id: 'nombre_evaluado',
      type: 'openText',
      headline: '¿A quién evalúas?',
      subheader: 'Nombre de la persona evaluada.',
      required: true,
      placeholder: 'Nombre del evaluado',
    },
    {
      id: 'relacion',
      type: 'multipleChoiceSingle',
      headline: '¿Cuál es tu relación con la persona evaluada?',
      required: true,
      choices: [
        { id: 'jefe', label: 'Soy su jefe / supervisor' },
        { id: 'compañero', label: 'Compañero / Par' },
        { id: 'auto', label: 'Autoevaluación' },
        { id: 'subordinado', label: 'Soy su subordinado' },
      ],
    },
    {
      id: 'periodo',
      type: 'multipleChoiceSingle',
      headline: '¿Qué período evalúas?',
      required: true,
      choices: [
        { id: 'mensual', label: 'Último mes' },
        { id: 'trimestral', label: 'Último trimestre' },
        { id: 'semestral', label: 'Último semestre' },
        { id: 'anual', label: 'Último año' },
      ],
    },
    // ─── Autoevaluación / Evaluación ───
    {
      id: 'desempeno_general',
      type: 'rating',
      headline: '¿Cómo calificarías su desempeño general?',
      range: 5,
      scale: 'star',
      lowerLabel: 'Muy bajo',
      upperLabel: 'Excelente',
      required: true,
    },
    {
      id: 'productividad',
      type: 'rating',
      headline: '¿Qué tan productiva/es la persona evaluada?',
      range: 5,
      scale: 'star',
      lowerLabel: 'Baja',
      upperLabel: 'Muy alta',
      required: true,
    },
    {
      id: 'puntualidad',
      type: 'rating',
      headline: '¿Qué tan puntual es?',
      range: 5,
      scale: 'star',
      lowerLabel: 'Impuntual',
      upperLabel: 'Siempre puntual',
      required: true,
    },
    {
      id: 'calidad_trabajo',
      type: 'rating',
      headline: '¿Qué tan buena es la calidad de su trabajo?',
      range: 5,
      scale: 'star',
      lowerLabel: 'Mala',
      upperLabel: 'Excelente',
      required: true,
    },
    {
      id: 'actitud',
      type: 'rating',
      headline: '¿Cómo es su actitud y disposición?',
      range: 5,
      scale: 'star',
      lowerLabel: 'Negativa',
      upperLabel: 'Excelente',
      required: true,
    },
    {
      id: 'trabajo_equipo',
      type: 'rating',
      headline: '¿Qué tan bien trabaja en equipo?',
      range: 5,
      scale: 'star',
      lowerLabel: 'Mal',
      upperLabel: 'Excelente',
      required: true,
    },
    {
      id: 'liderazgo',
      type: 'rating',
      headline: '¿Demuestra liderazgo e iniciativa?',
      range: 5,
      scale: 'star',
      lowerLabel: 'Nada',
      upperLabel: 'Muchísimo',
      required: false,
    },
    // ─── Aspectos cualitativos ───
    {
      id: 'fortalezas',
      type: 'openText',
      headline: '¿Cuáles son sus principales fortalezas?',
      required: true,
      longAnswer: true,
      placeholder: 'Ej: Buena comunicación, puntual, creativo...',
    },
    {
      id: 'areas_mejora',
      type: 'openText',
      headline: '¿Qué áreas debería mejorar?',
      required: true,
      longAnswer: true,
      placeholder: 'Ej: Organización, manejo del tiempo, liderazgo...',
    },
    {
      id: 'comentario_adicional',
      type: 'openText',
      headline: '¿Algún comentario adicional?',
      required: false,
      longAnswer: true,
      placeholder: 'Algo más que quieras compartir...',
    },
    {
      id: 'recomendaria_trabajar',
      type: 'multipleChoiceSingle',
      headline: '¿Trabajarías de nuevo con esta persona?',
      required: true,
      choices: [
        { id: 'definitivamente', label: 'Definitivamente sí' },
        { id: 'si', label: 'Sí, probablemente' },
        { id: 'neutral', label: 'No estoy seguro' },
        { id: 'no', label: 'No' },
      ],
    },
  ],
  ending: {
    headline: 'Evaluación completada',
    subheader: 'Gracias por tu tiempo. Tu evaluación ayuda al crecimiento del equipo.',
  },
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
    'comunicación': ['comunicación', 'comunica', 'explica', 'dialoga'],
    'liderazgo': ['liderazgo', 'lider', 'lidera', 'dirige'],
    'puntualidad': ['puntual', 'puntualidad', 'tiempo', 'horario'],
    'creatividad': ['creativo', 'creativa', 'creatividad', 'innovador'],
    'trabajo_equipo': ['equipo', 'compañeros', 'colabora', 'trabajo en equipo'],
    'organización': ['organizado', 'organización', 'orden', 'planifica'],
    'proactividad': ['proactivo', 'iniciativa', 'propone', 'mejora'],
    'calidad': ['calidad', 'detallista', 'cuidadoso', 'preciso'],
  };
  const lower = text.toLowerCase();
  return Object.entries(keywords)
    .filter(([, words]) => words.some((w) => lower.includes(w)))
    .map(([tag]) => tag);
}

function analyzeAnswers(answers: Record<string, unknown>) {
  const avg = (ids: string[]) => {
    const vals = ids.map((id) => (answers[id] as number) || 0).filter((v) => v > 0);
    return vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
  };

  const ratingsSummary = [
    { category: 'Desempeño General', score: avg(['desempeno_general']), max: 5 },
    { category: 'Productividad', score: avg(['productividad']), max: 5 },
    { category: 'Puntualidad', score: avg(['puntualidad']), max: 5 },
    { category: 'Calidad', score: avg(['calidad_trabajo']), max: 5 },
    { category: 'Actitud', score: avg(['actitud']), max: 5 },
    { category: 'Trabajo en Equipo', score: avg(['trabajo_equipo']), max: 5 },
    { category: 'Liderazgo', score: avg(['liderazgo']), max: 5 },
  ];

  const openTexts = [
    { id: 'fortalezas', text: (answers.fortalezas as string) || '' },
    { id: 'areas_mejora', text: (answers.areas_mejora as string) || '' },
    { id: 'comentario_adicional', text: (answers.comentario_adicional as string) || '' },
  ];

  return {
    ratingsSummary,
    openTextResponses: openTexts
      .filter((t) => t.text.length > 0)
      .map((t) => ({
        question_id: t.id,
        text: t.text,
        sentiment: classifySentiment(t.text, {
          positive: ['bueno', 'bien', 'excelente', 'fortaleza', 'positivo', 'destaca', 'creativo', 'proactivo'],
          negative: ['malo', 'mejorar', 'débil', 'falta', 'problema', 'negativo', 'difícil'],
        }),
        tags: extractTags(t.text),
      })),
  };
}

export default function StaffEvaluationPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = useCallback(
    async (answers: Record<string, unknown>, metadata: Record<string, unknown>) => {
      const { ratingsSummary, openTextResponses } = analyzeAnswers(answers);
      await submitToWebhook({
        type: 'staff_evaluation',
        answers,
        ratings_summary: ratingsSummary,
        open_text_responses: openTextResponses,
        metadata: {
          ...metadata,
          submittedAt: new Date().toISOString(),
          userAgent: navigator.userAgent,
          source: 'staff_evaluation_survey',
          survey_name: 'Evaluación de Personal',
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
                {evaluationConfig.ending?.headline}
              </h2>
              <p className="text-cream-muted text-[14px] leading-relaxed mb-8">
                {evaluationConfig.ending?.subheader}
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
              config={evaluationConfig}
              onSubmit={handleSubmit}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
}
