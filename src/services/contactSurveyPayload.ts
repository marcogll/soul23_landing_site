import type { Choice } from '@/components/SurveyEngine';

export const CONTACT_SECTOR_CHOICES: Choice[] = [
  { id: 'belleza', label: 'Belleza / Spa / Salón' },
  { id: 'salud', label: 'Salud / Clínica / Consultorio' },
  { id: 'legal', label: 'Despacho legal / Abogados' },
  { id: 'restaurante', label: 'Restaurante / Alimentos' },
  { id: 'retail', label: 'Retail / Ecommerce' },
  { id: 'educacion', label: 'Educación / Cursos' },
  { id: 'rrhh', label: 'Recursos humanos / Reclutamiento' },
  { id: 'industrial', label: 'Industria / Manufactura' },
  { id: 'servicios', label: 'Servicios profesionales' },
  { id: 'otro', label: 'Otro' },
];

export const CONTACT_SURVEY_TYPE_CHOICES: Choice[] = [
  { id: 'satisfaccion_cliente', label: 'Satisfacción de clientes' },
  { id: 'post_servicio', label: 'Post-servicio / post-compra' },
  { id: 'nps', label: 'NPS / recomendación' },
  { id: 'calidad', label: 'Calidad de producto o servicio' },
  { id: 'empleados', label: 'Empleados / clima laboral' },
  { id: 'eventos', label: 'Eventos / RSVP' },
  { id: 'leads', label: 'Captura y calificación de leads' },
  { id: 'diagnostico', label: 'Diagnóstico interno de procesos' },
  { id: 'legal_case_intake', label: 'Intake de clientes legales' },
  { id: 'rrhh_reclutamiento', label: 'Reclutamiento / experiencia de candidato' },
  { id: 'rrhh_clima', label: 'Clima laboral / pulso de equipo' },
];

export const CONTACT_CHANNEL_CHOICES: Choice[] = [
  { id: 'whatsapp', label: 'WhatsApp' },
  { id: 'qr', label: 'QR en sucursal / evento' },
  { id: 'email', label: 'Email' },
  { id: 'web', label: 'Sitio web / landing' },
  { id: 'pos', label: 'Después de venta o pago' },
  { id: 'staff', label: 'Captura interna por staff' },
];

export const CONTACT_AUDIENCE_CHOICES: Choice[] = [
  { id: 'clientes_actuales', label: 'Clientes actuales' },
  { id: 'clientes_nuevos', label: 'Clientes nuevos' },
  { id: 'leads', label: 'Leads / prospectos' },
  { id: 'pacientes', label: 'Pacientes' },
  { id: 'alumnos', label: 'Alumnos' },
  { id: 'empleados', label: 'Empleados / staff' },
  { id: 'asistentes_evento', label: 'Asistentes a evento' },
  { id: 'proveedores', label: 'Proveedores / aliados' },
  { id: 'candidatos', label: 'Candidatos / postulantes' },
  { id: 'clientes_legales', label: 'Clientes de despacho' },
];

export const CONTACT_MOMENT_CHOICES: Choice[] = [
  { id: 'antes_servicio', label: 'Antes del servicio o cita' },
  { id: 'despues_servicio', label: 'Después del servicio o compra' },
  { id: 'cancelacion', label: 'Cuando cancelan o no llegan' },
  { id: 'post_evento', label: 'Después de un evento' },
  { id: 'cada_mes', label: 'Cada mes / seguimiento periódico' },
  { id: 'cuando_hay_alerta', label: 'Cuando haya una respuesta crítica' },
  { id: 'en_sucursal', label: 'En sucursal / punto de atención' },
  { id: 'en_web', label: 'En sitio web o landing' },
  { id: 'post_consulta', label: 'Después de consulta o asesoría' },
  { id: 'post_entrevista', label: 'Después de entrevista o proceso de selección' },
];

export const CONTACT_AUTOMATION_CHOICES: Choice[] = [
  { id: 'email_cliente', label: 'Enviar correo con resumen al cliente' },
  { id: 'alertas', label: 'Alertar si hay una respuesta crítica' },
  { id: 'dashboard', label: 'Actualizar dashboard' },
  { id: 'whatsapp_followup', label: 'Dar seguimiento por WhatsApp' },
  { id: 'crm', label: 'Guardar lead o cliente en CRM' },
  { id: 'reporte_semanal', label: 'Enviar reporte semanal interno' },
  { id: 'agenda', label: 'Agenda automática de citas' },
  { id: 'ventas', label: 'Control de ventas y pagos' },
  { id: 'bots', label: 'Bot de WhatsApp para clientes' },
  { id: 'personal', label: 'Control de personal' },
  { id: 'todo', label: 'Quiero que mi negocio trabaje solo' },
  { id: 'reportes_encuestas', label: 'Reportes automáticos de encuestas' },
];

