import React, { useState } from 'react';
import { UserAccount, VirtualEmail, AuditLogEntry } from '../types';
import { checkIpSubnetMatch } from '../data/usersData';
import { FalconLogo } from './FalconLogo';
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
  Building2,
  Globe2,
  Eye,
  EyeOff,
  Send
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
  onOpenEmailInbox?: () => void;
}

type TabType = 'signin' | 'token_login' | 'new_user' | 'recovery';

// Helper to look up user account with comprehensive alias matching (admin, praveen, email, etc.)
export const lookupUserAccount = (identity: string, userList: UserAccount[]): UserAccount | undefined => {
  const clean = identity.trim().toLowerCase();
  if (!clean) return undefined;

  // 1. Direct username or email match
  const directMatch = userList.find(
    u => u.username.toLowerCase() === clean || u.email.toLowerCase() === clean
  );
  if (directMatch) return directMatch;

  // 2. Admin / Praveen aliases
  if (
    clean === 'admin' || 
    clean === 'praveen' || 
    clean === 'admin@falconchemicals.com' || 
    clean === 'praveen@falconchemicals.com' ||
    clean === 'praveen6150@gmail.com' ||
    clean.startsWith('admin') ||
    clean.startsWith('praveen')
  ) {
    return userList.find(u => u.role === 'admin' || u.username === 'admin' || u.username === 'praveen') || userList[0];
  }

  // 3. Fallback partial username match
  return userList.find(u => u.username.toLowerCase().includes(clean) || u.fullName.toLowerCase().includes(clean));
};

