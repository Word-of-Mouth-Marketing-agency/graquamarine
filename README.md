# Graquamarine Website

Foundation for the Graquamarine website, a water activities business in
Hurghada, Egypt.

The project now has a first homepage UI pass using the Graquamarine direction:
deep ocean blue, aqua/turquoise, white, and warm sand accents. Real media and
contact details are still placeholders until provided.

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

- `/` - homepage UI foundation with header, hero, activity cards, gallery placeholder, and CTA
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
