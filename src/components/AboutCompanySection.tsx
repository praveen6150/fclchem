import React from 'react';
import { Building2, Globe2, ShieldCheck, Award, Factory, Leaf, TestTube, Truck } from 'lucide-react';
import { COMPANY_INFO } from '../data/falconData';
import { audioEngine } from '../services/audioEngine';

export const AboutCompanySection: React.FC = () => {
  return (
    <section id="about" className="py-16 bg-slate-950 text-slate-100 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top Section Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold uppercase tracking-widest">
              <span>COMPANY OVERVIEW</span>
              <span className="text-slate-600">•</span>
              <span>SINCE {COMPANY_INFO.established}</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Dubai's Trusted Pioneer in <span className="text-amber-400">Chemical Manufacturing</span>
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
              Falcon Chemicals LLC operates a state-of-the-art manufacturing and research facility in Dubai, United Arab Emirates. With over four decades of chemical innovation, we serve major commercial, industrial, and infrastructure clients across the Middle East, Africa, Europe, and Asia.
            </p>

            {/* Certifications Row */}
            <div className="flex flex-wrap gap-2 pt-2">
              {COMPANY_INFO.certifications.map((cert, i) => (
                <span
                  key={i}
                  onMouseEnter={() => audioEngine.playHoverSound()}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-amber-300 flex items-center gap-1.5"
                >
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span>{cert}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Right Highlight Grid */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div 
              onMouseEnter={() => audioEngine.playHoverSound()}
              className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2 hover:border-slate-700 transition-all"
            >
              <Factory className="w-6 h-6 text-amber-400" />
              <h3 className="font-bold text-white text-sm">Dubai Industrial City Hub</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Automated liquid reactors and high-speed packaging lines ensuring continuous batch purity.
              </p>
            </div>

            <div 
              onMouseEnter={() => audioEngine.playHoverSound()}
              className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2 hover:border-slate-700 transition-all"
            >
              <TestTube className="w-6 h-6 text-sky-400" />
              <h3 className="font-bold text-white text-sm">In-House R&D Testing</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Dedicated chemical laboratories conducting shear, tensile, thermal, and climate endurance tests.
              </p>
            </div>

            <div 
              onMouseEnter={() => audioEngine.playHoverSound()}
              className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2 hover:border-slate-700 transition-all"
            >
              <Globe2 className="w-6 h-6 text-emerald-400" />
              <h3 className="font-bold text-white text-sm">40+ Export Markets</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Direct export supply channels into GCC, North Africa, CIS countries, and Southeast Asia.
              </p>
            </div>

            <div 
              onMouseEnter={() => audioEngine.playHoverSound()}
              className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2 hover:border-slate-700 transition-all"
            >
              <Leaf className="w-6 h-6 text-teal-400" />
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
