import type { Metadata } from "next";
import { Encabezado, Pie } from "@/components/Encabezado";

export const metadata: Metadata = { title: "Política de privacidad · Nicanor Álvarez" };

export default function Privacidad() {
  return (
    <>
      <Encabezado cta="Agenda gratis" href="/#agenda" />
      <main className="contenedor" style={{ maxWidth: 760, padding: "48px 20px 80px", display: "grid", gap: 16 }}>
        <h1 style={{ fontSize: 36, color: "var(--noche)" }}>Política de privacidad</h1>
        <p>
          Esta página es de Nicanor Álvarez, psicólogo en Lima, Perú. Aquí explico qué datos recojo cuando completas el
          formulario de consejería o el autodiagnóstico, y para qué los uso.
        </p>
        <h2 style={{ fontSize: 22 }}>Qué datos recojo</h2>
        <p>
          Tu nombre, tu número de WhatsApp, tu correo y tus respuestas a las preguntas del formulario. También datos técnicos de
          la visita, como la página desde la que llegaste, para saber qué anuncios funcionan.
        </p>
        <h2 style={{ fontSize: 22 }}>Para qué los uso</h2>
        <p>
          Para contactarte, agendar tu sesión de orientación y preparar la conversación. No vendo ni comparto tus datos con
          terceros para fines comerciales.
        </p>
        <h2 style={{ fontSize: 22 }}>Herramientas que uso</h2>
        <p>
          Uso el píxel de Meta y su API de Conversiones para medir los resultados de mis anuncios. Tu correo y tu teléfono se
          envían cifrados (en formato hash), nunca en texto legible. También uso Calendly para agendar las sesiones.
        </p>
        <h2 style={{ fontSize: 22 }}>Tus derechos</h2>
        <p>
          Puedes pedirme en cualquier momento que corrija o elimine tus datos, de acuerdo con la Ley N.° 29733 de Protección de
          Datos Personales del Perú. Escríbeme por WhatsApp o por Instagram y lo hago.
        </p>
      </main>
      <Pie />
    </>
  );
}
