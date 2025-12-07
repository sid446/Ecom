# Ecom — Project Report

## Project Overview

- **Name:** `my-app` (local repo `Ecom`)
- **Stack:** Next.js (App Router), React 19, TypeScript, Tailwind CSS, MongoDB (Mongoose), Node
- **Purpose:** Simple e-commerce store with product listing, cart, checkout, orders, and user management.

## Architecture & Key Concepts

- **Framework:** Next.js App Router (server & client components). Pages live under the `app/` directory.
- **State management:** React Context for cart (`context/CartContext.tsx`) and (additional) `ProductContext.tsx` in `context/`.
- **Database:** MongoDB accessed via `lib/mongodb.ts` and Mongoose models in `models/` (`Product.ts`, `Order.ts`, `User.ts`).
- **Email & notifications:** `lib/email.ts` used for sending emails; third-party SDKs present in `package.json` (e.g., `nodemailer`, `twilio`, `razorpay`).

## Project Structure (high-level)

- `app/` — Next.js App Router routes, pages, and top-level layout

  - `app/api/` — API route handlers for `products`, `orders`, `users`, `seed`, `send-otp`, `verify-otp`, `send-order-confirmation` (serverless functions)
  - `app/components/` — UI components: `Navbar.tsx`, `Hero.tsx`, `ProductCard.tsx`, product filters, skeletons and error states, and checkout components under `checkout/`.
  - `app/context/` and `context/` — React context providers (cart + product contexts)
  - `app/globals.css` — Tailwind and custom CSS variables (font integration with Kalnia via `--font-kalnia`)

- `lib/` — helper utilities: `mongodb.ts` (DB connection), `email.ts` (mail helpers)
- `models/` — Mongoose schemas and models: `Product`, `Order`, `User`
- `public/` — static assets (images, icons)
- `types/` — TypeScript types used across the project

## API Endpoints (from `app/api/` layout)

- `GET/POST /api/products` and `GET/PUT/DELETE /api/products/[id]`
- `GET/POST /api/orders` and `GET /api/orders/[id]`
- `POST /api/seed` — seed the database with sample data
- `POST /api/send-otp` and `POST /api/verify-otp` — OTP flows
- `POST /api/send-order-confirmation` — triggers order confirmation emails
- `POST /api/users` — user creation/login helper

Note: For exact request/response formats consult each file in `app/api/*/route.ts`.

## Important Files

- `app/layout.tsx` — root layout. Integrates Google font `Kalnia` via `next/font/google` and exposes the CSS variable `--font-kalnia` applied to `body`.
- `app/globals.css` — theme variables and Tailwind entry; body uses `var(--font-sans)` which maps to `--font-kalnia`.
- `context/CartContext.tsx` — cart state/provider and hooks used across UI components.
- `lib/mongodb.ts` — MongoDB connection setup (used by API handlers and models).
- `models/*.ts` — domain models with Mongoose schema definitions.

## Dependencies & Scripts

From `package.json`:

- **Key dependencies:** `next@15.5.0`, `react@19.1.0`, `mongoose`, `mongodb`, `tailwindcss`, `nodemailer`, `twilio`, payment SDKs like `razorpay` and `@cashfreepayments/cashfree-sdk`.
- **Scripts:**
  - `npm run dev` — starts Next.js dev server
  - `npm run build` — builds the Next.js app
  - `npm run start` — runs the production server
  - `npm run lint` — runs ESLint

Example dev commands:

```
npm install
npm run dev
```

## Styling & Fonts

- Tailwind CSS is configured (`tailwind.config.ts`, `postcss.config.mjs`).
- `Kalnia` font is integrated in `app/layout.tsx` using `next/font/google` and wired to a CSS variable `--font-kalnia`; `globals.css` maps `--font-sans` to that variable so the site uses Kalnia by default.

## Notes About Data/Env

- The app uses MongoDB — set `MONGODB_URI` (or the expected env var used in `lib/mongodb.ts`) before running production builds or server functions.
- Payment and 3rd-party services require appropriate API keys (Razorpay, Cashfree, Twilio, Cloudinary, etc.). Check environment variable usage in API routes.

## Suggested Next Steps / Improvements

- Add a `docs/` README for development environment and a sample `.env.example` with required env vars.
- Add API documentation (OpenAPI or simple endpoint list + payload examples) under `docs/api.md`.
- Add tests for critical flows (cart, checkout, order creation) and a simple CI pipeline.
- Harden security: input validation and rate limiting on OTP endpoints.

## Where to find the report

The file was created at: `docs/PROJECT_REPORT.md`

---

Generated automatically by a workspace audit. Ask me to expand any section or to produce an OpenAPI spec for the API routes.
