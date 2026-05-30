export interface ContactReportInput {
  nombre?: unknown;
  negocio?: unknown;
  email?: unknown;
  tipo_negocio?: unknown;
  tipoNegocio?: unknown;
  tipo_encuesta?: unknown;
  canal_encuesta?: unknown;
  necesidad?: unknown;
  presupuesto?: unknown;
  urgencia?: unknown;
  descripcion?: unknown;
}

export type SurveyEmailKind =
  | 'contact'
  | 'client-onboarding'
  | 'service-feedback'
  | 'event-rsvp'
  | 'staff-evaluation'
  | 'project-feedback'
  | 'survey-abandoned';

const surveyEmailMeta: Record<SurveyEmailKind, { subject: string; headline: string; folder: string; summary: string }> = {
  contact: {
    subject: 'Talia de soul:23 recibio tu diagnostico',
    headline: 'Talia ya preparo tu primer mapa de encuesta',
    folder: 'contact',
    summary: 'Recibimos el contexto inicial y lo convertimos en una lectura breve para decidir que medir, por que canal y que automatizar despues.',
  },
  'client-onboarding': {
    subject: 'Talia recibio tu onboarding de proyecto',
    headline: 'Tu proyecto ya tiene contexto inicial',
    folder: 'client-onboarding',
    summary: 'Con tus respuestas podemos ordenar alcance, canales, prioridades y siguientes pasos antes de la llamada de trabajo.',
  },
  'service-feedback': {
    subject: 'Talia registro tu experiencia',
    headline: 'Gracias por contarnos como fue tu servicio',
    folder: 'service-feedback',
    summary: 'Tu respuesta ayuda a detectar friccion, buenas practicas y oportunidades de seguimiento sin esperar a una revision manual.',
  },
  'event-rsvp': {
    subject: 'Talia confirmo tu registro',
    headline: 'Tu RSVP quedo registrado',
    folder: 'event-rsvp',
    summary: 'Guardamos tu confirmacion y preferencias para que el equipo pueda preparar asistencia, experiencia y seguimiento.',
  },
  'staff-evaluation': {
    subject: 'Talia recibio la evaluacion interna',
    headline: 'Evaluacion registrada para revision interna',
    folder: 'staff-evaluation',
    summary: 'La informacion se estructura para detectar desempeno, consistencia, riesgos y puntos de entrenamiento.',
  },
  'project-feedback': {
    subject: 'Talia recibio tu feedback de proyecto',
    headline: 'Tu feedback quedo registrado',
    folder: 'project-feedback',
    summary: 'Tus respuestas ayudan a cerrar aprendizajes, medir satisfaccion y priorizar mejoras para la siguiente iteracion.',
  },
  'survey-abandoned': {
    subject: 'Talia detecto una encuesta incompleta',
    headline: 'Encuesta incompleta registrada',
    folder: 'survey-abandoned',
    summary: 'El sistema guardo el avance disponible para recuperar contexto, friccion y posibles bloqueos del flujo.',
  },
};

