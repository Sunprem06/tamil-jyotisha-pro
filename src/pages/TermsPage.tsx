import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BackButton } from "@/components/BackButton";

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container py-12 max-w-3xl prose prose-headings:font-tamil dark:prose-invert">
        <BackButton />
        <h1 className="text-3xl font-bold font-tamil">விதிமுறைகள் & நிபந்தனைகள்</h1>
        <p className="text-muted-foreground">Terms & Conditions — Last updated: April 2026</p>
        <p className="text-sm text-muted-foreground font-tamil">
          இந்த விதிமுறைகள் இந்திய சட்டத்தின் கீழ் உருவாக்கப்பட்டுள்ளன. தயவுசெய்து கவனமாக படிக்கவும்.
        </p>

        <hr />

        <h2>1. Definitions & Interpretation</h2>
        <ul>
          <li><strong>"Platform"</strong> means Tamil Jothidam Pro (web application, mobile site, and all associated services) owned and operated by <strong>Maanagarram Hi Tech Solutions</strong>, a proprietorship registered in Chennai, Tamil Nadu, India.</li>
          <li><strong>"User"</strong> or <strong>"You"</strong> means any person who accesses, registers, or uses the Platform.</li>
          <li><strong>"Services"</strong> include astrology tools (birth chart, dasha, dosha, transit, porutham), temple information, matrimony matching, and any premium/paid features.</li>
          <li><strong>"Credits"</strong> means the in-app virtual currency purchased by Users to unlock premium features such as contact information.</li>
        </ul>

        <h2>2. Acceptance of Terms</h2>
        <p>By accessing or using the Platform, you irrevocably agree to be bound by these Terms & Conditions, our Privacy Policy, and our Refund Policy. If you do not agree, you must immediately cease using the Platform. Continued use after any amendment constitutes acceptance of the revised terms as per <strong>Section 10A of the Indian Contract Act, 1872</strong>.</p>

        <h2>3. Eligibility</h2>
        <ul>
          <li>You must be at least <strong>18 years old</strong> to create an account, as per the <strong>Indian Majority Act, 1875</strong>.</li>
          <li>For Matrimony services, users must be of legal marriageable age under <strong>The Prohibition of Child Marriage Act, 2006</strong> (21 for males, 18 for females).</li>
          <li>By registering, you represent that all information provided is accurate, current, and complete.</li>
        </ul>

        <h2>4. User Accounts & Obligations</h2>
        <ul>
          <li>You are solely responsible for maintaining the confidentiality and security of your login credentials as per <strong>Section 43A of the Information Technology Act, 2000</strong>.</li>
          <li>One account per person. Creation of duplicate, fake, or impersonation accounts is a violation of <strong>Section 66D of the IT Act, 2000</strong> (cheating by personation using computer resource) and will result in permanent ban and potential legal action.</li>
          <li>You shall not use the Platform for any unlawful purpose, including but not limited to fraud, harassment, stalking, or defamation as defined under <strong>Sections 499-502 of the Indian Penal Code, 1860</strong> and <strong>Sections 66A-66E of the IT Act, 2000</strong>.</li>
          <li>Any automated scraping, data mining, or unauthorized access constitutes a criminal offense under <strong>Section 43 of the IT Act, 2000</strong>, punishable with compensation up to ₹5 crore.</li>
        </ul>

        <h2>5. Nature of Astrological Services — Disclaimer</h2>
        <p className="font-tamil text-sm bg-muted p-4 rounded-lg border">
          ⚠️ <strong>முக்கிய அறிவிப்பு:</strong> இந்த பயன்பாட்டில் வழங்கப்படும் ஜோதிட பலன்கள், கிரக நிலைகள், தசா புத்தி, தோஷ பரிசோதனை, பொருத்தம் மற்றும் பரிகாரங்கள் அனைத்தும் <strong>கலாச்சார மற்றும் ஆன்மீக நோக்கங்களுக்காக மட்டுமே</strong>. இவை மருத்துவ, சட்ட, நிதி அல்லது தொழில்முறை ஆலோசனையாக கருதப்படக்கூடாது.
        </p>
        <ul>
          <li>Astrological predictions, horoscope matching, dasha/dosha analysis, and remedies are provided <strong>for cultural, spiritual, and informational purposes only</strong>.</li>
          <li>The Platform makes <strong>no warranty or guarantee</strong> regarding the accuracy, reliability, or outcome of any astrological calculation or prediction.</li>
          <li>Users acknowledge that decisions made based on astrological information are <strong>entirely at their own risk and discretion</strong>.</li>
          <li>The Platform shall not be liable for any loss, damage, or consequence arising from reliance on astrological content, as per <strong>Section 79 of the IT Act, 2000</strong> (intermediary liability exemption).</li>
        </ul>

        <h2>6. Matrimony Services — Special Terms</h2>
        <ul>
          <li>All matrimony profiles are subject to admin review and approval before becoming publicly visible.</li>
          <li>Contact information (phone, email) is protected and requires Credits to unlock. Once unlocked, the credit transaction is final and non-reversible.</li>
          <li>Users must obtain explicit consent before sharing contact information obtained through the Platform.</li>
          <li>Misuse of contact information for harassment or unsolicited communication constitutes a violation of <strong>Section 354D IPC</strong> (stalking) and <strong>The Sexual Harassment of Women at Workplace Act, 2013</strong> where applicable.</li>
          <li>The Platform acts solely as an <strong>intermediary</strong> as defined under <strong>Section 2(1)(w) of the IT Act, 2000</strong> and is not a party to any matrimonial negotiations or agreements between users.</li>
          <li>Horoscope matching (Porutham) results are indicative and should not be the sole basis for marriage decisions.</li>
        </ul>

        <h2>7. Credits, Subscriptions & Payment Terms</h2>
        <ul>
          <li>Credits are a virtual, non-transferable currency valid only within the Platform.</li>
          <li>All payments are processed in <strong>Indian Rupees (INR)</strong> through authorized payment gateways compliant with <strong>RBI Payment and Settlement Systems Act, 2007</strong>.</li>
          <li>Subscription plans auto-renew at the end of each billing cycle unless cancelled before renewal. Cancellation takes effect at the end of the current paid period.</li>
          <li>Prices may be revised with <strong>30 days prior notice</strong>. Continued use after price revision constitutes acceptance.</li>
          <li>GST and applicable taxes are included/charged as per <strong>the Goods and Services Tax Act, 2017</strong>.</li>
          <li>For refund terms, please refer to our <strong><a href="/refund-policy">Refund Policy</a></strong>.</li>
        </ul>

        <h2>8. Intellectual Property Rights</h2>
        <ul>
          <li>All content, design, code, algorithms, temple data, astrological engines, branding, and visual elements are the exclusive property of Maanagarram Hi Tech Solutions, protected under the <strong>Copyright Act, 1957</strong> and <strong>Trade Marks Act, 1999</strong>.</li>
          <li>Users are granted a <strong>limited, non-exclusive, non-transferable, revocable license</strong> to access and use the Platform for personal, non-commercial purposes only.</li>
          <li>Unauthorized reproduction, distribution, or derivative works constitute infringement under <strong>Section 51 of the Copyright Act, 1957</strong>, punishable with imprisonment up to 3 years and fine up to ₹2 lakh.</li>
        </ul>

        <h2>9. Content Moderation & Reporting</h2>
        <ul>
          <li>The Platform reserves the right to remove, suspend, or flag any profile, content, or user that violates these terms without prior notice.</li>
          <li>Our automated fraud detection system actively monitors user behavior patterns as per <strong>Rule 3(1)(b) of the IT (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021</strong>.</li>
          <li>Users may report violations through the in-app reporting mechanism. All reports are reviewed within 72 hours as mandated by <strong>Rule 3(1)(a) of the IT Rules, 2021</strong>.</li>
          <li>A designated <strong>Grievance Officer</strong> is appointed as per <strong>Rule 3(2) of the IT Rules, 2021</strong>.</li>
        </ul>

        <h2>10. Limitation of Liability</h2>
        <ul>
          <li>To the maximum extent permitted by law, the Platform, its owners, directors, employees, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from use of the Services.</li>
          <li>The Platform's total aggregate liability shall not exceed the amount paid by the User in the <strong>preceding 3 months</strong>.</li>
          <li>The Platform is not liable for service interruptions caused by force majeure events including but not limited to natural disasters, government orders, internet outages, or server failures — as recognized under <strong>Section 56 of the Indian Contract Act, 1872</strong> (doctrine of frustration).</li>
          <li>As an intermediary, the Platform claims protection under <strong>Section 79 of the IT Act, 2000</strong> for third-party content and user-generated information.</li>
        </ul>

        <h2>11. Indemnification</h2>
        <p>You agree to indemnify, defend, and hold harmless the Platform, its owners, employees, and agents from and against all claims, damages, losses, liabilities, costs, and expenses (including legal fees) arising from your use of the Platform, violation of these Terms, or infringement of any third-party rights.</p>

        <h2>12. Termination</h2>
        <ul>
          <li>The Platform may suspend or terminate your account at any time for violation of these Terms, without refund of unused Credits or subscription fees.</li>
          <li>Upon termination, your right to access the Platform ceases immediately. Data deletion follows our Privacy Policy timeline.</li>
          <li>Sections 5, 8, 10, 11, 13, and 14 survive termination.</li>
        </ul>

        <h2>13. Governing Law & Jurisdiction</h2>
        <p>These Terms are governed by and construed in accordance with the laws of <strong>India</strong>. Any dispute arising out of or in connection with these Terms shall be subject to the <strong>exclusive jurisdiction of the courts in Chennai, Tamil Nadu, India</strong>.</p>
        <ul>
          <li>Applicable laws include: <strong>Indian Contract Act, 1872</strong>; <strong>Information Technology Act, 2000</strong> and its Rules; <strong>Consumer Protection Act, 2019</strong>; <strong>Digital Personal Data Protection Act, 2023</strong>.</li>
          <li>Before approaching courts, parties shall attempt resolution through <strong>mediation</strong> as per the <strong>Mediation Act, 2023</strong>.</li>
        </ul>

        <h2>14. Dispute Resolution — Arbitration</h2>
        <ul>
          <li>Any dispute not resolved through mediation shall be referred to <strong>binding arbitration</strong> under the <strong>Arbitration and Conciliation Act, 1996</strong> (as amended in 2019).</li>
          <li>The seat of arbitration shall be <strong>Chennai, Tamil Nadu</strong>.</li>
          <li>The arbitration shall be conducted by a <strong>sole arbitrator</strong> appointed mutually or, failing agreement, appointed by the Chennai High Court.</li>
          <li>The language of arbitration shall be <strong>English</strong>.</li>
          <li>The arbitrator's award shall be final and binding.</li>
        </ul>

        <h2>15. Severability</h2>
        <p>If any provision of these Terms is held to be invalid or unenforceable by a court of competent jurisdiction, the remaining provisions shall continue in full force and effect.</p>

        <h2>16. Entire Agreement</h2>
        <p>These Terms, together with the Privacy Policy and Refund Policy, constitute the entire agreement between you and the Platform regarding your use of the Services, superseding all prior agreements.</p>

        <h2>17. Grievance Redressal</h2>
        <div className="bg-muted p-4 rounded-lg border text-sm">
          <p><strong>Grievance Officer (as per IT Rules, 2021):</strong></p>
          <p>Name: Maanagarram Hi Tech Solutions</p>
          <p>Email: grievance@tamiljothidampro.com</p>
          <p>Address: Chennai, Tamil Nadu, India</p>
          <p>Response time: Within 24 hours of receipt. Resolution within 15 days as per <strong>Rule 3(2) of the IT Rules, 2021</strong>.</p>
        </div>

        <h2>18. Amendments</h2>
        <p>The Platform reserves the right to modify these Terms at any time. Significant changes will be notified via email or in-app notification. Continued use after 30 days of notification constitutes acceptance.</p>

        <hr />
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Maanagarram Hi Tech Solutions. All rights reserved.
        </p>
      </main>
      <Footer />
    </div>
  );
}
