"use client";

import { useEffect, useRef, useState } from "react";
import { whatsappLink } from "@/lib/config";
import { trackMetaPixelEvent } from "@/lib/meta/pixel";
import s from "./form.module.css";

/**
 * Cuenta regresiva que lleva a la persona al WhatsApp de Nicanor con un
 * resumen de sus respuestas ya escrito. Reemplaza al calendario: la gente
 * escribía por WhatsApp en vez de agendar, así que la ruta va directo ahí.
 */
export function RedireccionWhatsapp({ segundos, mensaje }: { segundos: number; mensaje: string }) {
  const [quedan, setQuedan] = useState(segundos);
  const ido = useRef(false);
  const enlace = whatsappLink(mensaje);

  function ir() {
    if (ido.current) return;
    ido.current = true;
    trackMetaPixelEvent("Contact", { content_name: "WhatsApp Nicanor" });
    window.location.href = enlace;
  }

  useEffect(() => {
    if (quedan <= 0) {
      ir();
      return;
    }
    const t = setTimeout(() => setQuedan((q) => q - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quedan]);

  return (
    <div className={s.redireccion} role="status" aria-live="polite">
      <p className={s.redireccionTexto}>
        Te llevo al WhatsApp de Nicanor en <strong>{Math.max(quedan, 0)}</strong> {quedan === 1 ? "segundo" : "segundos"}, con tu
        resumen ya escrito. Solo tienes que enviarlo.
      </p>
      <div className={s.redireccionBarra}>
        <span style={{ width: `${((segundos - Math.max(quedan, 0)) / segundos) * 100}%` }} />
      </div>
      <a
        className="btn btn-bloque"
        href={enlace}
        onClick={(e) => {
          e.preventDefault();
          ir();
        }}
      >
        Ir a WhatsApp ahora
      </a>
    </div>
  );
}