function asText(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function asList(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  if (typeof value === 'string' && value.trim()) return [value.trim()];
  return [];
}

function labelList(items: string[]): string {
  if (items.length === 0) return 'por definir';
  if (items.length === 1) return items[0];
  return `${items.slice(0, -1).join(', ')} y ${items[items.length - 1]}`;
}

export function buildContactEmailReport(answers: ContactReportInput) {
  const businessName = asText(answers.negocio) || 'tu negocio';
  const sector = asText(answers.tipo_negocio) || asText(answers.tipoNegocio) || 'tu sector';
  const surveyTypes = asList(answers.tipo_encuesta);
  const channels = asList(answers.canal_encuesta);
  const needs = asList(answers.necesidad);
  const need = labelList(needs);
  const budget = asText(answers.presupuesto);
  const urgency = asText(answers.urgencia);
  const description = asText(answers.descripcion);
  const recipient = asText(answers.email);
  const recommendedServices = [
    surveyTypes.length > 0 && 'Diseño de encuesta a la medida por giro',
    channels.includes('whatsapp') && 'Automatización por WhatsApp',
    channels.includes('qr') && 'QR para sucursal, evento o punto de venta',
    (needs.includes('dashboard') || needs.includes('reportes_encuestas')) && 'Dashboard de resultados y alertas',
    needs.includes('alertas') && 'Alertas críticas por correo o WhatsApp',
    needs.includes('bots') && 'Bot conversacional conectado al flujo',
  ].filter(Boolean) as string[];

  return {
    enabled: Boolean(recipient),
    recipient_email: recipient || undefined,
    subject: `Lo que podemos medir para ${businessName}`,
    headline: `Primer diagnóstico para ${businessName}`,
    summary: `Con la información compartida, el foco inicial es diseñar encuestas para ${sector}, enfocadas en ${labelList(surveyTypes)} y distribuidas por ${labelList(channels)}.`,
    insights: [
      `Sector detectado: ${sector}. Esto define lenguaje, métricas y benchmarks del reporte.`,
      `Tipo de encuesta prioritaria: ${labelList(surveyTypes)}.`,
      `Canales sugeridos para captura: ${labelList(channels)}.`,
      needs.length ? `Automatización relacionada: ${need}.` : 'Automatización relacionada: pendiente de definir.',
      budget ? `Presupuesto declarado: ${budget}.` : 'Presupuesto declarado: pendiente de definir.',
      urgency ? `Urgencia del proyecto: ${urgency}.` : 'Urgencia del proyecto: pendiente de definir.',
      description ? `Objetivo declarado: ${description}.` : 'Objetivo declarado: pendiente de ampliar en la llamada.',
    ],
    next_steps: [
      'Definir las 5-8 preguntas mínimas para capturar información accionable.',
      'Conectar cada respuesta al webhook para guardar datos estructurados.',
      'Enviar un resumen automático por correo con hallazgos, alertas y siguientes acciones.',
      'Activar dashboard o reporte semanal cuando exista volumen suficiente de respuestas.',
    ],
    recommended_services: recommendedServices.length
      ? recommendedServices
      : ['Diagnóstico de encuestas y automatización inicial'],
    cta: {
      label: 'Agendar llamada para revisar el proyecto',
      url: 'https://calendly.com/alma_dev/30min',
    },
    templates: {
      client: 'email-templates/contact/client.html',
      internal: 'email-templates/contact/internal.html',
    },
  };
}

export function buildSurveyEmailReport(kind: SurveyEmailKind, answers: Record<string, unknown> = {}) {
  const meta = surveyEmailMeta[kind];
  const recipient = asText(answers.email) || asText(answers.correo) || undefined;
  const businessName = asText(answers.negocio) || asText(answers.empresa) || asText(answers.nombre) || 'el caso';

  return {
    enabled: Boolean(recipient),
    recipient_email: recipient,
    subject: meta.subject,
    headline: meta.headline,
    summary: meta.summary,
    insights: [
      `Caso: ${businessName}.`,
      'Talia estructura las respuestas para que el webhook pueda generar reporte, alerta o seguimiento.',
      'El equipo interno recibe una version operativa con prioridades y datos accionables.',
    ],
    next_steps: [
      'Validar los datos capturados.',
      'Revisar respuestas abiertas y calificaciones.',
      'Decidir si se envia seguimiento, alerta interna o propuesta de mejora.',
    ],
    recommended_services: [
      'Reporte automatico por correo',
      'Dashboard de seguimiento',
      'Alertas por WhatsApp o email',
    ],
    cta: {
      label: 'Agendar llamada con soul:23',
      url: 'https://calendly.com/alma_dev/30min',
    },
    templates: {
      client: `email-templates/${meta.folder}/client.html`,
      internal: `email-templates/${meta.folder}/internal.html`,
    },
  };
}
