import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  console.log('>>> GET /api/clientes EJECUTANDO VERSION NUEVA <<<');
  try {
    const { FLUXIRA_API_URL } = process.env;
    if (!FLUXIRA_API_URL) {
      return NextResponse.json({ detail: 'Configuracion del servidor incompleta.' }, { status: 500 });
    }

    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ detail: 'No autenticado.' }, { status: 401 });
    }

    const apiResponse = await fetch(`${FLUXIRA_API_URL}/clientes`, {
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
    console.error('Error en GET /api/clientes:', err);
    return NextResponse.json({ detail: 'No se pudo obtener la lista de clientes.' }, { status: 500 });
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

    const body = await req.json();

    const apiResponse = await fetch(`${FLUXIRA_API_URL}/clientes`, {
      method: 'POST',
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await apiResponse.json();
    return NextResponse.json(data, { status: apiResponse.status });
  } catch (err) {
    console.error('Error en POST /api/clientes:', err);
    return NextResponse.json({ detail: 'No se pudo crear el cliente.' }, { status: 500 });
  }
}
