/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { PatientProfileCard } from './components/PatientProfileCard';
import { ImageUploader } from './components/ImageUploader';
import { AnalysisResults } from './components/AnalysisResults';
import { StrictJsonModal } from './components/StrictJsonModal';
import { CameraCaptureModal } from './components/CameraCaptureModal';
import { BackendApiModal } from './components/BackendApiModal';
import { CompareFoodsModal } from './components/CompareFoodsModal';
import { PatientProfile, FoodAnalysisResult, SampleFoodItem } from './types';
import { SAMPLE_FOODS, FALLBACK_RESULTS } from './data/sampleFoods';
import { AlertCircle, History, Clock, Sparkles } from 'lucide-react';

import { NutriGuardLogo } from './components/NutriGuardLogo';

const INITIAL_PATIENT: PatientProfile = {
  id: 'patient-primary',
  name: 'Primary: Hypertension + Type 2 Diabetes',
  health_conditions: ['Hypertension (High BP)', 'Type 2 Diabetes'],
  allergies: ['Peanuts', 'Gluten'],
  max_sodium_mg_per_meal: 500,
  max_sugar_g_per_meal: 10,
};

export default function App() {
  const [profile, setProfile] = useState<PatientProfile>(INITIAL_PATIENT);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedMimeType, setSelectedMimeType] = useState<string>('image/jpeg');
  const [currentSample, setCurrentSample] = useState<SampleFoodItem | undefined>(undefined);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<FoodAnalysisResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isJsonModalOpen, setIsJsonModalOpen] = useState<boolean>(false);
  const [isCameraModalOpen, setIsCameraModalOpen] = useState<boolean>(false);
  const [isApiDocsModalOpen, setIsApiDocsModalOpen] = useState<boolean>(false);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState<boolean>(false);
  const [recentAnalyses, setRecentAnalyses] = useState<FoodAnalysisResult[]>([]);

  // Load sample on mount so the user immediately has an item ready to analyze
  useEffect(() => {
    const firstSample = SAMPLE_FOODS[0];
    setCurrentSample(firstSample);

    import('./utils/imageUtils').then(({ svgToPngDataUrl }) => {
      svgToPngDataUrl(firstSample.previewUrl)
        .then((png) => {
          setSelectedImage(png);
          setSelectedMimeType('image/png');
        })
        .catch(() => {
          setSelectedImage(firstSample.previewUrl);
          setSelectedMimeType('image/svg+xml');
        });
    });

    // Fetch initial history from backend store
    fetch('/api/scans?limit=5')
      .then((res) => res.json())
      .then((data) => {
        if (data.scans && Array.isArray(data.scans)) {
          setRecentAnalyses(data.scans);
        }
      })
      .catch((err) => console.warn('Could not fetch initial scans', err));
  }, []);

  const handleImageSelected = (
    base64Image: string,
    mimeType: string,
    sampleItem?: SampleFoodItem
  ) => {
    setSelectedImage(base64Image);
    setSelectedMimeType(mimeType);
    setCurrentSample(sampleItem);
    setErrorMessage(null);
  };

  const handleClearImage = () => {
    setSelectedImage(null);
    setCurrentSample(undefined);
    setAnalysisResult(null);
    setErrorMessage(null);
  };

  const runAnalysis = async () => {
    if (!selectedImage) {
      setErrorMessage('Please select or upload a food packaging or label image first.');
      return;
    }

    setIsAnalyzing(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/analyze-food', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: selectedImage,
          mimeType: selectedMimeType,
          patientProfile: {
            health_conditions: profile.health_conditions,
            allergies: profile.allergies,
            name: profile.name,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze food label image.');
      }

      setAnalysisResult(data);
      setRecentAnalyses((prev) => [
        data,
        ...prev.filter((item) => item.food_name !== data.food_name).slice(0, 4),
      ]);
    } catch (err: any) {
      console.error('Analysis error:', err);
      if (currentSample && FALLBACK_RESULTS[currentSample.id]) {
        const fallback = FALLBACK_RESULTS[currentSample.id];
        setAnalysisResult(fallback);
        setErrorMessage(`Note: Using validated clinical reference data (${err.message})`);
      } else {
        setErrorMessage(
          err.message ||
            'Failed to analyze the image. Please ensure GEMINI_API_KEY is configured in Secrets or try another image.'
        );
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const runTextAnalysis = async (foodText: string) => {
    setIsAnalyzing(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/analyze-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          foodText,
          patientProfile: {
            health_conditions: profile.health_conditions,
            allergies: profile.allergies,
            name: profile.name,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze food text.');
      }

      setAnalysisResult(data);
      setRecentAnalyses((prev) => [
        data,
        ...prev.filter((item) => item.food_name !== data.food_name).slice(0, 4),
      ]);
    } catch (err: any) {
      console.error('Text analysis error:', err);
      setErrorMessage(err.message || 'Failed to evaluate food text.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col text-slate-900 dark:text-slate-100 selection:bg-emerald-500 selection:text-white transition-colors duration-200">
      <Header
        onOpenJson={() => setIsJsonModalOpen(true)}
        hasResult={!!analysisResult}
        onOpenApiDocs={() => setIsApiDocsModalOpen(true)}
        onOpenCompare={() => setIsCompareModalOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Intro Hero Notice */}
        <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-teal-950 dark:from-emerald-950 dark:via-slate-950 dark:to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-lg relative overflow-hidden border border-emerald-800/20 dark:border-emerald-700/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-3xl space-y-3 relative z-10">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Multi-Condition Dietary Safety Screener</span>
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Clinical Food Safety &amp; Nutrition Diagnostic
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Analyze packaging images, ingredient labels, and menu items against active clinical
              risk factors (Hypertension, Type 2 Diabetes, Peanuts, Gluten) with instant safety ratings.
            </p>
          </div>

          <div className="hidden md:flex shrink-0 items-center justify-center relative z-10">
            <NutriGuardLogo size={72} showText={false} className="shadow-2xl shadow-emerald-500/30 ring-2 ring-emerald-400/30 rounded-2xl" />
          </div>

          <div className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        </div>

        {/* Patient Profile Card (Context for all analysis) */}
        <PatientProfileCard
          profile={profile}
          onUpdateProfile={setProfile}
          disabled={isAnalyzing}
        />

        {/* Error notification if any */}
        {errorMessage && (
          <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-2xl p-4 flex items-start space-x-3 text-amber-900 dark:text-amber-200 text-xs sm:text-sm animate-in fade-in">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold">System Status: </span>
              {errorMessage}
            </div>
          </div>
        )}

        {/* Two Column Layout: Uploader / Selector on left, Results on right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs p-5 transition-colors">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wide mb-3 flex items-center space-x-2">
                <span>Select Label or Enter Ingredients</span>
              </h3>
              <ImageUploader
                onImageSelected={handleImageSelected}
                selectedImage={selectedImage}
                onClearImage={handleClearImage}
                onAnalyze={runAnalysis}
                onAnalyzeText={runTextAnalysis}
                isAnalyzing={isAnalyzing}
                onOpenCamera={() => setIsCameraModalOpen(true)}
              />
            </div>

            {/* Recent Screenings */}
            {recentAnalyses.length > 0 && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs p-5 transition-colors">
                <div className="flex items-center space-x-2 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">
                  <History className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Recent Diagnostic Scans</span>
                </div>
                <div className="space-y-2">
                  {recentAnalyses.map((item, idx) => (
                    <button
                      key={item.id || idx}
                      onClick={() => setAnalysisResult(item)}
                      className="w-full text-left p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-600 hover:bg-emerald-50/40 dark:hover:bg-slate-800/80 transition-colors flex items-center justify-between cursor-pointer"
                    >
                      <div className="truncate mr-2">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block truncate">
                          {item.food_name}
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                          {item.analyzed_at ? new Date(item.analyzed_at).toLocaleTimeString() : 'Recent'}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded whitespace-nowrap ${
                          item.safety_status === 'SAFE'
                            ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300'
                            : item.safety_status === 'CAUTION'
                            ? 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300'
                            : 'bg-rose-100 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300'
                        }`}
                      >
                        {item.safety_status} • {item.health_score}/10
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Results Column */}
          <div className="lg:col-span-7">
            {analysisResult ? (
              <AnalysisResults
                result={analysisResult}
                onOpenJson={() => setIsJsonModalOpen(true)}
                onScanAnother={() => {
                  window.scrollTo({ top: 300, behavior: 'smooth' });
                }}
              />
            ) : (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 p-12 text-center flex flex-col items-center justify-center space-y-4 min-h-[460px] transition-colors">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center">
                  <Clock className="w-8 h-8" />
                </div>
                <div className="max-w-md space-y-1.5">
                  <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                    Awaiting Diagnostic Run
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Select a sample label on the left, upload your own food photo, or paste ingredient text,
                    then execute the clinical safety screening.
                  </p>
                </div>
                <button
                  onClick={runAnalysis}
                  disabled={!selectedImage || isAnalyzing}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  Analyze Selected Image Now
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Strict JSON Modal */}
      <StrictJsonModal
        isOpen={isJsonModalOpen}
        onClose={() => setIsJsonModalOpen(false)}
        result={analysisResult}
      />

      {/* Camera Capture Modal */}
      <CameraCaptureModal
        isOpen={isCameraModalOpen}
        onClose={() => setIsCameraModalOpen(false)}
        onCapture={(dataUrl) => {
          setSelectedImage(dataUrl);
          setSelectedMimeType('image/jpeg');
          setCurrentSample(undefined);
        }}
      />

      {/* Backend API Documentation Modal */}
      <BackendApiModal
        isOpen={isApiDocsModalOpen}
        onClose={() => setIsApiDocsModalOpen(false)}
      />

      {/* Food Comparison Modal */}
      <CompareFoodsModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        profile={profile}
      />
    </div>
  );
}
