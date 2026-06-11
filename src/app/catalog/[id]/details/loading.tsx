export default function Loading() {
  return (
    <main className="!bg-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="h-5 w-32 rounded bg-slate-100 animate-pulse mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          <div className="aspect-[4/3] w-full rounded-2xl bg-slate-100 animate-pulse" />
          <div className="space-y-4">
            <div className="h-8 w-3/4 rounded bg-slate-100 animate-pulse" />
            <div className="h-6 w-32 rounded bg-slate-100 animate-pulse" />
            <div className="h-40 w-full rounded-2xl bg-slate-100 animate-pulse" />
          </div>
        </div>
      </div>
    </main>
  );
}
