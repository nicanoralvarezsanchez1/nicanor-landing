import type { Metadata, Viewport } from "next";
import { Playfair_Display, Poppins } from "next/font/google";
import { MetaPixelScript } from "@/components/MetaPixelScript";
import "./globals.css";

const display = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const texto = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-texto",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ||
      (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000"),
  ),
  title: "Nicanor Álvarez · Psicólogo católico | Consejería de pareja",
  description:
    "Sesión de consejería de pareja gratuita de 30 minutos y autodiagnóstico de tu relación. Psicólogo católico, online y presencial en Lima.",
  openGraph: {
    title: "Nicanor Álvarez · Psicólogo católico",
    description: "Antes de decidir, mira tu relación completa. Consejería de pareja gratuita de 30 minutos.",
    images: ["/nicanor.jpg"],
    locale: "es_PE",
    type: "website",
  },
};

export const viewport: Viewport = { themeColor: "#1e2b45" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${display.variable} ${texto.variable}`}>
      <body>
        {children}
        <MetaPixelScript />
      </body>
    </html>
  );
}
