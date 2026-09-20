import Image from 'next/image';
import Link from 'next/link';

const iconos = {
  factura: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
      <path d="M7 3h8l4 4v14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 12h6M9 16h6M9 8h3" strokeLinecap="round"/>
    </svg>
  ),
  ia: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
      <circle cx="12" cy="12" r="3"/>
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" strokeLinecap="round"/>
    </svg>
  ),
  informe: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
      <rect x="4" y="3" width="16" height="18" rx="1"/>
      <path d="M8 8h8M8 12h5M8 16h8" strokeLinecap="round"/>
    </svg>
  ),
  potencia: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
      <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  alerta: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
      <path d="M12 9v4M12 17h.01" strokeLinecap="round"/>
      <path d="M10.3 3.9 2.4 18a1 1 0 0 0 .9 1.5h17.4a1 1 0 0 0 .9-1.5L13.7 3.9a1 1 0 0 0-1.7 0z" strokeLinejoin="round"/>
    </svg>
  ),
  tarifa: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
      <path d="M3 12h18M3 6h18M3 18h18" strokeLinecap="round"/>
      <circle cx="8" cy="6" r="1.2" fill="currentColor" stroke="none"/>
      <circle cx="14" cy="12" r="1.2" fill="currentColor" stroke="none"/>
      <circle cx="10" cy="18" r="1.2" fill="currentColor" stroke="none"/>
    </svg>
  ),
  calendario: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
      <rect x="3" y="5" width="18" height="16" rx="1"/>
      <path d="M3 9h18M8 3v4M16 3v4" strokeLinecap="round"/>
    </svg>
  ),
  marca: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
      <path d="M12 2 3 7v6c0 5 4 8 9 9 5-1 9-4 9-9V7l-9-5z" strokeLinejoin="round"/>
    </svg>
  ),
  reloj: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
      <circle cx="12" cy="12" r="9"/>
      <path d="M12 7v5l3 3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  clientes: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
      <circle cx="9" cy="8" r="3"/>
      <path d="M3 20c0-3.5 2.5-6 6-6s6 2.5 6 6" strokeLinecap="round"/>
      <circle cx="17" cy="8" r="2.3"/>
      <path d="M15.5 14.2c2.6.6 4.5 2.8 4.5 5.8" strokeLinecap="round"/>
    </svg>
  ),
};

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-gray-50 font-sans text-gray-900">

      {/* Menu de anclas */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Image src="/logo.png" alt="Fluxira" width={160} height={40} className="h-13 w-auto" />
          <div className="hidden sm:flex items-center gap-6 text-sm text-gray-600">
            <a href="#como-funciona" className="hover:text-[#0087A5] transition-colors">Cómo funciona</a>
            <a href="#analisis" className="hover:text-[#0087A5] transition-colors">Qué incluye</a>
            <a href="#beneficios" className="hover:text-[#0087A5] transition-colors">Beneficios</a>
          </div>
          <Link
            href="/registro"
            className="rounded-full bg-[#0087A5] px-4 py-2 text-xs font-semibold text-white hover:bg-[#006e88] transition-colors"
          >
            Prueba gratis
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="w-full px-4 py-16 md:py-24 flex flex-col items-center text-center">
        <p className="text-xs font-semibold tracking-widest uppercase text-[#0087A5] mb-4">
          Para gestores y asesores energéticos
        </p>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-950 mb-6 leading-tight max-w-3xl">
          Analiza las facturas de tus clientes.<br />
          Encuentra <span className="text-[#0087A5]">su ahorro</span>. En minutos.
        </h1>
        <p className="text-base md:text-lg text-gray-600 max-w-xl mb-10 leading-relaxed">
          Sube la factura de tu cliente o lead y descarga al instante un informe de ahorro con tu marca.
          Sin curva de aprendizaje, sin depender de nadie que te lo explique.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/registro"
            className="rounded-full bg-[#0087A5] px-8 py-3.5 text-base font-semibold text-white transition-all hover:bg-[#006e88] shadow-md hover:shadow-lg"
          >
            Prueba gratis sin límites
          </Link>
          <Link
            href="/login"
            className="rounded-full border border-gray-300 px-8 py-3.5 text-base font-semibold text-gray-700 transition-all hover:bg-gray-100"
          >
            Ya tengo cuenta
          </Link>
        </div>
      </section>

      {/* EL PROBLEMA */}
      <section className="w-full bg-white border-y border-gray-100 px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-950 mb-4">
            Revisar una factura a mano cuesta tiempo que no tienes
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Comprobar si la potencia contratada está bien dimensionada, calcular la penalización por
            reactiva, o simplemente preparar un informe presentable para el cliente: son tareas que se
            comen horas de tu semana, cliente a cliente. Fluxira lo hace por ti en el tiempo que tardas
            en subir el PDF.
          </p>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section id="como-funciona" className="w-full px-4 py-16 md:py-20 scroll-mt-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-950 text-center mb-2">
            Cómo funciona
          </h2>
          <p className="text-gray-500 text-center mb-12">Tres pasos, sin instalar nada.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icono: iconos.factura, titulo: '1. Sube la factura', texto: 'Arrastra el PDF de la factura de tu cliente, con una o varias mensualidades.' },
              { icono: iconos.ia, titulo: '2. La IA la analiza', texto: 'Extraemos los datos y calculamos la optimización de potencia, reactiva y más, en segundos.' },
              { icono: iconos.informe, titulo: '3. Descarga el informe', texto: 'Recibe un informe profesional con tu marca, listo para enseñar al cliente.' },
            ].map((paso) => (
              <div key={paso.titulo} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <div className="w-11 h-11 rounded-xl bg-[#0087A5]/10 text-[#0087A5] flex items-center justify-center mb-4">
                  {paso.icono}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{paso.titulo}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{paso.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QUE INCLUYE EL ANALISIS */}
      <section id="analisis" className="w-full bg-white border-y border-gray-100 px-4 py-16 md:py-20 scroll-mt-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-950 text-center mb-2">
            Qué incluye cada análisis
          </h2>
          <p className="text-gray-500 text-center mb-12">
            Todo lo necesario para presentar un informe riguroso, no una estimación genérica.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {[
              { icono: iconos.potencia, titulo: 'Optimización de potencia', texto: 'Calculamos la potencia óptima en los 6 periodos de la 3.0TD, respetando los límites regulatorios.' },
              { icono: iconos.alerta, titulo: 'Detección de anomalías', texto: 'Avisos si el factor de potencia o el consumo se salen de lo esperado.' },
              { icono: iconos.tarifa, titulo: 'Comparativa de tarifas', texto: 'Introduce una oferta de otra comercializadora y compárala al instante contra la factura real.' },
              { icono: iconos.calendario, titulo: 'Aviso de vencimiento', texto: 'Detectamos la fecha de fin de contrato de la factura para que no se te escape ninguna renovación.' },
              { icono: iconos.marca, titulo: 'Tu marca, no la nuestra', texto: 'Sube tu logo y nombre comercial: el informe que descarga tu cliente lleva tu identidad.' },
              { icono: iconos.clientes, titulo: 'Cartera de clientes', texto: 'Organiza todos tus clientes y su historial de informes en un único panel.' },
            ].map((item) => (
              <div key={item.titulo} className="p-5 rounded-2xl hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-[#2C3E50]/5 text-[#2C3E50] flex items-center justify-center mb-3">
                  {item.icono}
                </div>
                <h3 className="font-semibold text-gray-900 text-sm mb-1.5">{item.titulo}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{item.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFICIOS / DIA A DIA */}
      <section id="beneficios" className="w-full px-4 py-16 md:py-20 scroll-mt-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-950 text-center mb-12">
            Así cambia tu día a día
          </h2>

          <div className="space-y-6">
            {[
              { icono: iconos.reloj, titulo: 'Ahorras horas por cliente', texto: 'Lo que antes te llevaba revisar a mano, ahora es subir un PDF y esperar unos segundos.' },
              { icono: iconos.alerta, titulo: 'Detectas riesgos antes de que sean un problema', texto: 'Los avisos regulatorios y de vencimiento te evitan sorpresas de última hora con tus clientes.' },
              { icono: iconos.marca, titulo: 'Te presentas como un profesional', texto: 'Cada informe lleva tu marca, no la de un tercero — tu cliente ve tu trabajo, no una herramienta genérica.' },
              { icono: iconos.clientes, titulo: 'Tu cartera, ordenada', texto: 'Ya no dependes de carpetas sueltas o Excels: cada cliente con su historial, en un único sitio.' },
            ].map((item) => (
              <div key={item.titulo} className="flex items-start gap-4 bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <div className="w-10 h-10 shrink-0 rounded-lg bg-[#0087A5]/10 text-[#0087A5] flex items-center justify-center">
                  {item.icono}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{item.titulo}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.texto}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="w-full bg-[#0F1B24] px-4 py-16 md:py-20">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Prueba tu primer informe gratis
          </h2>
          <p className="text-gray-300 mb-8">
            Sin tarjeta, sin compromiso. Crea tu cuenta y analiza tu primera factura ahora mismo.
          </p>
          <Link
            href="/registro"
            className="inline-block rounded-full bg-[#0087A5] px-8 py-3.5 text-base font-semibold text-white transition-all hover:bg-[#00a3c4] shadow-lg"
          >
            Crear cuenta gratis
          </Link>
        </div>
      </section>

      <footer className="py-8 text-center text-xs text-gray-400 bg-gray-50">
        © {new Date().getFullYear()} Fluxira. Todos los derechos reservados.
      </footer>
    </main>
  );
}
