# Graquamarine Website

Water activities business website for Graquamarine in Hurghada, Egypt.

The project has a complete UI using the brand palette — #01A3CB (aqua),
#282262 (navy), and white — across Home, About, Activities, and Contact pages.
A reservation backend with Prisma + PostgreSQL and an admin dashboard is in
place. Production hosting is on a VPS.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Prisma v5 (PostgreSQL)
- Resend (optional email)
- ESLint
- npm

## Local Setup

```bash
npm install
```

Copy `.env.example` to `.env` and set the variables:

```bash
cp .env.example .env
```

For local development, the defaults in `.env.example` match the
`docker-compose.yml` configuration. Edit `.env` to set a custom
`ADMIN_PASSWORD`.

### Start PostgreSQL (Docker)

```bash
docker compose up -d
```

This starts a PostgreSQL 16 container with the database, user, and password
configured to match the `.env.example` defaults.

### Initialize the database

```bash
npm run db:push
```

This pushes the Prisma schema directly to the database. For production
migrations, use `prisma migrate dev` / `prisma migrate deploy` instead.

### Start the dev server

```bash
npm run dev
```

Open `http://localhost:3000`.

## Local Admin Dashboard Testing

Quick start after `npm install` and `.env` setup:

```bash
docker compose up -d               # start PostgreSQL
npm run db:push                     # sync schema
npm run dev                         # start Next.js
```

1. Submit a test reservation at `http://localhost:3000/activities`
2. Open `http://localhost:3000/admin`
3. Login with the `ADMIN_PASSWORD` from your `.env`
4. You should see the submitted reservation in the dashboard
5. Optional: browse the database with `npm run db:studio`

**Important:**
- Do not commit your `.env` file.
- If using Docker, the DATABASE_URL must match the Docker credentials
  (`graquamarine_user` / `local_dev_password` by default).
- Production uses a separate VPS with its own PostgreSQL and env values.

## Scripts

- `npm run dev`   — start local development
- `npm run lint`  — run ESLint
- `npm run build` — create production build
- `npm run start` — run production server

## Pages

| Route | Purpose |
|-------|---------|
| `/` | Homepage with hero slideshow, feature cards, activity preview, gallery, CTA |
| `/about` | Brand story, value cards, CTA |
| `/activities` | Activity catalog, reservation form, WhatsApp CTA |
| `/contact` | Contact cards, message form, map placeholder, WhatsApp CTA |
| `/admin/login` | Admin login (password from `ADMIN_PASSWORD`) |
| `/admin` | Admin dashboard (reservations, status, notes) |

## Reservation Flow

1. User selects an activity and fills the reservation form on `/activities`.
2. Form submits to `POST /api/reservations` with validation.
3. Reservation saved to PostgreSQL with `PENDING` status.
4. Optional email notification via Resend if keys are configured.
5. Admin manages reservations at `/admin`.

## Admin Dashboard

- Login at `/admin/login` with the `ADMIN_PASSWORD` env variable.
- Cookie-based auth (`graquamarine_admin`, httpOnly, SHA-256 hashed).
- Desktop table view. Mobile stacked cards.
- Update status (Pending / Confirmed / Cancelled) and add internal notes.
- Refresh button. Logout button.

## Environment Variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `ADMIN_PASSWORD` | Yes | Admin dashboard password |
| `NEXT_PUBLIC_SITE_URL` | No | Production URL |
| `RESEND_API_KEY` | No | Resend API key for email notifications |
| `RESERVATION_EMAIL_TO` | No | Email to receive reservation alerts |

## VPS Production Deployment

### 1. Server packages

Install on the VPS (Ubuntu/Debian):

```bash
# Node.js LTS
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# PostgreSQL
sudo apt-get install -y postgresql

# Nginx
sudo apt-get install -y nginx

# PM2
sudo npm install -g pm2

# Git
sudo apt-get install -y git
```

### 2. PostgreSQL database and user

```bash
sudo -u postgres psql
```

```sql
CREATE DATABASE graquamarine;
CREATE USER graquamarine_user WITH ENCRYPTED PASSWORD 'STRONG_PASSWORD';
GRANT ALL PRIVILEGES ON DATABASE graquamarine TO graquamarine_user;
```

For PostgreSQL 15+, also grant schema permissions:

```sql
\c graquamarine
GRANT ALL ON SCHEMA public TO graquamarine_user;
```

### 3. Clone and configure

```bash
git clone <repo-url> /opt/graquamarine
cd /opt/graquamarine
```

Create `.env` in the project root:

```
DATABASE_URL="postgresql://graquamarine_user:STRONG_PASSWORD@localhost:5432/graquamarine"
ADMIN_PASSWORD="replace-with-a-long-secure-password"
RESEND_API_KEY=""
RESERVATION_EMAIL_TO=""
NEXT_PUBLIC_SITE_URL="https://graquamarine.com"
```

### 4. Build and start

```bash
npm install
npx prisma generate
npx prisma migrate deploy
npm run build
pm2 start npm --name graquamarine -- start
pm2 save
pm2 startup
```

If no migration exists yet (first deploy), create it:

```bash
npx prisma migrate dev --name init_reservations
```

Then use `prisma migrate deploy` for subsequent deploys.

### 5. Nginx reverse proxy

Create `/etc/nginx/sites-available/graquamarine`:

```nginx
server {
    server_name graquamarine.com www.graquamarine.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable and reload:

```bash
sudo ln -s /etc/nginx/sites-available/graquamarine /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 6. SSL

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d graquamarine.com -d www.graquamarine.com
```

### 7. Production warnings

- Do not commit `.env` or `prisma/dev.db`.
- Use a strong `ADMIN_PASSWORD`.
- Set up PostgreSQL backups (`pg_dump` cron job).
- Add rate limiting and CAPTCHA to the reservation form before heavy traffic.
- Configure Resend DNS records if using email notifications.
- Set `NODE_ENV=production` in the PM2 environment.

### 8. Deploying updates

```bash
cd /opt/graquamarine
git pull
npm install
npx prisma generate
npx prisma migrate deploy
npm run build
pm2 restart graquamarine
```

## Database

- **Provider**: PostgreSQL (Prisma v5)
- **Model**: `Reservation` — id, activity, preferredDate, fullName, phone, guests, hotelLocation, message, adminNote, status, timestamps
- **Migrations**: `npx prisma migrate dev` (create) / `npx prisma migrate deploy` (apply)
- **Client**: `npx prisma generate`

## Activity Data

Services and base prices live in `src/lib/activities.ts`.

## Future Work

- Copy approval from brand owner.
- Spam protection (rate limiting, CAPTCHA) on reservation form.
- SEO: sitemap, robots, structured data, local keywords.
- PostgreSQL backups.
- Resend/SMTP setup for production email notifications.
