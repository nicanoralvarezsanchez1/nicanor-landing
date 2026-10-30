import Image from "next/image";
import Link from "next/link";
import { BarraMovil } from "@/components/BarraMovil";
import { ConsejeriaForm } from "@/components/consejeria/ConsejeriaForm";
import { VistaContenido } from "@/components/VistaContenido";
import s from "./landing.module.css";

const PENSAMIENTOS = [
  "Ya no sé cómo hablarle sin que terminemos peleando.",
  "Nos llevamos bien para la casa y los chicos, pero ya no somos pareja.",
  "Él no quiere ir a terapia, y yo sola no sé por dónde empezar.",
  "A veces pienso que separarnos sería lo más tranquilo.",
];

const MINUTOS = [
  {
    rango: "Minuto 1 a 10",
    titulo: "Me cuentas qué está pasando",
    texto: "Sin juicios y sin apuro. Lo que viven, desde cuándo y qué ya intentaron.",
  },
  {
    rango: "Minuto 10 a 20",
    titulo: "Ponemos nombre al patrón",
    texto: "Vemos por qué la misma discusión se repite y qué hay debajo de ella.",
  },
  {
    rango: "Minuto 20 a 30",
    titulo: "Te llevas un primer paso y un camino",
    texto: "Algo concreto para esa misma semana y, si lo necesitan, cómo sería un proceso.",
  },
];

const FAQ = [
  {
    p: "¿La sesión de orientación es realmente gratuita?",
    r: "Sí. Son 30 minutos por videollamada, sin costo y sin compromiso. Si después decides empezar un proceso, conversamos las opciones en ese momento.",
  },
  {
    p: "Estoy pensando en separarme. ¿Me vas a convencer de que no lo haga?",
    r: "No. La idea es que mires tu relación completa, con lo que duele y con lo que todavía funciona, para que la decisión que tomes sea clara y no nazca del agotamiento.",
  },
  {
    p: "¿Cómo entra la fe en el proceso?",
    r: "Si la fe es importante para ti, tiene lugar en la conversación. No tienes que explicarla ni dejarla de lado. Trabajo con psicología basada en evidencia, integrada con la mirada católica de la persona.",
  },
  {
    p: "¿Es online o presencial?",
    r: "La orientación es por videollamada. Los procesos pueden ser online o presenciales en Lima.",
  },
  {
    p: "¿Lo que hablemos es confidencial?",
    r: "Sí. Todo lo que conversemos queda entre nosotros, según el secreto profesional del psicólogo.",
  },
];

