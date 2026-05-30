export function classifySentiment(
  text: string,
  words: { positive: string[]; negative: string[] }
): 'positive' | 'neutral' | 'negative' {
  const lower = text.toLowerCase();
  const posCount = words.positive.filter((w) => lower.includes(w)).length;
  const negCount = words.negative.filter((w) => lower.includes(w)).length;
  if (posCount > negCount) return 'positive';
  if (negCount > posCount) return 'negative';
  return 'neutral';
}

export function extractTags(text: string): string[] {
  const keywords: Record<string, string[]> = {
    'comunicación': ['comunicación', 'comunica', 'explica', 'dialoga', 'respuesta', 'respondió'],
    'liderazgo': ['liderazgo', 'líder', 'lidera', 'dirige', 'iniciativa'],
    'puntualidad': ['puntual', 'puntualidad', 'tiempo', 'horario', 'tarde', 'tardado'],
    'creatividad': ['creativo', 'creativa', 'creatividad', 'innovador', 'original'],
    'trabajo_equipo': ['equipo', 'compañeros', 'colabora', 'trabajo en equipo'],
    'organización': ['organizado', 'organización', 'orden', 'planifica', 'desorganizado'],
    'calidad': ['calidad', 'detallista', 'cuidadoso', 'preciso', 'profesional'],
    'proactividad': ['proactivo', 'proactiva', 'iniciativa', 'propone', 'mejora'],
    'ventas': ['ventas', 'vender', 'pago', 'cobrar', 'factura', 'ingreso'],
    'agendas': ['agenda', 'cita', 'citas', 'reservar', 'reserva', 'booking'],
    'personal': ['personal', 'empleado', 'equipo', 'staff', 'nómina'],
    'whatsapp': ['whatsapp', 'bot', 'chatbot', 'mensaje', 'chat'],
    'dashboard': ['dashboard', 'reporte', 'datos', 'analytics', 'métricas'],
    'inventario': ['inventario', 'stock', 'producto', 'productos'],
    'clientes': ['clientes', 'clienta', 'cliente', 'lead', 'leads'],
    'automatización': ['automatizar', 'automático', 'automatización', 'proceso'],
    'ia': ['inteligencia artificial', 'ia', 'machine learning', 'chatgpt', 'ai'],
    'marketing': ['marketing', 'redes', 'contenido', 'seo', 'publicidad'],
    'urgencia': ['urgente', 'ya', 'inmediato', 'pronto', 'rápido'],
    'costo': ['costo', 'precio', 'caro', 'económico', 'inversión', 'barato'],
  };
  const lower = text.toLowerCase();
  return Object.entries(keywords)
    .filter(([, words]) => words.some((w) => lower.includes(w)))
    .map(([tag]) => tag);
}
