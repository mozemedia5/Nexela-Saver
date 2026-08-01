import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CustomChart } from './CustomChart';
import {
  Users, Layers, Landmark, HardDrive, ShieldCheck, HeartPulse,
  Search, ShieldAlert, Send, Settings, BookOpen,
  Trash2, PlusCircle, Check
} from 'lucide-react';

export const SuperAdminDashboard: React.FC = () => {
  const {
    groups,
    users,
    tickets,
    auditLogs,
    banners,
    approveGroup,
    suspendGroup,
    addReplyToTicket,
    updateTicketStatus,
    createPlatformBanner,
    deletePlatformBanner,
    currentUser
  } = useApp();

  // Active admin tab inside super panel
  const [activeTab, setActiveTab] = useState<'overview' | 'groups' | 'tickets' | 'banners' | 'audit' | 'settings'>('overview');

  // Support Inbox states
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(tickets[0]?.id || null);
  const [adminReplyText, setAdminReplyText] = useState('');

  // Banner creation state
  const [newBannerTitle, setNewBannerTitle] = useState('');
  const [newBannerUrl, setNewBannerUrl] = useState('');
  const [bannerSuccess, setBannerSuccess] = useState(false);

  // Group filter state
  const [groupSearch, setGroupSearch] = useState('');

  // Find active ticket details
  const activeTicket = tickets.find(t => t.id === selectedTicketId);

  // Stats calculation
  const totalGroups = groups.length;
  const totalMembers = users.length;
  const activeUsersToday = Math.round(totalMembers * 0.75);
  const platformRevenue = totalGroups * 49; // $49/month standard subscription
  const storageUsageMB = 124.8;
  const cloudinaryUsagePct = 24.5;

  // Handle support ticket reply from Super Admin
  const handleAdminReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicketId || !adminReplyText.trim()) return;

    addReplyToTicket(
      selectedTicketId,
      adminReplyText.trim(),
      'admin',
      'Super Admin'
    );
    setAdminReplyText('');
  };

  // Add new Banner to Cloudinary
  const handleAddBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBannerTitle || !newBannerUrl) return;

    createPlatformBanner(newBannerUrl, newBannerTitle);
    setNewBannerTitle('');
    setNewBannerUrl('');
    setBannerSuccess(true);
    setTimeout(() => setBannerSuccess(false), 3000);
  };

  // Pre-seed premium charts datasets
  const groupGrowthData = {
    labels: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Platform Registered Groups',
        data: [12, 19, 26, 34, 45, totalGroups + 40],
        backgroundColor: '#2563eb',
        borderColor: '#2563eb',
        fill: true
      }
    ]
  };

  const revenueData = {
    labels: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Monthly Platform SaaS Revenue ($)',
        data: [600, 950, 1300, 1700, 2200, platformRevenue + 1950],
        backgroundColor: '#10b981',
        borderColor: '#10b981',
        fill: true
      }
    ]
  };

  return (
    <div className="space-y-6">

      {/* SaaS Admin Banner with premium neumorphic look */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-6 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
        <div className="space-y-1.5 z-10 text-center md:text-left">
          <div className="inline-flex items-center space-x-2 bg-blue-500/20 px-3 py-1 rounded-full border border-blue-400/30 text-xs text-blue-300 font-bold mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Platform Owner Control Hub</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight">Nexela Saver System Administration</h2>
          <p className="text-slate-300 text-xs font-medium max-w-xl">
            You have full control over independent savings groups, subscription status, global banner displays, live support tickets, and live developer audit logs.
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-3 z-10 bg-white/5 backdrop-blur border border-white/10 p-3 rounded-2xl">
          <img
            src={currentUser?.photoUrl || "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200"}
            alt="Super Admin Avatar"
            className="w-10 h-10 rounded-full object-cover border-2 border-blue-400 shadow-md"
          />
          <div className="text-left">
            <p className="text-xs font-bold text-white">{currentUser?.fullName || "David Liverton"}</p>
            <p className="text-[10px] font-bold text-blue-300 uppercase tracking-wider">Super Admin</p>
          </div>
        </div>
      </div>

      {/* Admin Tab Switcher Menu using Neumorphism */}
      <div className="flex overflow-x-auto pb-1.5 space-x-3">
        {[
          { id: 'overview', label: 'Platform Overview', icon: Landmark },
          { id: 'groups', label: 'Manage Groups', icon: Layers },
          { id: 'tickets', label: 'Support Center', icon: Users },
          { id: 'banners', label: 'Promo Banners', icon: BookOpen },
          { id: 'audit', label: 'System Audit Logs', icon: ShieldAlert },
          { id: 'settings', label: 'SaaS Config', icon: Settings }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-5 py-3 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-300 cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                  : 'neo-btn-secondary text-slate-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* OVERVIEW PANEL */}
      {activeTab === 'overview' && (
        <div className="space-y-6">

          {/* Key SaaS Metrics Grid with Soft Neumorphism */}
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-5">
            {[
              { label: 'Total Groups', value: totalGroups, sub: '+2 this week', icon: Layers, color: 'text-blue-600' },
              { label: 'Total Members', value: totalMembers, sub: '+18 today', icon: Users, color: 'text-indigo-600' },
              { label: 'Daily Active', value: activeUsersToday, sub: '75% retention', icon: HeartPulse, color: 'text-emerald-600' },
              { label: 'SaaS Revenue', value: `$${platformRevenue}/mo`, sub: '$49/mo per tenant', icon: Landmark, color: 'text-amber-600' },
              { label: 'Cloudinary storage', value: `${storageUsageMB}MB`, sub: '20GB limit', icon: HardDrive, color: 'text-purple-600' },
              { label: 'API Usage', value: `${cloudinaryUsagePct}%`, sub: 'Cloudinary OK', icon: ShieldCheck, color: 'text-rose-600' }
            ].map((metric, i) => {
              const Icon = metric.icon;
              return (
                <div key={i} className="neo-card p-5 flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">{metric.label}</span>
                    <div className={`p-1.5 rounded-lg bg-slate-100 ${metric.color}`}>
                      <Icon className="w-4.5 h-4.5" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-800">{metric.value}</h3>
                    <p className="text-[10px] font-semibold text-slate-500 mt-0.5">{metric.sub}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* SaaS Core Premium Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="neo-card p-1">
              <CustomChart type="bar" data={groupGrowthData} title="Nexela Saver Platform SaaS Group Enrollment Trends (2026)" />
            </div>
            <div className="neo-card p-1">
              <CustomChart type="line" data={revenueData} title="Platform Monthly Recurring Revenue Growth Forecast ($)" />
            </div>
          </div>

          {/* Quick Support Tickets overview & System Health */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* System Health */}
            <div className="lg:col-span-1 neo-card p-6 space-y-4">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Platform Health Diagnostic</h3>
              <div className="space-y-3">
                {[
                  { name: 'Firebase Authenticator', status: 'Optimal (99.99%)', ok: true },
                  { name: 'Cloud Firestore Simulator', status: 'Synchronized', ok: true },
                  { name: 'Cloudinary Image Pipeline', status: 'Online (Secure)', ok: true },
                  { name: 'Nexela Saver Multi-Tenant Gateway', status: 'Broadcasting Active', ok: true }
                ].map((s, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 font-medium">{s.name}</span>
                    <span className={`font-bold px-2 py-0.5 rounded ${s.ok ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                      {s.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Ticket Alerts */}
            <div className="lg:col-span-2 neo-card p-6 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Unresolved Support Alerts</h3>
                <button onClick={() => setActiveTab('tickets')} className="text-blue-600 text-[10px] font-extrabold hover:underline">Open Inbox</button>
              </div>
              <div className="divide-y divide-slate-100">
                {tickets.slice(0, 3).map((t) => (
                  <div key={t.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-800">{t.subject}</p>
                      <p className="text-[10px] text-slate-500">From {t.name} ({t.email})</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      t.status === 'Open' ? 'bg-amber-100 text-amber-800' :
                      t.status === 'Pending' ? 'bg-blue-100 text-blue-800' :
                      'bg-slate-100 text-slate-800'
                    }`}>
                      {t.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* MANAGE GROUPS PANEL */}
      {activeTab === 'groups' && (
        <div className="neo-card p-6 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Multi-Tenant Savings Groups</h3>
              <p className="text-xs text-slate-500">Approve new savings circles, view registration parameters, or restrict access.</p>
            </div>

            {/* Group search filter */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search groups..."
                value={groupSearch}
                onChange={(e) => setGroupSearch(e.target.value)}
                className="neo-input pl-9 pr-4 py-2 text-xs w-60"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3.5 rounded-l-xl">Group Details</th>
                  <th className="p-3.5">Invite Code</th>
                  <th className="p-3.5">Meeting Schedule</th>
                  <th className="p-3.5">Country & Currency</th>
                  <th className="p-3.5">Financial Protection Policy</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 rounded-r-xl text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {groups
                  .filter(g => g.name.toLowerCase().includes(groupSearch.toLowerCase()) || g.country.toLowerCase().includes(groupSearch.toLowerCase()))
                  .map((g) => (
                    <tr key={g.id} className="hover:bg-slate-50/50 transition">
                      <td className="p-3.5 flex items-center space-x-3">
                        <img src={g.logo} alt={g.name} className="w-10 h-10 rounded-2xl object-cover border border-slate-100" />
                        <div>
                          <p className="font-bold text-slate-800 text-xs">{g.name}</p>
                          <p className="text-[10px] text-slate-500 max-w-[200px] truncate">{g.description}</p>
                        </div>
                      </td>
                      <td className="p-3.5">
                        <span className="font-mono font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-700 text-[10px]">{g.invitationCode}</span>
                      </td>
                      <td className="p-3.5 font-medium">{g.meetingSchedule}</td>
                      <td className="p-3.5">
                        <p className="font-semibold">{g.country}</p>
                        <p className="text-[10px] text-slate-400 font-bold">{g.currency}</p>
                      </td>
                      <td className="p-3.5 max-w-[240px] truncate text-[10px] text-rose-500 font-semibold">
                        Platform Owner: Read-Only. Financial ledger changes locked.
                      </td>
                      <td className="p-3.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          g.status === 'Active' ? 'bg-emerald-100 text-emerald-800' :
                          g.status === 'Pending' ? 'bg-amber-100 text-amber-800' :
                          'bg-rose-100 text-rose-800'
                        }`}>
                          {g.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-right space-x-1.5">
                        {g.status !== 'Active' ? (
                          <button
                            onClick={() => approveGroup(g.id)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1 rounded-xl transition text-[10px] cursor-pointer"
                          >
                            Approve
                          </button>
                        ) : (
                          <button
                            onClick={() => suspendGroup(g.id)}
                            className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-3 py-1 rounded-xl transition text-[10px] cursor-pointer"
                          >
                            Suspend
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUPPORT CENTER / INBOX PANEL */}
      {activeTab === 'tickets' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 neo-card overflow-hidden h-[580px]">

          {/* Ticket List Sidebar */}
          <div className="lg:col-span-1 border-r border-slate-100 flex flex-col h-full bg-slate-50/50">
            <div className="p-4 border-b border-slate-100 bg-white">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Live Customer Inquiries</h3>
              <p className="text-[10px] text-slate-400">Manage SaaS queries in real-time</p>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
              {tickets.map((t) => {
                const isSelected = t.id === selectedTicketId;
                return (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTicketId(t.id)}
                    className={`w-full text-left p-4 transition flex flex-col space-y-1.5 ${
                      isSelected ? 'bg-blue-50/70 border-l-4 border-blue-600' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide truncate max-w-[120px]">
                        {t.name}
                      </span>
                      <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ${
                        t.status === 'Open' ? 'bg-amber-100 text-amber-800' :
                        t.status === 'Pending' ? 'bg-blue-100 text-blue-800' :
                        t.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' :
                        'bg-slate-100 text-slate-800'
                      }`}>
                        {t.status}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-800 truncate">{t.subject}</p>
                    <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed">{t.message}</p>
                    <span className="text-[8px] text-slate-400 font-medium self-end">
                      {new Date(t.createdAt).toLocaleDateString()}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Ticket Conversation Detail Panel */}
          <div className="lg:col-span-2 flex flex-col h-full bg-white">
            {activeTicket ? (
              <div className="flex flex-col h-full">

                {/* Active Header */}
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-slate-800">{activeTicket.subject}</h3>
                    <p className="text-[10px] text-slate-500">
                      User: <strong>{activeTicket.name}</strong> • Email: <strong className="text-blue-600">{activeTicket.email}</strong>
                    </p>
                  </div>

                  {/* Status controls */}
                  <div className="flex items-center space-x-2">
                    <select
                      value={activeTicket.status}
                      onChange={(e) => updateTicketStatus(activeTicket.id, e.target.value as any)}
                      className="neo-input text-xs px-2.5 py-1.5 font-bold text-slate-700"
                    >
                      <option value="Open">Open</option>
                      <option value="Pending">Pending</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>
                </div>

                {/* Ticket Conversation Scroll */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/30">
                  {/* Original Inquiry Card */}
                  <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm text-xs space-y-2">
                    <span className="text-[9px] font-extrabold text-blue-600 uppercase tracking-widest">Initial Ticket Inquiry</span>
                    <p className="text-slate-800 leading-relaxed font-medium">{activeTicket.message}</p>
                    {activeTicket.screenshot && (
                      <div className="mt-2">
                        <span className="text-[9px] text-slate-400 font-bold block mb-1">Attached Cloudinary Screenshot:</span>
                        <img
                          src={activeTicket.screenshot}
                          alt="Screenshot Attachment"
                          className="max-h-48 rounded-xl object-contain border border-slate-200 shadow-sm"
                        />
                      </div>
                    )}
                  </div>

                  {/* Thread Replies */}
                  {activeTicket.conversation.slice(1).map((conv) => {
                    const isAdmin = conv.sender === 'admin';
                    return (
                      <div key={conv.id} className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] rounded-2xl p-3 shadow-sm ${
                          isAdmin
                            ? 'bg-blue-600 text-white rounded-tr-none'
                            : 'bg-slate-100 text-slate-800 rounded-tl-none'
                        }`}>
                          <p className="text-[9px] font-bold opacity-85 mb-1">{conv.senderName}</p>
                          <p className="text-xs leading-relaxed">{conv.message}</p>
                          <span className="text-[8px] opacity-75 mt-1 block text-right">
                            {new Date(conv.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Admin Live Reply Form */}
                <form onSubmit={handleAdminReply} className="p-4 border-t border-slate-100 flex items-center space-x-2">
                  <input
                    type="text"
                    value={adminReplyText}
                    onChange={(e) => setAdminReplyText(e.target.value)}
                    placeholder="Type reply to member (sends instantly in PWA chat)..."
                    className="neo-input flex-1 px-4 py-3 text-xs"
                  />
                  <button
                    type="submit"
                    className="neo-btn-primary font-bold p-3 transition cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>

              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 text-xs">
                <Users className="w-10 h-10 mb-2 opacity-50 text-slate-300" />
                <p>Select a ticket from the left sidebar to start live assistance conversations.</p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* PROMO BANNERS PANEL */}
      {activeTab === 'banners' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Create Promo Banner Form */}
          <div className="lg:col-span-1 neo-card p-5 h-fit">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center space-x-1.5">
              <PlusCircle className="w-4 h-4 text-blue-500" />
              <span>Create Global Banner</span>
            </h3>

            {bannerSuccess && (
              <div className="bg-emerald-50 text-emerald-800 p-2.5 rounded-xl border border-emerald-100 text-[10px] font-bold mb-3 flex items-center space-x-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Banner successfully saved!</span>
              </div>
            )}

            <form onSubmit={handleAddBanner} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Banner Headline</label>
                <input
                  type="text"
                  required
                  value={newBannerTitle}
                  onChange={(e) => setNewBannerTitle(e.target.value)}
                  placeholder="e.g. Save Smart with Nexela Saver Liverton"
                  className="neo-input w-full px-3.5 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Cloudinary Banner Image URL</label>
                <input
                  type="url"
                  required
                  value={newBannerUrl}
                  onChange={(e) => setNewBannerUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="neo-input w-full px-3.5 py-2 text-xs font-mono"
                />
                <p className="text-[9px] text-slate-400 mt-1 font-medium">Use high-res banner landscape dimensions (1200x400).</p>
              </div>

              <button
                type="submit"
                className="w-full neo-btn-primary font-bold py-2.5 px-4 text-xs cursor-pointer"
              >
                Upload Global Banner
              </button>
            </form>
          </div>

          {/* Active Banner Display */}
          <div className="lg:col-span-2 neo-card p-5 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Active Campaign Banners</h3>
              <p className="text-xs text-slate-500">Currently live and broadcasting to home screens of all registered savings groups.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {banners.map((b) => (
                <div key={b.id} className="border border-slate-100 rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between bg-white">
                  <div className="relative">
                    <img src={b.imageUrl} alt={b.title} className="w-full h-32 object-cover" />
                    <span className="absolute top-2 left-2 bg-emerald-500 text-white text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Active Campaign
                    </span>
                  </div>
                  <div className="p-3 bg-slate-50 flex items-center justify-between">
                    <p className="text-[10px] font-bold text-slate-800 truncate max-w-[200px]">{b.title}</p>
                    <button
                      onClick={() => deletePlatformBanner(b.id)}
                      className="text-rose-600 hover:text-rose-700 p-1.5 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* SYSTEM AUDIT LOGS PANEL */}
      {activeTab === 'audit' && (
        <div className="neo-card p-5 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Immutable SaaS Audit Logs</h3>
            <p className="text-xs text-slate-500">Track and monitor active tenant logs, administrative status changes, and critical savings operations.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3">Log Timestamp</th>
                  <th className="p-3">Trigger Account</th>
                  <th className="p-3">Action Class</th>
                  <th className="p-3 rounded-r-xl">Operation Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 transition">
                    <td className="p-3 text-slate-400 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="p-3 font-semibold text-slate-800">
                      {log.userName}
                    </td>
                    <td className="p-3">
                      <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-[10px] font-bold">
                        {log.action}
                      </span>
                    </td>
                    <td className="p-3 text-slate-500 max-w-sm truncate font-medium">
                      {log.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SaaS CONFIGURATION TAB */}
      {activeTab === 'settings' && (
        <div className="neo-card p-6 max-w-xl space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Nexela Saver Subscription Settings</h3>
          <p className="text-xs text-slate-500">Manage payment settings, support thresholds, and Cloudinary API quotas.</p>

          <div className="space-y-3 pt-2 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="font-semibold text-slate-600">Default Group Registration Fee</span>
              <span className="font-bold text-slate-800">$49 / Month</span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="font-semibold text-slate-600">Cloudinary Monthly Credits Quota</span>
              <span className="font-bold text-slate-800">50,000 requests</span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="font-semibold text-slate-600">Firestore Read/Write Pool</span>
              <span className="font-bold text-slate-800">10,000,000 per tenant</span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="font-semibold text-slate-600">Automated Push Notification Alerts</span>
              <span className="text-emerald-600 font-bold">Enabled</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
