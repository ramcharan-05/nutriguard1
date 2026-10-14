export type SafetyStatus = 'SAFE' | 'CAUTION' | 'UNSAFE';

export interface HealthyAlternative {
  name: string;
  description: string;
  why_better: string;
  glycemic_profile?: string;
  sodium_profile?: string;
}

export interface NutritionalFacts {
  serving_size?: string;
  calories?: number | null;
  sodium_mg?: number | null;
  total_sugars_g?: number | null;
  added_sugars_g?: number | null;
  total_carbs_g?: number | null;
  fiber_g?: number | null;
  protein_g?: number | null;
  saturated_fat_g?: number | null;
  glycemic_index_rating?: 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH' | 'UNKNOWN';
}

export interface MedicalBreakdown {
  hypertension_impact: string;
  diabetes_impact: string;
  allergy_impact: string;
}

export interface FoodAnalysisResult {
  id?: string;
  food_name: string;
  safety_status: SafetyStatus;
  health_score: number; // 1 to 10
  key_risks: string[];
  clinical_explanation: string;
  healthy_alternatives: (string | HealthyAlternative)[];
  
  // Extended clinical facts
  nutritional_facts?: NutritionalFacts;
  key_ingredients?: string[];
  allergens_detected?: string[];
  medical_breakdown?: MedicalBreakdown;
  analyzed_at?: string;
}

export interface FoodComparisonResult {
  item_a: {
    name: string;
    safety_status: SafetyStatus;
    health_score: number;
  };
  item_b: {
    name: string;
    safety_status: SafetyStatus;
    health_score: number;
  };
  safer_choice: 'ITEM_A' | 'ITEM_B' | 'EQUAL';
  clinical_rationale: string;
  key_differences: string[];
}

export interface PatientProfile {
  id: string;
  name: string;
  health_conditions: string[];
  allergies: string[];
  notes?: string;
  max_sodium_mg_per_meal?: number;
  max_sugar_g_per_meal?: number;
}

export interface SampleFoodItem {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  previewUrl: string;
  expectedOutcome: SafetyStatus;
  description: string;
}
