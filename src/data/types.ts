export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  photoUrl: string;
  role: 'Platform Owner' | 'Chairperson' | 'Secretary' | 'Treasurer' | 'Committee Member' | 'Member';
  membershipNumber?: string;
  status: 'Active' | 'Suspended';
  groupId?: string; // current active group ID
  joinedGroups?: string[]; // list of group IDs joined
}

export interface SavingsGroup {
  id: string;
  name: string;
  logo: string;
  description: string;
  country: string;
  currency: string;
  meetingSchedule: string;
  contributionRules: string;
  invitationCode: string;
  status: 'Pending' | 'Active' | 'Suspended';
  banners?: string[];
}

export interface SupportTicket {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  screenshot?: string;
  status: 'Open' | 'Pending' | 'Resolved' | 'Closed';
  readStatus: 'Unread' | 'Read';
  createdAt: string;
  conversation: {
    id: string;
    sender: 'user' | 'admin';
    senderName: string;
    message: string;
    timestamp: string;
  }[];
}

export interface SavingSession {
  id: string;
  groupId: string;
  meetingDate: string;
  title: string;
  savings: {
    memberId: string;
    memberName: string;
    saved: boolean;
    reason?: string;
    amount: number;
    paymentMethod: 'Cash' | 'Mobile Money' | 'Bank Transfer' | 'None';
    time?: string;
    remarks?: string;
  }[];
  totalSaved: number;
}

export interface Project {
  id: string;
  groupId: string;
  name: string;
  description: string;
  budget: number;
  collectedAmount: number;
  progress: number; // percentage
  timeline: string;
  photos: string[];
  documents: { name: string; url: string }[];
}

export interface DocumentRecord {
  id: string;
  groupId: string;
  type: 'Attendance Sheet' | 'Signed Paper' | 'Meeting Minutes' | 'Bank Slip' | 'Receipt' | 'Other';
  title: string;
  fileUrl: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface Announcement {
  id: string;
  groupId: string;
  title: string;
  content: string;
  createdAt: string;
  createdBy: string;
}

export interface AppBanner {
  id: string;
  imageUrl: string;
  title: string;
  target?: string;
  active: boolean;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  details: string;
  timestamp: string;
}
