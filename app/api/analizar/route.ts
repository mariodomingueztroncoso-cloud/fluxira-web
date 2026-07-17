import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const phone = formData.get('phone') as string;
    const file = formData.get('attachment') as File;

    if (!name || !phone || !file) {
      return NextResponse.json({ success: false, error: 'Faltan campos requeridos' }, { status: 400 });
    }

    // Convertimos el PDF a un formato que Node pueda leer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Configuramos el motor de envíos (Usa tu Gmail)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'mario.fluxira@gmail.com', // <-- CAMBIA ESTO POR TU EMAIL
        pass: 'vaezgekcalnclxel ', // <-- AQUÍ IRÁ TU CLAVE DE APLICACIÓN DE GOOGLE
      },
    });

    const mailOptions = {
      from: 'Fluxira Web <mario@fluxira.es>',
      to: 'mario.fluxira@gmail.com', // Te lo mandas a ti mismo
      subject: `Nueva factura para analizar - ${name}`,
      text: `Nombre del negocio: ${name}\nTeléfono/WhatsApp: ${phone}`,
      attachments: [
        {
          filename: file.name,
          content: buffer,
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: 'Error al procesar' }, { status: 500 });
  }
}