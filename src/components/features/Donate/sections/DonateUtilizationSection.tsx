import { utilizationItems } from "../constants";
import styles from "../DonateExperience.module.css";

interface DonateUtilizationSectionProps {
  openAccordionIndex: number | null;
  onToggleAccordion: (index: number) => void;
}

export default function DonateUtilizationSection({ openAccordionIndex, onToggleAccordion }: DonateUtilizationSectionProps) {
  return (
    <section className={styles.utilization} id="utilization">
      <div data-donate-reveal="true" className={styles.reveal}>
        <span className={styles.sectionEyebrow}>Full Transparency</span>
        <h2 className={styles.sectionTitle}>How Your Donations Are Utilized</h2>
        <p className={styles.sectionSub}>
          We are dedicated to using your contributions to foster positive change across various essential areas:
        </p>
      </div>

      <div data-donate-reveal="true" className={`${styles.accordionList} ${styles.reveal}`}>
        {utilizationItems.map((item, index) => {
          const isOpen = openAccordionIndex === index;
          return (
            <div key={item.label} className={styles.accordionItem}>
              <button type="button" className={`${styles.accordionTrigger} ${isOpen ? styles.accordionTriggerOpen : ""}`} onClick={() => onToggleAccordion(index)}>
                <span className={styles.accordionLabel}>
                  <span className={styles.accordionLabelIcon}>{item.icon}</span>
                  {item.label}
                </span>
                <span className={styles.accordionToggle}>{isOpen ? "-" : "+"}</span>
              </button>
              <div className={`${styles.accordionPanel} ${isOpen ? styles.accordionPanelOpen : ""}`}>
                <div className={styles.accordionPanelInner}>{item.content}</div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
