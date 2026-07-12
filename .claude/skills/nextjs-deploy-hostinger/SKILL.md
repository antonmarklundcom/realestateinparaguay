---
name: nextjs-deploy-hostinger
description: Battle-tested playbook for deploying Next.js/Node.js apps to Hostinger's managed Node.js hosting with GitHub integration, including both Neon.tech PostgreSQL + Prisma setups and Hostinger's own MySQL + Drizzle setups. Use this skill EVERY time you deploy, debug, or plan hosting for any Next.js or Node.js app on Hostinger — triggers include "deploy", "hostinger", "the site won't build", "Application error" / Digest crash pages, database connection errors (ECONNREFUSED, Access denied, ERR_INVALID_URL), Prisma or Drizzle errors, Remote MySQL setup, env var setup, subdomain mapping, or choosing which Hostinger account/slot a new app goes to. Contains verified fixes for Hostinger's broken IPv6 routing to Neon, the SSH npm PATH problem, Windows PowerShell pitfalls, Remote MySQL IP whitelisting, tsx not auto-loading .env, and the "changed the DB password but forgot to update the live app's env var" crash.
---

# Next.js Deploy → Hostinger (with Neon + Prisma)

Playbook distilled from real deployments (FacturaPY/contabilidad, embarazo.com.py). These fixes were discovered the hard way — trust them before re-debugging.

## 0. Infrastructure map

