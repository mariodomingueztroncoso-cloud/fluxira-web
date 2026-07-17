import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No se ha recibido ningún archivo' }, { status: 400 });
    }

    // Convertimos el archivo recibido en un Buffer para poder adjuntarlo al correo
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Configuramos el transporte de correo usando las variables de entorno de Vercel
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Definimos el correo que te va a llegar a ti
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: process.env.RECEIVER_EMAIL || process.env.SMTP_USER, // Tu correo de destino
      subject: `📥 Nueva Factura Recibida - Fluxira`,
      text: `Has recibido una nueva factura para analizar a través del portal web.\n\nArchivo adjunto: ${file.name}`,
      attachments: [
        {
          filename: file.name,
          content: buffer,
        },
      ],
    };

    // Enviamos el correo con el PDF adjunto
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: 'Factura enviada correctamente' });

  } catch (error) {
    console.error('Error en la API de subida:', error);
    return NextResponse.json({ error: 'Error interno del servidor al procesar el archivo' }, { status: 500 });
  }
}