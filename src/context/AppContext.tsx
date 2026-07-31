import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, SavingsGroup, SupportTicket, SavingSession, Project, DocumentRecord, Announcement, AppBanner, AuditLog } from '../data/types';
import {
  PRE_SEEDED_USERS,
  PRE_SEEDED_GROUPS,
  PRE_SEEDED_TICKETS,
  PRE_SEEDED_SESSIONS,
  PRE_SEEDED_PROJECTS,
  PRE_SEEDED_DOCUMENTS,
  PRE_SEEDED_ANNOUNCEMENTS,
  PRE_SEEDED_BANNERS,
  PRE_SEEDED_AUDIT_LOGS
} from '../data/mockData';

export interface NotificationItem {
  id: string;
  title: string;
  content: string;
  timestamp: string;
  read: boolean;
}

interface AppContextProps {
  currentUser: User | null;
  users: User[];
  groups: SavingsGroup[];
  tickets: SupportTicket[];
  sessions: SavingSession[];
  projects: Project[];
  documents: DocumentRecord[];
  announcements: Announcement[];
  banners: AppBanner[];
  auditLogs: AuditLog[];
  notifications: NotificationItem[];

  // Active tenant group
  activeGroup: SavingsGroup | null;
  setActiveGroup: (group: SavingsGroup | null) => void;

  // Auth Operations
  login: (email: string, role: User['role']) => Promise<User>;
  logout: () => void;
  signUp: (fullName: string, email: string, phone: string, role: User['role']) => Promise<User>;
  updateUserRole: (userId: string, role: User['role']) => void;
  resetPassword: (email: string) => Promise<string>;
  updateProfileImage: (userId: string, photoUrl: string) => void;

  // Group Operations
  createGroup: (groupData: Partial<SavingsGroup>, chairpersonId: string) => Promise<SavingsGroup>;
  joinGroupWithCode: (code: string, userId: string) => Promise<SavingsGroup>;
  approveGroup: (groupId: string) => void;
  suspendGroup: (groupId: string) => void;
  updateGroupBanners: (groupId: string, bannerUrls: string[]) => void;

  // Support Ticket Operations
  createTicket: (ticket: Omit<SupportTicket, 'id' | 'createdAt' | 'status' | 'readStatus' | 'conversation'>) => Promise<SupportTicket>;
  addReplyToTicket: (ticketId: string, message: string, sender: 'user' | 'admin', senderName: string) => void;
  updateTicketStatus: (ticketId: string, status: SupportTicket['status']) => void;
  markTicketAsRead: (ticketId: string) => void;

  // Savings Sessions Operations
  createSavingsSession: (session: Omit<SavingSession, 'id'>) => Promise<SavingSession>;
  updateSavingsRecord: (sessionId: string, memberId: string, saved: boolean, amount: number, paymentMethod: string, remarks?: string, reason?: string) => void;

  // Projects
  createProject: (project: Omit<Project, 'id' | 'progress'>) => Promise<Project>;
  updateProjectProgress: (projectId: string, collected: number) => void;
  addProjectPhoto: (projectId: string, photoUrl: string) => void;

  // Documents
  uploadDocument: (doc: Omit<DocumentRecord, 'id' | 'uploadedAt'>) => Promise<DocumentRecord>;

  // Announcements
  createAnnouncement: (ann: Omit<Announcement, 'id' | 'createdAt'>) => Promise<Announcement>;

  // App Banners
  createPlatformBanner: (bannerUrl: string, title: string) => void;
  deletePlatformBanner: (id: string) => void;

  // Notifications
  addNotification: (title: string, content: string) => void;
  clearNotifications: () => void;
  markNotificationsAsRead: () => void;

