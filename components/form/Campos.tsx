"use client";

import s from "./form.module.css";

export function Progreso({ paso, total }: { paso: number; total: number }) {
  const pct = Math.round((paso / total) * 100);
  return (
    <div className={s.progreso} aria-label={`Paso ${paso} de ${total}`}>
      <div className={s.barra}>
        <div className={s.relleno} style={{ width: `${pct}%` }} />
      </div>
      <span className={s.contador}>
        {paso} / {total}
      </span>
    </div>
  );
}

export function Opciones<T extends string>({
  opciones,
  valor,
  onElegir,
}: {
  opciones: readonly T[];
  valor?: T | null;
  onElegir: (v: T, indice: number) => void;
}) {
  return (
    <div className={s.opciones}>
      {opciones.map((o, i) => (
        <button
          key={o}
          type="button"
          className={s.opcion}
          aria-pressed={valor === o}
          onClick={() => onElegir(o, i)}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

const PAISES = [
  { codigo: "+51", nombre: "Perú" },
  { codigo: "+1", nombre: "EE. UU." },
  { codigo: "+34", nombre: "España" },
  { codigo: "+52", nombre: "México" },
  { codigo: "+57", nombre: "Colombia" },
  { codigo: "+56", nombre: "Chile" },
  { codigo: "+54", nombre: "Argentina" },
  { codigo: "+593", nombre: "Ecuador" },
  { codigo: "+591", nombre: "Bolivia" },
];

export interface Contacto {
  nombre: string;
  email: string;
  codigo: string;
  numero: string;
}

export const CONTACTO_VACIO: Contacto = { nombre: "", email: "", codigo: "+51", numero: "" };

export function whatsappCompleto(c: Contacto) {
  return `${c.codigo}${c.numero.replace(/\D/g, "")}`;
}

export function contactoValido(c: Contacto): string | null {
  if (c.nombre.trim().length < 2) return "Escribe tu nombre.";
  if (c.numero.replace(/\D/g, "").length < 8) return "Revisa tu número de WhatsApp.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.email.trim())) return "Revisa tu correo.";
  return null;
}

export function CamposContacto({ valor, onCambio }: { valor: Contacto; onCambio: (c: Contacto) => void }) {
  const set = (k: keyof Contacto) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    onCambio({ ...valor, [k]: e.target.value });
  return (
    <>
      <div className={s.campo}>
        <label htmlFor="nombre">Tu nombre</label>
        <input id="nombre" className={s.input} autoComplete="given-name" value={valor.nombre} onChange={set("nombre")} placeholder="María" />
      </div>
      <div className={s.campo}>
        <label htmlFor="numero">Tu WhatsApp</label>
        <div className={s.telefono}>
          <select aria-label="Código de país" className={s.select} value={valor.codigo} onChange={set("codigo")}>
            {PAISES.map((p) => (
              <option key={p.codigo} value={p.codigo}>
                {p.codigo} {p.nombre}
              </option>
            ))}
          </select>
          <input
            id="numero"
            className={s.input}
            inputMode="tel"
            autoComplete="tel-national"
            value={valor.numero}
            onChange={set("numero")}
            placeholder="999 999 999"
          />
        </div>
      </div>
      <div className={s.campo}>
        <label htmlFor="email">Tu correo</label>
        <input
          id="email"
          className={s.input}
          type="email"
          inputMode="email"
          autoComplete="email"
          value={valor.email}
          onChange={set("email")}
          placeholder="maria@correo.com"
        />
      </div>
    </>
  );
}

export { s as formStyles };
