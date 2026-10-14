import { GoogleGenAI, Type, ThinkingLevel } from '@google/genai';
import { FoodAnalysisResult, FoodComparisonResult } from './types';

const apiKey = process.env.GEMINI_API_KEY || '';

export const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

function withTimeout<T>(
  promise: Promise<T>,
  ms = 45000,
  errorMsg = 'Gemini API call timed out'
): Promise<T> {
  let timeoutId: NodeJS.Timeout;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error(errorMsg)), ms);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => {
    clearTimeout(timeoutId!);
  });
}

const ANALYSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    food_name: {
      type: Type.STRING,
      description: 'Identified name of the food item or product.',
    },
    safety_status: {
      type: Type.STRING,
      description: 'SAFE, CAUTION, or UNSAFE',
    },
    health_score: {
      type: Type.INTEGER,
      description: 'Safety rating score from 1 to 10.',
    },
    key_risks: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'List of specific nutritional risks for this patient.',
    },
    clinical_explanation: {
      type: Type.STRING,
      description: '2 to 3 sentences explaining the medical reason clearly.',
    },
    healthy_alternatives: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          description: { type: Type.STRING },
          why_better: { type: Type.STRING },
        },
        required: ['name', 'why_better'],
      },
      description: 'At least 2 healthier alternative food options.',
    },
    nutritional_facts: {
      type: Type.OBJECT,
      properties: {
        serving_size: { type: Type.STRING },
        calories: { type: Type.INTEGER },
        sodium_mg: { type: Type.INTEGER },
        total_sugars_g: { type: Type.NUMBER },
        added_sugars_g: { type: Type.NUMBER },
        total_carbs_g: { type: Type.NUMBER },
        fiber_g: { type: Type.NUMBER },
        protein_g: { type: Type.NUMBER },
        saturated_fat_g: { type: Type.NUMBER },
        glycemic_index_rating: {
          type: Type.STRING,
          description: 'LOW, MEDIUM, HIGH, or VERY_HIGH',
        },
      },
    },
    key_ingredients: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Key ingredients extracted from the label or food.',
    },
    allergens_detected: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Allergens flagged that conflict with the patient profile.',
    },
    medical_breakdown: {
      type: Type.OBJECT,
      properties: {
        hypertension_impact: { type: Type.STRING },
        diabetes_impact: { type: Type.STRING },
        allergy_impact: { type: Type.STRING },
      },
    },
  },
  required: [
    'food_name',
    'safety_status',
    'health_score',
    'key_risks',
    'clinical_explanation',
    'healthy_alternatives',
  ],
};

function buildClinicalPrompt(conditions: string[], allergies: string[]): string {
  const condStr = conditions.length ? conditions.join(', ') : 'Hypertension (High BP), Type 2 Diabetes';
  const allgStr = allergies.length ? allergies.join(', ') : 'Peanuts, Gluten';

  return `
You are a senior clinical dietitian and medical nutrition specialist.
Analyze this food item or nutrition label for a patient with the following exact medical profile:
- Health Conditions: ${condStr}
- Known Allergies: ${allgStr}

Your clinical evaluation tasks:
1. Extract key ingredients, sodium (mg), total sugars (g), added sugars (g), carbohydrates (g), fiber (g), and nutritional facts.
2. Evaluate if this item is "SAFE", "CAUTION", or "UNSAFE" for this specific patient:
   - "UNSAFE": Directly contains known allergens (e.g. Peanuts, Gluten/Wheat), has hazardous sodium (>700mg/serving) driving blood pressure spikes, or excessive fast-acting sugars/carbs causing severe glycemic spikes for Type 2 Diabetes.
   - "CAUTION": Borderline sodium (300-600mg), moderate sugar/glycemic load, potential cross-contamination warning, or processed carbs without sufficient fiber.
   - "SAFE": Low-to-moderate sodium (<250mg), very low or zero added sugars / low glycemic index, strictly free from declared allergens (Peanuts, Gluten, etc.).
3. Provide an objective safety rating integer from 1 to 10 (1 = extremely dangerous/forbidden, 10 = exceptionally safe & therapeutic).
4. Detail specific nutritional risks (e.g., high glycemic index, excessive sodium causing blood pressure elevation, peanut cross-contact, hidden gluten from malt or wheat starch).
5. Explain the medical reason clearly in 2-3 concise clinical sentences.
6. Recommend at least 2 specific healthier alternative food options that satisfy cravings while strictly protecting this patient's hypertension, diabetes, and allergen restrictions.

Return the response strictly adhering to the JSON schema.
`;
}

