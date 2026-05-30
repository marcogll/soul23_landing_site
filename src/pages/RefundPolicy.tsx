import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function RefundPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-screen bg-dark-primary pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-6 lg:px-12">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-cream-muted hover:text-gold transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          Volver al inicio
        </Link>

        <h1 className="font-serif font-semibold text-cream text-3xl lg:text-4xl mb-2">Política de Reembolso</h1>
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-cream-muted mb-12">Vigente desde: 30 de mayo de 2026</p>

        <div className="space-y-8 text-sm text-cream-muted leading-relaxed">
          <section>
            <h2 className="font-serif font-semibold text-cream text-lg mb-3">1. Alcance</h2>
            <p>
              Esta política aplica a todos los servicios contratados con <strong className="text-cream">soul:23</strong> 
              incluyendo pero no limitado a: diseño de sistemas, 
              desarrollo de dashboards, implementación de bots, integraciones y servicios de automatización.
            </p>
          </section>

          <section>
            <h2 className="font-serif font-semibold text-cream text-lg mb-3">2. Modelo de trabajo</h2>
            <p>
              Nuestros servicios son proyectos personalizados de desarrollo de software. Cada proyecto 
              se estructura en fases con entregables definidos. El trabajo comienza después de la firma 
              del contrato y el pago del anticipo correspondiente.
            </p>
          </section>

          <section>
            <h2 className="font-serif font-semibold text-cream text-lg mb-3">3. Política de reembolso por fase</h2>
            <div className="bg-dark-secondary/50 border border-cream/10 p-5 mt-3">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-cream/10">
                    <th className="pb-3 pr-4 font-serif text-cream text-sm">Momento</th>
                    <th className="pb-3 font-serif text-cream text-sm">Reembolso</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream/5">
                  <tr>
                    <td className="py-3 pr-4">Antes de iniciar el proyecto</td>
                    <td className="py-3 text-gold">100% del anticipo</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4">Durante la fase de investigación</td>
                    <td className="py-3 text-gold">80% del monto total pagado</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4">Durante la fase de diseño</td>
                    <td className="py-3 text-gold">50% del monto total pagado</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4">Durante la fase de desarrollo</td>
                    <td className="py-3 text-gold">25% del monto total pagado</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4">Después de la entrega final</td>
                    <td className="py-3 text-cream-muted/60">No aplica reembolso</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="font-serif font-semibold text-cream text-lg mb-3">4. Garantía de satisfacción</h2>
            <p>
              Ofrecemos <strong className="text-cream">30 días de garantía</strong> post-entrega para correcciones 
              de bugs y ajustes menores sin costo adicional. Esto no incluye cambios de alcance o nuevas funcionalidades.
            </p>
          </section>

          <section>
            <h2 className="font-serif font-semibold text-cream text-lg mb-3">5. Cancelación por parte de soul:23</h2>
            <p>
              En caso de que soul:23 deba cancelar el proyecto por causas imputables a nosotros, 
              el cliente recibirá un reembolso proporcional del trabajo no realizado, más una 
              compensación equivalente al 10% del monto total del proyecto.
            </p>
          </section>

          <section>
            <h2 className="font-serif font-semibold text-cream text-lg mb-3">6. Suscripciones y servicios recurrentes</h2>
            <p>
              Para servicios de mantenimiento o suscripciones mensuales, puedes cancelar en cualquier momento. 
              No se realizan reembolsos por el período actual en curso, pero la cancelación será efectiva 
              al final del período de facturación.
            </p>
          </section>

          <section>
            <h2 className="font-serif font-semibold text-cream text-lg mb-3">7. Proceso de solicitud</h2>
            <p className="mb-3">Para solicitar un reembolso:</p>
            <ol className="list-decimal list-inside space-y-1 ml-2">
              <li>Envía un correo a <a href="mailto:hi@soul23.mx" className="text-gold hover:underline">hi@soul23.mx</a> con el asunto "Solicitud de reembolso".</li>
              <li>Incluye tu nombre, nombre del proyecto y motivo de la solicitud.</li>
              <li>Recibirás una respuesta en un plazo de 5 días hábiles.</li>
              <li>Si es aprobado, el reembolso se procesará en un plazo de 10 días hábiles.</li>
            </ol>
          </section>

          <section>
            <h2 className="font-serif font-semibold text-cream text-lg mb-3">8. Método de reembolso</h2>
            <p>
              Los reembolsos se realizan a través del mismo método de pago utilizado en la transacción original. 
              En caso de no ser posible, se coordinará una transferencia bancaria.
            </p>
          </section>

          <section>
            <h2 className="font-serif font-semibold text-cream text-lg mb-3">9. Contacto</h2>
            <p>
              Para cualquier duda sobre esta política, escríbenos a{' '}
              <a href="mailto:hi@soul23.mx" className="text-gold hover:underline">hi@soul23.mx</a> o 
              por WhatsApp al <a href="https://wa.me/528442278408" className="text-gold hover:underline">+52 1 844 227 8408</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
