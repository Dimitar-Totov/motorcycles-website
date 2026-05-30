import { Link } from "react-router-dom";
import { Shield, FileText, AlertCircle, Lock, RefreshCw, Mail, ChevronRight } from "lucide-react";

const SECTIONS = [
  {
    icon: FileText,
    title: "Acceptance of Terms",
    content:
      "By accessing or using MotoElite's website, services, or purchasing any of our motorcycles and accessories, you agree to be bound by these Terms & Conditions. If you do not agree with any part of these terms, you may not access our services. These terms apply to all visitors, users, and customers.",
  },
  {
    icon: Shield,
    title: "Use of Service",
    content:
      "You agree to use our platform solely for lawful purposes and in a manner that does not infringe the rights of others. You must not misuse our services by introducing malicious code, attempting unauthorized access, or engaging in any conduct that restricts or inhibits anyone's use or enjoyment of the site.",
  },
  {
    icon: Lock,
    title: "Privacy & Data",
    content:
      "We take your privacy seriously. Personal information you provide — including name, email address, and payment details — is processed in accordance with our Privacy Policy. We employ industry-standard encryption and security practices to protect your data from unauthorized access or disclosure.",
  },
  {
    icon: AlertCircle,
    title: "Limitation of Liability",
    content:
      "MotoElite shall not be liable for any indirect, incidental, special, or consequential damages arising out of your use of our services. Our total liability for any claim related to these terms shall not exceed the amount paid by you for the specific product or service giving rise to the claim.",
  },
  {
    icon: RefreshCw,
    title: "Changes to Terms",
    content:
      "We reserve the right to modify these Terms & Conditions at any time. Changes become effective immediately upon posting. Your continued use of our services after any modification constitutes your acceptance of the revised terms. We encourage you to review this page periodically.",
  },
  {
    icon: Mail,
    title: "Contact Us",
    content:
      "If you have any questions, concerns, or requests regarding these Terms & Conditions, please reach out to our legal team at legal@motoelite.com or write to us at MotoElite HQ, 12 Riders Boulevard, Sofia 1000, Bulgaria. We aim to respond to all enquiries within 5 business days.",
  },
];

export default function Terms() {
  return (
    <div className="min-h-screen w-full bg-white">

      {/* Hero */}
      <div className="w-full text-white text-center px-6 py-16 sm:py-24">
        <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-light tracking-tight leading-tight text-amber-400 mb-4">
          Terms & Conditions
        </h1>
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
    </div>
  );
}
