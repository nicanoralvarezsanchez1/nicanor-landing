import Image from "next/image";
import Link from "next/link";
import s from "./encabezado.module.css";

export function Encabezado({ cta, href }: { cta: string; href: string }) {
  return (
    <header className={s.header}>
      <div className={`contenedor ${s.fila}`}>
        <Link href="/" aria-label="Nicanor Álvarez, psicólogo">
          <Image src="/logo.png" alt="Nicanor Álvarez, psicólogo" width={600} height={275} className={s.logo} priority />
        </Link>
        <a className={`btn ${s.cta}`} href={href}>
          {cta}
        </a>
      </div>
    </header>
  );
}

export function Pie() {
  return (
    <footer className={s.pie}>
      <div className={`contenedor ${s.pieFila}`}>
        <span>© {new Date().getFullYear()} Nicanor Álvarez · Psicólogo · Lima, Perú</span>
        <span className={s.pieLinks}>
          <Link href="/privacidad">Privacidad</Link>
          <a href="https://www.instagram.com/nicanoralvarezpsicologo/" target="_blank" rel="noopener">
            Instagram
          </a>
        </span>
      </div>
    </footer>
  );
}
