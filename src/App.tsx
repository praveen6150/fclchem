import React, { useState, useEffect } from 'react';
import { AudioControlsBar } from './components/AudioControlsBar';
import { HeroSection } from './components/HeroSection';
import { AboutCompanySection } from './components/AboutCompanySection';
import { InquirySection } from './components/InquirySection';
import { PresentationModeModal } from './components/PresentationModeModal';
import { PortalAccessModal } from './components/PortalAccessModal';
import { ReportsDashboard } from './components/ReportsDashboard';
import { OracleReportsPortal } from './components/OracleReportsPortal';
import { AdminAccessControlPanel } from './components/AdminAccessControlPanel';
import { VirtualEmailModal } from './components/VirtualEmailModal';
import { Footer } from './components/Footer';
import { UserAccount, AuditLogEntry, VirtualEmail } from './types';
import { INITIAL_USERS, INITIAL_AUDIT_LOGS, INITIAL_EMAILS } from './data/usersData';
import { audioEngine } from './services/audioEngine';

// Local storage keys for state persistence
const STORAGE_USERS = 'falcon_chemicals_users_v2';
const STORAGE_LOGS = 'falcon_chemicals_logs_v2';
const STORAGE_EMAILS = 'falcon_chemicals_emails_v2';

export default function App() {
  const [isMuted, setIsMuted] = useState(false);
  const [isAmbientPlaying, setIsAmbientPlaying] = useState(false);
  const [isPresentationOpen, setIsPresentationOpen] = useState(false);
  const [isPortalModalOpen, setIsPortalModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('hero');

  // Application Data & Auth States (with local persistence)
  const [users, setUsers] = useState<UserAccount[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_USERS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Could not parse saved users, falling back to initial.', e);
    }
    return INITIAL_USERS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_LOGS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Could not parse saved audit logs, falling back to initial.', e);
    }
    return INITIAL_AUDIT_LOGS;
  });

  const [virtualEmails, setVirtualEmails] = useState<VirtualEmail[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_EMAILS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Could not parse saved emails, falling back to initial.', e);
    }
    return INITIAL_EMAILS;
  });
  
  // Current Session & View navigation
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [isOracleReportsPortalOpen, setIsOracleReportsPortalOpen] = useState(false);

  // Simulated Host Network IP (Office 192.168.100.45 vs WAN 86.96.12.114)
  const [currentSimulatedIp, setCurrentSimulatedIp] = useState<string>('192.168.100.45');

  // Persist changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_USERS, JSON.stringify(users));
    } catch (e) {
      console.warn('Error saving users to storage', e);
    }
  }, [users]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_LOGS, JSON.stringify(auditLogs));
    } catch (e) {
      console.warn('Error saving logs to storage', e);
    }
  }, [auditLogs]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_EMAILS, JSON.stringify(virtualEmails));
    } catch (e) {
      console.warn('Error saving emails to storage', e);
    }
  }, [virtualEmails]);

  // Resume Web Audio API context on first user click anywhere in document
  useEffect(() => {
    const handleFirstUserGesture = () => {
      audioEngine.ensureContext();
      window.removeEventListener('click', handleFirstUserGesture);
    };
    window.addEventListener('click', handleFirstUserGesture);
    return () => window.removeEventListener('click', handleFirstUserGesture);
  }, []);

  // Sync Mute state with audioEngine
  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    audioEngine.setMute(nextMuted);
  };

  // Sync Ambient soundtrack state
  const handleToggleAmbient = () => {
    if (isAmbientPlaying) {
      audioEngine.stopAmbientPad();
      setIsAmbientPlaying(false);
    } else {
      audioEngine.startAmbientPad();
      setIsAmbientPlaying(true);
    }
  };

  const handleNavigateSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleToggleSimulatedIp = () => {
    const nextIp = currentSimulatedIp.startsWith('192.168.100.') ? '86.96.12.114' : '192.168.100.45';
    setCurrentSimulatedIp(nextIp);
  };

  const handleLoginSuccess = (user: UserAccount) => {
    setCurrentUser(user);
    setIsPortalModalOpen(false);
    // Update user's last login
    const updated = users.map(u => u.id === user.id ? {
      ...u,
      lastLogin: new Date().toISOString().replace('T', ' ').substring(0, 19),
      lastLoginIp: currentSimulatedIp
    } : u);
    setUsers(updated);
  };

  const handleLogout = () => {
    if (currentUser) {
      handleAddAuditLog({
        id: `log_${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        username: currentUser.username,
        email: currentUser.email,
        action: 'POLICY_UPDATED',
        ipAddress: currentSimulatedIp,
        ipLocationType: currentSimulatedIp.startsWith('192.168.100.') ? 'Office LAN (192.168.100.0/24)' : 'External Internet / Home WAN',
        details: `User "${currentUser.username}" signed out from session.`,
        status: 'SUCCESS'
      });
    }
    setCurrentUser(null);
    setIsAdminPanelOpen(false);
    setIsOracleReportsPortalOpen(false);
  };

  const handleUpdateUsers = (newUsers: UserAccount[]) => {
    setUsers(newUsers);
    // If current user was edited, update active session state as well
    if (currentUser) {
      const refreshed = newUsers.find(u => u.id === currentUser.id);
      if (refreshed) {
        setCurrentUser(refreshed);
      }
    }
  };

  const handleSendVirtualEmail = (email: VirtualEmail) => {
    setVirtualEmails(prev => [email, ...prev]);
  };

  const handleAddAuditLog = (log: AuditLogEntry) => {
    setAuditLogs(prev => [log, ...prev]);
  };

  // Direct access to Oracle Reports Menu (192.168.100.202:8080)
  const handleOpenOraclePortal = () => {
    audioEngine.playClick();
    if (!currentUser) {
      // If not logged in, prompt login first or authenticate as praveen by default for demo
      const defaultUser = users.find(u => u.username === 'praveen') || users[0];
      setCurrentUser(defaultUser);
    }
    setIsOracleReportsPortalOpen(true);
    setIsAdminPanelOpen(false);
  };

  const unreadEmailCount = virtualEmails.filter(e => !e.isRead).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-cyan-500 selection:text-slate-950">
      
      {/* 1. IF CURRENT USER IS IN ORACLE REPORTS PORTAL (192.168.100.202:8080) */}
      {currentUser && isOracleReportsPortalOpen ? (
        <OracleReportsPortal
          currentUser={currentUser}
          currentSimulatedIp={currentSimulatedIp}
          onLogout={handleLogout}
          onOpenAdminPanel={currentUser.role === 'admin' ? () => {
            setIsOracleReportsPortalOpen(false);
            setIsAdminPanelOpen(true);
          } : undefined}
          onReturnToPresentation={() => setIsOracleReportsPortalOpen(false)}
          onToggleSimulatedIp={handleToggleSimulatedIp}
        />
      ) : currentUser ? (
        /* 2. IF CURRENT USER IS IN ADMIN RBAC CONTROL PANEL OR OPERATIONS HUB */
        isAdminPanelOpen && currentUser.role === 'admin' ? (
          <AdminAccessControlPanel
            users={users}
            auditLogs={auditLogs}
            currentSimulatedIp={currentSimulatedIp}
            onUpdateUsers={handleUpdateUsers}
            onAddAuditLog={handleAddAuditLog}
            onSendVirtualEmail={handleSendVirtualEmail}
            onReturnToReports={() => setIsAdminPanelOpen(false)}
            onOpenEmailInbox={() => setIsEmailModalOpen(true)}
            onOpenOraclePortal={() => {
              setIsAdminPanelOpen(false);
              setIsOracleReportsPortalOpen(true);
            }}
          />
        ) : (
          <ReportsDashboard
            currentUser={currentUser}
            currentSimulatedIp={currentSimulatedIp}
            onOpenAdminPanel={currentUser.role === 'admin' ? () => setIsAdminPanelOpen(true) : undefined}
            onLogout={handleLogout}
            onOpenEmailInbox={() => setIsEmailModalOpen(true)}
            onOpenOraclePortal={() => setIsOracleReportsPortalOpen(true)}
          />
        )
      ) : (
        /* 3. PUBLIC CORPORATE PRESENTATION WEBSITE */
        <>
          {/* Sticky Audio & Controls Header */}
          <AudioControlsBar
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
            isAmbientPlaying={isAmbientPlaying}
            onToggleAmbient={handleToggleAmbient}
            onOpenPresentation={() => setIsPresentationOpen(true)}
            onOpenPortal={() => setIsPortalModalOpen(true)}
            onOpenEmailInbox={() => setIsEmailModalOpen(true)}
            onOpenOraclePortal={handleOpenOraclePortal}
            currentSimulatedIp={currentSimulatedIp}
            onToggleSimulatedIp={handleToggleSimulatedIp}
            onNavigateSection={handleNavigateSection}
            activeSection={activeSection}
            unreadEmailCount={unreadEmailCount}
          />

          {/* Hero Presentation Banner */}
          <HeroSection
            onOpenPresentation={() => setIsPresentationOpen(true)}
            onOpenPortal={() => setIsPortalModalOpen(true)}
            onOpenInquiry={() => handleNavigateSection('contact')}
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
            currentSimulatedIp={currentSimulatedIp}
          />

          {/* About Falcon Chemicals Section */}
          <AboutCompanySection />

          {/* Quote & Contact Inquiry Form */}
          <InquirySection />

          {/* Footer */}
          <Footer
            onNavigateSection={handleNavigateSection}
            onOpenPresentation={() => setIsPresentationOpen(true)}
            onOpenPortal={() => setIsPortalModalOpen(true)}
          />
        </>
      )}

      {/* Portal Login & Access Engine Modal */}
      <PortalAccessModal
        isOpen={isPortalModalOpen}
        onClose={() => setIsPortalModalOpen(false)}
        users={users}
        currentSimulatedIp={currentSimulatedIp}
        onUpdateSimulatedIp={setCurrentSimulatedIp}
        onLoginSuccess={handleLoginSuccess}
        onSendVirtualEmail={handleSendVirtualEmail}
        onAddAuditLog={handleAddAuditLog}
        onOpenEmailInbox={() => setIsEmailModalOpen(true)}
      />

      {/* Full-Screen YouTube Style Video Presentation Modal */}
      <PresentationModeModal
        isOpen={isPresentationOpen}
        onClose={() => setIsPresentationOpen(false)}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
      />

      {/* Virtual Email Inbox (noreply@falconchemicals.com) */}
      <VirtualEmailModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        emails={virtualEmails}
      />

    </div>
  );
}
