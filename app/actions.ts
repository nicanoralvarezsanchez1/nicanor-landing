"use server";

import { after } from "next/server";
import { headers } from "next/headers";
import { sendMetaEvent } from "@/lib/meta/capi";
import { nivelConsejeria, nivelDiagnostico, optimizarConMeta } from "@/lib/leads/calificacion";
import { getLead, insertLead, logEstado, updateLead, type LeadRow } from "@/lib/leads/store";
import {
  DISPOSICION_OPTIONS,
  PROBLEMA_OPTIONS,
  QUIEN_BUSCA_OPTIONS,
  RUTAS,
  SITUACION_OPTIONS,
  URGENCIA_OPTIONS,
  calcularDiagnostico,
  respuestasValidas,
  type Disposicion,
  type Nivel,
  type Perfil,
  type Problema,
  type QuienBusca,
  type Ruta,
  type Situacion,
  type Urgencia,
} from "@/lib/leads/opciones";

// Los Server Actions son endpoints públicos: todo se valida aquí, no se confía en el cliente.
const corto = (v: unknown, max = 200) => (typeof v === "string" && v.trim() ? v.trim().slice(0, max) : null);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ERROR_GUARDAR = "No pudimos guardar tus datos. Inténtalo de nuevo.";

export interface AtribucionInput {
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  utmContent?: string | null;
  utmTerm?: string | null;
  origen?: string | null;
  fbclid?: string | null;
  fbp?: string | null;
  fbc?: string | null;
}

async function datosDeRed() {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || null;
  return { ip, userAgent: corto(h.get("user-agent"), 400) };
}

function userDataDe(lead: LeadRow) {
  return {
    email: lead.email,
    phone: lead.whatsapp,
    nombre: lead.nombre,
    externalId: lead.id,
    fbp: lead.fbp,
    fbc: lead.fbc,
    ip: lead.client_ip,
    userAgent: lead.user_agent,
  };
}

// --- Paso de contacto (las dos rutas) -----------------------------------------

interface ContactoInput {
  ruta: Ruta;
  nombre: string;
  email: string;
  whatsapp: string;
  url?: string;
  atribucion?: AtribucionInput;
  /** Solo diagnóstico: índices 0..3 de las 5 respuestas. */
  respuestas?: number[];
}

export type ContactoResult =
  | { ok: true; id: string; perfil?: Perfil; puntaje?: number; alertaIndividual?: boolean; alertaCrisis?: boolean }
  | { ok: false; error: string };

/**
 * Guarda el contacto apenas la persona lo deja, antes de las demás preguntas,
 * para no perderla si abandona. Queda sin `completed_at` hasta terminar.
 */
export async function guardarContacto(input: ContactoInput): Promise<ContactoResult> {
  const nombre = corto(input.nombre, 80);
  const email = corto(input.email, 160)?.toLowerCase() ?? null;
  const whatsapp = (typeof input.whatsapp === "string" ? input.whatsapp : "").replace(/[^\d+]/g, "").slice(0, 20);
  if (!RUTAS.includes(input.ruta)) return { ok: false, error: ERROR_GUARDAR };
  if (!nombre || nombre.length < 2) return { ok: false, error: "Escribe tu nombre." };
  if (!email || !EMAIL_RE.test(email)) return { ok: false, error: "Revisa tu correo." };
  if (whatsapp.replace(/\D/g, "").length < 8) return { ok: false, error: "Revisa tu número de WhatsApp." };

  let diagnostico: ReturnType<typeof calcularDiagnostico> | null = null;
  if (input.ruta === "diagnostico") {
    if (!respuestasValidas(input.respuestas)) return { ok: false, error: ERROR_GUARDAR };
    diagnostico = calcularDiagnostico(input.respuestas);
  }

  const a = input.atribucion ?? {};
  const red = await datosDeRed();
  try {
    const id = await insertLead({
      ruta: input.ruta,
      nombre,
      email,
      whatsapp,
      ...(diagnostico && {
        respuestas: input.respuestas,
        puntaje: diagnostico.puntaje,
        perfil: diagnostico.perfil,
        alerta_individual: diagnostico.alertaIndividual,
        alerta_crisis: diagnostico.alertaCrisis,
      }),
      utm_source: corto(a.utmSource),
      utm_medium: corto(a.utmMedium),
      utm_campaign: corto(a.utmCampaign),
      utm_content: corto(a.utmContent),
      utm_term: corto(a.utmTerm),
      origen: corto(a.origen, 60),
      fbclid: corto(a.fbclid, 500),
      fbp: corto(a.fbp, 200),
      fbc: corto(a.fbc, 500),
      client_ip: red.ip,
      user_agent: red.userAgent,
      event_source_url: corto(input.url, 500),
    });
    return diagnostico ? { ok: true, id, ...diagnostico } : { ok: true, id };
  } catch (error) {
    console.error("Error guardando contacto:", error);
    return { ok: false, error: ERROR_GUARDAR };
  }
}

