import { submitToWebhook } from './webhook';
import { buildSurveyEmailReport } from './emailReport';

const SURVEY_PREFIX = 's23-survey-';

interface StoredSurveyData {
  configId: string;
  configName: string;
  answers: Record<string, unknown>;
  startedAt: string;
  lastUpdated: string;
}

export function hasPartialSurveyData(): boolean {
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(SURVEY_PREFIX)) return true;
  }
  return false;
}

export async function submitSurveyOnExit(): Promise<boolean> {
  const surveys: StoredSurveyData[] = [];

  for (let i = localStorage.length - 1; i >= 0; i--) {
    const key = localStorage.key(i);
    if (!key?.startsWith(SURVEY_PREFIX)) continue;

    try {
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      const data = JSON.parse(raw) as StoredSurveyData;
      surveys.push(data);
      localStorage.removeItem(key);
    } catch {
      localStorage.removeItem(key);
    }
  }

  if (surveys.length === 0) return false;

  const mostRecent = surveys.sort(
    (a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
  )[0];

  const answeredCount = Object.keys(mostRecent.answers).filter((k) => {
    const v = mostRecent.answers[k];
    if (v === undefined || v === '' || v === null) return false;
    if (Array.isArray(v)) return v.length > 0;
    return true;
  }).length;

  try {
    const result = await submitToWebhook({
      type: 'survey_abandoned',
      answers: mostRecent.answers,
      email_report: buildSurveyEmailReport('survey-abandoned', mostRecent.answers),
      metadata: {
        submittedAt: new Date().toISOString(),
        userAgent: navigator.userAgent,
        source: mostRecent.configName || 'unknown_survey',
        survey_name: mostRecent.configName || 'Encuesta abandonada',
        language: navigator.language,
        surveyId: mostRecent.configId,
        startedAt: mostRecent.startedAt,
        answeredCount,
        reason: 'user_navigated_away',
      },
    });
    return result.success;
  } catch {
    return false;
  }
}
