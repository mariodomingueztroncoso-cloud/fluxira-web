import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-50 font-sans text-gray-900">
      <div className="w-full max-w-3xl px-4 py-16 md:py-24 flex flex-col items-center text-center">

        <div className="mb-8">
          <Image src="/logo.png" alt="Fluxira Logo" width={280} height={72} priority className="h-auto w-auto max-w-[200px] md:max-w-[240px]" />
        </div>

        <p className="text-xs font-semibold tracking-widest uppercase text-[#0087A5] mb-4">
          Para gestores y asesores energeticos
        </p>

        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-950 mb-6 leading-tight">
          Analiza las facturas de tus clientes.<br />
          Encuentra <span className="text-[#0087A5]">su ahorro</span>. En minutos.
        </h1>

        <p className="text-base md:text-lg text-gray-600 max-w-xl mb-10 leading-relaxed">
          Sube la factura de tu cliente o lead y descarga al instante un informe de ahorro con tu marca.
          Sin curva de aprendizaje, sin depender de nadie que te lo explique.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-16">
          <Link
            href="/registro"
            className="rounded-full bg-[#0087A5] px-8 py-3.5 text-base font-semibold text-white transition-all hover:bg-[#006e88] shadow-md hover:shadow-lg"
          >
            Prueba gratis sin limites
          </Link>
          <Link
            href="/login"
            className="rounded-full border border-gray-300 px-8 py-3.5 text-base font-semibold text-gray-700 transition-all hover:bg-gray-100"
          >
            Ya tengo cuenta
          </Link>
        </div>

        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-left">
          {[
            'Ajuste de potencia y reactiva',
            'Calculo de ahorro automatico',
            'Efecto del cambio de tarifa',
            'Avisos de fin de contrato',
            'Proximamente: viabilidad solar',
          ].map((feature) => (
            <div key={feature} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
              <p className="text-sm text-gray-700 font-medium">{feature}</p>
            </div>
          ))}
        </div>

      </div>

      <footer className="mt-auto py-6 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} Fluxira. Todos los derechos reservados.
      </footer>
    </main>
  );
}
