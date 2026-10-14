import React, { useRef, useState, useCallback, useEffect } from 'react';
import {
  UploadCloud,
  Camera,
  Image as ImageIcon,
  Sparkles,
  RotateCcw,
  Layers,
  FileText,
} from 'lucide-react';
import { SAMPLE_FOODS } from '../data/sampleFoods';
import { SampleFoodItem } from '../types';
import { svgToPngDataUrl, optimizeImageForVision } from '../utils/imageUtils';

interface ImageUploaderProps {
  onImageSelected: (base64Image: string, mimeType: string, sampleItem?: SampleFoodItem) => void;
  selectedImage: string | null;
  onClearImage: () => void;
  onAnalyze: () => void;
  onAnalyzeText: (text: string) => void;
  isAnalyzing: boolean;
  onOpenCamera: () => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageSelected,
  selectedImage,
  onClearImage,
  onAnalyze,
  onAnalyzeText,
  isAnalyzing,
  onOpenCamera,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<'image' | 'text'>('image');
  const [inputText, setInputText] = useState(
    'Enriched wheat flour, roasted peanuts, corn syrup, palm oil, salt (sodium 560mg per serving). May contain traces of tree nuts and soy.'
  );
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedSampleId, setSelectedSampleId] = useState<string | null>(null);

  // Handle clipboard paste for images
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (isAnalyzing || activeTab !== 'image') return;
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            processFile(file);
          }
          break;
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [isAnalyzing, activeTab]);

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const result = e.target?.result as string;
      if (result) {
        setSelectedSampleId(null);
        try {
          const optimized = await optimizeImageForVision(result);
          onImageSelected(optimized.dataUrl, optimized.mimeType);
        } catch {
          onImageSelected(result, file.type || 'image/jpeg');
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files?.[0];
      if (file && file.type.startsWith('image/')) {
        processFile(file);
      }
    },
    []
  );

  const handleSampleClick = async (sample: SampleFoodItem) => {
    setActiveTab('image');
    setSelectedSampleId(sample.id);
    try {
      const pngData = await svgToPngDataUrl(sample.previewUrl);
      onImageSelected(pngData, 'image/png', sample);
    } catch {
      onImageSelected(sample.previewUrl, 'image/svg+xml', sample);
    }
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onAnalyzeText(inputText.trim());
  };

  return (
    <div className="space-y-4">
      {/* Mode Tabs */}
      <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl transition-colors">
        <button
          type="button"
          onClick={() => setActiveTab('image')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
            activeTab === 'image'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Label Image / Photo</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('text')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
            activeTab === 'text'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Ingredient Text / Recipe</span>
        </button>
      </div>

      {activeTab === 'text' ? (
        /* Text Analysis Mode */
        <form onSubmit={handleTextSubmit} className="space-y-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 transition-colors">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Paste Ingredients, Nutrition Facts, or Meal Description:
            </label>
            <textarea
              rows={5}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="e.g. Ingredients: Whole grain wheat, canola oil, salt, peanuts..."
              className="w-full text-xs p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-slate-800 dark:text-slate-100 leading-relaxed transition-colors"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-slate-400 dark:text-slate-500">
              Evaluated via <code className="text-emerald-700 dark:text-emerald-400 font-mono">POST /api/analyze-text</code>
            </span>

            <button
              type="submit"
              disabled={isAnalyzing || !inputText.trim()}
              className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Analyzing Ingredients...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Analyze Text Statement</span>
                </>
              )}
            </button>
          </div>
        </form>
      ) : (
        /* Image Mode */
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-2xl transition-all p-6 text-center ${
            isDragOver
              ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/20'
              : selectedImage
              ? 'border-emerald-300 dark:border-emerald-800 bg-slate-50/70 dark:bg-slate-900/50'
              : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-slate-400 dark:hover:border-slate-600'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          {selectedImage ? (
            <div className="flex flex-col items-center">
              <div className="relative group max-w-sm w-full rounded-xl overflow-hidden border border-slate-300 dark:border-slate-700 shadow-md bg-white dark:bg-slate-800">
                <img
                  src={selectedImage}
                  alt="Food or Label Preview"
                  className="w-full h-56 object-contain p-2 bg-slate-50 dark:bg-slate-900/60"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold shadow hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                  >
                    Change Image
                  </button>
                  <button
                    type="button"
                    onClick={onClearImage}
                    className="px-3 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-semibold shadow hover:bg-rose-700 cursor-pointer"
                  >
                    Clear
                  </button>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={onAnalyze}
                  disabled={isAnalyzing}
                  className="inline-flex items-center space-x-2 px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-md shadow-emerald-600/30 transition-all transform active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Analyzing via Backend...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Run Clinical Safety Diagnostic</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={onClearImage}
                  disabled={isAnalyzing}
                  className="inline-flex items-center space-x-1.5 px-4 py-3 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold transition-colors cursor-pointer disabled:opacity-40"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="py-6 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800 mx-auto flex items-center justify-center shadow-inner">
                <UploadCloud className="w-8 h-8" />
              </div>

              <div>
                <p className="text-base font-bold text-slate-800 dark:text-slate-100">
                  Upload Food Packaging, Meal Photo, or Nutrition Label
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
                  Drag and drop your image here, browse your files, or paste from your clipboard.
                  The backend calls Gemini 3.8 Flash to extract sodium, sugars, and allergen statements.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
                >
                  <ImageIcon className="w-4 h-4" />
                  <span>Browse Files</span>
                </button>

                <button
                  type="button"
                  onClick={onOpenCamera}
                  className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
                >
                  <Camera className="w-4 h-4 text-emerald-400" />
                  <span>Scan with Camera</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Preset Test Labels Gallery */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/90 dark:border-slate-800 shadow-2xs transition-colors">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Quick Test Labels (1-Click Evaluation)
            </span>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:inline">
            Includes high-sodium, allergen-containing, and healthy certified profiles
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {SAMPLE_FOODS.map((sample) => {
            const isSelected = selectedSampleId === sample.id && activeTab === 'image';
            const isUnsafe = sample.expectedOutcome === 'UNSAFE';

            return (
              <button
                key={sample.id}
                type="button"
                onClick={() => handleSampleClick(sample)}
                disabled={isAnalyzing}
                className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 shadow-sm ring-2 ring-emerald-500/20'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                        isUnsafe
                          ? 'bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                          : 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                      }`}
                    >
                      {sample.expectedOutcome}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{sample.category}</span>
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100 leading-snug line-clamp-1">
                    {sample.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                    {sample.subtitle}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
                  <span>Load Label</span>
                  <span>→</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