export const CONTACT_URGENCY_CHOICES: Choice[] = [
  { id: 'ya', label: 'Lo antes posible' },
  { id: '30_dias', label: 'Este mes' },
  { id: 'trimestre', label: 'Este trimestre' },
  { id: 'explorando', label: 'Estoy explorando' },
];

export const CONTACT_BUDGET_CHOICES: Choice[] = [
  { id: '<10k', label: 'Menos de $10,000 MXN' },
  { id: '10-25k', label: '$10,000 - $25,000 MXN' },
  { id: '25-50k', label: '$25,000 - $50,000 MXN' },
  { id: '>50k', label: 'Más de $50,000 MXN' },
  { id: 'no_se', label: 'No sé, quiero opciones' },
];

const questionLabels: Record<string, string> = {
  nombre: 'Nombre',
  negocio: 'Negocio',
  email: 'Email',
  telefono: 'WhatsApp',
  tipo_negocio: 'Giro del negocio',
  tipo_encuesta: 'Tipo de encuesta',
  canal_encuesta: 'Canales de captura',
  necesidad: 'Automatización posterior',
  urgencia: 'Urgencia',
  presupuesto: 'Presupuesto',
  descripcion: 'Objetivo de aprendizaje',
  audiencia_encuesta: 'Quién responderá',
  momento_encuesta: 'Momento de captura',
  decision_principal: 'Decisión principal',
  pregunta_clave: 'Pregunta clave',
  alerta_critica: 'Señal crítica',
  seguimiento_cliente: 'Seguimiento esperado',
};

const choiceGroups: Record<string, Choice[]> = {
  tipo_negocio: CONTACT_SECTOR_CHOICES,
  tipo_encuesta: CONTACT_SURVEY_TYPE_CHOICES,
  canal_encuesta: CONTACT_CHANNEL_CHOICES,
  audiencia_encuesta: CONTACT_AUDIENCE_CHOICES,
  momento_encuesta: CONTACT_MOMENT_CHOICES,
  necesidad: CONTACT_AUTOMATION_CHOICES,
  urgencia: CONTACT_URGENCY_CHOICES,
  presupuesto: CONTACT_BUDGET_CHOICES,
};

function asArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  if (typeof value === 'string' && value.trim()) return [value.trim()];
  return [];
}

function choiceLabel(questionId: string, id: string): string {
  return choiceGroups[questionId]?.find((choice) => choice.id === id)?.label || id;
}

function labelAnswer(questionId: string, value: unknown): unknown {
  if (Array.isArray(value)) return value.map((item) => choiceLabel(questionId, String(item)));
  if (typeof value === 'string') return choiceLabel(questionId, value);
  return value;
}

function labelList(questionId: string, value: unknown): string[] {
  return asArray(value).map((id) => choiceLabel(questionId, id));
}

