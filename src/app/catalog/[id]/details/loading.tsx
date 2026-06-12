export default function Loading() {
  return (
    <main className="!min-h-0 -mt-20 overflow-x-hidden !bg-[#0d0d0d] !p-0 lg:-mt-[5.75rem]">
      <div className="relative flex min-h-[100svh] flex-col overflow-hidden bg-[#0d0d0d] px-6 pb-10 pt-24 sm:px-10 lg:px-14 lg:pt-28">
        <div className="h-5 w-32 animate-pulse rounded bg-white/5" />

        <div className="grid flex-1 items-center gap-10 py-10 lg:grid-cols-[minmax(0,42fr)_minmax(0,58fr)] lg:gap-6">
          <div className="order-2 space-y-5 lg:order-1">
            <div className="h-7 w-28 animate-pulse rounded bg-white/5" />
            <div className="h-20 w-3/4 animate-pulse rounded bg-white/5" />
            <div className="h-9 w-40 animate-pulse rounded bg-white/5" />
            <div className="space-y-3 pt-2">
              <div className="h-4 w-48 animate-pulse rounded bg-white/5" />
              <div className="h-4 w-44 animate-pulse rounded bg-white/5" />
              <div className="h-4 w-40 animate-pulse rounded bg-white/5" />
            </div>
            <div className="h-12 w-44 animate-pulse rounded-md bg-white/5" />
          </div>

          <div className="order-1 lg:order-2">
            <div className="mx-auto aspect-[4/3] w-full max-w-[28rem] animate-pulse rounded-3xl bg-white/5 lg:max-w-none" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-6 border-t border-white/[0.08] pt-6 md:flex md:[&>*]:flex-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-3 w-16 animate-pulse rounded bg-white/5" />
              <div className="h-8 w-20 animate-pulse rounded bg-white/5" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
