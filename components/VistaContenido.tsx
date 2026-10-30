"use client";

import { useEffect } from "react";
import { trackMetaPixelEvent } from "@/lib/meta/pixel";

/** ViewContent al abrir cada landing, para que Meta sepa qué página vio. */
export function VistaContenido({ nombre }: { nombre: string }) {
  useEffect(() => {
    // El pixel carga después de la página: se espera un momento si aún no existe.
    const t = setTimeout(() => trackMetaPixelEvent("ViewContent", { content_name: nombre }), 600);
    return () => clearTimeout(t);
  }, [nombre]);
  return null;
}
