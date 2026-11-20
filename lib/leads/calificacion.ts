import "server-only";
import type { Disposicion, Nivel, Perfil, Urgencia } from "./opciones";

/**
 * Calificación del contacto. Es la señal que recibe Meta en el evento Lead
 * (custom_data.nivel) para optimizar las campañas hacia quienes sí empiezan
 * un proceso.
 *
 * La pregunta final muestra el precio (primera sesión gratis, luego S/140 cada
 * una). Solo es calificado quien acepta ese precio; quien necesita organizarse
 * es tibio y quien no podría es frío, diga lo que diga en lo demás.
 */

const PUEDE: Disposicion = "Sí, puedo invertir en eso";
const NO_PUEDE: Disposicion = "Por ahora no podría";

export function nivelConsejeria(urgencia: Urgencia, disposicion: Disposicion): Nivel {
  if (disposicion === NO_PUEDE) return "frio";
  if (disposicion !== PUEDE) return "tibio";
  return urgencia === "Solo estoy explorando" ? "tibio" : "calificado";
}

export function nivelDiagnostico(perfil: Perfil, disposicion: Disposicion): Nivel {
  if (disposicion === NO_PUEDE) return "frio";
  if (disposicion !== PUEDE) return "tibio";
  return perfil === "crecimiento" ? "tibio" : "calificado";
}

/**
 * Solo los calificados cuentan como Lead para Meta y ven el calendario.
 * Tibios y fríos se guardan en el panel y van a WhatsApp, para que la campaña
 * aprenda a traer gente que acepta el precio y no solo gente que dice que sí.
 */
export function optimizarConMeta(nivel: Nivel): boolean {
  return nivel === "calificado";
}
