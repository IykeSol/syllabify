import { AppShell } from '@/components/layout/app-shell'
import { getCurrentUser, getCurrentProfile } from '@/lib/queries'
import { studentNav, ADMIN_EMAIL } from '@/lib/constants'

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Route protection is enforced in middleware; here we just hydrate the shell.
  const [user, profile] = await Promise.all([
    getCurrentUser(),
    getCurrentProfile(),
  ])
  const isAdmin =
    !!user?.email &&
    !!ADMIN_EMAIL &&
    user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()

  return (
    <AppShell
      nav={studentNav}
      profile={profile}
      email={user?.email}
      isAdmin={isAdmin}
      variant="student"
    >
      {children}
    </AppShell>
  )
}
