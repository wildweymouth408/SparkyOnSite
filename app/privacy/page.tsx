// app/privacy/page.tsx

export default function PrivacyPolicy() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 text-sm text-foreground">
      <h1 className="text-2xl font-bold mb-1">Privacy Policy</h1>
      <p className="text-muted-foreground mb-6">Last updated: March 2026</p>

      <p className="text-muted-foreground leading-relaxed mb-6">
        Sparky is a tool built by an electrician, for electricians. This policy explains what data
        we collect, why we collect it, and what you can do with it. No marketing BS.
      </p>

      <section className="mb-6">
        <h2 className="text-base font-semibold mb-2">What We Collect</h2>
        <ul className="text-muted-foreground leading-relaxed space-y-2 list-disc list-inside">
          <li>
            <strong>Account info:</strong> Email address and password (hashed) when you sign up.
          </li>
          <li>
            <strong>Profile data:</strong> Name, license type, years of experience — only what you
            choose to enter. Used to personalize Ask Sparky responses.
          </li>
          <li>
            <strong>Job data:</strong> Job names, locations, notes you create in the Jobs tab.
            Stored in your account only.
          </li>
          <li>
            <strong>AI conversations:</strong> Messages you send to Ask Sparky and the responses
            you receive. Stored to support conversation memory across sessions.
          </li>
          <li>
            <strong>Credentials wallet:</strong> Any credentials you store are encrypted
            client-side using AES-GCM before being stored. We cannot read them.
          </li>
          <li>
            <strong>Usage data:</strong> Which calculators you use and when (no content, just
            activity). Used to understand what&apos;s working and what needs improvement.
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-base font-semibold mb-2">How We Store It</h2>
        <p className="text-muted-foreground leading-relaxed">
          All data is stored in Supabase, a PostgreSQL-based cloud database platform. Supabase is
          SOC 2 compliant and encrypts data at rest and in transit. Your data is stored in the
          United States.
        </p>
        <p className="text-muted-foreground leading-relaxed mt-2">
          AI conversations are sent to Anthropic&apos;s Claude API for processing. Anthropic&apos;s privacy
          policy applies to that data. We do not sell conversation data to third parties.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-base font-semibold mb-2">What We Don&apos;t Do</h2>
        <ul className="text-muted-foreground leading-relaxed space-y-1 list-disc list-inside">
          <li>We do not sell your data.</li>
          <li>We do not show ads.</li>
          <li>We do not share your job data or conversations with third parties.</li>
          <li>We do not track you across other websites.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-base font-semibold mb-2">California Residents (CCPA)</h2>
        <p className="text-muted-foreground leading-relaxed">
          If you are a California resident, you have the right to:
        </p>
        <ul className="text-muted-foreground leading-relaxed space-y-1 list-disc list-inside mt-2">
          <li>Know what personal data we have collected about you.</li>
          <li>Request deletion of your personal data.</li>
          <li>Opt out of the sale of your data (we don&apos;t sell it, but you have the right).</li>
          <li>Not be discriminated against for exercising these rights.</li>
        </ul>
        <p className="text-muted-foreground leading-relaxed mt-2">
          To exercise any of these rights, email us at{" "}
          <a href="mailto:wildweymouth408@gmail.com" className="underline">
            wildweymouth408@gmail.com
          </a>{" "}
          with the subject line &quot;Privacy Request.&quot; We&apos;ll respond within 45 days.
          {/* TODO: Replace with sparky@[domain] before launch */}
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-base font-semibold mb-2">Deleting Your Account</h2>
        <p className="text-muted-foreground leading-relaxed">
          You can delete your account from the More tab at any time. Deleting your account removes
          your profile, job data, and conversation history from our database within 30 days.
          Encrypted credential data is deleted immediately.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-base font-semibold mb-2">Changes to This Policy</h2>
        <p className="text-muted-foreground leading-relaxed">
          If we make material changes to how we handle your data, we&apos;ll notify you at login before
          the change takes effect.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-base font-semibold mb-2">Contact</h2>
        <p className="text-muted-foreground leading-relaxed">
          Privacy questions:{" "}
          <a href="mailto:wildweymouth408@gmail.com" className="underline">
            wildweymouth408@gmail.com
          </a>
        </p>
      </section>
    </div>
  );
}
