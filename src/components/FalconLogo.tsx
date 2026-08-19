import React, { useState } from 'react';

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
  const [imgError, setImgError] = useState(false);

  const sizeMap = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* Ultra Stylish Majestic Golden Frame */}
      <div className={`relative ${sizeMap[size]} shrink-0 rounded-xl bg-gradient-to-br from-[#121c2e] via-[#091020] to-[#040711] p-1 border-2 border-amber-500/40 shadow-lg shadow-amber-500/15 flex items-center justify-center overflow-hidden group hover:border-amber-400 transition-all duration-300`}>
        {/* Ambient subtle warm gold glow inside logo */}
        <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/20 via-transparent to-yellow-400/10 pointer-events-none" />
        
        {!imgError ? (
          <img
            src="/logo.png"
            alt="Falcon Chemicals LLC"
            onError={() => setImgError(true)}
            className="w-full h-full object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]"
          />
        ) : (
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
              fill="#060c18"
              fillOpacity="0.9"
            />
            
            {/* Falcon Soaring Head & Sharp Beak */}
            <path
              d="M50 16 C56 16 63 20 67 26 C68 28 72 32 76 34 C73 36 68 37 65 37 C69 41 71 44 68 47 C64 45 60 41 57 37 C54 39 49 40 45 39 C38 37 32 30 33 22 C37 18 43 16 50 16 Z"
              fill="url(#falconGoldGrad)"
            />
            
            {/* Falcon Fierce Eye */}
            <circle cx="58" cy="27" r="2.5" fill="#FEF08A" />
            <circle cx="58.5" cy="26.5" r="0.8" fill="#000000" />

            {/* Left Wing Primary Feathers */}
            <path
              d="M44 38 C35 39 24 45 16 55 C22 53 30 50 37 49 C28 56 22 64 18 73 C26 69 34 64 42 61 C34 68 29 76 26 84 C38 78 48 68 53 58 Z"
              fill="url(#falconGoldGrad)"
            />

            {/* Right Wing Aerodynamic Sweep */}
            <path
              d="M54 38 C63 39 74 45 82 55 C76 53 68 50 61 49 C70 56 76 64 80 73 C72 69 64 64 56 61 C64 68 69 76 72 84 C60 78 50 68 45 58 Z"
              fill="url(#falconGoldGrad)"
            />

            {/* Central Chemical Catalyst Diamond Core */}
            <polygon
              points="50,48 57,60 50,72 43,60"
              fill="#FDE047"
              stroke="#D97706"
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
                <stop offset="0%" stopColor="#FEF08A" />
                <stop offset="35%" stopColor="#F59E0B" />
                <stop offset="70%" stopColor="#D97706" />
                <stop offset="100%" stopColor="#B45309" />
              </linearGradient>
            </defs>
          </svg>
        )}
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className="font-extrabold tracking-wider text-sm sm:text-base text-white leading-none">
            FALCON CHEMICALS
          </span>
          <span className="text-[10px] text-amber-400 font-mono tracking-widest uppercase mt-0.5 font-bold">
            LLC • DUBAI, UAE
          </span>
        </div>
      )}
    </div>
  );
};
