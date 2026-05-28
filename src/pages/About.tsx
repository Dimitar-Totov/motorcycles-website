import aboutImg from '../assets/about.jpg';
import { Building2, Wrench, PaintRoller } from 'lucide-react';
import styles from './About.module.css';

const services = [
  {
    icon: Building2,
    title: 'New & Pre-Owned Sales',
    description:
      'Curated inventory across every category — sport, adventure, cruiser, and more.',
  },
  {
    icon: Wrench,
    title: 'Expert Servicing',
    description:
      'Factory-trained technicians keeping your machine at peak performance, every ride.',
  },
  {
    icon: PaintRoller,
    title: 'Custom Builds',
    description:
      'Bespoke modifications that transform a stock machine into a signature statement.',
  },
];

export default function About() {
  return (
    <main className={styles.pageWrapper}>
      <section
        className={styles.hero}
        style={{ backgroundImage: `url(${aboutImg})` }}
        aria-label="About us"
      >
        <div className={styles.overlay} aria-hidden="true" />

        {/* Mobile: full natural-size image above the text content */}
        <div className={styles.mobileImgWrap} aria-hidden="true">
          <img src={aboutImg} alt="" className={styles.mobileImg} />
        </div>

        <div className={styles.inner}>
          {/* Left column */}
          <div className={styles.leftCol}>
            <div className={styles.headingWrapper}>
              <span className={styles.accentBar} aria-hidden="true" />
              <h1 className={styles.heading}>
                Born for<br />every<br />open road.
              </h1>
            </div>
            <p className={styles.bodyText}>
              Since 2010, we've been more than a dealership — we're riders
              ourselves. Every bike we stock, every service we offer, is shaped
              by a genuine passion for the machine and the miles ahead.
            </p>
          </div>

          {/* Right column */}
          <div className={styles.rightCol}>
            <p className={styles.sectionLabel}>What We Do</p>
            <ul className={styles.serviceList} aria-label="Our services">
              {services.map(({ icon: Icon, title, description }) => (
                <li key={title} className={styles.serviceItem}>
                  <Icon
                    className={styles.serviceIcon}
                    aria-hidden="true"
                    strokeWidth={1.5}
                  />
                  <div>
                    <p className={styles.serviceTitle}>{title}</p>
                    <p className={styles.serviceDesc}>{description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
