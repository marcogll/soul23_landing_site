import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import SurveyEngine from '@/components/SurveyEngine';
import type { SurveyConfig } from '@/components/SurveyEngine';
import { submitToWebhook } from '@/services/webhook';

const rsvpConfig: SurveyConfig = {
  id: 's23_event_rsvp',
  name: 'RSVP Evento',
  welcomeCard: {
    headline: 'Confirma tu asistencia',
    subheader: 'Regístrate para nuestro próximo evento/workshop de soul:23.',
    buttonLabel: 'Confirmar asistencia',
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
      id: 'asistentes',
      type: 'multipleChoiceSingle',
      headline: '¿Cuántas personas asistirán?',
      required: true,
      choices: [
        { id: '1', label: 'Solo yo' },
        { id: '2', label: '2 personas' },
        { id: '3-5', label: '3 - 5 personas' },
        { id: '>5', label: 'Más de 5 personas' },
      ],
    },
    {
      id: 'modalidad',
      type: 'multipleChoiceSingle',
      headline: '¿Cómo asistirás?',
      required: true,
      choices: [
        { id: 'presencial', label: 'Presencial' },
        { id: 'virtual', label: 'Virtual (streaming)' },
      ],
    },
    {
      id: 'temas_interes',
      type: 'multipleChoiceMulti',
      headline: '¿Qué temas te interesan más?',
      subheader: 'Marca todos los que quieras cubrir.',
      required: true,
      choices: [
        { id: 'automatizacion', label: 'Automatización de procesos' },
        { id: 'ia', label: 'Inteligencia Artificial aplicada' },
        { id: 'ventas', label: 'Aumentar ventas con tecnología' },
        { id: 'dashboard', label: 'Dashboards y reportes' },
        { id: 'whatsapp', label: 'Bots y WhatsApp Business' },
        { id: 'marketing', label: 'Marketing digital automatizado' },
      ],
    },
    {
      id: 'preguntas_previas',
      type: 'openText',
      headline: '¿Tienes alguna pregunta o tema que quieras que cubramos?',
      required: false,
      longAnswer: true,
      placeholder: 'Me gustaría saber sobre...',
    },
    {
      id: 'como_nos_conociste',
      type: 'multipleChoiceSingle',
      headline: '¿Cómo te enteraste del evento?',
      required: false,
      choices: [
        { id: 'instagram', label: 'Instagram' },
        { id: 'whatsapp', label: 'WhatsApp' },
        { id: 'referido', label: 'Recomendación' },
        { id: 'google', label: 'Google' },
        { id: 'otro', label: 'Otro' },
      ],
    },
  ],
  ending: {
    headline: '¡Tu asistencia está confirmada!',
    subheader: 'Te enviaremos los detalles por correo electrónico y WhatsApp. ¡Nos vemos pronto!',
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
    'automatización': ['automatizar', 'automático', 'proceso'],
    'ventas': ['ventas', 'vender', 'pago'],
    'ia': ['inteligencia artificial', 'ia', 'machine learning', 'chatgpt'],
    'dashboard': ['dashboard', 'reporte', 'datos'],
    'whatsapp': ['whatsapp', 'bot', 'chat'],
    'marketing': ['marketing', 'redes', 'contenido', 'seo'],
  };
  const lower = text.toLowerCase();
  return Object.entries(keywords)
    .filter(([, words]) => words.some((w) => lower.includes(w)))
    .map(([tag]) => tag);
}

function analyzeAnswers(answers: Record<string, unknown>) {
  const openTexts = [{ id: 'preguntas_previas', text: (answers.preguntas_previas as string) || '' }];
  return {
    ratingsSummary: [],
    openTextResponses: openTexts
      .filter((t) => t.text.length > 0)
      .map((t) => ({
        question_id: t.id,
        text: t.text,
        sentiment: classifySentiment(t.text, { positive: ['interesa', 'genial', 'excelente', 'perfecto'], negative: ['problema', 'difícil', 'no entiendo'] }),
        tags: extractTags(t.text),
      })),
  };
}

export default function RsvpPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = useCallback(
    async (answers: Record<string, unknown>, metadata: Record<string, unknown>) => {
      const { ratingsSummary, openTextResponses } = analyzeAnswers(answers);
      await submitToWebhook({
        type: 'event_rsvp',
        answers,
        ratings_summary: ratingsSummary,
        open_text_responses: openTextResponses,
        metadata: {
          ...metadata,
          submittedAt: new Date().toISOString(),
          userAgent: navigator.userAgent,
          source: 'event_rsvp_survey',
          survey_name: 'RSVP Evento',
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
                {rsvpConfig.ending?.headline}
              </h2>
              <p className="text-cream-muted text-[14px] leading-relaxed mb-8">
                {rsvpConfig.ending?.subheader}
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
              config={rsvpConfig}
              onSubmit={handleSubmit}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
}
