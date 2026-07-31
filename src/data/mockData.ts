import type { User, SavingsGroup, SupportTicket, SavingSession, Project, DocumentRecord, Announcement, AppBanner, AuditLog } from './types';

// Pre-seeded Users
export const PRE_SEEDED_USERS: User[] = [
  {
    id: 'u1',
    fullName: 'David Liverton',
    email: 'david@nexela.com',
    phone: '+1 234 567 8900',
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200',
    role: 'Platform Owner',
    status: 'Active',
    membershipNumber: 'NXL-001'
  },
  {
    id: 'u2',
    fullName: 'Jane Doe',
    email: 'jane@chair.com',
    phone: '+1 234 567 8901',
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    role: 'Chairperson',
    status: 'Active',
    groupId: 'g1',
    joinedGroups: ['g1'],
    membershipNumber: 'MEM-001'
  },
  {
    id: 'u3',
    fullName: 'Alice Smith',
    email: 'alice@sec.com',
    phone: '+1 234 567 8902',
    photoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200',
    role: 'Secretary',
    status: 'Active',
    groupId: 'g1',
    joinedGroups: ['g1'],
    membershipNumber: 'MEM-002'
  },
  {
    id: 'u4',
    fullName: 'Mark Treasurer',
    email: 'mark@tres.com',
    phone: '+1 234 567 8903',
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
    role: 'Treasurer',
    status: 'Active',
    groupId: 'g1',
    joinedGroups: ['g1'],
    membershipNumber: 'MEM-003'
  },
  {
    id: 'u5',
    fullName: 'Sarah Jenkins',
    email: 'sarah@member.com',
    phone: '+1 234 567 8904',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
    role: 'Member',
    status: 'Active',
    groupId: 'g1',
    joinedGroups: ['g1'],
    membershipNumber: 'MEM-004'
  },
  {
    id: 'u6',
    fullName: 'Bob Committee',
    email: 'bob@comm.com',
    phone: '+1 234 567 8905',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    role: 'Committee Member',
    status: 'Active',
    groupId: 'g1',
    joinedGroups: ['g1'],
    membershipNumber: 'MEM-005'
  }
];

// Pre-seeded Savings Groups
export const PRE_SEEDED_GROUPS: SavingsGroup[] = [
  {
    id: 'g1',
    name: 'Horizon Wealth Circle',
    logo: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=150',
    description: 'Empowering independent entrepreneurs and community initiatives through steady weekly savings contributions and collective investing.',
    country: 'United States',
    currency: 'USD',
    meetingSchedule: 'Every Sunday at 3:00 PM EST',
    contributionRules: 'Minimum weekly saving of $50. Default fine of $5 applies for delayed saving without a standard valid reason.',
    invitationCode: 'HORIZON777',
    status: 'Active',
    banners: [
      'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=800'
    ]
  },
  {
    id: 'g2',
    name: 'Kilimanjaro Micro-Trust',
    logo: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&q=80&w=150',
    description: 'A friendly and energetic saving association dedicated to supporting local agriculture, community supply chains, and small scale loans.',
    country: 'Kenya',
    currency: 'KES',
    meetingSchedule: 'Bi-weekly on Saturdays at 10:00 AM EAT',
    contributionRules: 'Minimum contribution is KES 2,000 per saving session. Strict physical presence is highly appreciated.',
    invitationCode: 'KILI429',
    status: 'Active'
  },
  {
    id: 'g3',
    name: 'Dublin Tech Angels Savings',
    logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=150',
    description: 'A progressive saving group for tech enthusiasts and developers looking to fund co-operative software projects and micro-startups.',
    country: 'Ireland',
    currency: 'EUR',
    meetingSchedule: 'First Monday of every month',
    contributionRules: 'Monthly contribution of €200. Safe ledger bookkeeping, clear electronic transfers preferred.',
    invitationCode: 'DUBLIN99',
    status: 'Pending'
  }
];

