'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { Search, PlusCircle, Inbox } from 'lucide-react'
import { useStore, STATUS_ORDER } from '@/lib/store'
import { STATUS_META, type TicketStatus } from '@/lib/types'
import { AppShell } from '@/components/app-shell'
import { TicketCard } from '@/components/ticket-card'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function MyTicketsPage() {
  return (
    <AppShell>
      <MyTicketsContent />
    </AppShell>
  )
}

function MyTicketsContent() {
  const { currentUser, tickets } = useStore()
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<TicketStatus | 'all'>('all')

  const mine = useMemo(
    () =>
      tickets.filter((t) => t.requesterId === currentUser?.id),
    [tickets, currentUser],
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return mine.filter((t) => {
      const matchesStatus = status === 'all' || t.status === status
      const matchesQuery =
        !q ||
        t.title.toLowerCase().includes(q) ||
        t.code.toLowerCase().includes(q) ||
        t.detail.toLowerCase().includes(q)
      return matchesStatus && matchesQuery
    })
  }, [mine, query, status])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">My tickets</h1>
          <p className="text-sm text-muted-foreground">
            Track the status of all your requests.
          </p>
        </div>
        <Button render={<Link href="/tickets/new" />}>
          <PlusCircle data-icon="inline-start" />
          New Request
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, code, or detail"
            className="pl-9"
          />
        </div>
        <Select value={status} onValueChange={(v) => setStatus(v as TicketStatus | 'all')}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {STATUS_ORDER.map((s) => (
              <SelectItem key={s} value={s}>
                {STATUS_META[s].label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filtered.length > 0 ? (
        <div className="flex flex-col gap-3">
          {filtered.map((t) => (
            <TicketCard key={t.id} ticket={t} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-10">
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Inbox />
                </EmptyMedia>
                <EmptyTitle>No matching tickets</EmptyTitle>
                <EmptyDescription>
                  {mine.length === 0
                    ? "You haven't raised any requests yet."
                    : 'Try adjusting your search or filter.'}
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
