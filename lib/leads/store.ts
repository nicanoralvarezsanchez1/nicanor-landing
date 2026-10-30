import "server-only";
import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import type { Estado } from "./opciones";

/**
 * Acceso a la tabla `leads`. Con Supabase configurado usa la clave secreta
 * (salta RLS; la tabla no tiene políticas públicas). Sin Supabase guarda en memoria:
 * sirve para probar en local y para publicar antes de conectar la base, pero en Vercel
 * esa memoria se borra en cada arranque, así que no hay que lanzar anuncios sin Supabase.
 */

export interface LeadRow {
  id: string;
  created_at: string;
  updated_at: string;
  ruta: string;
  nombre: string;
  email: string;
  whatsapp: string;
  situacion: string | null;
  problema: string | null;
  quien_busca: string | null;
  urgencia: string | null;
  disposicion: string | null;
  respuestas: number[] | null;
  puntaje: number | null;
  perfil: string | null;
  alerta_individual: boolean;
  alerta_crisis: boolean;
  nivel: string | null;
  completed_at: string | null;
  agendado_at: string | null;
  estado: Estado;
  notas: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  origen: string | null;
  fbclid: string | null;
  fbp: string | null;
  fbc: string | null;
  user_agent: string | null;
  client_ip: string | null;
  event_source_url: string | null;
}

export type LeadInsert = Partial<LeadRow> & Pick<LeadRow, "ruta" | "nombre" | "email" | "whatsapp">;

const configurado = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SECRET_KEY);

function supabase() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SECRET_KEY!, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

// Memoria temporal (se pierde al reiniciar el servidor).
const g = globalThis as unknown as { __leads?: Map<string, LeadRow>; __historial?: unknown[] };
const memoria = (g.__leads ??= new Map<string, LeadRow>());
const historialMemoria = (g.__historial ??= []);

function exigirConfig() {
  if (!configurado && process.env.NODE_ENV === "production") {
    console.warn("Supabase sin configurar: el lead se guarda solo en memoria temporal.");
  }
}

export async function insertLead(data: LeadInsert): Promise<string> {
  exigirConfig();
  if (!configurado) {
    const ahora = new Date().toISOString();
    const id = data.id ?? randomUUID();
    memoria.set(id, {
      situacion: null, problema: null, quien_busca: null, urgencia: null, disposicion: null,
      respuestas: null, puntaje: null, perfil: null, alerta_individual: false, alerta_crisis: false,
      nivel: null, completed_at: null, agendado_at: null, estado: "nuevo", notas: null,
      utm_source: null, utm_medium: null, utm_campaign: null, utm_content: null, utm_term: null,
      origen: null, fbclid: null, fbp: null, fbc: null, user_agent: null, client_ip: null, event_source_url: null,
      ...data, id, created_at: ahora, updated_at: ahora,
    } as LeadRow);
    console.info("[memoria] lead creado", id, data.ruta);
    return id;
  }
  const { data: row, error } = await supabase().from("leads").insert(data).select("id").single();
  if (error || !row) throw error ?? new Error("insert sin fila");
  return row.id;
}

export async function updateLead(id: string, data: Partial<LeadRow>): Promise<void> {
  exigirConfig();
  if (!configurado) {
    const actual = memoria.get(id);
    if (!actual) throw new Error("lead no encontrado");
    memoria.set(id, { ...actual, ...data, updated_at: new Date().toISOString() });
    console.info("[memoria] lead actualizado", id, Object.keys(data).join(","));
    return;
  }
  const { error } = await supabase().from("leads").update(data).eq("id", id);
  if (error) throw error;
}

export async function getLead(id: string): Promise<LeadRow | null> {
  exigirConfig();
  if (!configurado) return memoria.get(id) ?? null;
  const { data } = await supabase().from("leads").select("*").eq("id", id).maybeSingle();
  return (data as LeadRow) ?? null;
}

export async function listLeads(): Promise<LeadRow[]> {
  exigirConfig();
  if (!configurado) return [...memoria.values()].sort((a, b) => b.created_at.localeCompare(a.created_at));
  const { data, error } = await supabase()
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(2000);
  if (error) throw error;
  return (data as LeadRow[]) ?? [];
}

export async function logEstado(leadId: string, anterior: string, nuevo: string): Promise<void> {
  if (!configurado) {
    historialMemoria.push({ leadId, anterior, nuevo, at: new Date().toISOString() });
    return;
  }
  await supabase().from("historial_estado").insert({ lead_id: leadId, estado_anterior: anterior, estado_nuevo: nuevo });
}

export const almacenamiento = configurado ? "supabase" : "memoria";
