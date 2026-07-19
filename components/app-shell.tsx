'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  PlusCircle,
  Ticket,
  ShieldCheck,
  LogOut,
  Loader2,
} from 'lucide-react'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import { initials } from '@/lib/format'
import { Brand, BrandMark } from '@/components/brand'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface NavItem {
  href: string
  label: string
  icon: typeof LayoutDashboard
}

const EMPLOYEE_NAV: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/tickets/new', label: 'New Request', icon: PlusCircle },
  { href: '/tickets', label: 'My Tickets', icon: Ticket },
]

const ADMIN_NAV: NavItem[] = [
  { href: '/admin', label: 'Admin Console', icon: ShieldCheck },
]

export function AppShell({
  children,
  requireAdmin = false,
}: {
  children: React.ReactNode
  requireAdmin?: boolean
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { ready, currentUser, logout } = useStore()

  useEffect(() => {
    if (!ready) return
    if (!currentUser) {
      router.replace('/')
      return
    }
    if (requireAdmin && currentUser.role !== 'admin') {
      router.replace('/dashboard')
    }
  }, [ready, currentUser, requireAdmin, router])

  if (!ready || !currentUser || (requireAdmin && currentUser.role !== 'admin')) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const nav = currentUser.role === 'admin' ? ADMIN_NAV : EMPLOYEE_NAV

  function handleLogout() {
    logout()
    router.replace('/')
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 lg:px-6">
          <div className="flex items-center gap-6">
            <Link href={currentUser.role === 'admin' ? '/admin' : '/dashboard'}>
              <Brand subtitle={false} />
            </Link>
            <nav className="hidden items-center gap-1 md:flex">
              {nav.map((item) => {
                const active =
                  pathname === item.href ||
                  (item.href !== '/dashboard' &&
                    item.href !== '/admin' &&
                    pathname.startsWith(item.href))
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      active
                        ? 'bg-accent text-accent-foreground'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                    )}
                  >
                    <item.icon className="size-4" />
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger
              className="flex items-center gap-2 rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              render={
                <button type="button" aria-label="Account menu">
                  <Avatar className="size-9">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                      {initials(currentUser.name)}
                    </AvatarFallback>
                  </Avatar>
                </button>
              }
            />
            <DropdownMenuContent align="end" className="w-56">
              <div className="flex flex-col gap-0.5 px-2 py-1.5">
                <span className="text-sm font-medium text-foreground">
                  {currentUser.name}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {currentUser.email}
                </span>
                <span className="mt-1 text-xs text-muted-foreground">
                  {currentUser.role === 'admin' ? 'Administrator' : currentUser.department}
                </span>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onClick={handleLogout}>
                <LogOut />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mobile nav */}
        <nav className="flex items-center gap-1 overflow-x-auto border-t border-border px-4 py-2 md:hidden">
          {nav.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== '/dashboard' &&
                item.href !== '/admin' &&
                pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors',
                  active
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 lg:px-6 lg:py-8">
        {children}
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex w-full max-w-6xl items-center gap-2 px-4 py-4 text-xs text-muted-foreground lg:px-6">
          <BrandMark className="size-6 rounded-lg" />
          <span>
            ASAS — for developing and operating industrial cities. Internal use only.
          </span>
        </div>
      </footer>
    </div>
  )
}
