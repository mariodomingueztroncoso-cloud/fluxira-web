'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Cliente {
  id: number;
  nombre_cliente: string;
  cups: string | null;
  fecha_alta: string;
  num_informes: number;
  fecha_ultimo_informe: string | null;
  fecha_fin_contrato_proxima: string | null;
}

function diasHasta(fechaIso: string): number {
  const hoy = new Date();
  const fecha = new Date(fechaIso);
  const diff = fecha.getTime() - hoy.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default function AppPanel() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [loadingClientes, setLoadingClientes] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [nombreNuevo, setNombreNuevo] = useState('');
  const [cupsNuevo, setCupsNuevo] = useState('');
  const [creando, setCreando] = useState(false);
  const [errorCrear, setErrorCrear] = useState('');
  const router = useRouter();

  const cargarClientes = async (token: string) => {
    setLoadingClientes(true);
    try {
      const response = await fetch('/api/clientes', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 401) {
        localStorage.removeItem('fluxira_token');
        router.push('/login');
        return;
      }
      const data = await response.json();
      setClientes(data);
    } catch {
      // Si falla, dejamos la lista vacia.
    } finally {
      setLoadingClientes(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('fluxira_token');
    if (!token) {
      router.push('/login');
      return;
    }
    setCheckingAuth(false);
    cargarClientes(token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('fluxira_token');
    router.push('/login');
  };

  const handleCrearCliente = async (e: React.FormEvent) => {
    e.preventDefault();
    if (nombreNuevo.trim() === '') return;

    const token = localStorage.getItem('fluxira_token');
    if (!token) {
      router.push('/login');
      return;
    }

    setCreando(true);
    setErrorCrear('');

    try {
      const response = await fetch('/api/clientes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombre_cliente: nombreNuevo.trim(),
          cups: cupsNuevo.trim() || null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setErrorCrear(data.detail || 'No se pudo crear el cliente.');
        setCreando(false);
        return;
      }

      setNombreNuevo('');
      setCupsNuevo('');
      setModalAbierto(false);
      await cargarClientes(token);
    } catch {
      setErrorCrear('No se pudo conectar con el servidor.');
    } finally {
      setCreando(false);
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
    <main className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <div className="max-w-5xl mx-auto p-4 md:p-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-950">Tus clientes</h1>
            <p className="text-sm text-gray-500 mt-1">
              {clientes.length} cliente{clientes.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setModalAbierto(true)}
              className="rounded-full bg-[#0087A5] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#006e88] shadow-sm"
            >
              + Anadir cliente
            </button>
                      <Link
              href="/app/marca"
              className="text-sm text-gray-500 hover:text-[#0087A5] hover:underline"
            >
              Tu marca
            </Link>
          <button
              onClick={handleLogout}
              className="text-sm text-gray-400 hover:text-gray-600 hover:underline"
            >
              Cerrar sesion
            </button>
          </div>
        </div>

        {loadingClientes ? (
          <p className="text-sm text-gray-400">Cargando clientes...</p>
        ) : clientes.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 mb-4">Aun no tienes clientes.</p>
            <button
              onClick={() => setModalAbierto(true)}
              className="rounded-full bg-[#0087A5] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#006e88]"
            >
              Anadir tu primer cliente
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {clientes.map((cliente) => {
              const diasContrato = cliente.fecha_fin_contrato_proxima
                ? diasHasta(cliente.fecha_fin_contrato_proxima)
                : null;
              const contratoUrgente = diasContrato !== null && diasContrato <= 60;

              return (
                <Link
                  key={cliente.id}
                  href={`/app/clientes/${cliente.id}`}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[#0087A5]/30 transition-all p-5 flex flex-col"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 text-base leading-snug">
                      {cliente.nombre_cliente}
                    </h3>
                  </div>

                  {cliente.cups && (
                    <p className="text-xs text-gray-400 mb-3 truncate">{cliente.cups}</p>
                  )}

                  <div className="mt-auto space-y-1.5 pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500">
                      {cliente.num_informes} informe{cliente.num_informes !== 1 ? 's' : ''}
                    </p>
                    {cliente.fecha_ultimo_informe && (
                      <p className="text-xs text-gray-400">
                        Ultimo: {new Date(cliente.fecha_ultimo_informe).toLocaleDateString('es-ES')}
                      </p>
                    )}
                    {diasContrato !== null && (
                      <p
                        className={`text-xs font-medium ${
                          contratoUrgente ? 'text-amber-600' : 'text-gray-400'
                        }`}
                      >
                        {diasContrato > 0
                          ? `Contrato vence en ${diasContrato} dias`
                          : 'Contrato vencido'}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal de anadir cliente */}
      {modalAbierto && (
        <div
          className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50"
          onClick={() => setModalAbierto(false)}
        >
          <div
            className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold text-gray-950 mb-4">Anadir cliente</h2>
            <form onSubmit={handleCrearCliente} className="space-y-3">
              <input
                type="text"
                value={nombreNuevo}
                onChange={(e) => setNombreNuevo(e.target.value)}
                placeholder="Nombre del cliente"
                className={inputClass}
                required
                autoFocus
              />
              <input
                type="text"
                value={cupsNuevo}
                onChange={(e) => setCupsNuevo(e.target.value)}
                placeholder="CUPS (opcional)"
                className={inputClass}
              />
              {errorCrear && <p className="text-sm text-red-600">{errorCrear}</p>}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalAbierto(false)}
                  className="flex-1 rounded-full border border-gray-200 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={creando || nombreNuevo.trim() === ''}
                  className="flex-1 rounded-full bg-[#0087A5] py-2.5 text-sm font-semibold text-white hover:bg-[#006e88] disabled:bg-gray-300"
                >
                  {creando ? 'Anadiendo...' : 'Anadir'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
