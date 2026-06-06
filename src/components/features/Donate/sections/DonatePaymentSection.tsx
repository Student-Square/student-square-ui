import Image from "next/image";
import styles from "../DonateExperience.module.css";

const BankIcon = () => (
  <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" width="26" height="26">
    <path d="M3 10h22M3 10L14 4l11 6M3 10v1h22v-1M6 11v8m4-8v8m4-8v8m4-8v8M3 19h22" stroke="#2e7d32" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="3" y="19" width="22" height="3" rx="1" fill="#4caf50" opacity="0.25" />
  </svg>
);

const MobileIcon = () => (
  <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" width="24" height="24">
    <rect x="8" y="3" width="12" height="22" rx="2.5" stroke="#2e7d32" strokeWidth="1.8" />
    <circle cx="14" cy="21" r="1" fill="#4caf50" />
    <path d="M11 7h6" stroke="#4caf50" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export default function DonatePaymentSection() {
  return (
    <section className={styles.payment} id="payment">
      <div data-donate-reveal="true" className={styles.reveal}>
        <span className={styles.sectionEyebrow}>Payment Methods</span>
        <h2 className={styles.sectionTitle}>How to Donate</h2>
        <p className={styles.sectionSub}>Choose your preferred payment method - all channels are secure and verified.</p>
      </div>

      <div data-donate-reveal="true" className={`${styles.paymentGrid} ${styles.reveal}`}>
        <article className={styles.paymentCard}>
          <div className={styles.paymentCardHeader}>
            <div className={styles.paymentCardIcon}>
              <BankIcon />
            </div>
            <div>
              <h3 className={styles.paymentCardTitle}>Bank Transfer</h3>
              <p className={styles.paymentCardSubtitle}>Islami Bank Bangladesh Ltd.</p>
            </div>
          </div>

          <div className={styles.paymentRow}>
            <span className={styles.paymentKey}>Account Name</span>
            <span className={styles.paymentValue}>Student Square</span>
          </div>
          <div className={styles.paymentRow}>
            <span className={styles.paymentKey}>Account No.</span>
            <span className={styles.paymentValue}>20504450200432414</span>
          </div>
          <div className={styles.paymentRow}>
            <span className={styles.paymentKey}>Branch</span>
            <span className={styles.paymentValue}>Godagari</span>
          </div>
          <div className={styles.paymentRow}>
            <span className={styles.paymentKey}>Swift</span>
            <span className={styles.paymentValue}>IBBLBDDH</span>
          </div>
          <div className={styles.paymentRow}>
            <span className={styles.paymentKey}>Routing</span>
            <span className={styles.paymentValue}>125810512</span>
          </div>
        </article>

        <article className={styles.paymentCard}>
          <div className={styles.paymentCardHeader}>
            <div className={styles.paymentCardIcon}>
              <MobileIcon />
            </div>
            <div>
              <h3 className={styles.paymentCardTitle}>Mobile Banking</h3>
              <p className={styles.paymentCardSubtitle}>Send to personal number</p>
            </div>
          </div>

          <div className={styles.paymentNumberBlock}>
            <div className={styles.paymentNumberLabel}>Send Money To</div>
            <div className={styles.paymentNumber}>01312708777</div>
            <div className={styles.paymentSubline}>Personal - bKash / Nagad / Rocket</div>
          </div>

          <div className={styles.paymentChannels}>
            <div className={styles.paymentChannel}>
              <div className={styles.paymentChannelLogo}>
                <Image src="/images/bkash-logo.webp" alt="bKash" width={44} height={44} className={styles.paymentChannelImg} />
              </div>
              <div className={styles.paymentChannelInfo}>
                <div className={styles.paymentChannelName}>bKash</div>
              </div>
            </div>
            <div className={styles.paymentChannel}>
              <div className={styles.paymentChannelLogo}>
                <Image src="/images/Nagad-Logo.png" alt="Nagad" width={44} height={44} className={styles.paymentChannelImg} />
              </div>
              <div className={styles.paymentChannelInfo}>
                <div className={styles.paymentChannelName}>Nagad</div>
              </div>
            </div>
            <div className={styles.paymentChannel}>
              <div className={styles.paymentChannelLogo}>
                <Image src="/images/rocket-logo.png" alt="Rocket" width={44} height={44} className={styles.paymentChannelImg} />
              </div>
              <div className={styles.paymentChannelInfo}>
                <div className={styles.paymentChannelName}>Rocket</div>
              </div>
            </div>
          </div>
        </article>

        <article className={styles.paymentCard}>
          <div className={styles.paymentImageWrapper}>
            <Image
              src="/images/eid-project-payment.jpg"
              alt="Eid project payment instruction"
              width={480}
              height={640}
              className={styles.paymentImage}
            />
          </div>
        </article>
      </div>

      <div data-donate-reveal="true" className={`${styles.zakatBanner} ${styles.reveal}`}>
        <div className={styles.zakatIcon}>🌙</div>
        <div className={styles.zakatText}>
          <strong>For Zakat Donations:</strong> Please write <strong>&quot;যাকাত&quot;</strong> in the payment reference when sending your Zakat
          contribution. Shariah-compliant Zakat is accepted. {"\u00A0·\u00A0"}
          <em>শরীয়তসম্মত যাকাত ও সাদাকাহ গ্রহণযোগ্য।</em>
        </div>
      </div>
    </section>
  );
}
