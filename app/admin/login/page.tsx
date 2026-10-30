"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import s from "../admin.module.css";

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function entrar(e: React.FormEvent) {
    e.preventDefault();
    setEnviando(true);
    setError(null);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setEnviando(false);
    if (!res.ok) return setError("Contraseña incorrecta.");
    router.replace("/admin");
    router.refresh();
  }

  return (
    <main className={s.loginFondo}>
      <form className={s.loginCaja} onSubmit={entrar}>
        <h1>Panel de contactos</h1>
        <p>Nicanor Álvarez · Psicólogo</p>
        <label htmlFor="password">Contraseña</label>
        <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoFocus />
        {error && <p className={s.error}>{error}</p>}
        <button className="btn btn-bloque" disabled={enviando}>
          {enviando ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </main>
  );
}
