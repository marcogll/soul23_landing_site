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
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
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
  const result = await doFetch(payload);
  if (result.success) return { success: true };

  for (let i = 0; i < MAX_RETRIES; i++) {
    console.log(`[soul:23 Webhook] Retry ${i + 1}/${MAX_RETRIES} in ${RETRY_DELAYS[i]}ms`);
    await sleep(RETRY_DELAYS[i]);
    const retryResult = await doFetch(payload);
    if (retryResult.success) {
      console.log('[soul:23 Webhook] Retry succeeded.');
      return { success: true };
    }
  }

  const queue = getQueue();
  queue.push({
    id: generateId(),
    payload,
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

  console.log(`[soul:23 Webhook] Processing ${queue.length} queued payloads...`);
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