  // Audit Logs
  logAction: (userId: string, userName: string, action: string, details: string) => void;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial state from local storage or pre-seeded data
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('nexela_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('nexela_users');
    return saved ? JSON.parse(saved) : PRE_SEEDED_USERS;
  });

  const [groups, setGroups] = useState<SavingsGroup[]>(() => {
    const saved = localStorage.getItem('nexela_groups');
    return saved ? JSON.parse(saved) : PRE_SEEDED_GROUPS;
  });

  const [tickets, setTickets] = useState<SupportTicket[]>(() => {
    const saved = localStorage.getItem('nexela_tickets');
    return saved ? JSON.parse(saved) : PRE_SEEDED_TICKETS;
  });

  const [sessions, setSessions] = useState<SavingSession[]>(() => {
    const saved = localStorage.getItem('nexela_sessions');
    return saved ? JSON.parse(saved) : PRE_SEEDED_SESSIONS;
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('nexela_projects');
    return saved ? JSON.parse(saved) : PRE_SEEDED_PROJECTS;
  });

  const [documents, setDocuments] = useState<DocumentRecord[]>(() => {
    const saved = localStorage.getItem('nexela_documents');
    return saved ? JSON.parse(saved) : PRE_SEEDED_DOCUMENTS;
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem('nexela_announcements');
    return saved ? JSON.parse(saved) : PRE_SEEDED_ANNOUNCEMENTS;
  });

  const [banners, setBanners] = useState<AppBanner[]>(() => {
    const saved = localStorage.getItem('nexela_banners');
    return saved ? JSON.parse(saved) : PRE_SEEDED_BANNERS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('nexela_audit_logs');
    return saved ? JSON.parse(saved) : PRE_SEEDED_AUDIT_LOGS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('nexela_notifications');
    return saved ? JSON.parse(saved) : [
      {
        id: 'n1',
        title: 'Welcome to Nexela!',
        content: 'Your secure Progressive Web App for multi-tenant community savings groups is ready.',
        timestamp: new Date().toISOString(),
        read: false
      }
    ];
  });

  const [activeGroup, setActiveGroup] = useState<SavingsGroup | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Persist states to local storage
  useEffect(() => {
    localStorage.setItem('nexela_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('nexela_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('nexela_groups', JSON.stringify(groups));
  }, [groups]);

  useEffect(() => {
    localStorage.setItem('nexela_tickets', JSON.stringify(tickets));
  }, [tickets]);

  useEffect(() => {
    localStorage.setItem('nexela_sessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem('nexela_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('nexela_documents', JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem('nexela_announcements', JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem('nexela_banners', JSON.stringify(banners));
  }, [banners]);

  useEffect(() => {
    localStorage.setItem('nexela_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('nexela_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Sync active group context automatically when user loads/changes group context
  useEffect(() => {
    if (currentUser && currentUser.groupId) {
      const g = groups.find(x => x.id === currentUser.groupId);
      if (g) {
        setActiveGroup(g);
      }
    } else {
      setActiveGroup(null);
    }
  }, [currentUser, groups]);

  // ----------------------------------------------------
  // Audit Logging Utility
  // ----------------------------------------------------
  const logAction = (userId: string, userName: string, action: string, details: string) => {
    const newLog: AuditLog = {
      id: `al-${Date.now()}`,
      userId,
      userName,
      action,
      details,
      timestamp: new Date().toISOString()
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // ----------------------------------------------------
  // Auth Operations
  // ----------------------------------------------------
  const login = async (email: string, role: User['role']): Promise<User> => {
    // Attempt to find existing user or seed a mock user if registering with login bypass
    let user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      // Create instant user
      const membershipNumber = `MEM-${Math.floor(100 + Math.random() * 900)}`;
      user = {
        id: `u-${Date.now()}`,
        fullName: email.split('@')[0].toUpperCase(),
        email: email,
        phone: '+1 800-555-0199',
        photoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
        role,
        status: 'Active',
        membershipNumber,
        joinedGroups: []
      };
      setUsers(prev => [...prev, user!]);
    } else {
      // Allow switching role on the fly for demonstration/testing flexibility if needed
      user = { ...user, role };
      setUsers(prev => prev.map(u => u.id === user!.id ? user! : u));
    }

    setCurrentUser(user);
    logAction(user.id, user.fullName, 'User Login', `Logged in as ${user.role} - Tenant context check.`);
    addNotification('Login Successful', `Welcome back, ${user.fullName}! Logged in as ${user.role}.`);
    return user;
  };

  const logout = () => {
    if (currentUser) {
      logAction(currentUser.id, currentUser.fullName, 'User Logout', 'User successfully signed out of SaaS platform.');
    }
    setCurrentUser(null);
    setActiveGroup(null);
  };

  const signUp = async (fullName: string, email: string, phone: string, role: User['role']): Promise<User> => {
    const membershipNumber = `MEM-${Math.floor(100 + Math.random() * 900)}`;
    const newUser: User = {
      id: `u-${Date.now()}`,
      fullName,
      email,
      phone,
      photoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
      role,
      status: 'Active',
      membershipNumber,
      joinedGroups: []
    };

    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    logAction(newUser.id, newUser.fullName, 'User Signup', `Registered a new tenant account with role: ${role}`);
    addNotification('Account Created', `Welcome to Nexela, ${fullName}! Your account has been securely verified.`);
    return newUser;
  };

  const updateUserRole = (userId: string, role: User['role']) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const updated = { ...u, role };
        if (currentUser?.id === userId) {
          setCurrentUser(updated);
        }
        return updated;
      }
      return u;
    }));
    logAction(currentUser?.id || 'System', currentUser?.fullName || 'System', 'Update Role', `Updated role of User ${userId} to ${role}`);
  };

  const resetPassword = async (email: string): Promise<string> => {
    return `A secure reset password link has been sent to ${email}. Please check your inbox and spam folder.`;
  };

  const updateProfileImage = (userId: string, photoUrl: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const updated = { ...u, photoUrl };
        if (currentUser?.id === userId) {
          setCurrentUser(updated);
        }
        return updated;
      }
      return u;
    }));
    logAction(userId, 'User', 'Profile Picture Updated', `Updated profile avatar to Cloudinary hosted URL: ${photoUrl}`);
  };

  // ----------------------------------------------------
  // Group Operations
  // ----------------------------------------------------
  const createGroup = async (groupData: Partial<SavingsGroup>, chairpersonId: string): Promise<SavingsGroup> => {
    const code = `INV-${Math.floor(100000 + Math.random() * 900000)}`;
    const newGroup: SavingsGroup = {
      id: `g-${Date.now()}`,
      name: groupData.name || 'Unnamed Savings Group',
      logo: groupData.logo || 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=150',
      description: groupData.description || 'No description supplied.',
      country: groupData.country || 'United States',
      currency: groupData.currency || 'USD',
      meetingSchedule: groupData.meetingSchedule || 'Sundays Weekly',
      contributionRules: groupData.contributionRules || 'Weekly standard minimum.',
      invitationCode: code,
      status: 'Active', // Auto-activated for premium user flows
      banners: []
    };

    setGroups(prev => [...prev, newGroup]);

    // Associate user with this group
    setUsers(prev => prev.map(u => {
      if (u.id === chairpersonId) {
        const updated = { ...u, groupId: newGroup.id, joinedGroups: Array.from(new Set([...(u.joinedGroups || []), newGroup.id])) };
        setCurrentUser(updated);
        return updated;
      }
      return u;
    }));

    logAction(chairpersonId, 'Chairperson', 'Created Savings Group', `Created Savings Group ${newGroup.name} with Invite Code: ${code}`);
    addNotification('Group Registered', `Group "${newGroup.name}" created successfully. Share Code: ${code} to invite members.`);
    return newGroup;
  };

  const joinGroupWithCode = async (code: string, userId: string): Promise<SavingsGroup> => {
    const group = groups.find(g => g.invitationCode.toUpperCase() === code.trim().toUpperCase());
    if (!group) {
      throw new Error('Invalid or expired invitation code. Please request an active code from your chairperson.');
    }
    if (group.status === 'Suspended') {
      throw new Error('This savings group has been temporarily suspended by the platform administrator.');
    }

    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const updated = { ...u, groupId: group.id, joinedGroups: Array.from(new Set([...(u.joinedGroups || []), group.id])) };
        setCurrentUser(updated);
        return updated;
      }
      return u;
    }));

    logAction(userId, 'Member', 'Joined Savings Group', `Successfully joined group: ${group.name}`);
    addNotification('Welcome to ' + group.name, 'You have joined the group. Start recording and tracking savings now.');
    return group;
  };

  const approveGroup = (groupId: string) => {
    setGroups(prev => prev.map(g => g.id === groupId ? { ...g, status: 'Active' as const } : g));
    logAction(currentUser?.id || 'Admin', 'Super Admin', 'Approved Savings Group', `Approved group ID: ${groupId}`);
    addNotification('Group Status Approved', `Savings Group ID ${groupId} has been marked Active.`);
  };

  const suspendGroup = (groupId: string) => {
    setGroups(prev => prev.map(g => g.id === groupId ? { ...g, status: 'Suspended' as const } : g));
    logAction(currentUser?.id || 'Admin', 'Super Admin', 'Suspended Savings Group', `Suspended group ID: ${groupId}`);
    addNotification('Group Status Suspended', `Savings Group ID ${groupId} is suspended.`);
  };

  const updateGroupBanners = (groupId: string, bannerUrls: string[]) => {
    setGroups(prev => prev.map(g => g.id === groupId ? { ...g, banners: bannerUrls } : g));
    logAction(currentUser?.id || 'User', 'Chairperson', 'Updated Group Banner', `Uploaded dashboard banner for group: ${groupId}`);
  };

  // ----------------------------------------------------
  // Support Tickets
  // ----------------------------------------------------
  const createTicket = async (ticketData: Omit<SupportTicket, 'id' | 'createdAt' | 'status' | 'readStatus' | 'conversation'>): Promise<SupportTicket> => {
    const newTicket: SupportTicket = {
      ...ticketData,
      id: `t-${Date.now()}`,
      status: 'Open',
      readStatus: 'Unread',
      createdAt: new Date().toISOString(),
      conversation: [
        {
          id: `conv-${Date.now()}`,
          sender: 'user',
          senderName: ticketData.name,
          message: ticketData.message,
          timestamp: new Date().toISOString()
        }
      ]
    };

    setTickets(prev => [newTicket, ...prev]);
    addNotification('Support Ticket Received', `Your ticket regarding "${ticketData.subject}" was sent. Super Admin has been notified.`);
    return newTicket;
  };

  const addReplyToTicket = (ticketId: string, message: string, sender: 'user' | 'admin', senderName: string) => {
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        const update: SupportTicket = {
          ...t,
          status: sender === 'admin' ? 'Pending' : 'Open',
          readStatus: sender === 'admin' ? 'Read' : 'Unread',
          conversation: [
            ...t.conversation,
            {
              id: `conv-rep-${Date.now()}`,
              sender,
              senderName,
              message,
              timestamp: new Date().toISOString()
            }
          ]
        };
        // Trigger push notification of real-time support message
        if (sender === 'admin') {
          addNotification('New Support Response', `Support Center: ${message.slice(0, 50)}...`);
        }
        return update;
      }
      return t;
    }));
  };

  const updateTicketStatus = (ticketId: string, status: SupportTicket['status']) => {
    setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status } : t));
  };

  const markTicketAsRead = (ticketId: string) => {
    setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, readStatus: 'Read' as const } : t));
  };

  // ----------------------------------------------------
  // Savings Sessions Operations
  // ----------------------------------------------------
  const createSavingsSession = async (sessionData: Omit<SavingSession, 'id'>): Promise<SavingSession> => {
    const newSession: SavingSession = {
      ...sessionData,
      id: `s-${Date.now()}`
    };
    setSessions(prev => [newSession, ...prev]);
    logAction(currentUser?.id || 'Treasurer', 'Treasurer', 'Created Saving Session', `Session on ${sessionData.meetingDate} with ${sessionData.savings.length} members tracked.`);
    addNotification('Saving Session Created', `Recorded savings for meeting on ${sessionData.meetingDate}.`);
    return newSession;
  };

  const updateSavingsRecord = (sessionId: string, memberId: string, saved: boolean, amount: number, paymentMethod: string, remarks?: string, reason?: string) => {
    setSessions(prev => prev.map(s => {
      if (s.id === sessionId) {
        const updatedSavings = s.savings.map(sav => {
          if (sav.memberId === memberId) {
            return {
              ...sav,
              saved,
              amount,
              paymentMethod: paymentMethod as any,
              remarks,
              reason,
              time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
            };
          }
          return sav;
        });

        const totalSaved = updatedSavings.reduce((acc, curr) => acc + (curr.saved ? curr.amount : 0), 0);
        return {
          ...s,
          savings: updatedSavings,
          totalSaved
        };
      }
      return s;
    }));
    logAction(currentUser?.id || 'Treasurer', 'Treasurer', 'Updated Saving Record', `Updated saving for member ID: ${memberId}`);
  };

  // ----------------------------------------------------
  // Projects
  // ----------------------------------------------------
  const createProject = async (projectData: Omit<Project, 'id' | 'progress'>): Promise<Project> => {
    const newProject: Project = {
      ...projectData,
      id: `p-${Date.now()}`,
      progress: Math.min(100, Math.round((projectData.collectedAmount / projectData.budget) * 100))
    };
    setProjects(prev => [newProject, ...prev]);
    logAction(currentUser?.id || 'Chairperson', 'Chairperson', 'Created Project', `Started new group project: ${projectData.name}`);
    addNotification('Project Created', `Project "${projectData.name}" has been launched successfully.`);
    return newProject;
  };

  const updateProjectProgress = (projectId: string, collected: number) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        const prog = Math.min(100, Math.round((collected / p.budget) * 100));
        return {
          ...p,
          collectedAmount: collected,
          progress: prog
        };
      }
      return p;
    }));
  };

  const addProjectPhoto = (projectId: string, photoUrl: string) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          photos: [...p.photos, photoUrl]
        };
      }
      return p;
    }));
  };

  // ----------------------------------------------------
  // Documents
  // ----------------------------------------------------
  const uploadDocument = async (docData: Omit<DocumentRecord, 'id' | 'uploadedAt'>): Promise<DocumentRecord> => {
    const newDoc: DocumentRecord = {
      ...docData,
      id: `d-${Date.now()}`,
      uploadedAt: new Date().toISOString()
    };
    setDocuments(prev => [newDoc, ...prev]);
    logAction(currentUser?.id || 'Secretary', 'Secretary', 'Uploaded Document', `Uploaded files for group: ${docData.title}`);
    addNotification('Document Uploaded', `File "${docData.title}" has been safely archived in Cloudinary storage emulator.`);
    return newDoc;
  };

  // ----------------------------------------------------
  // Announcements
  // ----------------------------------------------------
  const createAnnouncement = async (annData: Omit<Announcement, 'id' | 'createdAt'>): Promise<Announcement> => {
    const newAnn: Announcement = {
      ...annData,
      id: `a-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setAnnouncements(prev => [newAnn, ...prev]);
    logAction(currentUser?.id || 'Chairperson', 'Chairperson', 'Created Announcement', `Published: ${annData.title}`);
    addNotification('New Group Announcement', `Broadcasting: "${annData.title}" to all members.`);
    return newAnn;
  };

  // ----------------------------------------------------
  // App Banners
  // ----------------------------------------------------
  const createPlatformBanner = (bannerUrl: string, title: string) => {
    const newBanner: AppBanner = {
      id: `b-${Date.now()}`,
      imageUrl: bannerUrl,
      title,
      active: true
    };
    setBanners(prev => [...prev, newBanner]);
    logAction(currentUser?.id || 'SuperAdmin', 'Super Admin', 'Uploaded Global Banner', `Published home banner: ${title}`);
  };

  const deletePlatformBanner = (id: string) => {
    setBanners(prev => prev.filter(b => b.id !== id));
    logAction(currentUser?.id || 'SuperAdmin', 'Super Admin', 'Deleted Global Banner', `Removed banner ID: ${id}`);
  };

  // ----------------------------------------------------
  // Notifications
  // ----------------------------------------------------
  const addNotification = (title: string, content: string) => {
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title,
      content,
      timestamp: new Date().toISOString(),
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const markNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      users,
      groups,
      tickets,
      sessions,
      projects,
      documents,
      announcements,
      banners,
      auditLogs,
      notifications,
      activeGroup,
      setActiveGroup,
      login,
      logout,
      signUp,
      updateUserRole,
      resetPassword,
      updateProfileImage,
      createGroup,
      joinGroupWithCode,
      approveGroup,
      suspendGroup,
      updateGroupBanners,
      createTicket,
      addReplyToTicket,
      updateTicketStatus,
      markTicketAsRead,
      createSavingsSession,
      updateSavingsRecord,
      createProject,
      updateProjectProgress,
      addProjectPhoto,
      uploadDocument,
      createAnnouncement,
      createPlatformBanner,
      deletePlatformBanner,
      addNotification,
      clearNotifications,
      markNotificationsAsRead,
      logAction,
      searchQuery,
      setSearchQuery
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used inside an AppProvider');
  }
  return context;
};
