'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const recienRegistrado = searchParams.get('registrado') === '1';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setStatus('error');
        setMessage(data.detail || 'Email o contraseña incorrectos.');
        return;
      }

      // Guardar el token y entrar en la app
      localStorage.setItem('fluxira_token', data.access_token);
      router.push('/app');
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
        <h1 className="text-2xl font-bold text-gray-950 mb-2">Inicia sesión</h1>
        <p className="text-sm text-gray-500 mb-6 text-center">
          Accede a tu cuenta de Fluxira.
        </p>

        {recienRegistrado && (
          <div className="w-full p-3 rounded-xl text-sm font-medium bg-green-50 text-green-700 border border-green-100 mb-4">
            Cuenta creada correctamente. Ya puedes iniciar sesión.
          </div>
        )}

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
              required
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
            {status === 'loading' ? 'Entrando...' : 'Iniciar sesión'}
          </button>
        </form>

        <p className="text-sm text-gray-500 mt-6">
          ¿No tienes cuenta?{' '}
          <Link href="/registro" className="text-[#0087A5] font-medium hover:underline">
            Crea una gratis
          </Link>
        </p>
      </div>
    </main>
  );
}

export default function Login() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
