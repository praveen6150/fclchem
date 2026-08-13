import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, X, Volume2, VolumeX, Radio, Sparkles, Building2, ShieldCheck, Globe, Award } from 'lucide-react';
import { FALCON_CHAPTERS, COMPANY_INFO } from '../data/falconData';
import { audioEngine } from '../services/audioEngine';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const PresentationModeModal: React.FC<Props> = ({
  isOpen,
  onClose,
  isMuted,
  onToggleMute
}) => {
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progressSec, setProgressSec] = useState(0);

  const chapter = FALCON_CHAPTERS[currentChapterIndex];

  // Auto-advance timer
  useEffect(() => {
    if (!isOpen || !isPlaying) return;

    const interval = setInterval(() => {
      setProgressSec((prev) => {
        if (prev >= chapter.durationSec) {
          // Advance to next chapter
          const nextIdx = (currentChapterIndex + 1) % FALCON_CHAPTERS.length;
          setCurrentChapterIndex(nextIdx);
          audioEngine.playChapterCue();
          return 0;
        }
        return prev + 0.1;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isOpen, isPlaying, currentChapterIndex, chapter.durationSec]);

  if (!isOpen) return null;

  const handleSelectChapter = (index: number) => {
    audioEngine.playClickSound();
    audioEngine.playSlideChangeSound();
    setCurrentChapterIndex(index);
    setProgressSec(0);
  };

  const handlePrev = () => {
    audioEngine.playClickSound();
    audioEngine.playSlideChangeSound();
    const prevIdx = (currentChapterIndex - 1 + FALCON_CHAPTERS.length) % FALCON_CHAPTERS.length;
    setCurrentChapterIndex(prevIdx);
    setProgressSec(0);
  };

  const handleNext = () => {
    audioEngine.playClickSound();
    audioEngine.playSlideChangeSound();
    const nextIdx = (currentChapterIndex + 1) % FALCON_CHAPTERS.length;
    setCurrentChapterIndex(nextIdx);
    setProgressSec(0);
  };

  const handleTogglePlay = () => {
    audioEngine.playClickSound();
    setIsPlaying(!isPlaying);
  };

  const progressPercent = (progressSec / chapter.durationSec) * 100;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex items-center justify-center p-2 sm:p-6 animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Video Header */}
        <div className="bg-slate-950/90 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-mono font-bold tracking-wider text-slate-200 uppercase">
              FALCON CHEMICALS LLC • CORPORATE PRESENTATION
            </span>
            <span className="text-[10px] bg-slate-800 text-slate-300 font-mono px-2 py-0.5 rounded border border-slate-700">
              4K 60FPS AUDIO SYNCED
            </span>
          </div>

          <button
            onClick={() => {
              audioEngine.playClickSound();
              onClose();
            }}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            title="Close Presentation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Canvas Presentation Stage */}
        <div className={`relative flex-1 min-h-[320px] sm:min-h-[420px] bg-gradient-to-br ${chapter.bgGradient} p-6 sm:p-12 flex flex-col justify-between overflow-hidden`}>
          
          {/* Animated Background Graphics */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
          
          {/* Top Stage Badges */}
          <div className="relative z-10 flex items-center justify-between">
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-slate-900/60 text-amber-400 border border-amber-500/30 font-semibold tracking-wider uppercase">
              CHAPTER {currentChapterIndex + 1} OF {FALCON_CHAPTERS.length}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-300">
                {COMPANY_INFO.websiteMain}
              </span>
            </div>
          </div>

          {/* Slide Content Display */}
          <div className="relative z-10 my-auto max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              {chapter.subtitle}
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {chapter.title}
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
              {chapter.description}
            </p>

            {/* Key Bullet Points */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
              {chapter.highlights.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-200 bg-slate-900/40 p-2.5 rounded-lg border border-slate-800/60 backdrop-blur-sm">
                  <span className="text-amber-400 font-bold mt-0.5">•</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Metric Floating Card */}
          <div className="relative z-10 flex items-center justify-between pt-4 border-t border-slate-800/60">
            <div className="flex items-center gap-3">
              <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">
                {chapter.statValue}
              </div>
              <div className="text-xs text-slate-300 uppercase tracking-wider font-semibold">
                {chapter.statLabel}
              </div>
            </div>

            <div className="text-[11px] font-mono text-slate-400 bg-slate-950/70 px-3 py-1.5 rounded-lg border border-slate-800">
              DUBAI INDUSTRIAL CITY, UAE
            </div>
          </div>

        </div>

        {/* Player Control Bar (YouTube Style Timeline & Scrub) */}
        <div className="bg-slate-950 px-4 py-3 border-t border-slate-800 space-y-3">
          
          {/* Scrubber Progress Bar */}
          <div className="space-y-1">
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden cursor-pointer">
              <div 
                className="bg-gradient-to-r from-amber-500 to-amber-400 h-full transition-all duration-100 ease-linear"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>00:{Math.floor(progressSec).toString().padStart(2, '0')}</span>
              <span>CHAPTER {currentChapterIndex + 1} / {FALCON_CHAPTERS.length}</span>
              <span>00:{chapter.durationSec}</span>
            </div>
          </div>

          {/* Controls & Chapter Selector */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            
            {/* Playback Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrev}
                className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 transition-colors"
                title="Previous Slide"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                onClick={handleTogglePlay}
                className="p-2.5 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-500/20 transition-all"
                title={isPlaying ? 'Pause Presentation' : 'Play Presentation'}
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-slate-950" /> : <Play className="w-5 h-5 fill-slate-950 ml-0.5" />}
              </button>

              <button
                onClick={handleNext}
                className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 transition-colors"
                title="Next Slide"
              >
                <SkipForward className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  audioEngine.playClickSound();
                  onToggleMute();
                }}
                className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 transition-colors ml-2"
                title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
              </button>
            </div>

            {/* Chapter Selection Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 sm:pb-0">
              {FALCON_CHAPTERS.map((ch, idx) => {
                const isActive = currentChapterIndex === idx;
                return (
                  <button
                    key={ch.id}
                    onClick={() => handleSelectChapter(idx)}
                    className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all whitespace-nowrap ${
                      isActive
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 font-semibold'
                        : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                    }`}
                  >
                    Ch {idx + 1}
                  </button>
                );
              })}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
