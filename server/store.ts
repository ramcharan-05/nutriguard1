import { FoodAnalysisResult, PatientProfileRecord } from './types';

// Preset Clinical Profiles for Quick Clinical Selection
export const PRESET_PROFILES: PatientProfileRecord[] = [
  {
    id: 'primary-hypertension-diabetes',
    name: 'Primary: Hypertension + Type 2 Diabetes',
    description: 'Requires low sodium (<300mg/meal) and strict glycemic control with zero peanuts or gluten.',
    health_conditions: ['Hypertension (High BP)', 'Type 2 Diabetes'],
    allergies: ['Peanuts', 'Gluten'],
    max_sodium_mg_per_meal: 400,
    max_sugar_g_per_meal: 8,
    is_preset: true,
  },
  {
    id: 'cardiac-celiac',
    name: 'Cardiovascular Care & Celiac',
    description: 'Focuses on low saturated fats, arterial protection, and 100% certified gluten-free diet.',
    health_conditions: ['Coronary Artery Disease', 'High Cholesterol (Hyperlipidemia)', 'Celiac Disease'],
    allergies: ['Gluten', 'Dairy / Milk'],
    max_sodium_mg_per_meal: 500,
    max_sugar_g_per_meal: 12,
    is_preset: true,
  },
  {
    id: 'renal-diet',
    name: 'Renal Protective & Low Sodium',
    description: 'Severe sodium restriction, monitored phosphorus & potassium for renal health.',
    health_conditions: ['Chronic Kidney Disease (CKD)', 'Hypertension (High BP)'],
    allergies: ['Shellfish', 'Soy'],
    max_sodium_mg_per_meal: 300,
    max_sugar_g_per_meal: 10,
    is_preset: true,
  },
  {
    id: 'diabetic-severe-allergies',
    name: 'Diabetic & Multi-Allergen Alert',
    description: 'Carbohydrate counting with strict avoidance of tree nuts, peanuts, and sesame.',
    health_conditions: ['Type 2 Diabetes', 'Metabolic Syndrome'],
    allergies: ['Peanuts', 'Tree Nuts', 'Sesame', 'Eggs'],
    max_sodium_mg_per_meal: 600,
    max_sugar_g_per_meal: 6,
    is_preset: true,
  },
];

class BackendDataStore {
  private profiles: Map<string, PatientProfileRecord> = new Map();
  private scans: Map<string, FoodAnalysisResult> = new Map();

  constructor() {
    // Initialize with presets
    for (const p of PRESET_PROFILES) {
      this.profiles.set(p.id, p);
    }
  }

  // Profile operations
  getProfiles(): PatientProfileRecord[] {
    return Array.from(this.profiles.values());
  }

  getProfile(id: string): PatientProfileRecord | undefined {
    return this.profiles.get(id);
  }

  saveProfile(profile: PatientProfileRecord): PatientProfileRecord {
    this.profiles.set(profile.id, profile);
    return profile;
  }

  deleteProfile(id: string): boolean {
    const p = this.profiles.get(id);
    if (p?.is_preset) return false; // Prevent deleting defaults
    return this.profiles.delete(id);
  }

  // Scan operations
  getScans(status?: string, limit = 25): FoodAnalysisResult[] {
    let list = Array.from(this.scans.values()).sort(
      (a, b) => new Date(b.analyzed_at).getTime() - new Date(a.analyzed_at).getTime()
    );
    if (status) {
      list = list.filter((s) => s.safety_status.toUpperCase() === status.toUpperCase());
    }
    return list.slice(0, limit);
  }

  getScan(id: string): FoodAnalysisResult | undefined {
    return this.scans.get(id);
  }

  saveScan(scan: FoodAnalysisResult): FoodAnalysisResult {
    this.scans.set(scan.id, scan);
    return scan;
  }

  deleteScan(id: string): boolean {
    return this.scans.delete(id);
  }

  clearScans(): void {
    this.scans.clear();
  }

  getStats() {
    const all = Array.from(this.scans.values());
    const safeCount = all.filter((s) => s.safety_status === 'SAFE').length;
    const cautionCount = all.filter((s) => s.safety_status === 'CAUTION').length;
    const unsafeCount = all.filter((s) => s.safety_status === 'UNSAFE').length;
    const avgScore =
      all.length > 0
        ? Math.round((all.reduce((acc, s) => acc + s.health_score, 0) / all.length) * 10) / 10
        : 0;

    return {
      total_scans: all.length,
      safe_count: safeCount,
      caution_count: cautionCount,
      unsafe_count: unsafeCount,
      average_health_score: avgScore,
    };
  }
}

export const store = new BackendDataStore();
