"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export interface FotoPanel {
  id: string;
  src: string;
  alt: string;
  /** "retrato" para fotos con fondo blanco: se muestran enteras sobre el tono de piedra. */
  modo?: "retrato";
}

/**
 * Mitad fija de la pantalla en escritorio. Cambia de foto, con un fundido lento, cuando entra en el centro
 * de la pantalla una sección con data-foto="<id>" dentro del mismo bloque.
 */
export function PanelFotos({ fotos, className, s }: { fotos: FotoPanel[]; className: string; s: Record<string, string> }) {
  const ref = useRef<HTMLDivElement>(null);
  const [activa, setActiva] = useState(fotos[0].id);

  useEffect(() => {
    const bloque = ref.current?.parentElement;
    if (!bloque) return;
    const secciones = bloque.querySelectorAll<HTMLElement>("[data-foto]");
    const obs = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) if (e.isIntersecting) setActiva(e.target.getAttribute("data-foto")!);
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    secciones.forEach((sec) => obs.observe(sec));
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className={className} aria-hidden="true">
      {fotos.map((f) => (
        <div key={f.id} className={`${s.capa} ${f.id === activa ? s.activa : ""} ${f.modo === "retrato" ? s.capaRetrato : ""}`}>
          <Image src={f.src} alt={f.alt} fill sizes="50vw" priority={f.id === fotos[0].id} />
        </div>
      ))}
    </div>
  );
}
