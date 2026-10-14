import React from 'react';

interface NutriGuardLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export const NutriGuardLogo: React.FC<NutriGuardLogoProps> = ({
  className = '',
  size = 40,
  showText = true,
}) => {
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Custom Signature Emblem */}
      <div
        className="relative flex items-center justify-center shrink-0 rounded-2xl p-2 bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700 shadow-md shadow-emerald-500/25 ring-1 ring-white/20 transition-transform hover:scale-105 duration-200"
        style={{ width: size, height: size }}
      >
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full text-white"
        >
          <defs>
            <linearGradient id="shieldGrad" x1="6" y1="4" x2="42" y2="44" gradientUnits="userSpaceOnUse">
              <stop stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="1" stopColor="#a7f3d0" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="leafGrad" x1="16" y1="12" x2="32" y2="34" gradientUnits="userSpaceOnUse">
              <stop stopColor="#10b981" />
              <stop offset="1" stopColor="#059669" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="1.5" stdDeviation="2" floodColor="#064e3b" floodOpacity="0.4" />
            </filter>
          </defs>

          {/* Protective Shield Contour */}
          <path
            d="M24 4L9 10.5V22C9 32.5 15.5 41.5 24 44C32.5 41.5 39 32.5 39 22V10.5L24 4Z"
            fill="none"
            stroke="url(#shieldGrad)"
            strokeWidth="3"
            strokeLinejoin="round"
            filter="url(#glow)"
          />

          {/* Organic Nutrition Leaf (Left curve) */}
          <path
            d="M24 13C17.5 13 14 18.5 14 25C14 29 17 32 21 32C24 32 25 30 25 30C25 30 24 23 24 13Z"
            fill="#ffffff"
            fillOpacity="0.95"
          />

          {/* Clinical Vital Pulse & Cross (Right curve) */}
          <path
            d="M23 23H28L30 19L33 27L35 23H38"
            stroke="#ffffff"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Medical Center Node / Core Heartbeat */}
          <circle cx="24" cy="23" r="2.2" fill="#34d399" />
        </svg>
      </div>

      {showText && (
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
              Nutri<span className="text-emerald-600 dark:text-emerald-400">Guard</span>
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              Clinical Vision
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
            Food Safety &amp; Nutrition Label Diagnostic Engine
          </p>
        </div>
      )}
    </div>
  );
};
