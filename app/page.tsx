'use client';

import React, { useState } from 'react';

export default function Home() {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === "application/pdf") {
        setFile(droppedFile);
      } else {
        alert("Por favor, sube solo archivos PDF.");
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      alert("Por favor, selecciona o arrastra una factura en PDF.");
      return;
    }

    setStatus('submitting');
    const formData = new FormData(e.currentTarget);
    formData.append("attachment", file);

    try {
      const response = await fetch("/api/analizar", {
        method: "POST",
        body: formData
      });

      const data = await response.json();
      if (data.success) {
        setStatus('success');
        setFile(null);
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased">
      {/* Header */}
      <header className="max-w-5xl mx-auto px-6 py-8 flex justify-between items-center border-b border-slate-900">
        <span className="text-2xl font-bold tracking-tight text-emerald-400">Fluxira</span>
        <span className="text-xs bg-slate-900 text-slate-400 px-3 py-1 rounded-full border border-slate-800">
          Auditoría Energética Independiente
        </span>
      </header>

      {/* Hero Section */}
      <main className="max-w-5xl mx-auto px-6 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight mb-6">
            ¿Estás pagando por más luz de la que realmente usas?
          </h1>
          <p className="text-lg text-slate-400 mb-8 leading-relaxed">
            Analizo los parámetros de potencia de tu contador digital y detecto si tu distribuidora te está cobrando de más. Gratis, sin compromiso y <strong className="text-slate-200 font-semibold">sin cambiar de compañía eléctrica</strong>.
          </p>
          
          {/* Caso Real Card */}
          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl mb-6">
            <p className="text-sm text-emerald-400 font-semibold mb-1">✓ CASO REAL RECIENTE</p>
            <p className="text-slate-300 text-sm italic">
              "Detectamos 600 € de ahorro anuales en un pequeño taller ajustando los maxímetros, manteniendo su misma comercializadora."
            </p>
          </div>

          <p className="text-xs text-slate-500">
            * Soy Mario, técnico especialista en eficiencia. No vendo tarifas ni soy comercial de luz.
          </p>
        </div>

        {/* Formulario / Dropzone */}
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-xl">
          <h2 className="text-xl font-bold mb-2 text-slate-100">Sube tu última factura</h2>
          <p className="text-sm text-slate-400 mb-6">El proceso tarda menos de 10 segundos. Analizaremos tu potencia óptima.</p>

          {status === 'success' ? (
            <div className="bg-emerald-950/50 border border-emerald-800 text-emerald-300 p-6 rounded-2xl text-center">
              <p className="font-bold text-lg mb-2">¡Factura recibida correctamente!</p>
              <p className="text-sm text-emerald-400">Ya me he puesto con tu informe técnico. Te escribiré o llamaré en unas horas con el resultado exacto de tu ahorro.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} onDragEnter={handleDrag} className="space-y-4">
              {/* Dropzone */}
              <div 
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-6 text-center transition-colors cursor-pointer relative ${
                  dragActive ? 'border-emerald-400 bg-slate-800/50' : 'border-slate-700 hover:border-slate-600 bg-slate-950'
                }`}
              >
                <input 
                  type="file" 
                  accept=".pdf" 
                  onChange={handleChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-300">
                    {file ? `✓ ${file.name}` : "Arrastra tu factura en PDF aquí"}
                  </p>
                  <p className="text-xs text-slate-500">o haz clic para seleccionar el archivo</p>
                </div>
              </div>

              {/* Campos de contacto */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Nombre del negocio / Contacto</label>
                <input 
                  type="text" 
                  name="name" 
                  required 
                  placeholder="Ej. Talleres García / Juan"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-400 text-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Teléfono o WhatsApp</label>
                <input 
                  type="tel" 
                  name="phone" 
                  required 
                  placeholder="Ej. 600 000 000"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-400 text-slate-200"
                />
              </div>

              <button 
                type="submit" 
                disabled={status === 'submitting'}
                className="w-full bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-slate-950 font-bold py-4 px-6 rounded-xl transition-colors text-sm disabled:opacity-50"
              >
                {status === 'submitting' ? 'Procesando archivo...' : 'Solicitar Análisis Gratuito'}
              </button>

              {status === 'error' && (
                <p className="text-xs text-red-400 text-center mt-2">Hubo un error al enviar. Por favor, inténtalo de nuevo.</p>
              )}
            </form>
          )}
        </div>
      </main>
    </div>
  );
}