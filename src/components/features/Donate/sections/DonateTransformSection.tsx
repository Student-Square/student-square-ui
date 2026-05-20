import { transformCards } from "../constants";
import styles from "../DonateExperience.module.css";

export default function DonateTransformSection() {
  return (
    <section className={styles.transform}>
      <div className={styles.transformGrid}>
        <div data-donate-reveal="true" className={`${styles.transformLeft} ${styles.reveal}`}>
          <span className={`${styles.sectionEyebrow} ${styles.sectionEyebrowMint}`}>Our Mission</span>
          <h2 className={styles.sectionTitle}>Transform Lives with Your Support</h2>
          <p className={styles.sectionSub}>
            Your donation, no matter the size, has the power to change someone&apos;s life. By contributing to Student Square, you become a vital part
            of a movement dedicated to education, environmental sustainability, community well-being, and skill development.
          </p>
          <blockquote className={styles.transformQuote}>
            &quot;Together, we can create a lasting impact and build a better tomorrow. We aim to create a chain effect for sustainable development in
            society.&quot;
          </blockquote>
        </div>

        <div data-donate-reveal="true" className={`${styles.transformRight} ${styles.reveal}`}>
          {transformCards.map((card) => (
            <div key={card.title} className={styles.transformCard}>
              <div className={styles.transformCardIcon}>{card.icon}</div>
              <div>
                <div className={styles.transformCardTitle}>{card.title}</div>
                <div className={styles.transformCardDesc}>{card.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
