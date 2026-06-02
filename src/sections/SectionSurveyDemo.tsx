import { useRef, useLayoutEffect, useState, useEffect, useMemo, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  QrCode, Smartphone, Brain, AlertTriangle, Star, ThumbsUp, ThumbsDown, Meh,
  Send, Check, ChevronRight, RotateCcw, TrendingUp, MessageSquare, Eye,
  Zap, Database, BarChart3, ClipboardList, Users, CalendarCheck, UserCheck, BriefcaseBusiness, X
} from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

gsap.registerPlugin(ScrollTrigger)

type Phase = 'intro' | 'survey' | 'analyzing' | 'alert' | 'report'

interface SurveyQ {
  id: number
  textKey: string
  type: 'emoji' | 'options'
  optionKeys: string[]
  aiTags?: string[]
}

interface UseCase {
  id: string
  labelKey: string
  title: string
  reportFocus: string
  questions: SurveyQ[]
}

// ─── Traducciones del demo survey ───
const demoSurveyDict: Record<string, Record<string, string>> = {
  ES: {
    'demo.restaurante.label': 'Restaurante',
    'demo.restaurante.title': 'Post-consumo y reputación',
    'demo.restaurante.focus': 'detectar quejas, platillos fuertes y riesgo de mala reseña',
    'demo.restaurante.q1': '¿Cómo calificarías la calidad de la comida hoy?',
    'demo.restaurante.q1.o0': 'Muy buena',
    'demo.restaurante.q1.o1': 'Aceptable',
    'demo.restaurante.q1.o2': 'Mala',
    'demo.restaurante.q2': '¿El tiempo de espera fue adecuado?',
    'demo.restaurante.q2.o0': 'Sí, fue rápido',
    'demo.restaurante.q2.o1': 'Aceptable',
    'demo.restaurante.q2.o2': 'Muy largo',
    'demo.restaurante.q3': '¿Cómo fue la atención de tu mesero?',
    'demo.restaurante.q3.o0': 'Atento y amable',
    'demo.restaurante.q3.o1': 'Correcta',
    'demo.restaurante.q3.o2': 'Descuidada',
    'demo.restaurante.q4': '¿Te gustó el ambiente del lugar?',
    'demo.restaurante.q4.o0': 'Me encantó',
    'demo.restaurante.q4.o1': 'Está bien',
    'demo.restaurante.q4.o2': 'No me gustó',
    'demo.restaurante.q5': '¿Hubo algún problema durante tu visita?',
    'demo.restaurante.q5.o0': 'No, todo bien',
    'demo.restaurante.q5.o1': 'Algo menor',
    'demo.restaurante.q5.o2': 'Sí, grave',
    'demo.restaurante.q6': '¿Volverías a visitarnos?',
    'demo.restaurante.q6.o0': 'Sí, seguro',
    'demo.restaurante.q6.o1': 'Tal vez',
    'demo.restaurante.q6.o2': 'No',

    'demo.belleza.label': 'Belleza',
    'demo.belleza.title': 'Post-cita y recompra',
    'demo.belleza.focus': 'medir trato, resultado, puntualidad y siguiente cita',
    'demo.belleza.q1': '¿El resultado final cumplió tus expectativas?',
    'demo.belleza.q1.o0': 'Sí, superó',
    'demo.belleza.q1.o1': 'Cumplió',
    'demo.belleza.q1.o2': 'No cumplió',
    'demo.belleza.q2': '¿Cómo fue la atención de tu estilista?',
    'demo.belleza.q2.o0': 'Muy profesional',
    'demo.belleza.q2.o1': 'Adecuada',
    'demo.belleza.q2.o2': 'Podría mejorar',
    'demo.belleza.q3': '¿Te atendieron a la hora agendada?',
    'demo.belleza.q3.o0': 'Sí, puntual',
    'demo.belleza.q3.o1': 'Con poco retraso',
    'demo.belleza.q3.o2': 'Mucho retraso',
    'demo.belleza.q4': '¿El precio pagado se sintió justo?',
    'demo.belleza.q4.o0': 'Sí, vale la pena',
    'demo.belleza.q4.o1': 'Regular',
    'demo.belleza.q4.o2': 'Caro para lo que recibí',
    'demo.belleza.q5': '¿Volverías con el mismo estilista?',
    'demo.belleza.q5.o0': 'Sí, sin duda',
    'demo.belleza.q5.o1': 'Tal vez',
    'demo.belleza.q5.o2': 'No',
    'demo.belleza.q6': '¿Recomendarías este lugar a alguien?',
    'demo.belleza.q6.o0': 'Sí, con gusto',
    'demo.belleza.q6.o1': 'Solo si preguntan',
    'demo.belleza.q6.o2': 'No',

    'demo.clinica.label': 'Clínica',
    'demo.clinica.title': 'Experiencia de paciente',
    'demo.clinica.focus': 'separar calidad médica, espera, recepción y seguimiento',
    'demo.clinica.q1': '¿Cómo calificarías la atención del médico?',
    'demo.clinica.q1.o0': 'Excelente',
    'demo.clinica.q1.o1': 'Buena',
    'demo.clinica.q1.o2': 'Deficiente',
    'demo.clinica.q2': '¿El médico te explicó bien tu diagnóstico?',
    'demo.clinica.q2.o0': 'Claro y detallado',
    'demo.clinica.q2.o1': 'Más o menos',
    'demo.clinica.q2.o2': 'No entendí',
    'demo.clinica.q3': '¿Cuánto tiempo esperaste para ser atendido?',
    'demo.clinica.q3.o0': 'Menos de 15 min',
    'demo.clinica.q3.o1': '15-30 min',
    'demo.clinica.q3.o2': 'Más de 30 min',
    'demo.clinica.q4': '¿La recepción te atendió bien?',
    'demo.clinica.q4.o0': 'Muy bien',
    'demo.clinica.q4.o1': 'Regular',
    'demo.clinica.q4.o2': 'Mala',
    'demo.clinica.q5': '¿Te dieron indicaciones claras para el siguiente paso?',
    'demo.clinica.q5.o0': 'Sí, muy claras',
    'demo.clinica.q5.o1': 'Algo confusas',
    'demo.clinica.q5.o2': 'No me dieron',
    'demo.clinica.q6': '¿Recomendarías esta clínica?',
    'demo.clinica.q6.o0': 'Sí, confío',
    'demo.clinica.q6.o1': 'Tal vez',
    'demo.clinica.q6.o2': 'No',

    'demo.cursos.label': 'Cursos',
    'demo.cursos.title': 'Cursos y alumnos',
    'demo.cursos.focus': 'medir claridad, avance, dudas y potencial de recompra',
    'demo.cursos.q1': '¿El instructor explicó con claridad?',
    'demo.cursos.q1.o0': 'Muy claro',
    'demo.cursos.q1.o1': 'Algo confuso',
    'demo.cursos.q1.o2': 'No entendí',
    'demo.cursos.q2': '¿El contenido fue útil para tu trabajo o negocio?',
    'demo.cursos.q2.o0': 'Sí, muy útil',
    'demo.cursos.q2.o1': 'Algo útil',
    'demo.cursos.q2.o2': 'No me sirvió',
    'demo.cursos.q3': '¿La duración del curso se sintió adecuada?',
    'demo.cursos.q3.o0': 'Justa',
    'demo.cursos.q3.o1': 'Algo corto',
    'demo.cursos.q3.o2': 'Muy largo',
    'demo.cursos.q4': '¿Tuviste oportunidad de resolver dudas?',
    'demo.cursos.q4.o0': 'Sí, completamente',
    'demo.cursos.q4.o1': 'Parcialmente',
    'demo.cursos.q4.o2': 'No',
    'demo.cursos.q5': '¿Cómo calificarías los materiales del curso?',
    'demo.cursos.q5.o0': 'Muy buenos',
    'demo.cursos.q5.o1': 'Aceptables',
    'demo.cursos.q5.o2': 'Pobres',
    'demo.cursos.q6': '¿Te inscribirías a otro curso con nosotros?',
    'demo.cursos.q6.o0': 'Sí, quiero más',
    'demo.cursos.q6.o1': 'Tal vez',
    'demo.cursos.q6.o2': 'No',

    'demo.staff.label': 'Staff',
    'demo.staff.title': 'Clima y desempeño',
    'demo.staff.focus': 'identificar carga, bloqueos, liderazgo y entrenamiento',
    'demo.staff.q1': '¿Cómo describirías tu carga de trabajo esta semana?',
    'demo.staff.q1.o0': 'Manejable',
    'demo.staff.q1.o1': 'Alta pero sostenible',
    'demo.staff.q1.o2': 'Insostenible',
    'demo.staff.q2': '¿Tienes las herramientas y recursos para hacer tu trabajo?',
    'demo.staff.q2.o0': 'Sí, completas',
    'demo.staff.q2.o1': 'Me falta algo',
    'demo.staff.q2.o2': 'No, estoy limitado',
    'demo.staff.q3': '¿La comunicación con tu líder es efectiva?',
    'demo.staff.q3.o0': 'Sí, constante y clara',
    'demo.staff.q3.o1': 'Regular',
    'demo.staff.q3.o2': 'Mala o inexistente',
    'demo.staff.q4': '¿Sientes que tu trabajo es reconocido?',
    'demo.staff.q4.o0': 'Sí, siempre',
    'demo.staff.q4.o1': 'A veces',
    'demo.staff.q4.o2': 'Casi nunca',
    'demo.staff.q5': '¿Te capacitaron bien para tu rol?',
    'demo.staff.q5.o0': 'Sí, a fondo',
    'demo.staff.q5.o1': 'Básico',
    'demo.staff.q5.o2': 'No me capacitaron',
    'demo.staff.q6': '¿Recomendarías este lugar para trabajar?',
    'demo.staff.q6.o0': 'Sí, me gusta',
    'demo.staff.q6.o1': 'Tal vez',
    'demo.staff.q6.o2': 'No',

    'demo.legal.label': 'Despacho legal',
    'demo.legal.title': 'Intake y seguimiento legal',
    'demo.legal.focus': 'calificar asuntos, urgencia, documentos y siguiente acción del despacho',
    'demo.legal.q1': '¿Qué tan urgente es tu caso?',
    'demo.legal.q1.o0': 'Crítico, necesito actuar ya',
    'demo.legal.q1.o1': 'Importante, pero no urgente',
    'demo.legal.q1.o2': 'Puede esperar',
    'demo.legal.q2': '¿Qué rama legal necesitas?',
    'demo.legal.q2.o0': 'Civil',
    'demo.legal.q2.o1': 'Laboral',
    'demo.legal.q2.o2': 'Mercantil',
    'demo.legal.q2.o3': 'Familiar',
    'demo.legal.q2.o4': 'Otra',
    'demo.legal.q3': '¿Tienes los documentos necesarios reunidos?',
    'demo.legal.q3.o0': 'Sí, completos',
    'demo.legal.q3.o1': 'Parciales',
    'demo.legal.q3.o2': 'No aún',
    'demo.legal.q4': '¿Ya intentaste resolverlo por otros medios?',
    'demo.legal.q4.o0': 'Sí, sin éxito',
    'demo.legal.q4.o1': 'Solo consulté',
    'demo.legal.q4.o2': 'No, es la primera vez',
    'demo.legal.q5': '¿Cómo prefieres recibir actualizaciones?',
    'demo.legal.q5.o0': 'WhatsApp',
    'demo.legal.q5.o1': 'Correo',
    'demo.legal.q5.o2': 'Llamada',
    'demo.legal.q6': '¿Cuál es tu presupuesto estimado para este caso?',
    'demo.legal.q6.o0': 'Tengo presupuesto definido',
    'demo.legal.q6.o1': 'Necesito cotización',
    'demo.legal.q6.o2': 'Busco opciones económicas',

    'demo.rrhh.label': 'Recursos humanos',
    'demo.rrhh.title': 'Candidatos y clima laboral',
    'demo.rrhh.focus': 'medir experiencia de candidato, carga laboral, bloqueos y riesgo de rotación',
    'demo.rrhh.q1': '¿Cómo calificarías la experiencia de tu proceso de selección?',
    'demo.rrhh.q1.o0': 'Muy profesional',
    'demo.rrhh.q1.o1': 'Normal',
    'demo.rrhh.q1.o2': 'Confusa o lenta',
    'demo.rrhh.q2': '¿En qué etapa del proceso estás?',
    'demo.rrhh.q2.o0': 'Postulación enviada',
    'demo.rrhh.q2.o1': 'Entrevista realizada',
    'demo.rrhh.q2.o2': 'Esperando oferta',
    'demo.rrhh.q2.o3': 'Ya recibí oferta',
    'demo.rrhh.q3': '¿Te informaron claramente sobre el rol y beneficios?',
    'demo.rrhh.q3.o0': 'Sí, muy claros',
    'demo.rrhh.q3.o1': 'Algo vagos',
    'demo.rrhh.q3.o2': 'No me explicaron',
    'demo.rrhh.q4': '¿Cuánto tiempo esperaste respuesta después de aplicar?',
    'demo.rrhh.q4.o0': 'Menos de 3 días',
    'demo.rrhh.q4.o1': '1 semana',
    'demo.rrhh.q4.o2': 'Más de 1 semana',
    'demo.rrhh.q5': '¿La oferta salarial cubre tus expectativas?',
    'demo.rrhh.q5.o0': 'Sí, supera',
    'demo.rrhh.q5.o1': 'Cubre lo básico',
    'demo.rrhh.q5.o2': 'Está por debajo',
    'demo.rrhh.q6': '¿Aceptarías la oferta si llega esta semana?',
    'demo.rrhh.q6.o0': 'Sí, sin dudas',
    'demo.rrhh.q6.o1': 'Lo pensaría',
    'demo.rrhh.q6.o2': 'No',

    'demo.leads.label': 'Leads',
    'demo.leads.title': 'Calificación comercial',
    'demo.leads.focus': 'priorizar prospectos por necesidad, urgencia y canal',
    'demo.leads.q1': '¿Qué problema buscas resolver con un sistema?',
    'demo.leads.q1.o0': 'Automatizar agendas',
    'demo.leads.q1.o1': 'Controlar ventas',
    'demo.leads.q1.o2': 'Encuestas y feedback',
    'demo.leads.q1.o3': 'Dashboard/reportes',
    'demo.leads.q1.o4': 'No estoy seguro',
    'demo.leads.q2': '¿Qué tan urgente es implementar una solución?',
    'demo.leads.q2.o0': 'Lo necesito ya',
    'demo.leads.q2.o1': 'En 1-2 semanas',
    'demo.leads.q2.o2': 'Este mes',
    'demo.leads.q2.o3': 'Solo estoy explorando',
    'demo.leads.q3': '¿Actualmente usas algún sistema o todo es manual?',
    'demo.leads.q3.o0': 'Todo manual',
    'demo.leads.q3.o1': 'Uso herramientas básicas',
    'demo.leads.q3.o2': 'Tengo sistema pero no funciona bien',
    'demo.leads.q4': '¿Cuántas personas operan el negocio?',
    'demo.leads.q4.o0': 'Solo yo',
    'demo.leads.q4.o1': '2-5 personas',
    'demo.leads.q4.o2': '6-20 personas',
    'demo.leads.q4.o3': 'Más de 20',
    'demo.leads.q5': '¿Tienes presupuesto asignado para este proyecto?',
    'demo.leads.q5.o0': 'Sí, aprobado',
    'demo.leads.q5.o1': 'Estoy cotizando',
    'demo.leads.q5.o2': 'Aún no, necesito justificar',
    'demo.leads.q6': '¿Cuándo podrías empezar?',
    'demo.leads.q6.o0': 'Inmediatamente',
    'demo.leads.q6.o1': 'Esta semana',
    'demo.leads.q6.o2': 'Este mes',
    'demo.leads.q6.o3': 'No lo sé aún',
  },

  EN: {
    'demo.restaurante.label': 'Restaurant',
    'demo.restaurante.title': 'Post-dining reputation',
    'demo.restaurante.focus': 'detect complaints, strong dishes and bad review risk',
    'demo.restaurante.q1': 'How would you rate the food quality today?',
    'demo.restaurante.q1.o0': 'Very good',
    'demo.restaurante.q1.o1': 'Acceptable',
    'demo.restaurante.q1.o2': 'Bad',
    'demo.restaurante.q2': 'Was the wait time adequate?',
    'demo.restaurante.q2.o0': 'Yes, fast',
    'demo.restaurante.q2.o1': 'Acceptable',
    'demo.restaurante.q2.o2': 'Too long',
    'demo.restaurante.q3': 'How was your server\'s attention?',
    'demo.restaurante.q3.o0': 'Attentive and kind',
    'demo.restaurante.q3.o1': 'Correct',
    'demo.restaurante.q3.o2': 'Negligent',
    'demo.restaurante.q4': 'Did you like the atmosphere?',
    'demo.restaurante.q4.o0': 'Loved it',
    'demo.restaurante.q4.o1': 'It\'s okay',
    'demo.restaurante.q4.o2': 'Didn\'t like it',
    'demo.restaurante.q5': 'Was there any issue during your visit?',
    'demo.restaurante.q5.o0': 'No, all good',
    'demo.restaurante.q5.o1': 'Something minor',
    'demo.restaurante.q5.o2': 'Yes, serious',
    'demo.restaurante.q6': 'Would you come back?',
    'demo.restaurante.q6.o0': 'Yes, for sure',
    'demo.restaurante.q6.o1': 'Maybe',
    'demo.restaurante.q6.o2': 'No',

    'demo.belleza.label': 'Beauty',
    'demo.belleza.title': 'Post-appointment & repurchase',
    'demo.belleza.focus': 'measure treatment, result, punctuality and next appointment',
    'demo.belleza.q1': 'Did the final result meet your expectations?',
    'demo.belleza.q1.o0': 'Yes, exceeded',
    'demo.belleza.q1.o1': 'Met them',
    'demo.belleza.q1.o2': 'Did not meet',
    'demo.belleza.q2': 'How was your stylist\'s attention?',
    'demo.belleza.q2.o0': 'Very professional',
    'demo.belleza.q2.o1': 'Adequate',
    'demo.belleza.q2.o2': 'Could improve',
    'demo.belleza.q3': 'Were you seen on time?',
    'demo.belleza.q3.o0': 'Yes, punctual',
    'demo.belleza.q3.o1': 'A little late',
    'demo.belleza.q3.o2': 'Very late',
    'demo.belleza.q4': 'Did the price feel fair?',
    'demo.belleza.q4.o0': 'Yes, worth it',
    'demo.belleza.q4.o1': 'Average',
    'demo.belleza.q4.o2': 'Expensive for what I got',
    'demo.belleza.q5': 'Would you return to the same stylist?',
    'demo.belleza.q5.o0': 'Yes, definitely',
    'demo.belleza.q5.o1': 'Maybe',
    'demo.belleza.q5.o2': 'No',
    'demo.belleza.q6': 'Would you recommend this place?',
    'demo.belleza.q6.o0': 'Yes, gladly',
    'demo.belleza.q6.o1': 'Only if asked',
    'demo.belleza.q6.o2': 'No',

    'demo.clinica.label': 'Clinic',
    'demo.clinica.title': 'Patient experience',
    'demo.clinica.focus': 'separate medical quality, wait, reception and follow-up',
    'demo.clinica.q1': 'How would you rate the doctor\'s care?',
    'demo.clinica.q1.o0': 'Excellent',
    'demo.clinica.q1.o1': 'Good',
    'demo.clinica.q1.o2': 'Deficient',
    'demo.clinica.q2': 'Did the doctor explain your diagnosis well?',
    'demo.clinica.q2.o0': 'Clear and detailed',
    'demo.clinica.q2.o1': 'More or less',
    'demo.clinica.q2.o2': 'Didn\'t understand',
    'demo.clinica.q3': 'How long did you wait to be seen?',
    'demo.clinica.q3.o0': 'Less than 15 min',
    'demo.clinica.q3.o1': '15-30 min',
    'demo.clinica.q3.o2': 'More than 30 min',
    'demo.clinica.q4': 'Was reception helpful?',
    'demo.clinica.q4.o0': 'Very well',
    'demo.clinica.q4.o1': 'Average',
    'demo.clinica.q4.o2': 'Bad',
    'demo.clinica.q5': 'Were you given clear next steps?',
    'demo.clinica.q5.o0': 'Yes, very clear',
    'demo.clinica.q5.o1': 'Somewhat confusing',
    'demo.clinica.q5.o2': 'Didn\'t get any',
    'demo.clinica.q6': 'Would you recommend this clinic?',
    'demo.clinica.q6.o0': 'Yes, I trust it',
    'demo.clinica.q6.o1': 'Maybe',
    'demo.clinica.q6.o2': 'No',

    'demo.cursos.label': 'Courses',
    'demo.cursos.title': 'Courses & students',
    'demo.cursos.focus': 'measure clarity, progress, doubts and repurchase potential',
    'demo.cursos.q1': 'Did the instructor explain clearly?',
    'demo.cursos.q1.o0': 'Very clear',
    'demo.cursos.q1.o1': 'Somewhat confusing',
    'demo.cursos.q1.o2': 'Didn\'t understand',
    'demo.cursos.q2': 'Was the content useful for your work or business?',
    'demo.cursos.q2.o0': 'Yes, very useful',
    'demo.cursos.q2.o1': 'Somewhat useful',
    'demo.cursos.q2.o2': 'Didn\'t help me',
    'demo.cursos.q3': 'Did the course duration feel right?',
    'demo.cursos.q3.o0': 'Just right',
    'demo.cursos.q3.o1': 'A bit short',
    'demo.cursos.q3.o2': 'Too long',
    'demo.cursos.q4': 'Did you get to resolve doubts?',
    'demo.cursos.q4.o0': 'Yes, completely',
    'demo.cursos.q4.o1': 'Partially',
    'demo.cursos.q4.o2': 'No',
    'demo.cursos.q5': 'How would you rate the course materials?',
    'demo.cursos.q5.o0': 'Very good',
    'demo.cursos.q5.o1': 'Acceptable',
    'demo.cursos.q5.o2': 'Poor',
    'demo.cursos.q6': 'Would you enroll in another course with us?',
    'demo.cursos.q6.o0': 'Yes, want more',
    'demo.cursos.q6.o1': 'Maybe',
    'demo.cursos.q6.o2': 'No',

    'demo.staff.label': 'Staff',
    'demo.staff.title': 'Climate & performance',
    'demo.staff.focus': 'identify load, blockers, leadership and training',
    'demo.staff.q1': 'How would you describe your workload this week?',
    'demo.staff.q1.o0': 'Manageable',
    'demo.staff.q1.o1': 'High but sustainable',
    'demo.staff.q1.o2': 'Unsustainable',
    'demo.staff.q2': 'Do you have the tools and resources for your job?',
    'demo.staff.q2.o0': 'Yes, complete',
    'demo.staff.q2.o1': 'Missing something',
    'demo.staff.q2.o2': 'No, limited',
    'demo.staff.q3': 'Is communication with your leader effective?',
    'demo.staff.q3.o0': 'Yes, constant and clear',
    'demo.staff.q3.o1': 'Average',
    'demo.staff.q3.o2': 'Bad or nonexistent',
    'demo.staff.q4': 'Do you feel your work is recognized?',
    'demo.staff.q4.o0': 'Yes, always',
    'demo.staff.q4.o1': 'Sometimes',
    'demo.staff.q4.o2': 'Almost never',
    'demo.staff.q5': 'Were you trained well for your role?',
    'demo.staff.q5.o0': 'Yes, thoroughly',
    'demo.staff.q5.o1': 'Basic',
    'demo.staff.q5.o2': 'Wasn\'t trained',
    'demo.staff.q6': 'Would you recommend this place to work?',
    'demo.staff.q6.o0': 'Yes, I like it',
    'demo.staff.q6.o1': 'Maybe',
    'demo.staff.q6.o2': 'No',

    'demo.legal.label': 'Law firm',
    'demo.legal.title': 'Intake & legal follow-up',
    'demo.legal.focus': 'qualify matters, urgency, documents and next firm action',
    'demo.legal.q1': 'How urgent is your case?',
    'demo.legal.q1.o0': 'Critical, need to act now',
    'demo.legal.q1.o1': 'Important, not urgent',
    'demo.legal.q1.o2': 'Can wait',
    'demo.legal.q2': 'What legal area do you need?',
    'demo.legal.q2.o0': 'Civil',
    'demo.legal.q2.o1': 'Labor',
    'demo.legal.q2.o2': 'Commercial',
    'demo.legal.q2.o3': 'Family',
    'demo.legal.q2.o4': 'Other',
    'demo.legal.q3': 'Do you have the necessary documents gathered?',
    'demo.legal.q3.o0': 'Yes, complete',
    'demo.legal.q3.o1': 'Partial',
    'demo.legal.q3.o2': 'Not yet',
    'demo.legal.q4': 'Have you tried resolving it through other means?',
    'demo.legal.q4.o0': 'Yes, unsuccessfully',
    'demo.legal.q4.o1': 'Only consulted',
    'demo.legal.q4.o2': 'No, first time',
    'demo.legal.q5': 'How do you prefer updates?',
    'demo.legal.q5.o0': 'WhatsApp',
    'demo.legal.q5.o1': 'Email',
    'demo.legal.q5.o2': 'Call',
    'demo.legal.q6': 'What is your estimated budget for this case?',
    'demo.legal.q6.o0': 'Budget defined',
    'demo.legal.q6.o1': 'Need quote',
    'demo.legal.q6.o2': 'Looking for economical options',

    'demo.rrhh.label': 'HR',
    'demo.rrhh.title': 'Candidates & work climate',
    'demo.rrhh.focus': 'measure candidate experience, workload, blockers and turnover risk',
    'demo.rrhh.q1': 'How would you rate your selection process experience?',
    'demo.rrhh.q1.o0': 'Very professional',
    'demo.rrhh.q1.o1': 'Normal',
    'demo.rrhh.q1.o2': 'Confusing or slow',
    'demo.rrhh.q2': 'What stage are you at?',
    'demo.rrhh.q2.o0': 'Application sent',
    'demo.rrhh.q2.o1': 'Interview done',
    'demo.rrhh.q2.o2': 'Waiting for offer',
    'demo.rrhh.q2.o3': 'Already received offer',
    'demo.rrhh.q3': 'Were you clearly informed about the role and benefits?',
    'demo.rrhh.q3.o0': 'Yes, very clear',
    'demo.rrhh.q3.o1': 'Somewhat vague',
    'demo.rrhh.q3.o2': 'Didn\'t explain',
    'demo.rrhh.q4': 'How long did you wait for a response after applying?',
    'demo.rrhh.q4.o0': 'Less than 3 days',
    'demo.rrhh.q4.o1': '1 week',
    'demo.rrhh.q4.o2': 'More than 1 week',
    'demo.rrhh.q5': 'Does the salary offer meet your expectations?',
    'demo.rrhh.q5.o0': 'Yes, exceeds',
    'demo.rrhh.q5.o1': 'Covers basics',
    'demo.rrhh.q5.o2': 'Below expectations',
    'demo.rrhh.q6': 'Would you accept the offer if it comes this week?',
    'demo.rrhh.q6.o0': 'Yes, no doubt',
    'demo.rrhh.q6.o1': 'Would think about it',
    'demo.rrhh.q6.o2': 'No',

    'demo.leads.label': 'Leads',
    'demo.leads.title': 'Commercial qualification',
    'demo.leads.focus': 'prioritize prospects by need, urgency and channel',
    'demo.leads.q1': 'What problem do you want to solve with a system?',
    'demo.leads.q1.o0': 'Automate appointments',
    'demo.leads.q1.o1': 'Control sales',
    'demo.leads.q1.o2': 'Surveys & feedback',
    'demo.leads.q1.o3': 'Dashboards/reports',
    'demo.leads.q1.o4': 'Not sure',
    'demo.leads.q2': 'How urgent is implementing a solution?',
    'demo.leads.q2.o0': 'Need it now',
    'demo.leads.q2.o1': 'In 1-2 weeks',
    'demo.leads.q2.o2': 'This month',
    'demo.leads.q2.o3': 'Just exploring',
    'demo.leads.q3': 'Do you currently use any system or is everything manual?',
    'demo.leads.q3.o0': 'All manual',
    'demo.leads.q3.o1': 'Use basic tools',
    'demo.leads.q3.o2': 'Have system but it doesn\'t work well',
    'demo.leads.q4': 'How many people operate the business?',
    'demo.leads.q4.o0': 'Just me',
    'demo.leads.q4.o1': '2-5 people',
    'demo.leads.q4.o2': '6-20 people',
    'demo.leads.q4.o3': 'More than 20',
    'demo.leads.q5': 'Do you have a budget assigned for this project?',
    'demo.leads.q5.o0': 'Yes, approved',
    'demo.leads.q5.o1': 'Getting quotes',
    'demo.leads.q5.o2': 'Not yet, need to justify',
    'demo.leads.q6': 'When could you start?',
    'demo.leads.q6.o0': 'Immediately',
    'demo.leads.q6.o1': 'This week',
    'demo.leads.q6.o2': 'This month',
    'demo.leads.q6.o3': 'Don\'t know yet',
  },
}

