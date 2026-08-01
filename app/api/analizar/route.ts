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

    // 1. Parsear el FormData
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const nombre = formData.get('nombre')?.toString() || 'Sin nombre';
    const contacto = formData.get('contacto')?.toString() || 'Sin contacto';
    const email = formData.get('email')?.toString() || '';

    if (!file) {
      return NextResponse.json({ error: 'No se recibió ningún archivo.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 2. Enviar aviso por email (registro para Mario)
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
      text: `Nombre:   ${nombre}\nContacto: ${contacto}${emailLine}`,
      attachments: [{ filename: file.name, content: buffer }],
    });

    // 3. Llamar a la API de análisis (Railway)
    const apiFormData = new FormData();
    apiFormData.append('files', new Blob([buffer], { type: 'application/pdf' }), file.name);
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