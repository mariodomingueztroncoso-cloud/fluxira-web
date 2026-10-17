import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fluxira | Análisis de facturas para gestores energéticos",
  description:
    "Sube la factura de tu cliente y descarga un informe de ahorro con tu marca: optimización de potencia, reactiva y comparativa de tarifas.",
  openGraph: {
    title: "Fluxira | Análisis de facturas para gestores energéticos",
    description:
      "Informes de ahorro con tu marca en minutos: optimización de potencia, reactiva y comparativa de tarifas.",
    locale: "es_ES",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
