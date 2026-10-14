import React, { useState } from 'react';
import { X, Copy, Check, Download, FileJson } from 'lucide-react';
import { FoodAnalysisResult } from '../types';

interface StrictJsonModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: FoodAnalysisResult | null;
}

export const StrictJsonModal: React.FC<StrictJsonModalProps> = ({
  isOpen,
  onClose,
  result,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !result) return null;

  // Strict JSON conforming exactly to user's required keys
  const strictJsonObject = {
    food_name: result.food_name,
    safety_status: result.safety_status,
    health_score: result.health_score,
    key_risks: result.key_risks,
    clinical_explanation: result.clinical_explanation,
    healthy_alternatives: result.healthy_alternatives.map((alt) => {
      if (typeof alt === 'string') return alt;
      return `${alt.name}: ${alt.why_better}`;
    }),
  };

  const jsonString = JSON.stringify(strictJsonObject, null, 2);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${result.food_name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_analysis.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col text-slate-100 max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <FileJson className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Strict JSON Output</h3>
              <p className="text-[11px] text-slate-400 font-mono">
                keys: "food_name", "safety_status", "health_score", "key_risks", "clinical_explanation", "healthy_alternatives"
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-medium">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy JSON</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownload}
              className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs text-white font-medium transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* JSON Code block */}
        <div className="p-4 overflow-auto flex-1 font-mono text-xs text-emerald-300 bg-slate-950/90 leading-relaxed">
          <pre>{jsonString}</pre>
        </div>

        <div className="px-5 py-3 bg-slate-950 border-t border-slate-800 text-right text-[11px] text-slate-400">
          Valid JSON Schema • Standard Medical Diagnostic Serialization
        </div>
      </div>
    </div>
  );
};
