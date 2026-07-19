import { Building2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground',
        className,
      )}
      aria-hidden
    >
      <Building2 className="size-5" />
    </span>
  )
}

export function Brand({
  className,
  subtitle = true,
}: {
  className?: string
  subtitle?: boolean
}) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <BrandMark />
      <div className="flex flex-col leading-tight">
        <span className="text-sm font-semibold tracking-tight">ASAS Helpdesk</span>
        {subtitle && (
          <span className="text-xs text-muted-foreground">Industrial Cities</span>
        )}
      </div>
    </div>
  )
}
