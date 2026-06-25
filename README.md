# Graquamarine Website

Foundation for the Graquamarine website, a water activities business in
Hurghada, Egypt.

The project has a complete UI using the Graquamarine brand palette: #01A3CB
(aqua), #282262 (navy), and white. All pages (Home, About, Activities,
Contact) are designed consistently with hero sections, image-led cards, and
brand-styled forms. A reservation backend with admin dashboard is in place.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Prisma v5 (SQLite)
- Resend (optional email)
- ESLint
- npm

## Local Setup

```bash
npm install
```

Copy `.env.example` to `.env` and configure the variables:

```
DATABASE_URL="file:./dev.db"
ADMIN_PASSWORD="change-this-password"
RESERVATION_EMAIL_TO=""
RESEND_API_KEY=""
NEXT_PUBLIC_SITE_URL="https://graquamarine.com"
```

Initialize the database:

```bash
npx prisma generate
npx prisma db push
```

Start the dev server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Scripts

- `npm run dev` - start local development
- `npm run lint` - run ESLint
- `npm run build` - create production build
- `npm run start` - run production server after build

## Pages

- `/` - homepage with hero slideshow, feature cards, activity preview, gallery carousel, and pre-footer CTA
- `/about` - brand story, value cards, and CTA matching the homepage style
- `/activities` - full activity catalog with styled image cards, reservation form connected to backend, and WhatsApp CTA
- `/contact` - contact cards with real phone/social links, message form, map placeholder, and WhatsApp CTA
- `/admin/login` - admin login form (password from ADMIN_PASSWORD env var)
- `/admin` - admin dashboard (reservation table, status updates, admin notes)

## Activity Data

Services and base prices live in `src/lib/activities.ts`.

## Reservation Flow

1. User selects an activity from the `/activities` page and fills the reservation form.
2. Form submits to `POST /api/reservations` with validation (known activity, valid date, required fields).
3. Reservation is saved to SQLite with `PENDING` status.
4. If `RESEND_API_KEY` is configured, an email notification is sent to `RESERVATION_EMAIL_TO`.
5. Admin views and manages reservations at `/admin`.

## Admin Dashboard

- Login at `/admin/login` with the `ADMIN_PASSWORD`
- Dashboard shows all reservations sorted by newest first
- Admin can update status (PENDING → CONFIRMED / CANCELLED)
- Admin can add internal notes per reservation
- Desktop: table view. Mobile: stacked cards
- Authentication uses an httpOnly cookie (`graquamarine_admin`)

## Database

- Prisma v5 with SQLite (`prisma/dev.db`)
- Schema at `prisma/schema.prisma`
- Updates: `npx prisma db push`
- Client: `npx prisma generate`

## Environment Variables

| Variable | Required | Purpose |
|----------|----------|---------|
| DATABASE_URL | Yes | SQLite path (default: `file:./dev.db`) |
| ADMIN_PASSWORD | Yes | Admin dashboard password |
| NEXT_PUBLIC_SITE_URL | No | Production URL for metadata |
| RESEND_API_KEY | No | Resend API key for email notifications |
| RESERVATION_EMAIL_TO | No | Email to receive reservation alerts |

## Future Phases

1. Brand direction approval and real copy.
2. Spam protection (rate limiting, CAPTCHA).
3. SEO pass: sitemap, robots, structured data, local keywords.
4. Production migration (SQLite → Supabase/PostgreSQL).
5. Deployment, domain, SSL, analytics.
