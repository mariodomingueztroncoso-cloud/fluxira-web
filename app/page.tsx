'use client';

import Image from 'next/image';
import { useState, useRef } from 'react';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setStatus('error');
      setMessage('Debes adjuntar una factura en formato PDF.');
      return;
    }

    setStatus('loading');

    try {
      const formData = new FormData();
      // Aseguramos que use la clave exacta 'file' que espera tu backend seguro
      formData.append('file', file); 

      // Llamada directa a tu API propia ya configurada en el servidor
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error al subir el archivo');
      }

      setStatus('success');
      setMessage('¡Factura recibida correctamente! Muchas gracias.');
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error) {
      setStatus('error');
      setMessage('Hubo un problema al enviar la factura. Por favor, inténtalo de nuevo.');
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setIsDragActive(true);
    else if (e.type === "dragleave") setIsDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 md:p-12 font-sans text-gray-900">
      <div className="z-10 w-full max-w-2xl flex flex-col items-center p-6 md:p-10 bg-white rounded-3xl shadow-sm border border-gray-100">
        
        {/* Tu Logo Oficial */}
        <div className="mb-6 flex justify-center w-full">
          <Image src="/logo.png" alt="Fluxira Logo" width={350} height={90} priority className="h-auto w-auto max-w-[240px] md:max-w-[300px]" />
        </div>

        {/* Textos de la propuesta */}
        <div className="space-y-3 mb-8 text-center">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-950">Optimización Energética Profesional</h1>
          <p className="text-base text-gray-600 max-w-md mx-auto leading-relaxed">Ayudamos a empresas e industrias a reducir drásticamente sus costes de electricidad revisando y optimizando sus contratos actuales.</p>
        </div>

        {/* Bloque del Taller (Ahorro de 600€) */}
        <div className="w-full bg-[#0087A5]/5 border border-[#0087A5]/20 rounded-2xl p-4 md:p-5 mb-8 flex items-start gap-4 text-left">
          <div className="text-xl md:text-2xl mt-0.5">💡</div>
          <div>
            <h4 className="font-bold text-[#0087A5] text-sm md:text-base mb-1">¿Sabías que puedes estar pagando de más?</h4>
            <p className="text-xs md:text-sm text-gray-700 leading-relaxed">En nuestra última auditoría a un taller local, detectamos errores de facturación y potencia optimizable que les supuso un **ahorro directo de 600€**. Sube tu factura y analizamos tu caso gratis.</p>
          </div>
        </div>

        {/* Formulario Drag & Drop conectado a tu API */}
        <form onSubmit={handleSubmit} className="w-full space-y-6 text-left border-b border-gray-100 pb-8 mb-6">
          <div className="flex flex-col items-center justify-center w-full">
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

          {/* Alertas */}
          {message && (
            <div className={`p-4 rounded-xl text-sm font-medium ${status === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>{message}</div>
          )}

          <button type="submit" disabled={status === 'loading'} className="w-full rounded-full bg-[#0087A5] py-3.5 text-base font-semibold text-white transition-all hover:bg-[#006e88] shadow-md hover:shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2">
            {status === 'loading' ? 'Enviando factura...' : 'Enviar Factura para Estudio Gratis'}
          </button>
        </form>

        {/* Datos de Contacto reales */}
        <div className="w-full flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 text-sm text-gray-600">
          <div className="flex items-center gap-2"><span>📞</span><a href="tel:+34600000000" className="hover:text-[#0087A5] hover:underline font-medium">+34 600 00 00 00</a></div>
          <div className="flex items-center gap-2"><span>✉️</span><a href="mailto:contacto@fluxira.es" className="hover:text-[#0087A5] hover:underline font-medium">contacto@fluxira.es</a></div>
        </div>

      </div>
      <footer className="mt-6 text-center text-xs text-gray-400">© {new Date().getFullYear()} Fluxira S.L. Todos los derechos reservados.</footer>
    </main>
  );
}