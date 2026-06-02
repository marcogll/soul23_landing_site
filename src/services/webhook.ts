const WEBHOOK_URL = import.meta.env.VITE_S23_WEBHOOK_URL || '';
const QUEUE_KEY = 's23-webhook-queue';
const MAX_RETRIES = 3;
const RETRY_DELAYS = [2000, 5000, 10000];

export interface SurveyPayload {
  type:
    | 'service_feedback'
    | 'contact_inquiry'
    | 'client_onboarding'
    | 'event_rsvp'
    | 'staff_evaluation'
    | 'project_feedback'
    | 'survey_abandoned';
  form_type?: string;
  status?: string;
  answers?: Record<string, unknown>;
  ratings_summary?: { category: string; score: number; max: number }[];
  open_text_responses?: {
    question_id: string;
    text: string;
    sentiment: 'positive' | 'neutral' | 'negative';
    tags: string[];
  }[];
  email_report?: {
    enabled: boolean;
    recipient_email?: string;
    subject: string;
    headline: string;
    summary: string;
    insights: string[];
    next_steps: string[];
    recommended_services?: string[];
    cta?: {
      label: string;
      url: string;
    };
    templates?: {
      client: string;
      internal: string;
    };
  };
  ai_instructions?: {
    system_message: string;
    expected_output: string[];
    output_contract: Record<string, string>;
    tone: string;
    language: string;
    notes: string[];
  };
  llm_config?: {
    provider: 'gpt_nano' | 'openrouter_free';
    model: string;
    max_tokens: number;
    temperature: number;
    fallback_provider: 'gpt_nano' | 'openrouter_free';
  };
  metadata: {
    submittedAt: string;
    userAgent: string;
    source: string;
    language: string;
    phoneNumber?: string;
    survey_name?: string;
    [key: string]: unknown;
  };
}

interface QueuedPayload {
  id: string;
  payload: SurveyPayload;
  attempts: number;
  lastAttempt: string;
  error?: string;
}

