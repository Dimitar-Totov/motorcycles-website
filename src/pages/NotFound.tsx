import { Link } from 'react-router-dom';
import './NotFound.module.css';

const DIGITS = ['4', '0', '4'] as const;

export default function NotFound() {
  return (
    <div
      className="-mt-[80px] pt-[80px] lg:-mt-[92px] lg:pt-[92px] min-h-screen flex flex-col items-center justify-center px-4 gap-8 sm:gap-12"
      style={{ background: 'linear-gradient(135deg, #8ab5b0 0%, #4a7a80 100%)' }}
    >
      {/* 404 hero block — float wraps all three digits together */}
      <div className="animate-float flex items-end gap-1 sm:gap-3">
        {DIGITS.map((digit, i) => (
          <span
            key={i}
            className="digit-3d animate-digit-enter"
            data-digit={digit}
            style={{ animationDelay: `${i * 150}ms` }}
          >
            {digit}
          </span>
        ))}
      </div>

      {/* Copy */}
      <div
        className="flex flex-col items-center gap-3 text-center animate-fade-up"
        style={{ animationDelay: '450ms' }}
      >
        <h1 className="text-white font-bold text-3xl sm:text-4xl uppercase tracking-widest">
          OOPPS!
        </h1>
        <p className="text-white/70 text-sm sm:text-base font-light max-w-xs sm:max-w-sm">
          We're sorry, something is not working here!
        </p>
      </div>

      {/* CTA */}
      <div
        className="animate-fade-up"
        style={{ animationDelay: '600ms' }}
      >
        <Link
          to="/"
          className="bg-[#1a1a1a] text-white font-bold uppercase tracking-widest rounded-full px-10 py-4 inline-block transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_#40e0d050]"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
