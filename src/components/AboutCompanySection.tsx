import React from 'react';
import { Award, Factory, Leaf, TestTube, Globe2 } from 'lucide-react';
import { COMPANY_INFO } from '../data/falconData';
import { audioEngine } from '../services/audioEngine';

export const AboutCompanySection: React.FC = () => {
  return (
    <section id="about" className="py-16 bg-[#030712] text-slate-100 border-b border-[#1e293b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top Section Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center gap-2 text-amber-500 font-mono text-xs font-bold uppercase tracking-wider">
              <span>COMPANY OVERVIEW</span>
              <span className="text-slate-600">•</span>
              <span>SINCE {COMPANY_INFO.established}</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              Dubai's Trusted Pioneer in <span className="text-amber-400">Chemical Manufacturing</span>
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
              Falcon Chemicals LLC operates a state-of-the-art manufacturing and research facility in Dubai, United Arab Emirates. With over four decades of chemical innovation, we serve major commercial, industrial, and infrastructure clients across the Middle East, Africa, Europe, and Asia.
            </p>

            {/* Certifications Row - Matching Screenshot 1 */}
            <div className="flex flex-wrap gap-2.5 pt-2">
              {COMPANY_INFO.certifications.map((cert, i) => (
                <span
                  key={i}
                  onMouseEnter={() => audioEngine.playHoverSound()}
                  className="px-3.5 py-1.5 rounded-lg bg-[#0a1224] border border-amber-500/30 text-amber-400 text-xs font-semibold flex items-center gap-2 shadow-sm hover:border-amber-400 transition-colors"
                >
                  <Award className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{cert}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Right Highlight Grid */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div 
              onMouseEnter={() => audioEngine.playHoverSound()}
              className="bg-[#091224] border border-[#1e293b] p-5 rounded-2xl space-y-2 hover:border-amber-500/40 transition-all shadow-lg"
            >
              <Factory className="w-6 h-6 text-amber-400" />
              <h3 className="font-bold text-white text-sm">Jebel Ali Industrial Plant</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Automated liquid reactors and high-speed packaging lines in Jebel Ali Industrial Area No. 3 ensuring continuous batch purity.
              </p>
            </div>

            <div 
              onMouseEnter={() => audioEngine.playHoverSound()}
              className="bg-[#091224] border border-[#1e293b] p-5 rounded-2xl space-y-2 hover:border-amber-500/40 transition-all shadow-lg"
            >
              <TestTube className="w-6 h-6 text-amber-400" />
              <h3 className="font-bold text-white text-sm">In-House R&D Testing</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Dedicated chemical laboratories conducting shear, tensile, thermal, and climate endurance tests.
              </p>
            </div>

            <div 
              onMouseEnter={() => audioEngine.playHoverSound()}
              className="bg-[#091224] border border-[#1e293b] p-5 rounded-2xl space-y-2 hover:border-amber-500/40 transition-all shadow-lg"
            >
              <Globe2 className="w-6 h-6 text-amber-400" />
              <h3 className="font-bold text-white text-sm">40+ Export Markets</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Direct export supply channels into GCC, North Africa, CIS countries, and Southeast Asia.
              </p>
            </div>

            <div 
              onMouseEnter={() => audioEngine.playHoverSound()}
              className="bg-[#091224] border border-[#1e293b] p-5 rounded-2xl space-y-2 hover:border-amber-500/40 transition-all shadow-lg"
            >
              <Leaf className="w-6 h-6 text-amber-400" />
              <h3 className="font-bold text-white text-sm">Low-VOC & Green Building</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Eco-friendly water-based and low-emission chemical formulations compliant with LEED norms.
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