- 3 Hostinger accounts (LATAM / Europe / USA), **10 Node.js sites per account = 30 slots total**. Slots are scarce: dynamic apps (DB, search, listings) get slots; static/content sites go to static export on Cloudflare Pages (free, no slot); single-service lead funnels go to GHL. Redirect-only domains use 301s, never a slot.
- Default DB: **Neon.tech** free tier PostgreSQL + Prisma.
- Repos on GitHub under `antonmarklundcom/*`, usually private (fine — Hostinger's GitHub authorization grants read access).

## 1. Standard deploy flow (managed GitHub integration — no SSH/PM2/Nginx)

1. Ensure the code is on the production branch. If work sits on a `claude/...` PR branch, merge PR → `main` first (or point Hostinger at the branch, but `main` is cleaner).
2. hPanel → **Websites → Add Website → Node.js Apps** → **Import Git Repository** → authorize GitHub → select repo + branch.
3. Verify auto-detected settings: framework Next.js, build `npm run build`, start `npm start`.
4. Add ALL environment variables in hPanel (never commit secrets). Typical set for a Prisma+NextAuth app: `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL` (the real deployed URL, e.g. `https://xxx.hostingersite.com` until custom domain is mapped), `ENCRYPTION_KEY`, `CRON_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, app-specific flags.
5. Deploy. Map the custom domain/subdomain afterwards:
   - DNS at Hostinger → map domain inside the app's settings, SSL auto.
   - DNS elsewhere (NIC.py etc.) → A record (or CNAME) for the host pointing at the target Hostinger provides.
6. Update `NEXTAUTH_URL` (and any absolute-URL env vars) after custom domain mapping, then redeploy.

## 2. Database init (Prisma + Neon) — DO THIS LOCALLY, NOT VIA HOSTINGER SSH

**Critical learned fact:** Hostinger's shared servers have **broken IPv6 routing to Neon's Postgres endpoints**. Raw TCP over IPv4 works, but Prisma's query engine resolves IPv6 and fails every time. Pooler endpoints, `NODE_OPTIONS`, IP-override in the connection string, and `HOSTALIASES` were all tried — none reliably fixed the SSH-shell case.

**The working procedure:** run one-time DB commands (`npx prisma db push`, seed scripts) from a local machine (IPv4 to Neon works fine locally):

```
npx prisma db push
npx prisma db seed   # or: node prisma/seed.mjs
```

Note: the deployed app's runtime DB connection is a separate network path from the SSH shell — verify the live app before assuming it shares the IPv6 problem.

## 3. Hostinger SSH quirks (if you must SSH)

- `npm`/`npx` are NOT on the default PATH. Activate Node manually:
  `export PATH=/opt/alt/alt-nodejs22/root/usr/bin:$PATH` (adjust version dir to what exists under `/opt/alt/`).
- The deployed Prisma output may lack `schema.prisma`; the full source lives at `public_html/.builds/last-source/` — point Prisma there with `--schema` if needed.

## 4. Windows PowerShell pitfalls (local machine)

- npm/npx blocked by execution policy → fix once:
  `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned`
- **Never create `.env` files with `>` redirect** — PowerShell writes UTF-16 and Prisma's dotenv parser silently fails. Use:
  `Set-Content -Path .env -Value 'DATABASE_URL=...' -Encoding utf8`
- Pasting multi-line commands merges them. Give the user **one command per message**, wait for output, then the next. (Anton has explicitly requested this working style.)

## 5. Post-deploy checklist

- [ ] App loads on the Hostinger URL; then on the custom domain with valid SSL
- [ ] `NEXTAUTH_URL` / absolute-URL env vars match the final domain
- [ ] Login works with the REAL admin credentials (seed defaults like `admin@example.com` / `change-me` must be rotated immediately — use an update script against the DB, confirm `{ count: 1 }`)
- [ ] DB writes work from the live app (create one test record)
- [ ] robots.txt / sitemap reachable (seo-web-builds checklist)
- [ ] Slot recorded: which account (LATAM/EU/USA) and slot count remaining

## 6a. Database init (Drizzle + MySQL, Hostinger's own MySQL — not Neon)

For apps using Hostinger's built-in MySQL (`drizzle-orm/mysql2`) instead of Neon/Prisma, the local-machine approach still applies, but the specifics differ:

**Enable remote access first:**
1. hPanel → Databases → **Remote MySQL** → add your current public IP (get it via `(Invoke-WebRequest -uri "https://api.ipify.org" -UseBasicParsing).Content` in PowerShell). Home ISPs often rotate IPs after a router restart — if you get `Access denied for user '...'@'<new-ip>'`, your IP changed; re-check and re-add it.
2. Hostinger's own MySQL host/port for remote connections is shown on that same Remote MySQL page (e.g. `srv1724.hstgr.io` / `193.203.175.171`, port 3306) — this is **different** from the DB's internal `localhost` address used by the live app.
3. **`drizzle-kit migrate` connecting successfully does NOT mean your seed/import scripts will** — `drizzle-kit` auto-loads `.env`, but plain `tsx` scripts do not. If a seed script throws `ECONNREFUSED` right after a successful migration, the script's `process.env.DATABASE_URL` is almost certainly undefined and mysql2 is silently falling back to `localhost`. Fix: set the var for the shell session before running scripts:
   ```
   $env:DATABASE_URL = "mysql://user:pass@host:3306/dbname"
   npx tsx scripts/seed-whatever.ts
   ```
   (stays set for the rest of that PowerShell window — no need to repeat per command)
4. If the hostname (`srv####.hstgr.io`) still gives `ECONNREFUSED` after credentials are confirmed correct (verify via phpMyAdmin login, which bypasses remote-host checks), try the raw IP instead in `DATABASE_URL` — DNS/IPv6 resolution flakiness on Hostinger is a recurring theme (see Neon note above), not unique to Postgres.

**Critical gotcha — changing the DB password breaks the LIVE app silently:**
The deployed app already has its own `DATABASE_URL` set in hPanel env vars, using `localhost` (or `127.0.0.1`) and whatever password existed when the app was first provisioned. If you change the MySQL user's password to enable local/remote dev access, **the live app's stored env var now has a stale password** and the site will crash with a generic "Application error" / `Digest: ...` page — no useful info on the error page itself.
- Always check hPanel → Environment Variables for the EXISTING `DATABASE_URL` **before** changing the DB password, so you can update both to match.
- After changing the password, update the live env var too, then **redeploy** (env var changes require a redeploy to take effect — restarting isn't enough).
- Runtime logs (hPanel → Runtime Logs) show the failing query but often NOT the underlying MySQL error code/cause — don't waste time trying to expand/click log lines expecting more detail; go straight to checking credentials + redeploy instead.
- For the live app's `DATABASE_URL` specifically, try `localhost` first (typically already correct/what was provisioned); only try `127.0.0.1` as a second guess for genuine host-resolution errors — don't cycle through hosts before confirming the password matches what's actually deployed.
- Common mistake when pasting into hPanel's env var UI: some forms take Key and Value as separate fields, but the whole `KEY=value` string can get pasted into the Value field by accident, producing `input: 'DATABASE_URL=mysql://...'` in build errors (`ERR_INVALID_URL`). If you see the var name duplicated inside the error's `input`, that's the cause — fix by putting ONLY the raw value in the Value field.

**Windows-specific for MySQL/Drizzle scripts:**
- `node --env-file=.env node_modules/.bin/tsx ...` fails on Windows (`.bin/tsx` is a bash shim, not a Windows binary) — use `$env:DATABASE_URL = "..."` then plain `npx tsx script.ts` instead.

## 6. When NOT to use a Hostinger slot

- Marketing/content site with no server logic → `next export` static → Cloudflare Pages (free).
- Single-service WhatsApp funnel → GHL AI Studio.
- Duplicate/parked domain → 301 redirect at DNS/hosting level.
- Vercel free tier is NOT an option for these projects (Hobby tier prohibits commercial use).
- Migrate to a Hostinger VPS only when multiple live dynamic apps create real resource contention — don't let infra decisions delay shipping.
