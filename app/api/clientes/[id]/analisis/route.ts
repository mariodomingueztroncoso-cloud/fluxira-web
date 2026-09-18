import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { FLUXIRA_API_URL } = process.env;
    if (!FLUXIRA_API_URL) {
      return NextResponse.json({ detail: 'Configuracion del servidor incompleta.' }, { status: 500 });
    }

    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ detail: 'No autenticado.' }, { status: 401 });
    }

    const { id } = await params;

    const apiResponse = await fetch(`${FLUXIRA_API_URL}/clientes/${id}/analisis`, {
      method: 'GET',
      headers: { Authorization: authHeader },
    });

    const data = await apiResponse.json();
    return NextResponse.json(data, { status: apiResponse.status });
  } catch (err) {
    console.error('Error en GET /api/clientes/[id]/analisis:', err);
    return NextResponse.json({ detail: 'No se pudo obtener el historial.' }, { status: 500 });
  }
}
