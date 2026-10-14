import { FoodAnalysisResult, SampleFoodItem } from '../types';

// Helper to convert SVG strings into base64 data URLs for Gemini vision input
function createSvgDataUrl(svgContent: string): string {
  const encoded = encodeURIComponent(svgContent)
    .replace(/'/g, '%27')
    .replace(/"/g, '%22');
  return `data:image/svg+xml;charset=utf-8,${encoded}`;
}

// 1. Peanut Butter & Honey Wheat Toast
const peanutButterSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="600" height="750" viewBox="0 0 600 750" fill="none">
  <rect width="600" height="750" fill="#FEF3C7" rx="16"/>
  <rect x="24" y="24" width="552" height="702" fill="#FFFFFF" rx="12" stroke="#D97706" stroke-width="3"/>
  <rect x="40" y="40" width="520" height="80" fill="#78350F" rx="8"/>
  <text x="300" y="88" fill="#FFFFFF" font-family="Arial, sans-serif" font-size="28" font-weight="bold" text-anchor="middle">PEANUT BUTTER &amp; WHEAT BREAD</text>
  <text x="300" y="108" fill="#FDE68A" font-family="Arial, sans-serif" font-size="14" text-anchor="middle">Classic Creamy Spread on Whole Wheat</text>
  
  <!-- Nutrition Facts Box -->
  <rect x="50" y="140" width="500" height="420" fill="#FFFFFF" stroke="#000000" stroke-width="4"/>
  <text x="65" y="175" fill="#000000" font-family="Arial, sans-serif" font-size="34" font-weight="900">Nutrition Facts</text>
  <line x1="65" y1="185" x2="535" y2="185" stroke="#000000" stroke-width="1"/>
  <text x="65" y="205" fill="#000000" font-family="Arial, sans-serif" font-size="16">1 Sandwich Serving (112g)</text>
  <line x1="65" y1="215" x2="535" y2="215" stroke="#000000" stroke-width="8"/>
  <text x="65" y="240" fill="#000000" font-family="Arial, sans-serif" font-size="15" font-weight="bold">Amount Per Serving</text>
  <text x="65" y="275" fill="#000000" font-family="Arial, sans-serif" font-size="32" font-weight="900">Calories 390</text>
  <line x1="65" y1="285" x2="535" y2="285" stroke="#000000" stroke-width="4"/>
  <text x="65" y="310" fill="#000000" font-family="Arial, sans-serif" font-size="16" font-weight="bold">Total Fat 18g (23% DV)</text>
  <text x="85" y="330" fill="#333333" font-family="Arial, sans-serif" font-size="14">Saturated Fat 3.5g (18% DV)</text>
  <line x1="65" y1="340" x2="535" y2="340" stroke="#000000" stroke-width="1"/>
  <text x="65" y="365" fill="#DC2626" font-family="Arial, sans-serif" font-size="18" font-weight="bold">Sodium 380mg (17% DV)</text>
  <line x1="65" y1="375" x2="535" y2="375" stroke="#000000" stroke-width="1"/>
  <text x="65" y="400" fill="#000000" font-family="Arial, sans-serif" font-size="16" font-weight="bold">Total Carbohydrate 44g (16% DV)</text>
  <text x="85" y="420" fill="#333333" font-family="Arial, sans-serif" font-size="14">Dietary Fiber 5g (18% DV)</text>
  <text x="85" y="445" fill="#DC2626" font-family="Arial, sans-serif" font-size="16" font-weight="bold">Total Sugars 12g (Includes 8g Added Sugars 16% DV)</text>
  <line x1="65" y1="455" x2="535" y2="455" stroke="#000000" stroke-width="1"/>
  <text x="65" y="480" fill="#000000" font-family="Arial, sans-serif" font-size="16" font-weight="bold">Protein 14g</text>
  <line x1="65" y1="495" x2="535" y2="495" stroke="#000000" stroke-width="6"/>

  <!-- Ingredients -->
  <rect x="50" y="580" width="500" height="130" fill="#FEF2F2" stroke="#EF4444" stroke-width="2" rx="8"/>
  <text x="65" y="605" fill="#991B1B" font-family="Arial, sans-serif" font-size="14" font-weight="bold">INGREDIENTS:</text>
  <text x="65" y="630" fill="#374151" font-family="Arial, sans-serif" font-size="13">Whole Wheat Flour (Gluten), Roasted Peanuts, Sugar, Molasses, Salt, Yeast.</text>
  <text x="65" y="665" fill="#DC2626" font-family="Arial, sans-serif" font-size="14" font-weight="bold">CONTAINS ALLERGENS: PEANUTS, WHEAT (GLUTEN).</text>
</svg>
`;

// 2. High Sodium Canned Cream of Mushroom Soup
const cannedSoupSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="600" height="750" viewBox="0 0 600 750" fill="none">
  <rect width="600" height="750" fill="#F1F5F9" rx="16"/>
  <rect x="24" y="24" width="552" height="702" fill="#FFFFFF" rx="12" stroke="#DC2626" stroke-width="3"/>
  <rect x="40" y="40" width="520" height="80" fill="#991B1B" rx="8"/>
  <text x="300" y="88" fill="#FFFFFF" font-family="Arial, sans-serif" font-size="28" font-weight="bold" text-anchor="middle">CONDENSED MUSHROOM SOUP</text>
  <text x="300" y="108" fill="#FECACA" font-family="Arial, sans-serif" font-size="14" text-anchor="middle">Creamy Recipe - Ready to Heat</text>
  
  <!-- Nutrition Facts Box -->
  <rect x="50" y="140" width="500" height="420" fill="#FFFFFF" stroke="#000000" stroke-width="4"/>
  <text x="65" y="175" fill="#000000" font-family="Arial, sans-serif" font-size="34" font-weight="900">Nutrition Facts</text>
  <line x1="65" y1="185" x2="535" y2="185" stroke="#000000" stroke-width="1"/>
  <text x="65" y="205" fill="#000000" font-family="Arial, sans-serif" font-size="16">Serving Size: 1/2 cup condensed (120g)</text>
  <line x1="65" y1="215" x2="535" y2="215" stroke="#000000" stroke-width="8"/>
  <text x="65" y="240" fill="#000000" font-family="Arial, sans-serif" font-size="15" font-weight="bold">Amount Per Serving</text>
  <text x="65" y="275" fill="#000000" font-family="Arial, sans-serif" font-size="32" font-weight="900">Calories 130</text>
  <line x1="65" y1="285" x2="535" y2="285" stroke="#000000" stroke-width="4"/>
  <text x="65" y="310" fill="#000000" font-family="Arial, sans-serif" font-size="16" font-weight="bold">Total Fat 8g (10% DV)</text>
  <text x="85" y="330" fill="#333333" font-family="Arial, sans-serif" font-size="14">Saturated Fat 2g (10% DV)</text>
  <line x1="65" y1="340" x2="535" y2="340" stroke="#000000" stroke-width="1"/>
  <text x="65" y="365" fill="#DC2626" font-family="Arial, sans-serif" font-size="20" font-weight="900">Sodium 890mg (39% DV)</text>
  <line x1="65" y1="375" x2="535" y2="375" stroke="#000000" stroke-width="1"/>
  <text x="65" y="400" fill="#000000" font-family="Arial, sans-serif" font-size="16" font-weight="bold">Total Carbohydrate 12g (4% DV)</text>
  <text x="85" y="420" fill="#333333" font-family="Arial, sans-serif" font-size="14">Dietary Fiber &lt;1g (2% DV)</text>
  <text x="85" y="445" fill="#000000" font-family="Arial, sans-serif" font-size="14">Total Sugars 3g (Includes 2g Added Sugars)</text>
  <line x1="65" y1="455" x2="535" y2="455" stroke="#000000" stroke-width="1"/>
  <text x="65" y="480" fill="#000000" font-family="Arial, sans-serif" font-size="16" font-weight="bold">Protein 2g</text>
  <line x1="65" y1="495" x2="535" y2="495" stroke="#000000" stroke-width="6"/>

  <!-- Ingredients -->
  <rect x="50" y="580" width="500" height="130" fill="#FEF2F2" stroke="#EF4444" stroke-width="2" rx="8"/>
  <text x="65" y="605" fill="#991B1B" font-family="Arial, sans-serif" font-size="14" font-weight="bold">INGREDIENTS:</text>
  <text x="65" y="630" fill="#374151" font-family="Arial, sans-serif" font-size="13">Water, Mushrooms, Vegetable Oil, Modified Food Starch, Wheat Flour (Gluten), Salt, Monosodium Glutamate, Soy Protein.</text>
  <text x="65" y="665" fill="#DC2626" font-family="Arial, sans-serif" font-size="14" font-weight="bold">CONTAINS: WHEAT (GLUTEN), MILK, SOY.</text>
</svg>
`;

// 3. Certified Safe Quinoa & Avocado Bowl
const quinoaBowlSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="600" height="750" viewBox="0 0 600 750" fill="none">
  <rect width="600" height="750" fill="#ECFDF5" rx="16"/>
  <rect x="24" y="24" width="552" height="702" fill="#FFFFFF" rx="12" stroke="#059669" stroke-width="3"/>
  <rect x="40" y="40" width="520" height="80" fill="#065F46" rx="8"/>
  <text x="300" y="88" fill="#FFFFFF" font-family="Arial, sans-serif" font-size="26" font-weight="bold" text-anchor="middle">STEAMED QUINOA &amp; AVOCADO BOWL</text>
  <text x="300" y="108" fill="#A7F3D0" font-family="Arial, sans-serif" font-size="14" text-anchor="middle">Certified Gluten-Free, Low Sodium, Plant Protein</text>
  
  <!-- Nutrition Facts Box -->
  <rect x="50" y="140" width="500" height="420" fill="#FFFFFF" stroke="#000000" stroke-width="4"/>
  <text x="65" y="175" fill="#000000" font-family="Arial, sans-serif" font-size="34" font-weight="900">Nutrition Facts</text>
  <line x1="65" y1="185" x2="535" y2="185" stroke="#000000" stroke-width="1"/>
  <text x="65" y="205" fill="#000000" font-family="Arial, sans-serif" font-size="16">1 Meal Bowl (220g)</text>
  <line x1="65" y1="215" x2="535" y2="215" stroke="#000000" stroke-width="8"/>
  <text x="65" y="240" fill="#000000" font-family="Arial, sans-serif" font-size="15" font-weight="bold">Amount Per Serving</text>
  <text x="65" y="275" fill="#000000" font-family="Arial, sans-serif" font-size="32" font-weight="900">Calories 280</text>
  <line x1="65" y1="285" x2="535" y2="285" stroke="#000000" stroke-width="4"/>
  <text x="65" y="310" fill="#000000" font-family="Arial, sans-serif" font-size="16" font-weight="bold">Total Fat 12g (15% DV - Heart Healthy Monounsaturated)</text>
  <text x="85" y="330" fill="#333333" font-family="Arial, sans-serif" font-size="14">Saturated Fat 1.5g (8% DV)</text>
  <line x1="65" y1="340" x2="535" y2="340" stroke="#000000" stroke-width="1"/>
  <text x="65" y="365" fill="#059669" font-family="Arial, sans-serif" font-size="18" font-weight="bold">Sodium 85mg (4% DV) - LOW SODIUM</text>
  <line x1="65" y1="375" x2="535" y2="375" stroke="#000000" stroke-width="1"/>
  <text x="65" y="400" fill="#000000" font-family="Arial, sans-serif" font-size="16" font-weight="bold">Total Carbohydrate 34g (12% DV)</text>
  <text x="85" y="420" fill="#059669" font-family="Arial, sans-serif" font-size="15" font-weight="bold">Dietary Fiber 8g (29% DV) - Low Glycemic Impact</text>
  <text x="85" y="445" fill="#059669" font-family="Arial, sans-serif" font-size="15" font-weight="bold">Total Sugars 1g (0g Added Sugars)</text>
  <line x1="65" y1="455" x2="535" y2="455" stroke="#000000" stroke-width="1"/>
  <text x="65" y="480" fill="#000000" font-family="Arial, sans-serif" font-size="16" font-weight="bold">Protein 9g</text>
  <line x1="65" y1="495" x2="535" y2="495" stroke="#000000" stroke-width="6"/>

  <!-- Ingredients -->
  <rect x="50" y="580" width="500" height="130" fill="#F0FDF4" stroke="#10B981" stroke-width="2" rx="8"/>
  <text x="65" y="605" fill="#047857" font-family="Arial, sans-serif" font-size="14" font-weight="bold">INGREDIENTS:</text>
  <text x="65" y="630" fill="#374151" font-family="Arial, sans-serif" font-size="13">Cooked Organic Quinoa, Fresh Hass Avocado, Baby Spinach, Extra Virgin Olive Oil, Lemon Juice, Sea Salt, Herbs.</text>
  <text x="65" y="665" fill="#059669" font-family="Arial, sans-serif" font-size="14" font-weight="bold">CERTIFIED GLUTEN-FREE &amp; 100% PEANUT-FREE FACILITY.</text>
</svg>
`;

// 4. Teriyaki Glazed Rice Bowl
const teriyakiSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="600" height="750" viewBox="0 0 600 750" fill="none">
  <rect width="600" height="750" fill="#FFF7ED" rx="16"/>
  <rect x="24" y="24" width="552" height="702" fill="#FFFFFF" rx="12" stroke="#EA580C" stroke-width="3"/>
  <rect x="40" y="40" width="520" height="80" fill="#C2410C" rx="8"/>
  <text x="300" y="88" fill="#FFFFFF" font-family="Arial, sans-serif" font-size="28" font-weight="bold" text-anchor="middle">SWEET TERIYAKI CHICKEN BOWL</text>
  <text x="300" y="108" fill="#FFEDD5" font-family="Arial, sans-serif" font-size="14" text-anchor="middle">Glazed White Rice Bowl with Soy Glaze</text>
  
  <!-- Nutrition Facts Box -->
  <rect x="50" y="140" width="500" height="420" fill="#FFFFFF" stroke="#000000" stroke-width="4"/>
  <text x="65" y="175" fill="#000000" font-family="Arial, sans-serif" font-size="34" font-weight="900">Nutrition Facts</text>
  <line x1="65" y1="185" x2="535" y2="185" stroke="#000000" stroke-width="1"/>
  <text x="65" y="205" fill="#000000" font-family="Arial, sans-serif" font-size="16">1 Frozen Bowl (340g)</text>
  <line x1="65" y1="215" x2="535" y2="215" stroke="#000000" stroke-width="8"/>
  <text x="65" y="240" fill="#000000" font-family="Arial, sans-serif" font-size="15" font-weight="bold">Amount Per Serving</text>
  <text x="65" y="275" fill="#000000" font-family="Arial, sans-serif" font-size="32" font-weight="900">Calories 480</text>
  <line x1="65" y1="285" x2="535" y2="285" stroke="#000000" stroke-width="4"/>
  <text x="65" y="310" fill="#000000" font-family="Arial, sans-serif" font-size="16" font-weight="bold">Total Fat 9g (12% DV)</text>
  <line x1="65" y1="340" x2="535" y2="340" stroke="#000000" stroke-width="1"/>
  <text x="65" y="365" fill="#DC2626" font-family="Arial, sans-serif" font-size="20" font-weight="900">Sodium 1140mg (50% DV) - VERY HIGH</text>
  <line x1="65" y1="375" x2="535" y2="375" stroke="#000000" stroke-width="1"/>
  <text x="65" y="400" fill="#DC2626" font-family="Arial, sans-serif" font-size="16" font-weight="bold">Total Carbohydrate 76g (28% DV) - HIGH GI</text>
  <text x="85" y="420" fill="#333333" font-family="Arial, sans-serif" font-size="14">Dietary Fiber 1g (4% DV)</text>
  <text x="85" y="445" fill="#DC2626" font-family="Arial, sans-serif" font-size="16" font-weight="bold">Total Sugars 22g (Includes 18g Added Sugars 36% DV)</text>
  <line x1="65" y1="455" x2="535" y2="455" stroke="#000000" stroke-width="1"/>
  <text x="65" y="480" fill="#000000" font-family="Arial, sans-serif" font-size="16" font-weight="bold">Protein 24g</text>
  <line x1="65" y1="495" x2="535" y2="495" stroke="#000000" stroke-width="6"/>

  <!-- Ingredients -->
  <rect x="50" y="580" width="500" height="130" fill="#FEF2F2" stroke="#EF4444" stroke-width="2" rx="8"/>
  <text x="65" y="605" fill="#991B1B" font-family="Arial, sans-serif" font-size="14" font-weight="bold">INGREDIENTS:</text>
  <text x="65" y="630" fill="#374151" font-family="Arial, sans-serif" font-size="13">Cooked Enriched White Rice, Chicken Breast, Soy Sauce (Water, Wheat/Gluten, Soybeans, Salt), Brown Sugar, Mirin, Cornstarch, Sesame.</text>
  <text x="65" y="665" fill="#DC2626" font-family="Arial, sans-serif" font-size="14" font-weight="bold">CONTAINS: WHEAT (GLUTEN), SOY. MAY CONTAIN TRACES OF PEANUTS.</text>
</svg>
`;

// 5. Greek Yogurt with Chia & Berries
const greekYogurtSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="600" height="750" viewBox="0 0 600 750" fill="none">
  <rect width="600" height="750" fill="#F0F9FF" rx="16"/>
  <rect x="24" y="24" width="552" height="702" fill="#FFFFFF" rx="12" stroke="#0284C7" stroke-width="3"/>
  <rect x="40" y="40" width="520" height="80" fill="#0369A1" rx="8"/>
  <text x="300" y="88" fill="#FFFFFF" font-family="Arial, sans-serif" font-size="28" font-weight="bold" text-anchor="middle">PLAIN GREEK YOGURT &amp; BERRIES</text>
  <text x="300" y="108" fill="#BAE6FD" font-family="Arial, sans-serif" font-size="14" text-anchor="middle">Unsweetened Greek Yogurt with Wild Blueberries &amp; Chia</text>
  
  <!-- Nutrition Facts Box -->
  <rect x="50" y="140" width="500" height="420" fill="#FFFFFF" stroke="#000000" stroke-width="4"/>
  <text x="65" y="175" fill="#000000" font-family="Arial, sans-serif" font-size="34" font-weight="900">Nutrition Facts</text>
  <line x1="65" y1="185" x2="535" y2="185" stroke="#000000" stroke-width="1"/>
  <text x="65" y="205" fill="#000000" font-family="Arial, sans-serif" font-size="16">1 Cup (200g)</text>
  <line x1="65" y1="215" x2="535" y2="215" stroke="#000000" stroke-width="8"/>
  <text x="65" y="240" fill="#000000" font-family="Arial, sans-serif" font-size="15" font-weight="bold">Amount Per Serving</text>
  <text x="65" y="275" fill="#000000" font-family="Arial, sans-serif" font-size="32" font-weight="900">Calories 160</text>
  <line x1="65" y1="285" x2="535" y2="285" stroke="#000000" stroke-width="4"/>
  <text x="65" y="310" fill="#000000" font-family="Arial, sans-serif" font-size="16" font-weight="bold">Total Fat 3g (4% DV)</text>
  <line x1="65" y1="340" x2="535" y2="340" stroke="#000000" stroke-width="1"/>
  <text x="65" y="365" fill="#059669" font-family="Arial, sans-serif" font-size="18" font-weight="bold">Sodium 60mg (3% DV) - VERY LOW SODIUM</text>
  <line x1="65" y1="375" x2="535" y2="375" stroke="#000000" stroke-width="1"/>
  <text x="65" y="400" fill="#000000" font-family="Arial, sans-serif" font-size="16" font-weight="bold">Total Carbohydrate 12g (4% DV)</text>
  <text x="85" y="420" fill="#059669" font-family="Arial, sans-serif" font-size="14" font-weight="bold">Dietary Fiber 4g (14% DV)</text>
  <text x="85" y="445" fill="#059669" font-family="Arial, sans-serif" font-size="15" font-weight="bold">Total Sugars 5g (0g Added Sugars) - Low GI</text>
  <line x1="65" y1="455" x2="535" y2="455" stroke="#000000" stroke-width="1"/>
  <text x="65" y="480" fill="#059669" font-family="Arial, sans-serif" font-size="18" font-weight="bold">Protein 18g (36% DV)</text>
  <line x1="65" y1="495" x2="535" y2="495" stroke="#000000" stroke-width="6"/>

  <!-- Ingredients -->
  <rect x="50" y="580" width="500" height="130" fill="#F0FDF4" stroke="#10B981" stroke-width="2" rx="8"/>
  <text x="65" y="605" fill="#047857" font-family="Arial, sans-serif" font-size="14" font-weight="bold">INGREDIENTS:</text>
  <text x="65" y="630" fill="#374151" font-family="Arial, sans-serif" font-size="13">Cultured Grade A Pasteurized Nonfat Milk, Wild Blueberries, Organic Chia Seeds.</text>
  <text x="65" y="665" fill="#059669" font-family="Arial, sans-serif" font-size="14" font-weight="bold">NATURALLY GLUTEN-FREE &amp; PEANUT-FREE. CONTAINS MILK.</text>
</svg>
`;

export const SAMPLE_FOODS: SampleFoodItem[] = [
  {
    id: 'peanut-wheat-toast',
    title: 'Peanut Butter & Wheat Toast',
    subtitle: 'Contains Peanuts & Gluten + Added Sugar',
    category: 'Breakfast / Snack',
    expectedOutcome: 'UNSAFE',
    previewUrl: createSvgDataUrl(peanutButterSvg),
    description: 'A classic sandwich label showing 380mg sodium, 12g sugar, with wheat flour and roasted peanuts in the ingredient statement.',
  },
  {
    id: 'canned-mushroom-soup',
    title: 'Condensed Mushroom Soup',
    subtitle: '890mg Sodium (39% DV) & Wheat Flour',
    category: 'Canned Foods',
    expectedOutcome: 'UNSAFE',
    previewUrl: createSvgDataUrl(cannedSoupSvg),
    description: 'High sodium condensed soup containing thickener from wheat flour (gluten), dangerous for hypertension and celiac/gluten sensitivity.',
  },
  {
    id: 'quinoa-avocado-bowl',
    title: 'Organic Quinoa & Avocado Bowl',
    subtitle: 'Certified Gluten-Free, 85mg Sodium, Low GI',
    category: 'Fresh Prepared',
    expectedOutcome: 'SAFE',
    previewUrl: createSvgDataUrl(quinoaBowlSvg),
    description: 'Heart-healthy bowl rich in dietary fiber, low sodium, zero added sugars, and free from peanuts and gluten.',
  },
  {
    id: 'teriyaki-rice-bowl',
    title: 'Sweet Teriyaki Chicken Rice',
    subtitle: '1140mg Sodium & 22g Sugars + Wheat Soy Sauce',
    category: 'Prepared Meals',
    expectedOutcome: 'UNSAFE',
    previewUrl: createSvgDataUrl(teriyakiSvg),
    description: 'Very high sodium meal with high glycemic white rice and sweetened soy sauce that contains wheat gluten.',
  },
  {
    id: 'greek-yogurt-berries',
    title: 'Plain Greek Yogurt & Blueberries',
    subtitle: '60mg Sodium, 18g Protein, Zero Added Sugar',
    category: 'Dairy & Fruit',
    expectedOutcome: 'SAFE',
    previewUrl: createSvgDataUrl(greekYogurtSvg),
    description: 'Low sodium, low glycemic index, gluten-free and peanut-free high protein meal bowl.',
  },
];

// Fallback baseline for demo or instant offline rendering
export const FALLBACK_RESULTS: Record<string, FoodAnalysisResult> = {
  'peanut-wheat-toast': {
    food_name: 'Peanut Butter on Whole Wheat Toast',
    safety_status: 'UNSAFE',
    health_score: 1,
    key_risks: [
      'CRITICAL ALLERGEN: Contains roasted peanuts, presenting immediate anaphylaxis risk.',
      'CRITICAL ALLERGEN: Contains wheat flour (gluten), conflicting with gluten intolerance.',
      'Elevated sodium (380mg per serving) contributes toward hypertension threshold.',
      'Added sugars (8g) and refined starches create moderate postprandial glucose spike.',
    ],
    clinical_explanation:
      'This product is strictly unsafe due to the presence of both roasted peanuts and wheat gluten, which trigger severe allergic immune responses in this patient. Furthermore, the 380mg sodium content and 12g total sugars hinder optimal blood pressure and diabetic glycemic control.',
    healthy_alternatives: [
      {
        name: 'Sunflower Seed Butter on Certified Gluten-Free Flax Bread',
        description: 'Nut-free, gluten-free toast alternative with healthy Omega-3 fats.',
        why_better: 'Zero peanut allergy risk, certified gluten-free, 70% lower glycemic index, and minimal sodium.',
      },
      {
        name: 'Avocado Slices on Toasted Brown Rice Crisps with Hemp Hearts',
        description: 'Monounsaturated fatty acids with zero added sugar and natural potassium.',
        why_better: 'Naturally hypoallergenic, potassium assists in lowering blood pressure, and fiber moderates insulin response.',
      },
    ],
    nutritional_facts: {
      serving_size: '1 Sandwich (112g)',
      calories: 390,
      sodium_mg: 380,
      total_sugars_g: 12,
      added_sugars_g: 8,
      total_carbs_g: 44,
      fiber_g: 5,
      protein_g: 14,
      saturated_fat_g: 3.5,
      glycemic_index_rating: 'HIGH',
    },
    key_ingredients: ['Whole Wheat Flour', 'Roasted Peanuts', 'Sugar', 'Molasses', 'Salt'],
    allergens_detected: ['Peanuts', 'Gluten / Wheat'],
    medical_breakdown: {
      hypertension_impact: 'Moderate concern: 380mg sodium accounts for ~25% of recommended daily 1500mg limit for hypertensive patients.',
      diabetes_impact: 'High glycemic load: 44g carbohydrates with 8g added sugars will prompt elevated blood glucose.',
      allergy_impact: 'CONTRAINDICATED: Directly contains declared peanuts and wheat.',
    },
  },
};
