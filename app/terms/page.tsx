// app/terms/page.tsx

export default function TermsOfService() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 text-sm text-foreground">
      <h1 className="text-2xl font-bold mb-1">Terms of Service</h1>
      <p className="text-muted-foreground mb-6">Last updated: March 2026</p>

      <section className="mb-6">
        <h2 className="text-base font-semibold mb-2">1. What Sparky Is</h2>
        <p className="text-muted-foreground leading-relaxed">
          Sparky is a reference tool built for licensed electricians and apprentices. It provides
          NEC-based calculations, code references, and AI-assisted guidance to support fieldwork.
          Sparky is not a licensed engineering service and does not replace the judgment of a
          qualified electrician, engineer, or authority having jurisdiction (AHJ).
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-base font-semibold mb-2">2. Reference Only — Not Engineering Advice</h2>
        <p className="text-muted-foreground leading-relaxed">
          All calculations, code references, and AI responses provided by Sparky are for
          informational and reference purposes only. They do not constitute professional electrical,
          engineering, or legal advice. Results must be verified against the current edition of the
          National Electrical Code (NEC), applicable local amendments, and the requirements of your
          local AHJ before any work is performed.
        </p>
        <p className="text-muted-foreground leading-relaxed mt-2">
          Electrical work involves serious risk of injury, death, and property damage. You are
          solely responsible for verifying the accuracy and applicability of any information
          obtained through Sparky before acting on it.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-base font-semibold mb-2">3. Limitation of Liability</h2>
        <p className="text-muted-foreground leading-relaxed">
          To the fullest extent permitted by California law, Sparky and its developers are not
          liable for any direct, indirect, incidental, consequential, or punitive damages arising
          from your use of this application — including but not limited to: personal injury,
          property damage, failed inspections, code violations, or financial losses resulting from
          reliance on Sparky&apos;s calculations or AI responses.
        </p>
        <p className="text-muted-foreground leading-relaxed mt-2">
          If you are not comfortable verifying calculations independently, do not rely on Sparky
          as your sole reference.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-base font-semibold mb-2">4. Who Can Use Sparky</h2>
        <p className="text-muted-foreground leading-relaxed">
          Sparky is intended for use by licensed electricians, registered apprentices, and
          electrical students. You must be at least 18 years old to create an account. By using
          Sparky, you represent that you have the training and licensing required to apply
          electrical code in your jurisdiction.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-base font-semibold mb-2">5. AI Chat (Ask Sparky)</h2>
        <p className="text-muted-foreground leading-relaxed">
          The Ask Sparky AI assistant is powered by Claude (Anthropic) and is provided as a
          general reference tool. AI responses may contain errors or outdated information.
          Ask Sparky will not provide step-by-step guidance for working on energized circuits —
          that refusal is intentional and not a bug. Always consult the NEC, NFPA 70E, and your
          employer&apos;s safety program before performing energized work.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-base font-semibold mb-2">6. Your Account</h2>
        <p className="text-muted-foreground leading-relaxed">
          You are responsible for maintaining the security of your account credentials. Sparky
          stores data on your behalf using Supabase (see Privacy Policy). You may delete your
          account at any time. Do not share credentials, job data, or AI conversations that contain
          sensitive client information.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-base font-semibold mb-2">7. Changes to These Terms</h2>
        <p className="text-muted-foreground leading-relaxed">
          These terms may be updated as Sparky grows. Continued use of the app after changes are
          posted constitutes acceptance. Major changes will be flagged at login.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-base font-semibold mb-2">8. Governing Law</h2>
        <p className="text-muted-foreground leading-relaxed">
          These terms are governed by the laws of the State of California. Any disputes shall be
          resolved in the courts of Santa Clara County, California.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-base font-semibold mb-2">9. Contact</h2>
        <p className="text-muted-foreground leading-relaxed">
          Questions about these terms? Email:{" "}
          <a href="mailto:wildweymouth408@gmail.com" className="underline">
            wildweymouth408@gmail.com
          </a>
          {/* TODO: Replace with sparky@[domain] before launch */}
        </p>
      </section>
    </div>
  );
}
