import React from 'react';
import { COMPANY_INFO } from '../data/falconData';
import { audioEngine } from '../services/audioEngine';
import { FalconLogo } from './FalconLogo';
import { Globe, Award, Shield, ArrowUp, ShieldCheck, Lock, Network } from 'lucide-react';

interface Props {
  onNavigateSection: (sectionId: string) => void;
  onOpenPresentation: () => void;
  onOpenPortal: () => void;
}

export const Footer: React.FC<Props> = ({ onNavigateSection, onOpenPresentation, onOpenPortal }) => {
  const scrollToTop = () => {
    audioEngine.playClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-xs py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <FalconLogo size="sm" />
              <span className="font-extrabold text-white tracking-wider text-sm">
                FALCON CHEMICALS LLC
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
              Precision adhesive, sealant, waterproofing, and specialized chemical solutions manufactured in Dubai Industrial City, UAE since {COMPANY_INFO.established}.
            </p>
            <div className="text-[10px] text-cyan-400 font-mono">
              ISO 9001:2015 & ISO 14001:2015
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider font-mono">
              Corporate Gateway
            </h4>
            <ul className="space-y-1.5 text-slate-300">
              <li>
                <button
                  onClick={() => {
                    audioEngine.playClick();
                    onOpenPortal();
                  }}
                  className="hover:text-cyan-400 transition-colors text-cyan-300 font-medium flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Portal & Reports Login</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    audioEngine.playClick();
                    onOpenPresentation();
                  }}
                  className="hover:text-cyan-400 transition-colors flex items-center gap-1"
                >
                  <span>Presentation Mode</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    audioEngine.playClick();
                    onNavigateSection('about');
                  }}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Corporate Profile
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    audioEngine.playClick();
                    onNavigateSection('contact');
                  }}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Inquiry & Technical Support
                </button>
              </li>
            </ul>
          </div>

          {/* Network Security Boundary */}
          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider font-mono">
              Security Boundary
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
              Access to production reactors, inventory stock registers, and UAE VAT 201 returns is strictly governed by RBAC and IP subnet checks.
            </p>
            <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
              <Network className="w-3 h-3" />
              <span>Office Subnet: 192.168.100.0/24</span>
            </div>
            <div className="text-[10px] text-slate-500 font-mono">
              Email Dispatch: noreply@falconchemicals.com
            </div>
          </div>

          {/* Corporate Headquarters */}
          <div className="space-y-2 text-[11px]">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider font-mono">
              Headquarters & Plant (DIC, UAE)
            </h4>
            <p className="text-slate-300 font-sans">
              {COMPANY_INFO.headquarters}<br />
              {COMPANY_INFO.poBox}
            </p>
            <p className="text-slate-400 font-mono">
              Tel: {COMPANY_INFO.phone}<br />
              Email: {COMPANY_INFO.email}
            </p>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <p>© {new Date().getFullYear()} Falcon Chemicals LLC. All Rights Reserved. www.falconchemicals.com | www.falconchemicals.ae — Developed and maintained by Falcon Chemicals' IT Department.</p>
          
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1 text-slate-400 hover:text-cyan-400 transition-colors"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
};
