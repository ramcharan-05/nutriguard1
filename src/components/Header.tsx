import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Activity,
  HeartPulse,
  FileJson,
  Server,
  ArrowRightLeft,
  Sun,
  Moon,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

import { NutriGuardLogo } from './NutriGuardLogo';

interface HeaderProps {
  onOpenJson?: () => void;
  hasResult: boolean;
  onOpenApiDocs: () => void;
  onOpenCompare: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenJson,
  hasResult,
  onOpenApiDocs,
  onOpenCompare,
}) => {
  const [backendHealthy, setBackendHealthy] = useState<boolean | null>(null);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        setBackendHealthy(data.status === 'healthy');
      })
      .catch(() => setBackendHealthy(false));
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <NutriGuardLogo size={42} showText={true} />

        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Compare Foods button */}
          <button
            onClick={onOpenCompare}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
            title="Compare two food items side-by-side"
          >
            <ArrowRightLeft className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden sm:inline">Compare Foods</span>
          </button>

          {/* Backend API Docs button */}
          <button
            onClick={onOpenApiDocs}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
            title="Inspect REST API endpoints and cURL examples"
          >
            <Server className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span className="hidden sm:inline">Backend API</span>
          </button>

          {/* Strict JSON button if has result */}
          {hasResult && onOpenJson && (
            <button
              onClick={onOpenJson}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white shadow-sm transition-colors cursor-pointer"
              title="View Strict JSON Response"
            >
              <FileJson className="w-3.5 h-3.5 text-emerald-400 dark:text-white" />
              <span>Strict JSON</span>
            </button>
          )}

          {/* Live backend status pill */}
          <div className="flex items-center space-x-1.5 text-xs text-slate-700 dark:text-slate-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/60 rounded-full px-3 py-1">
            <span
              className={`w-2 h-2 rounded-full ${
                backendHealthy ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
              }`}
            />
            <span className="font-medium text-emerald-900 dark:text-emerald-300 hidden md:inline">
              Backend Online
            </span>
          </div>

          {/* Dark Mode Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer shadow-2xs"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle Dark Mode"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400 transition-transform rotate-0 hover:rotate-90 duration-300" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700 transition-transform -rotate-12 hover:rotate-0 duration-300" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
