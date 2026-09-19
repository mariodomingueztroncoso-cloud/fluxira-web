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

    const apiResponse = await fetch(`${FLUXIRA_API_URL}/analisis/${id}/pdf`, {
      method: 'GET',
      headers: { Authorization: authHeader },
      cache: 'no-store',
    });

    if (!apiResponse.ok) {
      const errData = await apiResponse.json().catch(() => ({ detail: 'No se pudo descargar el informe.' }));
      return NextResponse.json(errData, { status: apiResponse.status });
    }

    const pdfBuffer = await apiResponse.arrayBuffer();
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="informe_fluxira.pdf"',
        'Cache-Control': 'no-store',
      },
    });
  } catch (err) {
    console.error('Error en GET /api/analisis/[id]/pdf:', err);
    return NextResponse.json({ detail: 'No se pudo descargar el informe.' }, { status: 500 });
  }
}
