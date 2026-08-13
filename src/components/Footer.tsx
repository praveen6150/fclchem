import React from 'react';
import { COMPANY_INFO } from '../data/falconData';
import { audioEngine } from '../services/audioEngine';
import { Globe, Award, Shield, ArrowUp } from 'lucide-react';

interface Props {
  onNavigateSection: (sectionId: string) => void;
  onOpenPresentation: () => void;
}

export const Footer: React.FC<Props> = ({ onNavigateSection, onOpenPresentation }) => {
  const scrollToTop = () => {
    audioEngine.playClickSound();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-xs py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-amber-500 text-slate-950 font-black flex items-center justify-center text-sm">
                F
              </div>
              <span className="font-extrabold text-white tracking-wider">
                FALCON CHEMICALS LLC
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
              Precision adhesive, sealant, waterproofing, and industrial coating solutions manufactured in Dubai, UAE since {COMPANY_INFO.established}.
            </p>
            <div className="text-[10px] text-amber-400 font-mono">
              ISO 9001:2015 & ISO 14001:2015
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider font-mono">
              Navigation
            </h4>
            <ul className="space-y-1.5 text-slate-300">
              <li>
                <button
                  onClick={() => {
                    audioEngine.playClickSound();
                    onNavigateSection('hero');
                  }}
                  className="hover:text-amber-400 transition-colors"
                >
                  Overview & Facility
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    audioEngine.playClickSound();
                    onNavigateSection('products');
                  }}
                  className="hover:text-amber-400 transition-colors"
                >
                  Product Catalog
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    audioEngine.playClickSound();
                    onOpenPresentation();
                  }}
                  className="hover:text-amber-400 transition-colors text-amber-300 font-medium flex items-center gap-1"
                >
                  <span>Video Presentation Mode</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    audioEngine.playClickSound();
                    onNavigateSection('about');
                  }}
                  className="hover:text-amber-400 transition-colors"
                >
                  About Falcon UAE
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    audioEngine.playClickSound();
                    onNavigateSection('contact');
                  }}
                  className="hover:text-amber-400 transition-colors"
                >
                  Inquiry & Quote
                </button>
              </li>
            </ul>
          </div>

          {/* Portals & Official Websites */}
          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider font-mono">
              Official Portals
            </h4>
            <ul className="space-y-1.5 text-slate-300 font-mono">
              <li className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-amber-400" />
                <a href="https://www.falconchemicals.com" target="_blank" rel="noreferrer" className="hover:text-amber-300">
                  {COMPANY_INFO.websiteMain}
                </a>
              </li>
              <li className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-amber-400" />
                <a href="https://www.falconchemicals.ae" target="_blank" rel="noreferrer" className="hover:text-amber-300">
                  {COMPANY_INFO.websiteRegional}
                </a>
              </li>
              <li className="pt-2 text-[10px] text-slate-400">
                Dubai Industrial City, Dubai, UAE
              </li>
            </ul>
          </div>

          {/* Audio Engine & Scroll */}
          <div className="space-y-3 flex flex-col justify-between">
            <div>
              <h4 className="font-bold text-white uppercase text-[11px] tracking-wider font-mono">
                Audio Synthesizer HUD
              </h4>
              <p className="text-[10px] text-slate-400 leading-relaxed font-mono mt-1">
                Integrated Web Audio API sound feedback engine synced to interactive clicks & presentation mode.
              </p>
            </div>

            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 font-mono text-[11px] transition-all self-start"
            >
              <ArrowUp className="w-3.5 h-3.5 text-amber-400" />
              <span>Back to Top</span>
            </button>
          </div>

        </div>

        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400 font-mono">
          <div>
            © {new Date().getFullYear()} {COMPANY_INFO.name}. All Rights Reserved.
          </div>
          <div>
            Dubai Industrial City • P.O. Box 28003 • Dubai, U.A.E.
          </div>
        </div>

      </div>
    </footer>
  );
};
