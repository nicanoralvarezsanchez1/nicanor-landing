"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { completarDiagnostico, guardarContacto } from "@/app/actions";
import { CalendlyInline } from "@/components/form/CalendlyInline";
import {
  CONTACTO_VACIO,
  CamposContacto,
  Opciones,
  Progreso,
  contactoValido,
  formStyles as f,
  whatsappCompleto,
  type Contacto,
} from "@/components/form/Campos";
import { whatsappLink } from "@/lib/config";
import {
  DISPOSICION_OPTIONS,
  DISPOSICION_PREGUNTA,
  PERFIL_INFO,
  PREGUNTAS_DIAGNOSTICO,
  QUIEN_BUSCA_OPTIONS,
  type Disposicion,
  type Perfil,
  type QuienBusca,
} from "@/lib/leads/opciones";
import { eventIds, getAttribution, trackMetaPixelCustomEvent, trackMetaPixelEvent } from "@/lib/meta/pixel";
import s from "./diagnostico.module.css";

const N = PREGUNTAS_DIAGNOSTICO.length;
// Pantallas: intro · N preguntas · contacto · quién busca · disposición · resultado
const TOTAL_PASOS = N + 3;

type Pantalla =
  | { tipo: "intro" }
  | { tipo: "pregunta"; i: number }
  | { tipo: "contacto" }
  | { tipo: "quien" }
  | { tipo: "disposicion" }
  | { tipo: "resultado" };

interface Diag {
  perfil: Perfil;
  puntaje: number;
  alertaIndividual: boolean;
  alertaCrisis: boolean;
}

