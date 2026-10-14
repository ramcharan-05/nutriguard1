import React, { useState, useEffect } from 'react';
import { User, Heart, AlertTriangle, Plus, X, SlidersHorizontal, Check } from 'lucide-react';
import { PatientProfile } from '../types';

interface PatientProfileCardProps {
  profile: PatientProfile;
  onUpdateProfile: (updated: PatientProfile) => void;
  disabled?: boolean;
}

const COMMON_CONDITIONS = [
  'Hypertension (High BP)',
  'Type 2 Diabetes',
  'Chronic Kidney Disease (CKD)',
  'High Cholesterol (Hyperlipidemia)',
  'GERD / Acid Reflux',
  'Celiac Disease',
  'Gout',
];

const COMMON_ALLERGIES = [
  'Peanuts',
  'Gluten',
  'Tree Nuts',
  'Dairy / Milk',
  'Shellfish',
  'Soy',
  'Eggs',
  'Sesame',
];

export const PatientProfileCard: React.FC<PatientProfileCardProps> = ({
  profile,
  onUpdateProfile,
  disabled = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newCondition, setNewCondition] = useState('');
  const [newAllergy, setNewAllergy] = useState('');
  const [backendPresets, setBackendPresets] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/patient-profiles')
      .then((res) => res.json())
      .then((data) => {
        if (data.profiles) setBackendPresets(data.profiles);
      })
      .catch((err) => console.warn('Could not load backend profiles', err));
  }, []);

  const toggleCondition = (item: string) => {
    if (disabled) return;
    const exists = profile.health_conditions.includes(item);
    const updated = exists
      ? profile.health_conditions.filter((c) => c !== item)
      : [...profile.health_conditions, item];
    onUpdateProfile({ ...profile, health_conditions: updated });
  };

  const toggleAllergy = (item: string) => {
    if (disabled) return;
    const exists = profile.allergies.includes(item);
    const updated = exists
      ? profile.allergies.filter((a) => a !== item)
      : [...profile.allergies, item];
    onUpdateProfile({ ...profile, allergies: updated });
  };

  const handleAddCustomCondition = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCondition.trim() || disabled) return;
    if (!profile.health_conditions.includes(newCondition.trim())) {
      onUpdateProfile({
        ...profile,
        health_conditions: [...profile.health_conditions, newCondition.trim()],
      });
    }
    setNewCondition('');
  };

  const handleAddCustomAllergy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAllergy.trim() || disabled) return;
    if (!profile.allergies.includes(newAllergy.trim())) {
      onUpdateProfile({
        ...profile,
        allergies: [...profile.allergies, newAllergy.trim()],
      });
    }
    setNewAllergy('');
  };

  const selectPreset = (preset: any) => {
    onUpdateProfile({
      id: preset.id,
      name: preset.name,
      health_conditions: preset.health_conditions,
      allergies: preset.allergies,
      max_sodium_mg_per_meal: preset.max_sodium_mg_per_meal || 400,
      max_sugar_g_per_meal: preset.max_sugar_g_per_meal || 8,
    });
  };

  const resetToPromptDefaults = () => {
    onUpdateProfile({
      id: 'patient-primary',
      name: 'Clinical Patient Record #8291',
      health_conditions: ['Hypertension (High BP)', 'Type 2 Diabetes'],
      allergies: ['Peanuts', 'Gluten'],
      max_sodium_mg_per_meal: 500,
      max_sugar_g_per_meal: 10,
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
      {/* Header bar */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white px-5 py-3.5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-sm">
            <User className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-bold tracking-wide text-white">
                PATIENT MEDICAL PROFILE
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                Evaluation Context
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Analysis strictly screens nutritional facts against these clinical risk factors
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            disabled={disabled}
            className="flex items-center space-x-1 text-xs px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 text-slate-200 transition-colors cursor-pointer disabled:opacity-50"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{isEditing ? 'Done' : 'Customize Profile'}</span>
          </button>
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* Conditions Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              <Heart className="w-4 h-4 text-rose-500" />
              <span>Health Conditions ({profile.health_conditions.length})</span>
            </div>
            {isEditing && (
              <span className="text-[11px] text-slate-400">Click to add/remove</span>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {profile.health_conditions.map((condition) => (
              <span
                key={condition}
                className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800/80 shadow-2xs"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-2" />
                {condition}
                {isEditing && (
                  <button
                    onClick={() => toggleCondition(condition)}
                    className="ml-2 text-rose-500 hover:text-rose-700 dark:hover:text-rose-300"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </span>
            ))}

            {isEditing && (
              <form onSubmit={handleAddCustomCondition} className="inline-flex items-center">
                <input
                  type="text"
                  placeholder="+ custom condition"
                  value={newCondition}
                  onChange={(e) => setNewCondition(e.target.value)}
                  className="text-xs px-2.5 py-1 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500 w-36"
                />
              </form>
            )}
          </div>

          {/* Preset condition picker during edit */}
          {isEditing && (
            <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-1.5 font-medium">Quick add conditions:</p>
              <div className="flex flex-wrap gap-1.5">
                {COMMON_CONDITIONS.map((c) => {
                  const active = profile.health_conditions.includes(c);
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => toggleCondition(c)}
                      className={`text-[11px] px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                        active
                          ? 'bg-rose-100 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-700 font-medium'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      {active ? '✓ ' : '+ '}
                      {c}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Known Allergies Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>Known Allergies &amp; Intolerances ({profile.allergies.length})</span>
            </div>
            {isEditing && (
              <span className="text-[11px] text-slate-400">Click to add/remove</span>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {profile.allergies.map((allergy) => (
              <span
                key={allergy}
                className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 border border-amber-300/80 dark:border-amber-800/80 shadow-2xs"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-2" />
                {allergy}
                {isEditing && (
                  <button
                    onClick={() => toggleAllergy(allergy)}
                    className="ml-2 text-amber-600 hover:text-amber-800 dark:hover:text-amber-300"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </span>
            ))}

            {isEditing && (
              <form onSubmit={handleAddCustomAllergy} className="inline-flex items-center">
                <input
                  type="text"
                  placeholder="+ custom allergy"
                  value={newAllergy}
                  onChange={(e) => setNewAllergy(e.target.value)}
                  className="text-xs px-2.5 py-1 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 w-32"
                />
              </form>
            )}
          </div>

          {/* Preset allergy picker during edit */}
          {isEditing && (
            <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-1.5 font-medium">Quick add allergies:</p>
              <div className="flex flex-wrap gap-1.5">
                {COMMON_ALLERGIES.map((a) => {
                  const active = profile.allergies.includes(a);
                  return (
                    <button
                      key={a}
                      type="button"
                      onClick={() => toggleAllergy(a)}
                      className={`text-[11px] px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                        active
                          ? 'bg-amber-100 dark:bg-amber-950/70 text-amber-900 dark:text-amber-300 border-amber-300 dark:border-amber-700 font-medium'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      {active ? '✓ ' : '+ '}
                      {a}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Backend Preset Templates Selector */}
        {backendPresets.length > 0 && (
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1.5">
              Load Preset Clinical Template:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {backendPresets.map((preset) => {
                const isCurrent = profile.name === preset.name || profile.id === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => selectPreset(preset)}
                    className={`text-xs px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-2xs'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    {preset.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Clinical Guardrails Bar */}
        <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3 border border-slate-200/80 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-slate-600 dark:text-slate-400">Sodium Threshold:</span>
            <span className="font-bold text-slate-900 dark:text-slate-100">&lt; 300mg / meal</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-slate-600 dark:text-slate-400">Added Sugar Limit:</span>
            <span className="font-bold text-slate-900 dark:text-slate-100">0g - 5g max</span>
          </div>
          <div className="flex items-center justify-between sm:justify-end">
            <button
              onClick={resetToPromptDefaults}
              className="text-[11px] text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300 font-semibold underline underline-offset-2 cursor-pointer"
            >
              Reset to Prompt Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
