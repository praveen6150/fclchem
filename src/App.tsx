import React, { useState, useEffect } from 'react';
import { AudioControlsBar } from './components/AudioControlsBar';
import { HeroSection } from './components/HeroSection';
import { AboutCompanySection } from './components/AboutCompanySection';
import { InquirySection } from './components/InquirySection';
import { PresentationModeModal } from './components/PresentationModeModal';
import { PortalAccessModal } from './components/PortalAccessModal';
import { OracleReportsPortal } from './components/OracleReportsPortal';
import { AdminAccessControlPanel } from './components/AdminAccessControlPanel';
import { VirtualEmailModal } from './components/VirtualEmailModal';
import { Footer } from './components/Footer';
import { UserAccount, AuditLogEntry, VirtualEmail } from './types';
import { INITIAL_USERS, INITIAL_AUDIT_LOGS, INITIAL_EMAILS } from './data/usersData';
import { audioEngine } from './services/audioEngine';

// Local storage keys for state persistence
const STORAGE_USERS = 'falcon_chemicals_users_v3';
const STORAGE_LOGS = 'falcon_chemicals_logs_v3';
const STORAGE_EMAILS = 'falcon_chemicals_emails_v3';

export default function App() {
  const [isMuted, setIsMuted] = useState(false);
  const [isAmbientPlaying, setIsAmbientPlaying] = useState(false);
  const [isPresentationOpen, setIsPresentationOpen] = useState(false);
  const [isPortalModalOpen, setIsPortalModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('hero');

  // Application Data & Auth States (with local & server persistence)
  const [users, setUsers] = useState<UserAccount[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_USERS);
      if (saved) {
        const parsed: UserAccount[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Deduplicate admin if multiple admin accounts exist in storage
          const nonAdmins = parsed.filter(u => u.role !== 'admin' && u.username.toLowerCase() !== 'admin' && u.username.toLowerCase() !== 'praveen');
          const adminUser = parsed.find(u => u.role === 'admin' || u.username.toLowerCase() === 'praveen' || u.username.toLowerCase() === 'admin') || INITIAL_USERS[0];
          
          // Return clean single admin + custom created users (without reviving deleted users)
          return [{ ...adminUser, username: 'praveen', fullName: 'Praveen (Chief Admin)', email: 'praveen@falconchemicals.com', role: 'admin' as const }, ...nonAdmins];
        }
      }
    } catch (e) {
      console.warn('Could not parse saved users, falling back to initial.', e);
    }
    return INITIAL_USERS;
  });

  // Fetch persisted users from server on mount
  useEffect(() => {
    const fetchServerUsers = async () => {
      try {
        const isProduction = window.location.hostname === 'kyc.falconchemicals.com' || window.location.port === '';
        const endpoint = isProduction ? '/users_api.php' : '/api/users';
        const res = await fetch(endpoint);
        if (res.ok) {
          const data = await res.json();
          if (data && Array.isArray(data.users) && data.users.length > 0) {
            setUsers(data.users);
          }
        }
      } catch (err) {
        console.warn('[Falcon Users] Note: Local storage persistence active:', err);
      }
    };
    fetchServerUsers();
  }, []);

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
  
  // Current Session & View navigation - Default to main website presentation
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [isOracleReportsPortalOpen, setIsOracleReportsPortalOpen] = useState(false);

  // Simulated Host Network IP (Office 192.168.100.45 vs WAN 86.96.12.114)
  const [currentSimulatedIp, setCurrentSimulatedIp] = useState<string>('192.168.100.45');

  // Persist changes to localStorage and sync to server endpoint
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_USERS, JSON.stringify(users));
      
      // Background sync to server users_store.json
      const isProduction = window.location.hostname === 'kyc.falconchemicals.com' || window.location.port === '';
      const endpoint = isProduction ? '/users_api.php' : '/api/users';
      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ users })
      }).catch(() => {});
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
    setIsOracleReportsPortalOpen(true);
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

  // Direct access to Oracle Reports Menu (192.168.100.202:8080) - Enforces 192.168.100.202 Verification
  const handleOpenOraclePortal = () => {
    audioEngine.playClick();
    if (!currentUser) {
      // Require verification through portal gateway 192.168.100.202 first
      setIsPortalModalOpen(true);
      return;
    }
    setIsOracleReportsPortalOpen(true);
    setIsAdminPanelOpen(false);
  };

  const unreadEmailCount = virtualEmails.filter(e => !e.isRead).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-cyan-500 selection:text-slate-950">
      
      {/* 1. IF CURRENT USER IS LOGGED IN AND IN PORTAL VIEW */}
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
      ) : currentUser && isAdminPanelOpen && currentUser.role === 'admin' ? (
        <AdminAccessControlPanel
          users={users}
          auditLogs={auditLogs}
          currentSimulatedIp={currentSimulatedIp}
          onUpdateUsers={handleUpdateUsers}
          onAddAuditLog={handleAddAuditLog}
          onSendVirtualEmail={handleSendVirtualEmail}
          onReturnToReports={() => {
            setIsAdminPanelOpen(false);
            setIsOracleReportsPortalOpen(true);
          }}
          onOpenEmailInbox={() => setIsEmailModalOpen(true)}
          onOpenOraclePortal={() => {
            setIsAdminPanelOpen(false);
            setIsOracleReportsPortalOpen(true);
          }}
        />
      ) : (
        /* 2. CORPORATE PRESENTATION WEBSITE (ACCESSIBLE TO GUESTS AND LOGGED-IN USERS) */
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
        onUpdateUsers={setUsers}
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
