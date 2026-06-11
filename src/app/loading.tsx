// Streamed fallback for async Server Component pages (e.g. the home catalog).
// Synchronous pages don't suspend, so this only shows while server data loads.
export default function Loading() {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex gap-7 items-start">
        <div className="hidden lg:block w-72 xl:w-80 shrink-0">
          <div className="h-96 rounded-2xl bg-slate-100 animate-pulse" />
        </div>
        <div className="flex-1 grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))' }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-80 rounded-2xl bg-slate-100 animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}
