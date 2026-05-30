import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function PrivacyPolicy() {
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

        <h1 className="font-serif font-semibold text-cream text-3xl lg:text-4xl mb-2">Política de Privacidad</h1>
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-cream-muted mb-12">Última actualización: 30 de mayo de 2026</p>

        <div className="space-y-8 text-sm text-cream-muted leading-relaxed">
          <section>
            <h2 className="font-serif font-semibold text-cream text-lg mb-3">1. Identidad del responsable</h2>
            <p>
              El responsable del tratamiento de los datos personales es <strong className="text-cream">soul:23</strong>, 
              con domicilio en Saltillo, Coahuila, México, operando bajo la marca <strong className="text-cream">soul:23</strong>.
              Puedes contactarnos en <a href="mailto:hi@soul23.mx" className="text-gold hover:underline">hi@soul23.mx</a> o 
              por WhatsApp al <a href="https://wa.me/528442278408" className="text-gold hover:underline">+52 1 844 227 8408</a>.
              Para temas de privacidad y datos personales, escribe a{' '}
              <a href="mailto:privacy@soul23.mx" className="text-gold hover:underline">privacy@soul23.mx</a>.
            </p>
          </section>

          <section>
            <h2 className="font-serif font-semibold text-cream text-lg mb-3">2. ¿Qué datos recopilamos?</h2>
            <p className="mb-3">Podemos recopilar los siguientes datos personales:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li><strong className="text-cream">Datos de contacto:</strong> nombre, correo electrónico, teléfono, nombre del negocio.</li>
              <li><strong className="text-cream">Datos operativos:</strong> tipo de negocio, necesidades identificadas, descripción de la operación.</li>
              <li><strong className="text-cream">Datos técnicos:</strong> dirección IP, tipo de navegador, dispositivo, cookies y datos de uso del sitio.</li>
              <li><strong className="text-cream">Datos de comunicación:</strong> mensajes enviados a través de WhatsApp, email o el chatbot Talia.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif font-semibold text-cream text-lg mb-3">3. ¿Con qué finalidad?</h2>
            <p className="mb-3">Tus datos se utilizan para:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Responder a solicitudes de información y cotizaciones.</li>
              <li>Prestar los servicios contratados (diseño de sistemas, dashboards, bots).</li>
              <li>Enviar comunicaciones relacionadas con el servicio.</li>
              <li>Mejorar nuestros productos y servicios mediante análisis de uso.</li>
              <li>Cumplir con obligaciones legales.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif font-semibold text-cream text-lg mb-3">4. Uso de cookies</h2>
            <p>
              Utilizamos cookies y tecnologías similares para mejorar tu experiencia, analizar el tráfico 
              y personalizar contenido. Puedes gestionar tus preferencias de cookies en cualquier momento 
              desde la configuración de tu navegador.
            </p>
          </section>

          <section>
            <h2 className="font-serif font-semibold text-cream text-lg mb-3">5. Compartición de datos</h2>
            <p>
              No vendemos ni alquilamos tus datos personales. Solo compartimos información con proveedores 
              de servicios esenciales (hosting, analytics, comunicación) bajo estrictos acuerdos de confidencialidad 
              y solo cuando es necesario para la prestación del servicio.
            </p>
          </section>

          <section>
            <h2 className="font-serif font-semibold text-cream text-lg mb-3">6. Seguridad</h2>
            <p>
              Implementamos medidas técnicas y organizativas apropiadas para proteger tus datos contra 
              acceso no autorizado, pérdida, alteración o destrucción. Esto incluye encriptación, 
              firewalls y acceso restringido al personal autorizado.
            </p>
          </section>

          <section>
            <h2 className="font-serif font-semibold text-cream text-lg mb-3">7. Tus derechos (ARCO)</h2>
            <p className="mb-3">
              De acuerdo con la Ley Federal de Protección de Datos Personales en Posesión de los Particulares 
              (México), tienes derecho a:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li><strong className="text-cream">Acceder</strong> a tus datos personales.</li>
              <li><strong className="text-cream">Rectificar</strong> datos inexactos o incompletos.</li>
              <li><strong className="text-cream">Cancelar</strong> el tratamiento de tus datos.</li>
              <li><strong className="text-cream">Oponerte</strong> al uso de tus datos para fines específicos.</li>
            </ul>
            <p className="mt-3">
              Para ejercer estos derechos, envía un correo a{' '}
              <a href="mailto:privacy@soul23.mx" className="text-gold hover:underline">privacy@soul23.mx</a> con 
              el asunto "Derechos ARCO".
            </p>
          </section>

          <section>
            <h2 className="font-serif font-semibold text-cream text-lg mb-3">8. Conservación</h2>
            <p>
              Conservamos tus datos personales durante el tiempo necesario para cumplir con las finalidades 
              descritas y las obligaciones legales aplicables. Una vez finalizado este período, tus datos 
              se eliminan de forma segura.
            </p>
          </section>

          <section>
            <h2 className="font-serif font-semibold text-cream text-lg mb-3">9. Cambios a esta política</h2>
            <p>
              Podemos actualizar esta política ocasionalmente. Te notificaremos de cambios significativos 
              mediante el sitio web o por correo electrónico.
            </p>
          </section>

          <section>
            <h2 className="font-serif font-semibold text-cream text-lg mb-3">10. Contacto</h2>
            <p>
              Si tienes preguntas sobre esta política, contactanos en{' '}
              <a href="mailto:privacy@soul23.mx" className="text-gold hover:underline">privacy@soul23.mx</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
