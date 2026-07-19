'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  COMPANY_DOMAIN,
  type Ticket,
  type TicketCategory,
  type TicketComment,
  type TicketPriority,
  type TicketStatus,
  type User,
} from './types'
import { SEED_TICKETS, SEED_USERS } from './seed'

const USERS_KEY = 'asas.helpdesk.users'
const TICKETS_KEY = 'asas.helpdesk.tickets'
const SESSION_KEY = 'asas.helpdesk.session'

interface SignupInput {
  name: string
  email: string
  department: string
  password: string
}

interface NewTicketInput {
  title: string
  description: string
  category: TicketCategory
  priority: TicketPriority
  detail: string
}

interface StoreValue {
  ready: boolean
  currentUser: User | null
  users: User[]
  tickets: Ticket[]
  login: (email: string, password: string) => { ok: boolean; error?: string }
  signup: (input: SignupInput) => { ok: boolean; error?: string }
  logout: () => void
  createTicket: (input: NewTicketInput) => Ticket | null
  addComment: (ticketId: string, message: string) => void
  updateTicket: (
    ticketId: string,
    patch: Partial<Pick<Ticket, 'status' | 'priority' | 'assignee'>>,
  ) => void
}

const StoreContext = createContext<StoreValue | null>(null)

function load<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function save<T>(key: string, value: T) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // ignore write failures in demo mode
  }
}

function uid(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false)
  const [users, setUsers] = useState<User[]>(SEED_USERS)
  const [tickets, setTickets] = useState<Ticket[]>(SEED_TICKETS)
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  // Hydrate from localStorage on mount.
  useEffect(() => {
    const storedUsers = load<User[]>(USERS_KEY, SEED_USERS)
    const storedTickets = load<Ticket[]>(TICKETS_KEY, SEED_TICKETS)
    const sessionId = load<string | null>(SESSION_KEY, null)
    setUsers(storedUsers)
    setTickets(storedTickets)
    if (sessionId) {
      const found = storedUsers.find((u) => u.id === sessionId) ?? null
      setCurrentUser(found)
    }
    setReady(true)
  }, [])

  useEffect(() => {
    if (ready) save(USERS_KEY, users)
  }, [users, ready])

  useEffect(() => {
    if (ready) save(TICKETS_KEY, tickets)
  }, [tickets, ready])

  const login = useCallback<StoreValue['login']>(
    (email, password) => {
      const normalized = email.trim().toLowerCase()
      const user = users.find((u) => u.email.toLowerCase() === normalized)
      if (!user || user.password !== password) {
        return { ok: false, error: 'Invalid email or password.' }
      }
      setCurrentUser(user)
      save(SESSION_KEY, user.id)
      return { ok: true }
    },
    [users],
  )

  const signup = useCallback<StoreValue['signup']>(
    ({ name, email, department, password }) => {
      const normalized = email.trim().toLowerCase()
      if (!normalized.endsWith(`@${COMPANY_DOMAIN}`)) {
        return { ok: false, error: `Please use your company email (@${COMPANY_DOMAIN}).` }
      }
      if (users.some((u) => u.email.toLowerCase() === normalized)) {
        return { ok: false, error: 'An account with this email already exists.' }
      }
      const user: User = {
        id: uid('u'),
        name: name.trim(),
        email: normalized,
        department: department.trim() || 'Unassigned',
        role: 'employee',
        password,
      }
      setUsers((prev) => [...prev, user])
      setCurrentUser(user)
      save(SESSION_KEY, user.id)
      return { ok: true }
    },
    [users],
  )

  const logout = useCallback(() => {
    setCurrentUser(null)
    save(SESSION_KEY, null)
  }, [])

  const createTicket = useCallback<StoreValue['createTicket']>(
    (input) => {
      if (!currentUser) return null
      const now = new Date().toISOString()
      const num = 1001 + tickets.length
      const ticket: Ticket = {
        id: uid('t'),
        code: `HD-${num}`,
        title: input.title.trim(),
        description: input.description.trim(),
        category: input.category,
        status: 'open',
        priority: input.priority,
        requesterId: currentUser.id,
        requesterName: currentUser.name,
        requesterEmail: currentUser.email,
        department: currentUser.department,
        assignee: null,
        createdAt: now,
        updatedAt: now,
        comments: [],
        detail: input.detail.trim(),
      }
      setTickets((prev) => [ticket, ...prev])
      return ticket
    },
    [currentUser, tickets.length],
  )

  const addComment = useCallback<StoreValue['addComment']>(
    (ticketId, message) => {
      if (!currentUser || !message.trim()) return
      const comment: TicketComment = {
        id: uid('c'),
        authorId: currentUser.id,
        authorName: currentUser.name,
        authorRole: currentUser.role,
        message: message.trim(),
        createdAt: new Date().toISOString(),
      }
      setTickets((prev) =>
        prev.map((t) =>
          t.id === ticketId
            ? { ...t, comments: [...t.comments, comment], updatedAt: comment.createdAt }
            : t,
        ),
      )
    },
    [currentUser],
  )

  const updateTicket = useCallback<StoreValue['updateTicket']>((ticketId, patch) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId ? { ...t, ...patch, updatedAt: new Date().toISOString() } : t,
      ),
    )
  }, [])

  const value = useMemo<StoreValue>(
    () => ({
      ready,
      currentUser,
      users,
      tickets,
      login,
      signup,
      logout,
      createTicket,
      addComment,
      updateTicket,
    }),
    [ready, currentUser, users, tickets, login, signup, logout, createTicket, addComment, updateTicket],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within a StoreProvider')
  return ctx
}

// Status/priority helpers used by both status filter dropdowns.
export const STATUS_ORDER: TicketStatus[] = ['open', 'in-progress', 'resolved', 'rejected']
export const PRIORITY_ORDER: TicketPriority[] = ['low', 'medium', 'high', 'urgent']
