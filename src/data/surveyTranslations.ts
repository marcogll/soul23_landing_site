// Traducciones de surveys reales (ES/EN/KO/ZH)
// Keys: survey.{surveyId}.q.{questionId}.{field}
//        survey.{surveyId}.q.{questionId}.choice.{choiceId}
//        survey.{surveyId}.welcome.{field}
//        survey.{surveyId}.ending.{field}

export const surveyTranslations: Record<string, Record<string, string>> = {
  ES: {
    // ContactSurvey
    'survey.contact.name': 'Formulario de Contacto',
    'survey.contact.welcome.headline': 'Diseñemos tu encuesta',
    'survey.contact.welcome.subheader': 'Te preguntaremos giro, tipo de encuesta y canal para enviarte un primer reporte por correo.',
    'survey.contact.welcome.buttonLabel': 'Empezar',
    'survey.contact.ending.headline': '¡Gracias por escribirnos!',
    'survey.contact.ending.subheader': 'Te contactamos pronto para platicar de tu caso. Mientras tanto, puedes escribirnos a hi@soul23.mx',

    'survey.contact.q.tipo_negocio.headline': '¿En qué sector está tu negocio?',
    'survey.contact.q.tipo_negocio.subheader': 'Talia adapta la encuesta, el reporte y las alertas según el giro.',
    'survey.contact.q.tipo_negocio.choice.belleza': 'Belleza / Spa / Salón',
    'survey.contact.q.tipo_negocio.choice.salud': 'Salud / Clínica / Consultorio',
    'survey.contact.q.tipo_negocio.choice.legal': 'Despacho legal / Abogados',
    'survey.contact.q.tipo_negocio.choice.restaurante': 'Restaurante / Alimentos',
    'survey.contact.q.tipo_negocio.choice.retail': 'Retail / Ecommerce',
    'survey.contact.q.tipo_negocio.choice.educacion': 'Educación / Cursos',
    'survey.contact.q.tipo_negocio.choice.rrhh': 'Recursos humanos / Reclutamiento',
    'survey.contact.q.tipo_negocio.choice.industrial': 'Industria / Manufactura',
    'survey.contact.q.tipo_negocio.choice.servicios': 'Servicios profesionales',
    'survey.contact.q.tipo_negocio.choice.otro': 'Otro',

    'survey.contact.q.tipo_encuesta.headline': 'Elige el tipo de encuesta que quieres levantar',
    'survey.contact.q.tipo_encuesta.subheader': 'Puedes elegir varias. Esta selección viaja completa al webhook para construir el email del cliente y el reporte interno.',
    'survey.contact.q.tipo_encuesta.choice.satisfaccion_cliente': 'Satisfacción de clientes',
    'survey.contact.q.tipo_encuesta.choice.post_servicio': 'Post-servicio / post-compra',
    'survey.contact.q.tipo_encuesta.choice.nps': 'NPS / recomendación',
    'survey.contact.q.tipo_encuesta.choice.calidad': 'Calidad de producto o servicio',
    'survey.contact.q.tipo_encuesta.choice.empleados': 'Empleados / clima laboral',
    'survey.contact.q.tipo_encuesta.choice.eventos': 'Eventos / RSVP',
    'survey.contact.q.tipo_encuesta.choice.leads': 'Captura y calificación de leads',
    'survey.contact.q.tipo_encuesta.choice.diagnostico': 'Diagnóstico interno de procesos',
    'survey.contact.q.tipo_encuesta.choice.legal_case_intake': 'Intake de clientes legales',
    'survey.contact.q.tipo_encuesta.choice.rrhh_reclutamiento': 'Reclutamiento / experiencia de candidato',
    'survey.contact.q.tipo_encuesta.choice.rrhh_clima': 'Clima laboral / pulso de equipo',

    'survey.contact.q.nombre.headline': '¿Cómo te llamas?',
    'survey.contact.q.nombre.placeholder': 'Tu nombre',

    'survey.contact.q.negocio.headline': '¿Cómo se llama tu negocio?',
    'survey.contact.q.negocio.placeholder': 'Nombre del negocio',

    'survey.contact.q.email.headline': '¿Cuál es tu correo electrónico?',
    'survey.contact.q.email.placeholder': 'correo@ejemplo.com',

    'survey.contact.q.telefono.headline': '¿Tu número de teléfono?',
    'survey.contact.q.telefono.placeholder': '8441234567',

    'survey.contact.q.canal_encuesta.headline': '¿Dónde quieres aplicar esas encuestas?',
    'survey.contact.q.canal_encuesta.choice.whatsapp': 'WhatsApp',
    'survey.contact.q.canal_encuesta.choice.qr': 'QR en sucursal / evento',
    'survey.contact.q.canal_encuesta.choice.email': 'Email',
    'survey.contact.q.canal_encuesta.choice.web': 'Sitio web / landing',
    'survey.contact.q.canal_encuesta.choice.pos': 'Después de venta o pago',
    'survey.contact.q.canal_encuesta.choice.staff': 'Captura interna por staff',

    'survey.contact.q.audiencia_encuesta.headline': '¿Quién responderá la encuesta?',
    'survey.contact.q.audiencia_encuesta.subheader': 'Mientras más claro sea esto, más personalizado puede ser el email y el reporte.',
    'survey.contact.q.audiencia_encuesta.choice.clientes_actuales': 'Clientes actuales',
    'survey.contact.q.audiencia_encuesta.choice.clientes_nuevos': 'Clientes nuevos',
    'survey.contact.q.audiencia_encuesta.choice.leads': 'Leads / prospectos',
    'survey.contact.q.audiencia_encuesta.choice.pacientes': 'Pacientes',
    'survey.contact.q.audiencia_encuesta.choice.alumnos': 'Alumnos',
    'survey.contact.q.audiencia_encuesta.choice.empleados': 'Empleados / staff',
    'survey.contact.q.audiencia_encuesta.choice.asistentes_evento': 'Asistentes a evento',
    'survey.contact.q.audiencia_encuesta.choice.proveedores': 'Proveedores / aliados',
    'survey.contact.q.audiencia_encuesta.choice.candidatos': 'Candidatos / postulantes',
    'survey.contact.q.audiencia_encuesta.choice.clientes_legales': 'Clientes de despacho',

    'survey.contact.q.momento_encuesta.headline': '¿En qué momento quieres pedir la respuesta?',
    'survey.contact.q.momento_encuesta.subheader': 'El momento define automatizaciones, recordatorios y alertas.',
    'survey.contact.q.momento_encuesta.choice.antes_servicio': 'Antes del servicio o cita',
    'survey.contact.q.momento_encuesta.choice.despues_servicio': 'Después del servicio o compra',
    'survey.contact.q.momento_encuesta.choice.cancelacion': 'Cuando cancelan o no llegan',
    'survey.contact.q.momento_encuesta.choice.post_evento': 'Después de un evento',
    'survey.contact.q.momento_encuesta.choice.cada_mes': 'Cada mes / seguimiento periódico',
    'survey.contact.q.momento_encuesta.choice.cuando_hay_alerta': 'Cuando haya una respuesta crítica',
    'survey.contact.q.momento_encuesta.choice.en_sucursal': 'En sucursal / punto de atención',
    'survey.contact.q.momento_encuesta.choice.en_web': 'En sitio web o landing',
    'survey.contact.q.momento_encuesta.choice.post_consulta': 'Después de consulta o asesoría',
    'survey.contact.q.momento_encuesta.choice.post_entrevista': 'Después de entrevista o proceso de selección',

    'survey.contact.q.necesidad.headline': 'Además de encuestas, ¿qué te gustaría automatizar?',
    'survey.contact.q.necesidad.subheader': 'Marca todas las que apliquen.',
    'survey.contact.q.necesidad.choice.email_cliente': 'Enviar correo con resumen al cliente',
    'survey.contact.q.necesidad.choice.alertas': 'Alertar si hay una respuesta crítica',
    'survey.contact.q.necesidad.choice.dashboard': 'Actualizar dashboard',
    'survey.contact.q.necesidad.choice.whatsapp_followup': 'Dar seguimiento por WhatsApp',
    'survey.contact.q.necesidad.choice.crm': 'Guardar lead o cliente en CRM',
    'survey.contact.q.necesidad.choice.reporte_semanal': 'Enviar reporte semanal interno',
    'survey.contact.q.necesidad.choice.agenda': 'Agenda automática de citas',
    'survey.contact.q.necesidad.choice.ventas': 'Control de ventas y pagos',
    'survey.contact.q.necesidad.choice.bots': 'Bot de WhatsApp para clientes',
    'survey.contact.q.necesidad.choice.personal': 'Control de personal',
    'survey.contact.q.necesidad.choice.todo': 'Quiero que mi negocio trabaje solo',
    'survey.contact.q.necesidad.choice.reportes_encuestas': 'Reportes automáticos de encuestas',

    'survey.contact.q.presupuesto.headline': '¿Tienes un presupuesto en mente?',
    'survey.contact.q.presupuesto.subheader': 'Nos ayuda a dimensionar la solución.',
    'survey.contact.q.presupuesto.choice.<10k': 'Menos de $10,000 MXN',
    'survey.contact.q.presupuesto.choice.10-25k': '$10,000 - $25,000 MXN',
    'survey.contact.q.presupuesto.choice.25-50k': '$25,000 - $50,000 MXN',
    'survey.contact.q.presupuesto.choice.>50k': 'Más de $50,000 MXN',
    'survey.contact.q.presupuesto.choice.no_se': 'No sé, quiero opciones',

    'survey.contact.q.decision_principal.headline': '¿Qué decisión quieres tomar con esas respuestas?',
    'survey.contact.q.decision_principal.subheader': 'Ejemplo: mejorar atención, reducir cancelaciones, saber qué curso vender, detectar empleados saturados.',
    'survey.contact.q.decision_principal.placeholder': 'Quiero decidir...',

    'survey.contact.q.pregunta_clave.headline': '¿Cuál sería la pregunta más importante para tu negocio?',
    'survey.contact.q.pregunta_clave.subheader': 'No tiene que estar perfecta; Talia la convierte en una estructura de encuesta.',
    'survey.contact.q.pregunta_clave.placeholder': 'Necesito saber si...',

    'survey.contact.q.alerta_critica.headline': '¿Qué respuesta debería activar una alerta interna?',
    'survey.contact.q.alerta_critica.subheader': 'Esto ayuda a n8n a decidir cuándo mandar aviso urgente y no solo guardar datos.',
    'survey.contact.q.alerta_critica.placeholder': 'Alertar si...',

    'survey.contact.q.seguimiento_cliente.headline': '¿Qué debería recibir la persona después de contestar?',
    'survey.contact.q.seguimiento_cliente.subheader': 'Ejemplo: agradecimiento, cupón, instrucciones, llamada, reporte, confirmación de cita.',
    'survey.contact.q.seguimiento_cliente.placeholder': 'Después de responder debería recibir...',

    'survey.contact.q.descripcion.headline': 'Cuéntanos más contexto para personalizar el reporte',
    'survey.contact.q.descripcion.subheader': 'Cómo lo miden hoy, volumen aproximado, sucursales, sistema actual o problema principal.',
    'survey.contact.q.descripcion.placeholder': 'Hoy medimos esto así...',

    // SurveyService
    'survey.service.name': 'Encuesta de Servicio',
    'survey.service.welcome.headline': 'Cuéntanos cómo fue tu experiencia',
    'survey.service.welcome.subheader': 'Tu opinión nos ayuda a mejorar. Son solo 2 minutos.',
    'survey.service.welcome.buttonLabel': 'Comenzar',
    'survey.service.ending.headline': '¡Gracias por tu feedback!',
    'survey.service.ending.subheader': 'Tu opinión nos ayuda a construir mejores sistemas. Si tienes algún comentario adicional, escríbenos a hi@soul23.mx',

    'survey.service.q.fecha_visita.headline': '¿Cuándo fue tu última visita?',
    'survey.service.q.fecha_visita.subheader': 'Selecciona la fecha del servicio que nos brindaste.',
    'survey.service.q.fecha_visita.placeholder': 'Fecha de visita',

    'survey.service.q.servicio_recibido.headline': '¿Qué servicio recibiste?',
    'survey.service.q.servicio_recibido.choice.automatizacion': 'Automatización de procesos',
    'survey.service.q.servicio_recibido.choice.dashboard': 'Dashboard / BI',
    'survey.service.q.servicio_recibido.choice.bots': 'Bot de WhatsApp',
    'survey.service.q.servicio_recibido.choice.agendas': 'Sistema de agendas',
    'survey.service.q.servicio_recibido.choice.ventas': 'Control de ventas',
    'survey.service.q.servicio_recibido.choice.personal': 'Control de personal',
    'survey.service.q.servicio_recibido.choice.otro': 'Otro',

    'survey.service.q.calificacion_experiencia.headline': '¿Cómo calificarías tu experiencia general?',
    'survey.service.q.calificacion_experiencia.lowerLabel': 'Mala',
    'survey.service.q.calificacion_experiencia.upperLabel': 'Excelente',

    'survey.service.q.calificacion_comunicacion.headline': '¿Qué tal fue la comunicación durante el proyecto?',
    'survey.service.q.calificacion_comunicacion.lowerLabel': 'Mala',
    'survey.service.q.calificacion_comunicacion.upperLabel': 'Excelente',

    'survey.service.q.calificacion_cumplimiento.headline': '¿Se cumplieron los tiempos acordados?',
    'survey.service.q.calificacion_cumplimiento.lowerLabel': 'Nada',
    'survey.service.q.calificacion_cumplimiento.upperLabel': 'Siempre',

    'survey.service.q.calificacion_calidad.headline': '¿Cómo calificarías la calidad del entregable?',
    'survey.service.q.calificacion_calidad.lowerLabel': 'Mala',
    'survey.service.q.calificacion_calidad.upperLabel': 'Excelente',

    'survey.service.q.problema_resuelto.headline': '¿Tu problema principal fue resuelto?',
    'survey.service.q.problema_resuelto.choice.si_completo': 'Sí, completamente',
    'survey.service.q.problema_resuelto.choice.si_parcial': 'Sí, parcialmente',
    'survey.service.q.problema_resuelto.choice.no': 'No',

    'survey.service.q.valor_percibido.headline': '¿Sientes que el servicio valió la pena?',
    'survey.service.q.valor_percibido.choice.mucho': 'Sí, mucho más de lo esperado',
    'survey.service.q.valor_percibido.choice.bien': 'Sí, valió la pena',
    'survey.service.q.valor_percibido.choice.regular': 'Más o menos',
    'survey.service.q.valor_percibido.choice.no': 'No, no lo sentí así',

    'survey.service.q.recomendaria.headline': '¿Nos recomendarías a un conocido?',
    'survey.service.q.recomendaria.choice.definitivamente': 'Definitivamente sí',
    'survey.service.q.recomendaria.choice.probable': 'Probablemente sí',
    'survey.service.q.recomendaria.choice.neutral': 'No estoy seguro',
    'survey.service.q.recomendaria.choice.no': 'No',

    'survey.service.q.comentario_positivo.headline': '¿Qué fue lo que más te gustó?',
    'survey.service.q.comentario_positivo.subheader': 'Cuéntanos lo positivo para seguir haciéndolo bien.',
    'survey.service.q.comentario_positivo.placeholder': 'Me gustó que...',

    'survey.service.q.comentario_mejora.headline': '¿Qué podríamos mejorar?',
    'survey.service.q.comentario_mejora.subheader': 'Tu feedback nos ayuda a crecer.',
    'survey.service.q.comentario_mejora.placeholder': 'Creo que podrían...',

    'survey.service.q.telefono_contacto.headline': '¿Tu número de teléfono?',
    'survey.service.q.telefono_contacto.subheader': 'Solo para contactarte si hay seguimiento.',
    'survey.service.q.telefono_contacto.placeholder': '8441234567',
  },

  EN: {
    'survey.contact.name': 'Contact Form',
    'survey.contact.welcome.headline': "Let's design your survey",
    'survey.contact.welcome.subheader': "We'll ask about your industry, survey type and channel to send you a first report by email.",
    'survey.contact.welcome.buttonLabel': 'Start',
    'survey.contact.ending.headline': 'Thanks for writing to us!',
    'survey.contact.ending.subheader': "We'll contact you soon to discuss your case. Meanwhile, you can write to hi@soul23.mx",

    'survey.contact.q.tipo_negocio.headline': 'What industry is your business in?',
    'survey.contact.q.tipo_negocio.subheader': 'Talia adapts the survey, report and alerts based on your industry.',
    'survey.contact.q.tipo_negocio.choice.belleza': 'Beauty / Spa / Salon',
    'survey.contact.q.tipo_negocio.choice.salud': 'Health / Clinic / Office',
    'survey.contact.q.tipo_negocio.choice.legal': 'Law firm / Lawyers',
    'survey.contact.q.tipo_negocio.choice.restaurante': 'Restaurant / Food',
    'survey.contact.q.tipo_negocio.choice.retail': 'Retail / Ecommerce',
    'survey.contact.q.tipo_negocio.choice.educacion': 'Education / Courses',
    'survey.contact.q.tipo_negocio.choice.rrhh': 'Human Resources / Recruitment',
    'survey.contact.q.tipo_negocio.choice.industrial': 'Industry / Manufacturing',
    'survey.contact.q.tipo_negocio.choice.servicios': 'Professional services',
    'survey.contact.q.tipo_negocio.choice.otro': 'Other',

    'survey.contact.q.tipo_encuesta.headline': 'Choose the type of survey you want to run',
    'survey.contact.q.tipo_encuesta.subheader': 'You can choose several. This selection goes to the webhook to build the client email and internal report.',
    'survey.contact.q.tipo_encuesta.choice.satisfaccion_cliente': 'Customer satisfaction',
    'survey.contact.q.tipo_encuesta.choice.post_servicio': 'Post-service / post-purchase',
    'survey.contact.q.tipo_encuesta.choice.nps': 'NPS / recommendation',
    'survey.contact.q.tipo_encuesta.choice.calidad': 'Product or service quality',
    'survey.contact.q.tipo_encuesta.choice.empleados': 'Employees / work climate',
    'survey.contact.q.tipo_encuesta.choice.eventos': 'Events / RSVP',
    'survey.contact.q.tipo_encuesta.choice.leads': 'Lead capture and qualification',
    'survey.contact.q.tipo_encuesta.choice.diagnostico': 'Internal process diagnosis',
    'survey.contact.q.tipo_encuesta.choice.legal_case_intake': 'Legal client intake',
    'survey.contact.q.tipo_encuesta.choice.rrhh_reclutamiento': 'Recruitment / candidate experience',
    'survey.contact.q.tipo_encuesta.choice.rrhh_clima': 'Work climate / team pulse',

    'survey.contact.q.nombre.headline': "What's your name?",
    'survey.contact.q.nombre.placeholder': 'Your name',

    'survey.contact.q.negocio.headline': "What's your business called?",
    'survey.contact.q.negocio.placeholder': 'Business name',

    'survey.contact.q.email.headline': "What's your email?",
    'survey.contact.q.email.placeholder': 'email@example.com',

    'survey.contact.q.telefono.headline': 'Your phone number?',
    'survey.contact.q.telefono.placeholder': '8441234567',

    'survey.contact.q.canal_encuesta.headline': 'Where do you want to run these surveys?',
    'survey.contact.q.canal_encuesta.choice.whatsapp': 'WhatsApp',
    'survey.contact.q.canal_encuesta.choice.qr': 'QR at branch / event',
    'survey.contact.q.canal_encuesta.choice.email': 'Email',
    'survey.contact.q.canal_encuesta.choice.web': 'Website / landing',
    'survey.contact.q.canal_encuesta.choice.pos': 'After sale or payment',
    'survey.contact.q.canal_encuesta.choice.staff': 'Internal staff capture',

    'survey.contact.q.audiencia_encuesta.headline': 'Who will answer this survey?',
    'survey.contact.q.audiencia_encuesta.subheader': 'The clearer this is, the more personalized the email and report can be.',
    'survey.contact.q.audiencia_encuesta.choice.clientes_actuales': 'Current customers',
    'survey.contact.q.audiencia_encuesta.choice.clientes_nuevos': 'New customers',
    'survey.contact.q.audiencia_encuesta.choice.leads': 'Leads / prospects',
    'survey.contact.q.audiencia_encuesta.choice.pacientes': 'Patients',
    'survey.contact.q.audiencia_encuesta.choice.alumnos': 'Students',
    'survey.contact.q.audiencia_encuesta.choice.empleados': 'Employees / staff',
    'survey.contact.q.audiencia_encuesta.choice.asistentes_evento': 'Event attendees',
    'survey.contact.q.audiencia_encuesta.choice.proveedores': 'Suppliers / partners',
    'survey.contact.q.audiencia_encuesta.choice.candidatos': 'Candidates / applicants',
    'survey.contact.q.audiencia_encuesta.choice.clientes_legales': 'Law firm clients',

    'survey.contact.q.momento_encuesta.headline': 'When do you want to ask for the response?',
    'survey.contact.q.momento_encuesta.subheader': 'The moment defines automations, reminders and alerts.',
    'survey.contact.q.momento_encuesta.choice.antes_servicio': 'Before service or appointment',
    'survey.contact.q.momento_encuesta.choice.despues_servicio': 'After service or purchase',
    'survey.contact.q.momento_encuesta.choice.cancelacion': 'When they cancel or no-show',
    'survey.contact.q.momento_encuesta.choice.post_evento': 'After an event',
    'survey.contact.q.momento_encuesta.choice.cada_mes': 'Monthly / periodic follow-up',
    'survey.contact.q.momento_encuesta.choice.cuando_hay_alerta': 'When there is a critical response',
    'survey.contact.q.momento_encuesta.choice.en_sucursal': 'At branch / point of service',
    'survey.contact.q.momento_encuesta.choice.en_web': 'On website or landing',
    'survey.contact.q.momento_encuesta.choice.post_consulta': 'After consultation or advice',
    'survey.contact.q.momento_encuesta.choice.post_entrevista': 'After interview or selection process',

    'survey.contact.q.necesidad.headline': 'Besides surveys, what would you like to automate?',
    'survey.contact.q.necesidad.subheader': 'Check all that apply.',
    'survey.contact.q.necesidad.choice.email_cliente': 'Send summary email to client',
    'survey.contact.q.necesidad.choice.alertas': 'Alert if there is a critical response',
    'survey.contact.q.necesidad.choice.dashboard': 'Update dashboard',
    'survey.contact.q.necesidad.choice.whatsapp_followup': 'Follow up via WhatsApp',
    'survey.contact.q.necesidad.choice.crm': 'Save lead or client in CRM',
    'survey.contact.q.necesidad.choice.reporte_semanal': 'Send weekly internal report',
    'survey.contact.q.necesidad.choice.agenda': 'Automatic appointment scheduling',
    'survey.contact.q.necesidad.choice.ventas': 'Sales and payment control',
    'survey.contact.q.necesidad.choice.bots': 'WhatsApp bot for clients',
    'survey.contact.q.necesidad.choice.personal': 'Staff control',
    'survey.contact.q.necesidad.choice.todo': 'I want my business to work on its own',
    'survey.contact.q.necesidad.choice.reportes_encuestas': 'Automatic survey reports',

    'survey.contact.q.presupuesto.headline': 'Do you have a budget in mind?',
    'survey.contact.q.presupuesto.subheader': 'Helps us size the solution.',
    'survey.contact.q.presupuesto.choice.<10k': 'Less than $10,000 MXN',
    'survey.contact.q.presupuesto.choice.10-25k': '$10,000 - $25,000 MXN',
    'survey.contact.q.presupuesto.choice.25-50k': '$25,000 - $50,000 MXN',
    'survey.contact.q.presupuesto.choice.>50k': 'More than $50,000 MXN',
    'survey.contact.q.presupuesto.choice.no_se': "I don't know, want options",

    'survey.contact.q.decision_principal.headline': 'What decision do you want to make with those responses?',
    'survey.contact.q.decision_principal.subheader': 'Example: improve service, reduce cancellations, know what course to sell, detect overloaded employees.',
    'survey.contact.q.decision_principal.placeholder': 'I want to decide...',

    'survey.contact.q.pregunta_clave.headline': "What would be the most important question for your business?",
    'survey.contact.q.pregunta_clave.subheader': "It doesn't have to be perfect; Talia turns it into a survey structure.",
    'survey.contact.q.pregunta_clave.placeholder': 'I need to know if...',

    'survey.contact.q.alerta_critica.headline': 'What response should trigger an internal alert?',
    'survey.contact.q.alerta_critica.subheader': 'This helps n8n decide when to send an urgent notice and not just save data.',
    'survey.contact.q.alerta_critica.placeholder': 'Alert if...',

    'survey.contact.q.seguimiento_cliente.headline': 'What should the person receive after answering?',
    'survey.contact.q.seguimiento_cliente.subheader': 'Example: thank you, coupon, instructions, call, report, appointment confirmation.',
    'survey.contact.q.seguimiento_cliente.placeholder': 'After answering they should receive...',

    'survey.contact.q.descripcion.headline': 'Tell us more context to personalize the report',
    'survey.contact.q.descripcion.subheader': 'How you measure today, approximate volume, branches, current system or main problem.',
    'survey.contact.q.descripcion.placeholder': 'Today we measure like this...',

    // SurveyService
    'survey.service.name': 'Service Survey',
    'survey.service.welcome.headline': 'Tell us about your experience',
    'survey.service.welcome.subheader': 'Your opinion helps us improve. It only takes 2 minutes.',
    'survey.service.welcome.buttonLabel': 'Start',
    'survey.service.ending.headline': 'Thanks for your feedback!',
    'survey.service.ending.subheader': 'Your opinion helps us build better systems. If you have any additional comments, write to hi@soul23.mx',

    'survey.service.q.fecha_visita.headline': 'When was your last visit?',
    'survey.service.q.fecha_visita.subheader': 'Select the date of the service you received.',
    'survey.service.q.fecha_visita.placeholder': 'Visit date',

    'survey.service.q.servicio_recibido.headline': 'What service did you receive?',
    'survey.service.q.servicio_recibido.choice.automatizacion': 'Process automation',
    'survey.service.q.servicio_recibido.choice.dashboard': 'Dashboard / BI',
    'survey.service.q.servicio_recibido.choice.bots': 'WhatsApp bot',
    'survey.service.q.servicio_recibido.choice.agendas': 'Appointment system',
    'survey.service.q.servicio_recibido.choice.ventas': 'Sales control',
    'survey.service.q.servicio_recibido.choice.personal': 'Staff control',
    'survey.service.q.servicio_recibido.choice.otro': 'Other',

    'survey.service.q.calificacion_experiencia.headline': 'How would you rate your overall experience?',
    'survey.service.q.calificacion_experiencia.lowerLabel': 'Bad',
    'survey.service.q.calificacion_experiencia.upperLabel': 'Excellent',

    'survey.service.q.calificacion_comunicacion.headline': 'How was communication during the project?',
    'survey.service.q.calificacion_comunicacion.lowerLabel': 'Bad',
    'survey.service.q.calificacion_comunicacion.upperLabel': 'Excellent',

    'survey.service.q.calificacion_cumplimiento.headline': 'Were agreed timelines met?',
    'survey.service.q.calificacion_cumplimiento.lowerLabel': 'Not at all',
    'survey.service.q.calificacion_cumplimiento.upperLabel': 'Always',

    'survey.service.q.calificacion_calidad.headline': 'How would you rate the deliverable quality?',
    'survey.service.q.calificacion_calidad.lowerLabel': 'Bad',
    'survey.service.q.calificacion_calidad.upperLabel': 'Excellent',

    'survey.service.q.problema_resuelto.headline': 'Was your main problem solved?',
    'survey.service.q.problema_resuelto.choice.si_completo': 'Yes, completely',
    'survey.service.q.problema_resuelto.choice.si_parcial': 'Yes, partially',
    'survey.service.q.problema_resuelto.choice.no': 'No',

    'survey.service.q.valor_percibido.headline': 'Do you feel the service was worth it?',
    'survey.service.q.valor_percibido.choice.mucho': 'Yes, much more than expected',
    'survey.service.q.valor_percibido.choice.bien': 'Yes, it was worth it',
    'survey.service.q.valor_percibido.choice.regular': 'More or less',
    'survey.service.q.valor_percibido.choice.no': 'No, I did not feel that way',

    'survey.service.q.recomendaria.headline': 'Would you recommend us to someone you know?',
    'survey.service.q.recomendaria.choice.definitivamente': 'Definitely yes',
    'survey.service.q.recomendaria.choice.probable': 'Probably yes',
    'survey.service.q.recomendaria.choice.neutral': 'Not sure',
    'survey.service.q.recomendaria.choice.no': 'No',

    'survey.service.q.comentario_positivo.headline': 'What did you like the most?',
    'survey.service.q.comentario_positivo.subheader': 'Tell us the positive so we keep doing it well.',
    'survey.service.q.comentario_positivo.placeholder': 'I liked that...',

    'survey.service.q.comentario_mejora.headline': 'What could we improve?',
    'survey.service.q.comentario_mejora.subheader': 'Your feedback helps us grow.',
    'survey.service.q.comentario_mejora.placeholder': 'I think they could...',

    'survey.service.q.telefono_contacto.headline': 'Your phone number?',
    'survey.service.q.telefono_contacto.subheader': 'Only to contact you if follow-up is needed.',
    'survey.service.q.telefono_contacto.placeholder': '8441234567',
  },
};

// Merge survey translations into LanguageContext dict
export function mergeSurveyTranslations(dict: Record<string, Record<string, string>>) {
  Object.keys(surveyTranslations).forEach((lang) => {
    if (dict[lang]) {
      Object.assign(dict[lang], surveyTranslations[lang]);
    }
  });
}