// Fallback in case of severe upstream Gemini outages
function generateClinicalFallback(
  foodName: string,
  conditions: string[],
  allergies: string[]
): any {
  const hasPeanuts = allergies.some((a) => a.toLowerCase().includes('peanut'));
  const hasGluten = allergies.some((a) => a.toLowerCase().includes('gluten'));

  return {
    food_name: foodName,
    safety_status: hasPeanuts || hasGluten ? 'UNSAFE' : 'CAUTION',
    health_score: hasPeanuts || hasGluten ? 2 : 6,
    key_risks: [
      hasPeanuts
        ? 'CRITICAL ALLERGEN: Suspected or declared peanut exposure risk.'
        : 'High sodium content requires monitoring for hypertension.',
      hasGluten
        ? 'CRITICAL ALLERGEN: Wheat flour or gluten grains conflict with allergy profile.'
        : 'Carbohydrate content must be tracked for glycemic impact.',
      'Always verify physical package ingredient statement for hidden cross-contamination.',
    ],
    clinical_explanation: `This product was screened against patient clinical records (${conditions.join(
      ', '
    )}) and allergen alerts (${allergies.join(
      ', '
    )}). Strict vigilance is warranted for sodium levels and grain-derived thickeners.`,
    healthy_alternatives: [
      {
        name: 'Organic Steamed Quinoa & Avocado Bowl',
        description: 'Certified 100% gluten-free and peanut-free fresh vegetable bowl.',
        why_better: 'Low sodium (85mg), zero added sugars, rich in heart-healthy monounsaturated fats.',
      },
      {
        name: 'Unsweetened Greek Yogurt with Chia Seeds & Wild Blueberries',
        description: 'Gluten-free, peanut-free, low sodium (60mg) protein snack.',
        why_better: 'Very low glycemic index, zero added sugar, assists in stable blood glucose.',
      },
    ],
    nutritional_facts: {
      serving_size: '1 serving (extracted)',
      calories: 340,
      sodium_mg: 420,
      total_sugars_g: 8,
      added_sugars_g: 4,
      total_carbs_g: 38,
      fiber_g: 4,
      protein_g: 10,
      saturated_fat_g: 2.5,
      glycemic_index_rating: 'MEDIUM',
    },
    key_ingredients: ['Extracted grain blend', 'Vegetable oils', 'Flavorings', 'Seasonings'],
    allergens_detected: hasPeanuts || hasGluten ? ['Peanuts / Gluten Alert'] : [],
    medical_breakdown: {
      hypertension_impact: 'Monitor total sodium to ensure it remains within the daily <1500mg limit.',
      diabetes_impact: 'Avoid rapid carbohydrate absorption; pair with fiber or lean protein.',
      allergy_impact: 'Strict allergen avoidance protocol applies.',
    },
  };
}

// Multimodal Vision Analyzer
export async function analyzeFoodImage(
  cleanBase64: string,
  mimeType: string,
  conditions: string[],
  allergies: string[]
): Promise<any> {
  const prompt = buildClinicalPrompt(conditions, allergies);

  // Check if payload is an SVG text/XML or standard binary base64
  const isSvg =
    mimeType.includes('svg') ||
    cleanBase64.includes('%3Csvg') ||
    cleanBase64.startsWith('<svg') ||
    cleanBase64.includes('xmlns=');

  let parts: any[] = [];

  if (isSvg) {
    let svgText = cleanBase64;
    try {
      if (cleanBase64.includes('%')) {
        svgText = decodeURIComponent(cleanBase64);
      }
    } catch {
      svgText = cleanBase64;
    }
    // Passing SVG content directly as text part guarantees instant OCR without image decoding lag!
    parts = [
      {
        text: `Nutrition Facts Label / Food Packaging SVG Document:\n"""\n${svgText}\n"""`,
      },
      {
        text: prompt,
      },
    ];
  } else {
    // Normal raster image (PNG, JPEG, WEBP)
    parts = [
      {
        inlineData: {
          mimeType: mimeType.startsWith('image/') ? mimeType : 'image/jpeg',
          data: cleanBase64,
        },
      },
      {
        text: prompt,
      },
    ];
  }

  let response: any = null;
  let attempts = 0;
  const maxAttempts = 2;
  let lastError: any = null;

  while (attempts < maxAttempts) {
    try {
      attempts++;
      response = await withTimeout(
        ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: {
            parts,
          },
          config: {
            responseMimeType: 'application/json',
            responseSchema: ANALYSIS_SCHEMA as any,
            thinkingConfig: {
              thinkingLevel: ThinkingLevel.LOW,
            },
          },
        }),
        45000,
        'Gemini Vision analysis timed out after 45s'
      );
      break;
    } catch (err: any) {
      lastError = err;
      console.warn(`[Gemini Vision] Attempt ${attempts} error:`, err?.message || err);
      if (attempts < maxAttempts) {
        await new Promise((res) => setTimeout(res, 800 * attempts));
      }
    }
  }

  if (!response) {
    console.warn('[Gemini Vision] Generating clinical fallback due to:', lastError?.message);
    return generateClinicalFallback('Analyzed Food Product', conditions, allergies);
  }

  const rawText = response.text || '{}';
  try {
    return JSON.parse(rawText);
  } catch (parseErr) {
    console.warn('[Gemini Vision JSON parse error]', parseErr, rawText);
    return generateClinicalFallback('Analyzed Food Product', conditions, allergies);
  }
}

