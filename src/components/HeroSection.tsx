import React from 'react';
import { Play, ArrowRight, ShieldCheck, Award, Globe, Factory, Volume2 } from 'lucide-react';
import { COMPANY_INFO } from '../data/falconData';
import { audioEngine } from '../services/audioEngine';

interface Props {
  onOpenPresentation: () => void;
  onExploreProducts: () => void;
  onOpenInquiry: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const HeroSection: React.FC<Props> = ({
  onOpenPresentation,
  onExploreProducts,
  onOpenInquiry,
  isMuted,
  onToggleMute
}) => {
  return (
    <section id="hero" className="relative bg-slate-950 text-white overflow-hidden py-16 lg:py-24 border-b border-slate-800">
      
      {/* Background Hero Image with Overlays */}
      <div className="absolute inset-0 z-0 opacity-25">
        <img
          src="/src/assets/images/falcon_hero_banner_1786610117090.jpg"
          alt="Falcon Chemicals Facility Dubai"
          className="w-full h-full object-cover object-center"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/80" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Sound Prompt Banner */}
        <div className="mb-8 inline-flex items-center gap-3 px-4 py-2 rounded-full bg-slate-900/90 border border-amber-500/30 text-amber-300 text-xs font-mono shadow-xl backdrop-blur-md">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
          <span>AUDIO SYNCED PRESENTATION • CLICK ANYWHERE FOR SOUND FEEDBACK</span>
          <button
            onClick={() => {
              audioEngine.playClickSound();
              onToggleMute();
            }}
            className="ml-2 underline font-semibold hover:text-white"
          >
            {isMuted ? 'ENABLE AUDIO' : 'AUDIO ON'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Main Hero Copy */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="space-y-2">
              <span className="text-amber-400 font-mono text-xs font-bold uppercase tracking-widest block">
                DUBAI INDUSTRIAL CITY • ESTABLISHED {COMPANY_INFO.established}
              </span>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
                Precision Chemical Solutions for <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500">Global Industry</span>
              </h1>
            </div>

            <p className="text-base sm:text-lg text-slate-300 font-sans leading-relaxed max-w-2xl">
              Falcon Chemicals LLC is a pioneer in chemical manufacturing based in the United Arab Emirates. Specializing in high-performance adhesives, construction waterproofing, industrial coatings, and aerosol solutions engineered for durability.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              
              <button
                onClick={() => {
                  audioEngine.playClickSound();
                  onOpenPresentation();
                }}
                onMouseEnter={() => audioEngine.playHoverSound()}
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-sm shadow-xl shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>Watch Presentation Mode</span>
              </button>

              <button
                onClick={() => {
                  audioEngine.playClickSound();
                  onExploreProducts();
                }}
                onMouseEnter={() => audioEngine.playHoverSound()}
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-100 font-bold text-sm hover:bg-slate-800 transition-all cursor-pointer"
              >
                <span>Browse Product Line</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </button>

              <button
                onClick={() => {
                  audioEngine.playClickSound();
                  onOpenInquiry();
                }}
                onMouseEnter={() => audioEngine.playHoverSound()}
                className="px-5 py-3.5 rounded-xl bg-transparent text-slate-300 hover:text-white font-semibold text-sm underline underline-offset-4 cursor-pointer"
              >
                Request Custom Quote
              </button>

            </div>

            {/* Quick Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-800/80">
              <div className="space-y-1">
                <div className="text-xl font-bold font-mono text-white">48+ Yrs</div>
                <div className="text-xs text-slate-400 font-sans">Manufacturing Excellence</div>
              </div>
              <div className="space-y-1">
                <div className="text-xl font-bold font-mono text-white">40+</div>
                <div className="text-xs text-slate-400 font-sans">Global Export Countries</div>
              </div>
              <div className="space-y-1">
                <div className="text-xl font-bold font-mono text-white">ISO 9001</div>
                <div className="text-xs text-slate-400 font-sans">Quality Assured</div>
              </div>
              <div className="space-y-1">
                <div className="text-xl font-bold font-mono text-white">150+</div>
                <div className="text-xs text-slate-400 font-sans">Chemical Formulas</div>
              </div>
            </div>

          </div>

          {/* Right Presentation Video Card */}
          <div className="lg:col-span-5">
            <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Factory className="w-5 h-5 text-amber-400" />
                  <span className="font-bold text-sm text-slate-200">Falcon Corporate Hub</span>
                </div>
                <span className="text-[10px] bg-slate-800 text-amber-400 font-mono px-2 py-0.5 rounded border border-slate-700">
                  DUBAI DIC
                </span>
              </div>

              {/* Facility Preview Thumbnail */}
              <div 
                className="relative rounded-xl overflow-hidden aspect-video group cursor-pointer border border-slate-800"
                onClick={() => {
                  audioEngine.playClickSound();
                  onOpenPresentation();
                }}
              >
                <img
                  src="/src/assets/images/falcon_facility_1786610130142.jpg"
                  alt="Falcon Logistics Warehouse"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-slate-950/50 group-hover:bg-slate-950/30 transition-colors flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-xl shadow-amber-500/40 group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 fill-slate-950 ml-1" />
                  </div>
                </div>
                <div className="absolute bottom-3 left-3 right-3 bg-slate-950/80 backdrop-blur-md p-2 rounded-lg text-xs font-mono text-slate-200 flex justify-between items-center">
                  <span>FACILITY PRESENTATION</span>
                  <span className="text-amber-400 font-bold">CLICK TO PLAY</span>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-400">
                <div className="flex items-center gap-2 text-slate-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>State-of-the-Art Automated R&D & Liquid Blending Lines</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Globe className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>Regional & International Exports across Middle East, Africa & Asia</span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
