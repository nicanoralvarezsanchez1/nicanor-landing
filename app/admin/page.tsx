import type { Metadata } from "next";
import Link from "next/link";
import { whatsappLink } from "@/lib/config";
import { ESTADO_LABEL, PERFIL_INFO, type Perfil } from "@/lib/leads/opciones";
import { almacenamiento, listLeads, type LeadRow } from "@/lib/leads/store";
import { Notas, Salir, SelectorEstado } from "./Controles";
import s from "./admin.module.css";

export const metadata: Metadata = { title: "Panel · Nicanor Álvarez", robots: { index: false } };
export const dynamic = "force-dynamic";

type Filtros = { ruta?: string; nivel?: string; estado?: string; q?: string };

const fecha = (iso: string) =>
  new Date(iso).toLocaleString("es-PE", { timeZone: "America/Lima", day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });

const horasDesde = (iso: string) => (Date.now() - new Date(iso).getTime()) / 36e5;

function mensajeWhatsapp(l: LeadRow) {
  const nombre = l.nombre.split(/\s+/)[0];
  const que = l.ruta === "diagnostico" ? "el autodiagnóstico de pareja" : "tus datos para la sesión de consejería gratuita";
  if (!l.completed_at)
    return `Hola ${nombre}, soy Nicanor Álvarez. Vi que empezaste ${que} y no llegaste a terminar. ¿Te ayudo a agendar tu sesión de orientación gratuita?`;
  if (!l.agendado_at)
    return `Hola ${nombre}, soy Nicanor Álvarez. Gracias por completar ${l.ruta === "diagnostico" ? "el autodiagnóstico" : "el formulario"}. ¿Te ayudo a elegir un horario para tu sesión de orientación gratuita?`;
  return `Hola ${nombre}, soy Nicanor Álvarez. Te escribo para confirmar tu sesión de orientación.`;
}

function filtrar(leads: LeadRow[], f: Filtros) {
  const q = f.q?.toLowerCase().trim();
  return leads.filter(
    (l) =>
      (!f.ruta || l.ruta === f.ruta) &&
      (!f.nivel || (f.nivel === "incompleto" ? !l.completed_at : l.nivel === f.nivel)) &&
      (!f.estado || l.estado === f.estado) &&
      (!q || `${l.nombre} ${l.email} ${l.whatsapp}`.toLowerCase().includes(q)),
  );
}

