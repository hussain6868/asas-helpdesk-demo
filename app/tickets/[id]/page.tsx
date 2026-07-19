'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import { toast } from 'sonner'
import { ArrowLeft, Send, FileText } from 'lucide-react'
import { useStore, STATUS_ORDER, PRIORITY_ORDER } from '@/lib/store'
import {
  CATEGORY_META,
  STATUS_META,
  PRIORITY_META,
  type TicketStatus,
  type TicketPriority,
} from '@/lib/types'
import { CATEGORY_ICON, formatDateTime, initials, relativeTime } from '@/lib/format'
import { AppShell } from '@/components/app-shell'
import { StatusBadge, PriorityBadge } from '@/components/ticket-badges'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
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

export default function TicketDetailPage() {
  return (
    <AppShell>
      <TicketDetailContent />
    </AppShell>
  )
}

function TicketDetailContent() {
  const params = useParams<{ id: string }>()
  const { tickets, currentUser, addComment, updateTicket, users } = useStore()
  const [comment, setComment] = useState('')

  const ticket = useMemo(
    () => tickets.find((t) => t.id === params.id),
    [tickets, params.id],
  )

  if (!ticket) {
    return (
      <Card>
        <CardContent className="py-12">
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FileText />
              </EmptyMedia>
              <EmptyTitle>Ticket not found</EmptyTitle>
              <EmptyDescription>
                This ticket may have been removed or the link is incorrect.
              </EmptyDescription>
            </EmptyHeader>
            <Button render={<Link href="/dashboard" />} variant="outline" className="mt-2">
              Back to dashboard
            </Button>
          </Empty>
        </CardContent>
      </Card>
    )
  }

  const isAdmin = currentUser?.role === 'admin'
  const Icon = CATEGORY_ICON[ticket.category]
  const admins = users.filter((u) => u.role === 'admin')
  const backHref = isAdmin ? '/admin' : '/tickets'

  function submitComment(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!comment.trim() || !ticket) return
    addComment(ticket.id, comment)
    setComment('')
    toast.success('Comment added.')
  }

  return (
    <div className="flex flex-col gap-6">
      <Link
        href={backHref}
        className="flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        {isAdmin ? 'Back to console' : 'Back to my tickets'}
      </Link>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
            <Icon className="size-5" />
          </span>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="font-mono">{ticket.code}</span>
              <span>·</span>
              <span>{CATEGORY_META[ticket.category].label}</span>
            </div>
            <h1 className="text-xl font-semibold tracking-tight text-balance">
              {ticket.title}
            </h1>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <StatusBadge status={ticket.status} />
          <PriorityBadge priority={ticket.priority} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main column */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {ticket.detail && (
                <div className="flex flex-col gap-1 rounded-lg bg-muted/60 p-3">
                  <span className="text-xs font-medium text-muted-foreground">
                    {CATEGORY_META[ticket.category].detailLabel}
                  </span>
                  <span className="text-sm">{ticket.detail}</span>
                </div>
              )}
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {ticket.description}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Activity</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              {ticket.comments.length > 0 ? (
                <ul className="flex flex-col gap-5">
                  {ticket.comments.map((c) => (
                    <li key={c.id} className="flex gap-3">
                      <Avatar className="size-8">
                        <AvatarFallback
                          className={
                            c.authorRole === 'admin'
                              ? 'bg-primary text-primary-foreground text-xs font-semibold'
                              : 'bg-secondary text-secondary-foreground text-xs font-semibold'
                          }
                        >
                          {initials(c.authorName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-1 flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{c.authorName}</span>
                          {c.authorRole === 'admin' && (
                            <span className="rounded-full bg-primary/12 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                              IT Team
                            </span>
                          )}
                          <span className="text-xs text-muted-foreground">
                            {relativeTime(c.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground/90">
                          {c.message}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No activity yet. Add a comment to start the conversation.
                </p>
              )}

              <Separator />

              <form onSubmit={submitComment} className="flex flex-col gap-3">
                <Label htmlFor="comment" className="sr-only">
                  Add a comment
                </Label>
                <Textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  placeholder={
                    isAdmin
                      ? 'Reply to the employee or add an internal note...'
                      : 'Add a comment or extra detail...'
                  }
                />
                <div className="flex justify-end">
                  <Button type="submit" disabled={!comment.trim()}>
                    <Send data-icon="inline-start" />
                    Add comment
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-6">
          {isAdmin && (
            <Card>
              <CardHeader>
                <CardTitle>Manage ticket</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Label>Status</Label>
                  <Select
                    value={ticket.status}
                    onValueChange={(v) => {
                      updateTicket(ticket.id, { status: v as TicketStatus })
                      toast.success('Status updated.')
                    }}
                  >
                    <SelectTrigger className="w-full">
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
                </div>

                <div className="flex flex-col gap-2">
                  <Label>Priority</Label>
                  <Select
                    value={ticket.priority}
                    onValueChange={(v) => {
                      updateTicket(ticket.id, { priority: v as TicketPriority })
                      toast.success('Priority updated.')
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PRIORITY_ORDER.map((p) => (
                        <SelectItem key={p} value={p}>
                          {PRIORITY_META[p].label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-2">
                  <Label>Assignee</Label>
                  <Select
                    value={ticket.assignee ?? 'unassigned'}
                    onValueChange={(v) => {
                      updateTicket(ticket.id, {
                        assignee: v === 'unassigned' ? null : v,
                      })
                      toast.success('Assignee updated.')
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unassigned">Unassigned</SelectItem>
                      {admins.map((a) => (
                        <SelectItem key={a.id} value={a.name}>
                          {a.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 text-sm">
              <MetaRow label="Requester" value={ticket.requesterName} />
              <MetaRow label="Email" value={ticket.requesterEmail} />
              <MetaRow label="Department" value={ticket.department} />
              <MetaRow
                label="Assignee"
                value={ticket.assignee ?? 'Unassigned'}
              />
              <Separator />
              <MetaRow label="Created" value={formatDateTime(ticket.createdAt)} />
              <MetaRow label="Last updated" value={formatDateTime(ticket.updatedAt)} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium text-foreground">{value}</span>
    </div>
  )
}
