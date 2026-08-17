import React, { useState } from 'react';
import { UserAccount, AuditLogEntry, VirtualEmail, IPAccessPolicy, AuthMethod, RoleType } from '../types';
import { FALCON_REPORTS } from '../data/reportsData';
import { ORACLE_REPORT_MODULES, ALL_ORACLE_REPORTS, DEFAULT_ALL_ORACLE_REPORT_IDS } from '../data/oracleReportsData';
import { 
  Users, 
  ShieldCheck, 
  ShieldAlert, 
  KeyRound, 
  Network, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckSquare, 
  Square, 
  CheckCircle2, 
  XCircle, 
  ArrowLeft, 
  Search, 
  Mail, 
  Lock, 
  Building2, 
  Globe2, 
  RefreshCw, 
  FileText, 
  Sliders,
  Check,
  ExternalLink,
  Database
} from 'lucide-react';
import { audioEngine } from '../services/audioEngine';

interface AdminAccessControlPanelProps {
  users: UserAccount[];
  auditLogs: AuditLogEntry[];
  currentSimulatedIp: string;
  onUpdateUsers: (users: UserAccount[]) => void;
  onAddAuditLog: (log: AuditLogEntry) => void;
  onSendVirtualEmail: (email: VirtualEmail) => void;
  onReturnToReports: () => void;
  onOpenEmailInbox: () => void;
  onOpenOraclePortal?: () => void;
}

