"use client";

import { useState } from "react";

const FRASES = [
  {
    frase: "Ya no sé cómo hablarle sin que terminemos peleando.",
    respuesta:
      "Cuando cada conversación termina en pelea, casi nunca es por el tema del día. Hay un patrón que se repite y que se puede ver. En la sesión lo ponemos sobre la mesa, para que dejen de pelear la misma discusión una y otra vez.",
  },
  {
    frase: "Nos llevamos bien para la casa y los chicos, pero ya no somos pareja.",
    respuesta:
      "Muchas parejas funcionan como buenos socios y se olvidan de ser esposos. Esa distancia no aparece de un día para otro, y tampoco es definitiva. Vemos juntos dónde empezó y qué la mantiene.",
  },
  {
    frase: "Mi pareja no quiere ir a terapia, y yo sola no sé por dónde empezar.",
    respuesta:
      "Puedes empezar sin tu pareja. Cuando uno de los dos cambia su manera de responder, la relación se mueve, y muchas veces el otro se suma después. La sesión es para ti.",
  },
  {
    frase: "A veces pienso que separarnos sería lo más tranquilo.",
    respuesta:
      "No voy a convencerte de nada. La idea es que mires la relación completa, con lo que duele y con lo que todavía funciona, para que tu decisión no nazca del agotamiento.",
  },
];

/** Lo vivo de la página: eliges la frase que es tuya y lees qué haríamos con ella en la sesión. */
export function Frases({ s }: { s: Record<string, string> }) {
  const [elegida, setElegida] = useState(0);
  return (
    <div className={s.frases}>
      <div className={s.frasesLista} role="group" aria-label="Frases">
        {FRASES.map((f, i) => (
          <button
            key={f.frase}
            type="button"
            className={s.frase}
            aria-pressed={i === elegida}
            aria-controls="respuesta-frase"
            onClick={() => setElegida(i)}
          >
            {f.frase}
          </button>
        ))}
      </div>
      <div id="respuesta-frase" className={s.respuesta} aria-live="polite" key={elegida}>
        <p>{FRASES[elegida].respuesta}</p>
        <a className="btn" href="#agenda">
          Conversemos sobre esto
        </a>
      </div>
    </div>
  );
}
