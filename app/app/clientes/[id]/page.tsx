'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

interface AnalisisItem {
  id: number;
  nombre_empresa: string;
  fecha: string;
  ahorro_total: number | null;
  fecha_fin_contrato: string | null;
  ruta_pdf: string;
}

export default function DetalleCliente() {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [isDragActive, setIsDragActive] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [historial, setHistorial] = useState<AnalisisItem[]>([]);
  const [loadingHistorial, setLoadingHistorial] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const params = useParams();
  const clienteId = params.id as string;
  const [nombreCliente, setNombreCliente] = useState('');

  const cargarHistorial = async (token: string) => {
    setLoadingHistorial(true);
    try {
      const response = await fetch(`/api/clientes/${clienteId}/analisis`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 401) {
        localStorage.removeItem('fluxira_token');
        router.push('/login');
        return;
      }
            // Obtener el nombre del cliente desde el listado
      const clientesResp = await fetch('/api/clientes', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (clientesResp.ok) {
        const listaClientes = await clientesResp.json();
        const encontrado = listaClientes.find((c: any) => String(c.id) === clienteId);
        if (encontrado) setNombreCliente(encontrado.nombre_cliente);
      }
      if (response.status === 404) {
        setHistorial([]);
        return;
      }
      const data = await response.json();
      setHistorial(data);
    } catch {
      // Si falla, dejamos el historial vacio.
    } finally {
      setLoadingHistorial(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('fluxira_token');
    if (!token) {
      router.push('/login');
      return;
    }
    setCheckingAuth(false);
    cargarHistorial(token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, clienteId]);

  const processFiles = (selectedFiles: FileList | File[]) => {
    const incoming = Array.from(selectedFiles);
    const invalid = incoming.find((f) => f.type !== 'application/pdf');
    if (invalid) {
      setStatus('error');
      setMessage('Por favor, selecciona solo archivos en formato PDF.');
      return;
    }
    setFiles((prev) => [...prev, ...incoming]);
    setStatus('idle');
    setMessage('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
    e.target.value = '';
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
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
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };
    const descargarInforme = async (analisisId: number) => {
    const token = localStorage.getItem('fluxira_token');
    if (!token) {
      router.push('/login');
      return;
    }
    try {
      const response = await fetch(`/api/analisis/${analisisId}/pdf`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        alert('No se pudo descargar el informe.');
        return;
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'informe_fluxira.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      alert('No se pudo conectar con el servidor.');
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) return;

    const token = localStorage.getItem('fluxira_token');
    if (!token) {
      router.push('/login');
      return;
    }

    setStatus('loading');
    setMessage('Analizando factura(s), esto puede tardar hasta un minuto...');

    try {
      const formData = new FormData();
      files.forEach((f) => formData.append('files', f));
      formData.append('cliente_id', clienteId);
      formData.append('nombre_empresa', nombreCliente || 'Cliente');

      const response = await fetch('/api/analizar', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (response.status === 401) {
        localStorage.removeItem('fluxira_token');
        router.push('/login');
        return;
      }

      if (!response.ok) {
        throw new Error('Error al procesar el archivo');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'informe_fluxira.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      setStatus('success');
      setMessage('Informe generado. Descargando...');
      setFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = '';
      await cargarHistorial(token);
    } catch {
      setStatus('error');
      setMessage('Hubo un problema al analizar la factura. Intentalo de nuevo.');
    }
  };

  const inputClass =
    'w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-[#0087A5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0087A5]/20 transition-colors';

  if (checkingAuth) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-400 text-sm">Cargando...</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-50 p-4 md:p-12 font-sans text-gray-900">
      <div className="w-full max-w-2xl flex justify-between items-center mb-4">
        <Link href="/app" className="text-sm text-[#0087A5] hover:underline">
          &larr; Volver a clientes
        </Link>
      </div>

      <div className="z-10 w-full max-w-2xl flex flex-col p-6 md:p-10 bg-white rounded-3xl shadow-sm border border-gray-100 mb-6">
        <div className="space-y-2 mb-6">
          <h1 className="text-2xl font-bold text-gray-950">{nombreCliente || 'Cliente'}</h1>
          <p className="text-sm text-gray-600">
            Sube la factura o facturas de este cliente y descarga el informe.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
              Factura(s) en PDF <span className="text-red-400">*</span>
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-2xl cursor-pointer transition-colors p-4 text-center ${
                isDragActive
                  ? 'border-[#0087A5] bg-[#0087A5]/10'
                  : 'bg-gray-50 hover:bg-gray-100 border-gray-200 hover:border-[#0087A5]'
              }`}
            >
              <p className="text-sm text-gray-700">
                <span className="font-semibold text-[#0087A5]">Haz clic para adjuntar</span> o
                arrastra tus facturas
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </div>

          {files.length > 0 && (
            <div className="space-y-2">
              {files.map((f, i) => (
                <div
                  key={`${f.name}-${i}`}
                  className="bg-gray-50 border border-gray-200 rounded-xl p-3 flex items-center space-x-3"
                >
                  <span className="text-sm text-gray-700 font-medium truncate flex-1">{f.name}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(i);
                    }}
                    className="text-xs text-red-500 hover:underline"
                  >
                    Quitar
                  </button>
                </div>
              ))}
            </div>
          )}

          {message && (
            <div
              className={`p-4 rounded-xl text-sm font-medium ${
                status === 'success'
                  ? 'bg-green-50 text-green-700 border border-green-100'
                  : status === 'error'
                  ? 'bg-red-50 text-red-700 border border-red-100'
                  : 'bg-blue-50 text-blue-700 border border-blue-100'
              }`}
            >
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={files.length === 0 || status === 'loading'}
            className="w-full rounded-full bg-[#0087A5] py-3.5 text-base font-semibold text-white transition-all hover:bg-[#006e88] shadow-md hover:shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {status === 'loading' ? 'Analizando...' : 'Analizar factura'}
          </button>
        </form>
      </div>

      <div className="z-10 w-full max-w-2xl flex flex-col p-6 md:p-10 bg-white rounded-3xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-950 mb-4">Historial de informes</h2>

        {loadingHistorial ? (
          <p className="text-sm text-gray-400">Cargando historial...</p>
        ) : historial.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">
            Aun no hay informes para este cliente.
          </p>
        ) : (
          <div className="space-y-2">
            {historial.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl p-4"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(item.fecha).toLocaleDateString('es-ES')}
                  </p>
                  {item.ahorro_total !== null && (
                    <p className="text-xs text-[#0087A5] font-medium">
                      Ahorro: {item.ahorro_total.toLocaleString('es-ES', { minimumFractionDigits: 2 })} EUR
                    </p>
                  )}
                  {item.fecha_fin_contrato && (
                    <p className="text-xs text-amber-600">
                      Contrato vence: {new Date(item.fecha_fin_contrato).toLocaleDateString('es-ES')}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => descargarInforme(item.id)}
                  className="text-sm text-[#0087A5] font-medium hover:underline whitespace-nowrap ml-4"
                >
                  Descargar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
