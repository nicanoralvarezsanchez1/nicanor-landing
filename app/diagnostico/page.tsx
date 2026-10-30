import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Diagnostico } from "@/components/diagnostico/Diagnostico";
import { VistaContenido } from "@/components/VistaContenido";
import s from "./pagina.module.css";

export const metadata: Metadata = {
  title: "¿En qué etapa está tu relación? · Autodiagnóstico de pareja | Nicanor Álvarez",
  description: "Cinco preguntas, dos minutos. Descubre en qué etapa está tu relación y cuál es el siguiente paso.",
};

export default function DiagnosticoPage() {
  return (
    <div className={s.split}>
      <VistaContenido nombre="Diagnóstico Nicanor" />
      <div className={s.panel}>
        <Image src="/fotos/tazas.jpg" alt="Dos tazas sobre la mesa de la cocina, de noche" fill sizes="(min-width: 1000px) 50vw, 100vw" priority />
      </div>
      <div className={s.columna}>
        <header className={s.barra}>
          <Link href="/" className={s.marca}>
            Nicanor Álvarez
          </Link>
          <Link href="/" className={s.enlace}>
            Sesión gratuita
          </Link>
        </header>
        <main className={s.main}>
          <Diagnostico />
        </main>
        <footer className={s.pie}>
          Este autodiagnóstico es orientativo y no reemplaza una evaluación profesional. <Link href="/privacidad">Privacidad</Link>
        </footer>
      </div>
    </div>
  );
}
