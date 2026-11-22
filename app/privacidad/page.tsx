import Image from 'next/image';
import Link from 'next/link';
import { VERSION_POLITICA } from '@/lib/politica';

export const metadata = {
  title: 'Política de Privacidad | Fluxira',
};

export default function Privacidad() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-50 p-4 md:p-12 font-sans text-gray-900">
      <div className="w-full max-w-2xl flex flex-col items-center p-6 md:p-10 bg-white rounded-3xl shadow-sm border border-gray-100">

        {/* Logo */}
        <div className="mb-6 flex justify-center w-full">
          <Image src="/logo.png" alt="Fluxira Logo" width={350} height={90} priority className="h-auto w-auto max-w-[240px] md:max-w-[300px]" />
        </div>

        {/* Título */}
        <div className="w-full mb-8 text-center">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-950">Política de Privacidad</h1>
          <p className="text-sm text-gray-400 mt-2">Última actualización: {VERSION_POLITICA.split('-').reverse().join('/')}</p>
        </div>

        {/* Contenido */}
        <div className="w-full prose-sm text-gray-700 leading-relaxed space-y-8">

          <section>
            <h2 className="text-base font-bold text-[#0087A5] uppercase tracking-wide mb-3">1. Dos contextos del servicio</h2>
            <p className="text-sm">Fluxira opera en dos contextos diferenciados: (a) un formulario web de captación de leads, mediante el cual particulares o empresas pueden solicitar un análisis de su factura eléctrica; y (b) una plataforma SaaS para gestores energéticos, que utilizan la herramienta para analizar las facturas de sus propios clientes, generar informes y hacer seguimiento de contratos.</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#0087A5] uppercase tracking-wide mb-3">2. Roles de tratamiento</h2>
            <p className="text-sm mb-3">El rol de Fluxira en el tratamiento de datos varía según la categoría del dato:</p>
            <p className="text-sm mb-2"><span className="font-semibold text-gray-800">Fluxira (Mario Domínguez Troncoso) como RESPONSABLE del tratamiento:</span> Fluxira determina los fines y medios del tratamiento de los datos de la cuenta del gestor energético: nombre, dirección de correo electrónico, nombre de la gestoría, logotipo y registros de envíos de email realizados desde la plataforma.</p>
            <p className="text-sm"><span className="font-semibold text-gray-800">Fluxira como ENCARGADO del tratamiento (art. 28 RGPD):</span> Respecto a los datos de los clientes del gestor —nombre o etiqueta del cliente, correo electrónico del cliente, CUPS, facturas en PDF, datos extraídos de las facturas, informes generados e historial de análisis— Fluxira actúa únicamente como encargado del tratamiento. El RESPONSABLE de dichos datos es el gestor energético, quien los cede a Fluxira exclusivamente para la prestación del servicio contratado.</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#0087A5] uppercase tracking-wide mb-3">3. Base jurídica</h2>
            <ul className="space-y-1.5 text-sm list-disc list-inside marker:text-[#0087A5]">
              <li><span className="font-semibold text-gray-800">Cuenta de gestor:</span> ejecución del contrato de servicio (art. 6.1.b RGPD).</li>
              <li><span className="font-semibold text-gray-800">Formulario web de captación:</span> consentimiento del interesado (art. 6.1.a RGPD), otorgado de forma expresa mediante la casilla de aceptación del formulario.</li>
            </ul>
            <p className="text-sm mt-3">El consentimiento puede retirarse en cualquier momento, sin que ello afecte a la licitud del tratamiento previo a su retirada.</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#0087A5] uppercase tracking-wide mb-3">4. Destinatarios y subencargados</h2>
            <p className="text-sm mb-3">Para la prestación del servicio se utilizan los siguientes proveedores tecnológicos, que actúan como subencargados del tratamiento:</p>
            <ul className="space-y-1.5 text-sm list-disc list-inside marker:text-[#0087A5]">
              <li><span className="font-semibold text-gray-800">Vercel</span> — alojamiento de la aplicación web.</li>
              <li><span className="font-semibold text-gray-800">Railway</span> — servidor de aplicaciones y base de datos, incluidos los archivos PDF almacenados.</li>
              <li><span className="font-semibold text-gray-800">Google Gemini API</span> — lectura automática de las facturas mediante IA para extracción de datos.</li>
              <li><span className="font-semibold text-gray-800">Resend</span> — servicio de envío de emails (informes a clientes del gestor).</li>
              <li><span className="font-semibold text-gray-800">Google (Gmail)</span> — buzón de recepción de los leads del formulario web.</li>
            </ul>
            {/* TODO: añadir cuando se confirme el plan de pago de Gemini */}
            <p className="text-sm mt-3">Algunos de estos proveedores pueden estar ubicados en Estados Unidos. Las transferencias internacionales se amparan en el Marco de Privacidad UE-EE. UU. (EU-US Data Privacy Framework) o, en su caso, en cláusulas contractuales tipo aprobadas por la Comisión Europea.</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#0087A5] uppercase tracking-wide mb-3">5. Plazos de conservación</h2>
            <ul className="space-y-1.5 text-sm list-disc list-inside marker:text-[#0087A5]">
              <li><span className="font-semibold text-gray-800">Leads (formulario web):</span> 6 meses desde la recepción, tras los cuales serán eliminados.</li>
              <li><span className="font-semibold text-gray-800">Plataforma:</span> mientras la cuenta del gestor esté activa. Tras la baja o solicitud de supresión, los datos del gestor y los de sus clientes (PDFs, informes, historial) se eliminarán en un plazo máximo de 30 días.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#0087A5] uppercase tracking-wide mb-3">6. Decisiones automatizadas</h2>
            <p className="text-sm">El análisis energético es un cálculo automático que el gestor revisa y sobre el que decide. No se adoptan decisiones con efectos jurídicos ni significativos sobre los interesados basadas exclusivamente en tratamiento automatizado (art. 22 RGPD).</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#0087A5] uppercase tracking-wide mb-3">7. Medidas de seguridad</h2>
            <p className="text-sm mb-3">Se aplican las siguientes medidas técnicas y organizativas para garantizar la seguridad de los datos:</p>
            <ul className="space-y-1.5 text-sm list-disc list-inside marker:text-[#0087A5]">
              <li>Autenticación mediante token JWT; cada gestor accede únicamente a sus propios clientes e informes.</li>
              <li>Contraseñas almacenadas con hash bcrypt, nunca en texto plano.</li>
              <li>Comunicaciones cifradas mediante HTTPS.</li>
              <li>Validación del tipo y tamaño de los archivos subidos.</li>
              <li>Los registros de actividad no incluyen el código CUPS completo, solo los últimos caracteres.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#0087A5] uppercase tracking-wide mb-3">8. Almacenamiento en el navegador</h2>
            <p className="text-sm">El token de sesión se almacena en <code className="bg-gray-100 px-1 rounded text-xs">localStorage</code> del navegador (no en cookies). Es un dato técnico necesario para mantener la sesión y no requiere consentimiento de cookies.</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#0087A5] uppercase tracking-wide mb-3">9. Responsable del tratamiento</h2>
            <ul className="space-y-1 text-sm">
              <li><span className="font-semibold text-gray-800">Titular:</span> Mario Domínguez Troncoso</li>
              <li><span className="font-semibold text-gray-800">Correo electrónico:</span> mario@fluxira.es</li>
              <li><span className="font-semibold text-gray-800">Sitio web:</span> https://fluxira.es</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#0087A5] uppercase tracking-wide mb-3">10. Derechos del interesado</h2>
            <p className="text-sm mb-3">El usuario puede ejercer los siguientes derechos:</p>
            <ul className="space-y-1.5 text-sm list-disc list-inside marker:text-[#0087A5]">
              <li>Acceso a sus datos personales</li>
              <li>Rectificación de datos inexactos</li>
              <li>Supresión de sus datos</li>
              <li>Limitación del tratamiento</li>
              <li>Oposición al tratamiento</li>
              <li>Portabilidad de los datos</li>
            </ul>
            <p className="text-sm mt-3">Para ejercerlos, puede dirigirse a <a href="mailto:mario@fluxira.es" className="text-[#0087A5] hover:underline font-medium">mario@fluxira.es</a>, indicando el derecho que desea ejercer y acompañando copia de un documento identificativo.</p>
            <p className="text-sm mt-3 text-gray-500">Los clientes finales del gestor que deseen ejercer derechos sobre los datos de sus facturas (acceso, rectificación, supresión, etc.) deben dirigirse directamente al gestor energético, que es el responsable del tratamiento de dichos datos.</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#0087A5] uppercase tracking-wide mb-3">11. Reclamación ante la AEPD</h2>
            <p className="text-sm">Tiene derecho a presentar una reclamación ante la Agencia Española de Protección de Datos (<a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer" className="text-[#0087A5] hover:underline font-medium">www.aepd.es</a>) si considera que el tratamiento no se ajusta a la normativa vigente.</p>
          </section>

        </div>

        {/* Separador */}
        <div className="w-full border-t border-gray-100 mt-10 pt-6 flex justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-[#0087A5] px-6 py-3 text-sm font-semibold text-white hover:bg-[#006e88] transition-colors shadow-md hover:shadow-lg"
          >
            ← Volver al inicio
          </Link>
        </div>

      </div>
    </main>
  );
}
