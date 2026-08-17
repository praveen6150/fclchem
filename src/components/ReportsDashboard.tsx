import React, { useState, useMemo } from 'react';
import { UserAccount, ReportDefinition, ReportCategory } from '../types';
import { FALCON_REPORTS } from '../data/reportsData';
import { FalconLogo } from './FalconLogo';
import { 
  FileText, 
  BarChart3, 
  Search, 
  Download, 
  Printer, 
  Filter, 
  ShieldCheck, 
  LogOut, 
  Sliders, 
  Building2, 
  Globe2, 
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  ChevronRight,
  TrendingUp,
  Layers,
  FlaskConical,
  Coins,
  FileCheck,
  RefreshCw
} from 'lucide-react';
import { audioEngine } from '../services/audioEngine';

interface ReportsDashboardProps {
  currentUser: UserAccount;
  currentSimulatedIp: string;
  onOpenAdminPanel?: () => void;
  onLogout: () => void;
  onOpenEmailInbox: () => void;
  onOpenOraclePortal?: () => void;
}

export const ReportsDashboard: React.FC<ReportsDashboardProps> = ({
  currentUser,
  currentSimulatedIp,
  onOpenAdminPanel,
  onLogout,
  onOpenEmailInbox,
  onOpenOraclePortal
}) => {
  // Filter reports that this user is explicitly permitted to view
  const permittedReports = useMemo(() => {
    return FALCON_REPORTS.filter(rep => currentUser.allowedReportIds.includes(rep.id));
  }, [currentUser.allowedReportIds]);

  const [selectedReportId, setSelectedReportId] = useState<string>(
    permittedReports[0]?.id || ''
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState('all');

  const activeReport = useMemo(() => {
    return permittedReports.find(r => r.id === selectedReportId) || permittedReports[0];
  }, [permittedReports, selectedReportId]);

  // Filtered rows for active report
  const filteredData = useMemo(() => {
    if (!activeReport) return [];
    return activeReport.sampleData.filter(row => {
      if (!searchQuery) return true;
      return Object.values(row).some(val => 
        String(val).toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [activeReport, searchQuery]);

  // Export to CSV helper
  const handleExportCSV = () => {
    if (!activeReport) return;
    audioEngine.playSuccess();
    
    const headers = activeReport.columns.map(c => `"${c.label}"`).join(',');
    const rows = filteredData.map(row => 
      activeReport.columns.map(col => `"${row[col.key] || ''}"`).join(',')
    ).join('\n');

    const csvContent = `data:text/csv;charset=utf-8,${encodeURIComponent(`${headers}\n${rows}`)}`;
    const link = document.createElement('a');
    link.setAttribute('href', csvContent);
    link.setAttribute('download', `${activeReport.code}_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isOfficeSubnet = currentSimulatedIp.startsWith('192.168.100.');

  const getCategoryIcon = (cat: ReportCategory) => {
    switch (cat) {
      case 'sales': return <TrendingUp className="w-4 h-4 text-emerald-400" />;
      case 'inventory': return <Layers className="w-4 h-4 text-cyan-400" />;
      case 'production': return <FlaskConical className="w-4 h-4 text-amber-400" />;
      case 'finance': return <Coins className="w-4 h-4 text-sky-400" />;
      case 'kyc_compliance': return <FileCheck className="w-4 h-4 text-purple-400" />;
    }
  };

  const getBadgeStyle = (statusVal: string) => {
    const val = String(statusVal).toLowerCase();
    if (val.includes('approved') || val.includes('verified') || val.includes('pass') || val.includes('delivered') || val.includes('optimal') || val.includes('fta')) {
      return 'bg-emerald-950/80 text-emerald-300 border-emerald-500/30';
    }
    if (val.includes('dispatched') || val.includes('customs') || val.includes('reconciled')) {
      return 'bg-cyan-950/80 text-cyan-300 border-cyan-500/30';
    }
    if (val.includes('renewal') || val.includes('alert') || val.includes('low') || val.includes('follow-up') || val.includes('under')) {
      return 'bg-amber-950/80 text-amber-300 border-amber-500/30';
    }
    if (val.includes('legal') || val.includes('hazard') || val.includes('class 3') || val.includes('denied')) {
      return 'bg-rose-950/80 text-rose-300 border-rose-500/30';
    }
    return 'bg-slate-800 text-slate-300 border-slate-700';
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Top Header Bar */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-30 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        
        {/* Left: Branding & User Role */}
        <div className="flex items-center gap-3">
          <FalconLogo size="md" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-white tracking-wide">
                Falcon Chemicals Enterprise Portal
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-cyan-950 text-cyan-300 border border-cyan-500/30 rounded">
                Reports v2.6
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Logged in as <strong className="text-slate-200">{currentUser.fullName}</strong> ({currentUser.department})
            </p>
          </div>
        </div>

        {/* Right: IP Status Badge & Actions */}
        <div className="flex items-center gap-3">
          
          {/* Host IP Badge */}
          <div className={`px-3 py-1 rounded-lg border flex items-center gap-2 text-xs font-mono ${
            isOfficeSubnet
              ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
              : 'bg-amber-950/40 border-amber-500/30 text-amber-300'
          }`}>
            {isOfficeSubnet ? <Building2 className="w-3.5 h-3.5 text-emerald-400" /> : <Globe2 className="w-3.5 h-3.5 text-amber-400" />}
            <span>IP: {currentSimulatedIp}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-900/80 font-sans font-semibold">
              {isOfficeSubnet ? 'Office Subnet' : 'WAN'}
            </span>
          </div>

          {/* Oracle Reports Menu (192.168.100.202:8080) for all users */}
          {onOpenOraclePortal && (
            <button
              onClick={() => {
                audioEngine.playClick();
                onOpenOraclePortal();
              }}
              className="px-3 py-1.5 bg-[#002b49] hover:bg-[#003b66] border border-sky-400/40 text-sky-200 hover:text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow transition-all"
            >
              <Globe2 className="w-3.5 h-3.5 text-sky-400" />
              <span>Oracle Reports (192.168.100.202:8080)</span>
            </button>
          )}

          {/* Admin Control Switch (Only for Admins) */}
          {currentUser.role === 'admin' && onOpenAdminPanel && (
            <button
              onClick={() => {
                audioEngine.playClick();
                onOpenAdminPanel();
              }}
              className="px-3 py-1.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white text-xs font-semibold rounded-lg shadow transition-all flex items-center gap-1.5"
            >
              <Sliders className="w-3.5 h-3.5" />
              Admin Access Control
            </button>
          )}

          {/* Logout Button */}
          <button
            onClick={() => {
              audioEngine.playClick();
              onLogout();
            }}
            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-medium"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Body */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* Left Navigation Sidebar: Available Permitted Reports */}
        <aside className="w-full md:w-72 bg-slate-900/70 border-r border-slate-800 flex flex-col shrink-0">
          <div className="p-3.5 border-b border-slate-800 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Permitted Reports ({permittedReports.length})
            </span>
            <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/20">
              RBAC Filtered
            </span>
          </div>

          <div className="p-2 overflow-y-auto space-y-1 flex-1">
            {permittedReports.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-500">
                <AlertCircle className="w-6 h-6 mx-auto mb-1 text-amber-500" />
                No reports currently assigned to this account. Contact Chief Admin.
              </div>
            ) : (
              permittedReports.map((rep) => {
                const isSelected = rep.id === selectedReportId;
                return (
                  <button
                    key={rep.id}
                    onClick={() => {
                      audioEngine.playClick();
                      setSelectedReportId(rep.id);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-start gap-2.5 ${
                      isSelected
                        ? 'bg-cyan-950/60 border border-cyan-500/40 text-white shadow-sm'
                        : 'text-slate-300 hover:bg-slate-800/60 hover:text-white border border-transparent'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {getCategoryIcon(rep.category)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="font-semibold truncate">{rep.title}</span>
                        <span className="text-[10px] font-mono text-slate-500 shrink-0">
                          {rep.code}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1">
                        {rep.category.toUpperCase()} • {rep.sampleData.length} records
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* User Privilege Card */}
          <div className="p-3 bg-slate-950 border-t border-slate-800 text-xs text-slate-400 space-y-1">
            <div className="flex items-center justify-between">
              <span>Security Level:</span>
              <span className="font-semibold text-cyan-300 uppercase">{currentUser.role}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>IP Policy:</span>
              <span className="text-slate-300 font-mono text-[11px]">
                {currentUser.ipPolicy === 'office_only' ? 'Office Subnet Only' : 'Internet Allowed'}
              </span>
            </div>
          </div>
        </aside>

        {/* Center/Right: Report Content Area */}
        <main className="flex-1 flex flex-col overflow-y-auto p-4 sm:p-6 space-y-5">
          
          {activeReport ? (
            <>
              {/* Report Title & Metadata Header */}
              <div className="flex flex-wrap items-start justify-between gap-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 text-xs font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/30 rounded">
                      {activeReport.code}
                    </span>
                    <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                      {activeReport.category.replace('_', ' ')}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-white tracking-tight">
                    {activeReport.title}
                  </h2>
                  <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
                    {activeReport.description}
                  </p>
                </div>

                {/* Export & Action Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportCSV}
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl border border-slate-700 hover:border-slate-600 transition-all flex items-center gap-2 shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5 text-cyan-400" />
                    Export CSV
                  </button>
                  <button
                    onClick={() => {
                      audioEngine.playClick();
                      window.print();
                    }}
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl border border-slate-700 transition-all flex items-center gap-2 shadow-sm"
                  >
                    <Printer className="w-3.5 h-3.5 text-slate-300" />
                    Print Sheet
                  </button>
                </div>
              </div>

              {/* KPI Summary Cards */}
              {activeReport.summaryStats && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  {activeReport.summaryStats.map((stat, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-sm"
                    >
                      <span className="text-xs font-semibold text-slate-400">{stat.label}</span>
                      <p className="text-xl font-bold text-white mt-1 font-mono tracking-tight">
                        {stat.value}
                      </p>
                      {stat.sublabel && (
                        <p className="text-[11px] text-cyan-400 mt-0.5">{stat.sublabel}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Search & Filter Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                <div className="relative flex-1 min-w-[240px]">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={`Search within ${activeReport.title}...`}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                  <span>Showing {filteredData.length} of {activeReport.sampleData.length} records</span>
                </div>
              </div>

              {/* Interactive Data Table */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-300 font-semibold">
                        {activeReport.columns.map((col) => (
                          <th
                            key={col.key}
                            className={`p-3.5 px-4 font-semibold text-slate-300 ${
                              col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                            }`}
                          >
                            {col.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {filteredData.length === 0 ? (
                        <tr>
                          <td colSpan={activeReport.columns.length} className="p-8 text-center text-slate-500">
                            No records match your query "{searchQuery}".
                          </td>
                        </tr>
                      ) : (
                        filteredData.map((row, rowIdx) => (
                          <tr
                            key={rowIdx}
                            className="hover:bg-slate-800/40 transition-colors"
                          >
                            {activeReport.columns.map((col) => {
                              const cellValue = row[col.key];

                              return (
                                <td
                                  key={col.key}
                                  className={`p-3.5 px-4 text-slate-200 ${
                                    col.align === 'right' ? 'text-right font-mono' : col.align === 'center' ? 'text-center' : 'text-left'
                                  }`}
                                >
                                  {col.type === 'badge' ? (
                                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getBadgeStyle(cellValue)}`}>
                                      {cellValue}
                                    </span>
                                  ) : col.type === 'currency' ? (
                                    <span className="font-mono font-medium text-emerald-400">
                                      {cellValue}
                                    </span>
                                  ) : (
                                    <span>{cellValue}</span>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Table Footer */}
                <div className="p-3 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Report verification verified against Falcon Chemicals SAP/ERP database</span>
                  </div>
                  <span className="font-mono text-[11px] text-slate-500">
                    Doc Ref: {activeReport.code}-2026
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-slate-400">
              <AlertCircle className="w-10 h-10 mx-auto mb-2 text-amber-400" />
              <h3 className="text-base font-bold text-white">No Permitted Reports Found</h3>
              <p className="text-xs text-slate-400 mt-1">
                Your user role does not currently have permissions assigned for these categories.
              </p>
            </div>
          )}

        </main>
      </div>

    </div>
  );
};