const surveyBlueprints: Record<string, { goal: string; metrics: string[]; suggestedQuestions: string[]; redFlags: string[] }> = {
  satisfaccion_cliente: {
    goal: 'medir satisfacción real y detectar fricciones por etapa de atención',
    metrics: ['CSAT general', 'satisfacción por etapa', 'motivos de fricción', 'probabilidad de recompra'],
    suggestedQuestions: ['¿Qué tan satisfecho quedaste?', '¿Qué parte del servicio podríamos mejorar?', '¿Volverías a comprar o reservar?'],
    redFlags: ['calificación baja', 'mención de mala atención', 'cliente que no volvería'],
  },
  post_servicio: {
    goal: 'entender qué pasó justo después de una compra, cita o servicio',
    metrics: ['experiencia post-servicio', 'tiempo de atención', 'cumplimiento de expectativa', 'siguiente intención'],
    suggestedQuestions: ['¿Se cumplió lo que esperabas?', '¿Qué tan fácil fue el proceso?', '¿Qué harías diferente la próxima vez?'],
    redFlags: ['queja operativa', 'proceso confuso', 'promesa incumplida'],
  },
  nps: {
    goal: 'medir recomendación y separar promotores, pasivos y detractores',
    metrics: ['NPS', 'motivo de recomendación', 'segmento detractor', 'oportunidad de testimonio'],
    suggestedQuestions: ['¿Qué tan probable es que nos recomiendes?', '¿Cuál es la razón principal de tu calificación?', '¿Podemos contactarte para seguimiento?'],
    redFlags: ['detractor', 'comentario negativo', 'cliente importante en riesgo'],
  },
  calidad: {
    goal: 'detectar fallas repetidas en producto, servicio o entrega',
    metrics: ['calidad percibida', 'fallas frecuentes', 'impacto por categoría', 'severidad del problema'],
    suggestedQuestions: ['¿Qué tan buena fue la calidad?', '¿Hubo algo defectuoso o incompleto?', '¿Qué impacto tuvo en tu experiencia?'],
    redFlags: ['defecto', 'falla repetida', 'servicio incompleto'],
  },
  empleados: {
    goal: 'medir clima, desempeño o consistencia del equipo',
    metrics: ['clima laboral', 'carga operativa', 'liderazgo', 'cumplimiento de procesos'],
    suggestedQuestions: ['¿Qué tan clara es tu carga de trabajo?', '¿Qué proceso te quita más tiempo?', '¿Dónde falta apoyo del equipo?'],
    redFlags: ['riesgo de rotación', 'sobrecarga', 'conflicto interno'],
  },
  eventos: {
    goal: 'confirmar asistencia, preferencias y aprendizaje post-evento',
    metrics: ['asistencia', 'interés por tema', 'preferencias logísticas', 'seguimiento comercial'],
    suggestedQuestions: ['¿Asistirás?', '¿Qué tema te interesa más?', '¿Quieres recibir seguimiento después del evento?'],
    redFlags: ['cancelación masiva', 'baja intención', 'necesidad especial'],
  },
  leads: {
    goal: 'calificar prospectos y priorizar seguimiento comercial',
    metrics: ['intención de compra', 'urgencia', 'presupuesto', 'tipo de necesidad'],
    suggestedQuestions: ['¿Qué problema quieres resolver?', '¿Cuándo quieres empezar?', '¿Qué presupuesto o rango tienes en mente?'],
    redFlags: ['lead urgente', 'alto presupuesto', 'necesidad crítica'],
  },
  diagnostico: {
    goal: 'mapear procesos manuales y priorizar automatizaciones',
    metrics: ['tiempo perdido', 'proceso más manual', 'impacto operativo', 'prioridad de automatización'],
    suggestedQuestions: ['¿Qué proceso haces más a mano?', '¿Cuánto tiempo te quita por semana?', '¿Qué pasaría si eso se automatiza?'],
    redFlags: ['dependencia del dueño', 'datos dispersos', 'operación sin control'],
  },
  legal_case_intake: {
    goal: 'calificar clientes legales y ordenar información antes de una consulta',
    metrics: ['tipo de caso', 'urgencia', 'documentos disponibles', 'riesgo de seguimiento'],
    suggestedQuestions: ['¿Qué tipo de asunto necesitas revisar?', '¿Qué tan urgente es?', '¿Ya cuentas con documentos o evidencia?'],
    redFlags: ['caso urgente', 'fecha límite cercana', 'documentación incompleta'],
  },
  rrhh_reclutamiento: {
    goal: 'medir experiencia de candidato y priorizar vacantes o perfiles',
    metrics: ['etapa del proceso', 'calidad del candidato', 'tiempo de respuesta', 'satisfacción del candidato'],
    suggestedQuestions: ['¿Para qué vacante aplicas?', '¿Qué tan claro fue el proceso?', '¿Qué tan pronto puedes iniciar?'],
    redFlags: ['candidato prioritario', 'abandono del proceso', 'respuesta negativa sobre la experiencia'],
  },
  rrhh_clima: {
    goal: 'detectar clima, carga laboral y riesgos internos antes de que escalen',
    metrics: ['clima por equipo', 'carga laboral', 'riesgo de rotación', 'bloqueos operativos'],
    suggestedQuestions: ['¿Cómo estuvo tu carga esta semana?', '¿Qué te bloqueó?', '¿Qué apoyo necesitas de liderazgo?'],
    redFlags: ['riesgo de rotación', 'sobrecarga', 'conflicto con liderazgo'],
  },
};

function buildSelectedBlueprints(answers: Record<string, unknown>) {
  return asArray(answers.tipo_encuesta).map((id) => {
    const blueprint = surveyBlueprints[id];
    return {
      id,
      label: choiceLabel('tipo_encuesta', id),
      goal: blueprint?.goal || 'levantar información accionable para el negocio',
      metrics: blueprint?.metrics || [],
      suggested_questions: blueprint?.suggestedQuestions || [],
      red_flags: blueprint?.redFlags || [],
    };
  });
}

