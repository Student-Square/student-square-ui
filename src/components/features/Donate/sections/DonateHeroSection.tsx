"use client";

import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { amountOptions, heroStats } from "../constants";
import type { ImpactEntry } from "../types";
import styles from "../DonateExperience.module.css";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";
import { useGetCampaignsQuery } from "@/redux/features/campaigns/campaignsApi";
import { useCreateDonationMutation } from "@/redux/features/donations/donationsApi";
import type { CreateDonationBody } from "@/types/donations";

const MIN_AMOUNT = 10;
const OTHER = "__other__";

/** Load SSLCommerz embed.min.js once; resolves when ready. */
function loadEmbedScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.getElementById("ssl-embed-script")) { resolve(); return; }
    const s = document.createElement("script");
    s.id = "ssl-embed-script";
    s.src = src;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Failed to load SSLCommerz embed script"));
    document.body.appendChild(s);
  });
}

interface DonateHeroSectionProps {
  currentAmt: number;
  heroCustomValue: string;
  heroImpact: ImpactEntry;
  onAmountPick: (amount: number) => void;
  onCustomAmountChange: (value: string) => void;
}

export default function DonateHeroSection({
  currentAmt,
  heroCustomValue,
  heroImpact,
  onAmountPick,
  onCustomAmountChange,
}: DonateHeroSectionProps) {
  const user = useSelector(selectCurrentUser);
  const { data: campaigns } = useGetCampaignsQuery({ status: "ACTIVE" });
  const [createDonation, { isLoading }] = useCreateDonationMutation();

  const [target, setTarget] = useState<string>("");
  const [purpose, setPurpose] = useState("");
  const [donorName, setDonorName] = useState(user?.fullName ?? "");
  const [donorPhone, setDonorPhone] = useState("");
  const [donorEmail, setDonorEmail] = useState(user?.email ?? "");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [paying, setPaying] = useState(false);

  // Hidden SSLCommerz Easy Checkout trigger. embed.min.js binds to #sslczPayBtn
  // and, on click, POSTs to its `endpoint` and opens the gateway in an on-page
  // (tingle.js) modal — no new window, no redirect.
  const payBtnRef = useRef<HTMLButtonElement>(null);

  const targetIsOther = target === OTHER;
  const busy = paying || isLoading;

  /** Set up the hidden trigger and open the Easy Checkout modal. */
  const openCheckout = async (embedEndpoint: string, tranId: string, scriptUrl: string): Promise<boolean> => {
    const btn = payBtnRef.current;
    if (!btn) return false;
    btn.setAttribute("endpoint", embedEndpoint);
    btn.setAttribute("order", tranId);
    try {
      await loadEmbedScript(scriptUrl);
    } catch {
      return false;
    }
    // Let embed.min.js bind its handler on first load before we click.
    await new Promise((r) => setTimeout(r, 60));
    btn.click();
    return true;
  };

  const handleDonate = async () => {
    if (!target) return toast.error("Please choose a project or 'Other'.");
    if (targetIsOther && !purpose.trim())
      return toast.error("Please say what your donation is for (e.g. Zakat, Sadakah).");
    if (currentAmt < MIN_AMOUNT)
      return toast.error(`Minimum donation is ${MIN_AMOUNT} BDT.`);
    if (!donorName.trim()) return toast.error("Please enter your name.");
    if (!donorEmail.trim()) return toast.error("Please enter your email.");

    const body: CreateDonationBody = {
      amount: String(currentAmt),
      currency: "BDT",
      kind: targetIsOther ? "OTHER" : "PROJECT",
      campaignId: targetIsOther ? undefined : target,
      purpose: targetIsOther ? purpose.trim() : undefined,
      method: "SSLCOMMERZ",
      donorName: donorName.trim(),
      donorEmail: donorEmail.trim(),
      donorPhone: donorPhone.trim() || undefined,
      isAnonymous,
    };

    setPaying(true);
    try {
      // Create the PENDING donation, then open the on-page payment modal.
      const res = await createDonation(body).unwrap();

      const opened = await openCheckout(res.embedEndpoint, res.donation.tranId, res.embedScriptUrl);
      if (opened) return;

      // Fallback (embed script unavailable): fetch the gateway URL and redirect.
      const embedRes = await fetch(res.embedEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ order: res.donation.tranId }),
      });
      const data = (await embedRes.json()) as { status?: string; data?: string; message?: string };
      if (data.status === "success" && data.data) {
        window.location.href = data.data;
        return;
      }
      toast.error(data.message ?? "Could not start payment. Please try again.");
    } catch {
      // createDonation errors are surfaced by baseApi
    } finally {
      setPaying(false);
    }
  };

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
            </div>

            <div className={styles.cardBody}>
              <div className={styles.giftGroup}>
                <div className={styles.fieldLabel}>Where your gift goes</div>
                <select
                  className={styles.giftSelect}
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  aria-label="Project or purpose"
                >
                  <option value="" disabled>Select a project or purpose…</option>
                  {campaigns?.map((c) => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                  <option value={OTHER}>Other — Zakat, Sadakah, or general fund</option>
                </select>
                {targetIsOther && (
                  <input
                    className={`${styles.donorField} ${styles.giftPurpose}`}
                    type="text"
                    placeholder="e.g. Zakat, Sadakah, General fund"
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                  />
                )}
              </div>

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
                <input
                  className={styles.donorField}
                  type="text"
                  placeholder="Your Name"
                  autoComplete="name"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                />
                <input
                  className={styles.donorField}
                  type="tel"
                  placeholder="Phone Number"
                  autoComplete="tel"
                  value={donorPhone}
                  onChange={(e) => setDonorPhone(e.target.value)}
                />
                <input
                  className={`${styles.donorField} ${styles.donorFieldFull}`}
                  type="email"
                  placeholder="Email Address"
                  autoComplete="email"
                  value={donorEmail}
                  onChange={(e) => setDonorEmail(e.target.value)}
                />
              </div>

              <label className={styles.anonRow}>
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                />
                Make my donation anonymous
              </label>

              <button
                type="button"
                className={styles.donateButton}
                onClick={() => void handleDonate()}
                disabled={busy}
              >
                {busy ? (
                  <span>Opening secure payment…</span>
                ) : (
                  <>
                    <span>LOVE</span>
                    <span>Donate BDT {currentAmt.toLocaleString()}</span>
                  </>
                )}
              </button>

              {/* Hidden SSLCommerz Easy Checkout trigger (bound by embed.min.js) */}
              <button id="sslczPayBtn" ref={payBtnRef} type="button" style={{ display: "none" }} aria-hidden="true" tabIndex={-1} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
