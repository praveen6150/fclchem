import React, { useState, useEffect } from 'react';
import { AudioControlsBar } from './components/AudioControlsBar';
import { HeroSection } from './components/HeroSection';
import { AboutCompanySection } from './components/AboutCompanySection';
import { InquirySection } from './components/InquirySection';
import { PresentationModeModal } from './components/PresentationModeModal';
import { PortalAccessModal } from './components/PortalAccessModal';
import { ReportsDashboard } from './components/ReportsDashboard';
import { AdminAccessControlPanel } from './components/AdminAccessControlPanel';
import { VirtualEmailModal } from './components/VirtualEmailModal';
import { Footer } from './components/Footer';
import { UserAccount, AuditLogEntry, VirtualEmail } from './types';
import { INITIAL_USERS, INITIAL_AUDIT_LOGS, INITIAL_EMAILS } from './data/usersData';
import { audioEngine } from './services/audioEngine';

export default function App() {
  const [isMuted, setIsMuted] = useState(false);
  const [isAmbientPlaying, setIsAmbientPlaying] = useState(false);
  const [isPresentationOpen, setIsPresentationOpen] = useState(false);
  const [isPortalModalOpen, setIsPortalModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('hero');

  // Application Data & Auth States
  const [users, setUsers] = useState<UserAccount[]>(INITIAL_USERS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const [virtualEmails, setVirtualEmails] = useState<VirtualEmail[]>(INITIAL_EMAILS);
  
  // Current Session
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);

  // Simulated Host Network IP (Office 192.168.100.45 vs WAN 86.96.12.114)
  const [currentSimulatedIp, setCurrentSimulatedIp] = useState<string>('192.168.100.45');

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
  };

  const handleSendVirtualEmail = (email: VirtualEmail) => {
    setVirtualEmails(prev => [email, ...prev]);
  };

  const handleAddAuditLog = (log: AuditLogEntry) => {
    setAuditLogs(prev => [log, ...prev]);
  };

  const unreadEmailCount = virtualEmails.filter(e => !e.isRead).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-cyan-500 selection:text-slate-950">
      
      {/* If User is Logged In: Show Admin Panel OR Reports Dashboard */}
      {currentUser ? (
        isAdminPanelOpen && currentUser.role === 'admin' ? (
          <AdminAccessControlPanel
            users={users}
            auditLogs={auditLogs}
            currentSimulatedIp={currentSimulatedIp}
            onUpdateUsers={setUsers}
            onAddAuditLog={handleAddAuditLog}
            onSendVirtualEmail={handleSendVirtualEmail}
            onReturnToReports={() => setIsAdminPanelOpen(false)}
            onOpenEmailInbox={() => setIsEmailModalOpen(true)}
          />
        ) : (
          <ReportsDashboard
            currentUser={currentUser}
            currentSimulatedIp={currentSimulatedIp}
            onOpenAdminPanel={currentUser.role === 'admin' ? () => setIsAdminPanelOpen(true) : undefined}
            onLogout={handleLogout}
            onOpenEmailInbox={() => setIsEmailModalOpen(true)}
          />
        )
      ) : (
        /* Public Presentation Website View */
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
