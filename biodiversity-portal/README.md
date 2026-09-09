# Biodiversity Portal

EndemicLens is a React/Vite and Express/MongoDB portal for exploring Sri Lankan biodiversity, managing a scientific species catalogue, and preparing user observations for future identification services.

## Stack

- Frontend: React, Vite, Tailwind CSS, React Router, Leaflet
- Backend: Node.js, Express, Mongoose
- Database: MongoDB Atlas
- Authentication: Argon2 password hashing, MongoDB-backed HTTP-only sessions, Google OAuth
- Validation/security: Zod, Helmet, CORS, rate limiting
- Email: Nodemailer over SMTP for password-reset OTPs

## Project layout

```text
src/                         React application
  context/                   AuthContext and session state
  pages/                     Public, portal, auth, map, and admin pages
  services/                  Frontend API client
server/                      Express application
  src/models/                Mongoose collections
  src/routes/                Auth, species, observations, and admin APIs
  src/middleware/            Authentication and authorization
  src/utils/                 Seed scripts and mail delivery
```

## Local setup

### 1. Configure MongoDB

Copy the example values into `server/.env` and provide a real MongoDB Atlas connection string. The database name used by the current connection is `biodiversity`.

```env
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@your-cluster.mongodb.net/biodiversity?retryWrites=true&w=majority
SESSION_SECRET=use-a-long-random-secret
CLIENT_URL=http://localhost:5173
PORT=5000
```

In Atlas, create the database user and allow your development IP under **Network Access**. URL-encode special characters in the database password.

### 2. Install dependencies

```bash
npm install
cd server
npm install
cd ..
```

### 3. Seed the catalogue

The existing project fixture can be imported safely using stable species slugs:

```bash
cd server
npm run seed:species
```

These are starting/test records and must be checked against authoritative scientific sources before production publication.

To add the supplied Sri Lankan mammal list with taxon-matched iNaturalist image URLs and source attribution:

```bash
cd server
npm run seed:mammals
```

This command is idempotent. Records without a public default image are still added with an empty image field so an administrator can review and add an appropriately licensed image later. Image URLs are served by iNaturalist and should be checked against their current license/attribution terms before production use.

To add the supplied Sri Lankan bird list with exact-taxonomy image lookup and source attribution:

```bash
cd server
npm run seed:birds
```

The bird seed uses exact scientific-name matches from iNaturalist, is safe to run repeatedly, and leaves an image field empty when no default photo is available.

### 4. Start both applications

Terminal 1:

```bash
cd server
npm run dev
```

Terminal 2:

```bash
npm run dev
```

Open the Vite URL, normally `http://localhost:5173`.

Expected backend output:

```text
MongoDB connected
Server running at http://localhost:5000
```

## Authentication

### Email and password

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

Passwords are never stored in plaintext. Sessions use HTTP-only cookies and are regenerated after authentication.

### Google sign-in

Create a Google Cloud OAuth **Web application** and add this exact redirect URI:

```text
http://localhost:5000/api/auth/google/callback
```

Add the frontend origin:

```text
http://localhost:5173
```

Then uncomment and fill these values in `server/.env`:

```env
GOOGLE_CLIENT_ID=your-real-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-real-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
```

Add your Google account as a test user while the OAuth consent screen is in testing mode. Restart the backend after changing `.env`.

### Password reset

The login page links to `/reset-password`. The flow sends a six-digit OTP through SMTP, stores only an Argon2 OTP hash, expires the code after 10 minutes, limits attempts, and invalidates the code after use.

Configure an SMTP provider or app password in `server/.env`:

```env
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-smtp-username
SMTP_PASSWORD=your-smtp-app-password
SMTP_FROM=EndemicLens <no-reply@example.com>
```

Never commit SMTP credentials. Without these values, the reset page reports that email delivery is not configured.

## Admin portal

Admin UI: `http://localhost:5173/admin`

Promote an existing account:

```bash
cd server
npm run make-admin -- user@example.com
```

Or create/update an idempotent development admin using environment variables:

```env
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=replace-with-a-strong-development-password
```

```bash
npm run seed:admin
```

Sign out and sign in again after changing a role. Both frontend route guards and backend `requireAdmin` middleware protect the portal.

The current admin portal supports:

- Dashboard metrics
- User listing and account suspension/restoration
- Species creation, editing, and soft archive
- Legacy animal record listing/deletion
- Audit log API

## Database collections

- `users`: accounts, roles, login metadata, Google identity, reset metadata
- `species`: canonical scientific catalogue records
- `speciesimages`: image metadata and external storage URLs
- `animals`: legacy animal CRUD compatibility collection
- `observations`: authenticated wildlife submissions
- `identifications`: future AI identification results
- `favorites`: user/species relationships
- `auditlogs`: administrator actions
- `sessions`: server-side authentication sessions

Large image files are not stored in MongoDB. The current admin form accepts image URLs; an object-storage upload adapter (Cloudinary, R2, or S3) must be configured before production image uploads are enabled.

## API overview

```text
GET    /api/species?page=1&limit=12&search=langur&category=mammals
GET    /api/species/:slug
POST   /api/observations                 authenticated
GET    /api/observations/mine            authenticated
GET    /api/admin/dashboard              admin
GET    /api/admin/users                  admin
PATCH  /api/admin/users/:id/status       admin
PATCH  /api/admin/users/:id/role         admin
GET    /api/admin/species                admin
POST   /api/admin/species                admin
PATCH  /api/admin/species/:id            admin
DELETE /api/admin/species/:id            admin, soft archive
GET    /api/admin/audit-logs             admin
```

## Validation

Run the complete local validation from the project root:

```bash
npm run validate
```

This runs:

1. `vite build` to validate production bundling and JSX imports.
2. `eslint .` to validate frontend and server source rules.
3. Backend `node --check` over startup, config, models, routes, and utilities.

Useful live smoke checks while both services are running:

```bash
curl http://localhost:5000/
curl 'http://localhost:5000/api/species?page=1&limit=2'
curl -I http://localhost:5000/api/auth/google
```

Expected results:

- API health returns `200` and `Biodiversity Portal API is running`.
- Species API returns `success: true` and pagination data after `npm run seed:species`.
- Google endpoint redirects to Google when credentials are configured, or redirects back to `/login?oauth_error=google_not_configured` when they are not.

## Security notes

- Keep `server/.env` private and ensure it remains ignored by Git.
- Rotate any MongoDB, SMTP, or Google credentials that have been exposed.
- Use HTTPS, secure cookies, a production session secret, and a restricted MongoDB network policy in production.
- Do not use development admin credentials in production.
- Species records seeded from the original fixture are not automatically authoritative scientific data.
