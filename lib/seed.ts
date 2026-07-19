import type { Ticket, User } from './types'

export const SEED_USERS: User[] = [
  {
    id: 'u-admin',
    name: 'Layla Al-Otaibi',
    email: 'admin@asasco.com.sa',
    department: 'IT Department',
    role: 'admin',
    password: 'admin123',
  },
  {
    id: 'u-emp',
    name: 'Omar Al-Harbi',
    email: 'employee@asasco.com.sa',
    department: 'Operations',
    role: 'employee',
    password: 'employee123',
  },
  {
    id: 'u-emp2',
    name: 'Sara Al-Qahtani',
    email: 'sara@asasco.com.sa',
    department: 'Finance',
    role: 'employee',
    password: 'employee123',
  },
]

function daysAgo(days: number, hours = 0): string {
  const d = new Date()
  d.setDate(d.getDate() - days)
  d.setHours(d.getHours() - hours)
  return d.toISOString()
}

export const SEED_TICKETS: Ticket[] = [
  {
    id: 't-1001',
    code: 'HD-1001',
    title: 'Install AutoCAD on my workstation',
    description:
      'I need AutoCAD to review the industrial city layout drawings shared by the planning team.',
    category: 'app-install',
    status: 'in-progress',
    priority: 'high',
    requesterId: 'u-emp',
    requesterName: 'Omar Al-Harbi',
    requesterEmail: 'employee@asasco.com.sa',
    department: 'Operations',
    assignee: 'Layla Al-Otaibi',
    createdAt: daysAgo(2, 3),
    updatedAt: daysAgo(0, 4),
    detail: 'AutoCAD 2024 (full license)',
    comments: [
      {
        id: 'c-1',
        authorId: 'u-admin',
        authorName: 'Layla Al-Otaibi',
        authorRole: 'admin',
        message: 'License approved. We will schedule the installation for tomorrow morning.',
        createdAt: daysAgo(0, 4),
      },
    ],
  },
  {
    id: 't-1002',
    code: 'HD-1002',
    title: 'New wireless mouse needed',
    description: 'My current mouse stopped working. Requesting a replacement wireless mouse.',
    category: 'hardware',
    status: 'open',
    priority: 'medium',
    requesterId: 'u-emp2',
    requesterName: 'Sara Al-Qahtani',
    requesterEmail: 'sara@asasco.com.sa',
    department: 'Finance',
    assignee: null,
    createdAt: daysAgo(1, 2),
    updatedAt: daysAgo(1, 2),
    detail: 'Wireless mouse (1 unit)',
    comments: [],
  },
  {
    id: 't-1003',
    code: 'HD-1003',
    title: 'Access to SAP procurement module',
    description:
      'I joined the procurement team and need read/write access to the SAP procurement module.',
    category: 'app-access',
    status: 'open',
    priority: 'high',
    requesterId: 'u-emp',
    requesterName: 'Omar Al-Harbi',
    requesterEmail: 'employee@asasco.com.sa',
    department: 'Operations',
    assignee: null,
    createdAt: daysAgo(0, 6),
    updatedAt: daysAgo(0, 6),
    detail: 'SAP — read/write, procurement module',
    comments: [],
  },
  {
    id: 't-1004',
    code: 'HD-1004',
    title: 'Notebooks and pens for the team',
    description: 'Requesting stationery supplies for the finance team monthly restock.',
    category: 'stationery',
    status: 'resolved',
    priority: 'low',
    requesterId: 'u-emp2',
    requesterName: 'Sara Al-Qahtani',
    requesterEmail: 'sara@asasco.com.sa',
    department: 'Finance',
    assignee: 'Layla Al-Otaibi',
    createdAt: daysAgo(5, 0),
    updatedAt: daysAgo(3, 0),
    detail: '5 notebooks, 1 box of pens, 10 pencils',
    comments: [
      {
        id: 'c-2',
        authorId: 'u-admin',
        authorName: 'Layla Al-Otaibi',
        authorRole: 'admin',
        message: 'Supplies delivered to the finance floor reception. Please confirm receipt.',
        createdAt: daysAgo(3, 0),
      },
    ],
  },
  {
    id: 't-1005',
    code: 'HD-1005',
    title: 'Outlook keeps crashing on startup',
    description:
      'Since this morning Outlook crashes a few seconds after opening. I have tried restarting.',
    category: 'tech-issue',
    status: 'in-progress',
    priority: 'urgent',
    requesterId: 'u-emp',
    requesterName: 'Omar Al-Harbi',
    requesterEmail: 'employee@asasco.com.sa',
    department: 'Operations',
    assignee: 'Layla Al-Otaibi',
    createdAt: daysAgo(0, 2),
    updatedAt: daysAgo(0, 1),
    detail: 'Microsoft Outlook (desktop)',
    comments: [
      {
        id: 'c-3',
        authorId: 'u-admin',
        authorName: 'Layla Al-Otaibi',
        authorRole: 'admin',
        message: 'We are remoting in to rebuild your Outlook profile. Please stay logged in.',
        createdAt: daysAgo(0, 1),
      },
    ],
  },
]
