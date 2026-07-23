import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy & your health data — signed × sealed",
};

// ⚠ TEMPLATE — reviewed by Matthew / counsel before it's load-bearing. Written
// to describe the app's ACTUAL practices (encryption at rest, bond-scoping, the
// shared food museum, anonymize-on-delete). Drivers: WA My Health My Data Act
// (consumer health data, private right of action, no revenue threshold) and
// GDPR Art. 9 (special-category data → explicit, unbundled consent). Update the
// effective date + contact address before publishing.
const EFFECTIVE = "2026-07-22";
const CONTACT = "privacy@signedxsealed.com";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-2">
      <h2 className="font-display text-lg tracking-wide text-ink">{title}</h2>
      <div className="flex flex-col gap-2 text-sm leading-relaxed text-ink-soft">
        {children}
      </div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-6 p-6 pb-16">
      <header className="flex flex-col gap-1 text-center">
        <h1 className="font-display text-2xl tracking-wide">
          Privacy &amp; your health data
        </h1>
        <p className="text-sm text-ink-soft">Effective {EFFECTIVE}</p>
      </header>

      <Section title="What this covers">
        <p>
          Signed × Sealed is a shared logbook for two people. Some of what you
          record — your meals, workouts, mood, private notes, and weight — is{" "}
          <strong>consumer health data</strong>. This page explains what we
          collect, how we use it, and the choices you have.
        </p>
      </Section>

      <Section title="What we collect">
        <ul className="list-disc pl-5">
          <li>
            <strong>Account:</strong> your email address and a hashed password.
          </li>
          <li>
            <strong>Consumer health data:</strong> the food and workouts you
            log, your mood, your private daily notes, and your weight.
          </li>
        </ul>
      </Section>

      <Section title="How we use it">
        <p>
          Only to run your shared logbook — to compose your daily seal, your
          glade, and your trends. Your logs are visible to{" "}
          <strong>the two keepers of your book</strong> and to no one else. We do
          not sell your data, and we do not share it with advertisers or other
          third parties.
        </p>
        <p>
          One exception, by design: the <em>food museum</em> — the names and
          nutrition of foods — is a shared library across all books, so logging
          gets faster for everyone. What you personally ate, and when, stays
          private to your book.
        </p>
      </Section>

      <Section title="How we protect it">
        <ul className="list-disc pl-5">
          <li>
            Your mood, private notes, and weight are <strong>encrypted at
            rest</strong> (AES-256-GCM).
          </li>
          <li>Passwords are hashed (scrypt); we never store them in the clear.</li>
          <li>
            Sessions expire and can be revoked instantly (signing out ends
            access on that device).
          </li>
        </ul>
      </Section>

      <Section title="Your rights & choices">
        <p>
          You can view and edit your data in the app at any time. You can{" "}
          <strong>delete your account</strong> from Settings, or email us at{" "}
          <a
            href={`mailto:${CONTACT}`}
            className="text-terracotta underline underline-offset-4"
          >
            {CONTACT}
          </a>{" "}
          to request deletion.
        </p>
        <p>
          When you delete, your personal identifiers (email, name) and private
          notes are removed. Because a shared book&apos;s history is composed
          from both keepers, your logged contributions may be kept in{" "}
          <strong>anonymized</strong> form so your partner keeps the shared book
          as a read-only keepsake. You may instead request a{" "}
          <strong>full erasure</strong> of everything you contributed.
        </p>
        <p>
          Depending on where you live, you may have additional rights (for
          example, under Washington&apos;s My Health My Data Act or the GDPR),
          including access, correction, and withdrawal of consent. To exercise
          any of these, email {CONTACT}.
        </p>
      </Section>

      <Section title="Consent">
        <p>
          When you create or join a book, you give explicit consent for us to
          collect and process the consumer health data above for the sole
          purpose of providing this service. You can withdraw consent by
          deleting your account.
        </p>
      </Section>

      <p className="text-center text-sm">
        <Link href="/" className="text-terracotta underline underline-offset-4">
          back
        </Link>
      </p>
    </main>
  );
}