// Pre-seeded Support Tickets
export const PRE_SEEDED_TICKETS: SupportTicket[] = [
  {
    id: 't1',
    name: 'Sarah Jenkins',
    email: 'sarah@member.com',
    subject: 'Cannot upload meeting bank receipt',
    message: 'Hello, I tried uploading my monthly bank slip as a member but it says only the Secretary has permissions. Can you please check if my role allows reading and uploading receipts?',
    status: 'Open',
    readStatus: 'Unread',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
    conversation: [
      {
        id: 'c1',
        sender: 'user',
        senderName: 'Sarah Jenkins',
        message: 'Hello, I tried uploading my monthly bank slip as a member but it says only the Secretary has permissions. Can you please check if my role allows reading and uploading receipts?',
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString()
      }
    ]
  },
  {
    id: 't2',
    name: 'Mark Treasurer',
    email: 'mark@tres.com',
    subject: 'Exporting Savings Ledger as CSV',
    message: 'Hi, is there a way to export our quarterly reports as CSV? The treasurer team needs to import it into QuickBooks. Thanks for a great service!',
    status: 'Resolved',
    readStatus: 'Read',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(), // 1 day ago
    conversation: [
      {
        id: 'c2_1',
        sender: 'user',
        senderName: 'Mark Treasurer',
        message: 'Hi, is there a way to export our quarterly reports as CSV? The treasurer team needs to import it into QuickBooks. Thanks for a great service!',
        timestamp: new Date(Date.now() - 3600000 * 24).toISOString()
      },
      {
        id: 'c2_2',
        sender: 'admin',
        senderName: 'Super Admin',
        message: 'Hello Mark! Yes, you can export reports. Go to the Reports tab on your Left Sidebar (or bottom navigation on mobile), filter by daily, weekly, monthly or yearly savings, and tap the "Export CSV" button. It is fully ready for QuickBooks!',
        timestamp: new Date(Date.now() - 3600000 * 23).toISOString()
      },
      {
        id: 'c2_3',
        sender: 'user',
        senderName: 'Mark Treasurer',
        message: 'Fantastic, that worked immediately! Thank you so much for the super-fast assistance.',
        timestamp: new Date(Date.now() - 3600000 * 22).toISOString()
      }
    ]
  }
];

// Pre-seeded Savings Sessions
export const PRE_SEEDED_SESSIONS: SavingSession[] = [
  {
    id: 's1',
    groupId: 'g1',
    meetingDate: '2026-07-26',
    title: 'Horizon Weekly Meeting #18',
    savings: [
      { memberId: 'u2', memberName: 'Jane Doe', saved: true, amount: 50, paymentMethod: 'Mobile Money', time: '15:10', remarks: 'Paid via Venmo' },
      { memberId: 'u3', memberName: 'Alice Smith', saved: true, amount: 50, paymentMethod: 'Bank Transfer', time: '15:15', remarks: 'Direct ACH' },
      { memberId: 'u4', memberName: 'Mark Treasurer', saved: true, amount: 100, paymentMethod: 'Cash', time: '15:02', remarks: 'Paid extra for next week' },
      { memberId: 'u5', memberName: 'Sarah Jenkins', saved: true, amount: 50, paymentMethod: 'Mobile Money', time: '15:20', remarks: 'CashApp' },
      { memberId: 'u6', memberName: 'Bob Committee', saved: false, reason: 'Out of town / travel', amount: 0, paymentMethod: 'None', remarks: 'Promised to pay double next week' }
    ],
    totalSaved: 250
  },
  {
    id: 's2',
    groupId: 'g1',
    meetingDate: '2026-07-19',
    title: 'Horizon Weekly Meeting #17',
    savings: [
      { memberId: 'u2', memberName: 'Jane Doe', saved: true, amount: 50, paymentMethod: 'Mobile Money', time: '15:05' },
      { memberId: 'u3', memberName: 'Alice Smith', saved: true, amount: 50, paymentMethod: 'Bank Transfer', time: '15:12' },
      { memberId: 'u4', memberName: 'Mark Treasurer', saved: true, amount: 50, paymentMethod: 'Cash', time: '15:00' },
      { memberId: 'u5', memberName: 'Sarah Jenkins', saved: false, reason: 'Pending salary deposit', amount: 0, paymentMethod: 'None' },
      { memberId: 'u6', memberName: 'Bob Committee', saved: true, amount: 50, paymentMethod: 'Mobile Money', time: '15:14' }
    ],
    totalSaved: 200
  }
];