function getQueue(): QueuedPayload[] {
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveQueue(queue: QueuedPayload[]): void {
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function resolvePayloadLabel(payload: SurveyPayload): string {
  return String(payload.form_type || payload.metadata.survey_name || payload.type);
}

function resolveTemplatePath(type: SurveyPayload['type'], formType?: string): { client: string; internal: string } {
  const base = 'email-templates';
  
  if (formType === 'talia_chatbot_funnel' || formType === 'chatbot_funnel') {
    return { client: `${base}/contact/client.html`, internal: `${base}/contact/internal.html` };
  }
  
  if (formType === 'homepage_contact_mini_survey') {
    return { client: `${base}/contact/client.html`, internal: `${base}/contact/internal.html` };
  }
  
  if (formType === 'contact_survey_full') {
    return { client: `${base}/contact/client.html`, internal: `${base}/contact/internal.html` };
  }
  
  switch (type) {
    case 'contact_inquiry':
      return { client: `${base}/contact/client.html`, internal: `${base}/contact/internal.html` };
    case 'client_onboarding':
      return { client: `${base}/client-onboarding/client.html`, internal: `${base}/client-onboarding/internal.html` };
    case 'service_feedback':
      return { client: `${base}/service-feedback/client.html`, internal: `${base}/service-feedback/internal.html` };
    case 'event_rsvp':
      return { client: `${base}/event-rsvp/client.html`, internal: `${base}/event-rsvp/internal.html` };
    case 'staff_evaluation':
      return { client: `${base}/staff-evaluation/client.html`, internal: `${base}/staff-evaluation/internal.html` };
    case 'project_feedback':
      return { client: `${base}/project-feedback/client.html`, internal: `${base}/project-feedback/internal.html` };
    case 'survey_abandoned':
      return { client: `${base}/survey-abandoned/client.html`, internal: `${base}/survey-abandoned/internal.html` };
    default:
      return { client: `${base}/contact/client.html`, internal: `${base}/contact/internal.html` };
  }
}

function resolveLlmConfig(type: SurveyPayload['type'], formType?: string): SurveyPayload['llm_config'] {
  const useOpenRouter = formType === 'talia_chatbot_funnel' || type === 'event_rsvp';
  
  if (useOpenRouter) {
    return {
      provider: 'openrouter_free',
      model: 'google/gemini-2.0-flash-exp:free',
      max_tokens: 1024,
      temperature: 0.3,
      fallback_provider: 'gpt_nano',
    };
  }
  
  return {
    provider: 'gpt_nano',
    model: 'gpt-4o-mini',
    max_tokens: 1024,
    temperature: 0.3,
    fallback_provider: 'openrouter_free',
  };
}

function buildDefaultAiInstructions(payload: SurveyPayload): SurveyPayload['ai_instructions'] {
  const payloadLabel = resolvePayloadLabel(payload);
  const recipient = payload.email_report?.recipient_email || 'sin correo de cliente';
  const templates = payload.email_report?.templates;

  return {
    system_message:
      'Eres Talia, asistente operativa de soul:23. Recibes un payload JSON de una forma, encuesta o chatbot del sitio. Tu trabajo es convertirlo en seguimiento util, humano y accionable para el cliente y para el equipo interno. Usa espanol de Mexico, voz elegante, directa y cercana. No inventes datos: cuando falte informacion, dilo como pendiente. Personaliza el diagnostico con answers, ratings_summary, open_text_responses, metadata, form_type y email_report. Evita respuestas genericas tipo cookie cutter.',
    expected_output: [
      'Identificar el caso con payload.type=' + payload.type + ' y form_type=' + (payload.form_type || 'sin form_type') + '.',
      'Generar email para cliente si email_report.enabled=true y recipient_email existe (' + recipient + ').',
      'Generar email interno para soul:23 con resumen ejecutivo, urgencia, oportunidad comercial, riesgos y siguiente accion.',
      'Extraer tags operativos como sector, tipo de encuesta, necesidad, canal, urgencia, plan/servicio y prioridad.',
      'Detectar alertas por scores bajos, sentimiento negativo, urgencia alta, abandono o falta de datos clave.',
      'Proponer siguiente paso concreto: llamada, demo, propuesta, mejora de encuesta, flujo n8n, dashboard o automatizacion.',
    ],
    output_contract: {
      client_email_html: templates?.client
        ? 'Renderizar o generar HTML usando la plantilla ' + templates.client + ' como base visual.'
        : 'Opcional: generar HTML si existe correo de cliente.',
      internal_email_html: templates?.internal
        ? 'Renderizar o generar HTML usando la plantilla ' + templates.internal + ' como base visual.'
        : 'Generar resumen interno en HTML con voz de soul:23.',
      crm_summary: 'Resumen de 3 a 6 lineas para CRM/Sheet/Notion.',
      tags: 'Array de etiquetas normalizadas para n8n.',
      priority: 'low | medium | high, justificado por urgencia, dolor y datos del payload.',
      follow_up: 'Accion recomendada, responsable sugerido y plazo.',
      alerts: 'Array de alertas; vacio si no hay riesgos detectados.',
    },
    tone:
      'soul:23: sobrio, premium, claro, sin exagerar. Talia habla como asistente experta, no como newsletter masiva.',
    language: 'es-MX',
    notes: [
      'Caso recibido: ' + payloadLabel + '.',
      'Para cliente: explicar lo que aprendimos de su negocio y que podria automatizarse o medirse mejor.',
      'Para interno: incluir datos crudos importantes, huecos de informacion y recomendacion comercial.',
      'Mantener links, telefonos y correos exactamente como vienen en el payload.',
    ],
  };
}

function enrichPayload(payload: SurveyPayload): SurveyPayload {
  const enriched: SurveyPayload = {
    ...payload,
    ai_instructions: payload.ai_instructions || buildDefaultAiInstructions(payload),
    llm_config: payload.llm_config || resolveLlmConfig(payload.type, payload.form_type),
  };

  if (enriched.email_report && !enriched.email_report.templates) {
    enriched.email_report = {
      ...enriched.email_report,
      templates: resolveTemplatePath(payload.type, payload.form_type),
    };
  }

  return enriched;
}

async function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

async function doFetch(payload: SurveyPayload): Promise<{ success: boolean; error?: string }> {
  console.log('[soul:23 Webhook] Payload:', payload);
  if (!WEBHOOK_URL) {
    console.warn('[soul:23 Webhook] No webhook URL configured.');
    return { success: true };
  }
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error('HTTP ' + response.status);
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[soul:23 Webhook] Failed:', message);
    return { success: false, error: message };
  }
}

export async function submitToWebhook(
  payload: SurveyPayload
): Promise<{ success: boolean; error?: string; queued?: boolean }> {
  const enrichedPayload = enrichPayload(payload);
  const result = await doFetch(enrichedPayload);
  if (result.success) return { success: true };

  for (let i = 0; i < MAX_RETRIES; i++) {
    console.log('[soul:23 Webhook] Retry ' + (i + 1) + '/' + MAX_RETRIES + ' in ' + RETRY_DELAYS[i] + 'ms');
    await sleep(RETRY_DELAYS[i]);
    const retryResult = await doFetch(enrichedPayload);
    if (retryResult.success) {
      console.log('[soul:23 Webhook] Retry succeeded.');
      return { success: true };
    }
  }

  const queue = getQueue();
  queue.push({
    id: generateId(),
    payload: enrichedPayload,
    attempts: MAX_RETRIES + 1,
    lastAttempt: new Date().toISOString(),
    error: result.error,
  });
  saveQueue(queue);
  console.warn('[soul:23 Webhook] Queued for later delivery.');
  return { success: false, error: result.error, queued: true };
}

export async function processWebhookQueue(): Promise<{ sent: number; failed: number }> {
  const queue = getQueue();
  if (queue.length === 0) return { sent: 0, failed: 0 };

  console.log('[soul:23 Webhook] Processing ' + queue.length + ' queued payloads...');
  const remaining: QueuedPayload[] = [];
  let sent = 0;
  let failed = 0;

  for (const item of queue) {
    const ageDays = (Date.now() - new Date(item.lastAttempt).getTime()) / (1000 * 60 * 60 * 24);
    if (ageDays > 7) {
      failed++;
      continue;
    }
    const result = await doFetch(item.payload);
    if (result.success) {
      sent++;
    } else {
      item.attempts++;
      item.lastAttempt = new Date().toISOString();
      item.error = result.error;
      remaining.push(item);
      failed++;
    }
    await sleep(500);
  }

  saveQueue(remaining);
  return { sent, failed };
}

export function getQueueCount(): number {
  return getQueue().length;
}

export function clearQueue(): void {
  localStorage.removeItem(QUEUE_KEY);
}
