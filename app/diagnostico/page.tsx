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
    <div className={s.fondo}>
      <VistaContenido nombre="Diagnóstico Nicanor" />
      <header className={s.header}>
        <Link href="/" aria-label="Nicanor Álvarez, psicólogo">
          <Image src="/logo.png" alt="Nicanor Álvarez, psicólogo" width={600} height={275} className={s.logo} priority />
        </Link>
      </header>
      <main className={s.main}>
        <Diagnostico />
      </main>
      <footer className={s.pie}>
        Este autodiagnóstico es orientativo y no reemplaza una evaluación profesional. · <Link href="/privacidad">Privacidad</Link>
      </footer>
    </div>
  );
}
