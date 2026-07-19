import {
  AppWindow,
  Wrench,
  KeyRound,
  Laptop,
  NotebookPen,
  HelpCircle,
  type LucideIcon,
} from 'lucide-react'
import type { TicketCategory } from './types'

export const CATEGORY_ICON: Record<TicketCategory, LucideIcon> = {
  'app-install': AppWindow,
  'tech-issue': Wrench,
  'app-access': KeyRound,
  hardware: Laptop,
  stationery: NotebookPen,
  other: HelpCircle,
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.round(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.round(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.round(hours / 24)
  if (days < 7) return `${days}d ago`
  return formatDate(iso)
}

export function initials(name: string): string {
  return name
    .split(' ')
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}
