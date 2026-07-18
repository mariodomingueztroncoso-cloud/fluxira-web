import Image from 'next/image';
import Link from 'next/link';

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
          <p className="text-sm text-gray-400 mt-2">Última actualización: 18/07/2026</p>
        </div>

        {/* Contenido */}
        <div className="w-full prose-sm text-gray-700 leading-relaxed space-y-8">

          <section>
            <h2 className="text-base font-bold text-[#0087A5] uppercase tracking-wide mb-3">1. Responsable del tratamiento</h2>
            <ul className="space-y-1 text-sm">
              <li><span className="font-semibold text-gray-800">Titular:</span> Mario Domínguez Troncoso</li>
              <li><span className="font-semibold text-gray-800">NIF:</span> 49343736L</li>
              <li><span className="font-semibold text-gray-800">Domicilio:</span> Calle José Zorrilla nº7, Dúplex 8, 11540 Sanlúcar de Barrameda, Cádiz.</li>
              <li><span className="font-semibold text-gray-800">Correo electrónico:</span> mario@fluxira.es</li>
              <li><span className="font-semibold text-gray-800">Sitio web:</span> https://fluxira.es</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#0087A5] uppercase tracking-wide mb-3">2. Datos que recogemos</h2>
            <p className="text-sm mb-3">A través del formulario de este sitio web recogemos:</p>
            <ul className="space-y-1.5 text-sm list-disc list-inside marker:text-[#0087A5]">
              <li>Nombre o nombre del negocio</li>
              <li>Teléfono de contacto</li>
              <li>Correo electrónico (opcional)</li>
              <li>Factura de electricidad en formato PDF, que puede contener datos identificativos del titular del suministro (nombre, dirección de suministro, CUPS, número de contrato, datos de consumo y facturación)</li>
            </ul>
            <p className="text-sm mt-3">No recogemos categorías especiales de datos personales.</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#0087A5] uppercase tracking-wide mb-3">3. Finalidad del tratamiento</h2>
            <p className="text-sm mb-3">Los datos se tratan con las siguientes finalidades:</p>
            <ul className="space-y-1.5 text-sm list-disc list-inside marker:text-[#0087A5]">
              <li>Analizar la factura eléctrica facilitada para identificar posibles ahorros en la potencia contratada, energía reactiva u otros conceptos facturables.</li>
              <li>Ponerse en contacto con el usuario para comunicarle el resultado del análisis.</li>
              <li>En su caso, gestionar la prestación del servicio contratado y su facturación.</li>
            </ul>
            <p className="text-sm mt-3">No se realizan decisiones automatizadas ni elaboración de perfiles.</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#0087A5] uppercase tracking-wide mb-3">4. Base jurídica</h2>
            <p className="text-sm mb-3">La base legal para el tratamiento es el consentimiento del interesado (art. 6.1.a RGPD), otorgado de forma expresa mediante la casilla de aceptación del formulario. En caso de que se formalice una relación contractual, la base será la ejecución de un contrato (art. 6.1.b RGPD).</p>
            <p className="text-sm">El consentimiento puede retirarse en cualquier momento, sin que ello afecte a la licitud del tratamiento previo a su retirada.</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#0087A5] uppercase tracking-wide mb-3">5. Conservación de los datos</h2>
            <p className="text-sm mb-3">Los datos y las facturas remitidas se conservarán:</p>
            <ul className="space-y-1.5 text-sm list-disc list-inside marker:text-[#0087A5]">
              <li>Si no se llega a contratar el servicio: durante un máximo de 6 meses desde su recepción, tras los cuales serán eliminados.</li>
              <li>Si se contrata el servicio: durante la vigencia de la relación y, posteriormente, durante los plazos legalmente exigibles en materia fiscal y mercantil.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#0087A5] uppercase tracking-wide mb-3">6. Destinatarios y cesiones</h2>
            <p className="text-sm mb-3">Con carácter general, los datos no se ceden a terceros.</p>
            <p className="text-sm mb-3">No obstante, para la prestación del servicio se utilizan proveedores tecnológicos que actúan como encargados del tratamiento:</p>
            <ul className="space-y-1.5 text-sm list-disc list-inside marker:text-[#0087A5]">
              <li>Vercel Inc. (alojamiento del sitio web)</li>
              <li>Google LLC (servicio de correo electrónico para la recepción de los formularios)</li>
            </ul>
            <p className="text-sm mt-3">Adicionalmente, en caso de que el usuario solicite expresamente la tramitación de una modificación de potencia contratada o un cambio de comercializadora, sus datos podrán ser comunicados a la comercializadora o distribuidora eléctrica correspondiente, únicamente con su autorización previa y para dicha finalidad.</p>
            <p className="text-sm mt-3">Algunos de estos proveedores pueden implicar transferencias internacionales de datos, amparadas en las garantías previstas en el Capítulo V del RGPD.</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#0087A5] uppercase tracking-wide mb-3">7. Derechos del interesado</h2>
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
            <p className="text-sm mt-3">Asimismo, tiene derecho a presentar una reclamación ante la Agencia Española de Protección de Datos (<a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer" className="text-[#0087A5] hover:underline font-medium">www.aepd.es</a>) si considera que el tratamiento no se ajusta a la normativa vigente.</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#0087A5] uppercase tracking-wide mb-3">8. Medidas de seguridad</h2>
            <p className="text-sm">Se aplican las medidas técnicas y organizativas necesarias para garantizar la seguridad de los datos y evitar su alteración, pérdida, tratamiento o acceso no autorizado, de acuerdo con el estado de la tecnología y la naturaleza de los datos tratados.</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#0087A5] uppercase tracking-wide mb-3">9. Modificaciones</h2>
            <p className="text-sm">Esta política podrá ser modificada para adaptarla a cambios normativos o en los servicios prestados. Se recomienda su consulta periódica.</p>
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
