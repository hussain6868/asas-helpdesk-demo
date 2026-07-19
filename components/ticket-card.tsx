import Link from 'next/link'
import { ChevronRight, MessageSquare, User2 } from 'lucide-react'
import type { Ticket } from '@/lib/types'
import { CATEGORY_META } from '@/lib/types'
import { CATEGORY_ICON, relativeTime } from '@/lib/format'
import { StatusBadge, PriorityBadge } from '@/components/ticket-badges'

export function TicketCard({
  ticket,
  showRequester = false,
}: {
  ticket: Ticket
  showRequester?: boolean
}) {
  const Icon = CATEGORY_ICON[ticket.category]
  return (
    <Link
      href={`/tickets/${ticket.id}`}
      className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40 hover:bg-accent/40"
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
        <Icon className="size-5" />
      </span>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-muted-foreground">{ticket.code}</span>
          <span className="text-xs text-muted-foreground">
            {CATEGORY_META[ticket.category].label}
          </span>
        </div>
        <p className="truncate font-medium text-foreground">{ticket.title}</p>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span>{relativeTime(ticket.updatedAt)}</span>
          {ticket.comments.length > 0 && (
            <span className="flex items-center gap-1">
              <MessageSquare className="size-3" />
              {ticket.comments.length}
            </span>
          )}
          {showRequester && (
            <span className="flex items-center gap-1">
              <User2 className="size-3" />
              {ticket.requesterName}
            </span>
          )}
        </div>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-2">
        <StatusBadge status={ticket.status} />
        <PriorityBadge priority={ticket.priority} />
      </div>

      <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
    </Link>
  )
}
