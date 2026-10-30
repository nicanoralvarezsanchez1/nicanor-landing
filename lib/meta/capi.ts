import "server-only";
import { createHash } from "node:crypto";

/**
 * API de Conversiones de Meta (servidor). Complementa al pixel del navegador
 * con los mismos nombres de evento y el mismo event_id, así Meta los cuenta
 * una vez y los recibe aunque haya bloqueadores o iOS.
 *
 * A diferencia de Sinapsis, aquí se mandan también IP, user agent,
 * external_id y nombre hasheado, que suben la calidad de coincidencia (EMQ).
 *
 * META_TEST_EVENT_CODE (opcional): mientras exista, los eventos van a la
 * pestaña "Probar eventos" del Administrador de eventos. Quitarla al terminar.
 */

const hash = (v: string) => createHash("sha256").update(v.trim().toLowerCase()).digest("hex");

export interface MetaUserData {
  email?: string | null;
  phone?: string | null;
  nombre?: string | null;
  externalId?: string | null;
  fbp?: string | null;
  fbc?: string | null;
  ip?: string | null;
  userAgent?: string | null;
}

interface MetaEventParams {
  eventName: string;
  eventId?: string;
  eventSourceUrl?: string | null;
  eventData?: Record<string, unknown>;
  userData: MetaUserData;
}

/** Envía un evento. Nunca lanza: un fallo de Meta no debe romper el formulario ni el panel. */
export async function sendMetaEvent({ eventName, eventId, eventSourceUrl, eventData, userData }: MetaEventParams) {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const token = process.env.META_CAPI_TOKEN;
  if (!pixelId || !token) {
    console.warn(`Meta CAPI sin configurar: no se envió ${eventName}`);
    return;
  }

  const telefono = userData.phone?.replace(/\D/g, "");
  const primerNombre = userData.nombre?.trim().split(/\s+/)[0];
  const user_data: Record<string, unknown> = {
    ...(userData.email && { em: [hash(userData.email)] }),
    ...(telefono && { ph: [hash(telefono)] }),
    ...(primerNombre && { fn: [hash(primerNombre)] }),
    ...(userData.externalId && { external_id: [hash(userData.externalId)] }),
    country: [hash("pe")],
    ...(userData.fbp && { fbp: userData.fbp }),
    ...(userData.fbc && { fbc: userData.fbc }),
    ...(userData.ip && { client_ip_address: userData.ip }),
    ...(userData.userAgent && { client_user_agent: userData.userAgent }),
  };

  const testEventCode = process.env.META_TEST_EVENT_CODE;
  const payload = {
    data: [
      {
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        ...(eventId && { event_id: eventId }),
        ...(eventSourceUrl && { event_source_url: eventSourceUrl }),
        user_data,
        custom_data: eventData ?? {},
      },
    ],
    ...(testEventCode && { test_event_code: testEventCode }),
  };

  try {
    const res = await fetch(`https://graph.facebook.com/v21.0/${pixelId}/events?access_token=${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) console.error("Meta CAPI error:", await res.json().catch(() => res.status));
  } catch (error) {
    console.error("Meta CAPI error:", error);
  }
}
