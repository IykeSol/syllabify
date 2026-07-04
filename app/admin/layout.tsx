import { redirect } from 'next/navigation'
import { AppShell } from '@/components/layout/app-shell'
import { getCurrentUser, getCurrentProfile } from '@/lib/queries'
import { adminNav, ADMIN_EMAIL, isSupabaseConfigured } from '@/lib/constants'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  // Defence in depth — middleware already gates /admin, re-check on the server.
  if (isSupabaseConfigured()) {
    if (!user) redirect('/login?next=/admin')
    if (
      !ADMIN_EMAIL ||
      user.email?.toLowerCase() !== ADMIN_EMAIL.toLowerCase()
    ) {
      redirect('/dashboard')
    }
  }

  const profile = await getCurrentProfile()

  return (
    <AppShell
      nav={adminNav}
      profile={profile}
      email={user?.email}
      isAdmin
      variant="admin"
    >
      {children}
    </AppShell>
  )
}
