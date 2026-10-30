/**
 * Helpers del Meta Pixel (navegador). El equivalente del servidor (API de
 * Conversiones, mismos nombres de evento y mismo event_id) vive en lib/meta/capi.ts.
 */

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

/** Evento estándar. Con eventId, Meta lo une con el mismo evento enviado desde el servidor. */
export function trackMetaPixelEvent(eventName: string, params?: Record<string, unknown>, eventId?: string) {
  if (typeof window === "undefined" || !window.fbq) return;
  if (eventId) window.fbq("track", eventName, params, { eventID: eventId });
  else window.fbq("track", eventName, params);
}

/** Evento personalizado (fbq "trackCustom"). */
export function trackMetaPixelCustomEvent(eventName: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined" || !window.fbq) return;
  window.fbq("trackCustom", eventName, params);
}

/** IDs de evento deterministas: el pixel y el servidor generan el mismo y Meta cuenta uno. */
export const eventIds = {
  lead: (leadId: string) => `lead-${leadId}`,
  schedule: (leadId: string) => `schedule-${leadId}`,
  purchase: (leadId: string) => `purchase-${leadId}`,
};

export function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

const CLAVE_ATRIBUCION = "nicanor_atribucion";
const DIAS_ATRIBUCION = 30;

export interface Atribucion {
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmContent: string | null;
  utmTerm: string | null;
  fbclid: string | null;
  origen: string | null;
  fbp: string | null;
  fbc: string | null;
}

function origenPorReferente(): string | null {
  const ref = document.referrer;
  if (!ref) return "directo";
  try {
    const host = new URL(ref).hostname;
    if (host === window.location.hostname) return null;
    if (/instagram\.com$/.test(host)) return "instagram";
    if (/(facebook|fb)\.com$/.test(host)) return "facebook";
    if (/whatsapp|wa\.me/.test(host)) return "whatsapp";
    if (/google\./.test(host)) return "google";
    return host.slice(0, 60);
  } catch {
    return null;
  }
}

/**
 * UTM, fbclid y cookies de Meta de esta visita. Si la visita no trae UTM ni
 * fbclid se usa la última guardada (30 días), para no perder de qué anuncio vino.
 */
export function getAttribution(): Atribucion {
  const vacio: Atribucion = {
    utmSource: null, utmMedium: null, utmCampaign: null, utmContent: null, utmTerm: null,
    fbclid: null, origen: null, fbp: null, fbc: null,
  };
  if (typeof window === "undefined") return vacio;

  const sp = new URLSearchParams(window.location.search);
  let a = {
    utmSource: sp.get("utm_source"),
    utmMedium: sp.get("utm_medium"),
    utmCampaign: sp.get("utm_campaign"),
    utmContent: sp.get("utm_content"),
    utmTerm: sp.get("utm_term"),
    fbclid: sp.get("fbclid"),
    origen: null as string | null,
  };
  const traeDatos = a.utmSource || a.utmCampaign || a.utmContent || a.fbclid;
  try {
    if (traeDatos) {
      localStorage.setItem(CLAVE_ATRIBUCION, JSON.stringify({ ...a, guardado: Date.now() }));
    } else {
      const guardada = JSON.parse(localStorage.getItem(CLAVE_ATRIBUCION) ?? "null");
      if (guardada && Date.now() - guardada.guardado < DIAS_ATRIBUCION * 864e5) a = { ...guardada };
      else a.origen = origenPorReferente();
    }
  } catch {
    a.origen = origenPorReferente();
  }

  return {
    ...a,
    fbp: readCookie("_fbp"),
    // _fbc puede no existir aún si el clic acaba de ocurrir: se arma desde fbclid.
    fbc: readCookie("_fbc") ?? (a.fbclid ? `fb.1.${Date.now()}.${a.fbclid}` : null),
  };
}
