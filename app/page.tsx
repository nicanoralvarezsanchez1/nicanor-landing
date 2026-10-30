import Image from "next/image";
import Link from "next/link";
import { Aparecer } from "@/components/Aparecer";
import { BarraMovil } from "@/components/BarraMovil";
import { ConsejeriaForm } from "@/components/consejeria/ConsejeriaForm";
import { Frases } from "@/components/Frases";
import { PanelFotos, type FotoPanel } from "@/components/PanelFotos";
import { VistaContenido } from "@/components/VistaContenido";
import s from "./landing.module.css";

/* Dirección: pantalla dividida. Una mitad es una foto fija que acompaña la lectura y cambia por sección;
   la otra es una columna de lectura tranquila. La idea: la conversación pendiente de una pareja, contada
   con los objetos de la casa donde ocurre (dos sillas, dos tazas, una cama a medias, la llamada, la fe). */

const FOTOS_INICIO: FotoPanel[] = [
  { id: "sillas", src: "/fotos/sillas.jpg", alt: "Dos sillones enfrentados junto a una ventana" },
  { id: "tazas", src: "/fotos/tazas.jpg", alt: "Dos tazas sobre la mesa de la cocina, de noche" },
  { id: "llamada", src: "/fotos/llamada.jpg", alt: "Una laptop abierta sobre la mesa del comedor, con un cuaderno" },
];

const FOTOS_NICANOR: FotoPanel[] = [
  { id: "nicanor", src: "/nicanor.jpg", alt: "Nicanor Álvarez, psicólogo", modo: "retrato" },
  { id: "rosario", src: "/fotos/rosario.jpg", alt: "Un rosario y un anillo de matrimonio sobre un cuaderno abierto" },
];

const SESION = [
  {
    cuando: "Primero",
    titulo: "Me cuentas qué está pasando",
    texto: "Sin juicios y sin apuro: lo que viven, desde cuándo y qué ya intentaron.",
  },
  {
    cuando: "Después",
    titulo: "Ponemos nombre al patrón",
    texto: "Vemos por qué la misma discusión se repite y qué hay debajo de ella.",
  },
  {
    cuando: "Al final",
    titulo: "Te llevas un primer paso",
    texto: "Algo concreto para esa misma semana y, si lo necesitan, cómo sería un proceso.",
  },
];

const FAQ = [
  {
    p: "¿La sesión es realmente gratuita?",
    r: "Sí. Son 30 minutos por videollamada, sin costo y sin compromiso. Si después decides empezar un proceso, conversamos las opciones en ese momento.",
  },
  {
    p: "Estoy pensando en separarme. ¿Me vas a convencer de que no lo haga?",
    r: "No. La idea es que mires tu relación completa, con lo que duele y con lo que todavía funciona, para que la decisión que tomes sea clara y no nazca del agotamiento.",
  },
  {
    p: "¿Es online o presencial?",
    r: "La sesión de orientación es por videollamada. Los procesos pueden ser online o presenciales en Lima.",
  },
  {
    p: "¿Lo que hablemos es confidencial?",
    r: "Sí. Todo lo que conversemos queda entre nosotros, según el secreto profesional del psicólogo.",
  },
];

function FotoMovil({ src, alt, retrato }: { src: string; alt: string; retrato?: boolean }) {
  return (
    <div className={`${s.fotoMovil} ${retrato ? s.fotoMovilRetrato : ""}`}>
      <Image src={src} alt={alt} fill sizes="100vw" />
    </div>
  );
}