export const PortalAccessModal: React.FC<PortalAccessModalProps> = ({
  isOpen,
  onClose,
  users,
  currentSimulatedIp,
  onUpdateSimulatedIp,
  onLoginSuccess,
  onSendVirtualEmail,
  onAddAuditLog
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('signin');
  
  // Sign In Form States
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // OTP Token Login States
  const [tokenIdentityInput, setTokenIdentityInput] = useState('');
  const [tokenStep, setTokenStep] = useState<'request' | 'verify'>('request');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [pendingOtpUser, setPendingOtpUser] = useState<UserAccount | null>(null);
  const [activeOtpCode, setActiveOtpCode] = useState<string | null>(null);

  // Recovery Form States
  const [recoveryEmailInput, setRecoveryEmailInput] = useState('');
  const [recoveryStep, setRecoveryStep] = useState<'request' | 'verify_reset'>('request');
  const [recoveryOtpInput, setRecoveryOtpInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [activeRecoveryCode, setActiveRecoveryCode] = useState<string | null>(null);

  // New User Request States
  const [regFullName, setRegFullName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regDepartment, setRegDepartment] = useState('Commercial Sales');
  const [regRequestedAccess, setRegRequestedAccess] = useState('Sales & Dispatch Reports');

  if (!isOpen) return null;

  const isOfficeSubnet = currentSimulatedIp.startsWith('192.168.100.');

  // Dispatches email to both local memory store and backend server API for real SMTP delivery
  const dispatchEmailWithServerRelay = async (email: VirtualEmail) => {
    onSendVirtualEmail(email);
    try {
      // Direct routing: In production (live server), use native PHP gateway. In dev sandbox, use Express API
      const isProduction = window.location.hostname === 'kyc.falconchemicals.com' || window.location.port === '';
      const endpoint = isProduction ? '/send_otp.php' : '/api/send-email';

      await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: email.to,
          subject: email.subject,
          bodyText: email.bodyText,
          otpCode: email.otpCode,
          type: email.type
        })
      });
    } catch (err) {
      console.warn('[Falcon Portal] Real SMTP background relay notice:', err);
    }
  };

  // Handle Standard Password Login
  const handlePasswordSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    const user = lookupUserAccount(usernameInput, users);

    if (!user) {
      audioEngine.playError();
      setErrorMessage('Authentication Failed: Invalid username or corporate email.');
      onAddAuditLog({
        id: `log_${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        username: usernameInput || 'unknown',
        email: '',
        action: 'LOGIN_FAILED_CREDENTIALS',
        ipAddress: currentSimulatedIp,
        ipLocationType: currentSimulatedIp.startsWith('192.168.100.') ? 'Office LAN (192.168.100.0/24)' : 'External Internet / Home WAN',
        details: `Failed authentication attempt for identity "${usernameInput}"`,
        status: 'DENIED'
      });
      setIsSubmitting(false);
      return;
    }

    // Check Password
    if (user.password !== passwordInput) {
      audioEngine.playError();
      setErrorMessage('Authentication Failed: Incorrect password provided.');
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
      setIsSubmitting(false);
      return;
    }

    // Check IP Subnet Access Control Policy (192.168.100.0/24 enforcement)
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
        bodyText: `Security Policy Violation Detected:\n\nUser: ${user.fullName} (${user.username})\nAttempted IP: ${currentSimulatedIp}\nRequired Subnet: 192.168.100.0/24 (Office LAN)\nTime: ${new Date().toLocaleString()}\n\nThe access request was blocked at 192.168.100.202 gateway.`,
        type: 'ip_security_alert',
        isRead: false
      };
      await dispatchEmailWithServerRelay(alertEmail);

      onAddAuditLog({
        id: `log_${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        username: user.username,
        email: user.email,
        action: 'LOGIN_BLOCKED_IP',
        ipAddress: currentSimulatedIp,
        ipLocationType: 'External Internet / Home WAN',
        details: `Access Blocked: Policy set to Office Subnet (192.168.100.0/24). Attempted IP: ${currentSimulatedIp}`,
        status: 'DENIED'
      });
      setIsSubmitting(false);
      return;
    }

    // Check if user requires 2FA token (like admin / praveen with password_plus_token)
    if (user.authMethod === 'token_otp' || user.authMethod === 'password_plus_token') {
      audioEngine.playNotification();
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      setActiveOtpCode(otp);
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
        bodyText: `Dear ${user.fullName},\n\nYour 6-digit authentication token for Falcon Chemicals Enterprise Reports is:\n\n${otp}\n\nThis token is valid for 10 minutes from gateway IP: ${currentSimulatedIp}.\n\nFalcon Chemicals IT Department - Dubai Industrial City`,
        type: 'otp_login',
        isRead: false
      };
      await dispatchEmailWithServerRelay(otpEmail);

      onAddAuditLog({
        id: `log_${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        username: user.username,
        email: user.email,
        action: 'OTP_SENT',
        ipAddress: currentSimulatedIp,
        ipLocationType: currentSimulatedIp.startsWith('192.168.100.') ? 'Office LAN (192.168.100.0/24)' : 'External Internet / Home WAN',
        details: `6-Digit authentication token dispatched to ${user.email}`,
        status: 'SUCCESS'
      });
      setIsSubmitting(false);
      return;
    }

    // Successful Password Login
    audioEngine.playSuccess();
    onAddAuditLog({
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      username: user.username,
      email: user.email,
      action: 'LOGIN_SUCCESS',
      ipAddress: currentSimulatedIp,
      ipLocationType: currentSimulatedIp.startsWith('192.168.100.') ? 'Office LAN (192.168.100.0/24)' : 'External Internet / Home WAN',
      details: `Successful gateway verification at 192.168.100.202. Role: ${user.role}.`,
      status: 'SUCCESS'
    });
    setIsSubmitting(false);
    onLoginSuccess(user);
  };

  // Handle Requesting 6-Digit OTP Token
  const handleRequestToken = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    const user = lookupUserAccount(tokenIdentityInput, users);

    if (!user) {
      audioEngine.playError();
      setErrorMessage('User account not found. Please verify your corporate email or contact the IT Department.');
      setIsSubmitting(false);
      return;
    }

    // IP validation check
    const ipCheck = checkIpSubnetMatch(currentSimulatedIp, user.ipPolicy, user.customAllowedSubnet);
    if (!ipCheck.allowed) {
      audioEngine.playError();
      setErrorMessage(ipCheck.reason);
      setIsSubmitting(false);
      return;
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setActiveOtpCode(otp);
    setPendingOtpUser(user);
    setTokenStep('verify');

    const otpEmail: VirtualEmail = {
      id: `eml_${Date.now()}`,
      from: 'noreply@falconchemicals.com',
      to: user.email,
      subject: 'Falcon Portal: Your 6-Digit Secure Login Token',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      otpCode: otp,
      bodyText: `Dear ${user.fullName},\n\nYour 6-digit authentication token for Falcon Chemicals Enterprise Reports is:\n\n${otp}\n\nThis token is valid for 10 minutes.\n\nFalcon Chemicals IT Department - Dubai Industrial City`,
      type: 'otp_login',
      isRead: false
    };
    await dispatchEmailWithServerRelay(otpEmail);

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
    setIsSubmitting(false);
  };

  // Handle Verifying OTP
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!pendingOtpUser || !activeOtpCode) {
      setErrorMessage('Token session expired. Please request a new token.');
      setTokenStep('request');
      return;
    }

    if (enteredOtp.trim() !== activeOtpCode.trim()) {
      audioEngine.playError();
      setErrorMessage('Invalid 6-digit authentication token. Please check the code sent to your email.');
      onAddAuditLog({
        id: `log_${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        username: pendingOtpUser.username,
        email: pendingOtpUser.email,
        action: 'OTP_FAILED',
        ipAddress: currentSimulatedIp,
        ipLocationType: currentSimulatedIp.startsWith('192.168.100.') ? 'Office LAN (192.168.100.0/24)' : 'External Internet / Home WAN',
        details: `Invalid OTP entered for ${pendingOtpUser.username}`,
        status: 'DENIED'
      });
      return;
    }

    // IP validation check
    const ipCheck = checkIpSubnetMatch(currentSimulatedIp, pendingOtpUser.ipPolicy, pendingOtpUser.customAllowedSubnet);
    if (!ipCheck.allowed) {
      audioEngine.playError();
      setErrorMessage(ipCheck.reason);
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
      details: `OTP authentication verified successfully at 192.168.100.202. Role: ${pendingOtpUser.role}`,
      status: 'SUCCESS'
    });
    onLoginSuccess(pendingOtpUser);
  };

  // Handle Requesting Password Recovery
  const handleRequestRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    const user = lookupUserAccount(recoveryEmailInput, users);
    if (!user) {
      audioEngine.playError();
      setErrorMessage('No account found registered to this corporate email address.');
      setIsSubmitting(false);
      return;
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setActiveRecoveryCode(otp);
    setPendingOtpUser(user);
    setRecoveryStep('verify_reset');

    const recoveryEmail: VirtualEmail = {
      id: `eml_${Date.now()}`,
      from: 'noreply@falconchemicals.com',
      to: user.email,
      subject: 'Falcon Portal: Password Reset Verification Code',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      otpCode: otp,
      bodyText: `Dear ${user.fullName},\n\nWe received a password reset request for your account.\n\nYour 6-digit verification code is:\n\n${otp}\n\nEnter this code on the portal to reset your password.\n\nFalcon Chemicals IT Security`,
      type: 'password_recovery',
      isRead: false
    };
    await dispatchEmailWithServerRelay(recoveryEmail);
    setIsSubmitting(false);
  };

  // Handle Password Reset Completion
  const handleCompleteReset = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!pendingOtpUser || !activeRecoveryCode) {
      setErrorMessage('Reset session expired. Please start over.');
      setRecoveryStep('request');
      return;
    }

    if (recoveryOtpInput.trim() !== activeRecoveryCode.trim()) {
      audioEngine.playError();
      setErrorMessage('Incorrect verification code. Please check your email.');
      return;
    }

    if (newPasswordInput.length < 6) {
      setErrorMessage('Password must contain at least 6 characters.');
      return;
    }

    // Update user password in memory
    pendingOtpUser.password = newPasswordInput;
    audioEngine.playSuccess();
    setSuccessMessage('Password reset successfully. You may now sign in with your new credentials.');
    setActiveTab('signin');
    setUsernameInput(pendingOtpUser.username);
    setPasswordInput('');
    setRecoveryStep('request');
  };

  // Handle New User Provisioning Submission
  const handleRegisterRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    const exists = users.some(u => u.username.toLowerCase() === regUsername.trim().toLowerCase() || u.email.toLowerCase() === regEmail.trim().toLowerCase());
    if (exists) {
      setErrorMessage('Username or email already registered in system.');
      setIsSubmitting(false);
      return;
    }

    const regEmailObj: VirtualEmail = {
      id: `eml_${Date.now()}`,
      from: 'noreply@falconchemicals.com',
      to: 'praveen@falconchemicals.com',
      subject: `New Account Provisioning Request: ${regFullName}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      bodyText: `New User Provisioning Request:\n\nFull Name: ${regFullName}\nUsername: ${regUsername}\nEmail: ${regEmail}\nDepartment: ${regDepartment}\nRequested Reports: ${regRequestedAccess}\nClient IP: ${currentSimulatedIp}\n\nPlease review in Admin Access Control & RBAC Engine.`,
      type: 'account_created',
      isRead: false
    };
    await dispatchEmailWithServerRelay(regEmailObj);

    audioEngine.playSuccess();
    setSuccessMessage('Provisioning request sent to Chief Administrator (Praveen). You will receive credentials once approved.');
    setRegFullName('');
    setRegUsername('');
    setRegEmail('');
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-cyan-500/30 rounded-3xl w-full max-w-xl shadow-2xl shadow-cyan-500/10 flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Header with Falcon Logo & Gateway Host */}
        <div className="p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FalconLogo size="md" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-white text-base tracking-wide">
                  FALCON CHEMICALS LLC
                </h3>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/30 rounded-full">
                  192.168.100.202
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Enterprise Reports & Access Gateway • Dubai Industrial City
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

        {/* IP Security Banner */}
        <div className="px-5 py-2.5 bg-slate-950/70 border-b border-slate-800/80 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            <Network className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400">Client Host:</span>
            <strong className={isOfficeSubnet ? 'text-emerald-400' : 'text-amber-400'}>
              {currentSimulatedIp}
            </strong>
          </div>
          <span className={`text-[11px] px-2 py-0.5 rounded ${isOfficeSubnet ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30' : 'bg-amber-950/60 text-amber-300 border border-amber-500/30'}`}>
            {isOfficeSubnet ? 'Office LAN Subnet (Authorized)' : 'External Network / WAN'}
          </span>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-900/90 px-4">
          <button
            onClick={() => {
              audioEngine.playClick();
              setActiveTab('signin');
              setErrorMessage(null);
              setSuccessMessage(null);
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
              setSuccessMessage(null);
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
              setSuccessMessage(null);
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
              setSuccessMessage(null);
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
                    placeholder="e.g. admin or praveen"
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

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-cyan-900/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Lock className="w-4 h-4" />
                  {isSubmitting ? 'Verifying Gateway...' : 'Verify Gateway Access & View Reports'}
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: 6-DIGIT OTP TOKEN LOGIN */}
          {activeTab === 'token_login' && (
            <div className="space-y-4">
              {tokenStep === 'request' ? (
                <form onSubmit={handleRequestToken} className="space-y-4">
                  <div className="p-3 bg-cyan-950/30 border border-cyan-500/20 rounded-xl text-xs text-slate-300 space-y-1">
                    <p className="font-semibold text-cyan-300">Corporate Token Authentication</p>
                    <p className="text-slate-400 leading-relaxed">
                      Enter your corporate username (e.g. <strong>admin</strong>, <strong>praveen</strong>) or email to receive a secure 6-digit one-time token from <strong>noreply@falconchemicals.com</strong>.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Corporate Username or Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={tokenIdentityInput}
                        onChange={(e) => setTokenIdentityInput(e.target.value)}
                        placeholder="e.g. admin or praveen@falconchemicals.com"
                        className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-cyan-900/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    {isSubmitting ? 'Dispatching Token...' : 'Dispatch 6-Digit Authentication Token'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="p-3.5 bg-cyan-950/40 border border-cyan-500/30 rounded-xl text-xs text-slate-300 space-y-1">
                    <div className="flex items-center gap-2 text-cyan-300 font-semibold">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Security Token Dispatched</span>
                    </div>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      A 6-digit one-time security token has been securely dispatched from <strong>noreply@falconchemicals.com</strong> to your registered corporate email (<strong className="text-cyan-300">{pendingOtpUser?.email}</strong>).
                    </p>
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
                      placeholder="• • • • • •"
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
                      className="flex-1 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-cyan-900/30 cursor-pointer"
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
                  placeholder="e.g. Daily Sales & Dispatch, Finished Goods Stock, Reactor Logs"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white outline-none focus:border-cyan-400"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-sm rounded-xl shadow transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <User className="w-4 h-4" />
                {isSubmitting ? 'Submitting Request...' : 'Submit Provisioning Request'}
              </button>
            </form>
          )}

          {/* TAB 4: RECOVERY OPTION */}
          {activeTab === 'recovery' && (
            <div className="space-y-4">
              {recoveryStep === 'request' ? (
                <form onSubmit={handleRequestRecovery} className="space-y-4">
                  <div className="p-3 bg-slate-950/60 border border-cyan-500/20 rounded-xl text-xs text-slate-300">
                    <p className="font-semibold text-cyan-300 mb-1">Corporate Recovery Protocol</p>
                    <p className="text-slate-400 leading-relaxed">
                      Recovery tokens are dispatched from <strong>noreply@falconchemicals.com</strong> with cryptographic validation.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Registered Corporate Email or Username
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={recoveryEmailInput}
                        onChange={(e) => setRecoveryEmailInput(e.target.value)}
                        placeholder="e.g. admin or praveen@falconchemicals.com"
                        className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 text-white font-semibold text-sm rounded-xl shadow transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className="w-4 h-4" />
                    {isSubmitting ? 'Sending Code...' : 'Send Verification Code from noreply@'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleCompleteReset} className="space-y-3.5">
                  <div className="p-3 bg-cyan-950/40 border border-cyan-500/30 rounded-xl text-xs text-slate-300">
                    <p className="font-semibold text-cyan-300">Verification Code Dispatched</p>
                    <p className="text-slate-400 text-[11px]">Enter the 6-digit recovery code sent to your registered email.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Enter Recovery Code
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
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm rounded-xl shadow transition-all cursor-pointer"
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
