export type Role = 'admin' | 'employee'

export type TicketCategory =
  | 'app-install'
  | 'tech-issue'
  | 'app-access'
  | 'hardware'
  | 'stationery'
  | 'other'

export type TicketStatus = 'open' | 'in-progress' | 'resolved' | 'rejected'

export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent'

export interface User {
  id: string
  name: string
  email: string
  department: string
  role: Role
  password: string
}

export interface TicketComment {
  id: string
  authorId: string
  authorName: string
  authorRole: Role
  message: string
  createdAt: string
}

export interface Ticket {
  id: string
  code: string
  title: string
  description: string
  category: TicketCategory
  status: TicketStatus
  priority: TicketPriority
  requesterId: string
  requesterName: string
  requesterEmail: string
  department: string
  assignee: string | null
  createdAt: string
  updatedAt: string
  comments: TicketComment[]
  /** Free-form category specific detail, e.g. app name, device type, quantity. */
  detail: string
}

export const COMPANY_DOMAIN = 'asasco.com.sa'

export const CATEGORY_META: Record<
  TicketCategory,
  { label: string; description: string; detailLabel: string; detailPlaceholder: string }
> = {
  'app-install': {
    label: 'App Download / Installation',
    description: 'Request software or applications to be installed on your device.',
    detailLabel: 'Application name & version',
    detailPlaceholder: 'e.g. Adobe Acrobat Pro DC (latest)',
  },
  'tech-issue': {
    label: 'Technical Issue',
    description: 'Report a technical problem or malfunction you are facing.',
    detailLabel: 'Affected device / system',
    detailPlaceholder: 'e.g. Dell Latitude laptop, Outlook, network drive',
  },
  'app-access': {
    label: 'App Access / Permissions',
    description: 'Request access or permissions to a specific application or system.',
    detailLabel: 'System / app & access level',
    detailPlaceholder: 'e.g. SAP — read access to procurement module',
  },
  hardware: {
    label: 'Hardware / Device Request',
    description: 'Request a new device such as a laptop, mouse, keyboard, or monitor.',
    detailLabel: 'Device type & specs',
    detailPlaceholder: 'e.g. Wireless mouse, or laptop with 16GB RAM',
  },
  stationery: {
    label: 'Stationery Request',
    description: 'Request office stationery such as notebooks, pens, and pencils.',
    detailLabel: 'Items & quantity',
    detailPlaceholder: 'e.g. 2 notebooks, 1 box of pens, 3 pencils',
  },
  other: {
    label: 'Other / General',
    description: 'Any other request that does not fit the categories above.',
    detailLabel: 'Additional detail',
    detailPlaceholder: 'Provide any relevant details',
  },
}

export const STATUS_META: Record<TicketStatus, { label: string; tone: string }> = {
  open: { label: 'Open', tone: 'open' },
  'in-progress': { label: 'In Progress', tone: 'in-progress' },
  resolved: { label: 'Resolved', tone: 'resolved' },
  rejected: { label: 'Rejected', tone: 'rejected' },
}

export const PRIORITY_META: Record<TicketPriority, { label: string; tone: string }> = {
  low: { label: 'Low', tone: 'low' },
  medium: { label: 'Medium', tone: 'medium' },
  high: { label: 'High', tone: 'high' },
  urgent: { label: 'Urgent', tone: 'urgent' },
}
