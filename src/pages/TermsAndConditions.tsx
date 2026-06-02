import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, CreditCard } from 'lucide-react'

export default function TermsAndConditions() {
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

        <h1 className="font-serif font-semibold text-cream text-3xl lg:text-4xl mb-2">Términos y Condiciones</h1>
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-cream-muted mb-12">Vigente desde: 2 de junio de 2026</p>

        <div className="space-y-8 text-sm text-cream-muted leading-relaxed">
          <section>
            <h2 className="font-serif font-semibold text-cream text-lg mb-3">1. Objeto</h2>
            <p>
              Los presentes Términos y Condiciones regulan la contratación de servicios de desarrollo de software,
              automatización, diseño de sistemas, consultoría tecnológica y cualquier servicio ofrecido por{' '}
              <strong className="text-cream">soul:23</strong> a través de su sitio web y canales oficiales.
            </p>
          </section>

          <section>
            <h2 className="font-serif font-semibold text-cream text-lg mb-3">2. Contratación y pagos</h2>
            <p className="mb-4">
              Todos los proyectos y servicios requieren la aceptación expresa de estos términos antes del inicio.
              Los pagos se procesan a través de <strong className="text-cream">Stripe</strong> y se estructuran en las
              siguientes fases para proyectos de desarrollo de software:
            </p>
            <div className="bg-dark-secondary/50 border border-cream/10 p-5 mt-3">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-cream/10">
                    <th className="pb-3 pr-4 font-serif text-cream text-sm">Fase</th>
                    <th className="pb-3 font-serif text-cream text-sm">Monto</th>
                    <th className="pb-3 font-serif text-cream text-sm">Momento</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream/5">
                  <tr>
                    <td className="py-3 pr-4">Commit inicial / Kickoff</td>
                    <td className="py-3 text-gold">35%</td>
                    <td className="py-3">Al firmar el contrato y antes de iniciar el proyecto</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4">Testing y validación</td>
                    <td className="py-3 text-gold">50%</td>
                    <td className="py-3">Al entregar el sistema para pruebas y aprobación del cliente</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4">Cierre y entrega final</td>
                    <td className="py-3 text-gold">15%</td>
                    <td className="py-3">Al aprobar la entrega final y poner en producción</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-xs text-cream-muted/70">
              Para servicios recurrentes (retainers mensuales), el pago se realiza por adelantado cada mes.
              Para licencias y hardware, el pago es de contado al momento de la compra o en los términos
              acordados por escrito.
            </p>
          </section>

          <section>
            <h2 className="font-serif font-semibold text-cream text-lg mb-3">3. Link de pago con Stripe</h2>
            <div className="flex items-start gap-3 bg-dark-secondary/50 border border-cream/10 p-5">
              <CreditCard className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
              <div>
                <p className="mb-2">
                  Los pagos se realizan de forma segura a través de nuestra pasarela de pago Stripe.
                  Una vez acordado el alcance y firmado el contrato, te enviaremos el link de pago
                  correspondiente a cada fase.
                </p>
                <a
                  href="https://buy.stripe.com/REPLACE_WITH_ACTUAL_LINK"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-gold hover:underline text-xs font-mono uppercase tracking-wider"
                >
                  <span>Pagar con Stripe →</span>
                </a>
                <p className="text-[10px] text-cream-muted/50 mt-2">
                  Nota: Reemplaza el link anterior con tu link real de Stripe Payment Link antes de publicar.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-serif font-semibold text-cream text-lg mb-3">4. Alcance y entregables</h2>
            <p className="mb-3">
              El alcance de cada proyecto se define por escrito antes del inicio. Cualquier funcionalidad
              adicional fuera del alcance acordado se cotizará por separado y requerirá un addendum firmado.
            </p>
            <p>
              Los entregables incluyen el código fuente (salvo acuerdo distinto), documentación técnica básica,
              capacitación al equipo del cliente (cuando aplique) y el período de soporte post-entrega definido
              en el contrato.
            </p>
          </section>

          <section>
            <h2 className="font-serif font-semibold text-cream text-lg mb-3">5. Propiedad intelectual</h2>
            <p>
              Una vez cubierto el 100% del pago, el cliente adquiere los derechos de uso del sistema desarrollado
              a medida. soul:23 conserva los derechos sobre frameworks, librerías internas, metodologías y
              know-how reutilizable. Cualquier código o módulo de terceros queda sujeto a sus respectivas licencias.
            </p>
          </section>

          <section>
            <h2 className="font-serif font-semibold text-cream text-lg mb-3">6. Confidencialidad</h2>
            <p>
              Toda la información, datos, procesos y materiales compartidos por el cliente durante el proyecto
              serán tratados como estrictamente confidenciales. Esto incluye pero no se limita a: datos de
              operación, información de clientes finales, estrategias comerciales y datos financieros.
            </p>
          </section>

          <section>
            <h2 className="font-serif font-semibold text-cream text-lg mb-3">7. Soporte post-entrega</h2>
            <p>
              Cada proyecto incluye un período de soporte gratuito post-entrega (generalmente 30 días) para
              corrección de bugs y ajustes menores. Pasado este período, el soporte continuo puede contratarse
              como retainer mensual o por horas, según lo acordado.
            </p>
          </section>

          <section>
            <h2 className="font-serif font-semibold text-cream text-lg mb-3">8. Limitación de responsabilidad</h2>
            <p>
              soul:23 no será responsable por pérdidas indirectas, lucro cesante o daños emergentes derivados
              del uso del sistema fuera de las especificaciones acordadas. La responsabilidad total en cualquier
              caso no excederá el monto total pagado por el servicio en cuestión.
            </p>
          </section>

          <section>
            <h2 className="font-serif font-semibold text-cream text-lg mb-3">9. Resolución de conflictos</h2>
            <p>
              En caso de controversia, las partes se obligan a intentar una solución amistosa durante un período
              de 30 días naturales. De no lograrse, el conflicto se someterá a los tribunales competentes de la
              ciudad de Saltillo, Coahuila, México.
            </p>
          </section>

          <section>
            <h2 className="font-serif font-semibold text-cream text-lg mb-3">10. Modificaciones</h2>
            <p>
              soul:23 se reserva el derecho de actualizar estos Términos y Condiciones. Cualquier cambio será
              publicado en esta página con la fecha de vigencia actualizada. Se recomienda revisar esta página
              periódicamente.
            </p>
          </section>

          <section>
            <h2 className="font-serif font-semibold text-cream text-lg mb-3">11. Contacto</h2>
            <p>
              Para cualquier duda sobre estos términos, escríbenos a{' '}
              <a href="mailto:hi@soul23.mx" className="text-gold hover:underline">hi@soul23.mx</a> o
              por WhatsApp al{' '}
              <a href="https://wa.me/528442278408" className="text-gold hover:underline">+52 1 844 227 8408</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
