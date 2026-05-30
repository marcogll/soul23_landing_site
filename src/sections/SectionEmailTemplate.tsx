import { useRef, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Download, Star, TrendingUp, Clock, AlertTriangle, Users } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

export default function SectionEmailTemplate() {
  const sectionRef = useRef<HTMLElement>(null)

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

  const downloadHTML = () => {
    const htmlContent = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Reporte de Feedback - soul:23</title>
<style>
  body { margin: 0; padding: 0; background: #f5f5f0; font-family: Georgia, 'Times New Roman', serif; }
  .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
  .header { background: #0F0E13; padding: 30px; text-align: center; }
  .header h1 { color: #C8B26B; font-size: 24px; margin: 0; font-weight: 600; }
  .header p { color: #A7A29A; font-size: 12px; margin: 8px 0 0; font-family: monospace; text-transform: uppercase; letter-spacing: 2px; }
  .body { padding: 30px; }
  .greeting { font-size: 18px; color: #0F0E13; margin-bottom: 20px; }
  .date { font-family: monospace; font-size: 11px; color: #A7A29A; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 25px; }
  .kpi-row { display: flex; gap: 15px; margin-bottom: 25px; }
  .kpi { flex: 1; background: #f8f7f2; padding: 20px; text-align: center; border-radius: 4px; }
  .kpi-value { font-size: 28px; font-weight: 600; color: #C8B26B; margin-bottom: 4px; }
  .kpi-label { font-family: monospace; font-size: 9px; color: #A7A29A; text-transform: uppercase; letter-spacing: 1px; }
  .section-title { font-size: 16px; font-weight: 600; color: #0F0E13; margin: 25px 0 15px; border-bottom: 1px solid #e0ddd5; padding-bottom: 8px; }
  .insight { background: #f8f7f2; border-left: 3px solid #C8B26B; padding: 15px 20px; margin: 15px 0; font-size: 14px; color: #0F0E13; font-style: italic; }
  .alert { background: #fff5f5; border-left: 3px solid #e74c3c; padding: 15px 20px; margin: 10px 0; }
  .alert-title { font-size: 12px; font-weight: 600; color: #e74c3c; margin-bottom: 4px; }
  .alert-text { font-size: 13px; color: #0F0E13; }
  .rating-bar { display: flex; align-items: center; gap: 10px; margin: 8px 0; }
  .rating-label { font-size: 12px; color: #0F0E13; width: 120px; }
  .rating-track { flex: 1; height: 8px; background: #e0ddd5; border-radius: 4px; overflow: hidden; }
  .rating-fill { height: 100%; background: #C8B26B; border-radius: 4px; }
  .rating-value { font-family: monospace; font-size: 11px; color: #A7A29A; width: 30px; text-align: right; }
  .footer { background: #0F0E13; padding: 25px 30px; text-align: center; }
  .footer p { color: #A7A29A; font-size: 11px; margin: 0; font-family: monospace; }
  .footer a { color: #C8B26B; text-decoration: none; }
</style>
</head>
<body>
<div class="container">
  <div class="header">
    <h1>soul:23</h1>
    <p>Reporte de Feedback Automático</p>
  </div>
  
  <div class="body">
    <div class="greeting">Buenos días, Roberto</div>
    <div class="date">Reporte del 26 de mayo de 2026 · Restaurante El Sabor</div>
    
    <div class="kpi-row">
      <div class="kpi">
        <div class="kpi-value">4.3</div>
        <div class="kpi-label">Calificación promedio</div>
      </div>
      <div class="kpi">
        <div class="kpi-value">31</div>
        <div class="kpi-label">Encuestas recibidas</div>
      </div>
      <div class="kpi">
        <div class="kpi-value">92%</div>
        <div class="kpi-label">Tasa de respuesta</div>
      </div>
    </div>
    
    <div class="section-title">Insights de la IA</div>
    <div class="insight">
      "El sabor recibió la mejor calificación de la semana (4.7/5). La mayoría de clientes destacó la consistencia. Sin embargo, detecté 4 quejas sobre tiempo de espera entre 8:30-9:30 PM. Recomendación: revisar staffing de cocina en ese horario."
    </div>
    
    <div class="section-title">Alertas que requieren atención</div>
    <div class="alert">
      <div class="alert-title">Mesa 8 - Anoche 9:15 PM</div>
      <div class="alert-text">Cliente calificó "Regular" en tiempo de espera. Comentó: "La comida tardó mucho". Calificación general: 2/5 estrellas.</div>
    </div>
    <div class="alert">
      <div class="alert-title">Patrón detectado</div>
      <div class="alert-text">3 de las 4 quejas de esta semana fueron los viernes después de las 8 PM. La IA sugiere aumentar personal de cocina ese día/horario.</div>
    </div>
    
    <div class="section-title">Desglose por categoría</div>
    <div class="rating-bar">
      <div class="rating-label">Sabor</div>
      <div class="rating-track"><div class="rating-fill" style="width: 94%"></div></div>
      <div class="rating-value">4.7</div>
    </div>
    <div class="rating-bar">
      <div class="rating-label">Tiempo de espera</div>
      <div class="rating-track"><div class="rating-fill" style="width: 72%"></div></div>
      <div class="rating-value">3.6</div>
    </div>
    <div class="rating-bar">
      <div class="rating-label">Atención</div>
      <div class="rating-track"><div class="rating-fill" style="width: 90%"></div></div>
      <div class="rating-value">4.5</div>
    </div>
    <div class="rating-bar">
      <div class="rating-label">Limpieza</div>
      <div class="rating-track"><div class="rating-fill" style="width: 96%"></div></div>
      <div class="rating-value">4.8</div>
    </div>
    <div class="rating-bar">
      <div class="rating-label">Relación precio</div>
      <div class="rating-track"><div class="rating-fill" style="width: 84%"></div></div>
      <div class="rating-value">4.2</div>
    </div>
    
    <div class="section-title">Comentarios destacados</div>
    <div class="insight" style="border-left-color: #27ae60;">
      "La mejor birria que he probado en Saltillo. El mesero muy atento. Volveremos con toda la familia." ★★★★★
    </div>
    <div class="insight" style="border-left-color: #e74c3c;">
      "La comida excelente pero esperamos 40 minutos. Eso sí necesita arreglarse." ★★★☆☆
    </div>
  </div>
  
  <div class="footer">
    <p>Este reporte fue generado automáticamente por <strong style="color: #C8B26B;">soul:23</strong> usando IA.</p>
    <p style="margin-top: 8px;"><a href="https://soul23.mx">soul23.mx</a> · <a href="mailto:hi@soul23.mx">hi@soul23.mx</a></p>
  </div>
</div>
</body>
</html>`

    const blob = new Blob([htmlContent], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'reporte-feedback-demo-soul23.html'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <section ref={sectionRef} id="email-template" className="relative w-full bg-dark-primary" style={{ zIndex: 56 }}>
      <div className="max-w-5xl mx-auto px-6 lg:px-12 py-24 lg:py-32">
        <div className="text-center mb-12">
          <span className="reveal font-mono text-[10px] uppercase tracking-[0.18em] text-gold mb-4 block" style={{ opacity: 0 }}>
            Reporte por email
          </span>
          <h2 className="reveal font-serif font-semibold text-cream leading-[1.05] mb-4" style={{ fontSize: 'clamp(24px, 3vw, 42px)', opacity: 0 }}>
            Así se ve el reporte que recibes.<br />
            <span className="text-gold">Claro, accionable, automático.</span>
          </h2>
          <p className="reveal text-cream-muted text-sm max-w-lg mx-auto" style={{ opacity: 0 }}>
            Cada mañana un email con todo lo que necesitas saber. Sin abrir dashboards complicados.
            Descarga el demo y envíalo a quien quieras.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left: Email preview */}
          <div className="reveal lg:col-span-3" style={{ opacity: 0 }}>
            <div className="bg-cream rounded-sm overflow-hidden shadow-2xl">
              {/* Email header */}
              <div className="bg-dark-primary px-5 py-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center">
                  <span className="font-serif text-sm text-gold">s:23</span>
                </div>
                <div>
                  <p className="text-xs text-cream font-medium">soul:23 Feedback AI</p>
                  <p className="text-[8px] text-cream-muted font-mono uppercase tracking-wider">Reporte diario · Restaurante El Sabor</p>
                </div>
              </div>
              {/* Email body */}
              <div className="p-6 text-dark-primary">
                <p className="text-base font-serif mb-1">Buenos días, Roberto</p>
                <p className="text-[10px] text-gray-500 font-mono uppercase tracking-wider mb-6">26 mayo 2026</p>

                {/* KPIs */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="bg-gray-50 p-3 text-center rounded">
                    <p className="font-serif text-2xl text-gold-dark" style={{ color: '#a89450' }}>4.3</p>
                    <p className="text-[8px] text-gray-500 font-mono uppercase tracking-wider">Promedio</p>
                  </div>
                  <div className="bg-gray-50 p-3 text-center rounded">
                    <p className="font-serif text-2xl text-gold-dark" style={{ color: '#a89450' }}>31</p>
                    <p className="text-[8px] text-gray-500 font-mono uppercase tracking-wider">Encuestas</p>
                  </div>
                  <div className="bg-gray-50 p-3 text-center rounded">
                    <p className="font-serif text-2xl text-gold-dark" style={{ color: '#a89450' }}>92%</p>
                    <p className="text-[8px] text-gray-500 font-mono uppercase tracking-wider">Respuesta</p>
                  </div>
                </div>

                {/* Insight */}
                <div className="bg-amber-50/50 border-l-3 border-gold p-4 mb-5 text-sm text-dark-primary italic" style={{ borderLeft: '3px solid #C8B26B' }}>
                  "El sabor recibió la mejor calificación de la semana. Detecté 4 quejas sobre tiempo de espera entre 8:30-9:30 PM. Recomendación: revisar staffing de cocina."
                </div>

                {/* Alert */}
                <div className="bg-red-50 border-l-3 border-red-400 p-3 mb-5" style={{ borderLeft: '3px solid #e74c3c' }}>
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle className="w-3 h-3 text-red-500" />
                    <p className="text-xs font-semibold text-red-500">Mesa 8 - Anoche 9:15 PM</p>
                  </div>
                  <p className="text-xs text-gray-600">"La comida tardó mucho" · Calificación: ★★☆☆☆</p>
                </div>

                {/* Rating bars */}
                <p className="text-xs font-semibold text-dark-primary mb-3 border-b border-gray-200 pb-2">Desglose por categoría</p>
                {[
                  { label: 'Sabor', value: 94, score: '4.7' },
                  { label: 'Tiempo', value: 72, score: '3.6' },
                  { label: 'Atención', value: 90, score: '4.5' },
                  { label: 'Limpieza', value: 96, score: '4.8' },
                ].map(r => (
                  <div key={r.label} className="flex items-center gap-2 mb-2">
                    <span className="text-[11px] text-dark-primary w-20">{r.label}</span>
                    <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${r.value}%`, background: '#C8B26B' }} />
                    </div>
                    <span className="text-[10px] text-gray-500 font-mono w-6 text-right">{r.score}</span>
                  </div>
                ))}
              </div>
              {/* Email footer */}
              <div className="bg-gray-50 px-5 py-3 text-center">
                <p className="text-[9px] text-gray-400 font-mono">Generado automáticamente por soul:23 · soul23.mx</p>
              </div>
            </div>
          </div>

          {/* Right: Features + CTA */}
          <div className="lg:col-span-2 flex flex-col justify-center">
            <div className="reveal space-y-4 mb-8" style={{ opacity: 0 }}>
              {[
                { icon: Star, text: 'Calificación promedio con desglose por categoría' },
                { icon: TrendingUp, text: 'Tendencias comparativas (semana vs semana)' },
                { icon: Clock, text: 'Alertas en tiempo real cuando algo va mal' },
                { icon: AlertTriangle, text: 'Detección de patrones con recomendaciones de IA' },
                { icon: Users, text: 'Comentarios destacados de clientes reales' },
              ].map(({ icon: Icon, text }, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Icon className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                  <p className="text-sm text-cream-muted">{text}</p>
                </div>
              ))}
            </div>

            <div className="reveal" style={{ opacity: 0 }}>
              <button onClick={downloadHTML} className="pill-accent inline-flex items-center gap-2 mb-4">
                <Download className="w-3.5 h-3.5" />
                Descargar email demo
              </button>
              <p className="text-xs text-cream-muted/50">
                Descarga el HTML y ábrelo en tu navegador para ver cómo se vería el reporte. 
                Puedes enviarlo por email a quien quieras como demo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
