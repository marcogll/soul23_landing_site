import { useState, useCallback, useRef, useEffect } from 'react';
import type { KeyboardEvent, RefObject } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, ArrowLeft, Check, Star, Send, Loader2,
  MapPin, Sparkles, X
} from 'lucide-react';
import { cn } from '@/lib/utils';

const EASE_OUT = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number];

// ─── Types ───────────────────────────────────────────────────────────

export interface Choice {
  id: string;
  label: string;
}

export type QuestionType =
  | 'multipleChoiceSingle'
  | 'multipleChoiceMulti'
  | 'rating'
  | 'openText'
  | 'date'
  | 'cta'
  | 'branchSelect';

export interface ValidationRule {
  pattern: string;
  message: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  headline: string;
  subheader?: string;
  required?: boolean;
  choices?: Choice[];
  range?: number;
  scale?: 'star' | 'number';
  lowerLabel?: string;
  upperLabel?: string;
  placeholder?: string;
  longAnswer?: boolean;
  inputType?: 'text' | 'phone' | 'email';
  buttonLabel?: string;
  backButtonLabel?: string;
  ctaButtonUrl?: string;
  ctaButtonLabel?: string;
  birthday?: boolean;
  recent?: boolean;
  validation?: ValidationRule;
}

export interface Ending {
  headline: string;
  subheader?: string;
  buttonLink?: string;
  buttonLabel?: string;
  imageUrl?: string;
}

export interface WelcomeCard {
  headline: string;
  subheader?: string;
  buttonLabel: string;
  imageUrl?: string;
  enabled?: boolean;
}

export interface SurveyConfig {
  id: string;
  name: string;
  welcomeCard?: WelcomeCard | null;
  questions: Question[];
  ending?: Ending | null;
  showProgress?: boolean;
}

export interface SurveyEngineProps {
  config: SurveyConfig;
  onSubmit: (answers: Record<string, unknown>, metadata: Record<string, unknown>) => void;
  onClose?: () => void;
  prefillData?: Record<string, unknown>;
  className?: string;
  autoFocus?: boolean;
}

// ─── Question Components ─────────────────────────────────────────────

function RatingQuestion({
  value,
  onChange,
  range = 5,
  scale = 'star',
  lowerLabel,
  upperLabel,
}: {
  value: number | null;
  onChange: (v: number) => void;
  range?: number;
  scale?: 'star' | 'number';
  lowerLabel?: string;
  upperLabel?: string;
}) {
  const [hover, setHover] = useState<number | null>(null);

  return (
    <div>
      <div className="flex items-center justify-center gap-2 mb-4">
        {Array.from({ length: range }, (_, i) => {
          const val = i + 1;
          const active = (hover !== null ? hover : value) !== null && val <= (hover !== null ? hover! : value!);
          return (
            <motion.button
              key={val}
              type="button"
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onChange(val)}
              onMouseEnter={() => setHover(val)}
              onMouseLeave={() => setHover(null)}
              className={cn(
                "w-12 h-12 rounded-none flex items-center justify-center text-lg transition-all duration-200",
                active
                  ? "bg-gold text-dark-primary shadow-[0_0_12px_rgba(200,178,107,0.25)]"
                  : "bg-cream/[0.04] text-cream-muted/40 border border-cream/10 hover:border-gold/40 hover:text-gold"
              )}
            >
              {scale === 'star' ? <Star size={22} fill={active ? 'currentColor' : 'none'} /> : val}
            </motion.button>
          );
        })}
      </div>
      {(lowerLabel || upperLabel) && (
        <div className="flex justify-between text-[10px] font-mono uppercase tracking-[0.15em] text-cream-muted/30">
          <span>{lowerLabel}</span>
          <span>{upperLabel}</span>
        </div>
      )}
    </div>
  );
}