// Pre-seeded Projects
export const PRE_SEEDED_PROJECTS: Project[] = [
  {
    id: 'p1',
    groupId: 'g1',
    name: 'Community Rooftop Solar',
    description: 'Funding and installing modern, clean solar panels for the Horizon Shared Co-working and Cooperative hub to slash utility bills by 85%.',
    budget: 8000,
    collectedAmount: 4850,
    progress: 60.6,
    timeline: 'April 2026 - September 2026',
    photos: [
      'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=600'
    ],
    documents: [
      { name: 'Solar Proposal V2.pdf', url: 'https://nexela.cloudinary.com/docs/solar_proposal_v2.pdf' },
      { name: 'Vendor Quote Sheet.xlsx', url: 'https://nexela.cloudinary.com/docs/vendor_quote.xlsx' }
    ]
  },
  {
    id: 'p2',
    groupId: 'g1',
    name: 'Micro-Loan Seed Fund',
    description: 'Providing low-interest micro-loans for retail members to build local stock inventory during holiday seasons.',
    budget: 3500,
    collectedAmount: 3500,
    progress: 100,
    timeline: 'June 2026 - Active',
    photos: [
      'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=600'
    ],
    documents: [
      { name: 'Microloan terms.pdf', url: 'https://nexela.cloudinary.com/docs/microloan_terms.pdf' }
    ]
  }
];

// Pre-seeded Document Records
export const PRE_SEEDED_DOCUMENTS: DocumentRecord[] = [
  {
    id: 'd1',
    groupId: 'g1',
    type: 'Attendance Sheet',
    title: 'Horizon Meeting #18 Attendance Sheet',
    fileUrl: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&q=80&w=400',
    uploadedBy: 'Alice Smith',
    uploadedAt: '2026-07-26T16:30:00Z'
  },
  {
    id: 'd2',
    groupId: 'g1',
    type: 'Bank Slip',
    title: 'July Chase Deposit Receipt - Horizon Wealth',
    fileUrl: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?auto=format&fit=crop&q=80&w=400',
    uploadedBy: 'Mark Treasurer',
    uploadedAt: '2026-07-27T09:15:00Z'
  },
  {
    id: 'd3',
    groupId: 'g1',
    type: 'Meeting Minutes',
    title: 'Meeting #18 Official Minutes',
    fileUrl: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&q=80&w=400',
    uploadedBy: 'Alice Smith',
    uploadedAt: '2026-07-26T17:00:00Z'
  }
];

// Pre-seeded Announcements
export const PRE_SEEDED_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'a1',
    groupId: 'g1',
    title: 'Quarterly Audit Review Next Week',
    content: 'All members, please make sure your saving records and payment slips are updated in Nexela by Wednesday. Our internal audit committee will review all transactions on Saturday morning.',
    createdAt: '2026-07-28T08:00:00Z',
    createdBy: 'Jane Doe'
  },
  {
    id: 'a2',
    groupId: 'g1',
    title: 'Solar Project Progress Update',
    content: 'We are thrilled to announce that we have crossed 60% of our fundraising target for the Rooftop Solar panel project! Thank you so much to all members who contributed extra savings. Let’s keep the momentum going!',
    createdAt: '2026-07-25T14:30:00Z',
    createdBy: 'Jane Doe'
  }
];

// Pre-seeded App Banners
export const PRE_SEEDED_BANNERS: AppBanner[] = [
  {
    id: 'b1',
    imageUrl: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=1200',
    title: 'Save Smart, Grow Together: Welcome to Nexela PWA by Liverton.',
    target: 'Learn Savings',
    active: true
  },
  {
    id: 'b2',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200',
    title: 'Empower your local community savings group with our secure automated financial tracking ledger.',
    target: 'Create Group',
    active: true
  }
];

// Pre-seeded Audit Logs
export const PRE_SEEDED_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'al1',
    userId: 'u1',
    userName: 'David Liverton (Super Admin)',
    action: 'Approved Savings Group',
    details: 'Savings Group "Dublin Tech Angels Savings" status set to Pending',
    timestamp: '2026-07-30T10:00:00Z'
  },
  {
    id: 'al2',
    userId: 'u4',
    userName: 'Mark Treasurer',
    action: 'Recorded Savings Session',
    details: 'Created saving session "Horizon Weekly Meeting #18" total savings collected $250',
    timestamp: '2026-07-26T15:30:00Z'
  },
  {
    id: 'al3',
    userId: 'u2',
    userName: 'Jane Doe',
    action: 'Created Announcement',
    details: 'Published group announcement "Quarterly Audit Review Next Week"',
    timestamp: '2026-07-28T08:00:00Z'
  }
];
