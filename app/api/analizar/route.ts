// app/api/analizar/route.ts
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    // 1. Verificar que las variables de entorno existen ANTES de nada
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
      console.error('Faltan variables de entorno SMTP:', {
        SMTP_HOST: !!SMTP_HOST,
        SMTP_PORT: !!SMTP_PORT,
        SMTP_USER: !!SMTP_USER,
        SMTP_PASS: !!SMTP_PASS,
      });
      return NextResponse.json(
        { error: 'Configuración del servidor incompleta.' },
        { status: 500 }
      );
    }

    // 2. Parsear el FormData
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const nombre = formData.get('nombre')?.toString() || 'Sin nombre';
    const contacto = formData.get('contacto')?.toString() || 'Sin contacto';
    const email = formData.get('email')?.toString() || '';

    if (!file) {
      return NextResponse.json({ error: 'No se recibió ningún archivo.' }, { status: 400 });
    }

    // 3. Convertir el archivo a Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 4. Configurar Nodemailer
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: Number(SMTP_PORT) === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });

    // 5. Enviar el correo con el PDF adjunto
    const emailLine = email ? `\nEmail:    ${email}` : '';
    await transporter.sendMail({
      from: SMTP_USER,
      to: SMTP_USER,
      subject: `Nueva factura de ${nombre}`,
      text: `Nombre:   ${nombre}\nContacto: ${contacto}${emailLine}`,
      attachments: [{ filename: file.name, content: buffer }],
    });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error('Error en la API de subida:', err);
    return NextResponse.json(
      { error: 'No se pudo procesar el envío.' },
      { status: 500 }
    );
  }
}
