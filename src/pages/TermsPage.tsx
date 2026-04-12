import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BackButton } from "@/components/BackButton";

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container py-12 max-w-3xl prose prose-headings:font-tamil">
        <BackButton />
        <h1 className="text-3xl font-bold font-tamil">விதிமுறைகள் & நிபந்தனைகள்</h1>
        <p className="text-muted-foreground">Terms of Service — Last updated: April 2026</p>

        <h2>1. Acceptance of Terms</h2>
        <p>By using Tamil Jothidam ("the Platform"), you agree to these Terms of Service. If you do not agree, do not use the Platform.</p>

        <h2>2. Eligibility</h2>
        <p>You must be at least 18 years old to create an account. Matrimony profiles require users to be of legal marriageable age as per Indian law (21 for males, 18 for females).</p>

        <h2>3. User Accounts</h2>
        <ul>
          <li>You are responsible for maintaining the confidentiality of your login credentials.</li>
          <li>You agree to provide accurate, current, and complete information during registration.</li>
          <li>One account per person. Duplicate or fake profiles will be permanently banned.</li>
        </ul>

        <h2>4. Matrimony Services</h2>
        <ul>
          <li>All matrimony profiles are subject to admin approval before becoming publicly visible.</li>
          <li>Contact information is protected and requires credits to unlock.</li>
          <li>Users must obtain consent before sharing contact information obtained through the platform.</li>
          <li>Horoscope matching is provided for informational purposes and should not be the sole basis for marriage decisions.</li>
        </ul>

        <h2>5. Credits & Payments</h2>
        <ul>
          <li>Credits are non-refundable once used for contact unlocks.</li>
          <li>Subscription fees are billed per the chosen plan (monthly/yearly) in Indian Rupees (INR).</li>
          <li>Cancellation of subscriptions takes effect at the end of the current billing period.</li>
        </ul>

        <h2>6. Prohibited Conduct</h2>
        <ul>
          <li>Posting false, misleading, or deceptive profile information.</li>
          <li>Harassment, hate speech, or discriminatory behavior.</li>
          <li>Soliciting money or financial information from other users.</li>
          <li>Using the platform for any unlawful purpose.</li>
          <li>Scraping, data mining, or automated access to the platform.</li>
        </ul>

        <h2>7. Content Moderation</h2>
        <p>We reserve the right to remove, suspend, or flag any profile or content that violates these terms. Our fraud detection system actively monitors user behavior.</p>

        <h2>8. Limitation of Liability</h2>
        <p>Tamil Jothidam is not responsible for the accuracy of astrological predictions, user-provided information, or outcomes of marriages facilitated through the platform.</p>

        <h2>9. Governing Law</h2>
        <p>These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in Chennai, Tamil Nadu.</p>

        <h2>10. Contact</h2>
        <p>For questions about these terms, contact us at support@tamiljothidam.com.</p>
      </main>
      <Footer />
    </div>
  );
}
