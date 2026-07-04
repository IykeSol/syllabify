'use client'

import Link from 'next/link'
import { LogOut, LayoutDashboard, BookOpen, Shield } from 'lucide-react'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { initials } from '@/lib/constants'
import type { Profile } from '@/types/database'

export function UserMenu({
  profile,
  email,
  isAdmin,
}: {
  profile: Profile | null
  email?: string | null
  isAdmin?: boolean
}) {
  const name = profile?.full_name || 'Student'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-full outline-none ring-offset-background transition focus-visible:ring-2 focus-visible:ring-ring">
        <Avatar className="size-9 border border-border">
          {profile?.avatar_url && <AvatarImage src={profile.avatar_url} alt={name} />}
          <AvatarFallback className="bg-primary/10 text-primary">
            {initials(name)}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <p className="text-sm font-medium">{name}</p>
          {email && (
            <p className="truncate text-xs text-muted-foreground">{email}</p>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard">
            <LayoutDashboard className="size-4" /> Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/courses">
            <BookOpen className="size-4" /> Browse courses
          </Link>
        </DropdownMenuItem>
        {isAdmin && (
          <DropdownMenuItem asChild>
            <Link href="/admin">
              <Shield className="size-4" /> Admin
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onSelect={(e) => {
            e.preventDefault()
            ;(document.getElementById('signout-form') as HTMLFormElement)?.requestSubmit()
          }}
        >
          <LogOut className="size-4" /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
      <form id="signout-form" action="/auth/signout" method="post" className="hidden" />
    </DropdownMenu>
  )
}
