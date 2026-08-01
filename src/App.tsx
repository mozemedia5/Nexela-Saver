import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import { SuperAdminDashboard } from './components/SuperAdminDashboard';
import { GroupDashboard } from './components/GroupDashboard';
import { ReportsAndExports } from './components/ReportsAndExports';
import { SupportChat } from './components/SupportChat';
import {
  Layers, Landmark, Bell, Search, LogOut,
  Menu, X, Sparkles, AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

function App() {
  const {
    currentUser,
    groups,
    login,
    logout,
    signUp,
    notifications,
    clearNotifications,
    markNotificationsAsRead,
    activeGroup,
    setActiveGroup,
    joinGroupWithCode,
    createGroup,
    searchQuery,
    setSearchQuery,
    users,
    sessions,
    projects,
    documents,
    tickets
  } = useApp();

  // Desktop sidebar vs Mobile drawer
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeScreen, setActiveScreen] = useState<'dashboard' | 'reports'>('dashboard');

  // Auth Modals & flows
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authRole, setAuthRole] = useState<'Platform Owner' | 'Chairperson' | 'Secretary' | 'Treasurer' | 'Committee Member' | 'Member'>('Member');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [isRegisterFlow, setIsRegisterFlow] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  // Group creation & join screens
  const [inviteCode, setInviteCode] = useState('');
  const [joinSuccess, setJoinSuccess] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);

  // Create Group form
  const [grpName, setGrpName] = useState('');
  const [grpDesc, setGrpDesc] = useState('');
  const [grpCountry, setGrpCountry] = useState('United States');
  const [grpCurrency, setGrpCurrency] = useState('USD');
  const [grpMeeting, setGrpMeeting] = useState('');
  const [grpRules, setGrpRules] = useState('');
  const [createSuccess, setCreateSuccess] = useState(false);

  // Global UI search overlay trigger
  const [showSearchModal, setShowSearchModal] = useState(false);

  // Notification overlay popup trigger
  const [showNotifModal, setShowNotifModal] = useState(false);

  const unreadNotifs = notifications.filter(n => !n.read).length;

  const handleConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 }
    });
  };

  // Submit Login/Register
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegisterFlow) {
      if (!fullName || !email) return;
      await signUp(fullName, email, phone, authRole);
    } else {
      if (!email) return;
      await login(email, authRole);
    }
    handleConfetti();
  };

  // Join group submitting invitation code
  const handleJoinWithCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCode || !currentUser) return;
    try {
      setJoinError(null);
      await joinGroupWithCode(inviteCode, currentUser.id);
      setJoinSuccess(true);
      handleConfetti();
      setTimeout(() => setJoinSuccess(false), 3000);
    } catch (err: any) {
      setJoinError(err.message || 'Error joining group');
    }
  };

  // Create brand new group
  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!grpName || !currentUser) return;

    await createGroup({
      name: grpName,
      description: grpDesc,
      country: grpCountry,
      currency: grpCurrency,
      meetingSchedule: grpMeeting,
      contributionRules: grpRules
    }, currentUser.id);

    setGrpName('');
    setGrpDesc('');
    setGrpMeeting('');
    setGrpRules('');
    setCreateSuccess(true);
    handleConfetti();
    setTimeout(() => setCreateSuccess(false), 3000);
  };

  // Global search filtering across groups, projects, users, documents, tickets, sessions
  const handleGlobalSearch = () => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    const results: { category: string; title: string; subtitle: string }[] = [];

    // Search groups
    groups.forEach(g => {
      if (g.name.toLowerCase().includes(query) || g.country.toLowerCase().includes(query)) {
        results.push({ category: 'Savings Group', title: g.name, subtitle: `${g.country} • Invite Code: ${g.invitationCode}` });
      }
    });

    // Search members
    users.forEach(u => {
      if (u.fullName.toLowerCase().includes(query) || u.email.toLowerCase().includes(query)) {
        results.push({ category: 'Member Directory', title: u.fullName, subtitle: `${u.role} • ${u.email}` });
      }
    });

    // Search cooperative projects
    projects.forEach(p => {
      if (p.name.toLowerCase().includes(query) || p.description.toLowerCase().includes(query)) {
        results.push({ category: 'Cooperative Project', title: p.name, subtitle: `Budget: ${p.budget} • Timeline: ${p.timeline}` });
      }
    });

    // Search archived files
    documents.forEach(d => {
      if (d.title.toLowerCase().includes(query) || d.type.toLowerCase().includes(query)) {
        results.push({ category: 'Secretary Document', title: d.title, subtitle: `Type: ${d.type} • Uploaded by ${d.uploadedBy}` });
      }
    });

    // Search support inbox
    tickets.forEach(t => {
      if (t.subject.toLowerCase().includes(query) || t.name.toLowerCase().includes(query)) {
        results.push({ category: 'Support Center Ticket', title: t.subject, subtitle: `User: ${t.name} • Status: ${t.status}` });
      }
    });

    // Search historical meeting schedules
    sessions.forEach(s => {
      if (s.title.toLowerCase().includes(query) || s.meetingDate.toLowerCase().includes(query)) {
        results.push({ category: 'Savings Ledger Session', title: s.title, subtitle: `Date: ${s.meetingDate} • Collected Total: ${s.totalSaved}` });
      }
    });

    return results;
  };

  const searchResults = handleGlobalSearch();

  // Switch context group tenant manually
  const handleTenantContextSwitch = (gId: string) => {
    const selected = groups.find(g => g.id === gId);
    if (selected) {
      setActiveGroup(selected);
      handleConfetti();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col justify-between">

      {/* ----------------------------------------------------------------------
          UNAUTHENTICATED LANDING & LOGIN (FINTECH NEUMORPHIC / GLASSMORPHIC)
          ---------------------------------------------------------------------- */}
      {!currentUser ? (
        <div className="flex-1 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden bg-white">

          {/* Ambient vector glowing blobs */}
          <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-blue-100 rounded-full blur-3xl opacity-60 -z-10" />
          <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-indigo-50 rounded-full blur-3xl opacity-60 -z-10" />

          <div className="max-w-md w-full bg-white/75 backdrop-blur-2xl rounded-3xl p-8 border border-blue-50 shadow-2xl flex flex-col space-y-6">

            <div className="text-center space-y-2">
              <div className="inline-flex items-center space-x-1.5 bg-blue-50 px-3 py-1 rounded-full text-[10px] font-black text-blue-600 uppercase tracking-widest border border-blue-100">
                <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                <span>Nexela Saver Multi-Tenant SaaS</span>
              </div>
              <h1 className="text-3xl font-black text-slate-800 tracking-tight leading-none pt-2">Nexela Saver</h1>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Secure multi-tenant savings cooperative cloud platform by Liverton. Build financial resilience together.
              </p>
            </div>

            {/* Social fast login bypass options */}
            <div className="space-y-2">
              <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">Fast-track sandbox login</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { name: 'Google Login', email: 'david@nexela.com', role: 'Platform Owner' as const },
                  { name: 'Apple Bypass', email: 'jane@chair.com', role: 'Chairperson' as const },
                  { name: 'Facebook Log', email: 'mark@tres.com', role: 'Treasurer' as const },
                  { name: 'Microsoft Key', email: 'alice@sec.com', role: 'Secretary' as const }
                ].map((oauth, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      login(oauth.email, oauth.role);
                      handleConfetti();
                    }}
                    className="bg-white hover:bg-slate-50 border border-slate-200 text-[11px] font-bold py-2 px-3 rounded-xl transition shadow-sm flex items-center justify-center space-x-1 cursor-pointer"
                  >
                    <span>{oauth.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink mx-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Or Use standard credentials</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            {/* Credential Auth Form */}
            <form onSubmit={handleAuthSubmit} className="space-y-4">

              {isRegisterFlow && (
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. David Liverton"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="david@nexela.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {!resetSent && (
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              )}

              {isRegisterFlow && (
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 800 555-0199"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              )}

              {/* Role Picker Selection inside Sandbox for fast testing */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Assign User Role (SaaS Context)</label>
                <select
                  value={authRole}
                  onChange={(e: any) => setAuthRole(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-1 focus:ring-blue-500 font-bold text-slate-700"
                >
                  <option value="Platform Owner">Platform Owner (Super Admin)</option>
                  <option value="Chairperson">Chairperson (Group Creator)</option>
                  <option value="Secretary">Secretary (Records Keeper)</option>
                  <option value="Treasurer">Treasurer (Savings Admin)</option>
                  <option value="Committee Member">Committee Member (Auditor)</option>
                  <option value="Member">Standard Member (Savings User)</option>
                </select>
              </div>

              {resetSent && (
                <div className="bg-emerald-50 text-emerald-800 p-2.5 rounded-xl border border-emerald-100 text-xs font-semibold">
                  A reset link has been successfully generated and sent to {email}.
                </div>
              )}

              <div className="flex items-center justify-between text-[11px] font-bold">
                <label className="flex items-center space-x-1.5 text-slate-500">
                  <input type="checkbox" defaultChecked className="rounded text-blue-600 focus:ring-blue-500" />
                  <span>Remember Me</span>
                </label>
                <button
                  type="button"
                  onClick={() => setResetSent(true)}
                  className="text-blue-600 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-xl shadow-lg hover:shadow-blue-500/20 transition-all duration-300 text-xs"
              >
                {isRegisterFlow ? 'Complete SaaS Registration' : 'Secure Login'}
              </button>
            </form>

            <div className="text-center">
              <button
                onClick={() => setIsRegisterFlow(!isRegisterFlow)}
                className="text-xs text-blue-600 hover:underline font-bold"
              >
                {isRegisterFlow ? 'Already hold an account? Log In' : 'Create standard tenant account'}
              </button>
            </div>

          </div>

          <p className="text-[10px] text-slate-400 mt-8 font-medium">
            Nexela Saver Cooperative Services • Powered securely via Cloudinary, Chart.js & Vercel Edge.
          </p>
        </div>
      ) : (

        /* ----------------------------------------------------------------------
            AUTHENTICATED VIEW - SHELL / WORKSPACE (DESKTOP + MOBILE BOTTOM NAV)
            ---------------------------------------------------------------------- */
        <div className="flex-1 flex flex-col md:flex-row">

          {/* DESKTOP SIDEBAR NAVIGATION */}
          <aside className="hidden md:flex md:w-64 bg-slate-900 text-slate-300 flex-col justify-between border-r border-slate-800/50 shrink-0">
            <div className="p-6 space-y-6">

              {/* Logo / Title */}
              <div className="flex items-center space-x-2.5 pb-2 border-b border-slate-800">
                <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center font-black text-white text-base shadow-lg shadow-blue-500/20">
                  N
                </div>
                <div>
                  <h1 className="text-lg font-black tracking-tight text-white leading-none">Nexela Saver</h1>
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">by Liverton</span>
                </div>
              </div>

              {/* Sidebar Tabs Links */}
              <nav className="space-y-1.5 text-xs font-bold">
                <button
                  onClick={() => {
                    setActiveScreen('dashboard');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition ${
                    activeScreen === 'dashboard'
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/10'
                      : 'hover:bg-slate-800/50 hover:text-white'
                  }`}
                >
                  <Layers className="w-4.5 h-4.5" />
                  <span>SaaS Dashboard</span>
                </button>

                <button
                  onClick={() => {
                    setActiveScreen('reports');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition ${
                    activeScreen === 'reports'
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/10'
                      : 'hover:bg-slate-800/50 hover:text-white'
                  }`}
                >
                  <Landmark className="w-4.5 h-4.5" />
                  <span>Reports & Exports</span>
                </button>
              </nav>

              {/* Multitenant Group Switcher Context */}
              {currentUser.role !== 'Platform Owner' && (
                <div className="space-y-2 pt-4">
                  <span className="text-[9px] font-black uppercase tracking-wider text-slate-500 block">Switch Group Tenant</span>
                  <div className="space-y-1.5">
                    {groups
                      .filter(g => currentUser.joinedGroups?.includes(g.id))
                      .map((g) => (
                        <button
                          key={g.id}
                          onClick={() => handleTenantContextSwitch(g.id)}
                          className={`w-full text-left p-2.5 rounded-xl transition flex items-center space-x-2 text-[11px] font-bold ${
                            activeGroup?.id === g.id
                              ? 'bg-slate-800 text-white border border-blue-500/30'
                              : 'hover:bg-slate-800/30 text-slate-400'
                          }`}
                        >
                          <img src={g.logo} alt="" className="w-5 h-5 rounded-md object-cover" />
                          <span className="truncate">{g.name}</span>
                        </button>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Sidebar Admin Card & Logout */}
            <div className="p-4 bg-slate-950 border-t border-slate-800/60 text-xs">
              <div className="flex items-center space-x-2.5 mb-3">
                <img
                  src={currentUser.photoUrl}
                  alt=""
                  className="w-8.5 h-8.5 rounded-full object-cover border border-slate-700"
                />
                <div className="truncate">
                  <p className="font-extrabold text-white truncate">{currentUser.fullName}</p>
                  <p className="text-[9px] text-slate-500 uppercase tracking-widest truncate">{currentUser.role}</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="w-full bg-slate-800 hover:bg-rose-950 hover:text-rose-200 text-slate-300 font-bold py-2 px-3 rounded-xl transition flex items-center justify-center space-x-2 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out Session</span>
              </button>
            </div>
          </aside>

          {/* MAIN PAGE AREA */}
          <div className="flex-1 flex flex-col min-w-0">

            {/* TOP NAVIGATION HEADBAR */}
            <header className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden text-slate-700 hover:text-slate-900 focus:outline-none"
                >
                  {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
                <h2 className="text-sm font-bold tracking-tight text-slate-800 hidden md:block">
                  {activeScreen === 'dashboard' ? 'Multi-Tenant Management Console' : 'Audit Reports Exporting Suite'}
                </h2>
                <div className="md:hidden font-black text-blue-600 text-lg">Nexela Saver PWA</div>
              </div>

              {/* Actions Header widgets */}
              <div className="flex items-center space-x-3">

                {/* Global Search trigger */}
                <button
                  onClick={() => setShowSearchModal(true)}
                  className="p-2 hover:bg-slate-50 text-slate-500 hover:text-slate-800 rounded-xl border border-slate-100 transition relative flex items-center space-x-1 cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                  <span className="text-[10px] font-bold hidden md:inline">Global Search</span>
                </button>

                {/* Notifications Bell trigger */}
                <button
                  onClick={() => {
                    setShowNotifModal(true);
                    markNotificationsAsRead();
                  }}
                  className="p-2 hover:bg-slate-50 text-slate-500 hover:text-slate-800 rounded-xl border border-slate-100 transition relative cursor-pointer"
                >
                  <Bell className="w-4 h-4" />
                  {unreadNotifs > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-blue-600 text-white font-extrabold text-[9px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white animate-bounce">
                      {unreadNotifs}
                    </span>
                  )}
                </button>

                {/* Mobile Logout option */}
                <button
                  onClick={logout}
                  className="md:hidden p-2 hover:bg-rose-50 text-rose-600 rounded-xl border border-rose-100 transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>

              </div>
            </header>

            {/* WORKSPACE PAGE VIEW WRAPPER */}
            <main className="flex-1 overflow-y-auto p-6 space-y-6">

              {/* GROUP REGISTRATION / REGISTRATION INTERACTION FLOW FOR NON-OWNER AND NO GROUPS JOINS */}
              {currentUser.role !== 'Platform Owner' && currentUser.joinedGroups?.length === 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                  {/* Join Group with Code card */}
                  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                    <div className="space-y-1">
                      <h3 className="text-sm font-black text-slate-800">Join Registered Savings Group</h3>
                      <p className="text-xs text-slate-500">Input invitation credentials supplied by your chairperson.</p>
                    </div>

                    {joinSuccess && (
                      <div className="bg-emerald-50 text-emerald-800 p-2.5 rounded-xl border border-emerald-100 text-xs font-semibold">
                        Successfully associated with savings group! Loading dashboard...
                      </div>
                    )}

                    {joinError && (
                      <div className="bg-rose-50 text-rose-800 p-2.5 rounded-xl border border-rose-100 text-xs font-semibold">
                        {joinError}
                      </div>
                    )}

                    <form onSubmit={handleJoinWithCode} className="space-y-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Invitation Code</label>
                        <input
                          type="text"
                          required
                          value={inviteCode}
                          onChange={(e) => setInviteCode(e.target.value)}
                          placeholder="e.g. HORIZON777"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs focus:ring-1 focus:ring-blue-500"
                        />
                      </div>

                      {/* Phone verification simulator */}
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Simulated SMS Verification Phone</label>
                        <input
                          type="text"
                          defaultValue={currentUser.phone}
                          className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-2 text-xs cursor-not-allowed"
                          disabled
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-xl text-xs shadow-md transition"
                      >
                        Verify & Join Circle
                      </button>
                    </form>
                  </div>

                  {/* Create Brand New Savings Group (Chairperson Only) */}
                  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                    <div className="space-y-1">
                      <h3 className="text-sm font-black text-slate-800">Register Premium Savings Tenant</h3>
                      <p className="text-xs text-slate-500">Initiate automated record tracking for thousands of independent members.</p>
                    </div>

                    {createSuccess && (
                      <div className="bg-emerald-50 text-emerald-800 p-2.5 rounded-xl border border-emerald-100 text-xs font-semibold">
                        Tenant Group created! Switching administrative dashboard...
                      </div>
                    )}

                    {currentUser.role === 'Chairperson' ? (
                      <form onSubmit={handleCreateGroup} className="space-y-3 grid grid-cols-1 md:grid-cols-2 gap-3 items-end">
                        <div className="md:col-span-2">
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Cooperative Name</label>
                          <input
                            type="text"
                            required
                            value={grpName}
                            onChange={(e) => setGrpName(e.target.value)}
                            placeholder="e.g. Dublin Wealth Trust"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-1.5 text-xs outline-none"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Description / Goal</label>
                          <input
                            type="text"
                            value={grpDesc}
                            onChange={(e) => setGrpDesc(e.target.value)}
                            placeholder="Saving objective guidelines..."
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-1.5 text-xs outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Country</label>
                          <input
                            type="text"
                            value={grpCountry}
                            onChange={(e) => setGrpCountry(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-1.5 text-xs outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Currency Code</label>
                          <input
                            type="text"
                            value={grpCurrency}
                            onChange={(e) => setGrpCurrency(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-1.5 text-xs outline-none"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Meeting Schedule</label>
                          <input
                            type="text"
                            required
                            value={grpMeeting}
                            onChange={(e) => setGrpMeeting(e.target.value)}
                            placeholder="Sundays Bi-weekly 4:00 PM"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-1.5 text-xs outline-none"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Saving contribution rules</label>
                          <input
                            type="text"
                            value={grpRules}
                            onChange={(e) => setGrpRules(e.target.value)}
                            placeholder="Minimum limits, fine codes..."
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-1.5 text-xs outline-none"
                          />
                        </div>
                        <button
                          type="submit"
                          className="md:col-span-2 w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-2.5 rounded-xl text-xs shadow-md"
                        >
                          Launch SaaS Group Circle
                        </button>
                      </form>
                    ) : (
                      <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl text-xs text-rose-700 flex items-start space-x-2">
                        <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
                        <p>Only the <strong>Group Chairperson</strong> role holds permissions to create a brand new multi-tenant cooperative node.</p>
                      </div>
                    )}
                  </div>

                </div>
              )}

              {/* CORE SCREEN TAB ROUTING SWITCH */}
              {activeScreen === 'dashboard' && (
                currentUser.role === 'Platform Owner' ? (
                  <SuperAdminDashboard />
                ) : (
                  currentUser.joinedGroups && currentUser.joinedGroups.length > 0 && (
                    <GroupDashboard />
                  )
                )
              )}

              {activeScreen === 'reports' && (
                <ReportsAndExports />
              )}

            </main>

          </div>

          {/* MOBILE SLIDE OVER DRAWER LAYOUT */}
          {mobileMenuOpen && (
            <div className="fixed inset-0 z-40 md:hidden flex">
              <div className="fixed inset-0 bg-slate-900/60" onClick={() => setMobileMenuOpen(false)} />
              <div className="relative w-64 max-w-xs bg-slate-900 text-slate-300 p-6 flex flex-col justify-between z-10 animate-in slide-in-from-left duration-200">
                <div className="space-y-6">

                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center font-black text-white text-base">
                        N
                      </div>
                      <h1 className="text-lg font-black tracking-tight text-white leading-none">Nexela Saver</h1>
                    </div>
                    <button onClick={() => setMobileMenuOpen(false)} className="text-slate-400 hover:text-white">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <nav className="space-y-2 text-xs font-bold">
                    <button
                      onClick={() => {
                        setActiveScreen('dashboard');
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition ${
                        activeScreen === 'dashboard' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800/50'
                      }`}
                    >
                      <Layers className="w-4.5 h-4.5" />
                      <span>SaaS Dashboard</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveScreen('reports');
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition ${
                        activeScreen === 'reports' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800/50'
                      }`}
                    >
                      <Landmark className="w-4.5 h-4.5" />
                      <span>Reports & Exports</span>
                    </button>
                  </nav>

                </div>

                <div className="p-4 bg-slate-950 border-t border-slate-800 text-xs">
                  <div className="flex items-center space-x-2 mb-3">
                    <img src={currentUser.photoUrl} alt="" className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <p className="font-extrabold text-white text-[11px] truncate">{currentUser.fullName}</p>
                      <p className="text-[9px] text-slate-500 uppercase tracking-widest">{currentUser.role}</p>
                    </div>
                  </div>
                  <button
                    onClick={logout}
                    className="w-full bg-slate-800 hover:bg-rose-900 text-slate-300 font-bold py-2 px-3 rounded-xl text-xs transition flex items-center justify-center space-x-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* MOBILE BOTTOM NAVIGATION BAR */}
          <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 py-2.5 px-6 flex items-center justify-around z-30 shadow-lg">
            <button
              onClick={() => setActiveScreen('dashboard')}
              className={`flex flex-col items-center justify-center space-y-1 transition ${
                activeScreen === 'dashboard' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Layers className="w-5 h-5" />
              <span className="text-[9px] font-bold">Dashboard</span>
            </button>

            <button
              onClick={() => setActiveScreen('reports')}
              className={`flex flex-col items-center justify-center space-y-1 transition ${
                activeScreen === 'reports' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Landmark className="w-5 h-5" />
              <span className="text-[9px] font-bold">Reports</span>
            </button>
          </nav>

        </div>
      )}

      {/* ----------------------------------------------------
          GLOBAL POPUP MODAL DIALOGS (GLASSMORPHIC BACKDROPS)
          ---------------------------------------------------- */}

      {/* MODAL 1: SEARCH RESULTS POPUP */}
      {showSearchModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden flex flex-col h-[400px]">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Global Search Platform Registry</span>
              <button onClick={() => setShowSearchModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-slate-50 border-b border-slate-100">
              <input
                type="text"
                autoFocus
                placeholder="Search across meetings, groups, projects, documents, tickets, members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {searchResults.length > 0 ? (
                searchResults.map((res, i) => (
                  <div key={i} className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-0.5 text-xs">
                    <span className="text-[9px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full inline-block font-extrabold uppercase mb-1">
                      {res.category}
                    </span>
                    <h4 className="font-bold text-slate-800">{res.title}</h4>
                    <p className="text-[10px] text-slate-500">{res.subtitle}</p>
                  </div>
                ))
              ) : (
                <div className="text-center text-slate-400 text-xs py-12">
                  <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>Type keywords to query members, projects, meetings, files and support tickets.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: NOTIFICATIONS LOG POPUP */}
      {showNotifModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden flex flex-col h-[400px]">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
                <Bell className="w-4 h-4 text-blue-500 animate-pulse" />
                <span>Real-time Broadcast Notifications</span>
              </span>
              <button onClick={() => setShowNotifModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {notifications.length > 0 ? (
                notifications.map((n) => (
                  <div key={n.id} className="p-3 bg-slate-50/75 border border-slate-100 rounded-xl space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-800">{n.title}</h4>
                      <span className="text-[8px] text-slate-400 font-semibold">{new Date(n.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">{n.content}</p>
                  </div>
                ))
              ) : (
                <div className="text-center text-slate-400 text-xs py-12">
                  <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No active notifications received in this session context.</p>
                </div>
              )}
            </div>

            <div className="p-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <button
                onClick={clearNotifications}
                className="text-rose-600 hover:underline text-[10px] font-bold"
              >
                Clear All Alerts
              </button>
              <button
                onClick={() => setShowNotifModal(false)}
                className="bg-blue-600 text-white px-3 py-1 rounded-lg text-[10px] font-bold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FLOAT SUPPORT CHAT TRIGGER */}
      <SupportChat />

    </div>
  );
}

export default App;
