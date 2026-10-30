import { listLeads } from "@/lib/leads/store";

export const dynamic = "force-dynamic";

const COLUMNAS = [
  "created_at", "ruta", "nombre", "whatsapp", "email", "nivel", "estado", "perfil", "puntaje",
  "situacion", "problema", "quien_busca", "urgencia", "disposicion", "completed_at", "agendado_at",
  "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "origen", "fbclid", "notas",
] as const;

const celda = (v: unknown) => {
  const t = v === null || v === undefined ? "" : String(v);
  return /[",\n;]/.test(t) ? `"${t.replace(/"/g, '""')}"` : t;
};

// Protegida por middleware.ts (cookie de sesión del panel).
export async function GET() {
  const leads = await listLeads();
  const filas = [COLUMNAS.join(","), ...leads.map((l) => COLUMNAS.map((c) => celda(l[c])).join(","))];
  return new Response("﻿" + filas.join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="contactos-nicanor-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
