'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  BookOpen,
  FolderKanban,
  GraduationCap,
  School,
  Settings,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { NavItem, NavIconName } from '@/lib/constants'

const navIcons: Record<NavIconName, LucideIcon> = {
  dashboard: LayoutDashboard,
  courses: BookOpen,
  overview: LayoutDashboard,
  'manage-courses': FolderKanban,
  'new-course': GraduationCap,
  universities: School,
  settings: Settings,
}

export function SidebarNav({
  items,
  onNavigate,
}: {
  items: NavItem[]
  onNavigate?: () => void
}) {
  const pathname = usePathname()

  return (
    <nav className="grid gap-1">
      {items.map((item) => {
        const Icon = navIcons[item.icon]
        const active =
          item.href === '/admin' || item.href === '/dashboard'
            ? pathname === item.href
            : pathname.startsWith(item.href)
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              active
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            )}
          >
            <Icon className="size-4 shrink-0" />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
