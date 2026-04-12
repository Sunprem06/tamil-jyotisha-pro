import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BackButton } from "@/components/BackButton";
import { Link } from "react-router-dom";

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container py-12 max-w-3xl prose prose-headings:font-tamil dark:prose-invert">
        <BackButton />
        <h1 className="text-3xl font-bold font-tamil">திரும்பப்பெறுதல் கொள்கை</h1>
        <p className="text-muted-foreground">Refund & Cancellation Policy — Last updated: April 2026</p>
        <p className="text-sm text-muted-foreground font-tamil">
          இந்த திரும்பப்பெறுதல் கொள்கை இந்திய நுகர்வோர் பாதுகாப்பு சட்டம், 2019 மற்றும் தகவல் தொழில்நுட்பச் சட்டம், 2000 ஆகியவற்றின் கீழ் உருவாக்கப்பட்டுள்ளது.
        </p>

        <hr />

        <h2>1. Scope & Applicability</h2>
        <p>This Refund & Cancellation Policy applies to all paid transactions on ஆன்மீகத் துணை, including but not limited to:</p>
        <ul>
          <li>Purchase of Credits (virtual currency for contact unlocks)</li>
          <li>Subscription plans (Monthly / Yearly premium access)</li>
          <li>Any other paid services offered on the Platform</li>
        </ul>
        <p>This policy is governed by the <strong>Consumer Protection Act, 2019</strong>, <strong>Consumer Protection (E-Commerce) Rules, 2020</strong>, and applicable RBI guidelines.</p>

        <h2>2. Nature of Digital Services — No Physical Goods</h2>
        <div className="bg-muted p-4 rounded-lg border text-sm font-tamil">
          ⚠️ <strong>முக்கிய குறிப்பு:</strong> ஆன்மீகத் துணை முழுவதுமாக டிஜிட்டல் சேவை தளம். இது உடல்சார்ந்த பொருட்களை விற்பனை செய்யாது. எனவே, பொருட்களை திருப்பி அனுப்புதல் (return) எனும் கொள்கை இதற்கு பொருந்தாது.
        </div>
        <p>As the Platform provides <strong>purely digital services</strong> (astrological calculations, temple information, matrimony matching), there are no physical goods involved. Therefore, physical product return policies under Section 2(7) of the Consumer Protection Act, 2019 are not applicable.</p>

        <h2>3. Credits — Refund Policy</h2>
        <h3>3.1 Non-Refundable Scenarios (No Refund)</h3>
        <ul>
          <li><strong>Used Credits:</strong> Credits that have been utilized to unlock contact information, access premium features, or avail any service are <strong>non-refundable</strong>. The service is deemed delivered upon unlock/access.</li>
          <li><strong>Partial Usage:</strong> If credits from a purchased bundle have been partially used, only unused credits may be considered for refund (see Section 3.2).</li>
          <li><strong>Voluntary Account Deletion:</strong> If you voluntarily delete your account, any remaining unused credits are forfeited and non-refundable.</li>
          <li><strong>Terms Violation:</strong> If your account is suspended or terminated due to violation of Terms & Conditions, all credits are forfeited without refund.</li>
          <li><strong>Change of Mind:</strong> Refunds are not available for change of mind after service delivery as per <strong>Section 2(9) of the Consumer Protection Act, 2019</strong> — the service constitutes a "digital service" consumed upon access.</li>
        </ul>

        <h3>3.2 Refundable Scenarios</h3>
        <ul>
          <li><strong>Technical Failure:</strong> If credits were deducted but the corresponding service was not delivered due to a verified technical error on our end (server error, payment gateway glitch), a full credit restoration or refund will be issued within <strong>7 working days</strong>.</li>
          <li><strong>Duplicate Payment:</strong> If a user is charged multiple times for the same transaction due to payment gateway error, the duplicate amount will be refunded within <strong>5-7 working days</strong> as per <strong>RBI Circular on Turn Around Time (TAT) for Resolution of Failed Transactions (2019)</strong>.</li>
          <li><strong>Unauthorized Transaction:</strong> If you report an unauthorized payment within <strong>3 working days</strong> as per <strong>RBI Master Direction on Digital Payment Security Controls (2021)</strong>, we will investigate and refund if the claim is verified.</li>
        </ul>

        <h2>4. Subscription Plans — Cancellation & Refund</h2>
        <h3>4.1 Cancellation</h3>
        <ul>
          <li>Users may cancel their subscription at any time through their account settings.</li>
          <li>Cancellation takes effect at the <strong>end of the current billing period</strong>. You will continue to have access to premium features until the period expires.</li>
          <li>No partial refund will be issued for the unused portion of the current billing period.</li>
        </ul>

        <h3>4.2 Auto-Renewal</h3>
        <ul>
          <li>Subscriptions auto-renew at the end of each billing cycle (monthly/yearly) unless cancelled at least <strong>24 hours before</strong> the renewal date.</li>
          <li>Renewal charges are applied at the then-current rate. Price changes are communicated <strong>30 days in advance</strong>.</li>
          <li>If auto-renewal fails due to insufficient funds or expired card, the subscription will be suspended and premium access revoked.</li>
        </ul>

        <h3>4.3 Subscription Refund</h3>
        <ul>
          <li><strong>Within 48 hours (Cooling-off Period):</strong> If you cancel a new subscription within 48 hours of the first purchase AND have not used any premium features, a full refund may be issued at our discretion. This cooling-off period is provided in the spirit of fair dealing under <strong>Section 2(9) and Section 2(46) of the Consumer Protection Act, 2019</strong>.</li>
          <li><strong>After 48 hours:</strong> No refund for cancellation. Access continues until the end of the paid period.</li>
          <li><strong>Annual plans:</strong> For yearly subscriptions, the 48-hour cooling-off period applies from the date of purchase. After this window, no pro-rata refund is available.</li>
        </ul>

        <h2>5. Refund Process</h2>
        <ol>
          <li><strong>Submit Request:</strong> Email <strong>refund@anmeegathunai.com</strong> with your registered email, transaction ID, date of purchase, and reason for refund.</li>
          <li><strong>Acknowledgment:</strong> You will receive an acknowledgment within <strong>24 hours</strong>.</li>
          <li><strong>Review:</strong> Our team will review and verify the request within <strong>3-5 working days</strong>.</li>
          <li><strong>Decision:</strong> You will be notified of the decision via email. If approved, the refund is processed to the original payment method.</li>
          <li><strong>Processing Time:</strong>
            <ul>
              <li>UPI / Net Banking: 3-5 working days</li>
              <li>Credit / Debit Card: 5-7 working days</li>
              <li>Wallet: 1-3 working days</li>
            </ul>
          </li>
        </ol>
        <p>Refund timelines comply with <strong>RBI's Turn Around Time (TAT) Circular dated September 2019</strong> for resolution of failed/disputed transactions.</p>

        <h2>6. Chargebacks & Disputes</h2>
        <ul>
          <li>Users must contact us directly before initiating a chargeback with their bank or card issuer.</li>
          <li>Fraudulent chargebacks (where the service was duly received) will be treated as a violation of the Terms and may result in account suspension, blacklisting, and legal action under <strong>Section 420 IPC</strong> (cheating) and <strong>Section 66D IT Act</strong>.</li>
          <li>The Platform reserves the right to share transaction evidence with payment processors and financial institutions to contest illegitimate chargebacks.</li>
        </ul>

        <h2>7. Free Services — No Refund Applicable</h2>
        <p>The following services are provided <strong>free of charge</strong> and no refund question arises:</p>
        <ul>
          <li>Daily horoscope (ராசிபலன்)</li>
          <li>Birth chart generation (ஜாதக கட்டம்)</li>
          <li>Panchangam (பஞ்சாங்கம்)</li>
          <li>Temple search and information</li>
          <li>Basic matrimony profile creation</li>
        </ul>

        <h2>8. Force Majeure</h2>
        <p>The Platform shall not be liable for any delay or failure in providing services due to events beyond its reasonable control, including natural disasters, government actions, internet outages, cyber attacks, pandemic restrictions, or server infrastructure failures. No refund shall be due for temporary service disruptions caused by force majeure events, as per <strong>Section 56 of the Indian Contract Act, 1872</strong>.</p>

        <h2>9. Governing Law</h2>
        <p>This Refund Policy is governed by the laws of India. Disputes shall be subject to the exclusive jurisdiction of courts in <strong>Chennai, Tamil Nadu</strong>. Dispute resolution follows the arbitration clause specified in our <Link to="/terms" className="text-primary">Terms & Conditions</Link>.</p>

        <h2>10. Amendments</h2>
        <p>This Refund Policy may be updated from time to time. Changes will be communicated via email or in-app notification. The updated policy takes effect 30 days after notification.</p>

        <h2>11. Consumer Rights Preserved</h2>
        <div className="bg-muted p-4 rounded-lg border text-sm">
          <p>Nothing in this policy shall limit or exclude any rights that you have under mandatory provisions of Indian consumer protection law that cannot be contractually waived, including your right to approach the <strong>Consumer Disputes Redressal Commission</strong> under the <strong>Consumer Protection Act, 2019</strong>.</p>
        </div>

        <h2>12. Contact for Refund Queries</h2>
        <div className="bg-muted p-4 rounded-lg border text-sm">
          <p><strong>Refund Support:</strong></p>
          <p>Email: refund@anmeegathunai.com</p>
          <p>Grievance Officer: grievance@anmeegathunai.com</p>
          <p>Address: Maanagarram Hi Tech Solutions, Chennai, Tamil Nadu, India</p>
          <p>Response: Within 24 hours. Resolution within 15 days.</p>
        </div>

        <hr />
        <p className="text-xs text-muted-foreground">
          Legal references: Consumer Protection Act, 2019 (No. 35 of 2019) • Consumer Protection (E-Commerce) Rules, 2020 • Information Technology Act, 2000 (No. 21 of 2000) • IT (Intermediary Guidelines) Rules, 2021 • Indian Contract Act, 1872 • RBI Master Directions on Digital Payment Security Controls • Arbitration and Conciliation Act, 1996
        </p>
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Maanagarram Hi Tech Solutions. All rights reserved.
        </p>
      </main>
      <Footer />
    </div>
  );
}
