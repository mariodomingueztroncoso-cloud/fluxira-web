import Image from 'next/image';
import Link from 'next/link';
import { VERSION_ENCARGO } from '@/lib/encargo';

export const metadata = {
  title: 'Condiciones del encargo de tratamiento | Fluxira',
};

{/* revisar con un asesor antes del primer cliente de pago; basarse en las directrices de la AEPD para contratos responsable-encargado */}

export default function Encargo() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-50 p-4 md:p-12 font-sans text-gray-900">
      <div className="w-full max-w-2xl flex flex-col items-center p-6 md:p-10 bg-white rounded-3xl shadow-sm border border-gray-100">

        {/* Logo */}
        <div className="mb-6 flex justify-center w-full">
          <Image src="/logo.png" alt="Fluxira Logo" width={350} height={90} priority className="h-auto w-auto max-w-[240px] md:max-w-[300px]" />
        </div>

        {/* Título */}
        <div className="w-full mb-8 text-center">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-950">Condiciones del encargo de tratamiento de datos</h1>
          <p className="text-sm text-gray-400 mt-2">Última actualización: {VERSION_ENCARGO.split('-').reverse().join('/')}</p>
        </div>

        {/* Contenido */}
        <div className="w-full prose-sm text-gray-700 leading-relaxed space-y-8">

          <section>
            <h2 className="text-base font-bold text-[#0087A5] uppercase tracking-wide mb-3">1. Partes</h2>
            <ul className="space-y-1.5 text-sm list-disc list-inside marker:text-[#0087A5]">
              <li><span className="font-semibold text-gray-800">Responsable del tratamiento (el gestor):</span> la persona física o jurídica que crea una cuenta en Fluxira y sube facturas de sus clientes para su análisis.</li>
              <li><span className="font-semibold text-gray-800">Encargado del tratamiento:</span> Mario Domínguez Troncoso, titular de Fluxira (mario@fluxira.es).</li>
            </ul>
            <p className="text-sm mt-3">Al aceptar estas condiciones en el momento del registro, el gestor y Fluxira formalizan el presente acuerdo de encargo de tratamiento en los términos del art. 28 del Reglamento (UE) 2016/679 (RGPD).</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#0087A5] uppercase tracking-wide mb-3">2. Objeto y naturaleza del tratamiento</h2>
            <p className="text-sm">Fluxira trata los datos que el gestor introduce en la plataforma con el único fin de prestar el servicio contratado: leer las facturas eléctricas de los clientes del gestor, extraer sus datos de forma automatizada, generar informes de optimización energética y, si el gestor lo solicita, enviar dichos informes por correo electrónico al cliente final. Fluxira no trata estos datos con ninguna otra finalidad ni los cede a terceros fuera de los subencargados indicados en la sección 5.</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#0087A5] uppercase tracking-wide mb-3">3. Tipos de datos e interesados</h2>
            <p className="text-sm mb-3">Los datos tratados son los descritos en la sección de roles de la Política de Privacidad de Fluxira:</p>
            <ul className="space-y-1.5 text-sm list-disc list-inside marker:text-[#0087A5]">
              <li>Nombre o etiqueta del cliente, correo electrónico del cliente, CUPS del suministro.</li>
              <li>Facturas en PDF, datos extraídos de las facturas (consumos, potencias, importes, tarifas) e informes generados.</li>
              <li>Historial de análisis y registros de envíos de email.</li>
            </ul>
            <p className="text-sm mt-3">Los interesados son los clientes del gestor y sus representantes o personas de contacto. <span className="font-semibold text-gray-800">No se tratan categorías especiales de datos</span> (art. 9 RGPD). El gestor se compromete a no subir facturas u otros documentos que contengan datos de salud, ideología, origen racial u otras categorías especiales.</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#0087A5] uppercase tracking-wide mb-3">4. Obligaciones de Fluxira como encargado</h2>
            <p className="text-sm mb-3">De conformidad con el art. 28.3 RGPD, Fluxira se compromete a:</p>
            <ul className="space-y-2 text-sm list-disc list-inside marker:text-[#0087A5]">
              <li>Tratar los datos únicamente siguiendo las instrucciones documentadas del gestor (el uso de la plataforma y las presentes condiciones constituyen esas instrucciones).</li>
              <li>Garantizar que el personal con acceso a los datos esté sujeto a deber de confidencialidad.</li>
              <li>Aplicar las medidas de seguridad técnicas y organizativas descritas en la sección de seguridad de la Política de Privacidad.</li>
              <li>Ayudar al gestor, en la medida de lo posible, a responder las solicitudes de ejercicio de derechos de los interesados.</li>
              <li>Notificar al gestor, sin dilación indebida y en un plazo máximo de 48 horas desde su conocimiento, cualquier violación de seguridad que afecte a los datos tratados por cuenta del gestor.</li>
              <li>Poner a disposición del gestor toda la información necesaria para demostrar el cumplimiento de las presentes obligaciones.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#0087A5] uppercase tracking-wide mb-3">5. Subencargados</h2>
            <p className="text-sm">El gestor autoriza de forma general el uso de los subencargados indicados en la Política de Privacidad de Fluxira (Vercel, Railway, Google Gemini API, Resend). Fluxira avisará al gestor con antelación razonable de cualquier cambio previsto en los subencargados, dándole la oportunidad de oponerse a dicho cambio.</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#0087A5] uppercase tracking-wide mb-3">6. Obligaciones del gestor como responsable</h2>
            <ul className="space-y-2 text-sm list-disc list-inside marker:text-[#0087A5]">
              <li>El gestor declara disponer de una base jurídica legítima para subir las facturas e información de sus clientes a la plataforma (p. ej., relación contractual o consentimiento del cliente final).</li>
              <li>El gestor se compromete a haber informado a sus clientes del tratamiento de sus datos, incluida la cesión a Fluxira como encargado.</li>
              <li>El gestor no subirá datos que constituyan categorías especiales según el art. 9 RGPD.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#0087A5] uppercase tracking-wide mb-3">7. Duración y fin del encargo</h2>
            <p className="text-sm">Este encargo estará vigente mientras la cuenta del gestor permanezca activa. Cuando el gestor solicite la baja o la supresión de sus datos, Fluxira eliminará los datos tratados por su cuenta (clientes, PDFs, informes e historial) en un plazo máximo de 30 días, salvo que una obligación legal exija su conservación.</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#0087A5] uppercase tracking-wide mb-3">8. Ley aplicable</h2>
            <p className="text-sm">Este acuerdo se rige por la legislación española y el RGPD. Para cualquier controversia, las partes se someten a los juzgados y tribunales que correspondan conforme a la normativa aplicable.</p>
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
