import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white p-6 md:p-24 font-sans text-gray-900">
      
      {/* Contenedor Principal (Tarjeta Blanca con Sombra Suave) */}
      <div className="z-10 w-full max-w-5xl flex flex-col items-center justify-between p-12 bg-white rounded-3xl shadow-sm border border-gray-100">
        
        {/* Cabecera con el Logo (Cargado desde /public/logo.png) */}
        <div className="mb-12 flex justify-center w-full">
          <Image
            src="/logo.png" // <--- Aquí cargamos tu logo
            alt="Fluxira Logo"
            width={400} // Ajusta el ancho según prefieras
            height={100} // Ajusta el alto proporcionalmente
            priority // Carga esta imagen primero
            className="h-auto w-auto max-w-[300px] md:max-w-[400px]"
          />
        </div>

        {/* Sección de Bienvenida e Introducción */}
        <div className="text-center mb-16 space-y-6 max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-gray-950">
            Bienvenido a la Plataforma Fluxira
          </h1>
          <p className="text-xl text-gray-700 leading-relaxed">
            Gestión inteligente y monitorización energética para la industria. Optimiza tus recursos y reduce costes con nuestra tecnología IoT de vanguardia.
          </p>
        </div>

        {/* Botón de Acción Principal (con tu color azul turquesa #0087A5) */}
        <div className="flex justify-center w-full">
          <Link href="/contacto" className="group rounded-full border border-transparent bg-[#0087A5] px-10 py-4 text-lg font-semibold text-white transition-all hover:bg-[#006e88] shadow-md hover:shadow-lg flex items-center gap-3">
            Comenzar / Contactar
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </Link>
        </div>

      {/* Pie de página sutil */}
        <footer className="absolute bottom-6 left-0 right-0 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Fluxira S.L. Todos los derechos reservados.
        </footer>

      </div>
    </main>
  );
}