function buildSurveyPlan(answers: Record<string, unknown>) {
  const surveyTypes = asArray(answers.tipo_encuesta);
  const channels = asArray(answers.canal_encuesta);
  const needs = asArray(answers.necesidad);
  const has = (id: string) => surveyTypes.includes(id) || needs.includes(id);

  return {
    report_title: `Diagnóstico de encuestas para ${String(answers.negocio || 'el negocio')}`,
    primary_survey_types: labelList('tipo_encuesta', answers.tipo_encuesta),
    audience: labelList('audiencia_encuesta', answers.audiencia_encuesta),
    capture_moments: labelList('momento_encuesta', answers.momento_encuesta),
    recommended_channels: labelList('canal_encuesta', answers.canal_encuesta),
    automation_after_response: labelList('necesidad', answers.necesidad),
    selected_blueprints: buildSelectedBlueprints(answers),
    personalization_inputs: {
      decision_principal: answers.decision_principal || '',
      pregunta_clave: answers.pregunta_clave || '',
      alerta_critica: answers.alerta_critica || '',
      seguimiento_cliente: answers.seguimiento_cliente || '',
      descripcion: answers.descripcion || '',
    },
    suggested_email_sections: [
      'Resumen de lo que el cliente quiere aprender',
      'Tipo de encuesta recomendado',
      'Preguntas sugeridas según el caso',
      'Señales críticas que deben detonar alertas',
      'Canales de captura sugeridos',
      'Automatizaciones posteriores',
      'Siguiente llamada o propuesta',
    ],
    suggested_metrics: [
      has('nps') && 'NPS y probabilidad de recomendación',
      has('satisfaccion_cliente') && 'Satisfacción por etapa del servicio',
      has('post_servicio') && 'Motivos de compra, recompra y fricción',
      has('calidad') && 'Calidad percibida y fallas frecuentes',
      has('empleados') && 'Clima, desempeño y consistencia operativa',
      has('eventos') && 'Asistencia, preferencias y seguimiento',
      has('leads') && 'Calificación, intención y origen del lead',
      has('diagnostico') && 'Procesos manuales, carga operativa y prioridades',
      has('legal_case_intake') && 'Tipo de caso, urgencia legal y documentos disponibles',
      has('rrhh_reclutamiento') && 'Experiencia de candidato, etapa de proceso y prioridad de vacante',
      has('rrhh_clima') && 'Clima laboral, carga, bloqueos y riesgo de rotación',
    ].filter(Boolean),
    n8n_routing: {
      send_client_email: true,
      send_internal_email: true,
      create_lead: true,
      create_alerts: needs.includes('alertas'),
      update_dashboard: needs.includes('dashboard'),
      whatsapp_followup: channels.includes('whatsapp') || needs.includes('whatsapp_followup'),
    },
  };
}

export function enrichContactAnswers(answers: Record<string, unknown>) {
  const readable_answers = Object.entries(answers).reduce<Record<string, unknown>>((acc, [key, value]) => {
    acc[key] = {
      question: questionLabels[key] || key,
      value,
      label: labelAnswer(key, value),
    };
    return acc;
  }, {});

  return {
    ...answers,
    tipo_negocio_label: labelAnswer('tipo_negocio', answers.tipo_negocio),
    tipo_encuesta_labels: labelList('tipo_encuesta', answers.tipo_encuesta),
    canal_encuesta_labels: labelList('canal_encuesta', answers.canal_encuesta),
    audiencia_encuesta_labels: labelList('audiencia_encuesta', answers.audiencia_encuesta),
    momento_encuesta_labels: labelList('momento_encuesta', answers.momento_encuesta),
    necesidad_labels: labelList('necesidad', answers.necesidad),
    urgencia_label: labelAnswer('urgencia', answers.urgencia),
    presupuesto_label: labelAnswer('presupuesto', answers.presupuesto),
    selected_survey_types: asArray(answers.tipo_encuesta).map((id) => ({
      id,
      label: choiceLabel('tipo_encuesta', id),
      blueprint: surveyBlueprints[id] || null,
    })),
    readable_answers,
    survey_plan: buildSurveyPlan(answers),
  };
}

export function getContactTags(answers: Record<string, unknown>) {
  return [
    answers.tipo_negocio && `sector:${answers.tipo_negocio}`,
    ...asArray(answers.tipo_encuesta).map((value) => `survey:${value}`),
    ...asArray(answers.canal_encuesta).map((value) => `channel:${value}`),
    ...asArray(answers.necesidad).map((value) => `automation:${value}`),
  ].filter(Boolean) as string[];
}