// Fallback a ES si no existe traducción
function d(key: string, lang: string): string {
  const dict = demoSurveyDict[lang as keyof typeof demoSurveyDict] || demoSurveyDict.ES
  return dict[key] || demoSurveyDict.ES[key] || key
}

function getUseCases(lang: string): UseCase[] {
  const cases: { id: string; qCount: number; aiTags: string[][] }[] = [
    { id: 'restaurante', qCount: 6, aiTags: [['experiencia','cx','calidad'],['tiempo','cumplimiento'],['atención','servicio'],['ambiente','servicio'],['problema','queja'],['retención','nps']] },
    { id: 'belleza', qCount: 6, aiTags: [['resultado','satisfacción'],['atención','trato'],['puntualidad','agenda'],['precio','valor'],['recompra','retención'],['recomendación','nps']] },
    { id: 'clinica', qCount: 6, aiTags: [['atención','médico'],['comunicación','explicación'],['espera','tiempo'],['recepcion','administración'],['seguimiento','instrucciones'],['retención','nps']] },
    { id: 'cursos', qCount: 6, aiTags: [['instructor','claridad'],['utilidad','aplicación'],['duración','tiempo'],['dudas','soporte'],['materiales','calidad'],['recompra','retención']] },
    { id: 'staff', qCount: 6, aiTags: [['carga','bloqueos'],['herramientas','recursos'],['liderazgo','comunicación'],['reconocimiento','clima'],['capacitación','entrenamiento'],['recomendación','retención']] },
    { id: 'legal', qCount: 6, aiTags: [['urgencia','legal'],['tipo_caso'], ['documentos','preparación'],['historial','antecedentes'],['seguimiento','comunicación'],['presupuesto','viabilidad']] },
    { id: 'rrhh', qCount: 6, aiTags: [['candidato','experiencia'],['etapa','avance'],['comunicación','transparencia'],['tiempo','proceso'],['salario','expectativas'],['retención','decisión']] },
    { id: 'leads', qCount: 6, aiTags: [['necesidad','problema'],['urgencia','lead'],['contexto','madurez'],['tamaño','escala'],['presupuesto','viabilidad'],['prioridad','inicio']] },
  ]

  return cases.map(c => {
    const questions: SurveyQ[] = []
    for (let i = 1; i <= c.qCount; i++) {
      const optionCount = c.id === 'legal' && i === 2 ? 5 : c.id === 'leads' && i <= 6 ? (i === 1 || i === 2 || i === 3 || i === 4 || i === 5 ? [3,3,3,3,3,4][i-1] : 4) : c.id === 'rrhh' && i === 2 ? 4 : 3
      const optionKeys: string[] = []
      for (let o = 0; o < optionCount; o++) {
        optionKeys.push(`demo.${c.id}.q${i}.o${o}`)
      }
      questions.push({
        id: i,
        textKey: `demo.${c.id}.q${i}`,
        type: 'options',
        optionKeys,
        aiTags: c.aiTags[i - 1],
      })
    }
    return {
      id: c.id,
      labelKey: `demo.${c.id}.label`,
      title: d(`demo.${c.id}.title`, lang),
      reportFocus: d(`demo.${c.id}.focus`, lang),
      questions,
    }
  })
}