function ChoiceSingleQuestion({
  choices,
  value,
  onChange,
}: {
  choices: Choice[];
  value: string | null;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-2">
      {choices.map((choice) => {
        const selected = value === choice.id;
        return (
          <motion.button
            key={choice.id}
            type="button"
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onChange(choice.id)}
            className={cn(
              "w-full text-left px-5 py-3.5 rounded-none border transition-all duration-200 flex items-center gap-3",
              selected
                ? "border-gold bg-gold/5 text-cream"
                : "border-cream/10 bg-cream/[0.02] text-cream-muted hover:border-cream/25 hover:text-cream"
            )}
          >
            <div className={cn(
              "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all",
              selected ? "border-gold" : "border-cream/20"
            )}>
              {selected && <div className="w-2.5 h-2.5 rounded-full bg-gold" />}
            </div>
            <span className="text-[14px] font-sans">{choice.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}

function ChoiceMultiQuestion({
  choices,
  value,
  onChange,
}: {
  choices: Choice[];
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const toggle = (id: string) => {
    if (value.includes(id)) {
      onChange(value.filter((v) => v !== id));
    } else {
      onChange([...value, id]);
    }
  };

  return (
    <div className="space-y-2">
      {choices.map((choice) => {
        const selected = value.includes(choice.id);
        return (
          <motion.button
            key={choice.id}
            type="button"
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => toggle(choice.id)}
            className={cn(
              "w-full text-left px-5 py-3.5 rounded-none border transition-all duration-200 flex items-center gap-3",
              selected
                ? "border-gold bg-gold/5 text-cream"
                : "border-cream/10 bg-cream/[0.02] text-cream-muted hover:border-cream/25 hover:text-cream"
            )}
          >
            <div className={cn(
              "w-5 h-5 rounded-none border-2 flex items-center justify-center flex-shrink-0 transition-all",
              selected ? "border-gold bg-gold" : "border-cream/20"
            )}>
              {selected && <Check size={12} className="text-dark-primary" />}
            </div>
            <span className="text-[14px] font-sans">{choice.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}

function OpenTextQuestion({
  value,
  onChange,
  placeholder,
  longAnswer,
  inputType = 'text',
  inputRef,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  longAnswer?: boolean;
  inputType?: 'text' | 'phone' | 'email';
  inputRef?: RefObject<HTMLInputElement | HTMLTextAreaElement | null>;
}) {
  const handleChange = (rawValue: string) => {
    if (inputType === 'phone') {
      onChange(rawValue.replace(/\D/g, '').slice(0, 13));
      return;
    }
    onChange(rawValue);
  };

  const preventEnterSubmit = (event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !longAnswer) {
      event.preventDefault();
    }
  };

  if (longAnswer) {
    return (
      <textarea
        ref={inputRef as RefObject<HTMLTextAreaElement>}
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={preventEnterSubmit}
        placeholder={placeholder}
        rows={4}
        className="w-full px-5 py-4 bg-cream/[0.04] border border-cream/15 rounded-none text-cream text-[14px] placeholder:text-cream-muted/25 outline-none focus:border-gold/50 transition-colors resize-none"
      />
    );
  }

  return (
    <input
      ref={inputRef as RefObject<HTMLInputElement>}
      type={inputType === 'phone' ? 'tel' : inputType}
      inputMode={inputType === 'phone' ? 'numeric' : inputType === 'email' ? 'email' : 'text'}
      autoComplete={inputType === 'phone' ? 'tel' : inputType === 'email' ? 'email' : 'off'}
      value={value}
      onChange={(e) => handleChange(e.target.value)}
      onKeyDown={preventEnterSubmit}
      placeholder={placeholder}
      className="w-full px-5 py-4 bg-cream/[0.04] border border-cream/15 rounded-none text-cream text-[14px] placeholder:text-cream-muted/25 outline-none focus:border-gold/50 transition-colors"
    />
  );
}

import { DatePicker } from './ui/DatePicker';

function DateQuestion({
  value,
  onChange,
  placeholder,
  birthday,
  recent,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  birthday?: boolean;
  recent?: boolean;
}) {
  const dateValue = value ? new Date(value) : undefined;

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      onChange(date.toISOString().split('T')[0]);
    } else {
      onChange('');
    }
  };

  return (
    <DatePicker
      value={dateValue}
      onChange={handleDateChange}
      placeholder={placeholder || 'Selecciona una fecha'}
      birthday={birthday}
      recent={recent}
    />
  );
}

function BranchSelectQuestion({
  value,
  onChange,
}: {
  value: 'cima' | 'o' | null;
  onChange: (v: 'cima' | 'o') => void;
}) {
  const branches = [
    { id: 'cima' as const, name: 'Plaza CIMA', address: 'Periférico Luis Echeverría 1956, Col. Lourdes' },
    { id: 'o' as const, name: 'Plaza O', address: 'Blvd. Venustiano Carranza 4535, Virreyes Residencial' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {branches.map((branch) => {
        const selected = value === branch.id;
        return (
          <motion.button
            key={branch.id}
            type="button"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onChange(branch.id)}
            className={cn(
              "p-5 rounded-none border transition-all duration-200 text-left",
              selected
                ? "border-gold bg-gold/5 shadow-[0_0_20px_rgba(200,178,107,0.1)]"
                : "border-cream/10 bg-cream/[0.02] hover:border-cream/25"
            )}
          >
            <div className="flex items-center gap-2 mb-2">
              <MapPin size={16} className={selected ? 'text-gold' : 'text-cream-muted/40'} />
              <span className={cn("font-sans font-medium text-[14px]", selected ? 'text-gold' : 'text-cream')}>
                {branch.name}
              </span>
            </div>
            <p className="text-cream-muted text-[12px] leading-relaxed">{branch.address}</p>
          </motion.button>
        );
      })}
    </div>
  );
}

// ─── Slide Variants ──────────────────────────────────────────────────

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 60 : -60,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 60 : -60,
    opacity: 0,
  }),
};

// ─── Main Engine ─────────────────────────────────────────────────────

export default function SurveyEngine({
  config,
  onSubmit,
  onClose,
  prefillData = {},
  autoFocus = true,
}: SurveyEngineProps) {
  const hasWelcome = Boolean(config.welcomeCard && config.welcomeCard.enabled !== false);
  const [step, setStep] = useState<'welcome' | 'questions' | 'ending'>(hasWelcome ? 'welcome' : 'questions');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [answers, setAnswers] = useState<Record<string, unknown>>({ ...prefillData });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const lastAnswerTimestamp = useRef<Record<string, number>>({});
  const historyEntryArmed = useRef(false);
  const storageKey = `s23-survey-${config.id}`;

  const requestClose = useCallback(() => {
    if (!onClose) return;
    if (historyEntryArmed.current) {
      window.history.back();
      return;
    }
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!onClose) return;

    window.history.pushState(
      { ...(window.history.state || {}), s23SurveyOpen: config.id },
      '',
      window.location.href
    );
    historyEntryArmed.current = true;

    const handlePopState = () => {
      if (!historyEntryArmed.current) return;
      historyEntryArmed.current = false;
      onClose();
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      historyEntryArmed.current = false;
    };
  }, [config.id, onClose]);

  useEffect(() => {
    if (!onClose) return;

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        requestClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, requestClose]);

  // Load persisted state on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const data = JSON.parse(saved);
        if (data.answers && Object.keys(data.answers).length > 0) {
          setAnswers((prev) => ({ ...prev, ...data.answers }));
          if (typeof data.currentIndex === 'number') {
            setCurrentIndex(Math.min(Math.max(data.currentIndex, 0), config.questions.length - 1));
          }
          if (data.step === 'questions') setStep('questions');
        }
      }
    } catch {
      localStorage.removeItem(storageKey);
    }
  }, [storageKey, config.questions.length]);

  // Persist answers as user progresses
  useEffect(() => {
    if (step === 'questions') {
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          configId: config.id,
          configName: config.name,
          answers,
          currentIndex,
          step,
          startedAt: answers.startedAt || new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
        })
      );
    }
  }, [answers, currentIndex, step, storageKey, config.id, config.name]);

  const clearStorage = useCallback(() => {
    localStorage.removeItem(storageKey);
  }, [storageKey]);

  const questions = config.questions;
  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const progress = totalQuestions > 0 ? ((currentIndex + 1) / totalQuestions) * 100 : 0;

  // Auto-focus input when question changes
  useEffect(() => {
    if (autoFocus && step === 'questions' && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [autoFocus, currentIndex, step]);

  const getAnswerValue = useCallback(
    (q: Question): unknown => {
      const val = answers[q.id];
      if (val !== undefined) return val;
      if (q.type === 'multipleChoiceMulti') return [];
      if (q.type === 'rating') return null;
      if (q.type === 'date') return '';
      if (q.type === 'branchSelect') return null;
      return '';
    },
    [answers]
  );

  const isCurrentAnswerValid = useCallback((showError = false): boolean => {
    if (!currentQuestion) return false;
    if (currentQuestion.required === false) return true;

    const val = getAnswerValue(currentQuestion);

    switch (currentQuestion.type) {
      case 'multipleChoiceSingle':
      case 'branchSelect':
        return val !== null && val !== '';
      case 'multipleChoiceMulti':
        return Array.isArray(val) && val.length > 0;
      case 'rating':
        return typeof val === 'number' && val > 0;
      case 'openText':
      case 'date':
        if (typeof val !== 'string' || val.trim().length === 0) return false;
        if (currentQuestion.validation) {
          const regex = new RegExp(currentQuestion.validation.pattern);
          if (!regex.test(val.trim())) {
            if (showError) setValidationError(currentQuestion.validation.message);
            return false;
          }
        }
        return true;
      default:
        return true;
    }
  }, [currentQuestion, getAnswerValue]);

  const goNext = useCallback(() => {
    if (!isCurrentAnswerValid(true)) return;

    if (currentIndex < questions.length - 1) {
      setDirection(1);
      setCurrentIndex((i) => i + 1);
    } else {
      setIsSubmitting(true);
      clearStorage();
      onSubmit(answers, {
        surveyId: config.id,
        surveyName: config.name,
        submittedAt: new Date().toISOString(),
      });
      if (config.ending) setStep('ending');
      setIsSubmitting(false);
    }
  }, [currentIndex, questions.length, answers, onSubmit, config, clearStorage, isCurrentAnswerValid]);

  // Auto-advance for rating questions
  const currentAnswer = currentQuestion ? answers[currentQuestion.id] : undefined;
  useEffect(() => {
    if (!currentQuestion || currentQuestion.type !== 'rating' || step !== 'questions') return;
    if (typeof currentAnswer === 'number' && currentAnswer > 0) {
      const timestamp = lastAnswerTimestamp.current[currentQuestion.id];
      if (timestamp && Date.now() - timestamp < 2000) {
        const timer = setTimeout(() => goNext(), 300);
        return () => clearTimeout(timer);
      }
    }
  }, [currentAnswer, currentQuestion?.id, currentQuestion?.type, step, goNext]);

  const goBack = useCallback(() => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex((i) => i - 1);
    }
  }, [currentIndex]);

  const startSurvey = useCallback(() => {
    setDirection(1);
    setStep('questions');
  }, []);

  const setAnswer = useCallback((questionId: string, value: unknown) => {
    lastAnswerTimestamp.current[questionId] = Date.now();
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    setValidationError(null);
  }, []);

  // ─── Render Question ───────────────────────────────────────────────

  const renderQuestionInput = (q: Question) => {
    const val = getAnswerValue(q);

    switch (q.type) {
      case 'multipleChoiceSingle':
        return (
          <ChoiceSingleQuestion
            choices={q.choices || []}
            value={val as string | null}
            onChange={(v) => setAnswer(q.id, v)}
          />
        );
      case 'multipleChoiceMulti':
        return (
          <ChoiceMultiQuestion
            choices={q.choices || []}
            value={val as string[]}
            onChange={(v) => setAnswer(q.id, v)}
          />
        );
      case 'rating':
        return (
          <RatingQuestion
            value={val as number | null}
            onChange={(v) => setAnswer(q.id, v)}
            range={q.range}
            scale={q.scale}
            lowerLabel={q.lowerLabel}
            upperLabel={q.upperLabel}
          />
        );
      case 'openText':
        return (
          <OpenTextQuestion
            value={val as string}
            onChange={(v) => setAnswer(q.id, v)}
            placeholder={q.placeholder}
            longAnswer={q.longAnswer}
            inputType={q.inputType}
            inputRef={inputRef}
          />
        );
      case 'date':
        return (
          <DateQuestion
            value={val as string}
            onChange={(v) => setAnswer(q.id, v)}
            placeholder={q.placeholder}
            birthday={q.birthday}
            recent={q.recent}
          />
        );
      case 'branchSelect':
        return (
          <BranchSelectQuestion
            value={val as 'cima' | 'o' | null}
            onChange={(v) => setAnswer(q.id, v)}
          />
        );
      default:
        return null;
    }
  };

  // ─── Welcome Screen ────────────────────────────────────────────────

  if (step === 'welcome' && hasWelcome && config.welcomeCard) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE_OUT }}
        className="w-full max-w-[560px] mx-auto"
      >
        <div className="relative bg-dark-primary border border-cream/10 p-8 md:p-10 shadow-2xl">
          {onClose && (
            <button
              type="button"
              onClick={requestClose}
              aria-label="Cerrar encuesta"
              className="absolute right-3 top-3 w-8 h-8 flex items-center justify-center text-cream-muted hover:text-gold transition-colors"
            >
              <X size={16} />
            </button>
          )}
          {config.welcomeCard.imageUrl && (
            <div className="mb-6 flex justify-center">
              <img
                src={config.welcomeCard.imageUrl}
                alt="Welcome"
                className="h-16 object-contain"
              />
            </div>
          )}
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={16} className="text-gold" />
            <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-gold">
              soul:23 Experience
            </span>
          </div>
          <h2
            className="font-serif font-semibold text-cream leading-snug text-2xl md:text-3xl mb-3"
            dangerouslySetInnerHTML={{ __html: config.welcomeCard.headline }}
          />
          {config.welcomeCard.subheader && (
            <div
              className="text-cream-muted text-[14px] leading-relaxed mb-8"
              dangerouslySetInnerHTML={{ __html: config.welcomeCard.subheader }}
            />
          )}
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={startSurvey}
            className="w-full flex items-center justify-center gap-2 py-4 bg-gold text-dark-primary font-mono text-[11px] uppercase tracking-[0.15em] hover:bg-gold-light transition-colors"
          >
            {config.welcomeCard.buttonLabel || 'Comenzar'}
            <ArrowRight size={14} />
          </motion.button>
        </div>
      </motion.div>
    );
  }

  // ─── Ending Screen ─────────────────────────────────────────────────

  if (step === 'ending' && config.ending) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: EASE_OUT }}
        className="w-full max-w-[560px] mx-auto"
      >
        <div className="relative bg-dark-primary border border-cream/10 p-8 md:p-10 shadow-2xl text-center">
          {onClose && (
            <button
              type="button"
              onClick={requestClose}
              aria-label="Cerrar encuesta"
              className="absolute right-3 top-3 w-8 h-8 flex items-center justify-center text-cream-muted hover:text-gold transition-colors"
            >
              <X size={16} />
            </button>
          )}
          {config.ending.imageUrl && (
            <div className="mb-6 flex justify-center">
              <img src={config.ending.imageUrl} alt="Thank you" className="h-20 object-contain" />
            </div>
          )}
          <div className="w-14 h-14 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-5">
            <Check size={28} className="text-gold" />
          </div>
          <h2
            className="font-serif font-semibold text-cream leading-snug text-2xl md:text-3xl mb-3"
            dangerouslySetInnerHTML={{ __html: config.ending.headline }}
          />
          {config.ending.subheader && (
            <div
              className="text-cream-muted text-[14px] leading-relaxed mb-8"
              dangerouslySetInnerHTML={{ __html: config.ending.subheader }}
            />
          )}
          {config.ending.buttonLink && (
            <a
              href={config.ending.buttonLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 py-3 px-6 bg-gold text-dark-primary font-mono text-[11px] uppercase tracking-[0.15em] hover:bg-gold-light transition-colors"
            >
              {config.ending.buttonLabel || 'Continuar'}
            </a>
          )}
          {onClose && (
            <button
              onClick={requestClose}
              className="mt-4 text-cream-muted text-[12px] hover:text-gold transition-colors font-mono uppercase tracking-wide"
            >
              Cerrar
            </button>
          )}
        </div>
      </motion.div>
    );
  }

  // ─── Questions Screen ──────────────────────────────────────────────

  if (!currentQuestion) {
    return (
      <div className="w-full max-w-[560px] mx-auto bg-dark-primary border border-cream/10 p-6 text-center">
        <p className="text-cream-muted text-sm mb-4">
          La encuesta tenia progreso guardado de una version anterior.
        </p>
        <button
          type="button"
          onClick={() => {
            clearStorage();
            setAnswers({ ...prefillData });
            setCurrentIndex(0);
            setStep(hasWelcome ? 'welcome' : 'questions');
          }}
          className="px-5 py-2.5 bg-gold text-dark-primary font-mono text-[11px] uppercase tracking-[0.12em]"
        >
          Reiniciar encuesta
        </button>
      </div>
    );
  }

  const answerValid = isCurrentAnswerValid();

  return (
    <div className="w-full max-w-[560px] mx-auto">
      {/* Progress bar */}
      {config.showProgress !== false && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-cream-muted/50">
              {currentIndex + 1} / {totalQuestions}
            </span>
            <span className="font-mono text-[10px] text-cream-muted/30">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="h-[2px] bg-cream/10 overflow-hidden">
            <motion.div
              className="h-full bg-gold"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: EASE_OUT }}
            />
          </div>
        </div>
      )}

      {/* Question card */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentQuestion.id}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.35, ease: EASE_OUT }}
          className="relative bg-dark-primary border border-cream/10 p-6 md:p-8 shadow-2xl"
        >
          {onClose && (
            <button
              type="button"
              onClick={requestClose}
              aria-label="Cerrar encuesta"
              className="absolute right-3 top-3 w-8 h-8 flex items-center justify-center text-cream-muted hover:text-gold transition-colors"
            >
              <X size={16} />
            </button>
          )}
          {/* Question header */}
          <div className="mb-6">
            <h3
              className="font-serif font-semibold text-cream leading-snug text-xl md:text-2xl mb-2"
              dangerouslySetInnerHTML={{ __html: currentQuestion.headline }}
            />
            {currentQuestion.subheader && (
              <div
                className="text-cream-muted text-[13px] leading-relaxed"
                dangerouslySetInnerHTML={{ __html: currentQuestion.subheader }}
              />
            )}
            {currentQuestion.required && (
              <span className="inline-block mt-2 font-mono text-[9px] uppercase tracking-[0.15em] text-gold/70">
                Requerido
              </span>
            )}
          </div>

          {/* Question input */}
          <div className="mb-8">
            {renderQuestionInput(currentQuestion)}
            {validationError && (
              <p className="mt-2 text-[12px] text-red-400 flex items-center gap-1.5">
                <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-red-400/20 text-red-400 text-[10px] font-bold">!</span>
                {validationError}
              </p>
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-4 border-t border-cream/10">
            <button
              onClick={goBack}
              disabled={currentIndex === 0}
              type="button"
              className="flex items-center gap-1.5 text-cream-muted text-[12px] font-mono uppercase tracking-wide hover:text-cream disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowLeft size={14} />
              {currentQuestion.backButtonLabel || 'Atrás'}
            </button>

            <motion.button
              whileHover={answerValid ? { scale: 1.02 } : {}}
              whileTap={answerValid ? { scale: 0.98 } : {}}
              onClick={goNext}
              disabled={!answerValid || isSubmitting}
              type="button"
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.12em] transition-colors",
                answerValid && !isSubmitting
                  ? "bg-gold text-dark-primary hover:bg-gold-light"
                  : "bg-cream/[0.06] text-cream-muted/30 cursor-not-allowed"
              )}
            >
              {isSubmitting ? (
                <Loader2 size={14} className="animate-spin" />
              ) : currentIndex === totalQuestions - 1 ? (
                <>
                  <Send size={13} />
                  {currentQuestion.buttonLabel || 'Enviar'}
                </>
              ) : (
                <>
                  {currentQuestion.buttonLabel || 'Siguiente'}
                  <ArrowRight size={14} />
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
