import "server-only";
import type { Disposicion, Nivel, Perfil, Urgencia } from "./opciones";

/**
 * Calificación del contacto. Es la señal que recibe Meta en el evento Lead
 * (custom_data.nivel) para optimizar las campañas hacia quienes sí empiezan
 * un proceso.
 *
 * Regla dura (igual que Sinapsis): quien prefiere opciones gratuitas es "frio",
 * diga lo que diga en lo demás.
 */

const PRIORIDAD: Disposicion = "Totalmente: es mi prioridad ahora";
const GRATIS: Disposicion = "Por ahora prefiero opciones gratuitas";

export function nivelConsejeria(urgencia: Urgencia, disposicion: Disposicion): Nivel {
  if (disposicion === GRATIS) return "frio";
  if (disposicion === PRIORIDAD) return "calificado";
  return urgencia === "Solo estoy explorando" ? "tibio" : "calificado";
}

export function nivelDiagnostico(perfil: Perfil, disposicion: Disposicion): Nivel {
  if (disposicion === GRATIS) return "frio";
  if (disposicion === PRIORIDAD) return "calificado";
  return perfil === "distancia" || perfil === "quiebre" ? "calificado" : "tibio";
}

/** Solo los calificados y tibios cuentan como Lead para Meta; los fríos van como evento propio. */
export function optimizarConMeta(nivel: Nivel): boolean {
  return nivel !== "frio";
}
