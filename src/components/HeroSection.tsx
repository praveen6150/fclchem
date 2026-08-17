import React from 'react';
import { Play, ArrowRight, ShieldCheck, Award, Globe, Factory, Volume2, Lock, KeyRound, Network } from 'lucide-react';
import { COMPANY_INFO } from '../data/falconData';
import { audioEngine } from '../services/audioEngine';

interface Props {
  onOpenPresentation: () => void;
  onOpenPortal: () => void;
  onOpenInquiry: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  currentSimulatedIp: string;
}

export const HeroSection: React.FC<Props> = ({
  onOpenPresentation,
  onOpenPortal,
  onOpenInquiry,
  isMuted,
  onToggleMute,
  currentSimulatedIp
}) => {
  const isOfficeSubnet = currentSimulatedIp.startsWith('192.168.100.');

  return (
    <section id="hero" className="relative bg-slate-950 text-white overflow-hidden py-16 lg:py-24 border-b border-slate-800">
      
      {/* Background Ambience & Gradient */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(6,182,212,0.15),rgba(255,255,255,0))]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Sound & Network Security Prompt Banner */}
        <div className="mb-8 flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-slate-900/90 border border-cyan-500/30 text-cyan-300 text-xs font-mono shadow-xl backdrop-blur-md">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span>AUDIO SYNCED ENGINE • AMBIENT PRESENTATION MODE ACTIVE</span>
            <button
              onClick={() => {
                audioEngine.playClick();
                onToggleMute();
              }}
              className="ml-2 underline font-semibold hover:text-white"
            >
              {isMuted ? 'ENABLE AUDIO' : 'AUDIO ON'}
            </button>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-slate-300 text-xs font-mono">
            <Network className="w-3.5 h-3.5 text-cyan-400" />
            <span>Host Subnet: <strong className={isOfficeSubnet ? 'text-emerald-400' : 'text-amber-400'}>{currentSimulatedIp}</strong></span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Main Hero Copy */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="space-y-2">
              <span className="text-cyan-400 font-mono text-xs font-bold uppercase tracking-widest block">
                DUBAI INDUSTRIAL CITY • ESTABLISHED {COMPANY_INFO.established}
              </span>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
                Corporate Presentation & <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-amber-400">Enterprise Reports Portal</span>
              </h1>
            </div>

            <p className="text-base sm:text-lg text-slate-300 font-sans leading-relaxed max-w-2xl">
              Falcon Chemicals LLC is an industry-leading chemical manufacturing corporation headquartered in Dubai, UAE. Access authorized real-time operational reports, reactor batch logs, UAE VAT tax statements, and commercial client records via our role-based IP security gateway.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              
              {/* Primary: Portal Login */}
              <button
                onClick={() => {
                  audioEngine.playClick();
                  onOpenPortal();
                }}
                onMouseEnter={() => audioEngine.playHover()}
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 text-slate-950 font-extrabold text-sm shadow-xl shadow-cyan-500/20 active:scale-95 transition-all cursor-pointer"
              >
                <ShieldCheck className="w-5 h-5 text-slate-950" />
                <span>Sign In to Reports Portal</span>
              </button>

              {/* Presentation Player */}
              <button
                onClick={() => {
                  audioEngine.playClick();
                  onOpenPresentation();
                }}
                onMouseEnter={() => audioEngine.playHover()}
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-100 font-bold text-sm hover:bg-slate-800 transition-all cursor-pointer"
              >
                <Play className="w-4 h-4 fill-cyan-400 text-cyan-400" />
                <span>Watch Corporate Presentation</span>
              </button>

            </div>

            {/* Credential Callout Box */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-cyan-500/20 text-xs space-y-1 text-slate-300 max-w-xl">
              <div className="flex items-center gap-2 font-semibold text-cyan-300">
                <Lock className="w-3.5 h-3.5" />
                <span>Access Control & Security Policy:</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Admins create usernames & passwords and configure granular report permissions (Sales, Inventory, Reactor Production, VAT 201, KYC). IP boundary enforcement restricts off-site access from outside Office Subnet <strong>192.168.100.0/24</strong> unless specifically authorized.
              </p>
              <div className="pt-1 flex items-center gap-4 text-[11px] font-mono text-cyan-400">
                <span>Default Admin: <strong className="text-white">praveen</strong> (or <strong className="text-white">admin</strong>)</span>
                <span>Email: <strong className="text-white">praveen@falconchemicals.com</strong></span>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Portal Showcase Card */}
          <div className="lg:col-span-5">
            <div className="relative bg-slate-900/90 border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-cyan-500/5 backdrop-blur-md space-y-6">
              
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">Enterprise Reports Gateway</h3>
                    <p className="text-[11px] text-slate-400">Role-Based Access Control</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/30 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  ONLINE
                </span>
              </div>

              {/* Security Features Checklist */}
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex items-start gap-3">
                  <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-medium">Granular Report Permissions</strong>
                    <span className="text-slate-400 text-[11px]">Admin assigns specific access to Sales, Inventory, Production, VAT, and KYC logs.</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex items-start gap-3">
                  <Network className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-medium">Office IP Boundary Enforcement</strong>
                    <span className="text-slate-400 text-[11px]">Restricts unauthorized home/WAN logins outside 192.168.100.0/24 subnet.</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex items-start gap-3">
                  <Award className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-medium">Zero-Password Token OTP via noreply@</strong>
                    <span className="text-slate-400 text-[11px]">Instant 6-digit authentication token dispatched to user corporate email.</span>
                  </div>
                </div>
              </div>

              {/* Quick Launch Button */}
              <button
                onClick={() => {
                  audioEngine.playClick();
                  onOpenPortal();
                }}
                className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-cyan-900/40 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Launch Portal Engine</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
