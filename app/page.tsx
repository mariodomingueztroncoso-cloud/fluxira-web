'use client';

import Image from 'next/image';
import { useState, useRef } from 'react';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [rgpd, setRgpd] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (selectedFile: File) => {
    if (selectedFile.type !== 'application/pdf') {
      setStatus('error');
      setMessage('Por favor, selecciona un archivo en formato PDF.');
      setFile(null);
      return;
    }
    setFile(selectedFile);
    setStatus('idle');
    setMessage('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleBoxClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const canSubmit = nombre.trim() !== '' && telefono.trim() !== '' && file !== null && rgpd;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setStatus('loading');

    try {
      const formData = new FormData();
      formData.append('file', file!);
      formData.append('nombre', nombre.trim());
      formData.append('contacto', telefono.trim());
      if (email.trim()) formData.append('email', email.trim());

      const response = await fetch('/api/analizar', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error al subir el archivo');
      }

      setStatus('success');
      setMessage('¡Recibido! Te enviaré el análisis en breve por WhatsApp.');
      setFile(null);
      setNombre('');
      setTelefono('');
      setEmail('');
      setRgpd(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch {
      setStatus('error');
      setMessage('Hubo un problema al enviar la factura. Por favor, inténtalo de nuevo.');
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setIsDragActive(true);
    else if (e.type === 'dragleave') setIsDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const inputClass =
    'w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-[#0087A5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0087A5]/20 transition-colors';

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 md:p-12 font-sans text-gray-900">
      <div className="z-10 w-full max-w-2xl flex flex-col items-center p-6 md:p-10 bg-white rounded-3xl shadow-sm border border-gray-100">

        {/* Logo */}
        <div className="mb-6 flex justify-center w-full">
          <Image src="/logo.png" alt="Fluxira Logo" width={350} height={90} priority className="h-auto w-auto max-w-[240px] md:max-w-[300px]" />
        </div>

        {/* Cabecera */}
        <div className="space-y-3 mb-8 text-center">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-950">Optimización Energética Profesional</h1>
          <p className="text-base text-gray-600 max-w-md mx-auto leading-relaxed">Ayudamos a empresas e industrias a reducir drásticamente sus costes de electricidad revisando y optimizando sus contratos actuales.</p>
        </div>

        {/* Bloque de ahorro */}
        <div className="w-full bg-[#0087A5]/5 border border-[#0087A5]/20 rounded-2xl p-4 md:p-5 mb-8 flex items-start gap-4 text-left">
          <div className="text-xl md:text-2xl mt-0.5">💡</div>
          <div>
            <h4 className="font-bold text-[#0087A5] text-sm md:text-base mb-1">¿Sabías que puedes estar pagando de más?</h4>
            <p className="text-xs md:text-sm text-gray-700 leading-relaxed">En nuestra última auditoría a un taller local, detectamos errores de facturación y potencia optimizable que les supuso un **ahorro directo de 600€**. Sube tu factura y analizamos tu caso gratis.</p>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="w-full space-y-4 text-left border-b border-gray-100 pb-8 mb-6">

          {/* Campos de contacto */}
          <div className="space-y-3">
            <div>
              <label htmlFor="nombre" className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Nombre o nombre del negocio <span className="text-red-400">*</span></label>
              <input
                id="nombre"
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej. Talleres García o Juan García"
                className={inputClass}
                required
              />
            </div>

            <div>
              <label htmlFor="telefono" className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Teléfono de contacto <span className="text-red-400">*</span></label>
              <input
                id="telefono"
                type="tel"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="Ej. 600 000 000"
                className={inputClass}
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Email <span className="text-gray-300">(opcional)</span></label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ej. contacto@minegocio.es"
                className={inputClass}
              />
            </div>
          </div>

          {/* Zona drag & drop */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Factura en PDF <span className="text-red-400">*</span></label>
            <div
              onClick={handleBoxClick}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-2xl cursor-pointer transition-colors p-4 text-center ${
                isDragActive ? 'border-[#0087A5] bg-[#0087A5]/10' : 'bg-gray-50 hover:bg-gray-100 border-gray-200 hover:border-[#0087A5]'
              }`}
            >
              <div className="flex flex-col items-center justify-center pointer-events-none">
                <svg className="w-8 h-8 mb-2 text-[#0087A5]" fill="none" viewBox="0 0 20 16"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/></svg>
                <p className="mb-1 text-xs md:text-sm text-gray-700"><span className="font-semibold text-[#0087A5]">Haz clic para adjuntar</span> o arrastra tu factura</p>
                <p className="text-[11px] text-gray-400">Solo formato PDF</p>
              </div>
              <input ref={fileInputRef} type="file" accept=".pdf" className="hidden" onChange={handleFileChange} />
            </div>
          </div>

          {/* Archivo cargado */}
          {file && (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 flex items-center space-x-3">
              <span className="text-sm text-gray-700 font-medium truncate flex-1">📄 {file.name}</span>
              <button type="button" onClick={(e) => { e.stopPropagation(); setFile(null); }} className="text-xs text-red-500 hover:underline">Quitar</button>
            </div>
          )}

          {/* Checkbox RGPD */}
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={rgpd}
              onChange={(e) => setRgpd(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 accent-[#0087A5] cursor-pointer"
              required
            />
            <span className="text-xs text-gray-500 leading-relaxed group-hover:text-gray-700 transition-colors">
              He leído y acepto la política de privacidad y autorizo a Fluxira a tratar mis datos para analizar mi factura. <span className="text-red-400">*</span>
            </span>
          </label>

          {/* Alertas */}
          {message && (
            <div className={`p-4 rounded-xl text-sm font-medium ${status === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>{message}</div>
          )}

          <button
            type="submit"
            disabled={!canSubmit || status === 'loading'}
            className="w-full rounded-full bg-[#0087A5] py-3.5 text-base font-semibold text-white transition-all hover:bg-[#006e88] shadow-md hover:shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {status === 'loading' ? 'Enviando...' : 'Enviar Factura para Estudio Gratis'}
          </button>
        </form>

        {/* Contacto */}
        <div className="w-full flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 text-sm text-gray-600">
          <div className="flex items-center gap-2"><span>📞</span><a href="tel:+34600000000" className="hover:text-[#0087A5] hover:underline font-medium">+34 600 00 00 00</a></div>
          <div className="flex items-center gap-2"><span>✉️</span><a href="mailto:contacto@fluxira.es" className="hover:text-[#0087A5] hover:underline font-medium">contacto@fluxira.es</a></div>
        </div>

      </div>
      <footer className="mt-6 text-center text-xs text-gray-400">© {new Date().getFullYear()} Fluxira S.L. Todos los derechos reservados.</footer>
    </main>
  );
}
