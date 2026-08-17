import React, { useState } from 'react';
import { UserAccount, VirtualEmail, AuditLogEntry } from '../types';
import { checkIpSubnetMatch } from '../data/usersData';
import { 
  ShieldCheck, 
  Lock, 
  User, 
  KeyRound, 
  Mail, 
  Network, 
  AlertTriangle, 
  CheckCircle2, 
  X, 
  ArrowRight, 
  RefreshCw, 
  Sparkles,
  Building2,
  Globe2,
  Smartphone,
  Eye,
  EyeOff
} from 'lucide-react';
import { audioEngine } from '../services/audioEngine';

interface PortalAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: UserAccount[];
  currentSimulatedIp: string;
  onUpdateSimulatedIp: (ip: string) => void;
  onLoginSuccess: (user: UserAccount) => void;
  onSendVirtualEmail: (email: VirtualEmail) => void;
  onAddAuditLog: (log: AuditLogEntry) => void;
  onOpenEmailInbox: () => void;
}

type TabType = 'signin' | 'token_login' | 'new_user' | 'recovery';

export const PortalAccessModal: React.FC<PortalAccessModalProps> = ({
  isOpen,
  onClose,
  users,
  currentSimulatedIp,
  onUpdateSimulatedIp,
  onLoginSuccess,
  onSendVirtualEmail,
  onAddAuditLog,
  onOpenEmailInbox
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('signin');
  
  // Sign In Form States
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // OTP Token Login States
  const [tokenIdentityInput, setTokenIdentityInput] = useState('');
  const [tokenStep, setTokenStep] = useState<'request' | 'verify'>('request');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [pendingOtpUser, setPendingOtpUser] = useState<UserAccount | null>(null);
  const [generatedOtpCode, setGeneratedOtpCode] = useState<string | null>(null);

  // Recovery Form States
  const [recoveryEmailInput, setRecoveryEmailInput] = useState('');
  const [recoveryStep, setRecoveryStep] = useState<'request' | 'verify_reset'>('request');
  const [recoveryOtpInput, setRecoveryOtpInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');

  // New User Request States
  const [regFullName, setRegFullName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regDepartment, setRegDepartment] = useState('Commercial Sales');
  const [regRequestedAccess, setRegRequestedAccess] = useState('Sales & Dispatch Reports');

  if (!isOpen) return null;

  // Handle Standard Password Login
  const handlePasswordSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const user = users.find(
      u => u.username.toLowerCase() === usernameInput.trim().toLowerCase() ||
           u.email.toLowerCase() === usernameInput.trim().toLowerCase() ||
           (usernameInput.trim().toLowerCase() === 'admin' && u.role === 'admin') ||
           (usernameInput.trim().toLowerCase() === 'praveen' && u.role === 'admin')
    );

    if (!user) {
      audioEngine.playError();
      setErrorMessage('Invalid username or corporate email. Please check your credentials.');
      onAddAuditLog({
        id: `log_${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        username: usernameInput || 'unknown',
        email: '',
        action: 'LOGIN_FAILED_CREDENTIALS',
        ipAddress: currentSimulatedIp,
        ipLocationType: currentSimulatedIp.startsWith('192.168.100.') ? 'Office LAN (192.168.100.0/24)' : 'External Internet / Home WAN',
        details: `Failed authentication attempt for "${usernameInput}"`,
        status: 'DENIED'
      });
      return;
    }

    if (user.password !== passwordInput) {
      audioEngine.playError();
      setErrorMessage('Incorrect password. Please verify or use the Recovery tab.');
      onAddAuditLog({
        id: `log_${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        username: user.username,
        email: user.email,
        action: 'LOGIN_FAILED_CREDENTIALS',
        ipAddress: currentSimulatedIp,
        ipLocationType: currentSimulatedIp.startsWith('192.168.100.') ? 'Office LAN (192.168.100.0/24)' : 'External Internet / Home WAN',
        details: `Incorrect password provided for user "${user.username}"`,
        status: 'DENIED'
      });
      return;
    }

    // Check IP Subnet Access Control Policy
    const ipCheck = checkIpSubnetMatch(currentSimulatedIp, user.ipPolicy, user.customAllowedSubnet);
    if (!ipCheck.allowed) {
      audioEngine.playError();
      setErrorMessage(ipCheck.reason);

      // Dispatch alert email to admin
      const alertEmail: VirtualEmail = {
        id: `eml_${Date.now()}`,
        from: 'noreply@falconchemicals.com',
        to: 'praveen@falconchemicals.com',
        subject: `Security Alert: External IP Blocked for ${user.username}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        bodyText: `Security Policy Violation Detected:\n\nUser: ${user.fullName} (${user.username})\nAttempted IP: ${currentSimulatedIp}\nRequired Subnet: 192.168.100.0/24 (Office LAN)\nTime: ${new Date().toLocaleString()}\n\nThe session was denied.`,
        type: 'ip_security_alert',
        isRead: false
      };
      onSendVirtualEmail(alertEmail);

      onAddAuditLog({
        id: `log_${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        username: user.username,
        email: user.email,
        action: 'LOGIN_BLOCKED_IP',
        ipAddress: currentSimulatedIp,
        ipLocationType: 'External Internet / Home WAN',
        details: `Access Blocked: Policy set to Office Subnet (192.168.100.0/24). Current IP: ${currentSimulatedIp}`,
        status: 'DENIED'
      });
      return;
    }

    // Check if user has token-only policy or requires 2FA token
    if (user.authMethod === 'token_otp' || user.authMethod === 'password_plus_token') {
      audioEngine.playNotification();
      // Generate OTP and switch to token verification
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtpCode(otp);
      setPendingOtpUser(user);
      setTokenStep('verify');
      setActiveTab('token_login');

      const otpEmail: VirtualEmail = {
        id: `eml_${Date.now()}`,
        from: 'noreply@falconchemicals.com',
        to: user.email,
        subject: 'Falcon Portal: Your 6-Digit Secure Login Token',
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        otpCode: otp,
        bodyText: `Dear ${user.fullName},\n\nYour 6-digit authentication token to access Falcon Chemicals Enterprise Reports is:\n\n${otp}\n\nThis token is valid for 10 minutes from IP: ${currentSimulatedIp}.\n\nFalcon Corporate IT Security - Dubai Industrial City`,
        type: 'otp_login',
        isRead: false
      };
      onSendVirtualEmail(otpEmail);

      onAddAuditLog({
        id: `log_${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        username: user.username,
        email: user.email,
        action: 'OTP_SENT',
        ipAddress: currentSimulatedIp,
        ipLocationType: currentSimulatedIp.startsWith('192.168.100.') ? 'Office LAN (192.168.100.0/24)' : 'External Internet / Home WAN',
        details: `6-Digit Token dispatched to ${user.email}`,
        status: 'SUCCESS'
      });
      return;
    }

    // Success Password Login
    audioEngine.playSuccess();
    onAddAuditLog({
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      username: user.username,
      email: user.email,
      action: 'LOGIN_SUCCESS',
      ipAddress: currentSimulatedIp,
      ipLocationType: currentSimulatedIp.startsWith('192.168.100.') ? 'Office LAN (192.168.100.0/24)' : 'External Internet / Home WAN',
      details: `Successful password authentication. Role: ${user.role}. IP Policy: ${user.ipPolicy}`,
      status: 'SUCCESS'
    });
    onLoginSuccess(user);
  };

  // Handle Requesting 6-Digit OTP Token
  const handleRequestToken = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const user = users.find(
      u => u.username.toLowerCase() === tokenIdentityInput.trim().toLowerCase() ||
           u.email.toLowerCase() === tokenIdentityInput.trim().toLowerCase() ||
           (tokenIdentityInput.trim().toLowerCase() === 'admin' && u.role === 'admin') ||
           (tokenIdentityInput.trim().toLowerCase() === 'praveen' && u.role === 'admin')
    );

    if (!user) {
      audioEngine.playError();
      setErrorMessage('User account not found. Contact Admin Praveen (praveen@falconchemicals.com) for provisioning.');
      return;
    }

    // IP validation check
    const ipCheck = checkIpSubnetMatch(currentSimulatedIp, user.ipPolicy, user.customAllowedSubnet);
    if (!ipCheck.allowed) {
      audioEngine.playError();
      setErrorMessage(ipCheck.reason);
      return;
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtpCode(otp);
    setPendingOtpUser(user);
    setTokenStep('verify');

    const otpEmail: VirtualEmail = {
      id: `eml_${Date.now()}`,
      from: 'noreply@falconchemicals.com',
      to: user.email,
      subject: 'Falcon Portal: Your 6-Digit Secure Login Token',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      otpCode: otp,
      bodyText: `Dear ${user.fullName},\n\nYour 6-digit authentication token is:\n\n${otp}\n\nValid for 10 minutes on host IP: ${currentSimulatedIp}.\n\nFalcon Chemicals LLC Enterprise Portal`,
      type: 'otp_login',
      isRead: false
    };
    onSendVirtualEmail(otpEmail);
    audioEngine.playNotification();

    onAddAuditLog({
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      username: user.username,
      email: user.email,
      action: 'OTP_SENT',
      ipAddress: currentSimulatedIp,
      ipLocationType: currentSimulatedIp.startsWith('192.168.100.') ? 'Office LAN (192.168.100.0/24)' : 'External Internet / Home WAN',
      details: `OTP Token dispatched to ${user.email}`,
      status: 'SUCCESS'
    });
  };

  // Handle Verifying Entered 6-Digit Token
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!pendingOtpUser) {
      setErrorMessage('Session expired. Please request a new token.');
      setTokenStep('request');
      return;
    }

    if (enteredOtp.trim() !== generatedOtpCode) {
      audioEngine.playError();
      setErrorMessage('Invalid or expired 6-digit token. Click "View noreply Inbox" to verify the exact code.');
      return;
    }

    audioEngine.playSuccess();
    onAddAuditLog({
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      username: pendingOtpUser.username,
      email: pendingOtpUser.email,
      action: 'LOGIN_SUCCESS',
      ipAddress: currentSimulatedIp,
      ipLocationType: currentSimulatedIp.startsWith('192.168.100.') ? 'Office LAN (192.168.100.0/24)' : 'External Internet / Home WAN',
      details: 'Token OTP verified successfully. Granted access to dashboard.',
      status: 'SUCCESS'
    });
    onLoginSuccess(pendingOtpUser);
  };

  // Quick Demo Login Helper
  const handleQuickDemoLogin = (user: UserAccount) => {
    audioEngine.playClick();
    setUsernameInput(user.username);
    setPasswordInput(user.password || '');
    setTokenIdentityInput(user.username);
  };

  // Direct Instant Demo Launch Helper
  const handleInstantDemoLaunch = (user: UserAccount) => {
    // Check IP
    const ipCheck = checkIpSubnetMatch(currentSimulatedIp, user.ipPolicy, user.customAllowedSubnet);
    if (!ipCheck.allowed) {
      audioEngine.playError();
      setErrorMessage(ipCheck.reason);
      return;
    }
    audioEngine.playSuccess();
    onAddAuditLog({
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      username: user.username,
      email: user.email,
      action: 'LOGIN_SUCCESS',
      ipAddress: currentSimulatedIp,
      ipLocationType: currentSimulatedIp.startsWith('192.168.100.') ? 'Office LAN (192.168.100.0/24)' : 'External Internet / Home WAN',
      details: `Quick Demo Switch: ${user.fullName} (${user.role})`,
      status: 'SUCCESS'
    });
    onLoginSuccess(user);
  };

  // Handle Recovery Request
  const handleRequestRecovery = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    const user = users.find(u => u.email.toLowerCase() === recoveryEmailInput.trim().toLowerCase());

    if (!user) {
      audioEngine.playError();
      setErrorMessage('No Falcon account registered with this email address.');
      return;
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtpCode(otp);
    setPendingOtpUser(user);
    setRecoveryStep('verify_reset');

    const recoveryEmail: VirtualEmail = {
      id: `eml_${Date.now()}`,
      from: 'noreply@falconchemicals.com',
      to: user.email,
      subject: 'Falcon Portal: Password Recovery Code',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      otpCode: otp,
      bodyText: `Dear ${user.fullName},\n\nWe received a password reset request for your account.\n\nYour 6-digit recovery code is:\n${otp}\n\nFalcon Chemicals IT Security`,
      type: 'password_recovery',
      isRead: false
    };
    onSendVirtualEmail(recoveryEmail);
    audioEngine.playNotification();
    setSuccessMessage(`Recovery code sent to ${user.email}. Check virtual inbox.`);
  };

  // Handle Completing Password Reset
  const handleCompleteReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (recoveryOtpInput.trim() !== generatedOtpCode) {
      audioEngine.playError();
      setErrorMessage('Invalid recovery code.');
      return;
    }
    if (newPasswordInput.length < 6) {
      audioEngine.playError();
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    if (pendingOtpUser) {
      pendingOtpUser.password = newPasswordInput;
      audioEngine.playSuccess();
      setSuccessMessage('Password reset successfully! You may now sign in.');
      setActiveTab('signin');
      setUsernameInput(pendingOtpUser.username);
      setPasswordInput(newPasswordInput);
      setRecoveryStep('request');
    }
  };

  // Handle New User Registration Request
  const handleRegisterRequest = (e: React.FormEvent) => {
    e.preventDefault();
    audioEngine.playSuccess();
    setSuccessMessage('Registration request submitted to Chief Admin Praveen (praveen@falconchemicals.com). Once approved and reports are assigned, you will receive an activation email from noreply@falconchemicals.com.');
    
    // Notify admin in email
    const adminNotify: VirtualEmail = {
      id: `eml_${Date.now()}`,
      from: 'noreply@falconchemicals.com',
      to: 'praveen@falconchemicals.com',
      subject: `New User Provisioning Request: ${regFullName}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      bodyText: `New End-User Registration:\n\nName: ${regFullName}\nUsername: ${regUsername}\nEmail: ${regEmail}\nDept: ${regDepartment}\nRequested Scope: ${regRequestedAccess}\nHost IP: ${currentSimulatedIp}\n\nPlease review and assign report permissions in Admin Access Control.`,
      type: 'account_created',
      isRead: false
    };
    onSendVirtualEmail(adminNotify);
  };

  const isOfficeSubnet = currentSimulatedIp.startsWith('192.168.100.');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Glowing Gradient Accent */}
        <div className="h-1 bg-gradient-to-r from-cyan-500 via-sky-400 to-teal-400 w-full"></div>

        {/* IP Simulator Banner Header */}
        <div className="bg-slate-950/90 border-b border-slate-800 p-3 px-4 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Network className="w-4 h-4 text-cyan-400" />
            <span className="text-slate-300 font-semibold">Simulated Host Network:</span>
            <span className={`px-2 py-0.5 rounded font-mono font-bold text-xs flex items-center gap-1.5 ${
              isOfficeSubnet 
                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                : 'bg-amber-950/80 text-amber-300 border border-amber-500/30'
            }`}>
              {isOfficeSubnet ? <Building2 className="w-3 h-3 text-emerald-400" /> : <Globe2 className="w-3 h-3 text-amber-400" />}
              {currentSimulatedIp}
              <span className="text-[10px] opacity-80">
                ({isOfficeSubnet ? 'Office Subnet 192.168.100.0/24' : 'Internet / Home WAN'})
              </span>
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-slate-400">Switch IP:</span>
            <button
              onClick={() => {
                audioEngine.playClick();
                onUpdateSimulatedIp('192.168.100.45');
              }}
              className={`px-2 py-1 rounded text-[11px] font-mono transition-all ${
                isOfficeSubnet
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
              title="Office LAN 192.168.100.45"
            >
              Office IP (.100.45)
            </button>
            <button
              onClick={() => {
                audioEngine.playClick();
                onUpdateSimulatedIp('86.96.12.114');
              }}
              className={`px-2 py-1 rounded text-[11px] font-mono transition-all ${
                !isOfficeSubnet
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
              title="External Internet WAN 86.96.12.114"
            >
              Remote IP (WAN)
            </button>
            <button
              onClick={() => {
                audioEngine.playNotification();
                onOpenEmailInbox();
              }}
              className="px-2.5 py-1 bg-cyan-950 text-cyan-300 hover:bg-cyan-900 border border-cyan-500/40 rounded text-[11px] font-medium flex items-center gap-1 ml-1"
            >
              <Mail className="w-3 h-3" />
              noreply Inbox
            </button>
          </div>
        </div>

        {/* Modal Main Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-b from-slate-900 to-slate-900/60 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-inner">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-wide">
                  Falcon Portal Access Engine
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded">
                  RBAC & IP Secure
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Falcon Chemicals LLC • Enterprise Reports & Access Control Gateway
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              audioEngine.playClick();
              onClose();
            }}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Demo Logins Ribbon */}
        <div className="p-2 px-4 bg-slate-950/60 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-[11px] font-semibold text-cyan-400 shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Quick Demo:
          </span>
          {users.slice(0, 4).map((u) => (
            <button
              key={u.id}
              onClick={() => handleInstantDemoLaunch(u)}
              className="px-2.5 py-1 bg-slate-800/80 hover:bg-cyan-950 text-slate-300 hover:text-cyan-300 border border-slate-700 hover:border-cyan-500/40 rounded-lg text-xs font-medium transition-all shrink-0 flex items-center gap-1.5"
              title={`Role: ${u.role} | IP Policy: ${u.ipPolicy}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${u.role === 'admin' ? 'bg-amber-400' : 'bg-cyan-400'}`}></span>
              {u.fullName.split(' ')[0]} ({u.role})
            </button>
          ))}
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-900/90 px-4">
          <button
            onClick={() => {
              audioEngine.playClick();
              setActiveTab('signin');
              setErrorMessage(null);
            }}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'signin'
                ? 'border-cyan-400 text-cyan-400 bg-cyan-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            Password Sign In
          </button>

          <button
            onClick={() => {
              audioEngine.playClick();
              setActiveTab('token_login');
              setErrorMessage(null);
            }}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'token_login'
                ? 'border-cyan-400 text-cyan-400 bg-cyan-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            Token / OTP Login
          </button>

          <button
            onClick={() => {
              audioEngine.playClick();
              setActiveTab('new_user');
              setErrorMessage(null);
            }}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'new_user'
                ? 'border-cyan-400 text-cyan-400 bg-cyan-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            New User
          </button>

          <button
            onClick={() => {
              audioEngine.playClick();
              setActiveTab('recovery');
              setErrorMessage(null);
            }}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'recovery'
                ? 'border-cyan-400 text-cyan-400 bg-cyan-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Recovery
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
          
          {/* Error Message Box */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-200 text-xs flex items-start gap-2.5 animate-in fade-in">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-rose-300">Access Restricted</p>
                <p className="mt-0.5 text-rose-200/90 leading-relaxed">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Success Message Box */}
          {successMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 text-xs flex items-start gap-2.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-emerald-300">Status Update</p>
                <p className="mt-0.5 text-emerald-200/90 leading-relaxed">{successMessage}</p>
              </div>
            </div>
          )}

          {/* TAB 1: PASSWORD SIGN IN */}
          {activeTab === 'signin' && (
            <form onSubmit={handlePasswordSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Corporate Username or Email
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    placeholder="e.g. admin or tariq.mansoor"
                    className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      audioEngine.playClick();
                      setActiveTab('recovery');
                    }}
                    className="text-xs text-cyan-400 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 rounded-xl py-2.5 pl-10 pr-10 text-sm text-white placeholder-slate-500 outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded bg-slate-950 border-slate-700 text-cyan-500 focus:ring-0"
                  />
                  Remember workstation token
                </label>
                <span className="text-slate-500 font-mono text-[11px]">
                  TLS 1.3 Encrypted
                </span>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-cyan-900/30 transition-all flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  Authenticate & View Reports
                </button>
              </div>

              {/* Admin Default Credentials Helper Box */}
              <div className="p-3 bg-slate-950/80 border border-cyan-500/20 rounded-xl text-xs space-y-1 text-slate-300">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-cyan-300">Default Chief Admin Credentials:</span>
                  <button
                    type="button"
                    onClick={() => {
                      audioEngine.playClick();
                      setUsernameInput('praveen');
                      setPasswordInput('FalconAdmin@2026');
                    }}
                    className="text-cyan-400 hover:text-cyan-300 font-medium hover:underline text-[11px]"
                  >
                    Auto-Fill Praveen (Admin)
                  </button>
                </div>
                <div className="font-mono text-slate-400 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px]">
                  <span>User: <strong className="text-white">praveen</strong> (or admin)</span>
                  <span>Email: <strong className="text-white">praveen@falconchemicals.com</strong></span>
                </div>
              </div>
            </form>
          )}

          {/* TAB 2: 6-DIGIT OTP TOKEN LOGIN */}
          {activeTab === 'token_login' && (
            <div className="space-y-4">
              {tokenStep === 'request' ? (
                <form onSubmit={handleRequestToken} className="space-y-4">
                  <div className="p-3 bg-cyan-950/30 border border-cyan-500/20 rounded-xl text-xs text-slate-300 space-y-1">
                    <p className="font-semibold text-cyan-300">Zero-Password Token Login</p>
                    <p className="text-slate-400 leading-relaxed">
                      Enter your corporate username or email to receive a secure 6-digit authentication token from <strong>noreply@falconchemicals.com</strong>.
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-slate-300">
                        Username or Corporate Email
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          audioEngine.playClick();
                          setTokenIdentityInput('praveen@falconchemicals.com');
                        }}
                        className="text-[11px] text-cyan-400 hover:underline"
                      >
                        Auto-Fill praveen@falconchemicals.com
                      </button>
                    </div>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={tokenIdentityInput}
                        onChange={(e) => setTokenIdentityInput(e.target.value)}
                        placeholder="e.g. praveen@falconchemicals.com or tariq.mansoor@falconchemicals.com"
                        className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-cyan-900/30 transition-all flex items-center justify-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    Dispatch 6-Digit Login Token
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="p-3 bg-emerald-950/30 border border-emerald-500/30 rounded-xl text-xs text-slate-300 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-emerald-300">Token Dispatched to {pendingOtpUser?.email}</p>
                      <p className="text-slate-400 text-[11px]">Valid for 10 minutes</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {generatedOtpCode && (
                        <button
                          type="button"
                          onClick={() => {
                            audioEngine.playClick();
                            setEnteredOtp(generatedOtpCode);
                          }}
                          className="px-2.5 py-1 bg-emerald-700/60 hover:bg-emerald-600 border border-emerald-500/50 text-emerald-100 rounded text-xs font-semibold shadow transition-colors"
                        >
                          Auto-Paste ({generatedOtpCode})
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          audioEngine.playNotification();
                          onOpenEmailInbox();
                        }}
                        className="px-2.5 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-xs font-semibold shadow transition-colors"
                      >
                        View noreply Inbox
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Enter 6-Digit Token Code
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={enteredOtp}
                      onChange={(e) => setEnteredOtp(e.target.value)}
                      placeholder="8 4 9 2 0 1"
                      className="w-full bg-slate-950 border border-cyan-500/50 focus:border-cyan-400 rounded-xl py-3 text-center text-2xl font-mono tracking-widest text-cyan-300 placeholder-slate-600 outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        audioEngine.playClick();
                        setTokenStep('request');
                      }}
                      className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Verify Token & Access Dashboard
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 3: NEW USER REGISTRATION */}
          {activeTab === 'new_user' && (
            <form onSubmit={handleRegisterRequest} className="space-y-3.5">
              <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-400">
                <p className="font-semibold text-slate-200 mb-1">Corporate Account Provisioning</p>
                Falcon Chemicals administrators create credentials and assign specific report roles (Sales, Inventory, Production, VAT 201, KYC).
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    placeholder="e.g. Tariq Al-Mansoor"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Desired Username
                  </label>
                  <input
                    type="text"
                    required
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    placeholder="e.g. tariq.mansoor"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Corporate Email
                  </label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="name@falconchemicals.com"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Department
                  </label>
                  <select
                    value={regDepartment}
                    onChange={(e) => setRegDepartment(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white outline-none focus:border-cyan-400"
                  >
                    <option value="Commercial Sales">Commercial Sales</option>
                    <option value="Warehouse & Logistics">Warehouse & Logistics</option>
                    <option value="Chemical R&D / QC">Chemical R&D / QC</option>
                    <option value="Plant Manufacturing">Plant Manufacturing</option>
                    <option value="Finance & VAT Compliance">Finance & VAT Compliance</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Required Reports Scope
                </label>
                <input
                  type="text"
                  value={regRequestedAccess}
                  onChange={(e) => setRegRequestedAccess(e.target.value)}
                  placeholder="e.g. Daily Sales, Finished Goods Stock, KYC"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white outline-none focus:border-cyan-400"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-sm rounded-xl shadow transition-all flex items-center justify-center gap-2"
              >
                <User className="w-4 h-4" />
                Submit Provisioning Request
              </button>
            </form>
          )}

          {/* TAB 4: RECOVERY OPTION */}
          {activeTab === 'recovery' && (
            <div className="space-y-4">
              {recoveryStep === 'request' ? (
                <form onSubmit={handleRequestRecovery} className="space-y-4">
                  <div className="p-3 bg-slate-950/60 border border-cyan-500/20 rounded-xl text-xs text-slate-300">
                    <p className="font-semibold text-cyan-300 mb-1">Email Recovery Protocol (KYC.zip specification)</p>
                    <p className="text-slate-400 leading-relaxed">
                      Recovery tokens are dispatched from <strong>noreply@falconchemicals.com</strong> with cryptographic validation.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Registered Corporate Email
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={recoveryEmailInput}
                        onChange={(e) => setRecoveryEmailInput(e.target.value)}
                        placeholder="praveen@falconchemicals.com"
                        className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 text-white font-semibold text-sm rounded-xl shadow transition-all flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Send Verification Code from noreply@
                  </button>
                </form>
              ) : (
                <form onSubmit={handleCompleteReset} className="space-y-3.5">
                  <div className="p-3 bg-cyan-950/40 border border-cyan-500/30 rounded-xl text-xs text-slate-300 flex items-center justify-between">
                    <span>Recovery OTP sent to {pendingOtpUser?.email}</span>
                    <button
                      type="button"
                      onClick={onOpenEmailInbox}
                      className="px-2 py-0.5 bg-cyan-600 text-white rounded text-[11px] font-semibold"
                    >
                      View Inbox
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Enter Recovery OTP Code
                    </label>
                    <input
                      type="text"
                      required
                      value={recoveryOtpInput}
                      onChange={(e) => setRecoveryOtpInput(e.target.value)}
                      placeholder="6-digit code"
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-center text-lg font-mono text-cyan-300 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      required
                      value={newPasswordInput}
                      onChange={(e) => setNewPasswordInput(e.target.value)}
                      placeholder="Enter new password"
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm rounded-xl shadow transition-all"
                  >
                    Confirm & Update Password
                  </button>
                </form>
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Security Gateway: Active</span>
          </div>
          <span className="font-mono text-[11px] text-slate-500">
            Falcon Chemicals LLC • Dubai, UAE
          </span>
        </div>

      </div>
    </div>
  );
};
