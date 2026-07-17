'use client';

import Image from 'next/image';
import { useState, useRef } from 'react';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== 'application/pdf') {
        setStatus('error');
        setMessage('Por favor, selecciona un archivo en formato PDF.');
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setStatus('idle');
      setMessage('');
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
      formData.append('file', file);

      // Enviamos el archivo a la API interna segura que configuramos
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

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white p-6 md:p-12 font-sans text-gray-900">
      
      {/* Contenedor Principal */}
      <div className="z-10 w-full max-w-xl flex flex-col items-center p-8 md:p-12 bg-white rounded-3xl shadow-sm border border-gray-100 text-center">
        
        {/* Tu Logo Oficial */}
        <div className="mb-8 flex justify-center w-full">
          <Image
            src="/logo.png"
            alt="Fluxira Logo"
            width={350}
            height={90}
            priority
            className="h-auto w-auto max-w-[260px] md:max-w-[320px]"
          />
        </div>

        {/* Textos directos */}
        <div className="space-y-3 mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-950">
            Portal de Envío de Facturas
          </h1>
          <p className="text-base text-gray-600 leading-relaxed">
            Bienvenido al canal oficial de recepción de facturas de Fluxira. Utiliza la herramienta inferior para enviarnos tus documentos en formato PDF de forma segura.
          </p>
        </div>

        {/* Formulario Integrado */}
        <form onSubmit={handleSubmit} className="w-full space-y-6 text-left">
          <div className="flex flex-col items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-2xl cursor-pointer bg-gray-50 hover:bg-gray-100 border-gray-200 hover:border-[#0087A5] transition-colors p-4 text-center">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg className="w-10 h-10 mb-3 text-[#0087A5]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                </svg>
                <p className="mb-2 text-sm text-gray-700">
                  <span className="font-semibold text-[#0087A5]">Haz clic para adjuntar</span> o arrastra tu archivo
                </p>
                <p className="text-xs text-gray-400">Solo formato PDF</p>
              </div>
              <input 
                ref={fileInputRef}
                type="file" 
                accept=".pdf" 
                className="hidden" 
                onChange={handleFileChange} 
              />
            </label>
          </div>

          {/* Nombre del archivo seleccionado */}
          {file && (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 flex items-center space-x-3">
              <span className="text-sm text-gray-700 font-medium truncate flex-1">
                📄 {file.name}
              </span>
              <button 
                type="button" 
                onClick={() => setFile(null)} 
                className="text-xs text-red-500 hover:underline"
              >
                Quitar
              </button>
            </div>
          )}

          {/* Mensajes de Estado (Éxito / Error) */}
          {message && (
            <div className={`p-4 rounded-xl text-sm font-medium ${status === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
              {message}
            </div>
          )}

          {/* Botón de Envío */}
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full rounded-full bg-[#0087A5] py-4 text-base font-semibold text-white transition-all hover:bg-[#006e88] shadow-md hover:shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {status === 'loading' ? 'Enviando factura...' : 'Enviar Factura'}
          </button>
        </form>

      </div>

      {/* Pie de página */}
      <footer className="absolute bottom-6 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} Fluxira S.L. Todos los derechos reservados.
      </footer>
    </main>
  );
}