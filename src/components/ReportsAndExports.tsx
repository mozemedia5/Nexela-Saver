import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Download, FileText, CheckCircle, Database } from 'lucide-react';

export const ReportsAndExports: React.FC = () => {
  const { activeGroup, sessions, projects, documents } = useApp();
  const [filterType, setFilterType] = useState<'Daily' | 'Weekly' | 'Monthly' | 'Yearly'>('Monthly');
  const [exportSuccess, setExportSuccess] = useState<string | null>(null);

  const groupSessions = sessions.filter(s => s.groupId === activeGroup?.id);
  const groupProjects = projects.filter(p => p.groupId === activeGroup?.id);
  const groupDocs = documents.filter(d => d.groupId === activeGroup?.id);

  // Trigger high-fidelity browser download simulation
  const handleExport = (format: 'PDF' | 'Excel' | 'CSV', reportName: string, headers: string[], rows: any[][]) => {
    // Generate actual file text contents
    let content = '';
    let filename = `NexelaSaver_${reportName.replace(/\s+/g, '_')}_${filterType}.${format.toLowerCase()}`;

    if (format === 'CSV') {
      content = [headers.join(','), ...rows.map(r => r.map(cell => `"${cell}"`).join(','))].join('\n');
    } else {
      // Simulate fully custom spreadsheet XML/TXT or structured layout
      content = `--- Nexela Saver Premium Report: ${reportName} ---\n`;
      content += `Generated on: ${new Date().toLocaleDateString()}\n`;
      content += `Filter Category: ${filterType}\n`;
      content += `Group: ${activeGroup?.name || 'All Savings Groups'}\n\n`;
      content += headers.join('\t | \t') + '\n';
      content += '-'.repeat(100) + '\n';
      rows.forEach(r => {
        content += r.join('\t | \t') + '\n';
      });
    }

    // Trigger dynamic browser download anchor
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExportSuccess(`Successfully downloaded "${filename}" report!`);
    setTimeout(() => setExportSuccess(null), 4000);
  };

  if (!activeGroup) {
    return (
      <div className="bg-white p-8 rounded-2xl border text-center text-xs text-slate-500 font-medium">
        Please select a tenant group context first to compile official savings or project reports.
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">

      {/* Header & Filter options */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-4 gap-4">
        <div>
          <h3 className="text-sm font-bold text-slate-800">Financial Reports & Exports Centre</h3>
          <p className="text-xs text-slate-500">Generate high-fidelity daily, weekly, monthly, and yearly audits. Export instantly.</p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Report Filter:</span>
          {['Daily', 'Weekly', 'Monthly', 'Yearly'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                filterType === type
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {exportSuccess && (
        <div className="bg-emerald-50 text-emerald-800 p-3 rounded-xl border border-emerald-100 text-xs font-bold flex items-center space-x-2 animate-bounce">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{exportSuccess}</span>
        </div>
      )}

      {/* Reports Tables Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* REPORT 1: SAVINGS SESSIONS REVENUE REPORT */}
        <div className="border border-slate-100 rounded-2xl p-5 bg-slate-50/50 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
              <Database className="w-4 h-4 text-blue-500" />
              <span>Savings & Contributions Audit ({filterType})</span>
            </h4>

            {/* Formats trigger buttons */}
            <div className="flex items-center space-x-1">
              {['CSV', 'Excel', 'PDF'].map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => {
                    const headers = ['Meeting Session Title', 'Meeting Date', 'Total Saved Amount'];
                    const rows = groupSessions.map(s => [s.title, s.meetingDate, `${activeGroup.currency} ${s.totalSaved}`]);
                    handleExport(fmt as any, 'Savings_Audit', headers, rows);
                  }}
                  className="bg-white hover:bg-slate-100 border border-slate-200 px-2 py-1 rounded text-[10px] font-extrabold text-slate-700 flex items-center space-x-1 cursor-pointer"
                >
                  <Download className="w-3 h-3 text-slate-400" />
                  <span>{fmt}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="text-[10px] uppercase font-bold text-slate-400">
                <tr>
                  <th className="pb-2">Session Headline</th>
                  <th className="pb-2">Session Date</th>
                  <th className="pb-2 text-right">Saved Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {groupSessions.map((s) => (
                  <tr key={s.id}>
                    <td className="py-2 font-bold text-slate-800">{s.title}</td>
                    <td className="py-2 text-slate-500">{s.meetingDate}</td>
                    <td className="py-2 text-right font-bold text-blue-600">{activeGroup.currency} {s.totalSaved}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* REPORT 2: PROJECT CONTRIBUTIONS AUDIT */}
        <div className="border border-slate-100 rounded-2xl p-5 bg-slate-50/50 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
              <FileText className="w-4 h-4 text-blue-500" />
              <span>Cooperative Project Fundraising ({filterType})</span>
            </h4>

            {/* Formats trigger buttons */}
            <div className="flex items-center space-x-1">
              {['CSV', 'Excel', 'PDF'].map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => {
                    const headers = ['Project Name', 'Fundraising Budget', 'Amount Collected', 'Completion Percentage'];
                    const rows = groupProjects.map(p => [p.name, `${activeGroup.currency} ${p.budget}`, `${activeGroup.currency} ${p.collectedAmount}`, `${p.progress}%`]);
                    handleExport(fmt as any, 'Project_Status', headers, rows);
                  }}
                  className="bg-white hover:bg-slate-100 border border-slate-200 px-2 py-1 rounded text-[10px] font-extrabold text-slate-700 flex items-center space-x-1 cursor-pointer"
                >
                  <Download className="w-3 h-3 text-slate-400" />
                  <span>{fmt}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="text-[10px] uppercase font-bold text-slate-400">
                <tr>
                  <th className="pb-2">Project</th>
                  <th className="pb-2">Allocated Budget</th>
                  <th className="pb-2">Amount Collected</th>
                  <th className="pb-2 text-right">Progress</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {groupProjects.map((p) => (
                  <tr key={p.id}>
                    <td className="py-2 font-bold text-slate-800">{p.name}</td>
                    <td className="py-2">{activeGroup.currency} {p.budget}</td>
                    <td className="py-2 font-bold text-emerald-600">{activeGroup.currency} {p.collectedAmount}</td>
                    <td className="py-2 text-right font-extrabold text-slate-700">{p.progress}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* REPORT 3: SECRETARY ATTENDANCE & FILES AUDIT */}
        <div className="border border-slate-100 rounded-2xl p-5 bg-slate-50/50 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
              <FileText className="w-4 h-4 text-blue-500" />
              <span>Secretary Archives & Papers Register</span>
            </h4>

            {/* Formats trigger buttons */}
            <div className="flex items-center space-x-1">
              {['CSV', 'Excel', 'PDF'].map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => {
                    const headers = ['Document Record ID', 'Document Type', 'Headline Title', 'Uploaded By', 'Uploaded At'];
                    const rows = groupDocs.map(d => [d.id, d.type, d.title, d.uploadedBy, new Date(d.uploadedAt).toLocaleString()]);
                    handleExport(fmt as any, 'Secretary_Archives', headers, rows);
                  }}
                  className="bg-white hover:bg-slate-100 border border-slate-200 px-2 py-1 rounded text-[10px] font-extrabold text-slate-700 flex items-center space-x-1 cursor-pointer"
                >
                  <Download className="w-3 h-3 text-slate-400" />
                  <span>{fmt}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="text-[10px] uppercase font-bold text-slate-400">
                <tr>
                  <th className="pb-2">Archived Title</th>
                  <th className="pb-2">Document Type</th>
                  <th className="pb-2">Uploaded By</th>
                  <th className="pb-2 text-right">Archived Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {groupDocs.map((doc) => (
                  <tr key={doc.id}>
                    <td className="py-2 font-bold text-slate-800">{doc.title}</td>
                    <td className="py-2">
                      <span className="bg-slate-100 px-2 py-0.5 rounded text-[10px] text-slate-600 font-bold">{doc.type}</span>
                    </td>
                    <td className="py-2 font-semibold">{doc.uploadedBy}</td>
                    <td className="py-2 text-right text-slate-500">{new Date(doc.uploadedAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
};