// --- Cierre de cada ruta ------------------------------------------------------

export type CompletarResult = { ok: true; nivel: Nivel; optimizar: boolean } | { ok: false; error: string };

async function cerrarLead(lead: LeadRow, campos: Partial<LeadRow>, nivel: Nivel): Promise<CompletarResult> {
  const optimizar = optimizarConMeta(nivel);
  try {
    await updateLead(lead.id, { ...campos, nivel, completed_at: new Date().toISOString() });
  } catch (error) {
    console.error("Error completando lead:", error);
    return { ok: false, error: ERROR_GUARDAR };
  }

  // El mismo Lead que dispara el pixel, desde el servidor. Solo calificados y tibios:
  // así la campaña optimiza hacia quienes sí quieren empezar un proceso.
  if (optimizar) {
    after(() =>
      sendMetaEvent({
        eventName: "Lead",
        eventId: `lead-${lead.id}`,
        eventSourceUrl: lead.event_source_url,
        eventData: {
          content_name: lead.ruta === "diagnostico" ? "Diagnóstico Nicanor" : "Consejería Nicanor",
          ruta: lead.ruta,
          nivel,
          ...(campos.perfil || lead.perfil ? { perfil: campos.perfil ?? lead.perfil } : {}),
          ...(campos.urgencia ? { urgencia: campos.urgencia } : {}),
          disposicion: campos.disposicion,
        },
        userData: userDataDe(lead),
      }),
    );
  }
  return { ok: true, nivel, optimizar };
}

interface ConsejeriaInput {
  situacion: Situacion;
  problema: Problema;
  quienBusca: QuienBusca;
  urgencia: Urgencia;
  disposicion: Disposicion;
}

export async function completarConsejeria(leadId: string, data: ConsejeriaInput): Promise<CompletarResult> {
  if (
    !SITUACION_OPTIONS.includes(data.situacion) ||
    !PROBLEMA_OPTIONS.includes(data.problema) ||
    !QUIEN_BUSCA_OPTIONS.includes(data.quienBusca) ||
    !URGENCIA_OPTIONS.includes(data.urgencia) ||
    !DISPOSICION_OPTIONS.includes(data.disposicion)
  ) {
    return { ok: false, error: "Selecciona una opción válida." };
  }
  const lead = await getLead(leadId);
  if (!lead || lead.ruta !== "consejeria") return { ok: false, error: ERROR_GUARDAR };

  const nivel = nivelConsejeria(data.urgencia, data.disposicion);
  return cerrarLead(
    lead,
    {
      situacion: data.situacion,
      problema: data.problema,
      quien_busca: data.quienBusca,
      urgencia: data.urgencia,
      disposicion: data.disposicion,
    },
    nivel,
  );
}

export async function completarDiagnostico(
  leadId: string,
  data: { quienBusca: QuienBusca; disposicion: Disposicion },
): Promise<CompletarResult> {
  if (!QUIEN_BUSCA_OPTIONS.includes(data.quienBusca) || !DISPOSICION_OPTIONS.includes(data.disposicion)) {
    return { ok: false, error: "Selecciona una opción válida." };
  }
  const lead = await getLead(leadId);
  if (!lead || lead.ruta !== "diagnostico" || !lead.perfil) return { ok: false, error: ERROR_GUARDAR };

  const nivel = nivelDiagnostico(lead.perfil as Perfil, data.disposicion);
  return cerrarLead(lead, { quien_busca: data.quienBusca, disposicion: data.disposicion }, nivel);
}

// --- Cita agendada en Calendly ------------------------------------------------

/**
 * Se llama cuando Calendly avisa que la persona eligió horario. Marca el lead
 * como "agendó" y manda Schedule a Meta con el mismo event_id que el pixel.
 */
export async function marcarAgendado(leadId: string): Promise<{ ok: boolean }> {
  const lead = await getLead(leadId);
  if (!lead) return { ok: false };
  if (lead.agendado_at) return { ok: true }; // ya registrado: no duplicar el evento

  const avanzar = lead.estado === "nuevo" || lead.estado === "contactado";
  try {
    await updateLead(leadId, {
      agendado_at: new Date().toISOString(),
      ...(avanzar && { estado: "agendo" as const }),
    });
    if (avanzar) await logEstado(leadId, lead.estado, "agendo");
  } catch (error) {
    console.error("Error marcando agendado:", error);
    return { ok: false };
  }

  after(() =>
    sendMetaEvent({
      eventName: "Schedule",
      eventId: `schedule-${leadId}`,
      eventSourceUrl: lead.event_source_url,
      eventData: { content_name: "Orientación gratuita Nicanor", ruta: lead.ruta, nivel: lead.nivel },
      userData: userDataDe(lead),
    }),
  );
  return { ok: true };
}