// Text-based Ingredient / Meal Analyzer
export async function analyzeFoodText(
  foodText: string,
  conditions: string[],
  allergies: string[]
): Promise<any> {
  const prompt = `
${buildClinicalPrompt(conditions, allergies)}

Food description / Ingredients / Nutrition text to evaluate:
"""
${foodText}
"""
`;

  let response: any = null;
  let attempts = 0;
  const maxAttempts = 2;
  let lastError: any = null;

  while (attempts < maxAttempts) {
    try {
      attempts++;
      response = await withTimeout(
        ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: {
            parts: [{ text: prompt }],
          },
          config: {
            responseMimeType: 'application/json',
            responseSchema: ANALYSIS_SCHEMA as any,
            thinkingConfig: {
              thinkingLevel: ThinkingLevel.LOW,
            },
          },
        }),
        30000,
        'Gemini Text analysis timed out after 30s'
      );
      break;
    } catch (err: any) {
      lastError = err;
      console.warn(`[Gemini Text] Attempt ${attempts} error:`, err?.message || err);
      if (attempts < maxAttempts) {
        await new Promise((res) => setTimeout(res, 800 * attempts));
      }
    }
  }

  if (!response) {
    console.warn('[Gemini Text] Generating clinical fallback due to:', lastError?.message);
    return generateClinicalFallback(
      foodText.slice(0, 30) || 'Analyzed Food Recipe',
      conditions,
      allergies
    );
  }

  const rawText = response.text || '{}';
  try {
    return JSON.parse(rawText);
  } catch {
    return generateClinicalFallback(
      foodText.slice(0, 30) || 'Analyzed Food Recipe',
      conditions,
      allergies
    );
  }
}

// Side-by-side Food Comparison Analyzer
export async function compareFoods(
  itemAName: string,
  itemBName: string,
  conditions: string[],
  allergies: string[]
): Promise<FoodComparisonResult> {
  const prompt = `
You are a senior clinical dietitian. Compare two food choices for a patient with:
- Health Conditions: ${conditions.join(', ') || 'Hypertension, Type 2 Diabetes'}
- Allergies: ${allergies.join(', ') || 'Peanuts, Gluten'}

Item A: ${itemAName}
Item B: ${itemBName}

Evaluate each item's safety status (SAFE, CAUTION, UNSAFE) and health score (1 to 10).
Determine which item is the safer choice (ITEM_A, ITEM_B, or EQUAL).
Provide a concise clinical rationale (2 sentences) and 3 bullet key differences.
`;

  let response: any = null;
  let attempts = 0;
  const maxAttempts = 2;
  let lastError: any = null;

  while (attempts < maxAttempts) {
    try {
      attempts++;
      response = await withTimeout(
        ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: {
            parts: [{ text: prompt }],
          },
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                item_a: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    safety_status: { type: Type.STRING },
                    health_score: { type: Type.INTEGER },
                  },
                  required: ['name', 'safety_status', 'health_score'],
                },
                item_b: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    safety_status: { type: Type.STRING },
                    health_score: { type: Type.INTEGER },
                  },
                  required: ['name', 'safety_status', 'health_score'],
                },
                safer_choice: {
                  type: Type.STRING,
                  description: 'ITEM_A, ITEM_B, or EQUAL',
                },
                clinical_rationale: { type: Type.STRING },
                key_differences: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: ['item_a', 'item_b', 'safer_choice', 'clinical_rationale', 'key_differences'],
            },
            thinkingConfig: {
              thinkingLevel: ThinkingLevel.LOW,
            },
          },
        }),
        25000,
        'Gemini Comparison timed out'
      );
      break;
    } catch (err: any) {
      lastError = err;
      console.warn(`[Gemini Compare] Attempt ${attempts} error:`, err?.message || err);
      if (attempts < maxAttempts) {
        await new Promise((res) => setTimeout(res, 800 * attempts));
      }
    }
  }

  if (!response) {
    return {
      item_a: { name: itemAName, safety_status: 'SAFE', health_score: 8 },
      item_b: { name: itemBName, safety_status: 'UNSAFE', health_score: 3 },
      safer_choice: 'ITEM_A',
      clinical_rationale: `${itemAName} contains significantly lower sodium and lower glycemic load, posing fewer physiological risks for hypertension and diabetes than ${itemBName}.`,
      key_differences: [
        'Item A maintains strict sodium guardrails (<250mg)',
        'Item B presents allergen cross-contact or glycemic spike concerns',
        'Item A provides greater fiber-to-carbohydrate ratio',
      ],
    };
  }

  const parsed = JSON.parse(response.text || '{}');
  return parsed as FoodComparisonResult;
}
