import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidad",
  description: "Política de privacidad de Prode Mundial 2026.",
  robots: { index: false },
};

export default function PrivacidadPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-ink-900 mb-2">
        Política de Privacidad
      </h1>
      <p className="text-sm text-gray-400 mb-8">Última actualización: mayo de 2026</p>

      <div className="prose prose-sm prose-gray max-w-none space-y-6 text-ink-900">

        <section>
          <h2 className="text-base font-bold text-ink-900 mb-2">1. Información que recopilamos</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Prode Mundial 2026 recopila la siguiente información cuando usás el sitio:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-gray-600">
            <li>Dirección de correo electrónico y nombre de usuario al registrarte.</li>
            <li>Foto de perfil (opcional), almacenada en nuestros servidores.</li>
            <li>Predicciones de partidos y resultados bonus que ingresás voluntariamente.</li>
            <li>Datos de uso e interacción con el sitio (páginas visitadas, tiempo de sesión).</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-ink-900 mb-2">2. Cómo usamos tu información</h2>
          <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
            <li>Proveer y mantener el servicio de prode online.</li>
            <li>Calcular puntajes y mostrar el leaderboard de cada torneo.</li>
            <li>Enviarte notificaciones relacionadas con tu cuenta (solo si las activás).</li>
            <li>Mejorar la experiencia del sitio y detectar problemas técnicos.</li>
          </ul>
          <p className="text-sm text-gray-600 mt-2">
            No vendemos ni compartimos tu información personal con terceros con fines comerciales.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-ink-900 mb-2">3. Servicios de terceros</h2>

          <h3 className="text-sm font-semibold text-ink-900 mb-1 mt-3">Firebase (Google)</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Usamos Firebase Authentication y Firestore (de Google) para autenticación y almacenamiento de datos.
            Google puede procesar datos según su{" "}
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-celeste-600 hover:underline">
              Política de Privacidad
            </a>.
          </p>

          <h3 className="text-sm font-semibold text-ink-900 mb-1 mt-3">Google AdSense</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Este sitio utiliza Google AdSense para mostrar publicidad. Google AdSense usa cookies y tecnologías
            similares para mostrar anuncios relevantes basados en tus visitas a este y otros sitios.
            Podés optar por no recibir publicidad personalizada en{" "}
            <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-celeste-600 hover:underline">
              Configuración de anuncios de Google
            </a>.
          </p>
          <p className="text-sm text-gray-600 mt-2">
            <strong>Importante:</strong> Este sitio no permite anuncios de casas de apuestas ni juegos de azar.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-ink-900 mb-2">4. Cookies</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Usamos cookies estrictamente necesarias para el funcionamiento del sitio (sesión de usuario) y
            cookies de terceros utilizadas por Google AdSense para personalizar anuncios.
            Al continuar usando el sitio, aceptás el uso de estas cookies.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-ink-900 mb-2">5. Retención de datos</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Tus datos se conservan mientras tu cuenta esté activa. Podés eliminar tu cuenta en cualquier momento
            desde la página de Perfil, lo que borrará todos tus datos personales y predicciones de nuestros
            servidores.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-ink-900 mb-2">6. Seguridad</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Implementamos medidas de seguridad razonables para proteger tu información. La autenticación
            está gestionada por Firebase Authentication de Google, que cumple con los estándares de
            seguridad de la industria.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-ink-900 mb-2">7. Menores de edad</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Este sitio no está dirigido a menores de 13 años. No recopilamos intencionalmente información
            de menores. Si sos menor de 13 años, por favor no uses este servicio.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-ink-900 mb-2">8. Cambios a esta política</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Podemos actualizar esta Política de Privacidad ocasionalmente. Te notificaremos de cambios
            significativos publicando la nueva política en esta página con la fecha de actualización.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-ink-900 mb-2">9. Contacto</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Si tenés preguntas sobre esta política de privacidad, podés contactarnos en:{" "}
            <a href="mailto:santiago.majorani@yahoo.com" className="text-celeste-600 hover:underline">
              santiago.majorani@yahoo.com
            </a>
          </p>
        </section>

      </div>
    </div>
  );
}
