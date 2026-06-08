import { useState, useEffect, type FormEvent } from 'react';
import { MapPin, Phone, Printer, Mail } from 'lucide-react';
import contactImg from '../../assets/contact.jpg';

const DESTINATION_LAT = 42.6977;
const DESTINATION_LNG = 23.3219;

const MAPS_URL = `https://www.google.com/maps/dir/?api=1&destination=${DESTINATION_LAT},${DESTINATION_LNG}`;

const cards = [
  {
    Icon: MapPin,
    label: 'OUR MAIN OFFICE',
    lines: ['123 Moto Street', 'Sofia, Bulgaria'],
    extra: null as string | null,
    email: null as string | null,
    hasDirections: true,
  },
  {
    Icon: Phone,
    label: 'PHONE NUMBER',
    lines: ['+359 000 000 000'],
    extra: 'Toll-Free: 0800 000 123',
    email: null as string | null,
    hasDirections: false,
  },
  {
    Icon: Printer,
    label: 'FAX',
    lines: ['+359 000 000 001'],
    extra: null as string | null,
    email: null as string | null,
    hasDirections: false,
  },
  {
    Icon: Mail,
    label: 'EMAIL ADDRESS',
    lines: [] as string[],
    extra: null as string | null,
    email: 'info@yourdomain.com',
    hasDirections: false,
  },
];

const inputClass =
  'bg-transparent border-0 border-b border-white/60 focus:border-white outline-none text-white placeholder:text-white/40 w-full pb-2 mb-6 block transition-colors duration-200';

const labelClass =
  'block text-white font-bold text-sm uppercase tracking-wider mb-2 font-serif';

export default function Contact() {
  const [visible, setVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ email: '', name: '', message: '' });
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="!p-0 !min-h-screen flex flex-col justify-center bg-gradient-to-b from-gray-900 to-gray-800 relative before:content-[''] before:fixed before:inset-0 before:bg-gray-900 before:-z-10">

      {/* ── Section 1: Info Cards ─────────────────────────────────── */}
      <section className="pt-10 pb-10">
        <div className="max-w-6xl mx-auto px-6 md:px-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map(({ Icon, label, lines, extra, email, hasDirections }, i) => (
              <div
                key={label}
                className={`reveal-item${visible ? ' is-visible' : ''} bg-white rounded-xl p-6 text-center shadow-md`}
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                <div className="flex justify-center mb-4">
                  <Icon
                    className="text-amber-600 w-11 h-11"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                </div>
                <span className="block font-bold uppercase text-slate-900 text-sm tracking-wide mb-3 font-serif">
                  {label}
                </span>
                <div className="flex flex-col items-center gap-1">
                  {lines.map(line => (
                    <span key={line} className="text-slate-600 text-sm leading-relaxed">
                      {line}
                    </span>
                  ))}
                  {extra && (
                    <span className="text-slate-400 text-xs">{extra}</span>
                  )}
                  {email && (
                    <a
                      href={`mailto:${email}`}
                      className="text-amber-600 text-sm hover:underline break-all"
                    >
                      {email}
                    </a>
                  )}
                  {hasDirections && (
                    <a
                      href={MAPS_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-600 text-sm hover:underline mt-1"
                    >
                      View on Google Maps
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 2: Contact Info + Form ───────────────────────── */}
      <section>
        <div className="max-w-5xl mx-auto px-6 md:px-16 py-14">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 text-center lg:text-left">

            {/* Left column */}
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight font-serif">
                Contact Info
              </h2>
              <p className="mt-4 !text-white text-base !leading-relaxed !max-w-md">
                Whether you're searching for your next ride, need expert servicing, or have a
                question about our inventory — our team is here to help. Reach out and a
                specialist will get back to you promptly.
              </p>
              <img
                src={contactImg}
                alt="Dimitar's Motorcycles showroom"
                className="w-40 h-40 lg:w-56 lg:h-56 rounded-full object-cover mt-6 shadow-lg mx-auto lg:mx-0"
              />
            </div>

            {/* Right column: Form */}
            <div className={`reveal-item${visible ? ' is-visible' : ''}`} style={{ transitionDelay: '0.55s' }}>
              {submitted ? (
                <div className="py-8">
                  <h3 className="text-3xl text-white font-bold font-serif">
                    Thank you!
                  </h3>
                  <p className="text-white/80 mt-3 !leading-relaxed">
                    We've received your message and will be in touch shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  <label className={labelClass}>Email</label>
                  <input
                    type="email"
                    required
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    className={inputClass}
                  />

                  <label className={labelClass}>Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Your name"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className={inputClass}
                  />

                  <label className={labelClass}>Message</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="How can we help you?"
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    className={`${inputClass} resize-none`}
                  />

                  <button
                    type="submit"
                    className="w-full bg-white text-gray-800 font-semibold tracking-widest py-3 mt-4 hover:bg-white/90 transition rounded-sm uppercase"
                  >
                    Send Message
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </section>

    </main>
  );
}
