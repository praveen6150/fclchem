import React, { useState, useEffect } from 'react';
import { AudioControlsBar } from './components/AudioControlsBar';
import { HeroSection } from './components/HeroSection';
import { ProductCatalog } from './components/ProductCatalog';
import { TechnicalSpecModal } from './components/TechnicalSpecModal';
import { AboutCompanySection } from './components/AboutCompanySection';
import { InquirySection } from './components/InquirySection';
import { PresentationModeModal } from './components/PresentationModeModal';
import { Footer } from './components/Footer';
import { ProductItem } from './types';
import { audioEngine } from './services/audioEngine';

export default function App() {
  const [isMuted, setIsMuted] = useState(false);
  const [isAmbientPlaying, setIsAmbientPlaying] = useState(false);
  const [isPresentationOpen, setIsPresentationOpen] = useState(false);
  const [selectedProductForSpecs, setSelectedProductForSpecs] = useState<ProductItem | null>(null);
  const [selectedProductForInquiry, setSelectedProductForInquiry] = useState<ProductItem | null>(null);
  const [activeSection, setActiveSection] = useState<string>('hero');

  // Resume Web Audio API context on first user click anywhere in document
  useEffect(() => {
    const handleFirstUserGesture = () => {
      audioEngine.ensureContext();
      window.removeEventListener('click', handleFirstUserGesture);
    };
    window.addEventListener('click', handleFirstUserGesture);
    return () => window.removeEventListener('click', handleFirstUserGesture);
  }, []);

  // Sync Mute state with audioEngine
  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    audioEngine.setMute(nextMuted);
  };

  // Sync Ambient soundtrack state
  const handleToggleAmbient = () => {
    if (isAmbientPlaying) {
      audioEngine.stopAmbientPad();
      setIsAmbientPlaying(false);
    } else {
      audioEngine.startAmbientPad();
      setIsAmbientPlaying(true);
    }
  };

  const handleNavigateSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleInquireProduct = (product: ProductItem) => {
    setSelectedProductForInquiry(product);
    handleNavigateSection('contact');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-amber-500 selection:text-slate-950">
      
      {/* Sticky Audio Controls Header */}
      <AudioControlsBar
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        isAmbientPlaying={isAmbientPlaying}
        onToggleAmbient={handleToggleAmbient}
        onOpenPresentation={() => setIsPresentationOpen(true)}
        onNavigateSection={handleNavigateSection}
        activeSection={activeSection}
      />

      {/* Hero Presentation Banner */}
      <HeroSection
        onOpenPresentation={() => setIsPresentationOpen(true)}
        onExploreProducts={() => handleNavigateSection('products')}
        onOpenInquiry={() => handleNavigateSection('contact')}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
      />

      {/* Product Catalog Grid */}
      <ProductCatalog
        onSelectProduct={(product) => setSelectedProductForSpecs(product)}
        onInquireProduct={handleInquireProduct}
      />

      {/* About Falcon Chemicals Section */}
      <AboutCompanySection />

      {/* Quote & Contact Inquiry Form */}
      <InquirySection
        selectedProductForInquiry={selectedProductForInquiry}
      />

      {/* Footer */}
      <Footer
        onNavigateSection={handleNavigateSection}
        onOpenPresentation={() => setIsPresentationOpen(true)}
      />

      {/* Technical Spec Sheet Modal */}
      <TechnicalSpecModal
        product={selectedProductForSpecs}
        onClose={() => setSelectedProductForSpecs(null)}
        onInquire={handleInquireProduct}
      />

      {/* Full-Screen YouTube Style Video Presentation Modal */}
      <PresentationModeModal
        isOpen={isPresentationOpen}
        onClose={() => setIsPresentationOpen(false)}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
      />

    </div>
  );
}
