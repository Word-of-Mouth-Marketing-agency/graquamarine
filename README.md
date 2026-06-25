# Graquamarine Website

Water activities business website for Graquamarine in Hurghada, Egypt.

The project has a complete UI using the brand palette - #01A3CB (aqua),
#282262 (navy), and white - across Home, About, Activities, and Contact pages.
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

This starts a PostgreSQL 16 container on host port **5433** (internal port 5432)
with the database, user, and password configured to match the `.env.example`
defaults. Port 5433 is used to avoid conflicts with any existing PostgreSQL
on port 5432.

### Initialize the database

```bash
npx prisma generate
npx prisma migrate deploy
```

This applies committed Prisma migrations to the local Docker PostgreSQL
database. Use `npm run db:push` only for throwaway local schema experiments.

### Start the dev server

```bash
npm run dev
```

Open `http://localhost:3000`.

## Local Admin Dashboard Testing

Quick start after `npm install` and `.env` setup:

```bash
docker compose up -d               # start PostgreSQL
npx prisma migrate deploy           # apply committed migrations
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

- `npm run dev` - start local development
- `npm run lint` - run ESLint
- `npm run build` - create production build
- `npm run start` - run production server
- `npm run db:generate` - regenerate Prisma Client
- `npm run db:push` - push schema directly to a local database
- `npm run db:studio` - open Prisma Studio

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

1. User selects one or more activities and fills the reservation form on `/activities`.
2. Form submits to `POST /api/reservations` with validation and honeypot spam handling.
3. Reservation saved to PostgreSQL with `PENDING` status.
4. Optional email notification via Resend if keys are configured.
5. Admin manages reservations at `/admin`.

Reservation fields: activities, guests, preferred date, full name, WhatsApp /
phone, hotel / pickup location, and message / notes. The server computes total
price itself: per-guest activities multiply by guests, while Private Boat is a
flat one-time price.

## Admin Dashboard

- Login at `/admin/login` with the `ADMIN_PASSWORD` env variable.
- Cookie-based auth (`graquamarine_admin`, httpOnly, SHA-256 hashed).
- Desktop table view. Mobile stacked cards.
- Update status (Pending / Confirmed / Cancelled) and add internal notes.
- Refresh button. Logout button.
- Admin login is rate-limited by IP.

## Spam Protection

- `POST /api/reservations`, `POST /api/contact`, and `POST /api/admin/login`
  use a simple in-memory IP rate limiter: 5 attempts per 10 minutes.
- Reservation and contact forms include a hidden `website` honeypot field.
- If the honeypot is filled, the API returns a success-like response without
  creating a reservation or sending email.

## Environment Variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `ADMIN_PASSWORD` | Yes | Admin dashboard password |
| `NEXT_PUBLIC_SITE_URL` | No | Production URL |
| `RESEND_API_KEY` | No | Resend API key for email notifications |
| `RESERVATION_EMAIL_TO` | No | Email to receive reservation alerts |

## Troubleshooting

### Authentication failed against database server at localhost

If you see `PrismaClientInitializationError` with "Authentication failed for
user graquamarine_user", the password in your `.env` `DATABASE_URL` does not
match the local PostgreSQL user password.

**Option A - Reset with Docker (recommended):**

Stop the dev server, then recreate the database container:

```bash
docker compose down -v
docker compose up -d
```

Make sure your `.env` `DATABASE_URL` matches the Docker credentials
(uses port **5433** to avoid conflicts with existing PostgreSQL on port 5432):

```
DATABASE_URL="postgresql://graquamarine_user:graquamarine_local_password@localhost:5433/graquamarine"
```

Then apply migrations:

```bash
npx prisma migrate deploy
npm run dev
```

**Option B - Use your existing local PostgreSQL:**

Keep your running PostgreSQL server. In psql as a superuser:

```sql
ALTER USER graquamarine_user WITH PASSWORD 'YOUR_PASSWORD_FROM_ENV';
CREATE DATABASE graquamarine;
GRANT ALL PRIVILEGES ON DATABASE graquamarine TO graquamarine_user;
\c graquamarine
GRANT ALL ON SCHEMA public TO graquamarine_user;
```

Then run `npx prisma migrate deploy && npm run dev`.

**Important:** Do not commit your `.env` file.

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

The initial migration is committed under `prisma/migrations`, so VPS deploys
should use `npx prisma migrate deploy`.

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
- Consider CAPTCHA before heavy traffic if spam increases.
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
- **Model**: `Reservation` - id, activity, activities JSON string, preferredDate, fullName, phone, guests, hotelLocation, message, totalPrice, adminNote, status enum, timestamps
- **Migrations**: `npx prisma migrate dev` (create) / `npx prisma migrate deploy` (apply)
- **Client**: `npx prisma generate`

## Activity Data

Services and base prices live in `src/lib/activities.ts`.

## Future Work

- Copy approval from brand owner.
- Consider CAPTCHA if spam becomes an issue.
- SEO: sitemap, robots, structured data, local keywords.
- PostgreSQL backups.
- Resend/SMTP setup for production email notifications.
