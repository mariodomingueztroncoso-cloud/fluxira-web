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

    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { detail: 'No autenticado.' },
        { status: 401 }
      );
    }

    // Reenviar el FormData tal cual llega, incluyendo la cabecera Authorization
    const formData = await req.formData();

    const apiResponse = await fetch(`${FLUXIRA_API_URL}/analizar`, {
      method: 'POST',
      headers: {
        Authorization: authHeader,
      },
      body: formData,
    });

    if (!apiResponse.ok) {
      const errData = await apiResponse.json().catch(() => ({ detail: 'Error al generar el informe.' }));
      return NextResponse.json(errData, { status: apiResponse.status });
    }

    const informeBuffer = await apiResponse.arrayBuffer();
    return new NextResponse(informeBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="informe_fluxira.pdf"`,
      },
    });

  } catch (err) {
    console.error('Error en /api/analizar:', err);
    return NextResponse.json(
      { detail: 'No se pudo procesar el envío.' },
      { status: 500 }
    );
  }
}
