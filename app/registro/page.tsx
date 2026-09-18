'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Registro() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombreGestoria, setNombreGestoria] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('/api/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          nombre_gestoria: nombreGestoria || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const detalle = Array.isArray(data.detail)
          ? data.detail.map((d: any) => d.msg).join(' ')
          : data.detail || 'Error al registrar.';
        setStatus('error');
        setMessage(detalle);
        return;
      }

      // Registro correcto: redirigir a login
      router.push('/login?registrado=1');
    } catch {
      setStatus('error');
      setMessage('No se pudo conectar con el servidor. Inténtalo de nuevo.');
    }
  };

  const inputClass =
    'w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-[#0087A5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0087A5]/20 transition-colors';

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 font-sans text-gray-900">
      <div className="w-full max-w-md flex flex-col items-center p-8 bg-white rounded-3xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-950 mb-2">Crea tu cuenta</h1>
        <p className="text-sm text-gray-500 mb-6 text-center">
          Prueba Fluxira gratis. Sin tarjeta, sin compromiso.
        </p>

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
              minLength={8}
              required
            />
            <p className="text-xs text-gray-400 mt-1">Mínimo 8 caracteres.</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
              Nombre de tu gestoría <span className="text-gray-300">(opcional)</span>
            </label>
            <input
              type="text"
              value={nombreGestoria}
              onChange={(e) => setNombreGestoria(e.target.value)}
              className={inputClass}
            />
          </div>

          {message && (
            <div className="p-3 rounded-xl text-sm font-medium bg-red-50 text-red-700 border border-red-100">
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full rounded-full bg-[#0087A5] py-3.5 text-base font-semibold text-white transition-all hover:bg-[#006e88] shadow-md hover:shadow-lg disabled:bg-gray-300"
          >
            {status === 'loading' ? 'Creando cuenta...' : 'Crear cuenta gratis'}
          </button>
        </form>

        <p className="text-sm text-gray-500 mt-6">
          ¿Ya tienes cuenta?{' '}
          <Link href="/login" className="text-[#0087A5] font-medium hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </main>
  );
}
