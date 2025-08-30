## FLow Marketplace
An AI-powered marketplace where a middleman agent negotiates on behalf of sellers and buyers.
We blend Plastic Labs Honcho (personalization + persistent memory) with Flowglad (payments & billing) and Supabase (DB/Auth/Storage) in a Next.js app.

### Core services:
- Next.js (App Router) — UI, server actions, API routes (/app/api/...).
- Supabase (Postgres + Storage + Auth optional) — primary DB & asset store.
- Flowglad — checkout (single payments), subscriptions, and usage-metered billing for Q&A/negotiation minutes.
- Plastic Labs Honcho — identity + long-term memory: seller preferences, buyer style, agent strategy.

### User flow
1. Seller lists product → intake chat seeds price requirements (goal/floor/timing).
2. Agent profile is created/updated in Honcho with seller/product context.
3. Buyer visits listing → can Ask Agent (paid Q&A) or Negotiate.
5. Buyer accepts an offer → Buy Now (single payment) → Flowglad webhook confirms → order finalized.
6. Outcome (won/lost/price curve) is written back to Honcho memory for future policy.

