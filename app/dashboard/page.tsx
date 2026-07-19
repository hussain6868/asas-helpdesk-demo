'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { ArrowRight, Inbox, Loader2, CheckCircle2, ClipboardList } from 'lucide-react'
import { useStore } from '@/lib/store'
import { CATEGORY_META, type TicketCategory } from '@/lib/types'
import { CATEGORY_ICON } from '@/lib/format'
import { AppShell } from '@/components/app-shell'
import { TicketCard } from '@/components/ticket-card'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'

const CATEGORIES = Object.keys(CATEGORY_META) as TicketCategory[]

export default function DashboardPage() {
  return (
    <AppShell>
      <DashboardContent />
    </AppShell>
  )
}

function DashboardContent() {
  const { currentUser, tickets } = useStore()
  const mine = useMemo(
    () => tickets.filter((t) => t.requesterId === currentUser?.id),
    [tickets, currentUser],
  )

  const stats = useMemo(() => {
    return {
      total: mine.length,
      open: mine.filter((t) => t.status === 'open').length,
      inProgress: mine.filter((t) => t.status === 'in-progress').length,
      resolved: mine.filter((t) => t.status === 'resolved').length,
    }
  }, [mine])

  const recent = mine.slice(0, 4)
  const firstName = currentUser?.name.split(' ')[0] ?? 'there'

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">Hello, {firstName}</h1>
          <p className="text-sm text-muted-foreground">
            Welcome to the ASAS helpdesk. Raise a request or track your existing tickets.
          </p>
        </div>
        <Button render={<Link href="/tickets/new" />}>
          New Request
          <ArrowRight data-icon="inline-end" />
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total requests" value={stats.total} icon={ClipboardList} />
        <StatCard label="Open" value={stats.open} icon={Inbox} />
        <StatCard label="In progress" value={stats.inProgress} icon={Loader2} />
        <StatCard label="Resolved" value={stats.resolved} icon={CheckCircle2} />
      </div>

      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          What do you need?
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((cat) => {
            const meta = CATEGORY_META[cat]
            const Icon = CATEGORY_ICON[cat]
            return (
              <Link
                key={cat}
                href={`/tickets/new?category=${cat}`}
                className="group flex items-start gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40 hover:bg-accent/40"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="size-5" />
                </span>
                <div className="flex flex-col gap-0.5">
                  <span className="font-medium text-foreground">{meta.label}</span>
                  <span className="text-xs leading-relaxed text-muted-foreground">
                    {meta.description}
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Recent tickets
          </h2>
          {mine.length > 0 && (
            <Link
              href="/tickets"
              className="text-sm font-medium text-primary hover:underline"
            >
              View all
            </Link>
          )}
        </div>

        {recent.length > 0 ? (
          <div className="flex flex-col gap-3">
            {recent.map((t) => (
              <TicketCard key={t.id} ticket={t} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-8">
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <Inbox />
                  </EmptyMedia>
                  <EmptyTitle>No tickets yet</EmptyTitle>
                  <EmptyDescription>
                    You haven&apos;t raised any requests. Create your first ticket to get
                    started.
                  </EmptyDescription>
                </EmptyHeader>
                <Button render={<Link href="/tickets/new" />} className="mt-2">
                  New Request
                </Button>
              </Empty>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  )
}

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string
  value: number
  icon: typeof Inbox
}) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between gap-3 py-1">
        <div className="flex flex-col gap-1">
          <span className="text-2xl font-semibold tabular-nums">{value}</span>
          <span className="text-xs text-muted-foreground">{label}</span>
        </div>
        <span className="flex size-9 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
          <Icon className="size-4" />
        </span>
      </CardContent>
    </Card>
  )
}
