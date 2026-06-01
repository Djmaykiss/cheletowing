# Chele Towing Project Rules

## Product

- Chele Towing buys vehicles in any condition in Florida.
- Public content is bilingual where it affects the customer journey.
- Do not invent real phone numbers, addresses, testimonials, or business claims.
- Placeholder content must remain clearly generic until approved business content is provided.

## Stack

- React + Vite, TailwindCSS, React Router, Supabase Auth/Database/Storage.
- Keep Supabase access centralized in `src/context/AppContext.jsx` and `src/lib/supabase.js`.
- The project must remain usable in local demo mode when Supabase environment variables are absent.

## Data

- Canonical schema lives in `supabase/schema.sql`.
- Lead statuses: `new`, `contacted`, `negotiating`, `accepted`, `rejected`, `picked_up`, `paid`.
- Uploaded vehicle photos use the `vehicle-photos` Supabase Storage bucket.
- Public lead submission is allowed; lead reads and updates require an authenticated Supabase user.

## UI

- Preserve the mobile-first layout and towing palette: dark gray/black, towing yellow, white, and WhatsApp green.
- Reuse components before adding one-off markup when patterns repeat.
- Admin UI should stay clean, compact, and inspired by modern Refine dashboards.
- El formulario de vehículo debe usar dropdowns dependientes para marca/modelo y no campos libres, excepto la opción Other/Otro.
- Todos los proyectos Chele Towing deben mostrar en el footer los créditos de desarrollo de Michael Alexander Perez, su portfolio y su sitio web MarkingWebs.
- El acceso admin nunca debe mostrarse en la landing pública. El admin vive en /admin como dashboard privada.
- La sección principal del footer siempre pertenece al negocio Chele Towing. Los créditos del desarrollador solo aparecen en la barra inferior de copyright.

## Configuration

- Never commit `.env`.
- Use `.env.example` to document required environment variables.
- `OWNER_WHATSAPP_NUMBER` is the environment fallback. Admin-managed content may override it.
