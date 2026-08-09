# Ikasa Renovations

Production-quality marketing website and MongoDB-powered admin CMS for **Ikasa Renovations** — custom kitchens, bathrooms, closets, flooring, fixtures, and complete interior transformations.

**Primary goal:** book renovation consultations and free-estimate appointments.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- MongoDB + Mongoose
- GSAP + ScrollTrigger, Framer Motion, Lenis
- React Hook Form + Zod
- bcryptjs + jose (HTTP-only JWT cookies)
- Local filesystem uploads (no Cloudinary)

## Requirements

- Node.js 20+
- MongoDB running locally (MongoDB Compass compatible)
- Persistent disk for uploads (VPS/Node host — not ephemeral serverless storage)

## Quick start

```bash
npm install
cp .env.example .env.local
```

Edit `.env.local`:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/ikasa_renovations
AUTH_SECRET=replace-with-a-long-random-secret
ADMIN_EMAIL=admin@ikasarenovations.ca
ADMIN_PASSWORD=choose-a-strong-password
```

Seed the database (pages, services, FAQs, settings, offers, gallery categories, admin user):

```bash
npm run seed
```

Start development:

```bash
npm run dev
```

- Website: [http://localhost:3000](http://localhost:3000)
- Admin: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

Production:

```bash
npm run build
npm start
```

## MongoDB Compass

1. Open MongoDB Compass
2. Connect to `mongodb://127.0.0.1:27017`
3. Select database `ikasa_renovations`
4. Confirm collections after seeding: `adminusers`, `pages`, `services`, `gallerycategories`, `galleryprojects`, `testimonials`, `faqs`, `productcategories`, `offers`, `sitesettings`, etc.

Re-seed anytime with `npm run seed` (clears and repopulates the seeded collections).

## Authentication

- Admin passwords are hashed with bcryptjs
- Sessions use signed JWTs in the `ikasa_admin_session` HTTP-only cookie (`sameSite=lax`, `secure` in production)
- Middleware protects `/admin/*` except `/admin/login`
- Login is rate-limited
- Logout clears the session cookie

Never commit real secrets. Rotate `AUTH_SECRET` and admin passwords for production.

## Content model

All public content is loaded from MongoDB:

| Model | Purpose |
| --- | --- |
| Page | Section-based CMS content for each public page |
| Service | Listing + detail pages at `/services/[slug]` |
| GalleryCategory / GalleryProject | Inspiration gallery (replace stock with real photos) |
| Testimonial | Only **published** reviews appear publicly |
| FAQ | Editable Q&A |
| ProductCategory / Product | Shop catalogue |
| Offer | Time-bound special offers |
| Booking | Consultation requests |
| ContactInquiry | Contact form messages |
| ProductQuoteRequest | Shop quote workflow |
| SiteSettings | Singleton company/contact/SEO/disclaimer settings |

Admin edits validate input, save to MongoDB, then `revalidatePath` affected routes.

## Uploads

Local adapter under `public/uploads/{pages,services,gallery,testimonials,products,offers,bookings,settings,inquiries}`.

- Allowed: JPEG, PNG, WebP, AVIF (SVG only for controlled brand/settings assets)
- Max size: 8 MB
- MIME + extension + magic-byte checks
- Unique sanitized filenames, path-traversal protection
- Relative URLs stored in MongoDB

**Deployment note:** Local filesystem uploads require a persistent Node/VPS disk. They do **not** persist on standard serverless Vercel deployments. Do not silently switch to Cloudinary — keep the storage adapter and swap implementations deliberately when needed.

## Shop, cart, and payments

- Catalogue + cart + product quote requests are implemented
- No fake payment success page
- Payment integration is behind `src/lib/payments/types.ts`
- When ready, implement Stripe or Square against that interface and enable checkout only for `purchasable` products
- Products with `requestQuote` continue through `/quote-request`

## Booking flow

1. Homeowner submits `/booking` (requested date/time, photos, consent)
2. Record saved as status `New`
3. Success message explains the team will confirm availability
4. Admin updates status: New → Contacted → Confirmed / Reschedule Requested / Completed / Cancelled

## Brand assets

Vector logos (transparent SVG, editable paths):

- `/public/brand/ikasa-logo.svg`
- `/public/brand/ikasa-logo-light.svg`
- `/public/brand/ikasa-mark.svg`
- `/public/brand/ikasa-favicon.svg`

Palette accent: Ikasa Red `#D60000` on architectural black/white/grey.

## Motions & accessibility

- Cinematic intro once per browser session (`sessionStorage`), with Skip Intro and reduced-motion fallback
- Lenis smooth scrolling, GSAP ScrollTrigger, Framer Motion page transitions
- Effects simplify on mobile and when `prefers-reduced-motion` is set
- Skip-to-content, keyboard-friendly menus, accessible sliders/accordions/lightbox

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run lint` | ESLint |
| `npm run seed` | Seed MongoDB |

## Important content rules

- No fixed renovation service prices on service pages
- Offers are CMS records with active dates — not hardcoded
- Timeline wording is a target window, not a guarantee (disclaimer from Settings)
- Stock photography is replaceable design reference — do not present as completed Ikasa projects
- Testimonials stay unpublished until verified
- Social links render only when valid URLs exist in Settings

## Contact (seed defaults)

- Email: contact@ikasarenovations.ca
- Phone: 647-377-3694 (`tel:+16473773694`)
