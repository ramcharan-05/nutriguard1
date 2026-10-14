import React, { useState } from 'react';
import { X, ArrowRightLeft, Sparkles, AlertCircle, ShieldCheck, AlertTriangle, XCircle, Check } from 'lucide-react';
import { PatientProfile, FoodComparisonResult, SafetyStatus } from '../types';

interface CompareFoodsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: PatientProfile;
}

export const CompareFoodsModal: React.FC<CompareFoodsModalProps> = ({
  isOpen,
  onClose,
  profile,
}) => {
  const [itemA, setItemA] = useState('Steamed Quinoa Avocado Bowl');
  const [itemB, setItemB] = useState('Sweet Teriyaki Chicken Rice with Soy Glaze');
  const [loading, setLoading] = useState(false);
  const [comparisonResult, setComparisonResult] = useState<FoodComparisonResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCompare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemA.trim() || !itemB.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/compare-foods', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemA,
          itemB,
          patientProfile: {
            health_conditions: profile.health_conditions,
            allergies: profile.allergies,
          },
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to compare foods');
      }

      setComparisonResult(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred during comparison.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: SafetyStatus) => {
    switch (status) {
      case 'SAFE':
        return (
          <span className="px-2 py-0.5 rounded text-xs font-black bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300">
            SAFE
          </span>
        );
      case 'CAUTION':
        return (
          <span className="px-2 py-0.5 rounded text-xs font-black bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300">
            CAUTION
          </span>
        );
      case 'UNSAFE':
      default:
        return (
          <span className="px-2 py-0.5 rounded text-xs font-black bg-rose-100 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300">
            UNSAFE
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col text-slate-900 dark:text-slate-100 max-h-[90vh] transition-colors">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-900 dark:bg-slate-950 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <ArrowRightLeft className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Compare Two Food Options</h3>
              <p className="text-[11px] text-slate-300">
                Screen both choices against active patient profile conditions and allergies
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

        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Input Form */}
          <form onSubmit={handleCompare} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Item A (Food / Dish / Brand)
                </label>
                <input
                  type="text"
                  value={itemA}
                  onChange={(e) => setItemA(e.target.value)}
                  placeholder="e.g. Steamed Salmon with Asparagus"
                  required
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Item B (Food / Dish / Brand)
                </label>
                <input
                  type="text"
                  value={itemB}
                  onChange={(e) => setItemB(e.target.value)}
                  placeholder="e.g. Crispy Teriyaki Chicken Bowl"
                  required
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Active screening: {profile.health_conditions.join(', ')} • {profile.allergies.join(', ')}
              </span>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-all cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Analyzing via Backend...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Run Head-to-Head Comparison</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Error display */}
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Comparison Result */}
          {comparisonResult && (
            <div className="space-y-4 pt-3 border-t border-slate-200 dark:border-slate-800">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Item A Card */}
                <div
                  className={`p-4 rounded-xl border transition-all ${
                    comparisonResult.safer_choice === 'ITEM_A'
                      ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Choice A</span>
                    {getStatusBadge(comparisonResult.item_a.safety_status as SafetyStatus)}
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
                    {comparisonResult.item_a.name}
                  </h4>
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Health Score: {comparisonResult.item_a.health_score} / 10
                  </div>
                  {comparisonResult.safer_choice === 'ITEM_A' && (
                    <div className="mt-2 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 flex items-center space-x-1">
                      <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>Recommended Choice</span>
                    </div>
                  )}
                </div>

                {/* Item B Card */}
                <div
                  className={`p-4 rounded-xl border transition-all ${
                    comparisonResult.safer_choice === 'ITEM_B'
                      ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Choice B</span>
                    {getStatusBadge(comparisonResult.item_b.safety_status as SafetyStatus)}
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
                    {comparisonResult.item_b.name}
                  </h4>
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Health Score: {comparisonResult.item_b.health_score} / 10
                  </div>
                  {comparisonResult.safer_choice === 'ITEM_B' && (
                    <div className="mt-2 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 flex items-center space-x-1">
                      <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>Recommended Choice</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Clinical Rationale */}
              <div className="bg-slate-50 dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-1">
                  Clinical Rationale:
                </h5>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  {comparisonResult.clinical_rationale}
                </p>
              </div>

              {/* Key Differences */}
              {comparisonResult.key_differences && comparisonResult.key_differences.length > 0 && (
                <div>
                  <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2">
                    Key Nutritional Differences:
                  </h5>
                  <ul className="space-y-1.5">
                    {comparisonResult.key_differences.map((diff: string, i: number) => (
                      <li key={i} className="text-xs text-slate-600 dark:text-slate-300 flex items-start space-x-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                        <span>{diff}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
