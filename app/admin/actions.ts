"use server";

import { after } from "next/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from "@/lib/admin/auth";
import { sendMetaEvent } from "@/lib/meta/capi";
import { ESTADOS, type Estado } from "@/lib/leads/opciones";
import { getLead, logEstado, updateLead, type LeadRow } from "@/lib/leads/store";

async function exigirSesion() {
  const token = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;
  if (!(await verifyAdminSessionToken(token))) throw new Error("No autorizado");
}

const userData = (l: LeadRow) => ({
  email: l.email,
  phone: l.whatsapp,
  nombre: l.nombre,
  externalId: l.id,
  fbp: l.fbp,
  fbc: l.fbc,
  ip: l.client_ip,
  userAgent: l.user_agent,
});

/**
 * Cambia el estado de un contacto. Los estados que importan para vender se
 * informan a Meta (API de Conversiones), así la campaña aprende quién agenda
 * y quién se vuelve paciente, no solo quién deja sus datos:
 *  - "agendo" (si no lo registró Calendly)  → Schedule
 *  - "paciente"                             → Purchase con el valor del programa
 */
export async function cambiarEstado(leadId: string, estado: Estado) {
  await exigirSesion();
  if (!ESTADOS.includes(estado)) return { ok: false };
  const lead = await getLead(leadId);
  if (!lead || lead.estado === estado) return { ok: true };

  const marcarAgenda = (estado === "agendo" || estado === "asistio" || estado === "paciente") && !lead.agendado_at;
  await updateLead(leadId, { estado, ...(marcarAgenda && { agendado_at: new Date().toISOString() }) });
  await logEstado(leadId, lead.estado, estado);

  after(async () => {
    if (marcarAgenda) {
      await sendMetaEvent({
        eventName: "Schedule",
        eventId: `schedule-${leadId}`,
        eventSourceUrl: lead.event_source_url,
        eventData: { content_name: "Orientación gratuita Nicanor", ruta: lead.ruta, nivel: lead.nivel, origen_evento: "panel" },
        userData: userData(lead),
      });
    }
    if (estado === "paciente") {
      await sendMetaEvent({
        eventName: "Purchase",
        eventId: `purchase-${leadId}`,
        eventSourceUrl: lead.event_source_url,
        eventData: {
          value: Number(process.env.PURCHASE_VALUE_PEN || 600),
          currency: "PEN",
          content_name: "Programa terapéutico Nicanor",
          ruta: lead.ruta,
          nivel: lead.nivel,
        },
        userData: userData(lead),
      });
    }
  });

  revalidatePath("/admin");
  return { ok: true };
}

export async function guardarNota(leadId: string, notas: string) {
  await exigirSesion();
  await updateLead(leadId, { notas: notas.slice(0, 4000) });
  revalidatePath("/admin");
  return { ok: true };
}