export default async function AdminPage({ searchParams }: { searchParams: Promise<Filtros> }) {
  const f = await searchParams;
  const todos = await listLeads();
  const leads = filtrar(todos, f);

  const n = (pred: (l: LeadRow) => boolean) => todos.filter(pred).length;
  const metricas = [
    { t: "Contactos", v: todos.length },
    { t: "Completaron", v: n((l) => Boolean(l.completed_at)) },
    { t: "Calificados", v: n((l) => l.nivel === "calificado") },
    { t: "Tibios", v: n((l) => l.nivel === "tibio") },
    { t: "Agendaron", v: n((l) => Boolean(l.agendado_at)) },
    { t: "Pacientes", v: n((l) => l.estado === "paciente") },
  ];

  // Calidad por anuncio: qué anuncio (utm_content) trae calificados, agendas y pacientes.
  const fuenteDe = (l: LeadRow) =>
    l.utm_content
      ? l.utm_term
        ? `${l.utm_content} · ${l.utm_term}`
        : l.utm_content
      : l.utm_campaign
        ? `${l.utm_campaign} (sin anuncio)`
        : l.origen
          ? `Sin anuncio · ${l.origen}`
          : "Sin rastreo";
  const pct = (a: number, b: number) => (b ? Math.round((a / b) * 100) : 0);
  const porAnuncio = [...new Set(todos.map(fuenteDe))]
    .map((k) => {
      const suyos = todos.filter((l) => fuenteDe(l) === k);
      const c = (pred: (l: LeadRow) => boolean) => suyos.filter(pred).length;
      return {
        k,
        n: suyos.length,
        cal: c((l) => l.nivel === "calificado"),
        tib: c((l) => l.nivel === "tibio"),
        fri: c((l) => l.nivel === "frio"),
        ag: c((l) => Boolean(l.agendado_at)),
        pac: c((l) => l.estado === "paciente"),
      };
    })
    .sort((a, b) => b.cal - a.cal || b.n - a.n);

  const enlace = (cambio: Filtros) => {
    const p = new URLSearchParams(Object.entries({ ...f, ...cambio }).filter(([, v]) => v) as [string, string][]);
    return `/admin${p.size ? `?${p}` : ""}`;
  };

  return (
    <main className={s.panel}>
      <header className={s.top}>
        <div>
          <h1>Contactos</h1>
          <p>Consejería gratuita y autodiagnóstico · {almacenamiento === "memoria" ? "modo prueba (sin base de datos)" : "en vivo"}</p>
        </div>
        <div className={s.topAcciones}>
          <a className="btn btn-claro" href="/api/admin/export">
            Descargar CSV
          </a>
          <Salir />
        </div>
      </header>

      <section className={s.metricas}>
        {metricas.map((m) => (
          <div key={m.t} className={s.metrica}>
            <span>{m.t}</span>
            <strong>{m.v}</strong>
          </div>
        ))}
      </section>

      {todos.length > 0 && (
        <section className={s.anuncios}>
          <h2>Calidad por anuncio</h2>
          <p>Qué anuncio y conjunto trae calificados, agendas y pacientes. «Sin anuncio» son visitas sin el nombre del anuncio en el enlace.</p>
          <div className={s.tablaScroll}>
            <table>
              <thead>
                <tr>
                  <th>Anuncio · conjunto</th>
                  <th>Contactos</th>
                  <th>Calificados</th>
                  <th>Tibios</th>
                  <th>Fríos</th>
                  <th>Agendaron</th>
                  <th>Pacientes</th>
                </tr>
              </thead>
              <tbody>
                {porAnuncio.map((r) => (
                  <tr key={r.k}>
                    <td title={r.k}>{r.k}</td>
                    <td>{r.n}</td>
                    <td>
                      {r.cal} ({pct(r.cal, r.n)}%)
                    </td>
                    <td>{r.tib}</td>
                    <td>{r.fri}</td>
                    <td>{r.ag}</td>
                    <td>{r.pac}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <nav className={s.filtros} aria-label="Filtros">
        <span>Ruta:</span>
        <Link className={!f.ruta ? s.activo : ""} href={enlace({ ruta: undefined })}>Todas</Link>
        <Link className={f.ruta === "consejeria" ? s.activo : ""} href={enlace({ ruta: "consejeria" })}>Consejería</Link>
        <Link className={f.ruta === "diagnostico" ? s.activo : ""} href={enlace({ ruta: "diagnostico" })}>Diagnóstico</Link>
        <span>Nivel:</span>
        <Link className={!f.nivel ? s.activo : ""} href={enlace({ nivel: undefined })}>Todos</Link>
        {["calificado", "tibio", "frio", "incompleto"].map((nv) => (
          <Link key={nv} className={f.nivel === nv ? s.activo : ""} href={enlace({ nivel: nv })}>
            {nv === "frio" ? "Frío" : nv[0].toUpperCase() + nv.slice(1)}
          </Link>
        ))}
        <form className={s.buscar} action="/admin">
          {f.ruta && <input type="hidden" name="ruta" value={f.ruta} />}
          {f.nivel && <input type="hidden" name="nivel" value={f.nivel} />}
          <input name="q" defaultValue={f.q} placeholder="Buscar nombre, correo o número" aria-label="Buscar" />
        </form>
      </nav>

      {leads.length === 0 ? (
        <p className={s.vacio}>Todavía no hay contactos con estos filtros.</p>
      ) : (
        <ul className={s.lista}>
          {leads.map((l) => {
            const incompleto = !l.completed_at;
            const urgente = incompleto && horasDesde(l.created_at) > 3;
            const detalle =
              l.ruta === "diagnostico"
                ? l.perfil
                  ? PERFIL_INFO[l.perfil as Perfil].titulo
                  : "Diagnóstico"
                : l.urgencia ?? l.problema ?? "Consejería";
            return (
              <li key={l.id} className={s.fila}>
                <div className={s.filaPrincipal}>
                  <div className={s.quien}>
                    <strong>{l.nombre}</strong>
                    <span>
                      {fecha(l.created_at)} · {l.ruta === "diagnostico" ? "Diagnóstico" : "Consejería"} · {detalle}
                    </span>
                  </div>
                  <div className={s.etiquetas}>
                    {incompleto ? (
                      <span className={`${s.badge} ${urgente ? s.urgente : s.incompleto}`}>
                        {urgente ? "Incompleto · escribir ya" : "Incompleto"}
                      </span>
                    ) : (
                      <span className={`${s.badge} ${s[l.nivel ?? "frio"]}`}>{l.nivel}</span>
                    )}
                    {l.alerta_crisis && <span className={`${s.badge} ${s.urgente}`}>Alerta emocional</span>}
                  </div>
                  <SelectorEstado leadId={l.id} estado={l.estado} />
                  <a className={s.wa} href={whatsappLink(mensajeWhatsapp(l), l.whatsapp)} target="_blank" rel="noopener">
                    WhatsApp
                  </a>
                </div>
                <details className={s.detalle}>
                  <summary>Ver detalle</summary>
                  <dl>
                    <dt>WhatsApp</dt><dd>{l.whatsapp}</dd>
                    <dt>Correo</dt><dd>{l.email}</dd>
                    {l.situacion && (<><dt>Situación</dt><dd>{l.situacion}</dd></>)}
                    {l.problema && (<><dt>Qué pasa</dt><dd>{l.problema}</dd></>)}
                    {l.quien_busca && (<><dt>Quién busca ayuda</dt><dd>{l.quien_busca}</dd></>)}
                    {l.urgencia && (<><dt>Urgencia</dt><dd>{l.urgencia}</dd></>)}
                    {l.disposicion && (<><dt>Disposición</dt><dd>{l.disposicion}</dd></>)}
                    {l.puntaje !== null && (<><dt>Puntaje</dt><dd>{l.puntaje} de 20</dd></>)}
                    {l.alerta_individual && (<><dt>Nota</dt><dd>Posible necesidad de atención individual (ansiedad o desgaste emocional)</dd></>)}
                    {l.agendado_at && (<><dt>Agendó</dt><dd>{fecha(l.agendado_at)}</dd></>)}
                    <dt>Origen</dt>
                    <dd>{[l.utm_source, l.utm_campaign, l.utm_content, l.utm_term].filter(Boolean).join(" · ") || l.origen || "Sin datos"}</dd>
                    <dt>Estado</dt><dd>{ESTADO_LABEL[l.estado]}</dd>
                  </dl>
                  <Notas leadId={l.id} inicial={l.notas} />
                </details>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
