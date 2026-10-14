import React from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  XCircle,
  HeartPulse,
  Sparkles,
  ArrowRight,
  FileJson,
  CheckCircle2,
  Stethoscope,
  Info,
  Scale,
  Award,
} from 'lucide-react';
import { FoodAnalysisResult, HealthyAlternative, SafetyStatus } from '../types';
import { NutritionFactsBadge } from './NutritionFactsBadge';

interface AnalysisResultsProps {
  result: FoodAnalysisResult;
  onOpenJson: () => void;
  onScanAnother: () => void;
}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({
  result,
  onOpenJson,
  onScanAnother,
}) => {
  const isSafe = result.safety_status === 'SAFE';
  const isCaution = result.safety_status === 'CAUTION';
  const isUnsafe = result.safety_status === 'UNSAFE';

  // Badge styles
  const getBadgeConfig = (status: SafetyStatus) => {
    switch (status) {
      case 'SAFE':
        return {
          bg: 'bg-emerald-500',
          lightBg: 'bg-emerald-50 dark:bg-emerald-950/30',
          border: 'border-emerald-300 dark:border-emerald-800',
          text: 'text-emerald-950 dark:text-emerald-100',
          icon: ShieldCheck,
          label: 'SAFE FOR PATIENT',
          sublabel: 'Meets hypertension, diabetes & allergen guardrails',
          scoreColor: 'text-emerald-600 dark:text-emerald-400',
          meterBg: 'bg-emerald-500',
        };
      case 'CAUTION':
        return {
          bg: 'bg-amber-500',
          lightBg: 'bg-amber-50 dark:bg-amber-950/30',
          border: 'border-amber-300 dark:border-amber-800',
          text: 'text-amber-950 dark:text-amber-100',
          icon: AlertTriangle,
          label: 'CONSUME WITH CAUTION',
          sublabel: 'Requires portion control or contains borderline sodium/carbs',
          scoreColor: 'text-amber-600 dark:text-amber-400',
          meterBg: 'bg-amber-500',
        };
      case 'UNSAFE':
      default:
        return {
          bg: 'bg-rose-600',
          lightBg: 'bg-rose-50 dark:bg-rose-950/30',
          border: 'border-rose-300 dark:border-rose-800',
          text: 'text-rose-950 dark:text-rose-100',
          icon: XCircle,
          label: 'UNSAFE / CONTRAINDICATED',
          sublabel: 'Violates patient allergens or therapeutic nutrition limits',
          scoreColor: 'text-rose-600 dark:text-rose-400',
          meterBg: 'bg-rose-600',
        };
    }
  };

  const badge = getBadgeConfig(result.safety_status);
  const StatusIcon = badge.icon;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Primary Diagnosis Hero Banner */}
      <div
        className={`rounded-2xl border ${badge.border} ${badge.lightBg} p-6 shadow-sm relative overflow-hidden transition-colors`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Status & Name */}
          <div className="space-y-2">
            <div
              className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-black tracking-wider uppercase text-white shadow-sm"
              style={{ backgroundColor: isSafe ? '#059669' : isCaution ? '#d97706' : '#dc2626' }}
            >
              <StatusIcon className="w-4 h-4" />
              <span>{badge.label}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {result.food_name}
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl">
              {badge.sublabel}
            </p>
          </div>

          {/* Safety Rating 1 to 10 Gauge */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200/90 dark:border-slate-700 shadow-2xs flex items-center space-x-4 self-start md:self-auto min-w-[210px] transition-colors">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-100 dark:text-slate-700"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={badge.scoreColor}
                  strokeDasharray={`${result.health_score * 10}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className={`text-xl font-black ${badge.scoreColor}`}>
                  {result.health_score}
                </span>
                <span className="text-[9px] text-slate-400 font-bold -mt-1">/ 10</span>
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Safety Rating
              </span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
                {result.health_score >= 8
                  ? 'Therapeutic'
                  : result.health_score >= 5
                  ? 'Moderate Risk'
                  : 'Hazardous'}
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Patient Compatibility
              </p>
            </div>
          </div>
        </div>

        {/* Action bar inside banner */}
        <div className="mt-5 pt-4 border-t border-slate-200/60 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2 text-xs text-slate-600 dark:text-slate-300 font-medium">
            <HeartPulse className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Screened against: Hypertension, Type 2 Diabetes, Peanuts &amp; Gluten</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onOpenJson}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white transition-colors cursor-pointer"
            >
              <FileJson className="w-3.5 h-3.5 text-emerald-400 dark:text-white" />
              <span>Inspect JSON</span>
            </button>
            <button
              onClick={onScanAnother}
              className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
            >
              <span>Scan Another</span>
            </button>
          </div>
        </div>
      </div>

      {/* Clinical Explanation */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs p-5 space-y-3 transition-colors">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-800 flex items-center justify-center">
            <Stethoscope className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wide">
            Clinical Diagnostic Explanation
          </h3>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-mono">
            Medical Rationale
          </span>
        </div>

        <p className="text-slate-800 dark:text-slate-200 text-sm leading-relaxed font-medium bg-slate-50/80 dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200/70 dark:border-slate-700 border-l-4 border-l-emerald-600">
          {result.clinical_explanation}
        </p>
      </div>

      {/* Specific Nutritional Risks */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs p-5 space-y-4 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wide">
              Specific Nutritional &amp; Clinical Risks ({result.key_risks.length})
            </h3>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            Pathological impact markers
          </span>
        </div>

        <div className="space-y-2.5">
          {result.key_risks.map((risk, index) => (
            <div
              key={index}
              className="flex items-start space-x-3 p-3 rounded-xl bg-slate-50/90 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700 text-xs sm:text-sm text-slate-800 dark:text-slate-200"
            >
              <span className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 shrink-0" />
              <span className="font-medium leading-relaxed">{risk}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Extracted Nutrition Facts & Ingredients */}
      <NutritionFactsBadge
        facts={result.nutritional_facts}
        ingredients={result.key_ingredients}
        allergens={result.allergens_detected}
      />

      {/* Clinical Condition Specific Impact Cards */}
      {result.medical_breakdown && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-1.5 transition-colors">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-rose-700 dark:text-rose-400 uppercase">
              <HeartPulse className="w-4 h-4" />
              <span>Hypertension Impact</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {result.medical_breakdown.hypertension_impact}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-1.5 transition-colors">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-700 dark:text-amber-400 uppercase">
              <Scale className="w-4 h-4" />
              <span>Diabetes &amp; Glycemic Impact</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {result.medical_breakdown.diabetes_impact}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-1.5 transition-colors">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase">
              <Award className="w-4 h-4" />
              <span>Allergen Verification</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {result.medical_breakdown.allergy_impact}
            </p>
          </div>
        </div>
      )}

      {/* Healthier Alternatives */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs p-5 space-y-4 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wide">
                Recommended Healthier Alternative Food Options
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Tailored for hypertension &amp; diabetes protection without peanuts or gluten
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
            {result.healthy_alternatives.length} Swaps Available
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {result.healthy_alternatives.map((alt, index) => {
            const isObj = typeof alt === 'object' && alt !== null;
            const name = isObj ? (alt as HealthyAlternative).name : alt;
            const whyBetter = isObj
              ? (alt as HealthyAlternative).why_better
              : 'Significantly lower in sodium, low glycemic index, and hypoallergenic.';
            const desc = isObj ? (alt as HealthyAlternative).description : '';

            return (
              <div
                key={index}
                className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-800/80 bg-gradient-to-br from-emerald-50/50 to-teal-50/30 dark:from-emerald-950/40 dark:to-teal-950/20 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all flex flex-col justify-between space-y-3"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                      Option #{index + 1}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm leading-snug">
                    {name}
                  </h4>
                  {desc && <p className="text-xs text-slate-600 dark:text-slate-300">{desc}</p>}
                </div>

                <div className="pt-2 border-t border-emerald-200/60 dark:border-emerald-800/60">
                  <p className="text-xs text-emerald-950 dark:text-emerald-200 font-medium">
                    <span className="font-bold text-emerald-800 dark:text-emerald-300">Why it's better: </span>
                    {whyBetter}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
