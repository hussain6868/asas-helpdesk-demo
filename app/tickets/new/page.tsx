'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { useStore } from '@/lib/store'
import {
  CATEGORY_META,
  PRIORITY_META,
  type TicketCategory,
  type TicketPriority,
} from '@/lib/types'
import { CATEGORY_ICON } from '@/lib/format'
import { AppShell } from '@/components/app-shell'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const CATEGORIES = Object.keys(CATEGORY_META) as TicketCategory[]
const PRIORITIES = Object.keys(PRIORITY_META) as TicketPriority[]

export default function NewTicketPage() {
  return (
    <AppShell>
      <Suspense fallback={<div className="h-64" />}>
        <NewTicketForm />
      </Suspense>
    </AppShell>
  )
}

function NewTicketForm() {
  const router = useRouter()
  const params = useSearchParams()
  const { createTicket } = useStore()

  const initialCategory = (params.get('category') as TicketCategory) || 'app-install'
  const validInitial = CATEGORIES.includes(initialCategory)
    ? initialCategory
    : 'app-install'

  const [category, setCategory] = useState<TicketCategory>(validInitial)
  const [priority, setPriority] = useState<TicketPriority>('medium')
  const [pending, setPending] = useState(false)

  const meta = CATEGORY_META[category]

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPending(true)
    const form = new FormData(e.currentTarget)
    const title = String(form.get('title') ?? '').trim()
    const detail = String(form.get('detail') ?? '').trim()
    const description = String(form.get('description') ?? '').trim()

    if (!title || !description) {
      setPending(false)
      toast.error('Please fill in the required fields.')
      return
    }

    const ticket = createTicket({ title, description, category, priority, detail })
    setPending(false)
    if (ticket) {
      toast.success(`Ticket ${ticket.code} submitted.`)
      router.push(`/tickets/${ticket.id}`)
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Link
          href="/dashboard"
          className="flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to dashboard
        </Link>
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">New request</h1>
          <p className="text-sm text-muted-foreground">
            Tell us what you need and the IT team will pick it up.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Request details</CardTitle>
          <CardDescription>{meta.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label>Category</Label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {CATEGORIES.map((cat) => {
                  const Icon = CATEGORY_ICON[cat]
                  const active = cat === category
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={
                        'flex items-center gap-2 rounded-lg border p-2.5 text-left text-sm transition-colors ' +
                        (active
                          ? 'border-primary bg-primary/10 text-foreground'
                          : 'border-border text-muted-foreground hover:bg-muted')
                      }
                    >
                      <Icon className="size-4 shrink-0" />
                      <span className="leading-tight">{CATEGORY_META[cat].label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="title">Summary</Label>
              <Input
                id="title"
                name="title"
                placeholder="Short summary of your request"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="detail">{meta.detailLabel}</Label>
              <Input id="detail" name="detail" placeholder={meta.detailPlaceholder} />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={priority}
                onValueChange={(v) => setPriority(v as TicketPriority)}
              >
                <SelectTrigger id="priority" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITIES.map((p) => (
                    <SelectItem key={p} value={p}>
                      {PRIORITY_META[p].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                rows={5}
                placeholder="Describe your request in more detail, including any context that helps us act faster."
                required
              />
            </div>

            <div className="flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="ghost"
                render={<Link href="/dashboard" />}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={pending}>
                {pending && <Loader2 data-icon="inline-start" className="animate-spin" />}
                Submit request
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
