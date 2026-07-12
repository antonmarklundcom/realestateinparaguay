/**
 * Pull-sync from inmobiliaria.com.py's export API into the local `listings`
 * table. Run on a schedule (Hostinger cron hitting POST /api/sync) and
 * on-demand (INM pings /api/sync after a listing/translation write).
 *
 * INM's export API does not exist yet (blocked on inmobiliaria-com-py/PLAN.md
 * §10 / §5a of this repo's PLAN.md). This script is written against the
 * documented shape so it's ready the moment that API ships — run it once
 * manually to confirm the contract before wiring the cron.
 */
import { db } from "../lib/db";
import { listings } from "../lib/db/schema";
import { sql } from "drizzle-orm";

type ExportedListing = {
  ref_code: string;
  slug_en: string;
  slug_es: string;
  title_en: string;
  title_es: string;
  description_en: string;
  description_es: string;
  operation: "venta" | "alquiler";
  type: "departamento" | "casa" | "terreno" | "oficina" | "local";
  segment: "premium_highrise" | "villa_land" | "nature_project";
  city: string;
  barrio: string | null;
  price_amount: string | null;
  price_currency: "GS" | "USD";
  price_on_request: boolean;
  bedrooms: number | null;
  bathrooms: number | null;
  area_total_m2: string | null;
  area_built_m2: string | null;
  parking: number | null;
  photos: string[];
  amenities: string[];
  video_url: string | null;
  lat: string | null;
  lng: string | null;
  masterplan_assets: string[] | null;
  unit_types: unknown;
  delivery_date: string | null;
  financing_text: string | null;
  is_en_pozo: boolean;
  status: "disponible" | "reservado" | "vendido" | "alquilado";
  expensas_gs: string | null;
  year_built: number | null;
  floor: number | null;
  total_floors: number | null;
  balcony_m2: string | null;
  orientation: string | null;
  seo_title_en: string | null;
  seo_title_es: string | null;
  seo_description_en: string | null;
  seo_description_es: string | null;
  whatsapp_message_en: string | null;
  whatsapp_message_es: string | null;
  featured: boolean;
  display_order: number;
  published: boolean;
  untranslated: boolean;
};

async function fetchExport(): Promise<ExportedListing[]> {
  const url = process.env.SYNC_SOURCE_API_URL;
  const token = process.env.SYNC_SOURCE_API_TOKEN;
  if (!url || !token) {
    throw new Error("SYNC_SOURCE_API_URL / SYNC_SOURCE_API_TOKEN not set");
  }
  const res = await fetch(`${url}?locale=en`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new Error(`Export API returned ${res.status}: ${await res.text()}`);
  }
  const body = await res.json();
  return body.listings as ExportedListing[];
}

async function upsert(row: ExportedListing) {
  const values = {
    refCode: row.ref_code,
    slugEn: row.slug_en,
    slugEs: row.slug_es,
    titleEn: row.title_en,
    titleEs: row.title_es,
    descriptionEn: row.description_en,
    descriptionEs: row.description_es,
    operation: row.operation,
    type: row.type,
    segment: row.segment,
    city: row.city,
    barrio: row.barrio,
    priceAmount: row.price_amount,
    priceCurrency: row.price_currency,
    priceOnRequest: row.price_on_request,
    bedrooms: row.bedrooms,
    bathrooms: row.bathrooms,
    areaTotalM2: row.area_total_m2,
    areaBuiltM2: row.area_built_m2,
    parking: row.parking,
    photos: row.photos,
    amenities: row.amenities,
    videoUrl: row.video_url,
    lat: row.lat,
    lng: row.lng,
    masterplanAssets: row.masterplan_assets,
    unitTypes: row.unit_types,
    deliveryDate: row.delivery_date,
    financingText: row.financing_text,
    isEnPozo: row.is_en_pozo,
    status: row.status,
    expensasGs: row.expensas_gs,
    yearBuilt: row.year_built,
    floor: row.floor,
    totalFloors: row.total_floors,
    balconyM2: row.balcony_m2,
    orientation: row.orientation,
    seoTitleEn: row.seo_title_en,
    seoTitleEs: row.seo_title_es,
    seoDescriptionEn: row.seo_description_en,
    seoDescriptionEs: row.seo_description_es,
    whatsappMessageEn: row.whatsapp_message_en,
    whatsappMessageEs: row.whatsapp_message_es,
    featured: row.featured,
    displayOrder: row.display_order,
    published: row.published,
    untranslated: row.untranslated,
  };

  await db
    .insert(listings)
    .values(values)
    .onDuplicateKeyUpdate({ set: { ...values, syncedAt: sql`now()` } });
}

export async function runSync() {
  const rows = await fetchExport();
  for (const row of rows) {
    await upsert(row);
  }
  return { synced: rows.length };
}

if (require.main === module) {
  runSync()
    .then((result) => {
      console.log(`Synced ${result.synced} listings`);
      process.exit(0);
    })
    .catch((err) => {
      console.error("Sync failed:", err);
      process.exit(1);
    });
}
