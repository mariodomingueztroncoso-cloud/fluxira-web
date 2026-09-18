'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Cliente {
  id: number;
  nombre_cliente: string;
  cups: string | null;
  fecha_alta: string;
}

export default function AppPanel() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [loadingClientes, setLoadingClientes] = useState(true);
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
      // Si falla la carga, dejamos la lista vacia; el usuario puede reintentar.
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
    <main className="flex min-h-screen flex-col items-center bg-gray-50 p-4 md:p-12 font-sans text-gray-900">
      <div className="w-full max-w-2xl flex justify-end mb-4">
        <button
          onClick={handleLogout}
          className="text-sm text-gray-400 hover:text-gray-600 hover:underline"
        >
          Cerrar sesion
        </button>
      </div>

      <div className="z-10 w-full max-w-2xl flex flex-col p-6 md:p-10 bg-white rounded-3xl shadow-sm border border-gray-100">
        <div className="space-y-2 mb-8">
          <h1 className="text-2xl font-bold text-gray-950">Tus clientes</h1>
          <p className="text-sm text-gray-600">
            Gestiona los clientes y consulta el historial de informes de cada uno.
          </p>
        </div>

        {/* Formulario de nuevo cliente */}
        <form onSubmit={handleCrearCliente} className="w-full space-y-3 mb-8 p-4 bg-gray-50 rounded-2xl border border-gray-100">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Anadir cliente</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={nombreNuevo}
              onChange={(e) => setNombreNuevo(e.target.value)}
              placeholder="Nombre del cliente"
              className={inputClass}
              required
            />
            <input
              type="text"
              value={cupsNuevo}
              onChange={(e) => setCupsNuevo(e.target.value)}
              placeholder="CUPS (opcional)"
              className={inputClass}
            />
          </div>
          {errorCrear && (
            <p className="text-sm text-red-600">{errorCrear}</p>
          )}
          <button
            type="submit"
            disabled={creando || nombreNuevo.trim() === ''}
            className="rounded-full bg-[#0087A5] px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#006e88] disabled:bg-gray-300"
          >
            {creando ? 'Anadiendo...' : 'Anadir cliente'}
          </button>
        </form>

        {/* Lista de clientes */}
        {loadingClientes ? (
          <p className="text-sm text-gray-400">Cargando clientes...</p>
        ) : clientes.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">
            Aun no tienes clientes. Anade el primero arriba.
          </p>
        ) : (
          <div className="space-y-2">
            {clientes.map((cliente) => (
              <Link
                key={cliente.id}
                href={`/app/clientes/${cliente.id}`}
                className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl p-4 transition-colors"
              >
                <div>
                  <p className="text-sm font-semibold text-gray-900">{cliente.nombre_cliente}</p>
                  {cliente.cups && (
                    <p className="text-xs text-gray-400">{cliente.cups}</p>
                  )}
                </div>
                <span className="text-[#0087A5] text-sm font-medium">Ver &rarr;</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
