---
name: nextjs-national-lead-gen
description: Structure, SEO architecture, and modern design pattern menu for bespoke national-brand or SaaS-style lead-gen sites built as custom Next.js apps (via Claude Code) — e.g. byggmedia.se, aireceptionister.se. Use this skill EVERY time the user is planning or building a national (not hyper-local) brand site, a SaaS/product marketing site, or a content/media brand site in Next.js — even though the FINAL visual design is bespoke per brand, not a fixed template. This skill supplies the reusable page architecture, SEO/content strategy, conversion patterns, and a menu of current (2026) web design layout patterns (bento grids, split heroes, etc.) to choose from — it does not prescribe one fixed look. Pairs with seo-web-builds (nextjs.md) for technical SEO and nextjs-deploy-hostinger for deployment. Distinct from sweden-site-factory / paraguay-site-factory, which are for single-location local businesses on GHL, and from the two ecom-design skills, which are for stores with cart/checkout.
---

# National / SaaS Lead-Gen Sites (Next.js, bespoke design)

Purpose: give every national-brand or SaaS-marketing build a shared, tested foundation — page architecture, SEO/content strategy, conversion mechanics, performance baseline — while leaving the actual visual identity fully bespoke per brand. Nothing in this skill is a fixed color palette or font pairing; §4 is a **menu of layout patterns to choose from and combine**, not a template to apply unchanged.

## 0. When this skill applies

