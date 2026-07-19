'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  Building2,
  ShieldCheck,
  Ticket as TicketIcon,
  Boxes,
  Loader2,
} from 'lucide-react'
import { useStore } from '@/lib/store'
import { COMPANY_DOMAIN } from '@/lib/types'
import { Brand } from '@/components/brand'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function AuthPage() {
  const router = useRouter()
  const { ready, currentUser, login, signup } = useStore()
  const [pending, setPending] = useState(false)

  // Redirect already-authenticated users to their home.
  useEffect(() => {
    if (ready && currentUser) {
      router.replace(currentUser.role === 'admin' ? '/admin' : '/dashboard')
    }
  }, [ready, currentUser, router])

  function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPending(true)
    const form = new FormData(e.currentTarget)
    const email = String(form.get('email') ?? '')
    const password = String(form.get('password') ?? '')
    const res = login(email, password)
    setPending(false)
    if (!res.ok) {
      toast.error(res.error ?? 'Unable to sign in.')
      return
    }
    toast.success('Welcome back to ASAS Helpdesk.')
  }

  function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPending(true)
    const form = new FormData(e.currentTarget)
    const name = String(form.get('name') ?? '')
    const email = String(form.get('email') ?? '')
    const department = String(form.get('department') ?? '')
    const password = String(form.get('password') ?? '')
    if (password.length < 6) {
      setPending(false)
      toast.error('Password must be at least 6 characters.')
      return
    }
    const res = signup({ name, email, department, password })
    setPending(false)
    if (!res.ok) {
      toast.error(res.error ?? 'Unable to create account.')
      return
    }
    toast.success('Account created. Welcome to ASAS Helpdesk.')
  }

  return (
    <main className="flex min-h-screen flex-col lg:flex-row">
      {/* Brand panel */}
      <section className="relative flex flex-col justify-between gap-10 bg-primary px-6 py-8 text-primary-foreground lg:w-[45%] lg:px-12 lg:py-12">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary-foreground/15">
            <Building2 className="size-5" />
          </span>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold">ASAS</span>
            <span className="text-xs text-primary-foreground/70">Industrial Cities</span>
          </div>
        </div>

        <div className="flex max-w-md flex-col gap-4">
          <h1 className="text-3xl font-semibold text-balance lg:text-4xl">
            Internal IT Helpdesk Portal
          </h1>
          <p className="text-pretty text-primary-foreground/80 leading-relaxed">
            One place for ASAS employees to raise requests for apps, hardware, access, and
            supplies — and track them through to resolution.
          </p>
        </div>

        <ul className="flex flex-col gap-4">
          <FeatureRow
            icon={<TicketIcon className="size-4" />}
            title="Submit & track tickets"
            desc="Raise requests and follow their status in real time."
          />
          <FeatureRow
            icon={<Boxes className="size-4" />}
            title="Apps, devices & stationery"
            desc="Everything you need to stay productive on site."
          />
          <FeatureRow
            icon={<ShieldCheck className="size-4" />}
            title="For ASAS staff only"
            desc={`Sign in with your @${COMPANY_DOMAIN} email.`}
          />
        </ul>
      </section>

      {/* Form panel */}
      <section className="flex flex-1 items-center justify-center px-6 py-10 lg:px-12">
        <div className="w-full max-w-sm">
          <Brand className="mb-8 lg:hidden" />
          <div className="mb-6 flex flex-col gap-1">
            <h2 className="text-xl font-semibold">Sign in to continue</h2>
            <p className="text-sm text-muted-foreground">
              Access the ASAS employee helpdesk.
            </p>
          </div>

          <Tabs defaultValue="login">
            <TabsList className="w-full">
              <TabsTrigger value="login" className="flex-1">
                Sign In
              </TabsTrigger>
              <TabsTrigger value="signup" className="flex-1">
                Create Account
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="mt-6">
              <form onSubmit={handleLogin} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="login-email">Work email</Label>
                  <Input
                    id="login-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder={`you@${COMPANY_DOMAIN}`}
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    required
                  />
                </div>
                <Button type="submit" className="mt-2 w-full" disabled={pending}>
                  {pending && <Loader2 data-icon="inline-start" className="animate-spin" />}
                  Sign In
                </Button>
              </form>

              <div className="mt-6 rounded-lg border border-border bg-muted/50 p-3 text-xs text-muted-foreground">
                <p className="font-medium text-foreground">Demo accounts</p>
                <p className="mt-1">Admin — admin@{COMPANY_DOMAIN} / admin123</p>
                <p>Employee — employee@{COMPANY_DOMAIN} / employee123</p>
              </div>
            </TabsContent>

            <TabsContent value="signup" className="mt-6">
              <form onSubmit={handleSignup} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="signup-name">Full name</Label>
                  <Input
                    id="signup-name"
                    name="name"
                    autoComplete="name"
                    placeholder="e.g. Omar Al-Harbi"
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="signup-email">Work email</Label>
                  <Input
                    id="signup-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder={`you@${COMPANY_DOMAIN}`}
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="signup-dept">Department</Label>
                  <Input
                    id="signup-dept"
                    name="department"
                    placeholder="e.g. Operations"
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    placeholder="At least 6 characters"
                    required
                  />
                </div>
                <Button type="submit" className="mt-2 w-full" disabled={pending}>
                  {pending && <Loader2 data-icon="inline-start" className="animate-spin" />}
                  Create Account
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </main>
  )
}

function FeatureRow({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode
  title: string
  desc: string
}) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary-foreground/15">
        {icon}
      </span>
      <div className="flex flex-col">
        <span className="text-sm font-medium">{title}</span>
        <span className="text-sm text-primary-foreground/70">{desc}</span>
      </div>
    </li>
  )
}
