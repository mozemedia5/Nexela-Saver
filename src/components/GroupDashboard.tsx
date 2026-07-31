import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CustomChart } from './CustomChart';
import {
  Users, HandCoins,
  Sparkles, CheckCircle2, AlertCircle, Plus, FileText, UploadCloud,
  FileCheck, ShieldAlert, KeyRound, Check
} from 'lucide-react';

export const GroupDashboard: React.FC = () => {
  const {
    currentUser,
    activeGroup,
    users,
    sessions,
    projects,
    documents,
    announcements,
    createSavingsSession,
    updateSavingsRecord,
    createProject,
    uploadDocument,
    createAnnouncement,
    updateGroupBanners
  } = useApp();

  // Active dashboard view context tabs
  const [currentTab, setCurrentTab] = useState<'overview' | 'savings' | 'projects' | 'documents' | 'announcements' | 'members'>('overview');

  // Role details
  const role = currentUser?.role || 'Member';
  const isSuperAdmin = role === 'Platform Owner';
  const isChairperson = role === 'Chairperson';
  const isSecretary = role === 'Secretary';
  const isTreasurer = role === 'Treasurer';
  const isMember = role === 'Member';

  // Role edit check permissions helper
  const canManageSavings = isTreasurer;
  const canUploadDocs = isSecretary;
  const canAnnounce = isChairperson || isSecretary;

  // New session modal states
  const [meetingDate, setMeetingDate] = useState('');
  const [sessionTitle, setSessionTitle] = useState('');
  const [showSessionModal, setShowSessionModal] = useState(false);

  // New announcement form state
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annSuccess, setAnnSuccess] = useState(false);

  // New Document Upload state
  const [docTitle, setDocTitle] = useState('');
  const [docType, setDocType] = useState<'Attendance Sheet' | 'Signed Paper' | 'Meeting Minutes' | 'Bank Slip' | 'Receipt' | 'Other'>('Attendance Sheet');
  const [docFileUrl, setDocFileUrl] = useState('');
  const [docSuccess, setDocSuccess] = useState(false);

  // New Project Form state
  const [projName, setProjName] = useState('');
  const [projDesc, setProjDesc] = useState('');
  const [projBudget, setProjBudget] = useState(1000);
  const [projTimeline, setProjTimeline] = useState('');
  const [projPhoto, setProjPhoto] = useState('');
  const [projSuccess, setProjSuccess] = useState(false);

  // Custom Banner trigger state
  const [customBannerUrl, setCustomBannerUrl] = useState('');
  const [bannerSuccess, setBannerSuccess] = useState(false);

  // Group members filtering
  const groupMembers = users.filter(u => u.groupId === activeGroup?.id);

  // Savings session matching current active group
  const groupSessions = sessions.filter(s => s.groupId === activeGroup?.id);
  const latestSession = groupSessions[0];

  // Calculated KPI values
  const totalSavedVolume = groupSessions.reduce((acc, curr) => acc + curr.totalSaved, 0);
  const currentGroupProjects = projects.filter(p => p.groupId === activeGroup?.id);
  const totalProjectBudget = currentGroupProjects.reduce((acc, curr) => acc + curr.budget, 0);

  // Custom interactive charts values
  const savingsChartData = {
    labels: groupSessions.map(s => s.meetingDate).reverse(),
    datasets: [
      {
        label: 'Collected Session Savings Amount',
        data: groupSessions.map(s => s.totalSaved).reverse(),
        backgroundColor: '#3b82f6',
        borderColor: '#3b82f6',
        fill: false
      }
    ]
  };

  const projectBudgetChartData = {
    labels: currentGroupProjects.map(p => p.name),
    datasets: [
      {
        label: 'Budget Allocated ($)',
        data: currentGroupProjects.map(p => p.budget),
        backgroundColor: ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6'],
        borderColor: '#ffffff',
        fill: true
      }
    ]
  };

  // Launch fresh savings record tracking session
  const handleStartSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!meetingDate || !sessionTitle) return;

    // Seed savings collection with active group members
    const initialSavings = groupMembers.map(m => ({
      memberId: m.id,
      memberName: m.fullName,
      saved: true,
      amount: 50, // default minimum saving
      paymentMethod: 'Cash' as const
    }));

    await createSavingsSession({
      groupId: activeGroup?.id || 'g1',
      meetingDate,
      title: sessionTitle,
      savings: initialSavings,
      totalSaved: initialSavings.reduce((acc, curr) => acc + curr.amount, 0)
    });

    setMeetingDate('');
    setSessionTitle('');
    setShowSessionModal(false);
  };

  // Create group project
  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projName || !projBudget) return;

    await createProject({
      groupId: activeGroup?.id || 'g1',
      name: projName,
      description: projDesc,
      budget: Number(projBudget),
      collectedAmount: 0,
      timeline: projTimeline || 'Immediate',
      photos: [projPhoto || 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=600'],
      documents: []
    });

    setProjName('');
    setProjDesc('');
    setProjBudget(1000);
    setProjTimeline('');
    setProjPhoto('');
    setProjSuccess(true);
    setTimeout(() => setProjSuccess(false), 3000);
  };

  // Create Announcement
  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle || !annContent) return;

    await createAnnouncement({
      groupId: activeGroup?.id || 'g1',
      title: annTitle,
      content: annContent,
      createdBy: currentUser?.fullName || 'Chairperson'
    });

    setAnnTitle('');
    setAnnContent('');
    setAnnSuccess(true);
    setTimeout(() => setAnnSuccess(false), 3000);
  };

  // Upload Cloudinary Document
  const handleDocUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle || !docFileUrl) return;

    await uploadDocument({
      groupId: activeGroup?.id || 'g1',
      type: docType,
      title: docTitle,
      fileUrl: docFileUrl,
      uploadedBy: currentUser?.fullName || 'Secretary'
    });

    setDocTitle('');
    setDocFileUrl('');
    setDocSuccess(true);
    setTimeout(() => setDocSuccess(false), 3000);
  };

  // Chairperson Dashboard Banner Custom Image Update
  const handleAddCustomBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customBannerUrl || !activeGroup) return;

    updateGroupBanners(activeGroup.id, [customBannerUrl]);
    setCustomBannerUrl('');
    setBannerSuccess(true);
    setTimeout(() => setBannerSuccess(false), 3000);
  };

  if (!activeGroup) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-slate-100 shadow text-center">
        <ShieldAlert className="w-12 h-12 text-blue-600 mb-3 animate-pulse" />
        <h3 className="text-sm font-bold text-slate-800">No Tenant Group Context Selected</h3>
        <p className="text-xs text-slate-500 max-w-sm mt-1">
          Please join a group using an invitation code or select a pre-seeded group to view responsive charts, savings logs, and Secretary archives.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Group SaaS Banner displaying custom dashboard banner (Cloudinary stored) if exists */}
      <div
        style={{
          backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.85), rgba(30, 41, 59, 0.95)), url(${
            activeGroup.banners && activeGroup.banners[0]
              ? activeGroup.banners[0]
              : 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=1200'
          })`
        }}
        className="bg-cover bg-center text-white p-6 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between border border-white/10 relative overflow-hidden"
      >
        <div className="space-y-1.5 z-10 text-center md:text-left">
          <div className="inline-flex items-center space-x-1.5 bg-blue-500/20 px-3 py-1 rounded-full border border-blue-400/30 text-xs text-blue-300 font-bold mb-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Active tenant: {activeGroup.country} • {activeGroup.currency}</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight">{activeGroup.name}</h2>
          <p className="text-slate-300 text-xs font-medium max-w-xl">
            {activeGroup.description}
          </p>
          <p className="text-[10px] text-blue-300 font-bold">Meeting schedule: {activeGroup.meetingSchedule}</p>
        </div>

        {/* Share Invitation Code Widget */}
        <div className="mt-4 md:mt-0 flex flex-col items-center md:items-end space-y-1.5 z-10 bg-white/10 backdrop-blur border border-white/20 p-3 rounded-2xl">
          <span className="text-[9px] font-bold uppercase tracking-wider text-blue-200">Group Invite Code</span>
          <span className="font-mono text-base font-black tracking-widest text-white px-2.5 py-1 bg-blue-600/50 rounded-xl border border-blue-400/30">
            {activeGroup.invitationCode}
          </span>
          <span className="text-[8px] text-slate-300">Invite new members directly</span>
        </div>
      </div>

      {/* Role Notice alert header indicating permissions */}
      <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl flex flex-col md:flex-row md:items-center justify-between text-xs gap-2">
        <div className="flex items-center space-x-2">
          <KeyRound className="w-4 h-4 text-blue-600 shrink-0" />
          <p className="text-slate-600 font-medium">
            Logged in as <strong className="text-blue-600 uppercase font-black">{role}</strong>.
            {isSuperAdmin && " Super Admin holds safe read-only access here."}
            {isChairperson && " You hold permissions to create announcements and manage dashboard banners."}
            {isSecretary && " You hold permissions to record meetings, upload minutes, and manage archives."}
            {isTreasurer && " You hold full permissions to modify and record member savings ledgers."}
            {isMember && " You have access to review savings ledger, files, schedules, and profile context."}
          </p>
        </div>

        {/* Custom Group Dashboard Banner Manager for Chairperson */}
        {isChairperson && (
          <form onSubmit={handleAddCustomBanner} className="flex items-center space-x-2 shrink-0">
            <input
              type="url"
              required
              placeholder="Cloudinary banner image..."
              value={customBannerUrl}
              onChange={(e) => setCustomBannerUrl(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-[10px] w-48 outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-2 py-1 rounded-lg text-[9px] cursor-pointer"
            >
              Set Banner
            </button>
          </form>
        )}
      </div>

      {bannerSuccess && (
        <div className="bg-emerald-50 text-emerald-800 p-2.5 rounded-xl border border-emerald-100 text-xs font-semibold flex items-center space-x-1.5">
          <Check className="w-3.5 h-3.5 text-emerald-600" />
          <span>Dashboard campaign banner updated successfully!</span>
        </div>
      )}

      {/* Group Dashboard Inner Nav Tabs */}
      <div className="flex overflow-x-auto pb-1 space-x-2 border-b border-slate-100">
        {[
          { id: 'overview', label: 'Group Overview', icon: CheckCircle2 },
          { id: 'savings', label: 'Savings Ledger', icon: HandCoins },
          { id: 'projects', label: 'Cooperative Projects', icon: CheckCircle2 },
          { id: 'documents', label: 'Secretary Archive', icon: FileText },
          { id: 'announcements', label: 'Announcements', icon: CheckCircle2 },
          { id: 'members', label: 'Member Directory', icon: Users }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: GROUP OVERVIEW PANEL */}
      {currentTab === 'overview' && (
        <div className="space-y-6">

          {/* Key KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Cumulative Savings', value: `${activeGroup.currency} ${totalSavedVolume.toLocaleString()}`, sub: 'All group sessions', icon: HandCoins, color: 'text-blue-600 bg-blue-50' },
              { label: 'Active Members', value: groupMembers.length, sub: 'SaaS ledger tracked', icon: Users, color: 'text-emerald-600 bg-emerald-50' },
              { label: 'Group Projects', value: currentGroupProjects.length, sub: `Budget: ${activeGroup.currency} ${totalProjectBudget}`, icon: CheckCircle2, color: 'text-amber-600 bg-amber-50' },
              { label: 'Secretary Documents', value: documents.filter(d => d.groupId === activeGroup.id).length, sub: 'Cloudinary verified', icon: FileText, color: 'text-purple-600 bg-purple-50' }
            ].map((kpi, i) => {
              const Icon = kpi.icon;
              return (
                <div key={i} className="bg-white/95 p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">{kpi.label}</span>
                    <div className={`p-1.5 rounded-lg ${kpi.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-800">{kpi.value}</h3>
                    <p className="text-[10px] font-semibold text-slate-500 mt-0.5">{kpi.sub}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Group Interactive Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CustomChart type="line" data={savingsChartData} title={`Group Historical Savings Volume Trend (${activeGroup.currency})`} />
            <CustomChart type="doughnut" data={projectBudgetChartData} title="Allocated Project Budgets Structure" />
          </div>

          {/* Latest Session Savings Stream overview */}
          {latestSession ? (
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider">Latest Session Review</h3>
                  <p className="text-xs font-bold text-slate-800">{latestSession.title} ({latestSession.meetingDate})</p>
                </div>
                <span className="text-xs font-bold bg-blue-50 text-blue-700 px-3 py-1 rounded-xl">
                  Total Collected: {activeGroup.currency} {latestSession.totalSaved}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-2">
                {latestSession.savings.map((s, idx) => (
                  <div key={idx} className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-center space-y-1">
                    <p className="text-[11px] font-bold text-slate-700 truncate">{s.memberName}</p>
                    <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                      s.saved ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {s.saved ? `Saved ${activeGroup.currency}${s.amount}` : 'Not Saved'}
                    </span>
                    {s.reason && <p className="text-[9px] text-rose-600 font-semibold truncate italic">Reason: {s.reason}</p>}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white/50 p-6 rounded-2xl text-center border text-xs text-slate-500 font-medium">
              No saving session records have been initiated yet.
            </div>
          )}

        </div>
      )}

      {/* TAB 2: SAVINGS LEDGER PANEL */}
      {currentTab === 'savings' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Historical Savings Ledger</h3>
                <p className="text-xs text-slate-500">View and update saved values, payment methods, or delayed reason codes.</p>
              </div>

              {/* Start Saving Session Trigger Button (Treasurer Only) */}
              {canManageSavings && (
                <button
                  onClick={() => setShowSessionModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition shadow flex items-center space-x-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Start New Session</span>
                </button>
              )}
            </div>

            {/* Savings Modal Form */}
            {showSessionModal && (
              <div className="bg-slate-50 p-5 rounded-2xl border border-blue-100 space-y-4 animate-in fade-in duration-200">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Configure Saving Session</h3>
                <form onSubmit={handleStartSession} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Session Date</label>
                    <input
                      type="date"
                      required
                      value={meetingDate}
                      onChange={(e) => setMeetingDate(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Session Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Weekly Savings Meeting #19"
                      value={sessionTitle}
                      onChange={(e) => setSessionTitle(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl text-xs shadow-md cursor-pointer"
                    >
                      Initialize
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowSessionModal(false)}
                      className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-2 px-4 rounded-xl text-xs cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Render savings sessions list */}
            <div className="space-y-4">
              {groupSessions.map((session) => (
                <div key={session.id} className="border border-slate-100 rounded-2xl p-4 bg-slate-50/50 space-y-3">
                  <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200/50 pb-2 gap-2">
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">{session.title}</h4>
                      <p className="text-[10px] text-slate-400 font-semibold">Ledger Date: {session.meetingDate}</p>
                    </div>
                    <span className="text-xs font-extrabold text-blue-700 bg-blue-50 border border-blue-100 px-3 py-1 rounded-xl self-start">
                      Total Savings Collected: {activeGroup.currency} {session.totalSaved}
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="text-slate-400 font-extrabold uppercase tracking-wider text-[9px]">
                          <th className="pb-2">Member</th>
                          <th className="pb-2">Status</th>
                          <th className="pb-2">Amount ({activeGroup.currency})</th>
                          <th className="pb-2">Payment Method</th>
                          <th className="pb-2">Remarks/Reason</th>
                          {canManageSavings && <th className="pb-2 text-right">Update Record</th>}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                        {session.savings.map((s) => (
                          <tr key={s.memberId}>
                            <td className="py-2.5 font-bold text-slate-800">{s.memberName}</td>
                            <td className="py-2.5">
                              <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                                s.saved ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                              }`}>
                                {s.saved ? 'Saved' : 'Delayed'}
                              </span>
                            </td>
                            <td className="py-2.5 font-bold">{s.amount}</td>
                            <td className="py-2.5 text-[10px] text-slate-500 font-bold">{s.paymentMethod}</td>
                            <td className="py-2.5 text-[10px]">
                              {s.saved ? (
                                <span className="text-slate-500">{s.remarks || 'On-time standard'}</span>
                              ) : (
                                <span className="text-rose-600 font-semibold italic">Reason: {s.reason || 'None provided'}</span>
                              )}
                            </td>
                            {canManageSavings && (
                              <td className="py-2.5 text-right space-x-1">
                                <button
                                  onClick={() => updateSavingsRecord(session.id, s.memberId, true, 50, 'Cash', 'Direct deposit')}
                                  className="text-emerald-600 hover:bg-emerald-50 px-2 py-1 rounded text-[10px] font-bold cursor-pointer"
                                >
                                  Mark Saved
                                </button>
                                <button
                                  onClick={() => {
                                    const reason = prompt('Specify delayed reason code:');
                                    if (reason) {
                                      updateSavingsRecord(session.id, s.memberId, false, 0, 'None', undefined, reason);
                                    }
                                  }}
                                  className="text-rose-600 hover:bg-rose-50 px-2 py-1 rounded text-[10px] font-bold cursor-pointer"
                                >
                                  Delay
                                </button>
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}

      {/* TAB 3: COOPERATIVE PROJECTS PANEL */}
      {currentTab === 'projects' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Create Project card (Chairperson/Secretary) */}
          <div className="lg:col-span-1 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm h-fit">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center space-x-1.5">
              <Plus className="w-4 h-4 text-blue-500" />
              <span>Launch Group Project</span>
            </h3>

            {projSuccess && (
              <div className="bg-emerald-50 text-emerald-800 p-2.5 rounded-xl border border-emerald-100 text-xs font-semibold mb-3 flex items-center space-x-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Project launched successfully!</span>
              </div>
            )}

            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Project Name</label>
                <input
                  type="text"
                  required
                  value={projName}
                  onChange={(e) => setProjName(e.target.value)}
                  placeholder="e.g. Water Well Cooperative"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Detailed Description</label>
                <textarea
                  rows={2}
                  value={projDesc}
                  onChange={(e) => setProjDesc(e.target.value)}
                  placeholder="Details and objectives of project..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:ring-1 focus:ring-blue-500 outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Budget Allocation ({activeGroup.currency})</label>
                <input
                  type="number"
                  required
                  value={projBudget}
                  onChange={(e) => setProjBudget(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Project Target Timeline</label>
                <input
                  type="text"
                  value={projTimeline}
                  onChange={(e) => setProjTimeline(e.target.value)}
                  placeholder="e.g. Aug 2026 - Dec 2026"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Cloudinary Photo URL</label>
                <input
                  type="url"
                  value={projPhoto}
                  onChange={(e) => setProjPhoto(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:ring-1 focus:ring-blue-500 outline-none font-mono text-[10px]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl text-xs transition shadow-md cursor-pointer"
              >
                Launch Project
              </button>
            </form>
          </div>

          {/* Active Projects Cards display */}
          <div className="lg:col-span-2 space-y-4">
            {currentGroupProjects.map((p) => (
              <div key={p.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col md:flex-row">
                <img src={p.photos[0]} alt={p.name} className="w-full md:w-48 h-40 object-cover" />
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">{p.name}</h3>
                    <p className="text-[11px] text-slate-500 leading-relaxed mt-1">{p.description}</p>
                  </div>

                  {/* Progress Indicator */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-bold">
                      <span className="text-slate-400 uppercase tracking-wider">Fundraising Progress</span>
                      <span className="text-blue-600">{p.progress}% Completed</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-blue-600 h-2" style={{ width: `${p.progress}%` }} />
                    </div>
                    <p className="text-[10px] text-slate-500 font-semibold pt-1">
                      Collected: <strong>{activeGroup.currency} {p.collectedAmount}</strong> / Budget: {activeGroup.currency} {p.budget}
                    </p>
                  </div>

                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Timeline: {p.timeline}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* TAB 4: SECRETARY ARCHIVES PANEL */}
      {currentTab === 'documents' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Document upload form (Secretary only) */}
          <div className="lg:col-span-1 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm h-fit">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center space-x-1.5">
              <UploadCloud className="w-4 h-4 text-blue-500" />
              <span>Archive Signed Document</span>
            </h3>

            {docSuccess && (
              <div className="bg-emerald-50 text-emerald-800 p-2.5 rounded-xl border border-emerald-100 text-xs font-semibold mb-3 flex items-center space-x-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Document safely archived in Cloudinary!</span>
              </div>
            )}

            {canUploadDocs ? (
              <form onSubmit={handleDocUpload} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Document Title</label>
                  <input
                    type="text"
                    required
                    value={docTitle}
                    onChange={(e) => setDocTitle(e.target.value)}
                    placeholder="e.g. Bank slip #429"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Document Type</label>
                  <select
                    value={docType}
                    onChange={(e) => setDocType(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:ring-1 focus:ring-blue-500 outline-none font-bold text-slate-700"
                  >
                    <option value="Attendance Sheet">Attendance Sheet</option>
                    <option value="Signed Paper">Signed Paper</option>
                    <option value="Meeting Minutes">Meeting Minutes</option>
                    <option value="Bank Slip">Bank Slip</option>
                    <option value="Receipt">Receipt</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Cloudinary File Link URL</label>
                  <input
                    type="url"
                    required
                    value={docFileUrl}
                    onChange={(e) => setDocFileUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:ring-1 focus:ring-blue-500 outline-none font-mono text-[10px]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl text-xs transition shadow-md cursor-pointer"
                >
                  Archive Document
                </button>
              </form>
            ) : (
              <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl text-xs text-rose-700 flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <p>Only the designated <strong>Group Secretary</strong> has administrative authorization to archive paperwork in the Cloudinary ledger.</p>
              </div>
            )}
          </div>

          {/* Documents display table */}
          <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Archived Documents Ledger</h3>
              <p className="text-xs text-slate-500">Official archived signed paperwork, physical attendance registers, and bank receipts.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {documents.filter(d => d.groupId === activeGroup.id).map((doc) => (
                <div key={doc.id} className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm bg-slate-50 flex flex-col justify-between">
                  <div className="relative">
                    <img src={doc.fileUrl} alt={doc.title} className="w-full h-32 object-cover" />
                    <span className="absolute top-2 left-2 bg-blue-600 text-white text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {doc.type}
                    </span>
                  </div>
                  <div className="p-3 bg-white space-y-1">
                    <p className="text-xs font-bold text-slate-800 truncate">{doc.title}</p>
                    <p className="text-[9px] text-slate-400 font-medium">Uploaded by: {doc.uploadedBy}</p>
                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center space-x-1 text-blue-600 hover:underline text-[10px] font-bold pt-1"
                    >
                      <FileCheck className="w-3.5 h-3.5" />
                      <span>View Signed Doc File</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB 5: ANNOUNCEMENTS PANEL */}
      {currentTab === 'announcements' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Create Announcement card (Chairperson/Secretary) */}
          <div className="lg:col-span-1 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm h-fit">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-blue-500" />
              <span>Broadcast Announcement</span>
            </h3>

            {annSuccess && (
              <div className="bg-emerald-50 text-emerald-800 p-2.5 rounded-xl border border-emerald-100 text-xs font-semibold mb-3 flex items-center space-x-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Announcement published to members!</span>
              </div>
            )}

            {canAnnounce ? (
              <form onSubmit={handleCreateAnnouncement} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Headline</label>
                  <input
                    type="text"
                    required
                    value={annTitle}
                    onChange={(e) => setAnnTitle(e.target.value)}
                    placeholder="e.g. Audit schedule next Sunday"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Detailed Content</label>
                  <textarea
                    required
                    rows={4}
                    value={annContent}
                    onChange={(e) => setAnnContent(e.target.value)}
                    placeholder="Write details and broadcast alerts..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:ring-1 focus:ring-blue-500 outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl text-xs transition shadow-md cursor-pointer"
                >
                  Publish & Send Alerts
                </button>
              </form>
            ) : (
              <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl text-xs text-rose-700 flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <p>Only the Group <strong>Chairperson</strong> or <strong>Secretary</strong> holds permission to broadcast push alerts.</p>
              </div>
            )}
          </div>

          {/* Announcements thread listing */}
          <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Broadcast Alerts Stream</h3>
              <p className="text-xs text-slate-500">Real-time alerts received by savings group members.</p>
            </div>

            <div className="space-y-4">
              {announcements.filter(a => a.groupId === activeGroup.id).map((ann) => (
                <div key={ann.id} className="border border-blue-50 bg-blue-50/10 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-extrabold text-slate-800">{ann.title}</h4>
                    <span className="text-[9px] text-slate-400 font-semibold">{new Date(ann.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{ann.content}</p>
                  <div className="text-[10px] text-blue-600 font-bold flex items-center space-x-1 pt-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Broadcaster: {ann.createdBy}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB 6: MEMBER DIRECTORY PANEL */}
      {currentTab === 'members' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Group Member Directory</h3>
            <p className="text-xs text-slate-500">Complete list of registered saving tenants and assigned governance roles.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {groupMembers.map((member) => (
              <div key={member.id} className="border border-slate-100 bg-slate-50/50 p-4 rounded-2xl flex items-center space-x-3 shadow-sm hover:scale-[1.01] transition-transform duration-200">
                <img src={member.photoUrl} alt={member.fullName} className="w-11 h-11 rounded-full object-cover border-2 border-white shadow" />
                <div>
                  <h4 className="text-xs font-bold text-slate-800">{member.fullName}</h4>
                  <p className="text-[10px] text-slate-500">ID: {member.membershipNumber || 'NXL-MEM'}</p>
                  <p className="text-[9px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full inline-block font-extrabold mt-1">
                    {member.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
