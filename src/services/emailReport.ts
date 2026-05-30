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
      client: 'email-templates/contact-client-report.html',
      internal: 'email-templates/contact-internal-report.html',
    },
  };
}
