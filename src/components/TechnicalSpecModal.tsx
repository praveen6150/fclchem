import React from 'react';
import { ProductItem } from '../types';
import { X, CheckCircle, FileText, Send, ShieldCheck, Box, Info } from 'lucide-react';
import { audioEngine } from '../services/audioEngine';
import { COMPANY_INFO } from '../data/falconData';

interface Props {
  product: ProductItem | null;
  onClose: () => void;
  onInquire: (product: ProductItem) => void;
}

export const TechnicalSpecModal: React.FC<Props> = ({
  product,
  onClose,
  onInquire
}) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Top Spec Sheet Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-amber-400 font-mono text-[10px] uppercase font-bold tracking-wider">
              <span>TECHNICAL DATASHEET</span>
              <span>•</span>
              <span>ISO CERTIFIED FORMULATION</span>
            </div>
            <h3 className="text-xl font-extrabold text-white">
              {product.name}
            </h3>
          </div>

          <button
            onClick={() => {
              audioEngine.playClickSound();
              onClose();
            }}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scroll Content */}
        <div className="p-6 space-y-6 overflow-y-auto font-sans text-slate-200">
          
          {/* Overview Description */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5" /> Product Overview
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
              {product.fullDesc}
            </p>
          </div>

          {/* Key Features */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> Performance Attributes
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {product.keyFeatures.map((feat, i) => (
                <div key={i} className="flex items-start gap-2 text-xs bg-slate-950/40 p-2.5 rounded-lg border border-slate-800">
                  <CheckCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Specs Table */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" /> Technical Parameters
            </h4>
            <div className="bg-slate-950 rounded-xl border border-slate-800 divide-y divide-slate-800/60 text-xs">
              <div className="flex justify-between p-3">
                <span className="text-slate-400 font-mono">Appearance</span>
                <span className="font-semibold text-slate-200">{product.specs.appearance}</span>
              </div>
              {product.specs.density && (
                <div className="flex justify-between p-3">
                  <span className="text-slate-400 font-mono">Density</span>
                  <span className="font-semibold text-slate-200">{product.specs.density}</span>
                </div>
              )}
              {product.specs.viscosity && (
                <div className="flex justify-between p-3">
                  <span className="text-slate-400 font-mono">Viscosity</span>
                  <span className="font-semibold text-slate-200">{product.specs.viscosity}</span>
                </div>
              )}
              {product.specs.dryingTime && (
                <div className="flex justify-between p-3">
                  <span className="text-slate-400 font-mono">Cure / Drying Time</span>
                  <span className="font-semibold text-slate-200">{product.specs.dryingTime}</span>
                </div>
              )}
              {product.specs.shelfLife && (
                <div className="flex justify-between p-3">
                  <span className="text-slate-400 font-mono">Shelf Life</span>
                  <span className="font-semibold text-slate-200">{product.specs.shelfLife}</span>
                </div>
              )}
            </div>
          </div>

          {/* Applications */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Box className="w-3.5 h-3.5" /> Recommended Applications
            </h4>
            <div className="flex flex-wrap gap-2">
              {product.applications.map((app, i) => (
                <span key={i} className="text-xs bg-slate-800/80 text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700">
                  {app}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="bg-slate-950 px-6 py-4 border-t border-slate-800 flex items-center justify-between gap-4">
          <span className="text-xs text-slate-400 font-mono hidden sm:inline">
            Manufactured by {COMPANY_INFO.name}
          </span>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => {
                audioEngine.playClickSound();
                onClose();
              }}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
            >
              Close
            </button>

            <button
              onClick={() => {
                audioEngine.playClickSound();
                onInquire(product);
                onClose();
              }}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Inquire Product Quote</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
