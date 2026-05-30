import { Link } from "react-router-dom";
import { Eye, Database, Cookie, Share2, ShieldCheck, UserCheck, ChevronRight } from "lucide-react";

const SECTIONS = [
  {
    icon: Database,
    title: "Information We Collect",
    content:
      "We collect information you provide directly — such as your name, email address, phone number, and billing details when you register or place an order. We also collect usage data automatically, including IP address, browser type, pages visited, and time spent on our site to help us improve your experience.",
  },
  {
    icon: Eye,
    title: "How We Use Your Data",
    content:
      "Your data is used to process orders, manage your account, send transactional emails, and provide customer support. With your consent, we may also send promotional communications. We analyse aggregated, anonymised usage data to understand site performance and improve our offerings.",
  },
  {
    icon: Share2,
    title: "Sharing & Disclosure",
    content:
      "We do not sell your personal data. We share information only with trusted service providers (payment processors, shipping partners, analytics tools) who are contractually bound to handle it securely. We may disclose data when required by law or to protect the rights and safety of MotoElite and its users.",
  },
  {
    icon: Cookie,
    title: "Cookies & Tracking",
    content:
      "We use essential cookies to keep you logged in and remember your preferences. With your consent, we use analytics and marketing cookies to measure performance and show relevant ads. You can manage or withdraw cookie consent at any time via your browser settings or our cookie banner.",
  },
  {
    icon: ShieldCheck,
    title: "Data Security",
    content:
      "All data in transit is encrypted via TLS. Sensitive payment information is processed by PCI-DSS compliant payment processors — we never store raw card numbers. We conduct regular security audits and limit employee access to personal data on a strict need-to-know basis.",
  },
  {
    icon: UserCheck,
    title: "Your Rights",
    content:
      "Under GDPR and applicable law, you have the right to access, correct, port, or delete your personal data, and to object to or restrict certain processing. To exercise any of these rights, email privacy@motoelite.com. We will respond within 30 days. You also have the right to lodge a complaint with your local data protection authority.",
  },
];

export default function Privacy() {
  return (
    <div className="min-h-screen w-full bg-white">

      {/* Hero */}
      <div className="w-full text-white text-center px-6 py-16 sm:py-24">

        <h1 className="font-serif text-amber-400 text-3xl sm:text-5xl lg:text-6xl font-light tracking-tight leading-tight mb-4">
          Privacy Policy
        </h1>
      </div>

      {/* Quick note */}
      <div className="w-full bg-neutral-50 border-b border-neutral-100">
        <div className="mx-auto max-w-4xl px-4 sm:px-8 py-5 flex flex-col sm:flex-row sm:items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-neutral-400 shrink-0" />
          <p className="text-sm text-neutral-600 leading-relaxed m-0 max-w-none">
            <span className="font-semibold text-neutral-800">In short —</span>{" "}
            Your data is yours. We collect only what's necessary, never sell it, and give you full control to access or delete it at any time.
          </p>
        </div>
      </div>

      {/* Cards */}
      <div className="w-full bg-white px-4 sm:px-8 py-14 sm:py-20">
        <div className="mx-auto max-w-4xl flex flex-col gap-6 sm:gap-8">
          {SECTIONS.map(({ icon: Icon, title, content }, i) => (
            <div
              key={title}
              className="group flex gap-4 sm:gap-6 rounded-2xl border border-neutral-200 bg-white p-5 sm:p-8 shadow-sm hover:shadow-md hover:border-amber-200 transition-all duration-300"
            >
              {/* Icon */}
              <div className="shrink-0 mt-0.5">
                <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-neutral-100 border border-neutral-200 group-hover:bg-amber-400 group-hover:border-amber-400 transition-all duration-300">
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-400 group-hover:text-white transition-colors duration-300" />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2 mb-2 sm:mb-3">
                  <h2 className="font-semibold text-neutral-900 text-base sm:text-lg group-hover:text-amber-700 transition-colors duration-200">
                    {title}
                  </h2>
                  <span
                    aria-hidden="true"
                    className="shrink-0 font-serif text-2xl sm:text-4xl font-light text-neutral-100 select-none leading-none group-hover:text-amber-100 transition-colors duration-300"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <p className="text-neutral-500 text-sm leading-relaxed m-0 max-w-none">
                  {content}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Footer */}
      <div className="w-full bg-neutral-950 text-white text-center px-6 py-14 sm:py-20">
        <h2 className="font-serif text-2xl sm:text-4xl font-light mb-3">
          Questions about your <span className="text-amber-400">data?</span>
        </h2>
        <p className="text-neutral-400 text-sm sm:text-base max-w-md mx-auto mb-8 leading-relaxed">
          Reach out to our privacy team and we'll get back to you within 30 days.
        </p>
        <Link
          to="/contact"
          className="inline-flex items-center gap-2 rounded-full bg-amber-400 text-neutral-900 font-semibold text-sm px-8 py-3.5 hover:bg-amber-500 active:scale-[0.98] transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
        >
          Contact Us
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
}
