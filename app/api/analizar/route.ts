import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, FLUXIRA_API_URL } = process.env;

    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
      console.error('Faltan variables de entorno SMTP');
      return NextResponse.json(
        { error: 'Configuración del servidor incompleta.' },
        { status: 500 }
      );
    }
    if (!FLUXIRA_API_URL) {
      console.error('Falta FLUXIRA_API_URL');
      return NextResponse.json(
        { error: 'Configuración del servidor incompleta (API).' },
        { status: 500 }
      );
    }

    // 1. Parsear el FormData (ahora puede traer varios archivos con la clave 'files')
    const formData = await req.formData();
    const files = formData.getAll('files') as File[];
    const nombre = formData.get('nombre')?.toString() || 'Sin nombre';
    const contacto = formData.get('contacto')?.toString() || 'Sin contacto';
    const email = formData.get('email')?.toString() || '';

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No se recibió ningún archivo.' }, { status: 400 });
    }

    // Convertir todos los archivos a buffer (para el email y para reenviar a la API)
    const buffers = await Promise.all(
      files.map(async (f) => ({
        filename: f.name,
        content: Buffer.from(await f.arrayBuffer()),
      }))
    );

    // 2. Enviar aviso por email (registro para Mario), con todas las facturas adjuntas
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: Number(SMTP_PORT) === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
    const emailLine = email ? `\nEmail:    ${email}` : '';
    await transporter.sendMail({
      from: SMTP_USER,
      to: SMTP_USER,
      subject: `Nueva factura de ${nombre}`,
      text: `Nombre:   ${nombre}\nContacto: ${contacto}${emailLine}\nFacturas: ${files.length}`,
      attachments: buffers.map((b) => ({ filename: b.filename, content: b.content })),
    });

    // 3. Llamar a la API de análisis (Railway), reenviando todas las facturas
    const apiFormData = new FormData();
    buffers.forEach((b) => {
      apiFormData.append('files', new Blob([b.content], { type: 'application/pdf' }), b.filename);
    });
    apiFormData.append('nombre_empresa', nombre);
    apiFormData.append('nombre_instalacion', 'Instalacion');

    const apiResponse = await fetch(`${FLUXIRA_API_URL}/analizar`, {
      method: 'POST',
      body: apiFormData,
    });

    if (!apiResponse.ok) {
      const errText = await apiResponse.text();
      console.error('Error de la API de análisis:', errText);
      return NextResponse.json(
        { error: 'No se pudo generar el informe.' },
        { status: 502 }
      );
    }

    // 4. Devolver el PDF del informe al usuario
    const informeBuffer = await apiResponse.arrayBuffer();
    return new NextResponse(informeBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="informe_fluxira.pdf"`,
      },
    });

  } catch (err) {
    console.error('Error en la API de subida:', err);
    return NextResponse.json(
      { error: 'No se pudo procesar el envío.' },
      { status: 500 }
    );
  }
}