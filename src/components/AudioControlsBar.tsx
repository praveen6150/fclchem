import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Radio, Play, Sliders, ShieldCheck, Mail, Network, Building2, Globe2 } from 'lucide-react';
import { audioEngine } from '../services/audioEngine';
import { COMPANY_INFO } from '../data/falconData';

interface Props {
  isMuted: boolean;
  onToggleMute: () => void;
  isAmbientPlaying: boolean;
  onToggleAmbient: () => void;
  onOpenPresentation: () => void;
  onOpenPortal: () => void;
  onOpenEmailInbox: () => void;
  currentSimulatedIp: string;
  onToggleSimulatedIp: () => void;
  onNavigateSection: (sectionId: string) => void;
  activeSection: string;
  unreadEmailCount: number;
}

export const AudioControlsBar: React.FC<Props> = ({
  isMuted,
  onToggleMute,
  isAmbientPlaying,
  onToggleAmbient,
  onOpenPresentation,
  onOpenPortal,
  onOpenEmailInbox,
  currentSimulatedIp,
  onToggleSimulatedIp,
  onNavigateSection,
  activeSection,
  unreadEmailCount
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [fxVol, setFxVol] = useState(0.5);
  const [ambVol, setAmbVol] = useState(0.25);

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

  const handleFxVolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setFxVol(val);
    audioEngine.setFxVolume(val);
  };

  const handleAmbVolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setAmbVol(val);
    audioEngine.setAmbientVolume(val);
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
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-amber-500 flex items-center justify-center font-bold text-slate-950 text-xs shadow-md">
                FC
              </div>
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

          {/* Right Action Tools: IP Switcher, Email Inbox, Sound & Portal Login */}
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

            {/* Virtual Email Inbox Button */}
            <button
              onClick={() => {
                audioEngine.playNotification();
                onOpenEmailInbox();
              }}
              className="relative p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-800 transition-colors"
              title="noreply@falconchemicals.com Email Inbox"
            >
              <Mail className="w-4 h-4" />
              {unreadEmailCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-cyan-500 text-slate-950 font-bold text-[9px] flex items-center justify-center animate-bounce">
                  {unreadEmailCount}
                </span>
              )}
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
