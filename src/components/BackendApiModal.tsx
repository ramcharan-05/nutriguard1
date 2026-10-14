import React, { useState, useEffect } from 'react';
import { X, Server, CheckCircle2, AlertCircle, Copy, Check, Terminal, ExternalLink, Activity } from 'lucide-react';

interface BackendApiModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BackendApiModal: React.FC<BackendApiModalProps> = ({ isOpen, onClose }) => {
  const [healthData, setHealthData] = useState<any>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!isOpen) return;

    setLoading(true);
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        setHealthData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch health data', err);
        setLoading(false);
      });
  }, [isOpen]);

  if (!isOpen) return null;

  const endpoints = [
    {
      method: 'POST',
      path: '/api/analyze-food',
      description: 'Multimodal vision analysis of food packaging / label against patient profile.',
      exampleCurl: `curl -X POST http://localhost:3000/api/analyze-food \\
  -H "Content-Type: application/json" \\
  -d '{
    "imageBase64": "<base64_data>",
    "mimeType": "image/jpeg",
    "patientProfile": {
      "health_conditions": ["Hypertension (High BP)", "Type 2 Diabetes"],
      "allergies": ["Peanuts", "Gluten"]
    }
  }'`,
    },
    {
      method: 'POST',
      path: '/api/analyze-text',
      description: 'Text-based clinical analysis of ingredient statements or recipes.',
      exampleCurl: `curl -X POST http://localhost:3000/api/analyze-text \\
  -H "Content-Type: application/json" \\
  -d '{
    "foodText": "Enriched wheat flour, roasted peanuts, corn syrup, sodium 580mg",
    "patientProfile": {
      "health_conditions": ["Hypertension (High BP)", "Type 2 Diabetes"],
      "allergies": ["Peanuts", "Gluten"]
    }
  }'`,
    },
    {
      method: 'POST',
      path: '/api/compare-foods',
      description: 'Head-to-head clinical safety comparison between two food items.',
      exampleCurl: `curl -X POST http://localhost:3000/api/compare-foods \\
  -H "Content-Type: application/json" \\
  -d '{
    "itemA": "Steamed Quinoa Avocado Bowl",
    "itemB": "Teriyaki Chicken Rice",
    "patientProfile": {
      "health_conditions": ["Hypertension (High BP)", "Type 2 Diabetes"],
      "allergies": ["Peanuts", "Gluten"]
    }
  }'`,
    },
    {
      method: 'GET',
      path: '/api/patient-profiles',
      description: 'Retrieve pre-configured and custom patient medical profiles.',
      exampleCurl: `curl -X GET http://localhost:3000/api/patient-profiles`,
    },
    {
      method: 'GET',
      path: '/api/scans',
      description: 'Query diagnostic scan records with optional status filter.',
      exampleCurl: `curl -X GET "http://localhost:3000/api/scans?status=UNSAFE"`,
    },
    {
      method: 'GET',
      path: '/api/health',
      description: 'Backend healthcheck, uptime, and Gemini AI connectivity.',
      exampleCurl: `curl -X GET http://localhost:3000/api/health`,
    },
  ];

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col text-slate-100 max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-extrabold text-base text-white">NutriGuard Backend REST API</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Node.js Express + TS
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Full-stack API endpoints powered by Gemini 3.8 Flash
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Server Status Bar */}
        <div className="px-6 py-3 bg-slate-900 border-b border-slate-800/80 flex flex-wrap items-center justify-between text-xs gap-3">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-slate-400">Service:</span>
              <span className="font-bold text-emerald-400">
                {loading ? 'Checking...' : healthData?.status?.toUpperCase() || 'ONLINE'}
              </span>
            </div>

            <div className="flex items-center space-x-1.5">
              <Activity className="w-3.5 h-3.5 text-teal-400" />
              <span className="text-slate-400">Gemini AI Model:</span>
              <span className="font-mono text-white">gemini-3.8-flash</span>
            </div>

            {healthData && (
              <div className="hidden sm:flex items-center space-x-1.5">
                <span className="text-slate-400">Uptime:</span>
                <span className="font-mono text-slate-200">{healthData.uptime_seconds}s</span>
              </div>
            )}
          </div>

          <div className="text-xs text-slate-400 font-mono">
            Port: 3000 • In-memory Store: Active
          </div>
        </div>

        {/* Endpoints List */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          <p className="text-xs text-slate-400">
            Below are the active endpoints configured in <code className="text-emerald-400">server.ts</code>.
            Each endpoint can be consumed by external services, clinical clients, or mobile apps:
          </p>

          <div className="space-y-3">
            {endpoints.map((ep, idx) => (
              <div
                key={idx}
                className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded font-mono ${
                        ep.method === 'POST'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      }`}
                    >
                      {ep.method}
                    </span>
                    <span className="font-mono font-bold text-xs text-slate-200">{ep.path}</span>
                  </div>

                  <button
                    onClick={() => handleCopy(ep.exampleCurl, idx)}
                    className="inline-flex items-center space-x-1 text-[11px] px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  >
                    {copiedIndex === idx ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">cURL Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy cURL</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-xs text-slate-400">{ep.description}</p>

                <div className="relative bg-slate-900 rounded-lg p-3 text-[11px] font-mono text-emerald-300/90 overflow-x-auto border border-slate-800/80">
                  <pre>{ep.exampleCurl}</pre>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>Server-Side Gemini API Proxy Architecture</span>
          <span className="font-mono">HTTP/1.1 REST • JSON Schema Enforced</span>
        </div>
      </div>
    </div>
  );
};
