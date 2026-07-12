export default function ProjectDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  return (
    <main className="flex-1 px-6 py-24 max-w-4xl mx-auto text-center">
      <h1 className="text-3xl font-semibold mb-4">Project: {params.slug}</h1>
      <p className="text-zinc-600">Project detail pending real inventory.</p>
    </main>
  );
}
