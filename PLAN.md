# realestateinparaguay.com — Build Plan (v1, 2026-07-12)

International (English-first) sister site of **inmobiliaria.com.py**, targeting foreign buyers/investors/expats. Custom Next.js app + cinematic scroll-world hero. **Plan only — no code yet.**

> **HANDOFF NOTE (read first):** This plan was authored by Fable 5 as a handoff to Opus 4.8 / Sonnet 5. It deliberately REUSES as much as possible from `C:\Claude 1\inmobiliaria-com-py\` (its `PLAN.md` is the sibling spec — read it alongside this one; §-references to "INM plan" mean that file). The four skills this project needs are already copied into `.claude/skills/` here: `scroll-world`, `nextjs-deploy-hostinger`, `nextjs-national-lead-gen`, `paraguay-local-seo`. Invoke each skill at the phase indicated in §3 — do not code those phases from memory.

---

## 1. Concept & relationship to inmobiliaria.com.py

Same agency, same inventory, two storefronts:

| | inmobiliaria.com.py | realestateinparaguay.com |
|---|---|---|
| Audience | Paraguayans (es-PY, voseo) | Foreign buyers/investors/expats (EN; DE later) |
| Hosting | Hostinger **LATAM** account | Hostinger **Europe/US** account (separate) |
| Listings | **Authoring source of truth** (MySQL + admin CRUD, Spanish authored + English drafted) | **Own local MySQL, kept in sync** via pull job from INM's export API (§5) — both locales served locally |
| Translation | Authored/reviewed here (admin) | Consumed here; can render both `en` (default) and `es` |
| Content | Light SEO copy on landings | Heavy **guides/blog hub** (buying process, residency, taxes) — this is the SEO moat |
| Currency display | GS primary, USD toggle | USD primary, EUR "approx." secondary |
| Conversion | WhatsApp-first | WhatsApp + prominent contact form + email (US/EU users less WhatsApp-native) |

### Steal map (do NOT rebuild these from scratch)

1. **Scroll-world hero clips** — the 5 scenes in INM plan §6 contain **no text, no logos, no people** (style preamble forbids them), so the encoded clips are 100% language-neutral. Whichever project generates the hero first, **copy the entire `public/scroll-world/` output** (1080p clips, `-m.mp4` mobile siblings, posters, manifest) into this repo. Only the copy overlays change (English, §7). This saves ~13 Higgsfield generations.
2. **Brand kit** — same agency ⇒ same palette/typography tokens the user picks from the 3 Claude Design comps (INM plan §5). Copy the Tailwind theme + style preamble verbatim. Wordmark differs: "Real Estate in Paraguay" (domain-as-brand, same treatment).
3. **Component library** — property card, gallery, amenity chips, filter bar, WhatsApp button, map embed, breadcrumbs, OG-image generator: build once in whichever repo goes first, copy the `components/` + `lib/` files across (they're plain React/TS; only strings/locale differ — keep strings in a `dictionary.ts` from day one in BOTH repos to make the copy trivial).
4. **Scaffold** — clone the setup at `C:\Claude 1\inmobiliaria-com-py\` (Next.js App Router + TS + Tailwind v4, same `package.json` shape; note its `node_modules/next/dist/docs/` warning in AGENTS.md — this Next.js is newer than training data, read the docs there first).
5. **Deploy playbook** — identical Hostinger Node.js flow (skill `nextjs-deploy-hostinger`), same MySQL+Drizzle procedure (INM plan §3/§9), just a different account/region.
6. **Cloudinary** — same Cloudinary account/cloud. Image IDs arrive through the sync job; URLs are global CDN — nothing to copy or re-upload.

### Build-order dependency

The export API (§5) lives on the INM side. **INM Phases 0–4 (platform + admin + DB) must be deployed before this site's sync job has real data to pull.** This site's Phase 0–3 (scaffold, brand, content hub, own DB + sync scaffolding) can proceed in parallel against seed/placeholder data; Phase 4 (real listing pages) blocks on INM's export API existing.

## 2. Decisions (locked vs. proposed)

| Decision | Status |
|---|---|
| Domain-as-brand: "Real Estate in Paraguay" | Locked (mirrors INM convention) |
| Hosting: separate Hostinger account, Europe or US region | Locked by user 2026-07-12 |
| Shared inventory with translation between sites, both bilingual | Locked by user 2026-07-12 |
| **Own local MySQL DB on this account**, synced via pull job from INM's export API; INM stays the authoring source of truth | **Locked by user 2026-07-12** (rationale §4 — separate Hostinger accounts make live cross-account fetch fragile; user wants full bilingual on both sites) |
| Launch language: **EN default**, `/es` also served from day one (both sites fully bilingual); **/de** phase 2 | **Locked** — both-bilingual per user; DE deferred |
| Translation mechanism: authored/reviewed in INM admin, machine-drafted via Claude API, pulled into local bilingual columns here | **Locked** (§5) |
| Hero: reuse INM clips, EN copy overlays | Locked by "steal as much as possible" |
| Same brand palette as INM winner | Proposed — cheap to diverge later; ask user only if they raise it |

## 3. Skill invocation map

| Phase | Skill | What it supplies |
|---|---|---|
| Planning (done) | `nextjs-national-lead-gen` | Archetype A page architecture, design-pattern menu, anti-fabrication rules — **this site is MORE "national-brand" than INM** (content-led, international) so lean harder on its content/SEO strategy sections |
| Planning (done) | `paraguay-local-seo` | Still useful for PY facts, JSON-LD patterns, keyword references — but IGNORE its voseo/es-PY language rules here; audience is English |
| Phase 1 (brand) | Claude Design (external) | Only if user wants a separate look; default = reuse INM tokens |
| Phase 2 (content hub) | `claude-blog:blog-cluster` + `blog-write` | Hub-and-spoke guide cluster (§6). Use blog-brief per pillar first. If/when DE launches: `blog-translate` + `blog-localize` |
| Phase 3–4 | `paraguay-local-seo` references | JSON-LD adapted to `RealEstateAgent`/`RealEstateListing` |
| Phase 5 (hero) | `scroll-world` | Only the ENGINE-WIRING + QA steps if clips are copied from INM; full pipeline only if this site builds the hero first |
| Phase 6 (deploy) | `nextjs-deploy-hostinger` | GitHub→Hostinger Node.js flow on the EU/US account; env vars; PowerShell pitfalls. No DB sections needed |

## 4. Tech stack

- **Next.js (same major as INM scaffold: 16.2.10 / React 19.2.4), App Router, TypeScript, Tailwind v4.** Server components for all SEO surfaces.
- **Own local database on this site** (decision 2026-07-12: separate Hostinger account ⇒ live cross-account fetching on every render is fragile; both sites need to render both locales, not just their default). **Hostinger MySQL + Drizzle**, own account/region, schema mirrors INM's listing table exactly (same field names, so components/types port unchanged) **plus both locale columns synced in** — no live remote joins at request time.
  - Runtime reads are 100% local — fast, independent of INM's account uptime.
  - Guides/blog: MDX files in the repo (`content/guides/*.mdx`) — versioned, no CMS, not synced.
- **No admin CRUD UI here at launch.** INM's admin remains the only place listings are *authored* (Spanish in, English drafted alongside). This site gets:
  - A read-only sync endpoint/script that pulls from INM's export API and upserts into the local DB (§5).
  - `/api/leads` — its own local write, INSERT into local `leads` table, **plus** forward-POST to INM's `/api/leads` (source `'reip'`) so there's still one central inbox for the human. If INM is briefly unreachable, the local write still succeeds — never lose a lead.
- **Auth: none needed** (no admin UI at launch — the sync script runs via a signed cron/webhook, not a login).
- **Images:** shared Cloudinary cloud, same custom `next/image` loader file copied from INM.
- **Maps:** Google Maps lazy iframe on detail pages (lat/lng comes through the synced row).
- **Currency:** synced `price_amount`, `price_currency (GS|USD)` + INM's admin-set FX rates (synced too). Display USD primary (convert GS→USD via rate, label "approx."), optional EUR line via a second admin-set rate. Never invent rates.

## 5. Shared-object + bidirectional translation architecture (the new core)

**Principle: INM's admin is the single authoring surface (source of truth for facts); each site keeps a local, fully-bilingual read replica synced by a pull job — no live cross-account fetch on render, no split-brain writes.**

Both sites render **both** locales (`/en/...` and `/es/...`, or default-locale-at-root + `/es` on this site and default-locale-at-root + `/en` on INM — pick default-at-root to avoid an extra path segment on the money URLs, confirm with user before Phase 3). realestateinparaguay.com defaults to English, inmobiliaria.com.py defaults to Spanish; each still serves the other locale.

### 5a. INM-side additions (implement in the inmobiliaria repo — cross-referenced in INM plan §11)

1. **Table `listing_translations`:** `listing_id (FK), locale ('en' now, 'de' later), title, description, seo_title, seo_description, slug, whatsapp_message, translation_status (machine|reviewed), source_hash, translated_at`. Unique on `(listing_id, locale)`. Spanish itself lives in the base `listings` row (locale implicit `es`), not a translation row.
   - `source_hash` = hash of the Spanish `title+description+seo fields` at translation time → any later Spanish edit makes the translation detectably **stale** (admin badge + API flag `stale: true`; synced replicas keep the old translation rather than nothing).
2. **Translation job:** on listing publish/update in the admin, a server action drafts the EN row via the Claude API (`claude-sonnet-5`; consult the `claude-api` skill before writing this integration — model IDs/params from its reference, not memory). Status `machine`; admin can edit & mark `reviewed`. Amenities, types, operations, cities are **enum keys** — translated by static dictionaries in each frontend, never per-listing.
3. **Export API:** `GET /api/export/listings?locale=en&token=…` → JSON: published listings joined with their `en` translation (fallback: Spanish + `untranslated: true` flag — EN site hides untranslated listings by default), Cloudinary photo IDs, lat/lng, all numeric fields, plus `settings` (FX rates GS→USD, USD→EUR, WhatsApp number, agency NAP). Long random token in env both sides; rotate-able.
4. **Leads write API:** `POST /api/leads` (same token): `{name, email, phone, message, listing_ref, source: 'reip', page}`. INM admin leads inbox gains a source column.
5. **Revalidate ping:** after any listing/translation write, INM fires `POST https://realestateinparaguay.com/api/revalidate?secret=…` (fire-and-forget, non-blocking).

### 5b. This-site consumption (own local DB, pull-sync)

- **Local Drizzle schema** mirrors INM's `listings` table field-for-field, plus `title_es/title_en, description_es/description_en, seo_title_es/en, seo_description_es/en, slug_es/en, whatsapp_message_es/en` (both locales stored so this site can render `/es` as well as its default `/`). Same enums (`operation`, `type`, `segment`, `status`, amenities) as INM.
- **`scripts/sync.ts`** (run on a schedule — Hostinger cron job hitting a signed `/api/sync` route, e.g. every 15 min, plus INM's revalidate ping triggers an immediate on-demand run): calls INM's `GET /api/export/listings?token=…` (returns both `es` base fields + `en` translation rows + settings), **upserts** into the local `listings` table keyed on `ref_code`. Untranslated listings sync with `en` fields falling back to `es` + `untranslated: true` (this site hides those from `/` but still serves them at `/es`).
- `lib/inventory.ts`: reads from the **local DB directly** (Drizzle query, no fetch/cache-tag dance needed — it's already local and fast). Typed `Listing` interface matches INM's schema so components port unchanged.
- `/api/sync` (POST, shared secret): runs `scripts/sync.ts` logic on demand — INM's revalidate ping hits this instead of `revalidateTag`.
- Slugs: `slug_en` for `/` (default locale) routes, `slug_es` for `/es` routes; `ref_code` is the stable cross-locale, cross-site key. `hreflang` between `/` (en) and `/es` on THIS site (they're true translations of each other); no cross-domain hreflang to INM at launch (siblings with different content strategy, not duplicates) — note as post-launch idea.
- **Leads:** `/api/leads` (public, called by this site's own forms) INSERTs into local `leads` table AND best-effort forward-POSTs to INM's `/api/leads` (`source: 'reip'`) for the single human inbox; local insert never blocks on the forward call succeeding.

## 6. Sitemap & SEO architecture (en, international intent)

```
/                                   → scroll-world hero (EN copy) + featured listings + segments + trust/why-Paraguay band
/properties                         → full index + filters (price USD, type, city, bedrooms)
/properties/[slug]                  → listing detail (gallery, amenities, map, WhatsApp + inquiry form)
/apartments-for-sale-asuncion       → curated landing (money keyword)
/houses-for-sale-paraguay           → villas segment landing
/land-for-sale-paraguay             → land/farmland segment landing (strong international demand)
/new-developments                   → projects hub (pre-construction, gated communities)
/new-developments/[slug]            → project detail
/guides                             → content hub (pillar index)
/guides/[slug]                      → MDX guide pages
/why-paraguay                       → investment-case page (tax, residency, cost of living, growth — sourced stats only)
/about                              → agency trust page (same NAP as INM, bilingual team angle)
/contact                            → form + WhatsApp + email + map
/es/...                             → Spanish mirror of the above (locale prefix), hreflang en/es reciprocal
robots.txt · sitemap.xml (listings from local DB + static + guides, both locales) · OG images per listing
```

- **Keyword universe:** "real estate in Paraguay" (the domain IS the head term), "buy property in Paraguay", "Paraguay real estate for foreigners", "houses for sale in Paraguay", "land/farmland for sale in Paraguay", "Asuncion apartments for sale", "Paraguay property investment", "can foreigners buy property in Paraguay" (question → guide + FAQ schema), "Paraguay residency by investment/real estate".
- **Content hub is the ranking engine** (guides cluster via `blog-cluster`): pillar "Buying Property in Paraguay: Complete Guide for Foreigners (2026)" + spokes: buying process step-by-step, residency 2026 rules, property taxes, financing/cash reality, Asunción neighborhood guide, land/farmland guide, en-pozo/pre-construction guide, common scams & due diligence. **Anti-fabrication rule from `nextjs-national-lead-gen` applies hard:** every legal/tax/residency claim needs a current source or `[VERIFY]` placeholder — residency rules changed recently; the writing model must WebSearch, not recall.
- **Titles:** `{Type} for Sale in {Place} | Real Estate in Paraguay` (≤60). Metas with international CTA ("Talk to our bilingual team on WhatsApp").
- **JSON-LD:** `RealEstateAgent` site-wide (PY address, `areaServed: Paraguay`, `availableLanguage: [en, es, de]`), `RealEstateListing`+`Offer` (USD) per listing, `BreadcrumbList`, `FAQPage` on guides/hubs, `Article` on guides, `WebSite`+`SearchAction` on home.
- **Hero SEO:** `data-sw-seo` server-rendered block mandatory (h1 = "Real Estate in Paraguay — Property for Sale to International Buyers", one h2+p per scene, real links). Never skip.
- Locale plumbing: `lang="en"`, all UI strings in `lib/dictionary.ts` keyed by locale from day one → `/de` phase 2 is routing + dictionary + `listing_translations` locale='de' + `blog-translate`/`blog-localize` on guides, no refactor.

## 7. Brand, design & hero

- **Default: reuse the INM winning kit** (palette tokens, Fraunces/Playfair + Inter proposal, style preamble) — one agency, two storefronts. Wordmark "Real Estate in Paraguay" in the same type treatment.
- Design patterns: same premium restraint (split-screen cards, editorial headings, scroll reveals) **plus** a guide-hub layout borrowed from the `nextjs-national-lead-gen` content-brand patterns.
- **Hero = INM plan §6 verbatim** (5 scenes, architecture A, seedance_2_0, anchor gate on scene 3, mobile encodes, SSIM ≥0.90), with only these deltas:
  - Copy beats in English: 1 "Asunción from above / Your property in Paraguay starts here" · 2 "The finest neighborhoods" · 3 "Exclusive villas and vast land" · 4 "New projects in nature" · 5 "Find your property in Paraguay" + WhatsApp CTA + "Browse properties".
  - **If INM already generated its hero: copy `public/scroll-world/` wholesale — zero generations.** If this site goes first, run the full scroll-world pipeline here and INM copies from us. Either way the clips are generated exactly once.

## 8. Build phases

| Phase | Delivers | Who / blocker |
|---|---|---|
| **0. Scaffold** | Clone INM scaffold shape (Next 16.2.10/React 19.2.4/Tailwind v4), git init, `lib/dictionary.ts` skeleton, Drizzle schema mirroring INM + bilingual columns | Autonomous — **done 2026-07-12** |
| **1. Brand kit** | Copy INM tokens once user has picked (INM plan §5); wordmark variant | Blocks on user's Claude Design pick (shared with INM) |
| **2. Content hub** | `blog-cluster` plan → pillar + 6–8 spoke guides as MDX, `[VERIFY]`-gated facts, /why-paraguay | Autonomous (WebSearch required); can start immediately |
| **3. Data layer** | hPanel MySQL DB on the EU/US account, Remote MySQL whitelist, `scripts/sync.ts` + `/api/sync`, seed placeholder listings | User (hPanel clicks + IP) + autonomous |
| **4. Listing platform** | `lib/inventory.ts` (local DB reads), /properties + filters, detail pages, curated landings, /new-developments, `/es` locale routes | **Blocks on INM export API deployed (§5a)** for real data; can build against seed data first |
| **5. Conversion layer** | `/api/leads` (local insert + forward to INM), email notify, WhatsApp prefill EN, /contact, /about | Blocks on INM leads API for the forward-to-admin half; local capture works standalone |
| **6. Hero** | Copy clips from INM (or generate here if first) → EN copy overlays → engine wired → Step-8 QA | Blocks on hero existing somewhere + user approval gates |
| **7. SEO layer** | Metadata, JSON-LD, dynamic sitemap (DB + static), OG images, data-sw-seo, hreflang en/es | Autonomous |
| **8. Deploy** | §9 | User (hPanel on EU/US account), guided |
| **9. QA + launch** | scroll-world Step-8 QA, Lighthouse mobile ≥90, cross-site smoke test (INM edit → sync → this site updates within 15 min or on-demand ping), lead round-trip test | Mixed |

**INM-side prerequisite work (goes in the INM repo, tracked here):** `listing_translations` table, translation server action, export API, leads API + source column, sync-trigger ping. Estimate: one focused session on top of INM Phase 4.

## 9. Deployment (per `nextjs-deploy-hostinger`)

1. Private repo `antonmarklundcom/realestateinparaguay`, branch `main`.
2. hPanel on the **Europe/US account** → Node.js Apps → Import Git Repository. Verify Next.js preset, `npm run build`/`npm start`. Record slot count on that account.
3. Create MySQL DB in hPanel on this account (INM plan §3/§9 has the verified procedure — Remote MySQL whitelist, `localhost` for live `DATABASE_URL`, IP-whitelisted `srv####.hstgr.io` for local dev).
4. Env vars (raw values only): `DATABASE_URL`, `SYNC_SOURCE_API_URL`, `SYNC_SOURCE_API_TOKEN`, `SYNC_SECRET` (protects `/api/sync`), `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_WHATSAPP_NUMBER`, `CLOUDINARY_CLOUD_NAME`, `LEADS_FORWARD_URL`, `LEADS_FORWARD_TOKEN`, email-notify creds (`RESEND_API_KEY` or SMTP).
5. DB init from local machine (never Hostinger SSH): `npx drizzle-kit migrate`, then seed. Same `.env` / PowerShell caveats as INM plan §9 step 5.
6. Deploy → temp URL check → map **realestateinparaguay.com** (registrar DNS → Hostinger) → SSL → update `NEXT_PUBLIC_SITE_URL` → **redeploy**.
7. Post-deploy: run `/api/sync` once manually and confirm listings populate; test lead lands locally + forwards to INM admin + email; robots/sitemap; WhatsApp prefill.
8. Set up the sync cron (Hostinger scheduled task or external cron hitting `/api/sync` with the secret) at ~15 min interval.
9. Region choice EU vs US: pick the one with a free slot — the two DBs being independent means region no longer affects render latency, only sync-job latency (cache-miss-only cost).

## 10. Open items needing the user

1. Confirm the **no-database / API-fed** architecture (§4) — or ask for the local-mirror fallback.
2. Confirm EN-only launch with DE as phase 2.
3. Same brand kit as INM, or a separate Claude Design round?
4. Which Hostinger account exactly (EU or US) + slot availability.
5. Email address for lead notifications; Resend account or SMTP creds.
6. Agency NAP/WhatsApp (same as INM open item — one answer serves both).
7. Later: review machine translations in the INM admin before marking `reviewed`.
