import React, { useState } from 'react';
import { UserAccount, AuditLogEntry, VirtualEmail, IPAccessPolicy, AuthMethod, RoleType } from '../types';
import { FALCON_REPORTS } from '../data/reportsData';
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
  Check
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
}

export const AdminAccessControlPanel: React.FC<AdminAccessControlPanelProps> = ({
  users,
  auditLogs,
  currentSimulatedIp,
  onUpdateUsers,
  onAddAuditLog,
  onSendVirtualEmail,
  onReturnToReports,
  onOpenEmailInbox
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
    setFormRole('analyst');
    setFormDepartment('Commercial Sales');
    setFormBranch('Falcon Chemicals LLC - Dubai');
    setFormAuthMethod('password');
    setFormIpPolicy('office_only');
    setFormCustomSubnet('192.168.100.0/24');
    setFormAllowedReports(['rep_sales_daily', 'rep_stock_balance']);
    setFormIsActive(true);
    setIsEditModalOpen(true);
  };

  // Toggle report permission checkbox
  const handleToggleReport = (reportId: string) => {
    audioEngine.playClick();
    if (formAllowedReports.includes(reportId)) {
      setFormAllowedReports(formAllowedReports.filter(id => id !== reportId));
    } else {
      setFormAllowedReports([...formAllowedReports, reportId]);
    }
  };

  // Select all reports in a specific category
  const handleSelectCategoryReports = (category: string) => {
    audioEngine.playClick();
    const categoryReportIds = FALCON_REPORTS.filter(r => r.category === category).map(r => r.id);
    const allSelected = categoryReportIds.every(id => formAllowedReports.includes(id));
    if (allSelected) {
      setFormAllowedReports(formAllowedReports.filter(id => !categoryReportIds.includes(id)));
    } else {
      const merged = Array.from(new Set([...formAllowedReports, ...categoryReportIds]));
      setFormAllowedReports(merged);
    }
  };

  // Save User (Create or Update)
  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    audioEngine.playSuccess();

    if (editingUserId) {
      // Update existing
      const updated = users.map(u => {
        if (u.id === editingUserId) {
          return {
            ...u,
            fullName: formFullName,
            username: formUsername,
            email: formEmail,
            password: formPassword,
            role: formRole,
            department: formDepartment,
            companyOrBranch: formBranch,
            authMethod: formAuthMethod,
            ipPolicy: formIpPolicy,
            customAllowedSubnet: formCustomSubnet,
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
        username: 'admin',
        email: 'sarah.jenkins@falconchemicals.com',
        action: 'POLICY_UPDATED',
        ipAddress: currentSimulatedIp,
        ipLocationType: currentSimulatedIp.startsWith('192.168.100.') ? 'Office LAN (192.168.100.0/24)' : 'External Internet / Home WAN',
        details: `Updated permissions and IP policy (${formIpPolicy}) for user "${formUsername}" with ${formAllowedReports.length} reports.`,
        status: 'SUCCESS'
      });
    } else {
      // Create new
      const newUser: UserAccount = {
        id: `usr_${Date.now()}`,
        fullName: formFullName,
        username: formUsername,
        email: formEmail,
        password: formPassword,
        role: formRole,
        department: formDepartment,
        companyOrBranch: formBranch,
        authMethod: formAuthMethod,
        ipPolicy: formIpPolicy,
        customAllowedSubnet: formCustomSubnet,
        allowedReportIds: formAllowedReports,
        isActive: formIsActive,
        createdDate: new Date().toISOString().slice(0, 10)
      };
      onUpdateUsers([...users, newUser]);

      // Send Welcome / Credentials email from noreply@falconchemicals.com
      const welcomeEmail: VirtualEmail = {
        id: `eml_${Date.now()}`,
        from: 'noreply@falconchemicals.com',
        to: formEmail,
        subject: 'Welcome to Falcon Chemicals Portal - Account Provisioned',
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        bodyText: `Dear ${formFullName},\n\nYour Falcon Chemicals Enterprise Portal account has been created by Chief Admin.\n\nUsername: ${formUsername}\nTemporary Password: ${formPassword}\nAssigned Reports: ${formAllowedReports.length} modules\nNetwork Access Policy: ${formIpPolicy === 'office_only' ? 'Office Subnet (192.168.100.0/24)' : 'Internet & Home WAN Allowed'}\n\nPlease authenticate at: portal.falconchemicals.com\n\nCorporate Security - Falcon Chemicals LLC`,
        type: 'account_created',
        isRead: false
      };
      onSendVirtualEmail(welcomeEmail);

      onAddAuditLog({
        id: `log_${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        username: 'admin',
        email: 'sarah.jenkins@falconchemicals.com',
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
    if (username === 'admin') {
      audioEngine.playError();
      alert('The Chief Administrator account cannot be deleted.');
      return;
    }
    if (window.confirm(`Are you sure you want to revoke access for "${username}"?`)) {
      audioEngine.playClick();
      const updated = users.filter(u => u.id !== userId);
      onUpdateUsers(updated);
      onAddAuditLog({
        id: `log_${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        username: 'admin',
        email: 'sarah.jenkins@falconchemicals.com',
        action: 'POLICY_UPDATED',
        ipAddress: currentSimulatedIp,
        ipLocationType: 'Office LAN (192.168.100.0/24)',
        details: `Revoked access and deleted user account "${username}"`,
        status: 'WARNING'
      });
    }
  };

  const filteredUsers = users.filter(u => 
    u.fullName.toLowerCase().includes(searchUserQuery.toLowerCase()) ||
    u.username.toLowerCase().includes(searchUserQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchUserQuery.toLowerCase()) ||
    u.department.toLowerCase().includes(searchUserQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-30 px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              audioEngine.playClick();
              onReturnToReports();
            }}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors flex items-center gap-1.5 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Reports
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-white tracking-wide">
                Admin Access Control & RBAC Engine
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded">
                Admin Mode
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Falcon Chemicals LLC • Role-Based Report Permissions & Office IP Boundary Security
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              audioEngine.playNotification();
              onOpenEmailInbox();
            }}
            className="px-3 py-1.5 bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/30 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <Mail className="w-3.5 h-3.5" />
            noreply Dispatch Log
          </button>
          <button
            onClick={handleOpenCreateUser}
            className="px-3.5 py-1.5 bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 text-white text-xs font-semibold rounded-lg shadow-lg shadow-cyan-900/30 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Create End User
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
          End Users & Report Access ({users.length})
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
                              {user.username === 'admin' && (
                                <span className="px-1.5 py-0.2 bg-amber-500/20 text-amber-300 text-[10px] font-bold rounded">
                                  CHIEF
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
                                <div className="text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded flex items-center gap-1">
                                  <Building2 className="w-3 h-3 text-emerald-400" />
                                  <span>Office (192.168.100.0/24)</span>
                                </div>
                              ) : (
                                <div className="text-sky-300 bg-sky-950/60 border border-sky-500/30 px-2 py-0.5 rounded flex items-center gap-1">
                                  <Globe2 className="w-3 h-3 text-sky-400" />
                                  <span>Internet Allowed</span>
                                </div>
                              )}
                            </div>
                          </td>

                          {/* Permitted Reports Count */}
                          <td className="p-3.5 px-4 text-center">
                            <span className="font-mono font-bold text-cyan-400 text-sm">
                              {user.allowedReportIds.length} / {FALCON_REPORTS.length}
                            </span>
                            <div className="text-[10px] text-slate-400">Reports Enabled</div>
                          </td>

                          {/* Last Login */}
                          <td className="p-3.5 px-4 font-mono text-[11px] text-slate-400">
                            <div>{user.lastLogin || 'Never'}</div>
                            {user.lastLoginIp && (
                              <div className="text-slate-500 text-[10px]">{user.lastLoginIp}</div>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="p-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleOpenEditUser(user)}
                                className="p-1.5 bg-slate-800 hover:bg-cyan-900/60 text-slate-300 hover:text-cyan-300 rounded-lg border border-slate-700 transition-colors"
                                title="Edit Role & Report Access"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              {user.username !== 'admin' && (
                                <button
                                  onClick={() => handleDeleteUser(user.id, user.username)}
                                  className="p-1.5 bg-slate-800 hover:bg-rose-900/60 text-slate-300 hover:text-rose-300 rounded-lg border border-slate-700 transition-colors"
                                  title="Revoke Access"
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
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Live Authentication & IP Access Audit Log</h3>
                  <p className="text-xs text-slate-400">Automated ledger of all login attempts, blocked IP connections, and token dispatches</p>
                </div>
                <span className="font-mono text-xs text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Listening
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-300 font-semibold">
                      <th className="p-3 px-4">Timestamp</th>
                      <th className="p-3 px-4">User</th>
                      <th className="p-3 px-4">Action</th>
                      <th className="p-3 px-4">Host IP & Subnet</th>
                      <th className="p-3 px-4">Security Event Details</th>
                      <th className="p-3 px-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-800/40 font-mono text-[11px]">
                        <td className="p-3 px-4 text-slate-400 shrink-0">{log.timestamp}</td>
                        <td className="p-3 px-4 text-white font-semibold">{log.username}</td>
                        <td className="p-3 px-4">
                          <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-slate-800 text-slate-200">
                            {log.action}
                          </span>
                        </td>
                        <td className="p-3 px-4 text-cyan-300">
                          <div>{log.ipAddress}</div>
                          <div className="text-[10px] text-slate-500 font-sans">{log.ipLocationType}</div>
                        </td>
                        <td className="p-3 px-4 text-slate-300 font-sans">{log.details}</td>
                        <td className="p-3 px-4 text-center">
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
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

        {/* TAB 3: NETWORK POLICIES */}
        {activeTab === 'network_policies' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Falcon Dubai Office Subnet Policy</h3>
                  <p className="text-xs text-slate-400">Default Corporate LAN CIDR: 192.168.100.0/24</p>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                When an end user is configured with <strong>"Office Subnet Only"</strong>, the Falcon Access Control Engine validates the inbound connection against the internal IP range (192.168.100.1 - 192.168.100.254). Any request originating from residential ISPs (Etisalat/Du WANs) or mobile data is instantly blocked, and a security alert is dispatched from <strong>noreply@falconchemicals.com</strong>.
              </p>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 space-y-1">
                <div className="text-emerald-400 font-semibold">Subnet Gateway: 192.168.100.1</div>
                <div>Subnet Mask: 255.255.255.0 (/24)</div>
                <div>Usable Host Range: 192.168.100.1 - 192.168.100.254</div>
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
                  <Globe2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Remote & Internet Access Policy</h3>
                  <p className="text-xs text-slate-400">For Executives, Field Sales & Logistics</p>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Users with <strong>"Internet Allowed"</strong> privileges may authenticate from any public IP address across the UAE or international locations. To ensure strict data protection, Admins can mandate <strong>6-Digit Token OTP</strong> verification or 2FA via email for remote workers.
              </p>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 space-y-1">
                <div className="text-sky-400 font-semibold">Remote Validation: Enabled</div>
                <div>Email Token Dispatcher: noreply@falconchemicals.com</div>
                <div>Session Timeout: 30 Minutes Inactivity</div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* CREATE / EDIT USER MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl bg-slate-900 border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">
                    {editingUserId ? 'Edit End User & Report Access' : 'Create New End User Account'}
                  </h2>
                  <p className="text-xs text-slate-400">
                    Assign granular report permissions, authentication method, and IP network policy
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveUser} className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
              
              {/* Basic Details */}
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
                      placeholder="e.g. Tariq Al-Mansoor"
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
                      placeholder="e.g. tariq.mansoor"
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
                      placeholder="tariq@falconchemicals.com"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Password (or Temp Secret) *
                    </label>
                    <input
                      type="text"
                      required
                      value={formPassword}
                      onChange={(e) => setFormPassword(e.target.value)}
                      placeholder="Password"
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
                      <option value="admin">Admin (Full System Control)</option>
                      <option value="manager">Manager (Department Supervisor)</option>
                      <option value="analyst">Analyst (Data Analysis & Export)</option>
                      <option value="operator">Operator (Plant & Lab Operations)</option>
                      <option value="auditor">Auditor (Finance & KYC Inspector)</option>
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
                      placeholder="e.g. Commercial Sales"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>
              </div>

              {/* Authentication & IP Policy */}
              <div className="space-y-3 pt-2 border-t border-slate-800">
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

              {/* Granular Report Permissions Selector */}
              <div className="space-y-3 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                    3. Granular Report Permissions ({formAllowedReports.length} of {FALCON_REPORTS.length} selected)
                  </h4>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setFormAllowedReports(FALCON_REPORTS.map(r => r.id))}
                      className="text-[11px] text-cyan-400 hover:underline"
                    >
                      Select All
                    </button>
                    <span className="text-slate-600">•</span>
                    <button
                      type="button"
                      onClick={() => setFormAllowedReports([])}
                      className="text-[11px] text-slate-400 hover:underline"
                    >
                      Clear All
                    </button>
                  </div>
                </div>

                {/* Group by category */}
                {(['sales', 'inventory', 'production', 'finance', 'kyc_compliance'] as const).map((cat) => {
                  const catReports = FALCON_REPORTS.filter(r => r.category === cat);
                  const isAllCatSelected = catReports.every(r => formAllowedReports.includes(r.id));

                  return (
                    <div key={cat} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                        <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                          {cat.replace('_', ' ')} Reports
                        </span>
                        <button
                          type="button"
                          onClick={() => handleSelectCategoryReports(cat)}
                          className="text-[11px] text-cyan-400 hover:underline"
                        >
                          {isAllCatSelected ? 'Deselect Category' : 'Select Category'}
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {catReports.map((report) => {
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
                              <div className="flex-1">
                                <div className="font-semibold text-xs flex items-center justify-between">
                                  <span>{report.title}</span>
                                  <span className="text-[10px] font-mono text-slate-500">{report.code}</span>
                                </div>
                                <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                                  {report.description}
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
