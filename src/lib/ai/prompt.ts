interface UserPreferences {
  gender?: string;
  budget?: string;
  occasion?: string;
  style?: string;
  concerns?: string[];
}

export function buildAnalysisPrompt(
  category: "full" | "hair" | "skin" | "nails",
  preferences: UserPreferences
): string {
  const categoryInstructions: Record<string, string> = {
    full: "Analyze the photo comprehensively: hair texture/density/health/color, skin type/tone/conditions/hydration, nail shape/health, and overall grooming/face shape/facial features. Fill in ALL sections (hair, skin, nails, grooming).",
    hair: "Focus on hair analysis: texture (straight/wavy/curly/coily), density (thin/medium/thick), health (dry/oily/damaged/healthy), color, and face shape compatibility. Set skin, nails to null. Include grooming if face is visible, otherwise set to null.",
    skin: "Focus on skin analysis: type (dry/oily/combination/sensitive/normal), tone (warm/cool/neutral), conditions, and hydration (dehydrated/normal/well-hydrated). Set hair, nails to null. Include grooming if face is visible, otherwise set to null.",
    nails: "Focus on nail analysis: shape (almond/square/round/coffin/oval), health (brittle/discolored/ridged/healthy), care recommendations, and color suggestions. Set hair, skin, grooming to null.",
  };

  const preferencesSection = [
    preferences.gender && `Gender: ${preferences.gender}`,
    preferences.budget && `Budget: ${preferences.budget}`,
    preferences.occasion && `Occasion: ${preferences.occasion}`,
    preferences.style && `Preferred style: ${preferences.style}`,
    preferences.concerns?.length &&
      `Key concerns: ${preferences.concerns.join(", ")}`,
  ]
    .filter(Boolean)
    .join("\n");

  return `You are StyleGenie AI, an expert beauty and grooming analyst. Analyze the provided photo and return a detailed assessment.

${categoryInstructions[category]}

${preferencesSection ? `User preferences:\n${preferencesSection}\n` : ""}
Provide 3-5 specific, personalized recommendations based on what you observe. Each recommendation must be actionable and tailored to the individual.

Respond ONLY with valid JSON in this exact format (no markdown, no extra text):
{
  "styleScore": <number 1-100>,
  "hair": {
    "texture": "straight" | "wavy" | "curly" | "coily",
    "density": "thin" | "medium" | "thick",
    "health": "dry" | "oily" | "damaged" | "healthy",
    "color": "<observed color>",
    "faceShapeCompatibility": "<brief assessment>",
    "recommendations": ["<specific tip>", ...]
  } | null,
  "skin": {
    "type": "dry" | "oily" | "combination" | "sensitive" | "normal",
    "tone": "warm" | "cool" | "neutral",
    "conditions": ["<observed condition>", ...],
    "hydration": "dehydrated" | "normal" | "well-hydrated",
    "recommendations": ["<specific tip>", ...]
  } | null,
  "nails": {
    "shape": "almond" | "square" | "round" | "coffin" | "oval",
    "health": "brittle" | "discolored" | "ridged" | "healthy",
    "recommendations": ["<specific tip>", ...],
    "colorSuggestions": ["<color>", ...]
  } | null,
  "grooming": {
    "faceShape": "<detected shape>",
    "facialFeatures": ["<notable feature>", ...],
    "recommendations": ["<specific tip>", ...],
    "overallCoherence": "<brief assessment>"
  } | null,
  "recommendations": [
    {
      "category": "hair" | "skin" | "nails" | "grooming" | "spa",
      "title": "<concise title>",
      "description": "<detailed, personalized description>",
      "priority": "quick_win" | "major_impact" | "maintenance",
      "expectedOutcome": "<what the user can expect>"
    }
  ]
}`;
}
