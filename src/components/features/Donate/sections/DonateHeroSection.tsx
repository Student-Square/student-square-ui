import { amountOptions, heroStats } from "../constants";
import type { Frequency, ImpactEntry } from "../types";
import styles from "../DonateExperience.module.css";

interface DonateHeroSectionProps {
  currentFreq: Frequency;
  currentAmt: number;
  heroCustomValue: string;
  heroImpact: ImpactEntry;
  onFreqChange: (frequency: Frequency) => void;
  onAmountPick: (amount: number) => void;
  onCustomAmountChange: (value: string) => void;
}

export default function DonateHeroSection({
  currentFreq,
  currentAmt,
  heroCustomValue,
  heroImpact,
  onFreqChange,
  onAmountPick,
  onCustomAmountChange,
}: DonateHeroSectionProps) {
  return (
    <section className={styles.hero} id="donate-main">
      <div className={styles.heroBg} />
      <div className={styles.heroTexture} />
      <div className={`${styles.blob} ${styles.blob1}`} />
      <div className={`${styles.blob} ${styles.blob2}`} />

      <div className={styles.heroInner}>
        <div className={styles.heroLeft}>
          <div className={styles.heroEyebrow}>Student Square Foundation</div>
          <h1>
            Make a <em>Difference</em>
            <br />
            with Your Donation
          </h1>
          <p className={styles.heroDesc}>
            In a world where collective action holds immense power, individual efforts remain invaluable. Your single donation creates
            ripples of change - transforming lives and building a brighter future across Bangladesh.
          </p>
          <div className={styles.heroStats}>
            {heroStats.map((stat) => (
              <div key={stat.label}>
                <div className={styles.hStatNum}>{stat.number}</div>
                <div className={styles.hStatLabel}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.heroRight}>
          <div className={styles.donateCard}>
            <div className={styles.cardHeader}>
              <h2>Your Donation Can Change a Life</h2>
              <div className={styles.freqTabs}>
                <button type="button" className={`${styles.freqTab} ${currentFreq === "monthly" ? styles.freqTabActive : ""}`} onClick={() => onFreqChange("monthly")}>
                  Monthly
                </button>
                <button type="button" className={`${styles.freqTab} ${currentFreq === "onetime" ? styles.freqTabActive : ""}`} onClick={() => onFreqChange("onetime")}>
                  One-Time
                </button>
              </div>
            </div>

            <div className={styles.cardBody}>
              <div className={styles.fieldLabel}>Select Amount (BDT)</div>
              <div className={styles.amountGrid}>
                {amountOptions.map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    className={`${styles.amountButton} ${currentAmt === amount && heroCustomValue.length === 0 ? styles.amountButtonActive : ""}`}
                    onClick={() => onAmountPick(amount)}
                  >
                    BDT {amount.toLocaleString()}
                  </button>
                ))}
              </div>

              <div className={styles.impactPill}>
                <span className={styles.impactIcon}>{heroImpact.icon}</span>
                <span className={styles.impactText}>{heroImpact.text}</span>
              </div>

              <div className={styles.customField}>
                <span className={styles.customPrefix}>BDT</span>
                <input
                  className={styles.customInput}
                  type="number"
                  placeholder="Enter other amount"
                  value={heroCustomValue}
                  onChange={(event) => onCustomAmountChange(event.target.value)}
                />
              </div>

              <div className={styles.donorFields}>
                <input className={styles.donorField} type="text" placeholder="Your Name" autoComplete="name" />
                <input className={styles.donorField} type="tel" placeholder="Phone Number" autoComplete="tel" />
                <input className={`${styles.donorField} ${styles.donorFieldFull}`} type="email" placeholder="Email Address (optional)" autoComplete="email" />
              </div>

              <button type="button" className={styles.donateButton}>
                <span>LOVE</span>
                <span>Donate Now</span>
              </button>

              <div className={styles.secureRow}>Secure and encrypted payment</div>
              <div className={styles.trustBadges}>
                <span className={styles.badge}>bKash</span>
                <span className={styles.badge}>Nagad</span>
                <span className={styles.badge}>Rocket</span>
                <span className={styles.badge}>Bank Transfer</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
