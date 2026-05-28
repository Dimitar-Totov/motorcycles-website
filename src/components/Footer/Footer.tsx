// Typography: Option B — tight editorial sans, 11px / 600 / ls 0.18em uppercase headings.
// Chosen for its architectural precision: matches the dark, premium feel of the motorcycle catalog.

import { NavLink } from "react-router-dom";
import styles from "./Footer.module.css";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  isActive
    ? `${styles.footerLink} ${styles.footerLinkActive}`
    : styles.footerLink;

export default function Footer() {
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
                  <NavLink to="/catalog" className={linkClass}>All Bikes</NavLink>
                  <NavLink to="/new-arrivals" className={linkClass}>New Arrivals</NavLink>
                  <NavLink to="/best-sellers" className={linkClass}>Best Sellers</NavLink>
                  <NavLink to="/shop-by-type" className={linkClass}>Shop by Type</NavLink>
                  <NavLink to="/shop-by-brand" className={linkClass}>Shop by Brand</NavLink>
                </div>
              </nav>
            </div>

            {/* Column 2 — Our Store */}
            <div className={styles.footerCol}>
              <h3 className={styles.footerHeading}>Our Store</h3>
              <div className={styles.storeText}>
                <span>123 Moto Street</span>
                <span>Sofia, Bulgaria</span>
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
                  <NavLink to="/terms" className={linkClass}>Terms &amp; Conditions</NavLink>
                  <NavLink to="/privacy" className={linkClass}>Privacy Policy</NavLink>
                  <NavLink to="/returns" className={linkClass}>Returns &amp; Warranty</NavLink>
                  <NavLink to="/cookies" className={linkClass}>Cookie Policy</NavLink>
                  <NavLink to="/faq" className={linkClass}>FAQ</NavLink>
                </div>
              </nav>
            </div>

            {/* Column 4 — Customer Service */}
            <div className={styles.footerCol}>
              <nav aria-label="Footer navigation — Customer Service">
                <h3 className={styles.footerHeading}>Customer Service</h3>
                <div className={styles.colLinks}>
                  <NavLink to="/contact" className={linkClass}>Contact Us</NavLink>
                  <NavLink to="/help" className={linkClass}>Help Center</NavLink>
                  <NavLink to="/track-order" className={linkClass}>Track My Order</NavLink>
                  <NavLink to="/financing" className={linkClass}>Financing Info</NavLink>
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
