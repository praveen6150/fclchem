import React, { useState, useEffect } from 'react';
import { Send, CheckCircle, Mail, Phone, MapPin, Globe, Building } from 'lucide-react';
import { COMPANY_INFO, FALCON_PRODUCTS } from '../data/falconData';
import { ProductItem } from '../types';
import { audioEngine } from '../services/audioEngine';

interface Props {
  selectedProductForInquiry?: ProductItem | null;
}

export const InquirySection: React.FC<Props> = ({ selectedProductForInquiry }) => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    productName: selectedProductForInquiry ? selectedProductForInquiry.name : 'General Inquiry',
    quantity: 'Bulk Drum / Pallet',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (selectedProductForInquiry) {
      setFormData(prev => ({
        ...prev,
        productName: selectedProductForInquiry.name
      }));
    }
  }, [selectedProductForInquiry]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    audioEngine.playSuccessSound();
    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-16 bg-slate-900 text-slate-100 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Contact Coordinates */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="space-y-2">
              <span className="text-amber-400 font-mono text-xs font-bold uppercase tracking-widest block">
                DIRECT INQUIRIES & SALES
              </span>
              <h2 className="text-3xl font-extrabold text-white tracking-tight">
                Connect with Falcon Chemicals
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                Contact our corporate sales division in Dubai for technical quotes, material safety data sheets (MSDS), and bulk container shipment logistics.
              </p>
            </div>

            {/* Coordinates List */}
            <div className="space-y-4 pt-2">
              
              <div 
                onMouseEnter={() => audioEngine.playHoverSound()}
                className="flex items-start gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800"
              >
                <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-mono font-bold text-slate-300 uppercase">Headquarters & Plant</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{COMPANY_INFO.headquarters}</p>
                  <p className="text-[11px] text-amber-400/80 font-mono mt-1">{COMPANY_INFO.poBox}</p>
                </div>
              </div>

              <div 
                onMouseEnter={() => audioEngine.playHoverSound()}
                className="flex items-start gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800"
              >
                <Phone className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-mono font-bold text-slate-300 uppercase">Telephone Inquiry</h4>
                  <p className="text-xs text-slate-200 font-mono mt-0.5">{COMPANY_INFO.phone}</p>
                  <p className="text-[11px] text-slate-400 font-mono">Sun - Thu: 8:00 AM - 5:30 PM (GST)</p>
                </div>
              </div>

              <div 
                onMouseEnter={() => audioEngine.playHoverSound()}
                className="flex items-start gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800"
              >
                <Mail className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-mono font-bold text-slate-300 uppercase">Corporate Email</h4>
                  <a href={`mailto:${COMPANY_INFO.email}`} className="text-xs text-amber-300 underline font-mono">
                    {COMPANY_INFO.email}
                  </a>
                </div>
              </div>

              <div 
                onMouseEnter={() => audioEngine.playHoverSound()}
                className="flex items-start gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800"
              >
                <Globe className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-mono font-bold text-slate-300 uppercase">Official Portals</h4>
                  <div className="flex gap-3 text-xs font-mono mt-0.5">
                    <span className="text-slate-300">{COMPANY_INFO.websiteMain}</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-300">{COMPANY_INFO.websiteRegional}</span>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* Right Quote Form */}
          <div className="lg:col-span-7 bg-slate-950 border border-slate-800 p-6 sm:p-8 rounded-2xl shadow-xl">
            
            {submitted ? (
              <div className="py-12 text-center space-y-4 animate-in fade-in">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-extrabold text-white">Inquiry Received with Audio Sync!</h3>
                <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                  Thank you for connecting with Falcon Chemicals LLC. Our Dubai technical sales team will review your inquiry and dispatch pricing and technical documentation promptly.
                </p>
                <button
                  onClick={() => {
                    audioEngine.playClickSound();
                    setSubmitted(false);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-slate-800 text-slate-200 hover:text-white font-bold text-xs"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h3 className="font-extrabold text-lg text-white">Request Official Quote</h3>
                  <span className="text-[10px] font-mono bg-slate-900 text-amber-400 px-2 py-1 rounded border border-slate-800">
                    DUBAI SALES OFFICE
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tariq Al-Mansoor"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Company / Organization *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Al Habtoor Contracting"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Business Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="tariq@contracting.ae"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Contact Phone *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+971 50 123 4567"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Select Product / Category *</label>
                  <select
                    value={formData.productName}
                    onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="General Inquiry">General Product Inquiry</option>
                    {FALCON_PRODUCTS.map((prod) => (
                      <option key={prod.id} value={prod.name}>
                        {prod.name} ({prod.category})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Specific Requirements / Message</label>
                  <textarea
                    rows={3}
                    placeholder="Provide estimated quantities, required delivery location (e.g. Dubai, Abu Dhabi, Saudi Arabia), or custom formulation requirements..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <button
                  type="submit"
                  onMouseEnter={() => audioEngine.playHoverSound()}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/20 active:scale-98 transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Transmit Quote Request (Synced Sound Feedback)</span>
                </button>

              </form>
            )}

          </div>

        </div>

      </div>
    </section>
  );
};
