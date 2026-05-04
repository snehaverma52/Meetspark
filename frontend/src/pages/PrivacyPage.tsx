export default function PrivacyPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      
      <div>
        <h1 className="text-3xl font-bold text-foreground">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>

      <div className="glass-card p-6 space-y-6 text-sm text-muted-foreground leading-relaxed">

        <p>
          Welcome to MeetSum AI. Your privacy is important to us. This Privacy Policy explains how we collect,
          use, and protect your information when you use our platform.
        </p>

        <section>
          <h2 className="text-lg font-semibold text-foreground">1. Information We Collect</h2>
          <p>
            We may collect personal information such as your name, email address, and account details when you
            sign up for our service.
          </p>
          <p>
            We also collect meeting content, including uploaded videos, transcripts, and generated summaries.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">2. How We Use Your Information</h2>
          <p>
            We use your information to:
          </p>
          <ul className="list-disc pl-5">
            <li>Provide AI-powered meeting summaries</li>
            <li>Improve our services and user experience</li>
            <li>Communicate important updates</li>
            <li>Ensure platform security</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">3. Data Storage</h2>
          <p>
            Your data is securely stored in our database and protected using industry-standard security measures.
          </p>
          <p>
            Uploaded files and generated outputs may be stored temporarily for processing and future access.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">4. Sharing of Information</h2>
          <p>
            We do not sell or rent your personal data. Your information is only shared with trusted services
            necessary to operate our platform (such as cloud storage and authentication providers).
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">5. Security</h2>
          <p>
            We implement strict security measures to protect your data from unauthorized access, alteration, or
            disclosure.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">6. Cookies</h2>
          <p>
            We may use cookies to enhance user experience and analyze traffic. You can disable cookies in your
            browser settings.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">7. Your Rights</h2>
          <p>
            You have the right to access, update, or delete your personal data at any time by contacting us.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">8. Third-Party Services</h2>
          <p>
            We use third-party services such as Clerk (authentication), Supabase (database), and Razorpay
            (payments). These services have their own privacy policies.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">9. Changes to Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Changes will be reflected on this page.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">10. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, you can contact us at:
          </p>
          <p>Email: support@meetsum.ai</p>
        </section>

      </div>
    </div>
  );
}