import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Radio, Play, Sliders, ShieldCheck, Network, Building2, Globe2 } from 'lucide-react';
import { audioEngine } from '../services/audioEngine';
import { COMPANY_INFO } from '../data/falconData';
import { FalconLogo } from './FalconLogo';

interface Props {
  isMuted: boolean;
  onToggleMute: () => void;
  isAmbientPlaying: boolean;
  onToggleAmbient: () => void;
  onOpenPresentation: () => void;
  onOpenPortal: () => void;
  onOpenEmailInbox?: () => void;
  onOpenOraclePortal?: () => void;
  currentSimulatedIp: string;
  onToggleSimulatedIp: () => void;
  onNavigateSection: (sectionId: string) => void;
  activeSection: string;
  unreadEmailCount?: number;
}

export const AudioControlsBar: React.FC<Props> = ({
  isMuted,
  onToggleMute,
  isAmbientPlaying,
  onToggleAmbient,
  onOpenPresentation,
  onOpenPortal,
  onOpenOraclePortal,
  currentSimulatedIp,
  onToggleSimulatedIp,
  onNavigateSection,
  activeSection
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const isOfficeSubnet = currentSimulatedIp.startsWith('192.168.100.');

  // Audio spectrum visualizer canvas loop
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      animId = requestAnimationFrame(render);
      const data = audioEngine.getAnalyserData();
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = 3;
      const gap = 2;
      const numBars = 12;
      const startX = (canvas.width - (numBars * (barWidth + gap))) / 2;

      for (let i = 0; i < numBars; i++) {
        const val = data[i * 2] || 0;
        const barHeight = isMuted ? 2 : Math.max(2, (val / 255) * (canvas.height - 2));

        const x = startX + i * (barWidth + gap);
        const y = canvas.height - barHeight;

        const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
        gradient.addColorStop(0, '#06B6D4'); // Cyan
        gradient.addColorStop(1, '#F59E0B'); // Amber gold

        ctx.fillStyle = isMuted ? '#475569' : gradient;
        ctx.fillRect(x, y, barWidth, barHeight);
      }
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [isMuted]);

  const handleMuteClick = () => {
    audioEngine.playClick();
    onToggleMute();
  };

  const handleAmbientClick = () => {
    audioEngine.playClick();
    onToggleAmbient();
  };

  const navItems = [
    { id: 'hero', label: 'Overview' },
    { id: 'about', label: 'Corporate Profile' },
    { id: 'contact', label: 'Commercial Contact' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Brand & Live Audio Wave */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigateSection('hero')}
              className="flex items-center gap-2.5 text-left group"
            >
              <FalconLogo size="sm" />
              <div>
                <span className="font-extrabold tracking-wider text-sm sm:text-base text-white group-hover:text-cyan-400 transition-colors">
                  FALCON CHEMICALS
                </span>
                <span className="block text-[10px] text-slate-400 uppercase tracking-widest -mt-0.5">
                  LLC • DUBAI, UAE
                </span>
              </div>
            </button>

            {/* Spectrum Visualizer */}
            <div className="hidden sm:flex items-center bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 gap-2">
              <canvas
                ref={canvasRef}
                width={65}
                height={16}
                className="opacity-90"
              />
              <span className="text-[10px] font-mono text-cyan-400 uppercase">
                {isMuted ? 'MUTED' : isAmbientPlaying ? 'AMBIENT ON' : 'AUDIO ACTIVE'}
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/80 border border-slate-800 rounded-full px-3 py-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  audioEngine.playClick();
                  onNavigateSection(item.id);
                }}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  activeSection === item.id
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right Action Tools: IP Switcher, Sound & Portal Login */}
          <div className="flex items-center gap-2">
            
            {/* Host IP Switcher Pill */}
            <button
              onClick={() => {
                audioEngine.playClick();
                onToggleSimulatedIp();
              }}
              className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-mono transition-all ${
                isOfficeSubnet
                  ? 'bg-emerald-950/50 border-emerald-500/30 text-emerald-300 hover:border-emerald-400'
                  : 'bg-amber-950/50 border-amber-500/30 text-amber-300 hover:border-amber-400'
              }`}
              title="Click to toggle between Office Subnet and Internet WAN"
            >
              {isOfficeSubnet ? <Building2 className="w-3.5 h-3.5 text-emerald-400" /> : <Globe2 className="w-3.5 h-3.5 text-amber-400" />}
              <span className="text-[11px]">{currentSimulatedIp}</span>
            </button>

            {/* Sound Mute Button */}
            <button
              onClick={handleMuteClick}
              className={`p-2 rounded-lg border transition-colors ${
                isMuted
                  ? 'bg-rose-950/40 text-rose-400 border-rose-800'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
              }`}
              title={isMuted ? 'Unmute Corporate Audio' : 'Mute Corporate Audio'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Ambient Soundscape Toggle */}
            <button
              onClick={handleAmbientClick}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                isAmbientPlaying
                  ? 'bg-cyan-950/60 border-cyan-500/40 text-cyan-300 shadow-sm'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
              title="Toggle Ambient Audio Synth"
            >
              <Radio className={`w-3.5 h-3.5 ${isAmbientPlaying ? 'animate-pulse text-cyan-400' : ''}`} />
              <span>{isAmbientPlaying ? 'Ambient: On' : 'Ambient: Off'}</span>
            </button>

            {/* Oracle Reports Direct Menu (192.168.100.202:8080) Gateway */}
            {onOpenOraclePortal && (
              <button
                onClick={() => {
                  audioEngine.playClick();
                  onOpenOraclePortal();
                }}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-[#002b49] hover:bg-[#003b66] border border-sky-400/40 text-sky-200 hover:text-white text-xs font-bold rounded-lg shadow transition-all cursor-pointer"
                title="Access Oracle Reports (192.168.100.202:8080) - Requires 192.168.100.202 Authentication"
              >
                <Globe2 className="w-3.5 h-3.5 text-sky-400" />
                <span>Oracle Reports (192.168.100.202:8080)</span>
              </button>
            )}

            {/* Primary Portal Login Button */}
            <button
              onClick={() => {
                audioEngine.playClick();
                onOpenPortal();
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 text-white text-xs font-bold rounded-lg shadow-lg shadow-cyan-900/30 transition-all border border-cyan-400/30 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Portal & Reports</span>
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
