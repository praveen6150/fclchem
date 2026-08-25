import React, { useState } from 'react';
import { UserAccount, OracleReportItem, OracleModuleId, ReportColumn } from '../types';
import { ORACLE_REPORT_MODULES, ALL_ORACLE_REPORTS } from '../data/oracleReportsData';
import { FalconLogo } from './FalconLogo';
import { 
  Lock, 
  CheckCircle2, 
  ExternalLink, 
  ShieldAlert, 
  ShieldCheck, 
  Search, 
  Printer, 
  Download, 
  Filter, 
  ArrowLeft, 
  Building2, 
  Database, 
  FileSpreadsheet, 
  Key, 
  Sliders, 
  LogOut, 
  RefreshCw, 
  Info
} from 'lucide-react';
import { audioEngine } from '../services/audioEngine';

interface OracleReportsPortalProps {
  currentUser: UserAccount;
  currentSimulatedIp: string;
  onLogout: () => void;
  onOpenAdminPanel?: () => void;
  onReturnToPresentation: () => void;
  onToggleSimulatedIp: () => void;
}

export const OracleReportsPortal: React.FC<OracleReportsPortalProps> = ({
  currentUser,
  currentSimulatedIp,
  onLogout,
  onOpenAdminPanel,
  onReturnToPresentation,
  onToggleSimulatedIp
}) => {
  const [selectedReport, setSelectedReport] = useState<OracleReportItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deniedReportAttempt, setDeniedReportAttempt] = useState<OracleReportItem | null>(null);
  const [iframeKey, setIframeKey] = useState<number>(0);

  // Check if current user has RBAC access to a specific report
  const hasAccess = (reportId: string) => {
    if (currentUser.role === 'admin') return true;
    return currentUser.allowedReportIds?.includes(reportId) || false;
  };

  const handleReportClick = (report: OracleReportItem) => {
    if (!hasAccess(report.id)) {
      audioEngine.playError();
      setDeniedReportAttempt(report);
      return;
    }

    audioEngine.playClick();
    if (report.status === 'LIVE') {
      setSelectedReport(report);
      setIframeKey(prev => prev + 1);
    } else {
      audioEngine.playNotification();
      alert(`[Oracle Reports 192.168.100.202:8080]\n\n"${report.title}" is currently staged for deployment (SOON).\nLive RDF mapping: ${report.oracleCode}`);
    }
  };

  const permittedCount = ALL_ORACLE_REPORTS.filter(r => hasAccess(r.id)).length;
  const livePermittedReports = ALL_ORACLE_REPORTS.filter(r => r.status === 'LIVE' && hasAccess(r.id));
  const isOfficeIp = currentSimulatedIp.startsWith('192.168.100.');

  return (
    <div className="min-h-screen bg-[#f0f4f9] text-[#1e293b] font-sans flex flex-col selection:bg-sky-200">
      
      {/* 1. TOP BROWSER / ORACLE HEADER BAR (ALWAYS PERSISTENT) */}
      <header className="bg-[#002b49] text-white px-4 sm:px-8 py-3.5 shadow-md flex flex-wrap items-center justify-between gap-3 border-b border-[#001f35] sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <FalconLogo size="sm" />
          <div>
            <h1 className="text-sm sm:text-base font-bold tracking-tight text-white flex items-center gap-2">
              Falcon Chemicals (L.L.C.) — Enterprise Portal for Oracle Reports
              <span className="hidden sm:inline-block text-[11px] font-mono px-2 py-0.5 rounded bg-sky-950/80 text-sky-300 border border-sky-600/40">
                192.168.100.202:8080
              </span>
            </h1>
            <p className="text-[11px] text-sky-200/80 font-normal">
              Corporate Reporting Engine • Menu ID: <code className="font-mono text-white">menu.html</code> • Subnet Gateway Validated
            </p>
          </div>
        </div>

        {/* User Session & Quick Navigation */}
        <div className="flex items-center flex-wrap gap-2.5 text-xs">
          {/* IP status badge */}
          <button
            onClick={onToggleSimulatedIp}
            title="Click to simulate switching IP address"
            className={`px-2.5 py-1 rounded-lg font-mono text-[11px] flex items-center gap-1.5 border transition-all ${
              isOfficeIp 
                ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300' 
                : 'bg-rose-950/80 border-rose-500/50 text-rose-300'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isOfficeIp ? 'bg-emerald-400' : 'bg-rose-400'}`}></span>
            Host: {currentSimulatedIp}
          </button>

          {/* User Info Badge */}
          <div className="px-3 py-1 bg-white/10 rounded-lg border border-white/15 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="font-semibold text-white">{currentUser.fullName}</span>
            <span className="text-[10px] uppercase font-bold text-sky-300 px-1.5 py-0.5 rounded bg-sky-900/60">
              {currentUser.role}
            </span>
          </div>

          {/* Admin panel button if admin */}
          {currentUser.role === 'admin' && onOpenAdminPanel && (
            <button
              onClick={() => {
                audioEngine.playClick();
                onOpenAdminPanel();
              }}
              className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-semibold flex items-center gap-1.5 shadow transition-all text-xs"
            >
              <Sliders className="w-3.5 h-3.5" />
              Admin RBAC Control
            </button>
          )}

          {/* Operations Hub / Return button */}
          <button
            onClick={() => {
              audioEngine.playClick();
              if (selectedReport) {
                setSelectedReport(null);
              } else {
                onReturnToPresentation();
              }
            }}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-medium flex items-center gap-1.5 border border-slate-700 transition-all text-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {selectedReport ? 'Reports Menu' : 'Operations Hub'}
          </button>

          {/* Sign out */}
          <button
            onClick={() => {
              audioEngine.playClick();
              onLogout();
            }}
            className="p-1.5 bg-slate-800 hover:bg-rose-900/80 text-slate-300 hover:text-rose-200 rounded-lg border border-slate-700 transition-all"
            title="Sign Out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* VIEW A: ACTIVE LIVE REPORT VIEWER (OPENED IN SAME WINDOW) */}
      {selectedReport ? (
        <div className="flex-1 flex flex-col bg-slate-100">
          {/* Sub-bar for active report */}
          <div className="bg-[#e2eaf2] border-b border-[#cbd5e1] px-4 sm:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={() => {
                  audioEngine.playClick();
                  setSelectedReport(null);
                }}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-semibold text-xs shadow-sm transition-all"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-sky-600" />
                Back to Available Modules
              </button>

              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-sm">{selectedReport.title}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold uppercase">
                  {selectedReport.status}
                </span>
                <span className="hidden md:inline-block text-[11px] font-mono text-slate-500 bg-slate-200/80 px-2 py-0.5 rounded">
                  {selectedReport.oracleCode}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Quick report switcher */}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">Switch Report:</span>
                <select
                  value={selectedReport.id}
                  onChange={(e) => {
                    const found = ALL_ORACLE_REPORTS.find(r => r.id === e.target.value);
                    if (found) {
                      handleReportClick(found);
                    }
                  }}
                  className="bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-sky-500 shadow-sm"
                >
                  {livePermittedReports.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Refresh button */}
              <button
                onClick={() => {
                  audioEngine.playClick();
                  setIframeKey(prev => prev + 1);
                }}
                title="Reload Live Report Data"
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-700 rounded-lg border border-slate-300 text-xs font-semibold shadow-sm transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5 text-slate-600" />
                Reload
              </button>

              {/* Open in external tab if desired */}
              <a
                href={`http://192.168.100.202:8080${selectedReport.endpointUrl}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-all"
                title="Open directly in standalone browser tab"
              >
                <ExternalLink className="w-3 h-3" />
                Open External
              </a>
            </div>
          </div>

          {/* Embedded Report Frame taking full remaining viewport height */}
          <div className="flex-1 w-full bg-white relative flex flex-col min-h-[calc(100vh-115px)]">
            <iframe
              key={iframeKey}
              src={`http://192.168.100.202:8080${selectedReport.endpointUrl}`}
              title={selectedReport.title}
              className="w-full flex-1 border-0 min-h-[calc(100vh-115px)]"
            />
          </div>
        </div>
      ) : (
        /* VIEW B: AVAILABLE MODULES GRID (MATCHING IMAGE.PNG EXACTLY) */
        <>
          {/* 2. SUB-BANNER / RBAC STATUS BAR */}
          <div className="bg-[#e2eaf2] border-b border-[#cbd5e1] px-4 sm:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold text-slate-700">RBAC Enforcement Active:</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-300 text-[11px]">
                  {permittedCount} of {ALL_ORACLE_REPORTS.length} Reports Authorized
                </span>
              </div>
              <span className="hidden md:inline text-slate-400">•</span>
              <div className="hidden md:flex items-center gap-1.5 text-slate-600">
                <span>Corporate Gateway:</span>
                <strong className="font-mono text-slate-800">192.168.100.202</strong>
              </div>
            </div>

            {/* Search / Filter */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filter Oracle reports..."
                className="w-full bg-white border border-slate-300 rounded-lg pl-8 pr-3 py-1 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 shadow-sm"
              />
            </div>
          </div>

          {/* 3. MAIN AVAILABLE MODULES VIEW */}
          <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 space-y-6">
            
            <div className="flex items-center justify-between pb-2 border-b border-slate-300">
              <h2 className="text-xs sm:text-sm font-extrabold tracking-widest text-[#475569] uppercase">
                Available Modules
              </h2>
              <span className="text-[11px] text-slate-500">
                Click on any authorized LIVE report to view real-time Oracle database records
              </span>
            </div>

            {/* MODULES GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
              {ORACLE_REPORT_MODULES.map((module) => {
                const filteredReports = module.reports.filter(r => 
                  r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  r.oracleCode?.toLowerCase().includes(searchTerm.toLowerCase())
                );

                if (filteredReports.length === 0 && searchTerm) return null;

                return (
                  <div 
                    key={module.id} 
                    className="bg-white rounded-xl shadow-sm border border-[#dbe4ee] overflow-hidden transition-all hover:shadow-md"
                  >
                    {/* Module Header with Blue Left Accent Pill */}
                    <div className="p-3.5 px-4 bg-gradient-to-r from-[#f8fafc] to-white border-b border-[#e2e8f0] flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="w-1.5 h-4 bg-[#0284c7] rounded-full"></span>
                        <h3 className="font-bold text-sm text-[#0f172a]">{module.name}</h3>
                      </div>
                      <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                        {module.reports.filter(r => hasAccess(r.id)).length}/{module.reports.length} Approved
                      </span>
                    </div>

                    {/* Module Reports List */}
                    <div className="divide-y divide-[#f1f5f9]">
                      {filteredReports.map((report) => {
                        const isAllowed = hasAccess(report.id);
                        const isLive = report.status === 'LIVE';

                        return (
                          <button
                            key={report.id}
                            onClick={() => handleReportClick(report)}
                            className={`w-full text-left p-3 px-4 flex items-center justify-between gap-3 transition-colors ${
                              isAllowed 
                                ? 'hover:bg-[#f8fafc] cursor-pointer group' 
                                : 'bg-slate-50/70 hover:bg-rose-50/50 cursor-not-allowed opacity-80'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              {!isAllowed ? (
                                <Lock className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                              ) : (
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-[#0284c7] shrink-0 transition-colors"></span>
                              )}
                              <span className={`text-xs truncate ${
                                isAllowed 
                                ? 'font-medium text-[#1e293b] group-hover:text-[#0284c7]' 
                                : 'text-slate-500 line-through/50 font-normal'
                              }`}>
                                {report.title}
                              </span>
                            </div>

                            {/* Status / RBAC Badge */}
                            <div className="shrink-0 flex items-center gap-1.5">
                              {isAllowed ? (
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                                  isLive 
                                    ? 'bg-[#dcfce7] text-[#15803d] border border-[#bbf7d0]' 
                                    : 'bg-[#f1f5f9] text-[#64748b] border border-[#e2e8f0]'
                                }`}>
                                  {report.status}
                                </span>
                              ) : (
                                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-200">
                                  LOCKED
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

          </main>
        </>
      )}

      {/* 4. ACCESS DENIED / RBAC VIOLATION MODAL */}
      {deniedReportAttempt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white border border-rose-200 rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 border border-rose-300 text-rose-600 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-6 h-6" />
            </div>
            
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">Access Restricted by RBAC Policy</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                You do not currently possess approved role-based permissions to view:
              </p>
              <div className="p-2.5 bg-slate-100 rounded-xl font-semibold text-xs text-slate-800 border border-slate-200 mt-2">
                {deniedReportAttempt.title} ({deniedReportAttempt.oracleCode})
              </div>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-left text-xs text-amber-900 space-y-1">
              <p className="font-semibold flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-amber-700" />
                How to request access:
              </p>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                Contact Chief Administrator <strong>Praveen</strong> (<code>praveen@falconchemicals.com</code>) to grant Oracle report privileges in the Admin Access Control Panel.
              </p>
            </div>

            <div className="pt-2 flex justify-center">
              <button
                onClick={() => setDeniedReportAttempt(null)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow transition-all"
              >
                Acknowledge & Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
