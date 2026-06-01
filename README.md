# Chele Towing

Responsive React/Vite application for a Florida vehicle-buying business. It includes a bilingual public landing page, free estimate workflow, pricing calculator, WhatsApp handoff, Supabase integration, and a Refine-inspired admin dashboard.

## Run locally

```bash
npm install
copy .env.example .env
npm run dev
```

Open `http://localhost:5173`. Without Supabase credentials the app runs in demo mode using browser local storage. Admin preview is available at `/admin/login`; any email and password work only in demo mode.

## Configure Supabase

1. Create a Supabase project.
2. Run [`supabase/schema.sql`](./supabase/schema.sql) in the Supabase SQL editor.
3. Create an admin user in Supabase Authentication.
4. Copy `.env.example` to `.env` and add:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
OWNER_WHATSAPP_NUMBER=13053907779
```

Use digits only for the WhatsApp number, including the country code. The admin content manager can override this number.

## Features

- Public bilingual landing page with services, process, gallery, testimonials, and CTAs.
- Vehicle estimate form with photos and calculated offer range.
- Automatic WhatsApp message containing lead and vehicle details.
- Supabase Auth, Database, Storage, and RLS policies.
- Admin metrics, lead filters, lead detail, call and WhatsApp actions, status workflow, photo viewer, and basic content manager.

## Production notes

- Replace all placeholder gallery images and sample testimonials with approved business content.
- Confirm the final WhatsApp number before deployment.
- Review RLS policies against the required staff access model before production.
- The estimate algorithm in `src/lib/estimate.js` is intentionally approximate and should be calibrated with business rules.
