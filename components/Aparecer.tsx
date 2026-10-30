"use client";

import { useEffect } from "react";

/** Activa la entrada escalonada de las secciones marcadas con data-aparece (ver globals.css). */
export function Aparecer() {
  useEffect(() => {
    document.documentElement.classList.add("js-aparece");
    const obs = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("visible");
          obs.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    document.querySelectorAll("[data-aparece]").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
  return null;
}
