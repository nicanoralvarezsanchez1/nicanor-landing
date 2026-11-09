import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import { MetaPixelScript } from "@/components/MetaPixelScript";
import "./globals.css";

// Una sola familia para toda la página: Montserrat, libre y muy cercana a Gilroy (la fuente del diseñador,
// cuya licencia no permite publicarla en un repositorio abierto). 800 = Gilroy ExtraBold en titulares.
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "800"],
  style: ["normal", "italic"],
  variable: "--font-montserrat",
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
    <html lang="es" className={montserrat.variable}>
      <body>
        {children}
        <MetaPixelScript />
      </body>
    </html>
  );
}
