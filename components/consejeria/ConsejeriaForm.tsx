"use client";

import { useRef, useState } from "react";
import { completarConsejeria, guardarContacto } from "@/app/actions";
import { CalendlyInline } from "@/components/form/CalendlyInline";
import {
  CONTACTO_VACIO,
  CamposContacto,
  Opciones,
  Progreso,
  contactoValido,
  formStyles as s,
  whatsappCompleto,
  type Contacto,
} from "@/components/form/Campos";
import { whatsappLink } from "@/lib/config";
import {
  DISPOSICION_OPTIONS,
  DISPOSICION_PREGUNTA,
  PROBLEMA_OPTIONS,
  QUIEN_BUSCA_OPTIONS,
  SITUACION_OPTIONS,
  URGENCIA_OPTIONS,
  type Disposicion,
  type Problema,
  type QuienBusca,
  type Situacion,
  type Urgencia,
} from "@/lib/leads/opciones";
import { eventIds, getAttribution, trackMetaPixelCustomEvent, trackMetaPixelEvent } from "@/lib/meta/pixel";

const TOTAL = 6;

interface Respuestas {
  situacion?: Situacion;
  problema?: Problema;
  quienBusca?: QuienBusca;
  urgencia?: Urgencia;
  disposicion?: Disposicion;
}

