import { impactStripStats } from "../constants";
import styles from "../DonateExperience.module.css";

export default function DonateImpactStripSection() {
  return (
    <section className={styles.impactStrip}>
      {impactStripStats.map((stat, index) => (
        <div key={stat.label} data-donate-reveal="true" className={`${styles.impactStripItem} ${styles.reveal}`} style={{ animationDelay: `${index * 0.1}s` }}>
          <div className={styles.impactStripNum}>{stat.number}</div>
          <div className={styles.impactStripLabel}>{stat.label}</div>
        </div>
      ))}
    </section>
  );
}
