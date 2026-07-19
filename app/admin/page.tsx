'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import {
  Search,
  ClipboardList,
  Inbox,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
} from 'lucide-react'
import { useStore, STATUS_ORDER, PRIORITY_ORDER } from '@/lib/store'
import {
  CATEGORY_META,
  STATUS_META,
  type TicketCategory,
  type TicketStatus,
  type TicketPriority,
} from '@/lib/types'
import { CATEGORY_ICON, relativeTime, initials } from '@/lib/format'
import { AppShell } from '@/components/app-shell'
import { StatusBadge, PriorityBadge } from '@/components/ticket-badges'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const CATEGORIES = Object.keys(CATEGORY_META) as TicketCategory[]

export default function AdminPage() {
  return (
    <AppShell requireAdmin>
      <AdminConsole />
    </AppShell>
  )
}

function AdminConsole() {
  const { tickets, updateTicket } = useStore()
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<TicketStatus | 'all'>('all')
  const [category, setCategory] = useState<TicketCategory | 'all'>('all')
  const [priority, setPriority] = useState<TicketPriority | 'all'>('all')

  const stats = useMemo(
    () => ({
      total: tickets.length,
      open: tickets.filter((t) => t.status === 'open').length,
      inProgress: tickets.filter((t) => t.status === 'in-progress').length,
      resolved: tickets.filter((t) => t.status === 'resolved').length,
      urgent: tickets.filter(
        (t) => t.priority === 'urgent' && t.status !== 'resolved',
      ).length,
    }),
    [tickets],
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return tickets
      .filter((t) => {
        const mStatus = status === 'all' || t.status === status
        const mCat = category === 'all' || t.category === category
        const mPrio = priority === 'all' || t.priority === priority
        const mQuery =
          !q ||
          t.title.toLowerCase().includes(q) ||
          t.code.toLowerCase().includes(q) ||
          t.requesterName.toLowerCase().includes(q) ||
          t.requesterEmail.toLowerCase().includes(q)
        return mStatus && mCat && mPrio && mQuery
      })
      .sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt))
  }, [tickets, query, status, category, priority])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">Admin console</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Manage and resolve all employee helpdesk requests.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        <StatCard label="Total" value={stats.total} icon={ClipboardList} />
        <StatCard label="Open" value={stats.open} icon={Inbox} />
        <StatCard label="In progress" value={stats.inProgress} icon={Loader2} />
        <StatCard label="Resolved" value={stats.resolved} icon={CheckCircle2} />
        <StatCard label="Urgent" value={stats.urgent} icon={AlertTriangle} accent />
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by code, title, or employee"
            className="pl-9"
          />
        </div>
        <div className="grid grid-cols-3 gap-2 lg:flex">
          <Select value={status} onValueChange={(v) => setStatus(v as TicketStatus | 'all')}>
            <SelectTrigger className="w-full lg:w-36">
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
          <Select
            value={category}
            onValueChange={(v) => setCategory(v as TicketCategory | 'all')}
          >
            <SelectTrigger className="w-full lg:w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {CATEGORY_META[c].label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={priority}
            onValueChange={(v) => setPriority(v as TicketPriority | 'all')}
          >
            <SelectTrigger className="w-full lg:w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All priority</SelectItem>
              {PRIORITY_ORDER.map((p) => (
                <SelectItem key={p} value={p}>
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="overflow-hidden py-0">
        <CardContent className="px-0">
          {filtered.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-4">Ticket</TableHead>
                    <TableHead>Requester</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Updated</TableHead>
                    <TableHead className="pr-4 text-right">View</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((t) => {
                    const Icon = CATEGORY_ICON[t.category]
                    return (
                      <TableRow key={t.id}>
                        <TableCell className="pl-4">
                          <div className="flex flex-col">
                            <span className="font-mono text-xs text-muted-foreground">
                              {t.code}
                            </span>
                            <Link
                              href={`/tickets/${t.id}`}
                              className="max-w-56 truncate font-medium hover:text-primary hover:underline"
                            >
                              {t.title}
                            </Link>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="size-7">
                              <AvatarFallback className="bg-secondary text-secondary-foreground text-[10px] font-semibold">
                                {initials(t.requesterName)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <span className="text-sm">{t.requesterName}</span>
                              <span className="text-xs text-muted-foreground">
                                {t.department}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <Icon className="size-4" />
                            <span className="hidden xl:inline">
                              {CATEGORY_META[t.category].label}
                            </span>
                          </span>
                        </TableCell>
                        <TableCell>
                          <PriorityBadge priority={t.priority} />
                        </TableCell>
                        <TableCell>
                          <Select
                            value={t.status}
                            onValueChange={(v) => {
                              updateTicket(t.id, { status: v as TicketStatus })
                              toast.success(`${t.code} set to ${STATUS_META[v as TicketStatus].label}.`)
                            }}
                          >
                            <SelectTrigger size="sm" className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {STATUS_ORDER.map((s) => (
                                <SelectItem key={s} value={s}>
                                  {STATUS_META[s].label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                          {relativeTime(t.updatedAt)}
                        </TableCell>
                        <TableCell className="pr-4 text-right">
                          <Link
                            href={`/tickets/${t.id}`}
                            className="inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                            aria-label={`Open ${t.code}`}
                          >
                            <ChevronRight className="size-4" />
                          </Link>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="py-12">
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <Inbox />
                  </EmptyMedia>
                  <EmptyTitle>No tickets found</EmptyTitle>
                  <EmptyDescription>
                    No tickets match your current filters.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function StatCard({
  label,
  value,
  icon: Icon,
  accent = false,
}: {
  label: string
  value: number
  icon: typeof Inbox
  accent?: boolean
}) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between gap-3 py-1">
        <div className="flex flex-col gap-1">
          <span className="text-2xl font-semibold tabular-nums">{value}</span>
          <span className="text-xs text-muted-foreground">{label}</span>
        </div>
        <span
          className={
            'flex size-9 items-center justify-center rounded-lg ' +
            (accent
              ? 'bg-destructive/12 text-destructive'
              : 'bg-secondary text-secondary-foreground')
          }
        >
          <Icon className="size-4" />
        </span>
      </CardContent>
    </Card>
  )
}
