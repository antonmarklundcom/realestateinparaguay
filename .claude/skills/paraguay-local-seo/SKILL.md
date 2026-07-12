---
name: paraguay-local-seo
description: Build SEO-optimized websites and landing pages for local businesses in Paraguay (dentists, carpenters, plumbers, mechanics, salons, clinics, lawyers, restaurants, etc.). Use this skill whenever the user asks for a website, landing page, or web presence for a Paraguayan business, mentions local SEO in Paraguay, mentions cities like Asunción, Ciudad del Este, Encarnación, San Lorenzo, Luque, Lambaré, Fernando de la Mora, or asks how a local Paraguayan business can rank on Google or get more clients online — even if they don't say "SEO" explicitly.
---

# Paraguay Local SEO Website Builder

Build complete, production-ready websites for local service businesses in Paraguay that are engineered to rank in local Google search ("dentista en Asunción", "carpintero cerca de mí") and to convert visitors into WhatsApp contacts — the dominant conversion channel in Paraguay.

## Step 0: Gather the business facts

Before writing any code, collect (or ask for) these. Never invent real-looking data; use clearly marked placeholders like `[TELÉFONO]` if unknown:

1. Business name, trade (dentista, carpintero, plomero, electricista...)
2. City + neighborhood (barrio) — critical for local keywords
3. Phone in Paraguayan format: +595 9XX XXX XXX (mobile) — this is also the WhatsApp number in almost all cases
4. Services offered (each becomes a page or section)
5. Service area: single city, Gran Asunción, or department-wide
6. Opening hours, address, social links (Facebook and Instagram matter most in PY)
7. Whether they have a Google Business Profile (Perfil de Negocio de Google)

If the user provides only "a dentist in Asunción", proceed with sensible placeholders and tell them exactly what to replace.

## Step 1: Language strategy

- **Primary language: Spanish (Paraguayan variant).** All content, URLs, meta tags in Spanish. `<html lang="es-PY">`.
- Use local vocabulary: "presupuesto sin compromiso" (free quote), "agendá tu cita" (voseo — Paraguay uses vos, not tú), "atención de urgencias", "trabajos garantizados".
- **Voseo is mandatory in CTAs**: "Escribinos", "Llamanos", "Contactanos", "Agendá", "Consultá" — not "Escríbenos"/"Llámanos". This is how Paraguayans actually speak and it builds instant trust.
- **Guaraní**: optionally sprinkle a warm touch ("¡Tereg̃uahẽporãite!" or a tagline) for personality, but keep all SEO content in Spanish — search volume is in Spanish.
- Never write content in English unless the business explicitly targets expats.

## Step 2: Keyword and page architecture

Paraguayan local search follows the pattern **[servicio] + [ciudad/barrio]** or **[servicio] + "cerca de mí"**. Build the site around this:

```
/                       → [Oficio] en [Ciudad] | [Nombre del negocio]
/servicios/[servicio]/  → one page per major service (e.g. /servicios/implantes-dentales/)
/zonas/[ciudad]/        → one page per city served, ONLY if genuinely served
/contacto/              → NAP + map + WhatsApp + form
/sobre-nosotros/        → trust page (photos, credentials, years of experience)
```

Rules:
- H1 on homepage = "{Oficio} en {Ciudad}" or close variant ("Dentista en Asunción – Clínica Sonrisa").
- Each service page targets ONE service keyword + city ("Colocación de pisos de madera en Luque").
- Do NOT create thin doorway pages for cities the business doesn't serve — Google penalizes this and it wastes the user's crawl budget. 3–6 genuine zone pages max for Gran Asunción businesses (e.g. Asunción, San Lorenzo, Luque, Lambaré, Fernando de la Mora, Capiatá).
- Title tags ≤ 60 chars, pattern: `{Servicio} en {Ciudad} | {Negocio}`. Meta descriptions ≤ 155 chars, include phone or "Presupuesto gratis" and a voseo CTA.
- Read `references/keywords-paraguay.md` for per-trade keyword lists and city data before writing content.

## Step 3: WhatsApp-first conversion design

In Paraguay, WhatsApp is the conversion event — not email forms. Requirements:

