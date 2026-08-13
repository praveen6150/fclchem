import React, { useState } from 'react';
import { ProductItem } from '../types';
import { FALCON_PRODUCTS } from '../data/falconData';
import { audioEngine } from '../services/audioEngine';
import { Layers, Shield, Droplet, Sparkles, FileText, Send, ArrowUpRight } from 'lucide-react';

interface Props {
  onSelectProduct: (product: ProductItem) => void;
  onInquireProduct: (product: ProductItem) => void;
}

export const ProductCatalog: React.FC<Props> = ({
  onSelectProduct,
  onInquireProduct
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Products', icon: Layers },
    { id: 'adhesives', label: 'Adhesives & Sealants', icon: Droplet },
    { id: 'construction', label: 'Construction Chemicals', icon: Shield },
    { id: 'coatings', label: 'Industrial Coatings', icon: Sparkles },
    { id: 'aerosols', label: 'Aerosols & Cleaners', icon: Layers }
  ];

  const filteredProducts = activeCategory === 'all'
    ? FALCON_PRODUCTS
    : FALCON_PRODUCTS.filter(p => p.category === activeCategory);

  const handleCategoryChange = (catId: string) => {
    audioEngine.playClickSound();
    audioEngine.playSlideChangeSound();
    setActiveCategory(catId);
  };

  return (
    <section id="products" className="py-16 bg-slate-900 text-slate-100 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold uppercase tracking-widest mb-1">
              <span>PRODUCT PORTFOLIO</span>
              <span className="text-slate-600">•</span>
              <span>FALCON CHEMICALS LLC</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Industrial Chemical Solutions
            </h2>
          </div>
          <p className="text-sm text-slate-400 max-w-md">
            Click any product to inspect technical datasheets, application guidelines, and packaging specifications with synced sound feedback.
          </p>
        </div>

        {/* Filter Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                onMouseEnter={() => audioEngine.playHoverSound()}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border cursor-pointer ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-lg shadow-amber-500/20'
                    : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-amber-400'}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              onMouseEnter={() => audioEngine.playHoverSound()}
              className="bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 transition-all hover:shadow-xl hover:shadow-amber-500/5 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                
                {/* Product Category Tag & Featured Pill */}
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/20">
                    {product.category}
                  </span>
                  {product.featured && (
                    <span className="text-[10px] bg-slate-800 text-slate-300 font-mono px-2 py-0.5 rounded border border-slate-700">
                      FLAGSHIP FORMULA
                    </span>
                  )}
                </div>

                {/* Name & Description */}
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {product.shortDesc}
                  </p>
                </div>

                {/* Key Features Bullet List */}
                <ul className="space-y-1.5 pt-1 text-xs text-slate-300">
                  {product.keyFeatures.slice(0, 3).map((feat, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                      <span className="truncate">{feat}</span>
                    </li>
                  ))}
                </ul>

                {/* Available Packaging */}
                <div className="pt-2 border-t border-slate-800/80">
                  <span className="text-[10px] uppercase font-mono text-slate-500 block mb-1">Packaging Sizes:</span>
                  <div className="flex flex-wrap gap-1">
                    {product.packaging.map((pack, i) => (
                      <span key={i} className="text-[10px] bg-slate-900 text-slate-300 px-2 py-0.5 rounded border border-slate-800 font-mono">
                        {pack}
                      </span>
                    ))}
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-6 mt-6 border-t border-slate-800">
                <button
                  onClick={() => {
                    audioEngine.playClickSound();
                    onSelectProduct(product);
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs transition-colors cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-amber-400" />
                  <span>Technical Sheet</span>
                </button>

                <button
                  onClick={() => {
                    audioEngine.playClickSound();
                    onInquireProduct(product);
                  }}
                  className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-amber-500/10 cursor-pointer"
                  title="Inquire Product Quote"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
