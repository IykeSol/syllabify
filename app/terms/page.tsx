import type { Metadata } from 'next'
import Link from 'next/link'
import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'

export const metadata: Metadata = {
  title: 'Terms of service',
  description:
    'The rules for using Syllabify: your account, acceptable use, our content, and the limits of our responsibility.',
}

const CONTACT_EMAIL = 'ikegold9@gmail.com'

/** One titled block of the terms. */
function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      <div className="space-y-3 text-muted-foreground [&_li]:ml-5 [&_li]:list-disc [&_ul]:space-y-1.5">
        {children}
      </div>
    </section>
  )
}

export default function TermsPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">
          Legal
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          Terms of service
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Effective 5 July 2026
        </p>

        <div className="mt-10 space-y-10">
          <Section title="The agreement">
            <p>
              These terms are a contract between you and Syllabify. By
              creating an account or using the site, you accept them. If you
              do not agree with something here, please do not use Syllabify.
            </p>
          </Section>

          <Section title="What Syllabify is">
            <p>
              Syllabify gives Nigerian university students and fresh graduates
              free access to study materials: course outlines and notes
              organised by university, department, level, and semester, plus
              graduate trainee brochures and digital skills content. It is a
              study aid, not a replacement for your lectures.
            </p>
            <p>
              Syllabify is an independent platform. We are not affiliated with,
              or endorsed by, any university, and university names appear only
              to help you find the right materials. Outlines follow public
              national curricula, but your school may vary from them. Always
              confirm with your department. We do not guarantee grades or exam
              outcomes.
            </p>
          </Section>

          <Section title="Your account">
            <ul>
              <li>Give accurate details when you sign up.</li>
              <li>Keep your password to yourself. Activity on your account is your responsibility.</li>
              <li>One account per person.</li>
              <li>
                You must be at least 13. If you are under 18, use Syllabify
                with a parent or guardian&apos;s knowledge.
              </li>
            </ul>
          </Section>

          <Section title="Acceptable use">
            <p>Do not:</p>
            <ul>
              <li>
                Copy, resell, or republish course materials outside Syllabify.
                They are for your personal study.
              </li>
              <li>
                Scrape the site, hammer it with automated requests, or try to
                bypass security or access controls.
              </li>
              <li>Upload or post anything unlawful, or impersonate anyone.</li>
              <li>
                Interfere with other learners&apos; use of the platform.
              </li>
            </ul>
            <p>
              We may suspend or close accounts that break these rules, with or
              without notice.
            </p>
          </Section>

          <Section title="Content and ownership">
            <p>
              The Syllabify name, design, and the materials we publish belong
              to us or our licensors. University names and curricula belong to
              their institutions. You keep whatever rights you have in
              anything you submit to us, and you give us permission to host
              and display it so the service can work.
            </p>
          </Section>

          <Section title="Free service and ads">
            <p>
              Syllabify is free and supported by advertising. Ads are only
              personalised if you accept advertising cookies, as described in
              our{' '}
              <Link
                href="/privacy"
                className="font-medium text-foreground underline-offset-2 hover:underline"
              >
                privacy policy
              </Link>
              . We may change, pause, or retire features as the platform
              evolves.
            </p>
          </Section>

          <Section title="No warranty">
            <p>
              Syllabify is provided as is. We work hard to keep it accurate
              and online, but we cannot promise it will always be available,
              error free, or complete, and we are not liable for losses that
              come from relying on it. Nothing in these terms removes rights
              that Nigerian law gives you and that cannot be excluded.
            </p>
          </Section>

          <Section title="Ending things">
            <p>
              You can stop using Syllabify, or ask us to delete your account,
              at any time. We can suspend or end access for breach of these
              terms. Sections about ownership, warranties, and liability
              survive after an account closes.
            </p>
          </Section>

          <Section title="Changes and governing law">
            <p>
              We may update these terms as Syllabify grows. The date above
              always shows the current version, and significant changes will
              be flagged on the site. These terms are governed by the laws of
              the Federal Republic of Nigeria.
            </p>
            <p>
              Questions? Email{' '}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="font-medium text-foreground underline-offset-2 hover:underline"
              >
                {CONTACT_EMAIL}
              </a>
              .
            </p>
          </Section>
        </div>

        <p className="mt-12 border-t border-border pt-6 text-sm text-muted-foreground">
          See also our{' '}
          <Link
            href="/privacy"
            className="font-medium text-foreground underline-offset-2 hover:underline"
          >
            privacy policy
          </Link>
          .
        </p>
      </main>
      <SiteFooter />
    </>
  )
}
