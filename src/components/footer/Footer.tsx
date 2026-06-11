'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Footer.module.css";

const MAPS_URL = `https://www.google.com/maps/dir/?api=1&destination=42.6977,23.3219`;

export default function Footer() {
  const pathname = usePathname();
  const linkClass = (href: string) =>
    pathname === href
      ? `${styles.footerLink} ${styles.footerLinkActive}`
      : styles.footerLink;

  return (
    <footer role="contentinfo" className={styles.footer}>
      <div className={styles.footerContainer}>

        {/* ── Zone 1: Four columns ─────────────────────────────────────────── */}
        <div className={styles.footerMain}>
          <div className={styles.footerGrid}>

            {/* Column 1 — Catalog */}
            <div className={styles.footerCol}>
              <nav aria-label="Footer navigation — Catalog">
                <h3 className={styles.footerHeading}>Catalog</h3>
                <div className={styles.colLinks}>
                  <Link href="/catalog" className={linkClass("/catalog")}>All Bikes</Link>
                  <span className={styles.footerLink}>New Arrivals</span>
                  <span className={styles.footerLink}>Best Sellers</span>
                  <span className={styles.footerLink}>Shop by Type</span>
                  <span className={styles.footerLink}>Shop by Brand</span>
                </div>
              </nav>
            </div>

            {/* Column 2 — Our Store */}
            <div className={styles.footerCol}>
              <h3 className={styles.footerHeading}>Our Store</h3>
              <div className={styles.storeText}>
                <a
                  href={MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.footerExtLink}
                  style={{ display: 'flex', flexDirection: 'column', gap: '11px' }}
                >
                  <span>123 Moto Street</span>
                  <span>Sofia, Bulgaria</span>
                </a>
                <span style={{ height: "4px" }} />
                <span>Monday – Friday: 10am – 7pm</span>
                <span>Saturday – Sunday: 11am – 5pm</span>
                <span style={{ height: "4px" }} />
                <span>Tel: +359 000 000 000</span>
                <a href="mailto:info@yourdomain.com" className={styles.footerExtLink}>info@yourdomain.com</a>
              </div>
            </div>

            {/* Column 3 — Legal */}
            <div className={styles.footerCol}>
              <nav aria-label="Footer navigation — Legal">
                <h3 className={styles.footerHeading}>Legal</h3>
                <div className={styles.colLinks}>
                  <Link href="/terms" className={linkClass("/terms")}>Terms &amp; Conditions</Link>
                  <Link href="/privacy" className={linkClass("/privacy")}>Privacy Policy</Link>
                  <span className={styles.footerLink}>Returns &amp; Warranty</span>
                  <span className={styles.footerLink}>Cookie Policy</span>
                  <span className={styles.footerLink}>FAQ</span>
                </div>
              </nav>
            </div>

            {/* Column 4 — Customer Service */}
            <div className={styles.footerCol}>
              <nav aria-label="Footer navigation — Customer Service">
                <h3 className={styles.footerHeading}>Customer Service</h3>
                <div className={styles.colLinks}>
                  <Link href="/contact" className={linkClass("/contact")}>Contact Us</Link>
                  <span className={styles.footerLink}>Help Center</span>
                  <span className={styles.footerLink}>Track My Order</span>
                  <span className={styles.footerLink}>Financing Info</span>
                  <span style={{ height: "4px" }} />
                  <a href="mailto:support@yourdomain.com" className={styles.footerExtLink}>support@yourdomain.com</a>
                </div>
              </nav>
            </div>

          </div>
        </div>

        {/* ── Divider ──────────────────────────────────────────────────────── */}
        <div className={styles.divider} />

        {/* ── Zone 2: Copyright bar ────────────────────────────────────────── */}
        <div className={styles.footerBottomInner}>
          <p className={styles.copyright}>© 2025 Dimitar Motorcycles App. All rights reserved.</p>
        </div>

      </div>
    </footer>
  );
}