export function Diagnostico() {
  const [pantalla, setPantalla] = useState<Pantalla>({ tipo: "intro" });
  const [respuestas, setRespuestas] = useState<(number | null)[]>(Array(N).fill(null));
  const [contacto, setContacto] = useState<Contacto>(CONTACTO_VACIO);
  const [quien, setQuien] = useState<QuienBusca | null>(null);
  const [disposicion, setDisposicion] = useState<Disposicion | null>(null);
  const [diag, setDiag] = useState<Diag | null>(null);
  const [optimizar, setOptimizar] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const leadId = useRef<string | null>(null);

  const primerNombre = contacto.nombre.trim().split(/\s+/)[0];

  function empezar() {
    trackMetaPixelCustomEvent("InicioDiagnostico");
    setPantalla({ tipo: "pregunta", i: 0 });
  }

  // Guardar la respuesta por índice (no sumar): así "Volver" nunca duplica puntos.
  function responder(i: number, indice: number) {
    const nuevas = [...respuestas];
    nuevas[i] = indice;
    setRespuestas(nuevas);
    setPantalla(i + 1 < N ? { tipo: "pregunta", i: i + 1 } : { tipo: "contacto" });
  }

  async function enviarContacto(e: React.FormEvent) {
    e.preventDefault();
    const problema = contactoValido(contacto);
    if (problema) return setError(problema);
    setError(null);
    if (leadId.current) return setPantalla({ tipo: "quien" });
    setEnviando(true);
    const res = await guardarContacto({
      ruta: "diagnostico",
      nombre: contacto.nombre,
      email: contacto.email,
      whatsapp: whatsappCompleto(contacto),
      url: window.location.href,
      atribucion: getAttribution(),
      respuestas: respuestas as number[],
    });
    setEnviando(false);
    if (!res.ok) return setError(res.error);
    leadId.current = res.id;
    setDiag({
      perfil: res.perfil!,
      puntaje: res.puntaje!,
      alertaIndividual: Boolean(res.alertaIndividual),
      alertaCrisis: Boolean(res.alertaCrisis),
    });
    trackMetaPixelCustomEvent("ContactoGuardado", { ruta: "diagnostico" });
    setPantalla({ tipo: "quien" });
  }

  async function terminar(d: Disposicion) {
    setDisposicion(d);
    if (!leadId.current || !quien) return;
    setEnviando(true);
    setError(null);
    const res = await completarDiagnostico(leadId.current, { quienBusca: quien, disposicion: d });
    setEnviando(false);
    if (!res.ok) return setError(res.error);
    if (res.optimizar) {
      trackMetaPixelEvent(
        "Lead",
        { content_name: "Diagnóstico Nicanor", ruta: "diagnostico", nivel: res.nivel, perfil: diag?.perfil, disposicion: d },
        eventIds.lead(leadId.current),
      );
    } else {
      trackMetaPixelCustomEvent("LeadNoCalificado", { ruta: "diagnostico", nivel: res.nivel });
    }
    trackMetaPixelCustomEvent("DiagnosticoCompletado", { perfil: diag?.perfil });
    setOptimizar(res.optimizar);
    setPantalla({ tipo: "resultado" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function volver() {
    setError(null);
    if (pantalla.tipo === "pregunta") setPantalla(pantalla.i === 0 ? { tipo: "intro" } : { tipo: "pregunta", i: pantalla.i - 1 });
    else if (pantalla.tipo === "contacto") setPantalla({ tipo: "pregunta", i: N - 1 });
    else if (pantalla.tipo === "quien") setPantalla({ tipo: "contacto" });
    else if (pantalla.tipo === "disposicion") setPantalla({ tipo: "quien" });
  }

  const pasoActual =
    pantalla.tipo === "pregunta"
      ? pantalla.i + 1
      : pantalla.tipo === "contacto"
        ? N + 1
        : pantalla.tipo === "quien"
          ? N + 2
          : pantalla.tipo === "disposicion"
            ? N + 3
            : 0;

  return (
    <div className={s.caja}>
      {pantalla.tipo === "intro" && (
        <div className={`${f.pantalla} ${s.intro}`}>
          <span className="etiqueta">Autodiagnóstico de pareja · 2 minutos</span>
          <h1 className={s.titulo}>¿En qué etapa está tu relación?</h1>
          <p className={s.texto}>
            Cinco preguntas para entender qué les está pasando y cuál es el siguiente paso. Al final recibes tu resultado y una
            recomendación concreta.
          </p>
          <button className="btn btn-bloque" onClick={empezar}>
            Empezar el diagnóstico
          </button>
          <p className={f.privacidad}>Tus respuestas son confidenciales.</p>
          <div className={s.autor}>
            <Image src="/nicanor.jpg" alt="Nicanor Álvarez" width={44} height={44} className={s.avatar} />
            <span>Creado por Nicanor Álvarez, psicólogo con +13 años acompañando parejas.</span>
          </div>
        </div>
      )}

      {pasoActual > 0 && <Progreso paso={pasoActual} total={TOTAL_PASOS} />}

      {pantalla.tipo === "pregunta" && (
        <div className={f.pantalla} key={`q${pantalla.i}`}>
          <p className={s.numero}>Pregunta {pantalla.i + 1} de {N}</p>
          <h2 className={f.pregunta}>{PREGUNTAS_DIAGNOSTICO[pantalla.i].texto}</h2>
          <Opciones
            opciones={PREGUNTAS_DIAGNOSTICO[pantalla.i].opciones}
            valor={respuestas[pantalla.i] !== null ? PREGUNTAS_DIAGNOSTICO[pantalla.i].opciones[respuestas[pantalla.i]!] : null}
            onElegir={(_, idx) => responder(pantalla.i, idx)}
          />
        </div>
      )}

      {pantalla.tipo === "contacto" && (
        <form className={f.pantalla} onSubmit={enviarContacto} noValidate>
          <h2 className={f.pregunta}>Tu resultado está listo</h2>
          <p className={f.ayuda}>Déjame tus datos para mostrártelo y enviarte una recomendación según tu caso.</p>
          <CamposContacto valor={contacto} onCambio={setContacto} />
          {error && <p className={f.error} role="alert">{error}</p>}
          <button className="btn btn-bloque" type="submit" disabled={enviando}>
            {enviando ? "Guardando…" : "Continuar"}
          </button>
          <p className={f.privacidad}>Tus datos son confidenciales. Solo los usa Nicanor para contactarte.</p>
        </form>
      )}

      {pantalla.tipo === "quien" && (
        <div className={f.pantalla} key="quien">
          <h2 className={f.pregunta}>{primerNombre}, ¿quién quiere buscar ayuda?</h2>
          <Opciones
            opciones={QUIEN_BUSCA_OPTIONS}
            valor={quien}
            onElegir={(v) => {
              setQuien(v);
              setPantalla({ tipo: "disposicion" });
            }}
          />
        </div>
      )}

      {pantalla.tipo === "disposicion" && (
        <div className={f.pantalla} key="disp">
          <h2 className={f.pregunta}>{DISPOSICION_PREGUNTA}</h2>
          <Opciones opciones={DISPOSICION_OPTIONS} valor={disposicion} onElegir={(v) => void terminar(v)} />
          {enviando && <p className={f.ayuda} style={{ marginTop: 14 }}>Calculando tu resultado…</p>}
          {error && <p className={f.error} role="alert">{error}</p>}
        </div>
      )}

      {(pantalla.tipo === "pregunta" || pantalla.tipo === "contacto" || pantalla.tipo === "quien" || pantalla.tipo === "disposicion") &&
        !enviando && (
          <button type="button" className={f.volver} onClick={volver}>
            ← Volver
          </button>
        )}

      {pantalla.tipo === "resultado" && diag && (
        <Resultado diag={diag} nombre={primerNombre} optimizar={optimizar} leadId={leadId.current!} contacto={contacto} />
      )}
    </div>
  );
}

function Resultado({
  diag,
  nombre,
  optimizar,
  leadId,
  contacto,
}: {
  diag: Diag;
  nombre: string;
  optimizar: boolean;
  leadId: string;
  contacto: Contacto;
}) {
  const info = PERFIL_INFO[diag.perfil];
  const urgente = diag.perfil === "quiebre";
  return (
    <div className={f.pantalla}>
      <span className="etiqueta">Tu resultado</span>
      <p className={s.texto} style={{ marginTop: 8 }}>{nombre}, tu relación está en la etapa de:</p>
      <h2 className={s.perfil}>{info.titulo}</h2>
      <p className={s.texto}>{info.texto}</p>
      <div className={s.paso}>
        <strong>Tu siguiente paso</strong>
        <p>{info.paso}</p>
      </div>

      {diag.alertaIndividual && (
        <p className={s.texto}>
          Además, noto que estás cargando un peso emocional importante a nivel personal. A veces, para cuidar la relación, primero
          necesitamos recuperar nuestra propia paz. Eso también lo podemos ver en la sesión.
        </p>
      )}

      {diag.alertaCrisis && (
        <div className={s.crisis} role="note">
          <strong>Si sientes que no puedes más, no estás solo ni sola.</strong>
          <p>
            Puedes llamar gratis a la Línea 113, opción 5 (salud mental, MINSA), las 24 horas. Si es una emergencia, llama al 106
            o acude al centro de salud más cercano.
          </p>
        </div>
      )}

      {optimizar ? (
        <>
          <h3 className={s.ctaTitulo}>{urgente ? "Agenda una atención prioritaria" : "Agenda tu sesión de consejería gratuita"}</h3>
          <p className={s.texto}>30 minutos por videollamada, sin costo. Elige el horario que te acomode:</p>
          <CalendlyInline leadId={leadId} nombre={contacto.nombre} email={contacto.email} />
        </>
      ) : (
        <>
          <p className={s.texto}>
            Cuando quieras dar el siguiente paso, puedes escribirme y conversamos sin compromiso.
          </p>
          <a
            className="btn btn-bloque"
            href={whatsappLink(`Hola Nicanor, soy ${nombre}. Hice el autodiagnóstico y me salió "${info.titulo}". Quisiera conversar.`)}
            target="_blank"
            rel="noopener"
          >
            Escribir a Nicanor por WhatsApp
          </a>
        </>
      )}
    </div>
  );
}
