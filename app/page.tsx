import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white p-6 md:p-24 font-sans text-gray-900">
      
      {/* Tarjeta Principal */}
      <div className="z-10 w-full max-w-2xl flex flex-col items-center justify-between p-8 md:p-12 bg-white rounded-3xl shadow-sm border border-gray-100 text-center">
        
        {/* Tu Logo Oficial */}
        <div className="mb-10 flex justify-center w-full">
          <Image
            src="/logo.png"
            alt="Fluxira Logo"
            width={350}
            height={90}
            priority
            className="h-auto w-auto max-w-[260px] md:max-w-[350px]"
          />
        </div>

        {/* Mensaje directo sobre las facturas */}
        <div className="space-y-4 mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-gray-950">
            Portal de Envío de Facturas
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Bienvenido al canal oficial de recepción de facturas de Fluxira. Utiliza nuestra herramienta segura para enviarnos tus documentos en formato PDF de manera rápida.
          </p>
        </div>

        {/* El Botón que lleva directo al formulario */}
        <div className="flex justify-center w-full">
          <Link href="/contacto" className="group rounded-full bg-[#0087A5] px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-[#006e88] shadow-md hover:shadow-lg flex items-center gap-2">
            Enviar Factura
            <span className="inline-block transition-transform group-hover:translate-x-1">
              -&gt;
            </span>
          </Link>
        </div>

      </div>

      {/* Pie de página */}
      <footer className="absolute bottom-6 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} Fluxira S.L. Todos los derechos reservados.
      </footer>
    </main>
  );
}