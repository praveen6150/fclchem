import React from 'react';

interface FalconLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export const FalconLogo: React.FC<FalconLogoProps> = ({
  className = '',
  size = 'md',
  showText = false
}) => {
  const sizeMap = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* Authentic Falcon Chemicals Falcon Bird Industrial Logo Crest */}
      <div className={`relative ${sizeMap[size]} shrink-0 rounded-xl bg-gradient-to-br from-slate-900 via-cyan-950 to-slate-950 p-1 border border-cyan-500/40 shadow-lg shadow-cyan-500/10 flex items-center justify-center overflow-hidden group`}>
        {/* Ambient subtle glow inside logo */}
        <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/15 via-transparent to-cyan-400/20 pointer-events-none" />
        
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer Shield / Diamond Crest Outline */}
          <polygon
            points="50,4 92,26 92,74 50,96 8,74 8,26"
            stroke="url(#falconGoldGrad)"
            strokeWidth="3.5"
            fill="#091322"
            fillOpacity="0.8"
          />
          
          {/* Falcon Soaring Head & Sharp Beak */}
          <path
            d="M50 16 C56 16 63 20 67 26 C68 28 72 32 76 34 C73 36 68 37 65 37 C69 41 71 44 68 47 C64 45 60 41 57 37 C54 39 49 40 45 39 C38 37 32 30 33 22 C37 18 43 16 50 16 Z"
            fill="url(#falconCyanGrad)"
          />
          
          {/* Falcon Fierce Eye */}
          <circle cx="58" cy="27" r="2.5" fill="#F59E0B" />
          <circle cx="58.5" cy="26.5" r="0.8" fill="#FFFFFF" />

          {/* Left Wing Primary Feathers / Chemical Molecule Geometry */}
          <path
            d="M44 38 C35 39 24 45 16 55 C22 53 30 50 37 49 C28 56 22 64 18 73 C26 69 34 64 42 61 C34 68 29 76 26 84 C38 78 48 68 53 58 Z"
            fill="url(#falconGoldGrad)"
          />

          {/* Right Wing Aerodynamic Sweep */}
          <path
            d="M54 38 C63 39 74 45 82 55 C76 53 68 50 61 49 C70 56 76 64 80 73 C72 69 64 64 56 61 C64 68 69 76 72 84 C60 78 50 68 45 58 Z"
            fill="url(#falconCyanGrad)"
          />

          {/* Central Chemical Catalyst Diamond Core */}
          <polygon
            points="50,48 57,60 50,72 43,60"
            fill="#FBBF24"
            stroke="#0891B2"
            strokeWidth="1.5"
          />

          {/* Tail Plume Anchor */}
          <polygon
            points="50,74 54,88 50,86 46,88"
            fill="url(#falconGoldGrad)"
          />

          {/* Gradients */}
          <defs>
            <linearGradient id="falconGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FDE68A" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
            <linearGradient id="falconCyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#67E8F9" />
              <stop offset="50%" stopColor="#06B6D4" />
              <stop offset="100%" stopColor="#0284C7" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className="font-extrabold tracking-wider text-sm sm:text-base text-white leading-none">
            FALCON CHEMICALS
          </span>
          <span className="text-[10px] text-cyan-400 font-mono tracking-widest uppercase mt-0.5">
            LLC • DUBAI, UAE
          </span>
        </div>
      )}
    </div>
  );
};
