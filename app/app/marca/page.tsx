'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function MiMarca() {
  const [nombreComercial, setNombreComercial] = useState('');
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState<'success' | 'error'>('success');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const cargarMarcaActual = async (token: string) => {
    try {
      const response = await fetch('/api/mi-marca', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 401) {
        localStorage.removeItem('fluxira_token');
        router.push('/login');
        return;
      }
      const data = await response.json();
      if (data.nombre_comercial) setNombreComercial(data.nombre_comercial);

      // Intentar cargar el logo actual, si existe
      const logoResponse = await fetch('/api/mi-marca/logo', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (logoResponse.ok) {
        const blob = await logoResponse.blob();
        setLogoPreview(URL.createObjectURL(blob));
      }
    } catch {
      // Si falla, dejamos los campos vacios; el usuario puede configurar de nuevo.
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('fluxira_token');
    if (!token) {
      router.push('/login');
      return;
    }
    setCheckingAuth(false);
    cargarMarcaActual(token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'image/png' && file.type !== 'image/jpeg') {
      setMensaje('Solo se permiten imagenes PNG o JPEG.');
      setTipoMensaje('error');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setMensaje('El logo no puede superar los 2MB.');
      setTipoMensaje('error');
      return;
    }

    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
    setMensaje('');
  };

  const handleGuardar = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem('fluxira_token');
    if (!token) {
      router.push('/login');
      return;
    }

    setGuardando(true);
    setMensaje('');

    try {
      const formData = new FormData();
      if (nombreComercial.trim()) {
        formData.append('nombre_comercial', nombreComercial.trim());
      }
      if (logoFile) {
        formData.append('logo', logoFile);
      }

      const response = await fetch('/api/mi-marca', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setMensaje(data.detail || 'No se pudo guardar la marca.');
        setTipoMensaje('error');
        return;
      }

      setMensaje('Marca actualizada correctamente.');
      setTipoMensaje('success');
      setLogoFile(null);
    } catch {
      setMensaje('No se pudo conectar con el servidor.');
      setTipoMensaje('error');
    } finally {
      setGuardando(false);
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
    <main className="min-h-screen bg-gray-50 font-sans text-gray-900 p-4 md:p-10">
      <div className="max-w-lg mx-auto">
        <Link href="/app" className="text-sm text-[#0087A5] hover:underline mb-4 inline-block">
          &larr; Volver a clientes
        </Link>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8">
          <h1 className="text-xl font-bold text-gray-950 mb-1">Tu marca</h1>
          <p className="text-sm text-gray-500 mb-6">
            Personaliza los informes que generas con tu logo y nombre comercial.
          </p>

          <form onSubmit={handleGuardar} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                Nombre comercial
              </label>
              <input
                type="text"
                value={nombreComercial}
                onChange={(e) => setNombreComercial(e.target.value)}
                placeholder="Ej. Talleres Garcia Energia"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                Logo
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="cursor-pointer border-2 border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center hover:border-[#0087A5] transition-colors"
              >
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Logo actual"
                    className="max-h-24 max-w-full object-contain mb-2"
                  />
                ) : (
                  <p className="text-sm text-gray-400">Sin logo configurado</p>
                )}
                <p className="text-xs text-[#0087A5] font-medium mt-2">
                  {logoPreview ? 'Cambiar logo' : 'Subir logo'}
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg"
                  className="hidden"
                  onChange={handleLogoChange}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">PNG o JPEG, maximo 2MB.</p>
            </div>

            {mensaje && (
              <div
                className={`p-3 rounded-xl text-sm font-medium ${
                  tipoMensaje === 'success'
                    ? 'bg-green-50 text-green-700 border border-green-100'
                    : 'bg-red-50 text-red-700 border border-red-100'
                }`}
              >
                {mensaje}
              </div>
            )}

            <button
              type="submit"
              disabled={guardando}
              className="w-full rounded-full bg-[#0087A5] py-3 text-sm font-semibold text-white transition-all hover:bg-[#006e88] disabled:bg-gray-300"
            >
              {guardando ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
