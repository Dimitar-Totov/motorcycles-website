'use client';

import Image from 'next/image';
import Link from 'next/link';
import homepageImage from '@/assets/homepage.jpg';
import styles from './HeroSection.module.css';

export default function HeroSection() {
  return (
    <div className={styles.hero}>
      <Image
        src={homepageImage}
        alt="Motorcycles hero background"
        fill
        priority
        className={styles.heroImage}
        sizes="100vw"
      />
      <div className={styles.overlay}></div>
      <div className={styles.content}>
        <h1 className={styles.mainText}>
          Buy brand-new motorcycles or used ones
        </h1>
        <Link href="/services" className={styles.ctaButton}>
          We can offer service too
        </Link>
      </div>
    </div>
  );
}
