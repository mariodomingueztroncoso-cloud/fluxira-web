import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { FLUXIRA_API_URL } = process.env;
    if (!FLUXIRA_API_URL) {
      return NextResponse.json(
        { detail: 'Configuración del servidor incompleta.' },
        { status: 500 }
      );
    }

    const body = await req.json();

    const apiResponse = await fetch(`${FLUXIRA_API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await apiResponse.json();

    return NextResponse.json(data, { status: apiResponse.status });
  } catch (err) {
    console.error('Error en /api/login:', err);
    return NextResponse.json(
      { detail: 'No se pudo procesar el login.' },
      { status: 500 }
    );
  }
}
