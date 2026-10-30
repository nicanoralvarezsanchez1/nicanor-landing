import type { Metadata, Viewport } from "next";
import { Literata } from "next/font/google";
import { MetaPixelScript } from "@/components/MetaPixelScript";
import "./globals.css";

// Una sola familia para toda la página: Literata, serif de lectura con cortes de titular.
const literata = Literata({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-literata",
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

export const viewport: Viewport = { themeColor: "#e9e6e2" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={literata.variable}>
      <body>
        {children}
        <MetaPixelScript />
      </body>
    </html>
  );
}
