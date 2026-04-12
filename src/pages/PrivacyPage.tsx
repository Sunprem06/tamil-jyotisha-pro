import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container py-12 max-w-3xl prose prose-headings:font-tamil">
        <h1 className="text-3xl font-bold font-tamil">தனியுரிமைக் கொள்கை</h1>
        <p className="text-muted-foreground">Privacy Policy — Last updated: April 2026</p>

        <h2>1. Information We Collect</h2>
        <ul>
          <li><strong>Account Data:</strong> Name, email, phone number, password (hashed).</li>
          <li><strong>Profile Data:</strong> Date of birth, gender, caste, religion, education, occupation, photos, family details.</li>
          <li><strong>Astrological Data:</strong> Birth date, time, and place for horoscope calculations.</li>
          <li><strong>Usage Data:</strong> Pages visited, features used, messages sent, search queries.</li>
          <li><strong>Payment Data:</strong> Transaction history, subscription details. Payment card details are processed by Stripe and never stored on our servers.</li>
        </ul>

        <h2>2. How We Use Your Information</h2>
        <ul>
          <li>To provide astrology and matrimony matching services.</li>
          <li>To verify profiles and maintain platform integrity (trust scoring, fraud detection).</li>
          <li>To process payments and manage subscriptions.</li>
          <li>To communicate important updates about your account.</li>
          <li>To improve our services through anonymized analytics.</li>
        </ul>

        <h2>3. Data Sharing</h2>
        <ul>
          <li>Your public matrimony profile is visible to authenticated users.</li>
          <li>Contact information (phone) is only shared after a credit-based unlock with audit trail.</li>
          <li>We do not sell, rent, or trade personal data to third parties.</li>
          <li>We may share data with law enforcement when required by Indian law.</li>
        </ul>

        <h2>4. Data Protection (DPDPA 2023 Compliance)</h2>
        <ul>
          <li>All data is encrypted in transit (TLS 1.3) and at rest.</li>
          <li>Row-Level Security ensures users can only access their own data.</li>
          <li>Admin access is role-based with granular permissions and full audit logging.</li>
          <li>You have the right to access, correct, or delete your personal data.</li>
        </ul>

        <h2>5. Data Retention</h2>
        <ul>
          <li>Active accounts: Data retained as long as the account is active.</li>
          <li>Deleted accounts: Personal data is purged within 30 days, except where legally required to retain.</li>
          <li>Audit logs: Retained for 3 years for compliance and dispute resolution.</li>
        </ul>

        <h2>6. Cookies</h2>
        <p>We use essential cookies for authentication session management. No third-party tracking cookies are used.</p>

        <h2>7. Children's Privacy</h2>
        <p>Our platform is not intended for users under 18 years of age. We do not knowingly collect data from minors.</p>

        <h2>8. Your Rights</h2>
        <ul>
          <li>Right to access your personal data.</li>
          <li>Right to correction of inaccurate data.</li>
          <li>Right to erasure (right to be forgotten).</li>
          <li>Right to data portability.</li>
          <li>Right to withdraw consent.</li>
        </ul>

        <h2>9. Contact the Data Protection Officer</h2>
        <p>Email: privacy@tamiljothidam.com</p>
      </main>
      <Footer />
    </div>
  );
}
