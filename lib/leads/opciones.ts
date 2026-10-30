/**
 * Preguntas y opciones de los dos embudos. Las usan el cliente (para pintar
 * los formularios) y el servidor (para validar contra la lista conocida en
 * vez de confiar en lo que manda el navegador).
 */

export const RUTAS = ["consejeria", "diagnostico"] as const;
export type Ruta = (typeof RUTAS)[number];

export const NIVELES = ["calificado", "tibio", "frio"] as const;
export type Nivel = (typeof NIVELES)[number];

export const ESTADOS = ["nuevo", "contactado", "agendo", "asistio", "paciente", "no_interesa"] as const;
export type Estado = (typeof ESTADOS)[number];

export const ESTADO_LABEL: Record<Estado, string> = {
  nuevo: "Nuevo",
  contactado: "Contactado",
  agendo: "Agendó orientación",
  asistio: "Asistió",
  paciente: "Paciente",
  no_interesa: "No le interesa",
};

// --- Preguntas comunes a las dos rutas ---------------------------------------

export const QUIEN_BUSCA_OPTIONS = ["Solo yo", "Los dos", "Mi pareja no quiere"] as const;
export type QuienBusca = (typeof QUIEN_BUSCA_OPTIONS)[number];

/** Disposición a invertir en recuperar el matrimonio (no se pregunta por el precio). */
export const DISPOSICION_OPTIONS = [
  "Totalmente: es mi prioridad ahora",
  "Sí, si veo que el proceso tiene sentido",
  "Por ahora prefiero opciones gratuitas",
] as const;
export type Disposicion = (typeof DISPOSICION_OPTIONS)[number];

export const DISPOSICION_PREGUNTA =
  "¿Qué tan dispuesto o dispuesta estás a invertir en un proceso para recuperar la paz en tu matrimonio?";

// --- Ruta B · Sesión de consejería -------------------------------------------

export const SITUACION_OPTIONS = ["Casados", "Convivientes", "Enamorados"] as const;
export type Situacion = (typeof SITUACION_OPTIONS)[number];

export const PROBLEMA_OPTIONS = [
  "Peleamos siempre por lo mismo",
  "Hay distancia y frialdad",
  "Hay desconfianza",
  "Estamos pensando en separarnos",
  "Otro motivo",
] as const;
export type Problema = (typeof PROBLEMA_OPTIONS)[number];

export const URGENCIA_OPTIONS = [
  "Estamos al borde de separarnos",
  "Quiero actuar antes de que empeore",
  "Solo estoy explorando",
] as const;
export type Urgencia = (typeof URGENCIA_OPTIONS)[number];

// --- Ruta A · Autodiagnóstico ------------------------------------------------

export interface PreguntaDiagnostico {
  id: string;
  texto: string;
  opciones: readonly string[]; // índice 0..3 = 1..4 puntos
}

export const PREGUNTAS_DIAGNOSTICO: readonly PreguntaDiagnostico[] = [
  {
    id: "desacuerdos",
    texto: "Cuando tienen un desacuerdo importante, ¿qué suele pasar?",
    opciones: [
      "Lo hablamos con calma y llegamos a acuerdos",
      "Terminamos discutiendo o evitamos el tema",
      "Discutimos seguido, con reproches, y cada vez hay más distancia",
      "Ya casi no hablamos: hay silencio o tensión constante",
    ],
  },
  {
    id: "conexion",
    texto: "¿Cómo están hoy el cariño y el tiempo juntos?",
    opciones: [
      "Nos buscamos y cuidamos lo nuestro",
      "Nos queremos, pero la rutina nos absorbió",
      "Somos más compañeros de casa que pareja",
      "Me siento solo o sola dentro de la relación",
    ],
  },
  {
    id: "heridas",
    texto: "¿Hay algo del pasado que sigue pesando entre ustedes?",
    opciones: [
      "No, las crisis pasan y las superamos",
      "Hay heridas que todavía necesitamos sanar",
      "Hay desconfianza o un tema grave sin resolver",
      "Estamos pensando seriamente en separarnos",
    ],
  },
  {
    id: "tiempo",
    texto: "¿Hace cuánto se sienten así?",
    opciones: ["Es algo reciente", "Unos meses", "Más de un año", "Varios años, y cada vez peor"],
  },
  {
    id: "bienestar",
    texto: "En las últimas semanas, ¿cómo te has sentido tú?",
    opciones: [
      "En paz y con energía",
      "Cansado o cansada, pero lo llevo",
      "Con tristeza o ansiedad frecuente",
      "Siento que ya no puedo más",
    ],
  },
];

export const PERFILES = ["crecimiento", "piloto", "distancia", "quiebre"] as const;
export type Perfil = (typeof PERFILES)[number];

export const PERFIL_INFO: Record<Perfil, { titulo: string; texto: string; paso: string }> = {
  crecimiento: {
    titulo: "Relación en crecimiento",
    texto:
      "Tienen una base sólida. Lo que viven son desafíos normales de la convivencia, y eso no significa que algo esté roto.",
    paso: "Una conversación de orientación puede ayudarles a cuidar lo que ya funciona y a prevenir que los roces crezcan.",
  },
  piloto: {
    titulo: "Relación en piloto automático",
    texto:
      "La rutina les está quitando cercanía. Funcionan como equipo para la casa y los pendientes, pero se están perdiendo como pareja.",
    paso: "Es el mejor momento para actuar: todavía no hay heridas profundas y los cambios llegan rápido cuando se trabajan a tiempo.",
  },
  distancia: {
    titulo: "Relación en distancia",
    texto:
      "Están cargando un dolor acumulado y nudos difíciles de desatar solos. Cada intento de hablar termina igual o no termina.",
    paso: "Necesitan un espacio guiado para entender qué pasó, por qué se repite y qué camino tienen como pareja.",
  },
  quiebre: {
    titulo: "Relación en punto de quiebre",
    texto:
      "Están en un momento límite. Es normal sentir que separarse es la única salida cuando el cansancio es tan grande.",
    paso: "Antes de tomar una decisión, necesitan mirar la relación completa con alguien que los acompañe: con lo que duele y con lo que todavía funciona.",
  },
};

/** Puntaje (5 a 20) y perfil a partir de los índices de respuesta (0..3). */
export function calcularDiagnostico(respuestas: readonly number[]) {
  const puntaje = respuestas.reduce((s, r) => s + r + 1, 0);
  const pensandoSepararse = respuestas[2] === 3;
  let perfil: Perfil;
  if (puntaje >= 17 || pensandoSepararse) perfil = "quiebre";
  else if (puntaje >= 13) perfil = "distancia";
  else if (puntaje >= 9) perfil = "piloto";
  else perfil = "crecimiento";
  const bienestar = respuestas[4];
  return {
    puntaje,
    perfil,
    alertaIndividual: bienestar >= 2,
    alertaCrisis: bienestar === 3,
  };
}

export function respuestasValidas(respuestas: unknown): respuestas is number[] {
  return (
    Array.isArray(respuestas) &&
    respuestas.length === PREGUNTAS_DIAGNOSTICO.length &&
    respuestas.every((r) => Number.isInteger(r) && r >= 0 && r <= 3)
  );
}
