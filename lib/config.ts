/** Datos públicos de Nicanor, configurables por variables de entorno. */

export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "51933643720";
export const CALENDLY_URL =
  process.env.NEXT_PUBLIC_CALENDLY_URL || "https://calendly.com/nicanoralvarezsanchez1/psicoterapia";
export const INSTAGRAM_URL = "https://www.instagram.com/nicanoralvarezpsicologo/";

export function whatsappLink(mensaje: string, numero = WHATSAPP_NUMBER) {
  return `https://wa.me/${numero.replace(/\D/g, "")}?text=${encodeURIComponent(mensaje)}`;
}

/** Enlace de Calendly con nombre y correo ya completados. */
export function calendlyLink(nombre?: string, email?: string) {
  const url = new URL(CALENDLY_URL);
  if (nombre) url.searchParams.set("name", nombre);
  if (email) url.searchParams.set("email", email);
  url.searchParams.set("hide_gdpr_banner", "1");
  return url.toString();
}
