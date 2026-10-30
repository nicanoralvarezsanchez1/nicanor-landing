"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { marcarAgendado } from "@/app/actions";
import { calendlyLink, whatsappLink } from "@/lib/config";
import { eventIds, trackMetaPixelEvent } from "@/lib/meta/pixel";
import s from "./form.module.css";

/**
 * Calendly dentro de la página. Cuando la persona elige horario, Calendly
 * manda un postMessage "calendly.event_scheduled": ahí se dispara Schedule en
 * el pixel y en el servidor (mismo event_id) y el lead pasa a "agendó".
 */
export function CalendlyInline({ leadId, nombre, email }: { leadId: string; nombre: string; email: string }) {
  const [agendado, setAgendado] = useState(false);
  const disparado = useRef(false);
  const contenedor = useRef<HTMLDivElement>(null);
  const iniciado = useRef(false);

  // El widget se monta a mano: este componente aparece después de cargar la página,
  // cuando el script de Calendly ya no busca contenedores por su cuenta.
  function iniciar() {
    const w = window as unknown as { Calendly?: { initInlineWidget: (o: { url: string; parentElement: HTMLElement }) => void } };
    if (iniciado.current || !w.Calendly || !contenedor.current) return;
    iniciado.current = true;
    w.Calendly.initInlineWidget({ url: calendlyLink(nombre, email), parentElement: contenedor.current });
  }

  useEffect(iniciar);

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (e.origin !== "https://calendly.com") return;
      const evento = (e.data as { event?: string } | null)?.event;
      if (evento !== "calendly.event_scheduled" || disparado.current) return;
      disparado.current = true;
      trackMetaPixelEvent("Schedule", { content_name: "Orientación gratuita Nicanor" }, eventIds.schedule(leadId));
      void marcarAgendado(leadId);
      setAgendado(true);
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [leadId]);

  const primerNombre = nombre.trim().split(/\s+/)[0];

  return (
    <div>
      {agendado && (
        <div className={s.agendado} role="status">
          <div className={s.check} aria-hidden="true">
            ✓
          </div>
          <h3>¡Listo, {primerNombre}! Tu sesión quedó agendada.</h3>
          <p>Te llegará la confirmación a tu correo con el enlace de la videollamada. Si necesitas cambiar el horario, puedes hacerlo desde ese mismo correo.</p>
        </div>
      )}
      <div
        ref={contenedor}
        className={s.calendly}
        style={agendado ? { minHeight: 0, height: 0, overflow: "hidden" } : undefined}
      />
      <Script src="https://assets.calendly.com/assets/external/widget.js" strategy="afterInteractive" onReady={iniciar} />
      {!agendado && (
        <p className={s.privacidad}>
          ¿Ningún horario te acomoda?{" "}
          <a
            href={whatsappLink(`Hola Nicanor, soy ${primerNombre}. Quiero agendar mi sesión de orientación gratuita pero no encontré un horario.`)}
            target="_blank"
            rel="noopener"
          >
            Escríbeme por WhatsApp
          </a>
        </p>
      )}
    </div>
  );
}
