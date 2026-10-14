import React from 'react';
import { NutritionalFacts } from '../types';
import { Activity, AlertCircle, CheckCircle2, Flame, Droplet } from 'lucide-react';

interface NutritionFactsBadgeProps {
  facts?: NutritionalFacts;
  ingredients?: string[];
  allergens?: string[];
}

export const NutritionFactsBadge: React.FC<NutritionFactsBadgeProps> = ({
  facts,
  ingredients = [],
  allergens = [],
}) => {
  if (!facts && ingredients.length === 0) return null;

  const sodium = facts?.sodium_mg ?? null;
  const totalSugars = facts?.total_sugars_g ?? null;
  const addedSugars = facts?.added_sugars_g ?? null;
  const carbs = facts?.total_carbs_g ?? null;
  const fiber = facts?.fiber_g ?? null;
  const calories = facts?.calories ?? null;
  const protein = facts?.protein_g ?? null;

  // AHA recommends max 1500mg/day for hypertension. A single meal is ideally under 500mg.
  const sodiumPercent = sodium !== null ? Math.min(100, Math.round((sodium / 500) * 100)) : 0;
  const isHighSodium = sodium !== null && sodium > 400;

  // Sugar alert for diabetes
  const isHighSugar = (totalSugars !== null && totalSugars > 10) || (addedSugars !== null && addedSugars > 5);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs overflow-hidden transition-colors">
      {/* Header */}
      <div className="bg-slate-900 dark:bg-slate-950 text-white px-5 py-3 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-emerald-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider">
            Extracted Nutritional Facts &amp; Chemical Profile
          </h3>
        </div>
        {facts?.serving_size && (
          <span className="text-xs text-slate-300 dark:text-slate-400 font-mono">
            Serving: {facts.serving_size}
          </span>
        )}
      </div>

      <div className="p-5 space-y-5">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Sodium Card */}
          <div
            className={`p-3.5 rounded-xl border transition-colors ${
              isHighSodium
                ? 'bg-rose-50/70 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/80 text-rose-950 dark:text-rose-200'
                : 'bg-emerald-50/60 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/80 text-emerald-950 dark:text-emerald-200'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-bold mb-1">
              <span>Sodium (Hypertension)</span>
              {isHighSodium ? (
                <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              )}
            </div>
            <div className="text-2xl font-black font-mono">
              {sodium !== null ? `${sodium} mg` : 'N/A'}
            </div>
            <div className="mt-2 w-full bg-slate-200/80 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  isHighSodium ? 'bg-rose-600 dark:bg-rose-500' : 'bg-emerald-600 dark:bg-emerald-500'
                }`}
                style={{ width: `${sodiumPercent}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
              Target for meal: &lt;500mg (AHA limit)
            </p>
          </div>

          {/* Sugars Card */}
          <div
            className={`p-3.5 rounded-xl border transition-colors ${
              isHighSugar
                ? 'bg-amber-50/70 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/80 text-amber-950 dark:text-amber-200'
                : 'bg-emerald-50/60 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/80 text-emerald-950 dark:text-emerald-200'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-bold mb-1">
              <span>Sugars (Diabetes)</span>
              {isHighSugar ? (
                <Droplet className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              )}
            </div>
            <div className="text-2xl font-black font-mono">
              {totalSugars !== null ? `${totalSugars} g` : 'N/A'}
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium mt-1">
              {addedSugars !== null ? `(${addedSugars}g added)` : 'Low glycemic focus'}
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              {facts?.glycemic_index_rating ? `GI: ${facts.glycemic_index_rating}` : 'Target: <5g added'}
            </p>
          </div>

          {/* Carbohydrates & Fiber */}
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 transition-colors">
            <div className="text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Total Carbs / Fiber</div>
            <div className="text-2xl font-black font-mono">
              {carbs !== null ? `${carbs} g` : 'N/A'}
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium mt-1">
              {fiber !== null ? `Fiber: ${fiber}g` : 'Dietary fiber'}
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              {carbs !== null && fiber !== null
                ? `Net carbs: ${Math.max(0, carbs - fiber)}g`
                : 'Fiber slows glucose spike'}
            </p>
          </div>

          {/* Calories & Protein */}
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 transition-colors">
            <div className="flex items-center space-x-1 text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>Energy &amp; Protein</span>
            </div>
            <div className="text-2xl font-black font-mono">
              {calories !== null ? `${calories}` : 'N/A'}
              <span className="text-xs font-normal text-slate-500 dark:text-slate-400 ml-1">kcal</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium mt-1">
              {protein !== null ? `Protein: ${protein}g` : 'Satiety profile'}
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">Essential macronutrients</p>
          </div>
        </div>

        {/* Flagged Allergens Banner */}
        {allergens.length > 0 && (
          <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 rounded-xl p-3.5 flex items-start space-x-3 transition-colors">
            <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-rose-900 dark:text-rose-200 uppercase tracking-wider">
                Allergen Alert Detected in Product:
              </h4>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {allergens.map((alg) => (
                  <span
                    key={alg}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold bg-rose-200 dark:bg-rose-900/60 text-rose-900 dark:text-rose-200"
                  >
                    ⚠ {alg}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Extracted Ingredients statement */}
        {ingredients.length > 0 && (
          <div>
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Identified Ingredients List:
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {ingredients.map((ing, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium border border-slate-200 dark:border-slate-700"
                >
                  {ing}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
