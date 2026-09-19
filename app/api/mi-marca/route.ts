import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { FLUXIRA_API_URL } = process.env;
    if (!FLUXIRA_API_URL) {
      return NextResponse.json({ detail: 'Configuracion del servidor incompleta.' }, { status: 500 });
    }

    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ detail: 'No autenticado.' }, { status: 401 });
    }

    const apiResponse = await fetch(`${FLUXIRA_API_URL}/mi-marca`, {
      method: 'GET',
      headers: { Authorization: authHeader },
      cache: 'no-store',
    });

    const data = await apiResponse.json();
    return NextResponse.json(data, {
      status: apiResponse.status,
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (err) {
    console.error('Error en GET /api/mi-marca:', err);
    return NextResponse.json({ detail: 'No se pudo obtener la marca.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { FLUXIRA_API_URL } = process.env;
    if (!FLUXIRA_API_URL) {
      return NextResponse.json({ detail: 'Configuracion del servidor incompleta.' }, { status: 500 });
    }

    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ detail: 'No autenticado.' }, { status: 401 });
    }

    const formData = await req.formData();

    const apiResponse = await fetch(`${FLUXIRA_API_URL}/mi-marca`, {
      method: 'POST',
      headers: { Authorization: authHeader },
      body: formData,
    });

    const data = await apiResponse.json();
    return NextResponse.json(data, { status: apiResponse.status });
  } catch (err) {
    console.error('Error en POST /api/mi-marca:', err);
    return NextResponse.json({ detail: 'No se pudo actualizar la marca.' }, { status: 500 });
  }
}
