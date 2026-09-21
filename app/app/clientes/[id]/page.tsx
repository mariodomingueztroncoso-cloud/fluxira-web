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

const PERIODOS = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6'];

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

  // --- Email del cliente ---
  const [emailCliente, setEmailCliente] = useState<string | null>(null);
  const [editandoEmail, setEditandoEmail] = useState(false);
  const [emailBorrador, setEmailBorrador] = useState('');
  const [guardandoEmail, setGuardandoEmail] = useState(false);
  const [enviandoEmailId, setEnviandoEmailId] = useState<number | null>(null);
  const [avisoSinEmail, setAvisoSinEmail] = useState(false);

  // --- Comparativa de tarifa alternativa ---
  const [preciosEnergia, setPreciosEnergia] = useState<string[]>(['', '', '', '', '', '']);
  const [preciosPotencia, setPreciosPotencia] = useState<string[]>(['', '', '', '', '', '']);

  useEffect(() => {
    const guardadosEnergia = localStorage.getItem('fluxira_precios_energia');
    const guardadosPotencia = localStorage.getItem('fluxira_precios_potencia');
    if (guardadosEnergia) {
      try { setPreciosEnergia(JSON.parse(guardadosEnergia)); } catch {}
    }
    if (guardadosPotencia) {
      try { setPreciosPotencia(JSON.parse(guardadosPotencia)); } catch {}
    }
  }, []);

  const actualizarPrecioEnergia = (index: number, valor: string) => {
    const nuevos = [...preciosEnergia];
    nuevos[index] = valor;
    setPreciosEnergia(nuevos);
    localStorage.setItem('fluxira_precios_energia', JSON.stringify(nuevos));
  };

  const actualizarPrecioPotencia = (index: number, valor: string) => {
    const nuevos = [...preciosPotencia];
    nuevos[index] = valor;
    setPreciosPotencia(nuevos);
    localStorage.setItem('fluxira_precios_potencia', JSON.stringify(nuevos));
  };

  const limpiarPreciosAlternativos = () => {
    const vacios = ['', '', '', '', '', ''];
    setPreciosEnergia(vacios);
    setPreciosPotencia(vacios);
    localStorage.removeItem('fluxira_precios_energia');
    localStorage.removeItem('fluxira_precios_potencia');
  };
  // --- fin comparativa ---

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
      const clientesResp = await fetch('/api/clientes', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (clientesResp.ok) {
        const listaClientes = await clientesResp.json();
        const encontrado = listaClientes.find((c: any) => String(c.id) === clienteId);
        if (encontrado) {
          setNombreCliente(encontrado.nombre_cliente);
          setEmailCliente(encontrado.email_cliente || null);
        }
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

  const guardarEmail = async () => {
    const token = localStorage.getItem('fluxira_token');
    if (!token) {
      router.push('/login');
      return;
    }
    setGuardandoEmail(true);
    try {
      const response = await fetch(`/api/clientes/${clienteId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email_cliente: emailBorrador.trim() || null }),
      });
      if (response.ok) {
        setEmailCliente(emailBorrador.trim() || null);
        setEditandoEmail(false);
        setAvisoSinEmail(false);
      }
    } catch {
      // Si falla, el usuario puede reintentar.
    } finally {
      setGuardandoEmail(false);
    }
  };

  const enviarPorEmail = async (analisisId: number) => {
    if (!emailCliente) {
      setAvisoSinEmail(true);
      setEditandoEmail(true);
      setEmailBorrador('');
      return;
    }
    const token = localStorage.getItem('fluxira_token');
    if (!token) {
      router.push('/login');
      return;
    }
    setEnviandoEmailId(analisisId);
    try {
      const response = await fetch(`/api/analisis/${analisisId}/enviar-email`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) {
        alert(data.detail || 'No se pudo enviar el email.');
        return;
      }
      alert(data.mensaje || 'Informe enviado correctamente.');
    } catch {
      alert('No se pudo conectar con el servidor.');
    } finally {
      setEnviandoEmailId(null);
    }
  };

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

      const energiaInformada = preciosEnergia.some((p) => p.trim() !== '');
      if (energiaInformada) {
        formData.append('precios_energia_alt', preciosEnergia.map((p) => p.trim()).join(','));
      }

      const potenciaInformada = preciosPotencia.some((p) => p.trim() !== '');
      if (potenciaInformada) {
        formData.append('precios_potencia_alt', preciosPotencia.map((p) => p.trim()).join(','));
      }

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

  const inputPrecioClass =
    'w-full rounded-lg border border-gray-200 bg-gray-50 px-2 py-1.5 text-sm text-gray-900 text-center placeholder-gray-300 focus:border-[#0087A5] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0087A5]/30 transition-colors';

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
        <div className="space-y-2 mb-4">
          <h1 className="text-2xl font-bold text-gray-950">{nombreCliente || 'Cliente'}</h1>
          <p className="text-sm text-gray-600">
            Sube la factura o facturas de este cliente y descarga el informe.
          </p>
        </div>

        {/* --- Email del cliente --- */}
        <div className="mb-6 p-3 bg-gray-50 rounded-xl border border-gray-100">
          {editandoEmail ? (
            <div>
              {avisoSinEmail && (
                <p className="text-xs text-amber-600 mb-2">
                  Este cliente no tiene email configurado. Añádelo para poder enviarle informes.
                </p>
              )}
              <div className="flex gap-2">
                <input
                  type="email"
                  value={emailBorrador}
                  onChange={(e) => setEmailBorrador(e.target.value)}
                  placeholder="email@cliente.com"
                  className={inputClass}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={guardarEmail}
                  disabled={guardandoEmail}
                  className="rounded-xl bg-[#0087A5] px-4 py-2 text-sm font-semibold text-white hover:bg-[#006e88] disabled:bg-gray-300 whitespace-nowrap"
                >
                  {guardandoEmail ? '...' : 'Guardar'}
                </button>
                <button
                  type="button"
                  onClick={() => { setEditandoEmail(false); setAvisoSinEmail(false); }}
                  className="text-sm text-gray-400 hover:text-gray-600 px-2"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {emailCliente ? (
                  <>Email: <span className="font-medium text-gray-900">{emailCliente}</span></>
                ) : (
                  <span className="text-gray-400">Sin email configurado</span>
                )}
              </p>
              <button
                type="button"
                onClick={() => { setEmailBorrador(emailCliente || ''); setEditandoEmail(true); }}
                className="text-xs text-[#0087A5] hover:underline"
              >
                {emailCliente ? 'Editar' : 'Añadir email'}
              </button>
            </div>
          )}
        </div>
        {/* --- fin email --- */}

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

          {/* --- Comparativa de tarifa alternativa --- */}
          <div className="border border-gray-100 rounded-2xl p-4 bg-gray-50/50">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                ¿Tienes una oferta de otra comercializadora?
              </p>
              <button
                type="button"
                onClick={limpiarPreciosAlternativos}
                className="text-xs text-gray-400 hover:text-red-500 hover:underline"
              >
                Limpiar
              </button>
            </div>
            <p className="text-xs text-gray-500 mb-3">
              Rellena solo los periodos que conozcas de la oferta. Los que dejes vacíos se
              compararán con el precio actual del cliente.
            </p>

            <div className="grid grid-cols-7 gap-2 items-center mb-1.5">
              <span className="text-xs font-medium text-gray-400"></span>
              {PERIODOS.map((p) => (
                <span key={p} className="text-xs font-medium text-gray-500 text-center">
                  {p}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2 items-center mb-2">
              <span className="text-xs text-gray-600">€/kWh</span>
              {preciosEnergia.map((valor, i) => (
                <input
                  key={`e-${i}`}
                  type="number"
                  step="0.0001"
                  min="0"
                  value={valor}
                  onChange={(ev) => actualizarPrecioEnergia(i, ev.target.value)}
                  placeholder="—"
                  className={inputPrecioClass}
                />
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2 items-center">
              <span className="text-xs text-gray-600">€/kW·día</span>
              {preciosPotencia.map((valor, i) => (
                <input
                  key={`p-${i}`}
                  type="number"
                  step="0.0001"
                  min="0"
                  value={valor}
                  onChange={(ev) => actualizarPrecioPotencia(i, ev.target.value)}
                  placeholder="—"
                  className={inputPrecioClass}
                />
              ))}
            </div>
          </div>
          {/* --- fin comparativa --- */}

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
                <div className="flex items-center gap-3 shrink-0 ml-4">
                  <button
                    onClick={() => enviarPorEmail(item.id)}
                    disabled={enviandoEmailId === item.id}
                    className="text-sm text-[#0087A5] font-medium hover:underline whitespace-nowrap disabled:opacity-50"
                  >
                    {enviandoEmailId === item.id ? 'Enviando...' : 'Enviar por email'}
                  </button>
                  <button
                    onClick={() => descargarInforme(item.id)}
                    className="text-sm text-[#0087A5] font-medium hover:underline whitespace-nowrap"
                  >
                    Descargar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