- A national brand, not a single physical location — no city/ort in the core value prop.
- A SaaS product, an information/media brand, or a lead-gen funnel for a scalable service (e.g. "AI receptionist for trades," a construction-industry media/resource site).
- Built as a custom Next.js app via Claude Code — not GHL AI Studio (GHL can't do the flexibility these sites usually need: custom components, real product screenshots/demos, blog/CMS depth).
- If it's a single-location business (elektriker i Göteborg, jurist i Malmö) → use `sweden-site-factory` / `paraguay-site-factory` instead. If it sells physical products with checkout → use the `ecom-design-*` skills instead.

## 1. Two site archetypes (pick one, they architect differently)

### A — SaaS / product marketing site
Goal: get a demo booked, a trial started, or a call made. Examples: an AI receptionist product, a booking-software product.
Core conversion path: hero → problem/solution → product demo (screenshot/video placeholder — note: do not generate actual images unless asked; describe the intended visual in the copy and let the person supply or later generate the real asset) → pricing → social proof → final CTA.

### B — Media / content / resource brand
Goal: build topical authority and funnel readers toward a product, service directory, or lead form. Examples: an industry news/resource hub (byggmedia-style) that monetizes via ads, leads, or a companion product.
Core conversion path: content hub → article → related content + one soft conversion point per article (newsletter, lead magnet, or link to the companion product) — never interrupt editorial content with aggressive CTAs; trust is the asset being built.

A single brand can blend both (a SaaS product with a content hub feeding it) — decide which one is PRIMARY and build the other as a secondary section, same principle as the family/hero-decides rule in the local factories.

## 2. Page architecture

**Archetype A (SaaS):**
```
/                    → hero, problem, product overview, social proof, pricing teaser, CTA
/produkt or /features → deeper product walkthrough, use cases
/priser              → pricing tiers (Swedish B2B: pricing transparency is expected — show real tiers, not "kontakta oss")
/kunder or /cases    → customer stories (real only — anti-fabrication rules apply here too)
/resurser or /blogg  → content hub feeding SEO + nurturing
/demo or /boka-demo  → the conversion page — calendar booking or a qualifying form
/om-oss, /kontakt
/integritetspolicy, /villkor
```

**Archetype B (Media/content):**
```
/                    → featured/latest content, topical navigation, brand positioning
/[kategori]/         → topic hub — this IS a real SEO surface, treat like a category page
/[kategori]/[slug]   → article — one primary keyword/intent per article, internal links to related + hub
/om-oss              → editorial credibility (who writes this, why trust it)
/annonsera or /samarbeta → if ad/partnership-monetized
/nyhetsbrev          → newsletter capture, the primary soft-conversion mechanic
```

## 3. SEO & content strategy (no full programmatic SEO needed at this scale — but structure it right)

- One page = one primary intent, same rule as the local factories (`seo-web-builds` §0.2). Even without hundreds of programmatic pages, cannibalization between a feature page and a blog post targeting the same keyword is the most common self-inflicted mistake on these builds.
- **Comparison/alternative pages** ("X vs Y", "bästa alternativet till X") are the highest-ROI content type for a SaaS site with real competitors — write them honestly, never disparage by name without factual backing.
- **Resource/glossary pages** for a media brand build topical authority faster than one-off articles — cluster them under a real taxonomy (`/[kategori]/`), not a flat blog list.
- Technical SEO (sitemap, schema, Core Web Vitals, canonical strategy) — defer entirely to `seo-web-builds/references/nextjs.md` and `schema-templates.md`, do not duplicate here. Relevant schema types for this category: `Organization` + `SoftwareApplication`/`Product` (SaaS), `Article` + `Person` (media), `FAQPage` where genuinely present.
- Swedish-market content rules (du-form, no anglicisms in headings, compound words closed, pricing transparency expectation) — same as `sweden-site-factory` §II, apply them here too even outside the local-factory context.

## 4. Modern design pattern menu (2026) — choose and combine, don't apply as a fixed template

Since the visual identity is bespoke per brand, this is a menu of current layout/interaction patterns worth considering, not a prescribed system. Pick 2–4 that fit the brand's positioning; resist using all of them on one site.

- **Bento grid** — asymmetric card grid for features/services/portfolio. Works well for SaaS feature overviews and "what we do" sections. Mobile-first rule still applies: define single-column mobile order first, then compose the grid.
- **Split-screen hero** — text one side, product screenshot/mockup or abstract visual the other. Strong default for SaaS.
- **Marquee/logo wall** — scrolling or static row of real client/partner logos (only if real — never fabricated logos).
- **Big-type editorial** — large serif or display type carrying the message with minimal chrome; fits media/thought-leadership brands better than SaaS.
- **Glassmorphism / soft-depth cards** — translucent layered cards with blur; use sparingly, it dates quickly and hurts contrast if overused.
- **Scroll-triggered stat reveals / count-ups** — only with real numbers (from real usage data, not invented).
- **Dark-mode-first SaaS aesthetic** — near-black backgrounds, one saturated accent, monospace for technical/code-adjacent products; strong fit for a technical/AI-product brand.
- **Interactive product demo embed** — an actual working mini-demo or looping product walkthrough beats a static screenshot for SaaS conversion; worth the extra build effort on the primary conversion page.
- **Timeline/roadmap layout** — for content hubs presenting industry news chronologically, or a SaaS changelog page.
- Reuse `conversion-design`'s type/spacing scale (8px grid, 1.25 type ratio) and anti-fluff list (§0–1 there) as the performance/restraint baseline regardless of which patterns above are chosen — the patterns above are visual direction, the restraint rules are non-negotiable underneath any direction.

## 5. Conversion mechanics

- **SaaS:** the demo-booking or trial-start CTA repeats after every major section, same discipline as the local factories' primary-CTA repetition rule. Pricing page shows real tiers when the operator can commit (Swedish B2B audience expects this) — "kontakta oss för pris" is a worse default here than in a local-service context, not better.
- **Media/content:** the newsletter/lead-magnet CTA is soft and single, placed at natural pauses (end of article, mid-scroll on longer pieces) — never a popup that blocks reading on entry.
- **Anti-fabrication applies identically:** no fake customer logos, no invented user counts, no manufactured urgency. A national/SaaS brand's credibility is more scrutinized than a local business's, not less.

## 6. Workflow

1. Establish archetype (A/B/blend) and confirm with the operator if ambiguous.
2. Draft the page architecture from §2, adapted to the specific brand.
3. Propose 2–4 design patterns from §4 with a one-line rationale each ("bento grid for the feature overview because the product has 6 distinct capabilities that don't need deep explanation").
4. Hand off to `ecom-design-sweden`/`ecom-design-paraguay`'s two-part output pattern if useful: a text design-token spec, then a Claude Design prompt (goal/layout/content/audience) referencing it — same mechanic, applied to this site type.
5. SEO structure and technical schema: apply `seo-web-builds` in full.
6. Build in Next.js via Claude Code; deployment via `nextjs-deploy-hostinger` if hosted there.

## 7. Pre-ship checklist

- [ ] Archetype (SaaS / media / blend) explicitly chosen, page architecture matches it
- [ ] One primary intent per page — no keyword cannibalization between features/blog
- [ ] Real pricing shown where the operator can commit to it (SaaS)
- [ ] Zero fabricated logos, testimonials, user counts, or stats
- [ ] 2–4 design patterns chosen deliberately from §4, not all of them at once
- [ ] `conversion-design` restraint rules (anti-fluff, one accent, mobile-first) applied underneath whatever visual direction was chosen
- [ ] `seo-web-builds` technical checklist completed (schema, sitemap, canonical, CWV)
- [ ] Du-form Swedish / natural target-market language, no anglicisms in headings, compound words closed