interface SectionSurveyDemoProps {
  showLiveForms?: boolean
}

export default function SectionSurveyDemo({ showLiveForms = true }: SectionSurveyDemoProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const { t, lang } = useLanguage()

  const useCases = useMemo(() => getUseCases(lang), [lang])

  const aiCapabilities = [
    { icon: Brain, title: t('sd.ai1.titulo'), desc: t('sd.ai1.desc') },
    { icon: MessageSquare, title: t('sd.ai2.titulo'), desc: t('sd.ai2.desc') },
    { icon: TrendingUp, title: t('sd.ai3.titulo'), desc: t('sd.ai3.desc') },
    { icon: AlertTriangle, title: t('sd.ai4.titulo'), desc: t('sd.ai4.desc') },
  ]

  const dataFlowSteps = [
    { icon: QrCode, label: t('sd.flow1'), desc: t('sd.flow1.desc') },
    { icon: Smartphone, label: t('sd.flow2'), desc: t('sd.flow2.desc') },
    { icon: Brain, label: t('sd.flow3'), desc: t('sd.flow3.desc') },
    { icon: Database, label: t('sd.flow4'), desc: t('sd.flow4.desc') },
    { icon: BarChart3, label: t('sd.flow5'), desc: t('sd.flow5.desc') },
  ]

  const liveSurveyForms = [
    { href: '/contact-survey', icon: ClipboardList, label: t('sd.liveform.diagnostico.label'), title: t('sd.liveform.diagnostico.title'), desc: t('sd.liveform.diagnostico.desc'), type: 'contact_inquiry' },
    { href: '/survey-service', icon: Star, label: t('sd.liveform.clientes.label'), title: t('sd.liveform.clientes.title'), desc: t('sd.liveform.clientes.desc'), type: 'service_feedback' },
    { href: '/onboarding', icon: BriefcaseBusiness, label: t('sd.liveform.proyecto.label'), title: t('sd.liveform.proyecto.title'), desc: t('sd.liveform.proyecto.desc'), type: 'client_onboarding' },
    { href: '/rsvp', icon: CalendarCheck, label: t('sd.liveform.eventos.label'), title: t('sd.liveform.eventos.title'), desc: t('sd.liveform.eventos.desc'), type: 'event_rsvp' },
    { href: '/evaluate', icon: UserCheck, label: t('sd.liveform.staff.label'), title: t('sd.liveform.staff.title'), desc: t('sd.liveform.staff.desc'), type: 'staff_evaluation' },
    { href: '/project-feedback', icon: Users, label: t('sd.liveform.cierre.label'), title: t('sd.liveform.cierre.title'), desc: t('sd.liveform.cierre.desc'), type: 'project_feedback' },
  ]

  const [phase, setPhase] = useState<Phase>('intro')
  const [currentQ, setCurrentQ] = useState(0)
  // Guardamos índice de respuesta, no texto. Así se traduce dinámicamente.
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [showPulse, setShowPulse] = useState(false)
  const [aiTags, setAiTags] = useState<string[]>([])
  const [typingText, setTypingText] = useState('')
  const [demoStarted, setDemoStarted] = useState(false)
  const [selectedUseCase, setSelectedUseCase] = useState(useCases[0].id)
  const [selectedLiveForm, setSelectedLiveForm] = useState<typeof liveSurveyForms[number] | null>(null)

  const activeUseCase = useCases.find((item) => item.id === selectedUseCase) || useCases[0]
  const surveyQuestions = activeUseCase.questions

  // ─── Cálculo dinámico de score ───
  const computeMetrics = useCallback(() => {
    const scores = Object.entries(answers).map(([qId, ansIdx]) => {
      const q = surveyQuestions.find(q => q.id === Number(qId))
      if (!q) return 1
      const totalOpts = q.optionKeys.length
      // Mapear índice a score 0-2 (2 = bueno, 0 = malo)
      if (totalOpts <= 3) {
        // 0=bueno, 1=neutral, 2=malo
        return ansIdx === 0 ? 2 : ansIdx === 1 ? 1 : 0
      } else {
        // Más opciones: primeras = bueno, últimas = malo
        if (ansIdx <= Math.floor(totalOpts / 3)) return 2
        if (ansIdx >= Math.ceil((2 * totalOpts) / 3)) return 0
        return 1
      }
    })
    const avg = scores.length > 0 ? scores.reduce((a: number, b: number) => a + b, 0) / scores.length : 1
    const negativeCount = scores.filter(s => s === 0).length
    const positiveCount = scores.filter(s => s === 2).length

    let sentiment: 'positive' | 'neutral' | 'negative' = 'neutral'
    if (negativeCount > 0 && positiveCount === 0) sentiment = 'negative'
    else if (avg >= 1.5 && negativeCount === 0) sentiment = 'positive'
    else if (negativeCount > 0 && positiveCount > 0) sentiment = 'neutral'
    else if (avg < 1) sentiment = 'negative'

    // Estrellas 1-5 basado en avg 0-2
    const starScore = Math.max(1, Math.min(5, Math.round((avg / 2) * 5)))

    // Alertas = respuestas negativas
    const alerts = negativeCount

    // Prioridad
    const priority = negativeCount >= 2 || avg < 0.8 ? 'high' : negativeCount === 1 || avg < 1.3 ? 'medium' : 'low'

    return { sentiment, starScore, alerts, priority, avg, negativeCount, positiveCount }
  }, [answers, surveyQuestions])

  const metrics = useMemo(() => computeMetrics(), [computeMetrics])

  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const ctx = gsap.context(() => {
      section.querySelectorAll('.reveal').forEach((el, i) => {
        gsap.fromTo(el, { y: 15, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.5, delay: i * 0.08, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' }
        })
      })
    }, section)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (phase === 'alert') {
      const interval = setInterval(() => setShowPulse(p => !p), 800)
      return () => clearInterval(interval)
    }
  }, [phase])

  // AI typing effect
  useEffect(() => {
    if (phase === 'analyzing') {
      const texts = [
        t('sd.typing.1'),
        t('sd.typing.2'),
        t('sd.typing.3'),
        t('sd.typing.4'),
        t('sd.typing.5'),
      ]
      let idx = 0
      const interval = setInterval(() => {
        if (idx < texts.length) {
          setTypingText(texts[idx])
          idx++
        }
      }, 600)
      return () => clearInterval(interval)
    }
  }, [phase, t])

  const handleAnswer = (answerIdx: number) => {
    const q = surveyQuestions[currentQ]
    setAnswers(prev => ({ ...prev, [q.id]: answerIdx }))

    const newTags = [...aiTags, ...(q.aiTags || [])]
    setAiTags(newTags)

    if (currentQ < surveyQuestions.length - 1) {
      setTimeout(() => setCurrentQ(prev => prev + 1), 300)
    } else {
      setTimeout(() => setPhase('analyzing'), 400)
      setTimeout(() => setPhase('alert'), 3000)
    }
  }

  const reset = () => {
    setPhase('intro')
    setCurrentQ(0)
    setAnswers({})
    setAiTags([])
    setTypingText('')
    setDemoStarted(false)
  }

  const changeUseCase = (id: string) => {
    setSelectedUseCase(id)
    setPhase('intro')
    setCurrentQ(0)
    setAnswers({})
    setAiTags([])
    setTypingText('')
    setDemoStarted(false)
  }

  const startDemo = () => {
    setDemoStarted(true)
    setPhase('survey')
  }

  // ─── Render estrellas dinámicas ───
  const renderStars = (count: number, size: 'sm' | 'xs' = 'sm') => {
    const cls = size === 'sm' ? 'w-3 h-3' : 'w-2.5 h-2.5'
    return (
      <div className="flex gap-1">
        {Array.from({ length: 5 }, (_, i) => (
          <Star key={i} className={`${cls} ${i < count ? 'text-gold' : 'text-cream/10'}`} fill={i < count ? 'currentColor' : 'none'} />
        ))}
      </div>
    )
  }

  const renderPhase = () => {
    switch (phase) {
      case 'intro':
        return (
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-gold/10 flex items-center justify-center">
              <Eye className="w-8 h-8 text-gold" strokeWidth={1.5} />
            </div>
            <h4 className="font-serif font-semibold text-cream text-lg mb-3">{t('sd.demo.intro')}</h4>
            <p className="text-cream-muted text-[13px] mb-6 max-w-xs mx-auto">
              {t('sd.demo.intro.desc')}
            </p>
            <div className="grid grid-cols-2 gap-2 mb-6 text-left">
              {useCases.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => changeUseCase(item.id)}
                  className={`border px-3 py-2 text-[11px] transition-colors ${selectedUseCase === item.id ? 'border-gold bg-gold/10 text-cream' : 'border-cream/10 bg-cream/[0.02] text-cream-muted hover:border-gold/40'}`}
                >
                  <span className="font-mono uppercase tracking-[0.12em]">{d(item.labelKey, lang)}</span>
                </button>
              ))}
            </div>
            <div className="mb-6 border border-cream/10 bg-cream/[0.03] p-4 text-left">
              <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-gold mb-2">{activeUseCase.title}</p>
              <p className="text-[12px] text-cream-muted leading-relaxed">{t('sd.demo.report.focus')} {activeUseCase.reportFocus}.</p>
            </div>
            <button
              type="button"
              onClick={startDemo}
              className="w-full py-3 bg-gold text-dark-primary font-mono text-[11px] uppercase tracking-[0.14em] hover:bg-gold-light transition-colors"
            >
              {t('sd.demo.btn')}
            </button>
          </div>
        )

      case 'survey':
        return (
          <div className="max-w-xs mx-auto">
            <div className="flex items-center gap-2 mb-4">
              {surveyQuestions.map((_, i) => (
                <div key={i} className={`h-1 flex-1 transition-colors ${i <= currentQ ? 'bg-gold' : 'bg-cream/20'}`} />
              ))}
            </div>
            <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-cream-muted/50 mb-4">
              {d(activeUseCase.labelKey, lang)} · {t('sd.demo.survey.question')} {currentQ + 1} {t('sd.demo.survey.of')} {surveyQuestions.length}
            </p>
            <h4 className="font-serif font-semibold text-cream text-lg mb-6">
              {d(surveyQuestions[currentQ].textKey, lang)}
            </h4>

            {surveyQuestions[currentQ].type === 'emoji' ? (
              <div className="flex justify-center gap-4">
                {[
                  { icon: ThumbsUp, label: t('sd.demo.survey.excellent'), color: 'text-green-400' },
                  { icon: Meh, label: t('sd.demo.survey.regular'), color: 'text-amber-400' },
                  { icon: ThumbsDown, label: t('sd.demo.survey.bad'), color: 'text-red-400' },
                ].map(({ icon: Icon, label, color }, idx) => (
                  <button
                    key={label}
                    onClick={() => handleAnswer(idx)}
                    className="flex flex-col items-center gap-2 p-4 bg-cream/[0.03] border border-cream/10 hover:border-gold/50 transition-colors"
                  >
                    <Icon className={`w-7 h-7 ${color}`} strokeWidth={1.5} />
                    <span className="text-[10px] text-cream-muted/50">{label}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {surveyQuestions[currentQ].optionKeys.map((optKey, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    className="w-full text-left px-4 py-3 bg-cream/[0.03] border border-cream/10 text-sm text-cream-muted hover:border-gold/50 hover:text-cream transition-colors flex items-center justify-between"
                  >
                    {d(optKey, lang)}
                    <ChevronRight className="w-3 h-3 text-cream-muted/30" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )

      case 'analyzing':
        return (
          <div className="text-center py-6">
            <div className="w-16 h-16 mx-auto mb-6 relative">
              <Brain className="w-10 h-10 text-gold mx-auto" strokeWidth={1} />
              <div className="absolute inset-0 border border-gold/30 rounded-full animate-ping" />
            </div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-gold mb-3">{t('sd.demo.analyzing')}</p>
            <p className="text-[13px] text-cream-muted/70 mb-4 h-5">{typingText}</p>
            <div className="flex justify-center gap-1">
              {[0,1,2,3,4].map(i => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-gold animate-bounce" style={{ animationDelay: `${i * 100}ms` }} />
              ))}
            </div>
          </div>
        )

      case 'alert':
        return (
          <div className="text-center">
            <div className={`max-w-xs mx-auto bg-cream/[0.03] border p-4 mb-6 text-left transition-all duration-500 ${showPulse && metrics.sentiment === 'negative' ? 'border-red-400/60 shadow-lg shadow-red-400/10' : metrics.sentiment === 'positive' ? 'border-green-400/40' : 'border-cream/10'}`}>
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${metrics.sentiment === 'negative' ? 'bg-red-400/20' : metrics.sentiment === 'positive' ? 'bg-green-400/20' : 'bg-amber-400/20'}`}>
                  {metrics.sentiment === 'negative' ? <AlertTriangle className="w-4 h-4 text-red-400" strokeWidth={1.5} /> : metrics.sentiment === 'positive' ? <Check className="w-4 h-4 text-green-400" strokeWidth={1.5} /> : <Meh className="w-4 h-4 text-amber-400" strokeWidth={1.5} />}
                </div>
                <div className="flex-1">
                  <p className={`font-mono text-[9px] uppercase tracking-[0.14em] mb-1 ${metrics.sentiment === 'negative' ? 'text-red-400' : metrics.sentiment === 'positive' ? 'text-green-400' : 'text-amber-400'}`}>
                    {t('sd.demo.alert.label')}
                  </p>
                  <p className="text-xs text-cream mb-1">
                    {metrics.sentiment === 'negative' ? t('sd.demo.alert.title')
                      : metrics.sentiment === 'positive' ? t('sd.demo.alert.msg.positive')
                      : t('sd.demo.alert.msg.neutral')}
                  </p>
                  <p className="text-[10px] text-cream-muted/50 italic">
                    "{metrics.sentiment === 'negative' ? t('sd.demo.alert.msg.negative') : metrics.sentiment === 'positive' ? t('sd.demo.alert.msg.positive') : t('sd.demo.alert.msg.neutral')}"
                  </p>
                  <div className="mt-2">
                    {renderStars(metrics.starScore)}
                  </div>
                </div>
                <span className="font-mono text-[8px] text-cream-muted/30">{t('sd.demo.alert.now')}</span>
              </div>
            </div>

            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-gold mb-2">{t('sd.demo.alert.info')}</p>
            <p className="text-[13px] text-cream-muted/50 mb-6">{t('sd.demo.alert.sub')}</p>

            <button
              onClick={() => setPhase('report')}
              className="pill-accent inline-flex items-center gap-2"
            >
              {t('sd.demo.alert.btn')} <Send className="w-3 h-3" />
            </button>
          </div>
        )

      case 'report':
        return (
          <div className="text-center">
            <div className="max-w-sm mx-auto bg-dark-primary border border-cream/10 overflow-hidden text-left mb-6">
              {/* Email header */}
              <div className="bg-cream/[0.03] border-b border-cream/10 px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gold/15 flex items-center justify-center">
                    <Brain className="w-3 h-3 text-gold" />
                  </div>
                  <div>
                    <p className="text-[10px] text-cream font-medium">{t('sd.demo.report.card')}</p>
                    <p className="text-[8px] text-cream-muted/40">{t('sd.demo.report.sub')}</p>
                  </div>
                </div>
              </div>
              {/* Email body */}
              <div className="p-5">
                <h4 className="font-serif font-semibold text-cream text-lg mb-4">{t('sd.demo.report.title')}</h4>
                <p className="text-[11px] text-cream-muted/60 leading-relaxed mb-4">
                  {t('sd.demo.report.case')} {activeUseCase.title}. {t('sd.demo.report.seeks')} {activeUseCase.reportFocus}.
                </p>
                <div className="grid grid-cols-3 gap-3 mb-5">
                  <div className="text-center p-2 bg-cream/[0.03]">
                    <p className="font-serif text-xl text-gold">
                      {metrics.priority === 'high' ? t('sd.demo.report.priority.high') : metrics.priority === 'medium' ? t('sd.demo.report.priority.medium') : t('sd.demo.report.priority.medium')}
                    </p>
                    <p className="text-[8px] text-cream-muted/40 uppercase tracking-wider">{t('sd.demo.report.priority')}</p>
                  </div>
                  <div className="text-center p-2 bg-cream/[0.03]">
                    <p className="font-serif text-xl text-cream">{Object.keys(answers).length}</p>
                    <p className="text-[8px] text-cream-muted/40 uppercase tracking-wider">{t('sd.demo.report.responses')}</p>
                  </div>
                  <div className="text-center p-2 bg-cream/[0.03]">
                    <p className="font-serif text-xl text-red-400">{metrics.alerts}</p>
                    <p className="text-[8px] text-red-400/60 uppercase tracking-wider">{t('sd.demo.report.alerts')}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-[11px] text-cream-muted">
                    <Check className="w-3 h-3 text-gold flex-shrink-0" />
                    <span>{t('sd.demo.report.tags')}: {aiTags.join(', ')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-cream-muted">
                    <Check className="w-3 h-3 text-gold flex-shrink-0" />
                    <span>{t('sd.demo.report.sentiment')}: <span className={
                      metrics.sentiment === 'positive' ? 'text-green-400' : metrics.sentiment === 'negative' ? 'text-red-400' : 'text-amber-400'
                    }>{metrics.sentiment === 'positive' ? t('sd.demo.sentiment.positive') : metrics.sentiment === 'negative' ? t('sd.demo.sentiment.negative') : t('sd.demo.sentiment.neutral')}</span></span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-cream-muted">
                    <Check className="w-3 h-3 text-gold flex-shrink-0" />
                    <span>{t('sd.demo.report.topic')}: {aiTags[0] || 'servicio'}</span>
                  </div>
                </div>

                {/* Estrellas dinámicas */}
                <div className="flex items-center gap-2 mb-4 text-[11px] text-cream-muted">
                  <Check className="w-3 h-3 text-gold flex-shrink-0" />
                  <span>Score:</span>
                  {renderStars(metrics.starScore)}
                  <span className="text-cream-muted/40">({metrics.starScore}/5)</span>
                </div>

                <div className="bg-cream/[0.03] border border-cream/10 p-3 text-[10px] text-cream-muted/60 italic">
                  "{metrics.sentiment === 'negative' ? t('sd.demo.report.analysis.negative') : metrics.sentiment === 'positive' ? t('sd.demo.report.analysis.positive') : t('sd.demo.report.analysis.neutral')}"
                </div>
              </div>
              {/* Email footer */}
              <div className="bg-cream/[0.03] border-t border-cream/10 px-4 py-2 text-center">
                <p className="text-[8px] text-cream-muted/30">{t('sd.demo.report.footer')}</p>
              </div>
            </div>

            <button
              onClick={reset}
              className="pill text-cream-muted hover:text-gold inline-flex items-center gap-2"
            >
              <RotateCcw className="w-3 h-3" /> {t('sd.demo.report.btn')}
            </button>
          </div>
        )
    }
  }

  return (
    <section ref={sectionRef} id="feedback" className="relative w-full bg-dark-secondary" style={{ zIndex: 55 }}>
      <div className="max-w-5xl mx-auto px-6 lg:px-12 py-24 lg:py-32">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="reveal font-mono text-[10px] uppercase tracking-[0.18em] text-gold mb-4 block" style={{ opacity: 0 }}>
            {t('sd.label')}
          </span>
          <h2 className="reveal font-serif font-semibold text-cream leading-[1.05] mb-4" style={{ fontSize: 'clamp(24px, 3vw, 42px)', opacity: 0 }}>
            {t('sd.titulo1')}<br />
            <span className="text-gold">{t('sd.titulo2')}</span>
          </h2>
          <p className="reveal text-cream-muted text-sm max-w-xl mx-auto" style={{ opacity: 0 }}>
            {t('sd.sub')}
          </p>
        </div>

        {/* Main grid */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left: Explanation */}
          <div className="text-center lg:text-left">
            <div className="reveal mb-10" style={{ opacity: 0 }}>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-gold mb-4 block">
                {t('sd.problema.label')}
              </span>
              <h3 className="font-serif font-semibold text-cream text-xl mb-3">
                {t('sd.problema.titulo')}
              </h3>
              <p className="text-sm text-cream-muted leading-relaxed">
                {t('sd.problema.desc')}
              </p>
            </div>

            <div className="reveal mb-10" style={{ opacity: 0 }}>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-gold mb-4 block">
                {t('sd.solucion.label')}
              </span>
              <h3 className="font-serif font-semibold text-cream text-xl mb-3">
                {t('sd.solucion.titulo')}
              </h3>
              <div className="space-y-4 mt-6">
                {aiCapabilities.map(({ icon: Icon, title, desc }, i) => (
                  <div key={i} className="flex flex-col items-center gap-3 text-center sm:grid sm:grid-cols-[40px_1fr] sm:items-start sm:text-left">
                    <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-gold" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h4 className="text-cream text-sm font-medium mb-0.5">{title}</h4>
                      <p className="text-xs text-cream-muted leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="reveal" style={{ opacity: 0 }}>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-gold mb-4 block">
                {t('sd.flow.label')}
              </span>
              <div className="relative">
                {dataFlowSteps.map(({ icon: Icon, label, desc }, i) => (
                  <div key={i} className="flex flex-col items-center gap-3 text-center mb-5 last:mb-0 relative sm:grid sm:grid-cols-[40px_1fr] sm:items-start sm:text-left sm:gap-4 sm:mb-4">
                    {i < dataFlowSteps.length - 1 && (
                      <div className="hidden sm:block absolute left-5 top-10 w-px h-full bg-cream/10" />
                    )}
                    <div className="w-10 h-10 rounded-full bg-cream/[0.05] border border-cream/10 flex items-center justify-center flex-shrink-0 relative z-10">
                      <Icon className="w-4 h-4 text-gold/70" strokeWidth={1.5} />
                    </div>
                    <div className="pt-1">
                      <p className="text-cream text-[13px] font-medium">{label}</p>
                      <p className="text-[11px] text-cream-muted/50">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Interactive demo */}
          <div className="reveal" style={{ opacity: 0 }}>
            <div className="bg-dark-primary border border-cream/10 p-6 lg:p-8">
              {/* Phase label */}
              <div className="flex items-center justify-between mb-6">
                <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-cream-muted/50">
                  {phase === 'intro' && 'Demo Interactiva'}
                  {phase === 'survey' && 'Encuesta del cliente'}
                  {phase === 'analyzing' && 'IA procesando'}
                  {phase === 'alert' && 'Alerta en tiempo real'}
                  {phase === 'report' && 'Reporte generado'}
                </span>
                <div className="flex gap-1">
                  {(['intro', 'survey', 'analyzing', 'alert', 'report'] as Phase[]).map((p, i) => (
                    <div key={p} className={`w-2 h-2 rounded-full transition-colors ${
                      ['intro', 'survey', 'analyzing', 'alert', 'report'].indexOf(phase) >= i ? 'bg-gold' : 'bg-cream/10'
                    }`} />
                  ))}
                </div>
              </div>

              {renderPhase()}
            </div>

            {/* Mini features */}
            {demoStarted && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                {[
                  t('sd.demo.feature.1'),
                  t('sd.demo.feature.2'),
                  t('sd.demo.feature.3'),
                  t('sd.demo.feature.4'),
                ].map((f, i) => (
                  <div key={i} className="flex items-center justify-center gap-2 text-center text-[11px] text-cream-muted/50 sm:justify-start sm:text-left">
                    <Check className="w-3 h-3 text-gold flex-shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {showLiveForms && (
          <div className="reveal mt-16 lg:mt-20" style={{ opacity: 0 }}>
            <div className="mb-8 text-center">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-gold mb-4 block">
                {t('sd.liveform.section.label')}
              </span>
              <h3 className="font-serif font-semibold text-cream leading-[1.08] mb-3" style={{ fontSize: 'clamp(22px, 2.6vw, 34px)' }}>
                {t('sd.liveform.section.title')}
              </h3>
              <p className="text-sm text-cream-muted max-w-xl mx-auto leading-relaxed">
                {t('sd.liveform.section.desc')}
              </p>
            </div>

            <div className="mb-6 border border-cream/10 bg-dark-primary">
              {selectedLiveForm ? (
                <div>
                  <div className="flex items-center justify-between gap-4 border-b border-cream/10 px-4 py-3">
                    <div className="min-w-0">
                      <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-gold">{selectedLiveForm.label}</p>
                      <h4 className="font-serif text-cream text-lg truncate">{selectedLiveForm.title}</h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedLiveForm(null)}
                      aria-label={t('sd.liveform.close')}
                      className="w-9 h-9 flex items-center justify-center text-cream-muted hover:text-gold transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <iframe
                    key={selectedLiveForm.href}
                    src={selectedLiveForm.href}
                    title={selectedLiveForm.title}
                    className="h-[720px] w-full bg-dark-primary"
                  />
                </div>
              ) : (
                <div className="px-5 py-8 text-center">
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-gold mb-3">
                    {t('sd.liveform.window.title')}
                  </p>
                  <p className="text-sm text-cream-muted max-w-lg mx-auto leading-relaxed">
                    {t('sd.liveform.window.desc')}
                  </p>
                </div>
              )}
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {liveSurveyForms.map(({ href, icon: Icon, label, title, desc, type }) => (
                <button
                  key={href}
                  type="button"
                  onClick={() => setSelectedLiveForm({ href, icon: Icon, label, title, desc, type })}
                  className={`group block text-center sm:text-left border bg-dark-primary p-5 hover:border-gold/50 hover:bg-cream/[0.035] transition-colors ${selectedLiveForm?.href === href ? 'border-gold/70' : 'border-cream/10'}`}
                >
                  <div className="flex flex-col items-center gap-3 mb-5 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                    <div className="w-11 h-11 border border-cream/10 bg-cream/[0.03] flex items-center justify-center group-hover:border-gold/50 transition-colors">
                      <Icon className="w-5 h-5 text-gold" strokeWidth={1.5} />
                    </div>
                    <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-gold/80 border border-gold/25 px-2 py-1">
                      {label}
                    </span>
                  </div>
                  <h4 className="font-serif text-cream text-xl leading-tight mb-3">{title}</h4>
                  <p className="text-[13px] text-cream-muted leading-relaxed mb-5">{desc}</p>
                  <div className="flex flex-col items-center gap-3 pt-4 border-t border-cream/10 sm:flex-row sm:justify-between">
                    <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-cream-muted/45">
                      type: {type}
                    </span>
                    <ChevronRight className="w-4 h-4 text-gold transition-transform group-hover:translate-x-1" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Bottom stats */}
        <div className="reveal mt-16 grid grid-cols-3 gap-8 text-center" style={{ opacity: 0 }}>
          {[
            { value: t('sd.stats1.val'), label: t('sd.stats1.label'), icon: Eye },
            { value: t('sd.stats2.val'), label: t('sd.stats2.label'), icon: Zap },
            { value: t('sd.stats3.val'), label: t('sd.stats3.label'), icon: Database },
          ].map(({ value, label, icon: Icon }, i) => (
            <div key={i} className="flex flex-col items-center">
              <Icon className="w-5 h-5 text-gold/50 mb-3" strokeWidth={1.5} />
              <p className="font-serif text-2xl text-gold mb-1">{value}</p>
              <p className="text-[11px] text-cream-muted/40 max-w-[140px]">{label}</p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="reveal mt-16 text-center" style={{ opacity: 0 }}>
          <a href="#contacto" onClick={(e) => { e.preventDefault(); document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' }) }} className="pill-accent">
            {t('sd.cta')}
          </a>
          <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-cream-muted/30 mt-3">
            {t('sd.cta.sub')}
          </p>
        </div>
      </div>
    </section>
  )
}
