import type { Metadata } from 'next'
import Link from 'next/link'
import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'

export const metadata: Metadata = {
  title: 'Privacy policy',
  description:
    'How Syllabify collects, uses, and protects your data: accounts, cookies, ads, and your rights.',
}

const CONTACT_EMAIL = 'ikegold9@gmail.com'

/** One titled block of the policy. */
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

export default function PrivacyPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">
          Legal
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          Privacy policy
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Effective 5 July 2026
        </p>

        <div className="mt-10 space-y-10">
          <Section title="Who we are">
            <p>
              Syllabify is a free learning platform for Nigerian university
              students and fresh graduates. This policy explains what personal
              data we collect, why we collect it, and the choices you have. We
              handle personal data in line with the Nigeria Data Protection
              Act, 2023 (NDPA).
            </p>
            <p>
              Questions or requests about your data can go to{' '}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="font-medium text-foreground underline-offset-2 hover:underline"
              >
                {CONTACT_EMAIL}
              </a>
              .
            </p>
          </Section>

          <Section title="What we collect">
            <ul>
              <li>
                <span className="font-medium text-foreground">Account details.</span>{' '}
                Your name, email address, and profile photo when you sign up
                with email or through Google or GitHub, plus whether you joined
                as a university student or a fresh graduate.
              </li>
              <li>
                <span className="font-medium text-foreground">Learning activity.</span>{' '}
                The courses you enrol in and the materials you complete, so
                your dashboard can show your progress.
              </li>
              <li>
                <span className="font-medium text-foreground">Technical data.</span>{' '}
                Your IP address is checked briefly when you sign up or log in.
                We use it to block automated abuse, not to build a profile of
                you.
              </li>
            </ul>
            <p>
              We do not collect payment details. Everything on Syllabify is
              free.
            </p>
          </Section>

          <Section title="Where your data lives">
            <p>
              Account and learning data is stored with Supabase, our database
              and authentication provider, on servers in the European Union.
              Course files such as PDFs and images are delivered through
              Cloudinary, a media hosting service. Both providers process data
              on our behalf and under their own security controls.
            </p>
          </Section>

          <Section title="Cookies">
            <ul>
              <li>
                <span className="font-medium text-foreground">Essential cookies.</span>{' '}
                Keep you signed in. The site cannot work without them.
              </li>
              <li>
                <span className="font-medium text-foreground">A consent cookie.</span>{' '}
                Remembers the choice you make on our cookie banner.
              </li>
              <li>
                <span className="font-medium text-foreground">Advertising cookies.</span>{' '}
                Set by Google only if you choose &ldquo;Accept all&rdquo; on
                the banner. See the next section.
              </li>
            </ul>
          </Section>

          <Section title="Advertising">
            <p>
              Adverts are what keep Syllabify free. We use Google AdSense. If
              you accept all cookies, Google may use cookies to show you ads
              based on your interests and to measure how ads perform. If you
              choose &ldquo;Necessary only&rdquo;, no advertising cookies are
              loaded by us.
            </p>
            <p>
              You can learn how Google uses data from its ad partners at{' '}
              <a
                href="https://policies.google.com/technologies/partner-sites"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground underline-offset-2 hover:underline"
              >
                policies.google.com/technologies/partner-sites
              </a>{' '}
              and manage your ad preferences at{' '}
              <a
                href="https://adssettings.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground underline-offset-2 hover:underline"
              >
                adssettings.google.com
              </a>
              .
            </p>
          </Section>

          <Section title="What we never do">
            <ul>
              <li>We do not sell your personal data.</li>
              <li>We do not send marketing emails you did not ask for.</li>
              <li>
                We do not share your data with anyone beyond the service
                providers named above, unless the law requires it.
              </li>
            </ul>
          </Section>

          <Section title="Your rights">
            <p>
              Under the NDPA you can ask to see the data we hold about you,
              correct it, or have it deleted. Deleting your account removes
              your profile, enrolments, and progress from our database. Email{' '}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="font-medium text-foreground underline-offset-2 hover:underline"
              >
                {CONTACT_EMAIL}
              </a>{' '}
              from the address on your account and we will act on it within 30
              days.
            </p>
          </Section>

          <Section title="Children">
            <p>
              Syllabify is built for university students and graduates. It is
              not directed at children under 13, and we do not knowingly
              collect their data.
            </p>
          </Section>

          <Section title="Changes to this policy">
            <p>
              If we change this policy in a meaningful way, we will update the
              date at the top and, for significant changes, show a notice on
              the site. Continuing to use Syllabify after a change means you
              accept the updated policy.
            </p>
          </Section>
        </div>

        <p className="mt-12 border-t border-border pt-6 text-sm text-muted-foreground">
          See also our{' '}
          <Link
            href="/terms"
            className="font-medium text-foreground underline-offset-2 hover:underline"
          >
            terms of service
          </Link>
          .
        </p>
      </main>
      <SiteFooter />
    </>
  )
}
