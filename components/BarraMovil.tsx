"use client";

import { useEffect, useState } from "react";

/** Botón fijo en celular que lleva al formulario. Se oculta mientras el formulario está en pantalla. */
export function BarraMovil({ className }: { className: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const form = document.getElementById("agenda");
    if (!form) return;
    let formEnPantalla = true;
    const actualizar = () => setVisible(!formEnPantalla && window.scrollY > 200);
    const obs = new IntersectionObserver(([e]) => {
      formEnPantalla = e.isIntersecting;
      actualizar();
    });
    obs.observe(form);
    window.addEventListener("scroll", actualizar, { passive: true });
    return () => {
      obs.disconnect();
      window.removeEventListener("scroll", actualizar);
    };
  }, []);

  if (!visible) return null;
  return (
    <a className={`btn ${className}`} href="#agenda">
      Agendar sesión gratuita
    </a>
  );
}
