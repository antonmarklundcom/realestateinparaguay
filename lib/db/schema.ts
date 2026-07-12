import {
  mysqlTable,
  varchar,
  int,
  decimal,
  boolean,
  json,
  mysqlEnum,
  timestamp,
  text,
} from "drizzle-orm/mysql-core";

/**
 * Local read replica of inmobiliaria.com.py's listings.
 * Field names mirror the INM schema 1:1 (see inmobiliaria-com-py/PLAN.md §7) so
 * components/types can be copied between the two repos unchanged. Bilingual
 * columns (_en/_es) are added because both sites render both locales — see
 * realestateinparaguay-com/PLAN.md §5.
 *
 * Rows here are UPSERTed by scripts/sync.ts from INM's export API. This app
 * never writes to `listings` directly.
 */
export const listings = mysqlTable("listings", {
  id: int("id").autoincrement().primaryKey(),
  refCode: varchar("ref_code", { length: 32 }).notNull().unique(), // e.g. INM-0001 — stable cross-site key

  slugEn: varchar("slug_en", { length: 255 }).notNull().unique(),
  slugEs: varchar("slug_es", { length: 255 }).notNull().unique(),

  titleEn: varchar("title_en", { length: 255 }).notNull(),
  titleEs: varchar("title_es", { length: 255 }).notNull(),
  descriptionEn: text("description_en").notNull(),
  descriptionEs: text("description_es").notNull(),

  operation: mysqlEnum("operation", ["venta", "alquiler"]).notNull(),
  type: mysqlEnum("type", [
    "departamento",
    "casa",
    "terreno",
    "oficina",
    "local",
  ]).notNull(),
  segment: mysqlEnum("segment", [
    "premium_highrise",
    "villa_land",
    "nature_project",
  ]).notNull(),

  city: varchar("city", { length: 120 }).notNull(),
  barrio: varchar("barrio", { length: 120 }),

  priceAmount: decimal("price_amount", { precision: 14, scale: 2 }),
  priceCurrency: mysqlEnum("price_currency", ["GS", "USD"]).notNull(),
  priceOnRequest: boolean("price_on_request").notNull().default(false),

  bedrooms: int("bedrooms"),
  bathrooms: int("bathrooms"),
  areaTotalM2: decimal("area_total_m2", { precision: 10, scale: 2 }),
  areaBuiltM2: decimal("area_built_m2", { precision: 10, scale: 2 }),
  parking: int("parking"),

  photos: json("photos").$type<string[]>().notNull().default([]), // ordered Cloudinary IDs
  amenities: json("amenities").$type<string[]>().notNull().default([]), // enum keys, translated by dictionary
  videoUrl: varchar("video_url", { length: 500 }),
  lat: decimal("lat", { precision: 10, scale: 7 }),
  lng: decimal("lng", { precision: 10, scale: 7 }),

  // project extras (nature_project / en-pozo)
  masterplanAssets: json("masterplan_assets").$type<string[]>(),
  unitTypes: json("unit_types"),
  deliveryDate: varchar("delivery_date", { length: 32 }),
  financingText: text("financing_text"),
  isEnPozo: boolean("is_en_pozo").notNull().default(false),

  // recommended extras from INM plan §7
  status: mysqlEnum("status", [
    "disponible",
    "reservado",
    "vendido",
    "alquilado",
  ]).notNull(),
  expensasGs: decimal("expensas_gs", { precision: 12, scale: 2 }),
  yearBuilt: int("year_built"),
  floor: int("floor"),
  totalFloors: int("total_floors"),
  balconyM2: decimal("balcony_m2", { precision: 8, scale: 2 }),
  orientation: varchar("orientation", { length: 32 }),

  seoTitleEn: varchar("seo_title_en", { length: 255 }),
  seoTitleEs: varchar("seo_title_es", { length: 255 }),
  seoDescriptionEn: varchar("seo_description_en", { length: 500 }),
  seoDescriptionEs: varchar("seo_description_es", { length: 500 }),
  whatsappMessageEn: varchar("whatsapp_message_en", { length: 500 }),
  whatsappMessageEs: varchar("whatsapp_message_es", { length: 500 }),

  featured: boolean("featured").notNull().default(false),
  displayOrder: int("display_order").notNull().default(0),
  published: boolean("published").notNull().default(false),
  untranslated: boolean("untranslated").notNull().default(false), // true = en fields are a fallback copy of es

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
  syncedAt: timestamp("synced_at").notNull().defaultNow().onUpdateNow(),
});

export type Listing = typeof listings.$inferSelect;

export const leads = mysqlTable("leads", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 60 }),
  message: text("message").notNull(),
  listingRef: varchar("listing_ref", { length: 32 }),
  page: varchar("page", { length: 255 }),
  locale: mysqlEnum("locale", ["en", "es"]).notNull().default("en"),
  forwardedToInm: boolean("forwarded_to_inm").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Lead = typeof leads.$inferSelect;

export const settings = mysqlTable("settings", {
  key: varchar("key", { length: 100 }).primaryKey(),
  value: varchar("value", { length: 500 }).notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
});
