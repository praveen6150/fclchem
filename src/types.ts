export interface ProductItem {
  id: string;
  name: string;
  category: 'adhesives' | 'construction' | 'coatings' | 'aerosols';
  shortDesc: string;
  fullDesc: string;
  keyFeatures: string[];
  applications: string[];
  packaging: string[];
  specs: {
    appearance: string;
    density?: string;
    viscosity?: string;
    dryingTime?: string;
    shelfLife?: string;
  };
  featured?: boolean;
}

export interface PresentationChapter {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  highlights: string[];
  durationSec: number;
  bgGradient: string;
  statLabel: string;
  statValue: string;
}

export interface SoundSettings {
  isMuted: boolean;
  ambientPlaying: boolean;
  ambientVolume: number;
  fxVolume: number;
  presentationAutoPlay: boolean;
}
