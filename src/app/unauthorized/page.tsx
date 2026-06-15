import Link from 'next/link'

export const metadata = {
  title: 'Unauthorized',
}

export default function UnauthorizedPage() {
  return (
    <div
      className="-mt-[80px] pt-[80px] lg:-mt-[92px] lg:pt-[92px] min-h-screen flex flex-col items-center justify-center px-4 gap-8 text-center"
      style={{ background: 'linear-gradient(135deg, #8ab5b0 0%, #4a7a80 100%)' }}
    >
      <div className="flex flex-col items-center gap-3">
        <span className="text-white font-bold text-3xl sm:text-4xl uppercase tracking-widest">
          Access Denied
        </span>
        <span className="text-white/70 text-sm sm:text-base font-light max-w-xs sm:max-w-sm">
          You don&apos;t have permission to access this page.
        </span>
      </div>

      <Link
        href="/"
        className="bg-[#1a1a1a] text-white font-bold uppercase tracking-widest rounded-full px-10 py-4 inline-block transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_#40e0d050]"
      >
        Go Home
      </Link>
    </div>
  )
}
