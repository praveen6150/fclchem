import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Radio, Play, Sliders, Sparkles, Check } from 'lucide-react';
import { audioEngine } from '../services/audioEngine';
import { COMPANY_INFO } from '../data/falconData';

interface Props {
  isMuted: boolean;
  onToggleMute: () => void;
  isAmbientPlaying: boolean;
  onToggleAmbient: () => void;
  onOpenPresentation: () => void;
  onNavigateSection: (sectionId: string) => void;
  activeSection: string;
}

export const AudioControlsBar: React.FC<Props> = ({
  isMuted,
  onToggleMute,
  isAmbientPlaying,
  onToggleAmbient,
  onOpenPresentation,
  onNavigateSection,
  activeSection
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [fxVol, setFxVol] = useState(0.5);
  const [ambVol, setAmbVol] = useState(0.25);

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
        // Normalize 0..255 to height
        const barHeight = isMuted ? 2 : Math.max(2, (val / 255) * (canvas.height - 2));

        const x = startX + i * (barWidth + gap);
        const y = canvas.height - barHeight;

        // Gradient color: Cyan/Gold when active
        const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
        gradient.addColorStop(0, '#38BDF8'); // Sky blue
        gradient.addColorStop(1, '#F59E0B'); // Amber gold

        ctx.fillStyle = isMuted ? '#475569' : gradient;
        ctx.fillRect(x, y, barWidth, barHeight);
      }
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [isMuted]);

  const handleMuteClick = () => {
    audioEngine.playClickSound();
    onToggleMute();
  };

  const handleAmbientClick = () => {
    audioEngine.playClickSound();
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
    { id: 'products', label: 'Products' },
    { id: 'about', label: 'About Falcon' },
    { id: 'contact', label: 'Inquiry' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 text-slate-100 shadow-xl transition-all">
      {/* Top Corporate Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Name */}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => {
              audioEngine.playClickSound();
              onNavigateSection('hero');
            }}
            onMouseEnter={() => audioEngine.playHoverSound()}
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-slate-950 font-black tracking-tighter shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <span className="text-xl">F</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-wider text-slate-100 uppercase font-sans">
                  FALCON CHEMICALS
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-semibold border border-amber-500/30">
                  LLC
                </span>
              </div>
              <p className="text-[10px] text-slate-400 tracking-wide font-mono hidden sm:block">
                DUBAI • UNITED ARAB EMIRATES
              </p>
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/80 p-1 rounded-full border border-slate-800">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    audioEngine.playClickSound();
                    onNavigateSection(item.id);
                  }}
                  onMouseEnter={() => audioEngine.playHoverSound()}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm shadow-amber-500/20'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action & Audio Controls */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* Audio Spectrum Visualizer HUD */}
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800/80">
              <canvas ref={canvasRef} width={40} height={18} className="block" />
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                {isMuted ? 'Audio Off' : isAmbientPlaying ? 'Ambient HQ' : 'Sound FX'}
              </span>
            </div>

            {/* Presentation Video Mode Button */}
            <button
              onClick={() => {
                audioEngine.playClickSound();
                onOpenPresentation();
              }}
              onMouseEnter={() => audioEngine.playHoverSound()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 active:scale-95 transition-all"
              title="Watch Corporate Video Presentation with Synchronized Audio"
            >
              <Play className="w-3.5 h-3.5 fill-slate-950" />
              <span className="hidden xs:inline">Video Presentation</span>
            </button>

            {/* Mute/Unmute Toggle */}
            <button
              onClick={handleMuteClick}
              onMouseEnter={() => audioEngine.playHoverSound()}
              className={`p-2 rounded-lg border transition-all ${
                isMuted
                  ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  : 'bg-amber-500/10 border-amber-500/40 text-amber-400 hover:bg-amber-500/20'
              }`}
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Audio Settings Popover Toggle */}
            <div className="relative">
              <button
                onClick={() => {
                  audioEngine.playClickSound();
                  setShowSettings(!showSettings);
                }}
                onMouseEnter={() => audioEngine.playHoverSound()}
                className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
                title="Audio Settings & Ambient Sound"
              >
                <Sliders className="w-4 h-4" />
              </button>

              {/* Audio Settings Dropdown */}
              {showSettings && (
                <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                    <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                      <Radio className="w-3.5 h-3.5 text-amber-400" /> Corporate Audio Engine
                    </span>
                    <button
                      onClick={() => setShowSettings(false)}
                      className="text-slate-400 hover:text-white text-xs"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Ambient Music Toggle */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-xs font-medium text-slate-200">Ambient Soundscape</p>
                      <p className="text-[10px] text-slate-400">Soft corporate presentation audio</p>
                    </div>
                    <button
                      onClick={handleAmbientClick}
                      className={`px-3 py-1 rounded-md text-xs font-semibold border transition-all ${
                        isAmbientPlaying
                          ? 'bg-amber-500 text-slate-950 border-amber-400'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      {isAmbientPlaying ? 'ON' : 'OFF'}
                    </button>
                  </div>

                  {/* Volume Sliders */}
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                        <span>UI Sound FX</span>
                        <span className="font-mono">{Math.round(fxVol * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={fxVol}
                        onChange={handleFxVolChange}
                        className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                        <span>Ambient Music</span>
                        <span className="font-mono">{Math.round(ambVol * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={ambVol}
                        onChange={handleAmbVolChange}
                        className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] text-slate-400 font-mono text-center">
                    🎵 Web Audio Synthesizer • Synced Clicks
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
