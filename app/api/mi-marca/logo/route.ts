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

    const apiResponse = await fetch(`${FLUXIRA_API_URL}/mi-marca/logo`, {
      method: 'GET',
      headers: { Authorization: authHeader },
      cache: 'no-store',
    });

    if (!apiResponse.ok) {
      return NextResponse.json({ detail: 'Sin logo configurado.' }, { status: apiResponse.status });
    }

    const contentType = apiResponse.headers.get('content-type') || 'image/png';
    const imageBuffer = await apiResponse.arrayBuffer();

    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'no-store',
      },
    });
  } catch (err) {
    console.error('Error en GET /api/mi-marca/logo:', err);
    return NextResponse.json({ detail: 'No se pudo obtener el logo.' }, { status: 500 });
  }
}
