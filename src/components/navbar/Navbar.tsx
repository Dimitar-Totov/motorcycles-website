'use client';

import { useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, Bike } from "lucide-react";
import { useUser } from "@/context/UserContext";

const CATEGORY_ITEMS = [
  { label: "Naked",             value: "naked" },
  { label: "Sport",             value: "sport" },
  { label: "Adventure",         value: "adventure" },
  { label: "Scrambler",         value: "scrambler" },
  { label: "Electric",          value: "electric" },
  { label: "Cruiser",           value: "cruiser" },
  { label: "Adventure Touring", value: "adventure touring" },
  { label: "Touring",           value: "touring" },
  { label: "Cafe Racer",        value: "cafe racer" },
  { label: "Dual Sport",        value: "dual sport" },
  { label: "Supermoto",         value: "supermoto" },
  { label: "Custom",            value: "custom" },
  { label: "Dirt Bike",         value: "dirt bike" },
  { label: "Moped",             value: "moped" },
  { label: "Scooter",           value: "scooter" },
  { label: "Enduro",            value: "enduro" },
];

export default function Navbar() {
  const { user } = useUser();
  const isAdmin = user?.app_metadata?.role === 'admin';
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const dropdownTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openDropdown = () => {
    if (dropdownTimer.current) clearTimeout(dropdownTimer.current);
    setProductsOpen(true);
  };

  const closeDropdown = () => {
    dropdownTimer.current = setTimeout(() => setProductsOpen(false), 180);
  };

  const isActive = (href: string) => pathname === href;

  const navLinkClass = (href: string) =>
    `text-sm lg:text-base font-medium transition-all duration-150 px-3 lg:px-4 py-1.5 lg:py-2 rounded-full whitespace-nowrap ${isActive(href)
      ? "text-white bg-white/10"
      : "text-slate-300 hover:text-white hover:bg-white/[0.07]"
    }`;

  const mobileLinkClass = (href: string) =>
    `text-sm font-medium px-3 py-2.5 rounded-full transition-colors duration-100 ${isActive(href)
      ? "text-white bg-white/10"
      : "text-slate-300 hover:text-white hover:bg-white/[0.07]"
    }`;

  return (
    <div className="sticky top-5 z-50 flex justify-center px-4 mt-5">
      <div className="relative w-full max-w-4xl lg:max-w-5xl xl:max-w-6xl">

        {/* ── Pill Nav Bar ─────────────────────────────── */}
        <nav className="relative z-10 flex items-center justify-between h-[3.75rem] lg:h-[4.5rem] px-5 lg:px-8 rounded-full bg-slate-950/80 backdrop-blur-2xl border border-white/[0.08] shadow-[0_4px_28px_rgba(0,0,0,0.28)]">

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 lg:gap-3 shrink-0 group"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <span className="flex items-center justify-center w-[1.875rem] h-[1.875rem] lg:w-10 lg:h-10 rounded-full bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.4)] transition-shadow duration-200 group-hover:shadow-[0_0_20px_rgba(245,158,11,0.6)]">
              <Bike className="w-[1.05rem] h-[1.05rem] lg:w-5 lg:h-5 text-slate-950 stroke-[2.5]" />
            </span>
            <span className="font-extrabold text-white text-[0.93rem] lg:text-base tracking-tight select-none">
              Dimitar's Motorcycles
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-0.5 lg:gap-1">
            <Link href="/" className={navLinkClass("/")}>
              Home
            </Link>

            <div onMouseEnter={openDropdown} onMouseLeave={closeDropdown}>
              <Link
                href="/catalog"
                aria-expanded={productsOpen}
                aria-haspopup="true"
                className={`flex items-center gap-1.5 text-sm lg:text-base font-medium transition-all duration-150 px-3 lg:px-4 py-1.5 lg:py-2 rounded-full ${productsOpen || isActive("/catalog")
                  ? "text-white bg-white/10"
                  : "text-slate-300 hover:text-white hover:bg-white/[0.07]"
                  }`}
              >
                Products
                <ChevronDown
                  className={`w-3.5 h-3.5 lg:w-4 lg:h-4 transition-transform duration-200 ${productsOpen ? "rotate-180 text-amber-400" : ""
                    }`}
                />
              </Link>
            </div>

            {isAdmin && (
              <Link href="/create-product" className={navLinkClass("/create-product")}>
                Create Product
              </Link>
            )}

            <Link href="/about" className={navLinkClass("/about")}>
              About
            </Link>

            <Link href="/services" className={navLinkClass("/services")}>
              Services
            </Link>

            <Link href="/contact" className={navLinkClass("/contact")}>
              Contact
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2.5 lg:gap-3">
            <Link
              href={user ? "/profile" : "/auth"}
              className="hidden md:inline-flex items-center px-4 lg:px-6 py-1.5 lg:py-2 text-sm lg:text-base font-bold rounded-full bg-amber-500 text-slate-950 hover:bg-amber-400 active:scale-95 transition-all duration-150 shadow-[0_0_14px_rgba(245,158,11,0.3)] whitespace-nowrap"
            >
              {user ? "Profile" : "Sign In"}
            </Link>

            <button
              type="button"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-full bg-white/[0.07] hover:bg-white/[0.12] text-white transition-colors duration-150"
            >
              {mobileOpen
                ? <X className="w-[1.05rem] h-[1.05rem]" />
                : <Menu className="w-[1.05rem] h-[1.05rem]" />
              }
            </button>
          </div>
        </nav>

        {/* ── Desktop Products Dropdown ─────────────── */}
        <div
          className="absolute left-0 right-0 flex justify-center pointer-events-none z-20 top-[calc(3.75rem+0.5rem)] lg:top-[calc(4.5rem+0.5rem)]"
        >
          <div
            onMouseEnter={openDropdown}
            onMouseLeave={closeDropdown}
            className={`pointer-events-auto transition-all duration-200 ease-out ${productsOpen
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-1.5 pointer-events-none"
              }`}
          >
            <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-white/[0.09] shadow-[0_16px_40px_rgba(0,0,0,0.4)] p-2">
              <div
                style={{
                  display: 'grid',
                  gridTemplateRows: 'repeat(4, auto)',
                  gridAutoFlow: 'column',
                  gap: '2px',
                }}
              >
                {CATEGORY_ITEMS.map((item) => (
                  <a
                    key={item.value}
                    href={`/catalog?category=${encodeURIComponent(item.value)}`}
                    onClick={() => setProductsOpen(false)}
                    className="flex items-center px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/[0.07] rounded-xl transition-colors duration-100 whitespace-nowrap"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Mobile Menu Panel ─────────────────────── */}
        <div
          className={`absolute left-0 right-0 md:hidden z-0 transition-all duration-300 ease-in-out ${mobileOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-2 pointer-events-none"
            }`}
          style={{ top: "calc(3.75rem - 1rem)" }}
        >
          <div className="mx-2 pt-[1.35rem] pb-3 px-3 bg-slate-950/80 backdrop-blur-2xl rounded-b-[1.5rem] border border-white/[0.08] border-t-0 shadow-[0_12px_40px_rgba(0,0,0,0.3)] flex flex-col gap-0.5">

            <div className="h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent mb-2" />

            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className={mobileLinkClass("/")}
            >
              Home
            </Link>

            {/* Mobile Products Accordion */}
            <div>
              <div className="flex items-center">
                <Link
                  href="/catalog"
                  onClick={() => setMobileOpen(false)}
                  className={`flex-1 text-sm font-medium px-3 py-2.5 rounded-full transition-colors duration-100 ${isActive("/catalog") ? "text-white bg-white/10" : "text-slate-300 hover:text-white hover:bg-white/[0.07]"}`}
                >
                  Products
                </Link>
                <button
                  type="button"
                  onClick={() => setMobileProductsOpen((o) => !o)}
                  className="flex items-center justify-center w-9 h-9 rounded-full text-slate-300 hover:text-white hover:bg-white/[0.07] transition-colors duration-100"
                  aria-label="Toggle product categories"
                >
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${mobileProductsOpen ? "rotate-180 text-amber-400" : ""}`}
                  />
                </button>
              </div>

              <div
                className={`overflow-hidden transition-all duration-200 ease-in-out ${mobileProductsOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  }`}
              >
                <div className="pt-0.5 pb-1 pl-3 grid grid-cols-2 gap-0.5">
                  {CATEGORY_ITEMS.map((item) => (
                    <a
                      key={item.value}
                      href={`/catalog?category=${encodeURIComponent(item.value)}`}
                      onClick={() => setMobileOpen(false)}
                      className="text-sm text-slate-400 hover:text-white px-3 py-2 rounded-full transition-colors duration-100 hover:bg-white/[0.07]"
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {isAdmin && (
              <Link
                href="/create-product"
                onClick={() => setMobileOpen(false)}
                className={mobileLinkClass("/create-product")}
              >
                Create Product
              </Link>
            )}

            <Link
              href="/about"
              onClick={() => setMobileOpen(false)}
              className={mobileLinkClass("/about")}
            >
              About
            </Link>

            <Link
              href="/services"
              onClick={() => setMobileOpen(false)}
              className={mobileLinkClass("/services")}
            >
              Services
            </Link>

            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className={mobileLinkClass("/contact")}
            >
              Contact
            </Link>

            <div className="mt-2 pt-2 border-t border-white/[0.06]">
              <Link
                href={user ? "/profile" : "/auth"}
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center px-4 py-2.5 text-sm font-bold rounded-full bg-amber-500 text-slate-950 hover:bg-amber-400 transition-colors duration-150"
              >
                {user ? "Profile" : "Sign In"}
              </Link>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
