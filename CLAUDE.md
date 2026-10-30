# nicanor-landing

Embudo de captación de Nicanor Álvarez (psicólogo católico, Lima). Dos rutas que guardan contactos,
los califican y avisan a Meta para que las campañas optimicen hacia quien sí agenda y se vuelve paciente.

- `/` · Sesión de consejería de pareja gratuita (30 min). Formulario por pasos: contacto → situación →
  qué pasa → quién busca ayuda → urgencia → disposición a invertir → Calendly.
- `/diagnostico` · Autodiagnóstico de 5 preguntas → contacto → quién busca → disposición → resultado con perfil y Calendly.
- `/admin` · Panel de contactos con contraseña (`ADMIN_PASSWORD`): nivel, estado, notas, WhatsApp, CSV.

## Arquitectura (clonada de sinapsis-academy)
- Next.js 15.5.22 (App Router) + Supabase (tabla `leads`, `supabase/migrations/0001_leads.sql`) en Vercel.
- El contacto se guarda apenas lo dejan (`guardarContacto`), antes del resto de preguntas. Incompleto = `completed_at` nulo.
- Calificación en el servidor (`lib/leads/calificacion.ts`): "Por ahora prefiero opciones gratuitas" ⇒ frío.
- Meta: pixel (`lib/meta/pixel.ts`) + API de Conversiones (`lib/meta/capi.ts`) con el mismo `event_id`
  (`lead-<id>`, `schedule-<id>`, `purchase-<id>`). Lead solo para calificado y tibio; frío ⇒ `LeadNoCalificado`.
  Schedule al agendar en Calendly o al marcar "agendó" en el panel; Purchase al marcar "paciente".
- Sin Supabase configurado, en desarrollo los contactos se guardan en memoria (`lib/leads/store.ts`).

## Convenciones
- Textos y comentarios en español. Línea gráfica de Nicanor: marfil, azul noche, vino, oro; Playfair Display + Poppins.
- Ángulo de comunicación: primero el problema de pareja, la fe en segundo plano. Decir "sacerdote" o "padre", nunca "cura".
- Repo en la cuenta GitHub `emanuelrlinares79`; commits con autor `emanuelrlinares79@gmail.com` (Vercel Hobby bloquea
  deploys de autores que no son colaboradores). Antes de `git push`: `gh auth switch --hostname github.com --user emanuelrlinares79`,
  y después volver a `emaromeromp4`.
- Verificar con `npx tsc --noEmit`, `npm run lint` y `npm run build` antes de dar algo por terminado.
