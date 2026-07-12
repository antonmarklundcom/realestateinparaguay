export const metadata = {
  title: "Properties for Sale in Paraguay | Real Estate in Paraguay",
  description:
    "Browse apartments, houses and land for sale in Asunción and Paraguay.",
};

export default function PropertiesPage() {
  return (
    <main className="flex-1 px-6 py-24 max-w-4xl mx-auto text-center">
      <h1 className="text-3xl font-semibold mb-4">Properties</h1>
      <p className="text-zinc-600">
        Listings will populate here once the sync job pulls inventory from
        inmobiliaria.com.py (blocked on that repo&apos;s export API — see
        PLAN.md §5a/§8 Phase 4).
      </p>
    </main>
  );
}
