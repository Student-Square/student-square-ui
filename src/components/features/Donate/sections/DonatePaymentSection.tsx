import Image from "next/image";
import styles from "../DonateExperience.module.css";

const methods = [
  { src: "/images/bkash-logo.webp", alt: "bKash", label: "bKash" },
  { src: "/images/Nagad-Logo.png", alt: "Nagad", label: "Nagad" },
  { src: "/images/rocket-logo.png", alt: "Rocket", label: "Rocket" },
];

const CardIcon = () => (
  <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" width="26" height="26">
    <rect x="3" y="7" width="22" height="14" rx="2.5" stroke="#2e7d32" strokeWidth="1.8" />
    <path d="M3 11h22" stroke="#4caf50" strokeWidth="1.8" strokeLinecap="round" />
    <rect x="6" y="15" width="5" height="2.5" rx="0.8" fill="#4caf50" opacity="0.7" />
  </svg>
);

const ShieldIcon = () => (
  <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" width="26" height="26">
    <path d="M14 4l9 3.5v7c0 5-3.8 8.5-9 10-5.2-1.5-9-5-9-10v-7L14 4z" stroke="#2e7d32" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M10 14l2.5 2.5L18 11" stroke="#4caf50" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function DonatePaymentSection() {
  return (
    <section className={styles.payment} id="payment">
      <div data-donate-reveal="true" className={styles.reveal}>
        <span className={styles.sectionEyebrow}>Payment Methods</span>
        <h2 className={styles.sectionTitle}>Pay Securely via SSLCommerz</h2>
        <p className={styles.sectionSub}>
          All donations are processed through SSLCommerz — Bangladesh&apos;s leading payment gateway. Your payment is encrypted and secure.
        </p>
      </div>

      <div data-donate-reveal="true" className={`${styles.paymentGrid} ${styles.reveal}`}>
        {/* Card payments */}
        <article className={styles.paymentCard}>
          <div className={styles.paymentCardHeader}>
            <div className={styles.paymentCardIcon}>
              <CardIcon />
            </div>
            <div>
              <h3 className={styles.paymentCardTitle}>Debit / Credit Card</h3>
              <p className={styles.paymentCardSubtitle}>All major banks</p>
            </div>
          </div>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            Pay using any Visa, Mastercard, or local bank debit card. Your card details are handled directly by SSLCommerz — we never see them.
          </p>
        </article>

        {/* Mobile banking */}
        <article className={styles.paymentCard}>
          <div className={styles.paymentCardHeader}>
            <div className={styles.paymentCardIcon}>
              <ShieldIcon />
            </div>
            <div>
              <h3 className={styles.paymentCardTitle}>Mobile Banking</h3>
              <p className={styles.paymentCardSubtitle}>bKash · Nagad · Rocket</p>
            </div>
          </div>
          <div className={styles.paymentChannels}>
            {methods.map((m) => (
              <div key={m.alt} className={styles.paymentChannel}>
                <div className={styles.paymentChannelLogo}>
                  <Image src={m.src} alt={m.alt} width={44} height={44} className={styles.paymentChannelImg} />
                </div>
                <div className={styles.paymentChannelInfo}>
                  <div className={styles.paymentChannelName}>{m.label}</div>
                </div>
              </div>
            ))}
          </div>
        </article>

        {/* Internet banking */}
        <article className={styles.paymentCard}>
          <div className={styles.paymentCardHeader}>
            <div className={styles.paymentCardIcon}>
              <CardIcon />
            </div>
            <div>
              <h3 className={styles.paymentCardTitle}>Internet Banking</h3>
              <p className={styles.paymentCardSubtitle}>50+ banks supported</p>
            </div>
          </div>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            Pay directly from your bank account via internet banking. Supported by all major Bangladeshi banks through the SSLCommerz gateway.
          </p>
        </article>
      </div>

      <div data-donate-reveal="true" className={`${styles.zakatBanner} ${styles.reveal}`}>
        <div className={styles.zakatIcon}>🌙</div>
        <div className={styles.zakatText}>
          <strong>For Zakat Donations:</strong> Select &quot;Other&quot; in the form and write <strong>&quot;Zakat&quot;</strong> as the purpose.
          Shariah-compliant Zakat &amp; Sadakah accepted. {" · "}
          <em>শরীয়তসম্মত যাকাত ও সাদাকাহ গ্রহণযোগ্য।</em>
        </div>
      </div>
    </section>
  );
}
