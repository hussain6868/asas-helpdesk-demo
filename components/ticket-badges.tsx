import { cn } from '@/lib/utils'
import {
  PRIORITY_META,
  STATUS_META,
  type TicketPriority,
  type TicketStatus,
} from '@/lib/types'

const STATUS_CLASS: Record<TicketStatus, string> = {
  open: 'bg-secondary text-secondary-foreground',
  'in-progress': 'bg-chart-5/15 text-chart-5 dark:text-foreground',
  resolved: 'bg-primary/15 text-primary dark:text-primary',
  rejected: 'bg-destructive/12 text-destructive',
}

const PRIORITY_CLASS: Record<TicketPriority, string> = {
  low: 'border-border text-muted-foreground',
  medium: 'border-chart-5/40 text-chart-5 dark:text-foreground',
  high: 'border-primary/40 text-primary',
  urgent: 'border-destructive/40 text-destructive',
}

export function StatusBadge({
  status,
  className,
}: {
  status: TicketStatus
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex h-6 items-center gap-1.5 rounded-full px-2.5 text-xs font-medium',
        STATUS_CLASS[status],
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current" aria-hidden />
      {STATUS_META[status].label}
    </span>
  )
}

export function PriorityBadge({
  priority,
  className,
}: {
  priority: TicketPriority
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex h-6 items-center rounded-full border px-2.5 text-xs font-medium',
        PRIORITY_CLASS[priority],
        className,
      )}
    >
      {PRIORITY_META[priority].label}
    </span>
  )
}
