# Chele Towing Project Rules

## Product

- Chele Towing buys vehicles in any condition in Florida.
- Public content is bilingual where it affects the customer journey.
- Do not invent real phone numbers, addresses, testimonials, or business claims.
- Placeholder content must remain clearly generic until approved business content is provided.

## Stack

- React + Vite, TailwindCSS, React Router, Supabase Auth/Database/Storage.
- Keep Supabase access centralized in `src/context/AppContext.jsx` and `src/lib/supabase.js`.
- The application uses Supabase as its only persistence layer. Do not add mock records, localStorage persistence, or demo authentication.

## Data

- Canonical schema lives in `supabase/schema.sql`.
- Chele Towing uses the dedicated Supabase project configured through `VITE_SUPABASE_URL`; never hardcode the project URL in application source files.
- Supabase browser access must use only `VITE_SUPABASE_ANON_KEY`. Never expose or use secret keys, service-role keys, or database credentials in the frontend.
- Supabase credentials must be read from `import.meta.env` in `src/lib/supabase.js`.
- Keep all Supabase table and Storage operations centralized in `src/lib/supabase.js`.
- The Chele Towing data layer covers `vehicle_leads`, `site_content`, `testimonials`, and `gallery_images`.
- Lead statuses: `new`, `contacted`, `negotiating`, `accepted`, `rejected`, `picked_up`, `paid`.
- Uploaded vehicle photos use the `vehicle-photos` Supabase Storage bucket.
- Public lead submission is allowed; lead reads and updates require an authenticated Supabase user.
- Nunca modificar ni borrar datos de otros proyectos Supabase. Chele Towing debe usar tablas propias o un proyecto Supabase separado.
- Supabase migrations must be reviewed and executed manually. Do not run migrations automatically or remotely unless the user explicitly authorizes that action.
- Supabase SQL must remain non-destructive: use idempotent creation patterns and never use `DROP`, `DELETE`, or `TRUNCATE`.
- When Supabase environment variables are absent, show a configuration error instead of falling back to mock data or localStorage.
- Public gallery images and testimonials must come only from `gallery_images` and `testimonials`. Do not embed placeholder records in source files.
- `site_content` stores general website content and business service cards; it does not replace the dedicated gallery or testimonials tables.
- Lead creation uses `createLead()` and vehicle photo uploads use `uploadVehiclePhotos()` from `src/lib/supabase.js`.

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
