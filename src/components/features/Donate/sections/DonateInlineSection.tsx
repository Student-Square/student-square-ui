import { amountOptions } from "../constants";
import styles from "../DonateExperience.module.css";

interface DonateInlineSectionProps {
  currentAmt2: number;
  inlineCustomValue: string;
  inlineImpact: string;
  onAmountPick: (amount: number) => void;
  onCustomAmountChange: (value: string) => void;
}

export default function DonateInlineSection({
  currentAmt2,
  inlineCustomValue,
  inlineImpact,
  onAmountPick,
  onCustomAmountChange,
}: DonateInlineSectionProps) {
  return (
    <section className={styles.inlineDonate}>
      <div data-donate-reveal="true" className={`${styles.inlineDonateInner} ${styles.reveal}`}>
        <div className={styles.inlineDonateLeft}>
          <span className={styles.sectionEyebrow}>Make an Impact</span>
          <h2 className={styles.sectionTitle}>Make a Difference with Your Donation</h2>
          <p className={styles.sectionSub}>
            Every penny counts. Your generosity significantly impacts our collective mission - creating ripples of change across Bangladesh.
          </p>
        </div>

        <div className={styles.inlineDonateRight}>
          <div className={styles.fieldLabel}>Select Amount (BDT)</div>
          <div className={styles.inlineAmountGrid}>
            {amountOptions.map((amount) => (
              <button
                key={amount}
                type="button"
                className={`${styles.inlineAmountButton} ${currentAmt2 === amount && inlineCustomValue.length === 0 ? styles.inlineAmountButtonActive : ""}`}
                onClick={() => onAmountPick(amount)}
              >
                BDT {amount.toLocaleString()}
              </button>
            ))}
          </div>

          <div className={styles.inlineImpact}>{inlineImpact}</div>

          <div className={styles.inlineInputRow}>
            <input
              className={styles.inlineInput}
              type="number"
              placeholder="BDT Other amount"
              value={inlineCustomValue}
              onChange={(event) => onCustomAmountChange(event.target.value)}
            />
            <button type="button" className={styles.inlineDonateButton}>
              Donate
            </button>
          </div>

          <div className={styles.inlineFrequencyNote}>Secure payment - Zakat accepted - bKash / Nagad / Bank</div>
        </div>
      </div>
    </section>
  );
}