export const AdminAccessControlPanel: React.FC<AdminAccessControlPanelProps> = ({
  users,
  auditLogs,
  currentSimulatedIp,
  onUpdateUsers,
  onAddAuditLog,
  onSendVirtualEmail,
  onReturnToReports,
  onOpenEmailInbox,
  onOpenOraclePortal
}) => {
  const [activeTab, setActiveTab] = useState<'users' | 'audit_logs' | 'network_policies'>('users');
  const [searchUserQuery, setSearchUserQuery] = useState('');
  
  // User Modal State (Create / Edit)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  // Form State
  const [formFullName, setFormFullName] = useState('');
  const [formUsername, setFormUsername] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formRole, setFormRole] = useState<RoleType>('analyst');
  const [formDepartment, setFormDepartment] = useState('Commercial Sales');
  const [formBranch, setFormBranch] = useState('Falcon Chemicals LLC - Dubai');
  const [formAuthMethod, setFormAuthMethod] = useState<AuthMethod>('password');
  const [formIpPolicy, setFormIpPolicy] = useState<IPAccessPolicy>('office_only');
  const [formCustomSubnet, setFormCustomSubnet] = useState('192.168.100.0/24');
  const [formAllowedReports, setFormAllowedReports] = useState<string[]>([]);
  const [formIsActive, setFormIsActive] = useState(true);

  // Open Edit Modal for existing user
  const handleOpenEditUser = (user: UserAccount) => {
    audioEngine.playClick();
    setEditingUserId(user.id);
    setFormFullName(user.fullName);
    setFormUsername(user.username);
    setFormEmail(user.email);
    setFormPassword(user.password || '');
    setFormRole(user.role);
    setFormDepartment(user.department);
    setFormBranch(user.companyOrBranch);
    setFormAuthMethod(user.authMethod);
    setFormIpPolicy(user.ipPolicy);
    setFormCustomSubnet(user.customAllowedSubnet || '192.168.100.0/24');
    setFormAllowedReports([...user.allowedReportIds]);
    setFormIsActive(user.isActive);
    setIsEditModalOpen(true);
  };

  // Open Create User Modal
  const handleOpenCreateUser = () => {
    audioEngine.playClick();
    setEditingUserId(null);
    setFormFullName('');
    setFormUsername('');
    setFormEmail('');
    setFormPassword('Falcon@2026');
    setFormRole('manager');
    setFormDepartment('Commercial Sales & Dispatch');
    setFormBranch('Falcon Chemicals LLC - Dubai');
    setFormAuthMethod('password');
    setFormIpPolicy('office_only');
    setFormCustomSubnet('192.168.100.0/24');
    // Default to sales & dispatch oracle reports
    setFormAllowedReports([
      'ora_sales_div_drilldown',
      'ora_sales_avg_analysis',
      'ora_sales_cust_supp_master',
      'ora_sales_salesman_rep',
      'ora_dispatch_daily_report',
      'rep_sales_daily',
      'rep_sales_customer'
    ]);
    setFormIsActive(true);
    setIsEditModalOpen(true);
  };

  // Toggle individual report permission checkbox
  const handleToggleReport = (reportId: string) => {
    audioEngine.playClick();
    if (formAllowedReports.includes(reportId)) {
      setFormAllowedReports(formAllowedReports.filter(id => id !== reportId));
    } else {
      setFormAllowedReports([...formAllowedReports, reportId]);
    }
  };

  // Select all reports in an Oracle module
  const handleToggleModuleReports = (moduleReports: { id: string }[]) => {
    audioEngine.playClick();
    const ids = moduleReports.map(r => r.id);
    const allSelected = ids.every(id => formAllowedReports.includes(id));
    if (allSelected) {
      setFormAllowedReports(formAllowedReports.filter(id => !ids.includes(id)));
    } else {
      const merged = Array.from(new Set([...formAllowedReports, ...ids]));
      setFormAllowedReports(merged);
    }
  };

  // Save User (Create or Update)
  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    audioEngine.playSuccess();

    if (editingUserId) {
      // Update existing user
      const updated = users.map(u => {
        if (u.id === editingUserId) {
          return {
            ...u,
            fullName: formFullName.trim(),
            username: formUsername.trim().toLowerCase(),
            email: formEmail.trim().toLowerCase(),
            password: formPassword,
            role: formRole,
            department: formDepartment.trim(),
            companyOrBranch: formBranch.trim(),
            authMethod: formAuthMethod,
            ipPolicy: formIpPolicy,
            customAllowedSubnet: formCustomSubnet.trim(),
            allowedReportIds: formAllowedReports,
            isActive: formIsActive
          };
        }
        return u;
      });
      onUpdateUsers(updated);

      onAddAuditLog({
        id: `log_${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        username: 'praveen',
        email: 'praveen@falconchemicals.com',
        action: 'POLICY_UPDATED',
        ipAddress: currentSimulatedIp,
        ipLocationType: currentSimulatedIp.startsWith('192.168.100.') ? 'Office LAN (192.168.100.0/24)' : 'External Internet / Home WAN',
        details: `Updated permissions and IP policy (${formIpPolicy}) for user "${formUsername}" with ${formAllowedReports.length} reports.`,
        status: 'SUCCESS'
      });
    } else {
      // Create new user
      const newUser: UserAccount = {
        id: `usr_${Date.now()}`,
        fullName: formFullName.trim(),
        username: formUsername.trim().toLowerCase(),
        email: formEmail.trim().toLowerCase(),
        password: formPassword,
        role: formRole,
        department: formDepartment.trim(),
        companyOrBranch: formBranch.trim(),
        authMethod: formAuthMethod,
        ipPolicy: formIpPolicy,
        customAllowedSubnet: formCustomSubnet.trim(),
        allowedReportIds: formAllowedReports,
        isActive: formIsActive,
        createdDate: new Date().toISOString().slice(0, 10)
      };
      onUpdateUsers([...users, newUser]);

      // Send Welcome / Credentials email from noreply@falconchemicals.com
      const welcomeEmail: VirtualEmail = {
        id: `eml_${Date.now()}`,
        from: 'noreply@falconchemicals.com',
        to: formEmail.trim().toLowerCase(),
        subject: 'Welcome to Falcon Chemicals Portal - Account Provisioned',
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        bodyText: `Dear ${formFullName},\n\nYour Falcon Chemicals Enterprise Portal account has been created by Chief Administrator Praveen.\n\nUsername: ${formUsername}\nPassword: ${formPassword}\nAssigned Reports: ${formAllowedReports.length} Oracle & Operations modules\nNetwork Access Policy: ${formIpPolicy === 'office_only' ? 'Office Subnet Only (192.168.100.0/24)' : 'Internet & Home WAN Allowed'}\n\nPlease authenticate at: 192.168.100.202:8080\n\nCorporate IT Security - Falcon Chemicals LLC`,
        type: 'account_created',
        isRead: false
      };
      onSendVirtualEmail(welcomeEmail);

      onAddAuditLog({
        id: `log_${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        username: 'praveen',
        email: 'praveen@falconchemicals.com',
        action: 'USER_CREATED',
        ipAddress: currentSimulatedIp,
        ipLocationType: currentSimulatedIp.startsWith('192.168.100.') ? 'Office LAN (192.168.100.0/24)' : 'External Internet / Home WAN',
        details: `Created new end user "${formUsername}" with role "${formRole}" and dispatched credentials from noreply@falconchemicals.com`,
        status: 'SUCCESS'
      });
    }

    setIsEditModalOpen(false);
  };

  // Delete User
  const handleDeleteUser = (userId: string, username: string) => {
    if (username === 'praveen' || username === 'admin') {
      audioEngine.playError();
      alert('Chief Administrator account cannot be deleted.');
      return;
    }
    if (confirm(`Are you sure you want to delete end user "${username}"?`)) {
      audioEngine.playClick();
      const updated = users.filter(u => u.id !== userId);
      onUpdateUsers(updated);
      onAddAuditLog({
        id: `log_${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        username: 'praveen',
        email: 'praveen@falconchemicals.com',
        action: 'POLICY_UPDATED',
        ipAddress: currentSimulatedIp,
        ipLocationType: currentSimulatedIp.startsWith('192.168.100.') ? 'Office LAN (192.168.100.0/24)' : 'External Internet / Home WAN',
        details: `Deleted user account "${username}" and revoked all reporting permissions.`,
        status: 'WARNING'
      });
    }
  };

  // Filtered users for table search
  const filteredUsers = users.filter(u => 
    u.fullName.toLowerCase().includes(searchUserQuery.toLowerCase()) ||
    u.username.toLowerCase().includes(searchUserQuery.toLowerCase()) ||
    u.department.toLowerCase().includes(searchUserQuery.toLowerCase()) ||
    u.role.toLowerCase().includes(searchUserQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchUserQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Top Header */}
      <header className="bg-slate-900 border-b border-cyan-500/20 px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              audioEngine.playClick();
              onReturnToReports();
            }}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all flex items-center gap-2 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Operations Hub</span>
          </button>

          <div className="h-5 w-px bg-slate-800"></div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-bold text-white tracking-wide">
                Admin Access Control & RBAC Policy Engine
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded">
                Admin: Praveen
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Granular Oracle Report Permissions • IP Subnet Authorization (192.168.100.0/24)
            </p>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2.5">
          {onOpenOraclePortal && (
            <button
              onClick={() => {
                audioEngine.playClick();
                onOpenOraclePortal();
              }}
              className="px-3 py-1.5 bg-[#002b49] hover:bg-[#003b66] border border-sky-400/40 text-sky-200 hover:text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-all"
            >
              <Database className="w-3.5 h-3.5 text-sky-400" />
              <span>Oracle Portal (192.168.100.202:8080)</span>
            </button>
          )}

          <button
            onClick={() => {
              audioEngine.playNotification();
              onOpenEmailInbox();
            }}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-all"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>noreply Inbox</span>
          </button>

          <button
            onClick={handleOpenCreateUser}
            className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-cyan-900/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create End User</span>
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-slate-900/80 border-b border-slate-800 px-4 sm:px-6 flex gap-2">
        <button
          onClick={() => {
            audioEngine.playClick();
            setActiveTab('users');
          }}
          className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'users'
              ? 'border-cyan-400 text-cyan-400 bg-cyan-950/20'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          End Users & RBAC Matrix ({users.length})
        </button>

        <button
          onClick={() => {
            audioEngine.playClick();
            setActiveTab('audit_logs');
          }}
          className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'audit_logs'
              ? 'border-cyan-400 text-cyan-400 bg-cyan-950/20'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          Real-Time Audit Logs ({auditLogs.length})
        </button>

        <button
          onClick={() => {
            audioEngine.playClick();
            setActiveTab('network_policies');
          }}
          className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'network_policies'
              ? 'border-cyan-400 text-cyan-400 bg-cyan-950/20'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Network className="w-4 h-4" />
          IP Subnet & Firewall Boundary
        </button>
      </div>

      {/* Content */}
      <main className="flex-1 p-4 sm:p-6 overflow-y-auto max-w-7xl w-full mx-auto space-y-6">
        
        {/* TAB 1: USER MANAGEMENT */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            
            {/* Search Bar & Stats */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
              <div className="relative flex-1 min-w-[260px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchUserQuery}
                  onChange={(e) => setSearchUserQuery(e.target.value)}
                  placeholder="Search by user, department, role, or email..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-400"
                />
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span>Active Users: <strong className="text-white">{users.filter(u => u.isActive).length}</strong></span>
                <span>•</span>
                <span>Office Restricted: <strong className="text-cyan-400">{users.filter(u => u.ipPolicy === 'office_only').length}</strong></span>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-300 font-semibold">
                      <th className="p-3.5 px-4">User Details</th>
                      <th className="p-3.5 px-4">Role & Dept</th>
                      <th className="p-3.5 px-4">Auth Method</th>
                      <th className="p-3.5 px-4">IP Access Policy</th>
                      <th className="p-3.5 px-4 text-center">Permitted Reports</th>
                      <th className="p-3.5 px-4">Last Login</th>
                      <th className="p-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredUsers.map((user) => {
                      const isOfficeOnly = user.ipPolicy === 'office_only';

                      return (
                        <tr key={user.id} className="hover:bg-slate-800/40 transition-colors">
                          
                          {/* User Details */}
                          <td className="p-3.5 px-4">
                            <div className="font-semibold text-white flex items-center gap-2">
                              {user.fullName}
                              {(user.username === 'praveen' || user.username === 'admin') && (
                                <span className="px-1.5 py-0.2 bg-amber-500/20 text-amber-300 text-[10px] font-bold rounded">
                                  CHIEF ADMIN
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] font-mono text-cyan-400">@{user.username}</div>
                            <div className="text-[11px] text-slate-400">{user.email}</div>
                          </td>

                          {/* Role & Dept */}
                          <td className="p-3.5 px-4">
                            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              user.role === 'admin'
                                ? 'bg-amber-950 text-amber-300 border border-amber-500/30'
                                : user.role === 'manager'
                                ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/30'
                                : 'bg-slate-800 text-slate-300 border border-slate-700'
                            }`}>
                              {user.role}
                            </span>
                            <div className="text-[11px] text-slate-300 mt-1">{user.department}</div>
                          </td>

                          {/* Auth Method */}
                          <td className="p-3.5 px-4">
                            <div className="flex items-center gap-1.5 text-slate-200">
                              {user.authMethod === 'token_otp' ? (
                                <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/30 font-medium">
                                  Token OTP Only
                                </span>
                              ) : user.authMethod === 'password_plus_token' ? (
                                <span className="px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-500/30 font-medium">
                                  Password + OTP
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                                  Password
                                </span>
                              )}
                            </div>
                          </td>

                          {/* IP Policy */}
                          <td className="p-3.5 px-4">
                            <div className="flex items-center gap-1.5">
                              {isOfficeOnly ? (
                                <span className="px-2.5 py-1 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 font-medium flex items-center gap-1">
                                  <Building2 className="w-3 h-3 text-emerald-400" />
                                  Office Subnet Only (192.168.100.0/24)
                                </span>
                              ) : (
                                <span className="px-2.5 py-1 rounded bg-amber-950/80 text-amber-300 border border-amber-500/30 font-medium flex items-center gap-1">
                                  <Globe2 className="w-3 h-3 text-amber-400" />
                                  Internet & Home Allowed
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Permitted Reports Count */}
                          <td className="p-3.5 px-4 text-center">
                            <span className="px-2.5 py-1 rounded-full font-mono text-xs font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                              {user.allowedReportIds.length} Reports
                            </span>
                          </td>

                          {/* Last Login */}
                          <td className="p-3.5 px-4">
                            <div className="text-slate-300 font-mono text-[11px]">
                              {user.lastLogin || 'Never'}
                            </div>
                            {user.lastLoginIp && (
                              <div className="text-[10px] text-slate-500 font-mono">
                                IP: {user.lastLoginIp}
                              </div>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="p-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleOpenEditUser(user)}
                                className="p-1.5 bg-slate-800 hover:bg-cyan-600 text-slate-300 hover:text-white rounded-lg transition-all"
                                title="Edit User & Permissions"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              {user.username !== 'praveen' && user.username !== 'admin' && (
                                <button
                                  onClick={() => handleDeleteUser(user.id, user.username)}
                                  className="p-1.5 bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white rounded-lg transition-all"
                                  title="Delete User"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </td>

                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: AUDIT LOGS */}
        {activeTab === 'audit_logs' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
              <div>
                <h3 className="font-bold text-white text-sm">Security & Access Audit Trail</h3>
                <p className="text-xs text-slate-400">
                  Logs every authentication attempt, IP subnet verification, and permission adjustment
                </p>
              </div>
              <button
                onClick={() => {
                  audioEngine.playNotification();
                  onOpenEmailInbox();
                }}
                className="px-3 py-1.5 bg-cyan-950 text-cyan-300 border border-cyan-500/30 rounded-lg text-xs font-semibold flex items-center gap-1.5"
              >
                <Mail className="w-3.5 h-3.5" />
                View noreply Dispatch Logs
              </button>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-300 font-semibold">
                      <th className="p-3.5 px-4">Timestamp</th>
                      <th className="p-3.5 px-4">Event Type</th>
                      <th className="p-3.5 px-4">User</th>
                      <th className="p-3.5 px-4">Host IP Address</th>
                      <th className="p-3.5 px-4">Details</th>
                      <th className="p-3.5 px-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-3.5 px-4 text-slate-400 text-[11px] whitespace-nowrap">
                          {log.timestamp}
                        </td>
                        <td className="p-3.5 px-4 font-semibold text-cyan-300 font-sans">
                          {log.action}
                        </td>
                        <td className="p-3.5 px-4 text-slate-200">
                          {log.username}
                        </td>
                        <td className="p-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded text-[11px] ${
                            log.ipAddress.startsWith('192.168.100.')
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                              : 'bg-rose-950 text-rose-300 border border-rose-500/30'
                          }`}>
                            {log.ipAddress}
                          </span>
                        </td>
                        <td className="p-3.5 px-4 text-slate-300 font-sans text-xs max-w-md">
                          {log.details}
                        </td>
                        <td className="p-3.5 px-4 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            log.status === 'SUCCESS'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                              : log.status === 'DENIED'
                              ? 'bg-rose-950 text-rose-300 border border-rose-500/30'
                              : 'bg-amber-950 text-amber-300 border border-amber-500/30'
                          }`}>
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: NETWORK & IP POLICIES */}
        {activeTab === 'network_policies' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Office Subnet Architecture */}
            <div className="bg-slate-900 border border-cyan-500/30 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Office LAN Subnet (192.168.100.0/24)</h3>
                  <p className="text-xs text-slate-400">Internal Falcon Chemicals Enterprise Network</p>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                By default, all end users have their IP Access Policy restricted to the internal office CIDR range <code>192.168.100.0/24</code>. When employees attempt to log in from off-site or external home Internet connections without admin authorization, the security gateway intercepts the connection, records an audit log, and notifies Chief Administrator Praveen.
              </p>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Subnet Mask:</span>
                  <span className="font-mono text-cyan-300">255.255.255.0 (/24)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">IP Host Range:</span>
                  <span className="font-mono text-slate-200">192.168.100.1 – 192.168.100.254</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Oracle Reports Host:</span>
                  <span className="font-mono text-emerald-400">192.168.100.202:8080</span>
                </div>
              </div>
            </div>

            {/* Simulated Workstation IP Control */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <Network className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Live IP Subnet Simulation</h3>
                  <p className="text-xs text-slate-400">Active connection test engine</p>
                </div>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Current Workstation IP:</span>
                  <span className={`px-2.5 py-1 rounded font-mono font-bold text-xs ${
                    currentSimulatedIp.startsWith('192.168.100.')
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                      : 'bg-amber-950 text-amber-300 border border-amber-500/30'
                  }`}>
                    {currentSimulatedIp}
                  </span>
                </div>
                <div className="text-xs text-slate-400">
                  Status: {currentSimulatedIp.startsWith('192.168.100.') ? (
                    <strong className="text-emerald-400">Internal Office Workstation (Authorized)</strong>
                  ) : (
                    <strong className="text-amber-400">External WAN / Remote Connection</strong>
                  )}
                </div>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* CREATE / EDIT USER MODAL WITH ORACLE REPORTS RBAC MATRIX */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl bg-slate-900 border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 to-slate-850 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {editingUserId ? 'Edit End User & Report Access' : 'Create New End User & Provision RBAC'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Configure identity, network IP boundary, and assign Oracle reporting permissions
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSaveUser} className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
              
              {/* Section 1: User Identity */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                  1. User Identification & Credentials
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formFullName}
                      onChange={(e) => setFormFullName(e.target.value)}
                      placeholder="e.g. Ajay Kumar"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Username *
                    </label>
                    <input
                      type="text"
                      required
                      value={formUsername}
                      onChange={(e) => setFormUsername(e.target.value)}
                      placeholder="e.g. ajay"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Corporate Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      placeholder="ajay@falconchemicals.com"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Password (or Initial Secret) *
                    </label>
                    <input
                      type="text"
                      required
                      value={formPassword}
                      onChange={(e) => setFormPassword(e.target.value)}
                      placeholder="Falcon@2026"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white font-mono outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Corporate Role
                    </label>
                    <select
                      value={formRole}
                      onChange={(e) => setFormRole(e.target.value as RoleType)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white outline-none focus:border-cyan-400"
                    >
                      <option value="manager">Manager (Department Supervisor)</option>
                      <option value="analyst">Analyst (Commercial / Data Analyst)</option>
                      <option value="operator">Operator (Plant & Lab Operations)</option>
                      <option value="auditor">Auditor (Finance & KYC)</option>
                      <option value="admin">Admin (Full System Control)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Department
                    </label>
                    <input
                      type="text"
                      value={formDepartment}
                      onChange={(e) => setFormDepartment(e.target.value)}
                      placeholder="e.g. Commercial Sales & Dispatch"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: IP Policy & Auth */}
              <div className="space-y-3 pt-3 border-t border-slate-800">
                <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                  2. Authentication Mode & Host IP Boundary Policy
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Authentication Policy
                    </label>
                    <select
                      value={formAuthMethod}
                      onChange={(e) => setFormAuthMethod(e.target.value as AuthMethod)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white outline-none focus:border-cyan-400"
                    >
                      <option value="password">Password Only</option>
                      <option value="token_otp">6-Digit Token OTP Only (via noreply@)</option>
                      <option value="password_plus_token">Dual 2FA (Password + Token OTP)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      IP Network Access Policy
                    </label>
                    <select
                      value={formIpPolicy}
                      onChange={(e) => setFormIpPolicy(e.target.value as IPAccessPolicy)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white outline-none focus:border-cyan-400"
                    >
                      <option value="office_only">Office Subnet Only (192.168.100.0/24)</option>
                      <option value="internet_allowed">Internet & Home Remote Allowed</option>
                      <option value="custom_subnet">Custom Authorized Subnet</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 3: Oracle Reports Permissions Matrix */}
              <div className="space-y-3 pt-3 border-t border-slate-800">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                      <Database className="w-3.5 h-3.5" />
                      3. Oracle Enterprise Reports Matrix (192.168.100.202:8080)
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Approved: <strong className="text-white">{formAllowedReports.length}</strong> reports selected for this user
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setFormAllowedReports(DEFAULT_ALL_ORACLE_REPORT_IDS)}
                      className="px-2.5 py-1 bg-cyan-950 text-cyan-300 border border-cyan-500/30 rounded text-[11px] font-semibold hover:bg-cyan-900"
                    >
                      Grant All 22 Oracle Reports
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const salesAndDispIds = [
                          ...ORACLE_REPORT_MODULES.find(m => m.id === 'sales_analytics')!.reports.map(r => r.id),
                          ...ORACLE_REPORT_MODULES.find(m => m.id === 'dispatch_logistics')!.reports.map(r => r.id)
                        ];
                        setFormAllowedReports(salesAndDispIds);
                      }}
                      className="px-2.5 py-1 bg-slate-800 text-slate-200 border border-slate-700 rounded text-[11px] font-semibold hover:bg-slate-700"
                    >
                      Sales & Dispatch Only
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormAllowedReports([])}
                      className="px-2.5 py-1 bg-slate-800 text-slate-400 border border-slate-700 rounded text-[11px] hover:text-slate-200"
                    >
                      Clear All
                    </button>
                  </div>
                </div>

                {/* Module-by-Module Oracle Grid */}
                <div className="space-y-3 pt-1">
                  {ORACLE_REPORT_MODULES.map((module) => {
                    const allSelected = module.reports.every(r => formAllowedReports.includes(r.id));
                    const selectedCount = module.reports.filter(r => formAllowedReports.includes(r.id)).length;

                    return (
                      <div key={module.id} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-3.5 bg-cyan-400 rounded-full"></span>
                            <span className="text-xs font-bold text-slate-200">
                              {module.name}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              ({selectedCount}/{module.reports.length} selected)
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleToggleModuleReports(module.reports)}
                            className="text-[11px] text-cyan-400 hover:underline font-medium"
                          >
                            {allSelected ? 'Deselect Module' : 'Select All in Module'}
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                          {module.reports.map((report) => {
                            const isChecked = formAllowedReports.includes(report.id);
                            return (
                              <label
                                key={report.id}
                                className={`p-2 rounded-lg border cursor-pointer flex items-start gap-2.5 transition-all text-xs ${
                                  isChecked
                                    ? 'bg-cyan-950/40 border-cyan-500/40 text-white'
                                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => handleToggleReport(report.id)}
                                  className="mt-0.5 rounded bg-slate-950 border-slate-700 text-cyan-500 focus:ring-0"
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="font-semibold text-xs flex items-center justify-between gap-1">
                                    <span className="truncate">{report.title}</span>
                                    <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                                      report.status === 'LIVE' ? 'bg-emerald-950 text-emerald-300' : 'bg-slate-800 text-slate-400'
                                    }`}>
                                      {report.status}
                                    </span>
                                  </div>
                                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                                    {report.oracleCode}
                                  </p>
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Operations Hub Core Reports */}
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2 mt-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                    <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                      Core Operations Hub Reports
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const coreIds = FALCON_REPORTS.map(r => r.id);
                        const allCore = coreIds.every(id => formAllowedReports.includes(id));
                        if (allCore) {
                          setFormAllowedReports(formAllowedReports.filter(id => !coreIds.includes(id)));
                        } else {
                          setFormAllowedReports(Array.from(new Set([...formAllowedReports, ...coreIds])));
                        }
                      }}
                      className="text-[11px] text-cyan-400 hover:underline font-medium"
                    >
                      Toggle Core Hub Reports
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {FALCON_REPORTS.map((rep) => {
                      const isChecked = formAllowedReports.includes(rep.id);
                      return (
                        <label
                          key={rep.id}
                          className={`p-2 rounded-lg border cursor-pointer flex items-start gap-2.5 transition-all text-xs ${
                            isChecked
                              ? 'bg-cyan-950/40 border-cyan-500/40 text-white'
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleReport(rep.id)}
                            className="mt-0.5 rounded bg-slate-950 border-slate-700 text-cyan-500 focus:ring-0"
                          />
                          <div className="flex-1 min-w-0">
                            <span className="font-semibold text-xs text-slate-200 block truncate">{rep.title}</span>
                            <span className="text-[10px] text-slate-500 font-mono">{rep.code}</span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-cyan-900/30 transition-all flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  Save User & Apply Permissions
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
