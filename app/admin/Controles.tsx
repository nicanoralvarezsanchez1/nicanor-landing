"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ESTADOS, ESTADO_LABEL, type Estado } from "@/lib/leads/opciones";
import { cambiarEstado, guardarNota } from "./actions";
import s from "./admin.module.css";

export function SelectorEstado({ leadId, estado }: { leadId: string; estado: Estado }) {
  const [valor, setValor] = useState(estado);
  const [pendiente, start] = useTransition();
  return (
    <select
      aria-label="Estado"
      className={s.selectEstado}
      data-estado={valor}
      value={valor}
      disabled={pendiente}
      onChange={(e) => {
        const nuevo = e.target.value as Estado;
        setValor(nuevo);
        start(async () => {
          const res = await cambiarEstado(leadId, nuevo);
          if (!res.ok) setValor(estado);
        });
      }}
    >
      {ESTADOS.map((e) => (
        <option key={e} value={e}>
          {ESTADO_LABEL[e]}
        </option>
      ))}
    </select>
  );
}

export function Notas({ leadId, inicial }: { leadId: string; inicial: string | null }) {
  const [texto, setTexto] = useState(inicial ?? "");
  const [guardado, setGuardado] = useState(false);
  const [pendiente, start] = useTransition();
  return (
    <div className={s.notas}>
      <textarea
        aria-label="Notas"
        value={texto}
        onChange={(e) => {
          setTexto(e.target.value);
          setGuardado(false);
        }}
        placeholder="Notas de la conversación…"
        rows={3}
      />
      <button
        type="button"
        className="btn btn-claro"
        disabled={pendiente}
        onClick={() =>
          start(async () => {
            await guardarNota(leadId, texto);
            setGuardado(true);
          })
        }
      >
        {pendiente ? "Guardando…" : guardado ? "Guardado" : "Guardar nota"}
      </button>
    </div>
  );
}

export function Salir() {
  const router = useRouter();
  return (
    <button
      type="button"
      className={s.salir}
      onClick={async () => {
        await fetch("/api/admin/logout", { method: "POST" });
        router.replace("/admin/login");
      }}
    >
      Salir
    </button>
  );
}