export default function ConsejeriaPage() {
  return (
    <>
      <VistaContenido nombre="Landing Consejería Nicanor" />
      <Aparecer />

      <main>
        <div className={s.split}>
          <PanelFotos fotos={FOTOS_INICIO} className={s.panel} s={s} />

          <div className={s.columna}>
            <header className={s.barra}>
              <Link href="/" className={s.marca}>
                Nicanor Álvarez
              </Link>
              <nav className={s.nav} aria-label="Secciones">
                <a href="#sesion">La sesión</a>
                <a href="#nicanor">Sobre Nicanor</a>
                <Link href="/diagnostico">Autodiagnóstico</Link>
              </nav>
            </header>

            <section className={s.hero} data-foto="sillas">
              <FotoMovil src="/fotos/sillas.jpg" alt="Dos sillones enfrentados junto a una ventana" />
              <h1 className={s.h1}>Antes de decidir, conversemos.</h1>
              <p className={s.bajada}>
                Si estás pensando en separarte, una sesión de consejería de pareja te ayuda a mirar la relación completa antes de
                decidir. Son 30 minutos gratuitos por videollamada con Nicanor Álvarez, psicólogo, y puedes venir aunque tu pareja
                no quiera.
              </p>
              <ConsejeriaForm />
            </section>

            <section className={s.seccion} data-foto="tazas" aria-labelledby="t-frases">
              <FotoMovil src="/fotos/tazas.jpg" alt="Dos tazas sobre la mesa de la cocina, de noche" />
              <div data-aparece>
                <h2 id="t-frases" className={s.h2}>
                  ¿Alguna de estas frases es tuya?
                </h2>
                <p className={s.texto}>Son las que más escucho antes de una primera sesión. Elige la que se parece a lo que vives.</p>
                <Frases s={s} />
              </div>
            </section>

            <section className={s.seccion} id="sesion" data-foto="llamada" aria-labelledby="t-sesion">
              <FotoMovil src="/fotos/llamada.jpg" alt="Una laptop abierta sobre la mesa del comedor, con un cuaderno" />
              <div data-aparece>
                <h2 id="t-sesion" className={s.h2}>
                  Qué pasa en los treinta minutos
                </h2>
                <p className={s.texto}>
                  Una conversación con estructura, por videollamada y desde tu casa, para que salgas con algo claro y no solo con
                  desahogo.
                </p>
                <ol className={s.sesion}>
                  {SESION.map((m) => (
                    <li key={m.cuando}>
                      <span className={s.cuando}>{m.cuando}</span>
                      <div>
                        <h3>{m.titulo}</h3>
                        <p>{m.texto}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </section>
          </div>
        </div>

        <section className={s.solo} aria-labelledby="t-solo">
          <div className={s.soloFoto}>
            <Image src="/fotos/cama.jpg" alt="Una cama con un solo lado usado, en la luz gris de la mañana" fill sizes="(min-width: 1000px) 40vw, 100vw" />
          </div>
          <div className={s.soloTexto} data-aparece>
            <h2 id="t-solo" className={s.h2Grande}>
              ¿Y si tu pareja no quiere venir?
            </h2>
            <p>
              Es lo más común, y no es un impedimento. Muchas personas empiezan solas. Cuando uno de los dos cambia su manera de
              responder, la relación se mueve, y a veces la pareja se suma después.
            </p>
            <p>La sesión de orientación es para ti.</p>
            <a className="btn" href="#agenda">
              Agendar mi sesión gratuita
            </a>
          </div>
        </section>

        <div className={s.split}>
          <PanelFotos fotos={FOTOS_NICANOR} className={s.panel} s={s} />

          <div className={s.columna}>
            <section className={s.seccion} id="nicanor" data-foto="nicanor" aria-labelledby="t-nicanor">
              <FotoMovil src="/nicanor.jpg" alt="Nicanor Álvarez, psicólogo" retrato />
              <div data-aparece>
                <h2 id="t-nicanor" className={s.h2}>
                  Hola, soy Nicanor.
                </h2>
                <p className={s.texto}>
                  Soy psicólogo y hace más de 13 años acompaño a personas y parejas que sienten que su relación se está
                  desgastando. Mi trabajo es ayudarles a entender qué les pasa, ir a la raíz y practicar otras formas de hablarse.
                </p>
                <p className={s.texto}>
                  Atiendo por videollamada y de forma presencial en Lima. La primera conversación es gratuita porque quiero que
                  decidas con información, no a ciegas.
                </p>
              </div>
            </section>

            <section className={s.seccion} data-foto="rosario" aria-labelledby="t-fe">
              <FotoMovil src="/fotos/rosario.jpg" alt="Un rosario y un anillo de matrimonio sobre un cuaderno abierto" />
              <div data-aparece>
                <h2 id="t-fe" className={s.h2}>
                  Si tu fe importa, tiene lugar aquí
                </h2>
                <p className={s.texto}>
                  No tienes que explicarla ni dejarla de lado. Trabajo con psicología basada en evidencia, integrada con la mirada
                  católica de la persona, con respeto y sin sermones.
                </p>
                <blockquote className={s.cita}>
                  Una mirada de la persona que deja fuera lo espiritual queda incompleta. Y una fe que deja fuera las emociones,
                  también.
                </blockquote>
              </div>
            </section>

            <section className={s.seccion} data-foto="rosario" aria-labelledby="t-faq">
              <div data-aparece>
                <h2 id="t-faq" className={s.h2}>
                  Preguntas frecuentes
                </h2>
                <div className={s.faq}>
                  {FAQ.map((f) => (
                    <details key={f.p}>
                      <summary>{f.p}</summary>
                      <p>{f.r}</p>
                    </details>
                  ))}
                </div>
                <p className={s.seguridad}>
                  Si en tu relación hay violencia o sientes que estás en riesgo, tu seguridad es lo primero. Llama a la Línea 100
                  o, si es una emergencia, al 105.
                </p>
              </div>
            </section>
          </div>
        </div>

        <section className={s.cierre} aria-labelledby="t-cierre">
          <h2 id="t-cierre" className={s.h2Grande}>
            Empieza la conversación pendiente.
          </h2>
          <div className={s.rutas} data-aparece>
            <div className={s.ruta}>
              <h3>Si ya sabes que necesitan ayuda</h3>
              <p>Agenda la sesión de orientación: 30 minutos por videollamada, gratuita y sin compromiso.</p>
              <a className="btn" href="#agenda">
                Agendar mi sesión gratuita
              </a>
            </div>
            <div className={s.ruta}>
              <h3>Si todavía no lo tienes claro</h3>
              <p>Cinco preguntas, dos minutos. Descubre en qué etapa está tu relación y cuál sería el siguiente paso.</p>
              <Link className="btn btn-claro" href="/diagnostico">
                Hacer el autodiagnóstico
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className={s.pie}>
        <p className={s.pieNombre}>Nicanor Álvarez</p>
        <div className={s.pieFila}>
          <span>Psicólogo. Consejería de pareja online y presencial en Lima, Perú.</span>
          <span className={s.pieLinks}>
            <Link href="/privacidad">Privacidad</Link>
            <a href="https://www.instagram.com/nicanoralvarezpsicologo/" target="_blank" rel="noopener">
              Instagram
            </a>
          </span>
        </div>
      </footer>

      <BarraMovil className={s.barraMovil} />
    </>
  );
}
