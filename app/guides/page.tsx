export const metadata = {
  title: "Guides to Buying Property in Paraguay | Real Estate in Paraguay",
  description:
    "Guides on buying property, residency, taxes and neighborhoods in Paraguay for foreign buyers.",
};

export default function GuidesPage() {
  return (
    <main className="flex-1 px-6 py-24 max-w-4xl mx-auto text-center">
      <h1 className="text-3xl font-semibold mb-4">Guides</h1>
      <p className="text-zinc-600">
        Content hub (pillar + spoke guides on buying, residency, taxes,
        neighborhoods) pending — PLAN.md §6/§8 Phase 2. Use{" "}
        <code>claude-blog:blog-cluster</code> to plan and write these; every
        legal/tax/residency claim needs a current source or a{" "}
        <code>[VERIFY]</code> placeholder.
      </p>
    </main>
  );
}