export default function ConsejeriaPage() {
  return (
    <>
      <VistaContenido nombre="Landing Consejería Nicanor" />

      <header className={s.header}>
        <div className={`contenedor ${s.headerFila}`}>
          <Link href="/" aria-label="Nicanor Álvarez, psicólogo">
            <Image src="/logo.png" alt="Nicanor Álvarez, psicólogo" width={600} height={275} className={s.logo} priority />
          </Link>
          <a className={s.headerLink} href="#agenda">
            Agendar sesión gratuita
          </a>
        </div>
      </header>

      <main>
        <section className={s.hero}>
          <div className={`contenedor ${s.heroGrid}`}>
            <div className={s.heroTexto}>
              <p className={s.pregunta}>¿Estás pensando en separarte?</p>
              <h1 className={s.h1}>Antes de decidir, conversemos treinta minutos.</h1>
              <p className={s.bajada}>
                Una sesión de consejería de pareja gratuita para entender qué les está pasando y decidir con claridad, con lo que
                duele y con lo que todavía funciona.
              </p>
              <p className={s.condiciones}>Por videollamada, sin costo. Puedes venir aunque tu pareja no quiera.</p>
              <div className={s.autor}>
                <Image src="/nicanor.jpg" alt="" width={52} height={52} className={s.avatar} />
                <p>
                  Con <strong>Nicanor Álvarez</strong>, psicólogo con más de 13 años acompañando a personas y parejas en Lima.
                </p>
              </div>
            </div>
            <div className={s.heroForm} id="agenda">
              <ConsejeriaForm />
            </div>
          </div>
        </section>

        <section className={s.pensamientos}>
          <div className={`contenedor ${s.angosto}`}>
            <h2 className={s.h2}>Lo que muchas personas piensan antes de escribirme</h2>
            <ul>
              {PENSAMIENTOS.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
            <p className={s.respuesta}>
              Si alguna de estas frases es tuya, no es que hayas fallado. Nadie nos enseñó a atravesar una crisis de pareja, y eso
              se puede aprender.
            </p>
          </div>
        </section>

        <section className={s.sesion}>
          <div className="contenedor">
            <div className={s.sesionCabecera}>
              <h2 className={s.h2}>Qué pasa en los treinta minutos</h2>
              <p>Una conversación con estructura, para que salgas con algo claro y no solo con desahogo.</p>
            </div>
            <ol className={s.linea}>
              {MINUTOS.map((m) => (
                <li key={m.rango}>
                  <span className={s.rango}>{m.rango}</span>
                  <h3>{m.titulo}</h3>
                  <p>{m.texto}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className={s.sobre}>
          <div className={`contenedor ${s.sobreGrid}`}>
            <div className={s.retrato}>
              <Image src="/nicanor.jpg" alt="Nicanor Álvarez, psicólogo" width={900} height={900} />
            </div>
            <div className={s.sobreTexto}>
              <h2 className={s.h2}>Hola, soy Nicanor.</h2>
              <p>
                Hace más de 13 años acompaño a personas y parejas que sienten que su relación se está desgastando. Mi trabajo es
                ayudarles a entender qué les pasa, ir a la raíz y practicar otras formas de hablarse.
              </p>
              <p>
                Si la fe es importante para ti, tiene lugar en la conversación. No tienes que explicarla ni dejarla de lado: la
                integramos al proceso, con respeto y sin sermones.
              </p>
              <blockquote className={s.cita}>
                Una mirada de la persona que deja fuera lo espiritual queda incompleta. Y una fe que deja fuera las emociones,
                también.
              </blockquote>
            </div>
          </div>
        </section>

        <section className={s.solo}>
          <div className={`contenedor ${s.angosto}`}>
            <h2 className={s.h2}>¿Y si tu pareja no quiere venir?</h2>
            <p>
              Es lo más común, y no es un impedimento. Muchas personas empiezan solas. Cuando uno de los dos cambia su manera de
              responder, la relación se mueve, y a veces la pareja se suma después. La sesión de orientación es para ti.
            </p>
            <a className="btn" href="#agenda">
              Agendar mi sesión gratuita
            </a>
          </div>
        </section>

        <section className={s.diagnostico}>
          <div className={`contenedor ${s.diagnosticoFila}`}>
            <div>
              <h2 className={s.h3}>¿Todavía no sabes si necesitan ayuda?</h2>
              <p>Cinco preguntas, dos minutos. Descubre en qué etapa está tu relación y cuál sería el siguiente paso.</p>
            </div>
            <Link className="btn btn-claro" href="/diagnostico">
              Hacer el autodiagnóstico
            </Link>
          </div>
        </section>

        <section className={s.faq}>
          <div className={`contenedor ${s.angosto}`}>
            <h2 className={s.h2}>Preguntas frecuentes</h2>
            {FAQ.map((f) => (
              <details key={f.p}>
                <summary>{f.p}</summary>
                <p>{f.r}</p>
              </details>
            ))}
            <p className={s.seguridad}>
              Si en tu relación hay violencia o sientes que estás en riesgo, tu seguridad es lo primero. Llama a la Línea 100 o,
              si es una emergencia, al 105.
            </p>
          </div>
        </section>

        <section className={s.cierre}>
          <div className={`contenedor ${s.angosto}`}>
            <h2 className={s.h1}>La conversación pendiente puede empezar esta semana.</h2>
            <p>Abro pocos espacios de orientación cada semana. Es gratuita y sin compromiso.</p>
            <a className="btn" href="#agenda">
              Agendar mi sesión gratuita
            </a>
          </div>
        </section>
      </main>

      <footer className={s.pie}>
        <div className={`contenedor ${s.pieFila}`}>
          <span>© {new Date().getFullYear()} Nicanor Álvarez, psicólogo. Lima, Perú.</span>
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