- **Floating WhatsApp button** on every page (bottom-right, official green #25D366, `aria-label="Escribinos por WhatsApp"`).
- Link format: `https://wa.me/595XXXXXXXXX?text=Hola%2C%20vi%20su%20p%C3%A1gina%20web%20y%20quiero%20consultar%20por%20[servicio]` — prefill the message with the page's service so the business knows which page converted.
- Primary CTA button in the hero: WhatsApp. Secondary: `tel:+595...` click-to-call.
- Contact forms are optional/secondary; if included, keep them to 3 fields max (nombre, teléfono, mensaje).
- Show the phone number as visible text too (many users copy it into WhatsApp manually).

## Step 4: Technical SEO implementation

Build as a single static HTML file per page (or one file with sections for simple one-pagers) unless the user wants a framework. Every page must include:

1. **LocalBusiness JSON-LD** — use the most specific type: `Dentist`, `Plumber`, `Electrician`, `HousePainter`, `GeneralContractor` (carpinteros), `HairSalon`, `AutoRepair`, `Attorney`, `Physician`, `Restaurant`. Include: name, telephone (+595 format), address with `addressCountry: "PY"`, `addressRegion` (departamento), geo coordinates, openingHoursSpecification, priceRange (use "₲₲" style or "$$"), sameAs (Facebook/Instagram), and `areaServed`. Add `Service` schema on service pages and `FAQPage` schema when an FAQ section exists.
2. **Mobile-first, lightweight**: most Paraguayan traffic is Android phones on prepaid Tigo/Personal/Claro data. Budget: page ≤ 500 KB total, no heavy JS frameworks, system font stack or one Google Font max, lazy-load all images below the fold, compress images (WebP), inline critical CSS. Target Lighthouse mobile performance ≥ 90.
3. **Meta essentials**: canonical URL, `og:` tags with a real image, viewport, `lang="es-PY"`, favicon.
4. Semantic HTML (header/nav/main/section/footer), one H1 per page, descriptive alt text in Spanish ("Carpintero instalando mueble de cocina a medida en Asunción").
5. Generate `sitemap.xml` and `robots.txt` when building multi-page sites.
6. Embed a Google Maps iframe on the contact page/section (lazy-loaded).

## Step 5: Content that ranks and converts

Structure for the homepage (adapt per trade):

```
Hero: H1 + subheadline with differentiator + WhatsApp CTA + phone
Servicios: cards linking to service pages (or anchor sections)
Por qué elegirnos: 3-4 trust points (años de experiencia, garantía, presupuesto gratis, urgencias 24hs)
Trabajos realizados / Antes y después: photo gallery (huge for carpinteros, pintores)
Testimonios: 3+ with full first names + barrio ("María G., Villa Morra")
Zonas de cobertura: cities/barrios served, with internal links to zone pages
FAQ: 4-6 real questions ("¿Cuánto cuesta...?", "¿Atienden urgencias?", "¿Aceptan tarjeta?") — mark up with FAQPage schema
Footer: NAP (name-address-phone) identical across all pages, hours, social links
```

Content rules:
- Write 400–800 words of genuinely useful text per page — not keyword-stuffed filler. Mention the city and 2–3 barrios naturally.
- Prices in guaraníes (₲) when the user provides them; otherwise "Presupuesto sin costo".
- Mention payment methods Paraguayans ask about: efectivo, transferencia, tarjeta, and QR/billeteras (Tigo Money, Billetera Personal, Zimple) if applicable.
- For health professions (dentistas, médicos): include registration number placeholder ("Reg. Prof. N° [XXXX]") — it's a legal expectation and a trust signal. Never fabricate credentials or reviews presented as real; use placeholders and tell the user to supply genuine ones.

## Step 6: Beyond the website — deliver the local SEO checklist

A site alone won't rank for "cerca de mí" searches. After building, ALWAYS hand the user the off-site checklist from `references/gbp-checklist.md` (Google Business Profile setup, categories in Spanish, review strategy, local citations for Paraguay). Summarize the top 5 actions in your response.

## Design defaults

- Clean, trustworthy, professional — not flashy. Local businesses win on trust.
- Color: derive from trade (dentist → clean blues/whites; carpintero → warm wood tones/amber; plomero → blue/orange). One accent color + neutrals.
- Real-feeling but honest: use placeholder image comments (`<!-- Reemplazar con foto real del taller -->`) rather than stocky fake photos when possible; if using placeholders, prefer neutral ones and tell the user real photos of their work/team significantly improve conversion and GBP performance.
- Buttons big enough for thumbs (min 48px), sticky mobile header with call button.

## Output format

1. Complete website file(s) saved to outputs and presented to the user.
2. A short deployment note: recommend a `.com.py` domain (registered via NIC.py) or `.com`, and free/cheap hosting options (Cloudflare Pages, Netlify, or local hosting providers).
3. The top-5 off-site SEO actions summary.
4. A clearly marked list of every placeholder the user must replace.

## Reference files

- `references/keywords-paraguay.md` — read when choosing keywords: per-trade keyword patterns, search modifiers, and city/barrio lists for Paraguay.
- `references/gbp-checklist.md` — read after building the site: Google Business Profile setup, review generation, and Paraguayan citation sources.
