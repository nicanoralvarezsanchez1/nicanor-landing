import Image from "next/image";
import { ConsejeriaForm } from "@/components/consejeria/ConsejeriaForm";
import { Encabezado, Pie } from "@/components/Encabezado";
import { VistaContenido } from "@/components/VistaContenido";
import s from "./landing.module.css";

const DOLORES = [
  "Discuten una y otra vez por lo mismo, y nada cambia.",
  "Ya no conversan: solo coordinan la casa, los hijos y las cuentas.",
  "Piensas en separarte, pero algo te detiene.",
  "Tu pareja no quiere ir a terapia y no sabes por dónde empezar.",
  "Se dijeron cosas que todavía duelen.",
];

const BENEFICIOS = [
  { n: "01", t: "Entiendes qué les está pasando", d: "Ponemos nombre a lo que viven y vemos por qué se repite, sin buscar culpables." },
  { n: "02", t: "Te llevas un primer paso concreto", d: "Algo que puedes aplicar esa misma semana para bajar la tensión en casa." },
  { n: "03", t: "Sabes qué camino tienen", d: "Si tu caso necesita terapia, cómo sería: individual o en pareja, y por cuánto tiempo." },
];

const FAQ = [
  {
    p: "¿La sesión de orientación de verdad es gratuita?",
    r: "Sí. Son 30 minutos por videollamada, sin costo y sin compromiso. Si después decides empezar un proceso, ahí conversamos opciones y precios.",
  },
  {
    p: "¿Puedo ir aunque mi pareja no quiera?",
    r: "Sí. Muchas personas empiezan solas. Cuando uno de los dos cambia su forma de responder, la relación se mueve, y a veces la pareja se suma después.",
  },
  {
    p: "Estoy pensando en separarme. ¿Me vas a convencer de que no lo haga?",
    r: "No. La idea es que mires tu relación completa, con lo que duele y con lo que todavía funciona, para que la decisión que tomes sea con claridad y no desde el agotamiento.",
  },
  {
    p: "¿Cómo entra la fe en el proceso?",
    r: "Si la fe es importante para ti, tiene lugar en la sesión: no tienes que explicarla ni dejarla de lado. Trabajo con psicología basada en evidencia, integrada con la mirada católica de la persona.",
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
      <Encabezado cta="Agenda gratis" href="#agenda" />

      <main>
        <section className={s.hero}>
          <div className={`contenedor ${s.heroGrid}`}>
            <div className={s.heroTexto}>
              <span className="etiqueta">Consejería de pareja · Online y presencial en Lima</span>
              <h1 className={s.h1}>
                ¿Estás pensando en separarte? <em>Antes de decidir, mira tu relación completa.</em>
              </h1>
              <p className={s.bajada}>
                Agenda una sesión de consejería de pareja gratuita de 30 minutos. Es el primer paso para entender qué les está
                pasando y decidir con claridad, con lo que duele y con lo que todavía funciona.
              </p>
              <ul className={s.chips}>
                <li>Gratuita · 30 min</li>
                <li>Por videollamada</li>
                <li>Puedes venir aunque tu pareja no quiera</li>
              </ul>
              <div className={s.autor}>
                <Image src="/nicanor.jpg" alt="Nicanor Álvarez" width={56} height={56} className={s.avatar} />
                <div>
                  <strong>Nicanor Álvarez</strong>
                  <span>Psicólogo católico · +13 años acompañando personas y parejas</span>
                </div>
              </div>
            </div>
            <div className={s.heroForm}>
              <ConsejeriaForm />
            </div>
          </div>
        </section>

        <section className={s.seccion}>
          <div className="contenedor">
            <span className="etiqueta">¿Te reconoces?</span>
            <h2 className={s.h2}>Por fuera todo sigue igual. Por dentro, ya no hay paz.</h2>
            <ul className={s.dolores}>
              {DOLORES.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
            <p className={s.nota}>
              Si te reconociste en alguna, no es que hayas fallado. Nadie nos enseñó a manejar esto, y se puede aprender.
            </p>
          </div>
        </section>

        <section className={`${s.seccion} ${s.oscura}`}>
          <div className="contenedor">
            <span className="etiqueta">Qué te llevas de la sesión</span>
            <h2 className={s.h2}>Treinta minutos para salir con claridad</h2>
            <div className={s.beneficios}>
              {BENEFICIOS.map((b) => (
                <article key={b.n} className={s.beneficio}>
                  <span className={s.num}>{b.n}</span>
                  <h3>{b.t}</h3>
                  <p>{b.d}</p>
                </article>
              ))}
            </div>
            <a className="btn" href="#agenda">
              Quiero mi sesión gratuita
            </a>
          </div>
        </section>

        <section className={s.seccion}>
          <div className={`contenedor ${s.sobre}`}>
            <Image src="/nicanor.jpg" alt="Nicanor Álvarez, psicólogo" width={900} height={900} className={s.foto} />
            <div>
              <span className="etiqueta">Quién te acompaña</span>
              <h2 className={s.h2}>Hola, soy Nicanor Álvarez</h2>
              <p>
                Soy psicólogo y hace más de 13 años acompaño a personas y parejas que sienten que su relación se está desgastando.
                Trabajo con calma y sin juicios: primero entendemos qué pasa, después vamos a la raíz y practicamos nuevas formas
                de relacionarse.
              </p>
              <p>
                Si la fe es importante para ti, tiene lugar en la sesión. No tienes que explicarla ni dejarla de lado: la
                integramos al proceso.
              </p>
              <ul className={s.datos}>
                <li><strong>+13 años</strong> de experiencia</li>
                <li><strong>Online</strong> y presencial en Lima</li>
                <li><strong>Psicología</strong> integrada con la fe</li>
              </ul>
            </div>
          </div>
        </section>

        <section className={`${s.seccion} ${s.suave}`}>
          <div className="contenedor">
            <span className="etiqueta">Cómo funciona</span>
            <h2 className={s.h2}>Empezar es más simple de lo que crees</h2>
            <ol className={s.pasos}>
              <li><strong>Dejas tus datos</strong><span>Un minuto, en el formulario de esta página.</span></li>
              <li><strong>Eliges tu horario</strong><span>El día y la hora que te acomoden.</span></li>
              <li><strong>Nos conectamos</strong><span>30 minutos por videollamada, sin costo.</span></li>
            </ol>
          </div>
        </section>

        <section className={s.seccion}>
          <div className="contenedor">
            <div className={s.diagnostico}>
              <div>
                <span className="etiqueta">¿Todavía no sabes si necesitan ayuda?</span>
                <h2 className={s.h2}>Haz el autodiagnóstico de tu relación</h2>
                <p>Cinco preguntas, dos minutos. Descubre en qué etapa está tu relación y cuál es el siguiente paso.</p>
              </div>
              <a className="btn btn-claro" href="/diagnostico">
                Hacer el autodiagnóstico
              </a>
            </div>
          </div>
        </section>

        <section className={`${s.seccion} ${s.suave}`}>
          <div className={`contenedor ${s.faqWrap}`}>
            <span className="etiqueta">Preguntas frecuentes</span>
            <h2 className={s.h2}>Lo que suelen preguntarme</h2>
            <div className={s.faq}>
              {FAQ.map((f) => (
                <details key={f.p}>
                  <summary>{f.p}</summary>
                  <p>{f.r}</p>
                </details>
              ))}
            </div>
            <p className={s.seguridad}>
              Si en tu relación hay violencia o sientes que estás en riesgo, tu seguridad es lo primero. Llama a la Línea 100 o, si
              es una emergencia, al 105.
            </p>
          </div>
        </section>

        <section className={`${s.seccion} ${s.oscura} ${s.final}`}>
          <div className="contenedor">
            <h2 className={s.h2}>
              De “ya no sé qué nos pasa” a <em>un primer paso claro.</em>
            </h2>
            <p>La sesión es gratuita y sin compromiso. Abro pocos espacios de orientación cada semana.</p>
            <a className="btn" href="#agenda">
              Agendar mi sesión gratuita
            </a>
          </div>
        </section>
      </main>

      <Pie />

      <a className={`btn ${s.barraMovil}`} href="#agenda">
        Agenda tu sesión gratuita
      </a>
    </>
  );
}
