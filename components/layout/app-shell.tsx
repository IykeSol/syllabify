import { Menu } from 'lucide-react'
import { Logo } from '@/components/logo'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { SidebarNav } from '@/components/layout/sidebar-nav'
import { UserMenu } from '@/components/layout/user-menu'
import { AdSlot } from '@/components/ads/ad-slot'
import type { NavItem } from '@/lib/constants'
import type { Profile } from '@/types/database'

export function AppShell({
  nav,
  profile,
  email,
  isAdmin,
  variant = 'student',
  children,
}: {
  nav: NavItem[]
  profile: Profile | null
  email?: string | null
  isAdmin?: boolean
  variant?: 'student' | 'admin'
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-muted/20">
      {/* Fixed desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-border bg-background md:flex">
        <div className="flex h-16 items-center gap-2 border-b border-border px-6">
          <Logo />
          {variant === 'admin' && (
            <Badge variant="secondary" className="ml-1">
              Admin
            </Badge>
          )}
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <SidebarNav items={nav} />
        </div>
        {variant === 'student' && (
          <div className="border-t border-border p-4">
            <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_DASHBOARD} className="min-h-40" />
          </div>
        )}
      </aside>

      {/* Main column */}
      <div className="flex min-h-screen flex-col md:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b border-border bg-background/80 px-4 backdrop-blur sm:px-6">
          <div className="flex items-center gap-3">
            {/* Mobile menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="size-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0">
                <SheetTitle className="sr-only">Navigation</SheetTitle>
                <div className="flex h-16 items-center gap-2 border-b border-border px-6">
                  <Logo />
                  {variant === 'admin' && <Badge variant="secondary">Admin</Badge>}
                </div>
                <div className="p-4">
                  <SidebarNav items={nav} />
                </div>
              </SheetContent>
            </Sheet>
            <div className="md:hidden">
              <Logo showWordmark={false} />
            </div>
          </div>
          <UserMenu profile={profile} email={email} isAdmin={isAdmin} />
        </header>

        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-5xl">{children}</div>
        </main>
      </div>
    </div>
  )
}
