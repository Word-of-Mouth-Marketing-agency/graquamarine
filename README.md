# Graquamarine Website

Foundation for the Graquamarine website, a water activities business in
Hurghada, Egypt.

The project now has a first homepage UI pass using the Graquamarine direction:
deep ocean blue, aqua/turquoise, white, and warm sand accents. Real contact
details (phone, WhatsApp, Facebook, Instagram) are wired in, the hero uses a
fading image slideshow, feature cards and activity cards show real photography,
and section backgrounds use real imagery.

The current homepage refinement uses a transparent non-sticky header over a
90vh hero, real social icon links, simplified hero copy, hero image slideshow,
real feature/activity card images, section background images, and a horizontal
gallery placeholder carousel.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- ESLint
- npm

## Local Setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Copy `.env.example` to `.env.local` when reservation or external service
integrations begin.

## Scripts

- `npm run dev` - start local development
- `npm run lint` - run ESLint
- `npm run build` - create production build
- `npm run start` - run production server after build

## Pages

- `/` - homepage with fading hero image slideshow, activity cards, gallery placeholder, and CTAs
- `/about` - placeholder business story and safety notes
- `/activities` - activity catalog and frontend-only reservation form
- `/contact` - placeholder contact details

## Activity Data

Services and base prices live in `src/lib/activities.ts`.

## Reservation Flow Plan

Current state:

- The Activities page includes a frontend-only reservation form.
- The form collects activity, date, full name, WhatsApp/phone, guest count,
  hotel/pickup location, and notes.
- Submission is intentionally disabled until a backend/email workflow is chosen.

Future flow:

1. Validate form fields on the client and server.
2. Send reservation requests to an API route or external form handler.
3. Email the Graquamarine team through Resend or similar.
4. Store reservation records in Supabase or another database if needed.
5. Add confirmation state, spam protection, and admin follow-up workflow.

## Future Phases

1. Visual design and brand direction.
2. Real copywriting and media collection.
3. Reservation backend integration.
4. SEO pass: sitemap, robots, structured data, metadata, and local keywords.
5. Deployment, domain, SSL, analytics, and post-launch checks.
