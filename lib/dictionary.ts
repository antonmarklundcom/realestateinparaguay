/**
 * All UI strings live here, keyed by locale, from day one — so adding /de
 * later (INM plan §5) is routing + a new key in this object, not a refactor.
 * Per-listing content (title/description) is NOT here — that's bilingual
 * columns on the listing row (lib/db/schema.ts). This file is only for
 * chrome: nav, buttons, labels, enum translations.
 */

export type Locale = "en" | "es";

export const defaultLocale: Locale = "en";
export const locales: Locale[] = ["en", "es"];

export const dictionary = {
  en: {
    brand: "Real Estate in Paraguay",
    nav: {
      properties: "Properties",
      newDevelopments: "New Developments",
      guides: "Guides",
      whyParaguay: "Why Paraguay",
      about: "About",
      contact: "Contact",
    },
    cta: {
      whatsapp: "Chat on WhatsApp",
      viewProperty: "View property",
      inquire: "Ask about this property",
      browseProperties: "Browse properties",
    },
    hero: {
      title: "Real Estate in Paraguay",
      subtitle: "Property for sale to international buyers",
    },
    operation: { venta: "For Sale", alquiler: "For Rent" },
    type: {
      departamento: "Apartment",
      casa: "House",
      terreno: "Land",
      oficina: "Office",
      local: "Commercial unit",
    },
    segment: {
      premium_highrise: "Premium high-rise",
      villa_land: "Villas & land",
      nature_project: "New projects in nature",
    },
    status: {
      disponible: "Available",
      reservado: "Reserved",
      vendido: "Sold",
      alquilado: "Rented",
    },
  },
  es: {
    brand: "Real Estate in Paraguay",
    nav: {
      properties: "Propiedades",
      newDevelopments: "Proyectos",
      guides: "Guías",
      whyParaguay: "Por qué Paraguay",
      about: "Nosotros",
      contact: "Contacto",
    },
    cta: {
      whatsapp: "Escribinos por WhatsApp",
      viewProperty: "Ver propiedad",
      inquire: "Consultá por esta propiedad",
      browseProperties: "Ver propiedades",
    },
    hero: {
      title: "Real Estate in Paraguay",
      subtitle: "Propiedades en venta para compradores internacionales",
    },
    operation: { venta: "En venta", alquiler: "En alquiler" },
    type: {
      departamento: "Departamento",
      casa: "Casa",
      terreno: "Terreno",
      oficina: "Oficina",
      local: "Local comercial",
    },
    segment: {
      premium_highrise: "Torres premium",
      villa_land: "Villas y terrenos",
      nature_project: "Proyectos nuevos en la naturaleza",
    },
    status: {
      disponible: "Disponible",
      reservado: "Reservado",
      vendido: "Vendido",
      alquilado: "Alquilado",
    },
  },
} as const;

export function t(locale: Locale) {
  return dictionary[locale];
}