/** Formulario por pasos: guarda el contacto en el paso 1 y califica al final. */
export function ConsejeriaForm() {
  const [paso, setPaso] = useState(0);
  const [contacto, setContacto] = useState<Contacto>(CONTACTO_VACIO);
  const [r, setR] = useState<Respuestas>({});
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [resultado, setResultado] = useState<{ optimizar: boolean } | null>(null);
  const leadId = useRef<string | null>(null);

  async function enviarContacto(e: React.FormEvent) {
    e.preventDefault();
    const problema = contactoValido(contacto);
    if (problema) return setError(problema);
    setError(null);
    // Si vuelve atrás y avanza otra vez, no se crea un segundo registro.
    if (leadId.current) return setPaso(1);
    setEnviando(true);
    const res = await guardarContacto({
      ruta: "consejeria",
      nombre: contacto.nombre,
      email: contacto.email,
      whatsapp: whatsappCompleto(contacto),
      url: window.location.href,
      atribucion: getAttribution(),
    });
    setEnviando(false);
    if (!res.ok) return setError(res.error);
    leadId.current = res.id;
    trackMetaPixelCustomEvent("ContactoGuardado", { ruta: "consejeria" });
    setPaso(1);
  }

  async function terminar(disposicion: Disposicion) {
    const datos = { ...r, disposicion };
    setR(datos);
    if (!leadId.current || !datos.situacion || !datos.problema || !datos.quienBusca || !datos.urgencia) return;
    setEnviando(true);
    setError(null);
    const res = await completarConsejeria(leadId.current, {
      situacion: datos.situacion,
      problema: datos.problema,
      quienBusca: datos.quienBusca,
      urgencia: datos.urgencia,
      disposicion,
    });
    setEnviando(false);
    if (!res.ok) return setError(res.error);
    if (res.optimizar) {
      trackMetaPixelEvent(
        "Lead",
        { content_name: "Consejería Nicanor", ruta: "consejeria", nivel: res.nivel, urgencia: datos.urgencia, disposicion },
        eventIds.lead(leadId.current),
      );
    } else {
      trackMetaPixelCustomEvent("LeadNoCalificado", { ruta: "consejeria", nivel: res.nivel });
    }
    setResultado({ optimizar: res.optimizar });
    setPaso(TOTAL);
  }

  const elegir = <K extends keyof Respuestas>(campo: K, siguiente: number) => (v: Respuestas[K]) => {
    setR((prev) => ({ ...prev, [campo]: v }));
    setPaso(siguiente);
  };

  const primerNombre = contacto.nombre.trim().split(/\s+/)[0];

  return (
    <div className={s.tarjeta} id="agenda">
      {paso < TOTAL && <Progreso paso={paso + 1} total={TOTAL} />}

      {paso === 0 && (
        <form className={s.pantalla} onSubmit={enviarContacto} noValidate>
          <h2 className={s.pregunta}>Agenda tu sesión de consejería gratuita</h2>
          <p className={s.ayuda}>30 minutos por videollamada. Empieza con tus datos: te tomará un minuto.</p>
          <CamposContacto valor={contacto} onCambio={setContacto} />
          {error && <p className={s.error} role="alert">{error}</p>}
          <button className="btn btn-bloque" type="submit" disabled={enviando}>
            {enviando ? "Guardando…" : "Continuar"}
          </button>
          <p className={s.privacidad}>Tus datos son confidenciales. Solo los usa Nicanor para contactarte.</p>
        </form>
      )}

      {paso === 1 && (
        <div className={s.pantalla} key="p1">
          <h2 className={s.pregunta}>{primerNombre ? `${primerNombre}, ¿cuál` : "¿Cuál"} es su situación?</h2>
          <Opciones opciones={SITUACION_OPTIONS} valor={r.situacion} onElegir={elegir("situacion", 2)} />
        </div>
      )}

      {paso === 2 && (
        <div className={s.pantalla} key="p2">
          <h2 className={s.pregunta}>¿Qué es lo que más les está pasando?</h2>
          <Opciones opciones={PROBLEMA_OPTIONS} valor={r.problema} onElegir={elegir("problema", 3)} />
        </div>
      )}

      {paso === 3 && (
        <div className={s.pantalla} key="p3">
          <h2 className={s.pregunta}>¿Quién quiere buscar ayuda?</h2>
          <p className={s.ayuda}>Puedes empezar aunque tu pareja todavía no quiera venir.</p>
          <Opciones opciones={QUIEN_BUSCA_OPTIONS} valor={r.quienBusca} onElegir={elegir("quienBusca", 4)} />
        </div>
      )}

      {paso === 4 && (
        <div className={s.pantalla} key="p4">
          <h2 className={s.pregunta}>¿Qué tan urgente es para ti?</h2>
          <Opciones opciones={URGENCIA_OPTIONS} valor={r.urgencia} onElegir={elegir("urgencia", 5)} />
        </div>
      )}

      {paso === 5 && (
        <div className={s.pantalla} key="p5">
          <h2 className={s.pregunta}>{DISPOSICION_PREGUNTA}</h2>
          <p className={s.ayuda}>La sesión de orientación es gratuita. Esto nos ayuda a preparar la conversación.</p>
          <Opciones opciones={DISPOSICION_OPTIONS} valor={r.disposicion} onElegir={(v) => void terminar(v)} />
          {enviando && <p className={s.ayuda} style={{ marginTop: 14 }}>Guardando…</p>}
          {error && <p className={s.error} role="alert">{error}</p>}
        </div>
      )}

      {paso > 0 && paso < TOTAL && !enviando && (
        <button type="button" className={s.volver} onClick={() => setPaso(paso - 1)}>
          Volver
        </button>
      )}

      {paso === TOTAL && resultado?.optimizar && leadId.current && (
        <div className={s.pantalla}>
          <h2 className={s.pregunta}>{primerNombre}, elige el horario de tu sesión</h2>
          <p className={s.ayuda}>Gratuita, por videollamada, 30 minutos.</p>
          <CalendlyInline leadId={leadId.current} nombre={contacto.nombre} email={contacto.email} />
        </div>
      )}

      {paso === TOTAL && resultado && !resultado.optimizar && (
        <div className={s.pantalla}>
          <h2 className={s.pregunta}>Gracias, {primerNombre}.</h2>
          <p style={{ marginBottom: 18 }}>
            Entiendo que por ahora buscas información. Puedes empezar con el autodiagnóstico gratuito para ver en qué etapa está tu
            relación, y si luego quieres conversar, escríbeme.
          </p>
          <a className="btn btn-bloque" href="/diagnostico">
            Hacer el autodiagnóstico
          </a>
          <a
            className="btn btn-claro btn-bloque"
            style={{ marginTop: 10 }}
            href={whatsappLink(`Hola Nicanor, soy ${primerNombre}. Tengo una consulta sobre la consejería de pareja.`)}
            target="_blank"
            rel="noopener"
          >
            Escribir por WhatsApp
          </a>
        </div>
      )}
    </div>
  );
}
