export interface HairAnalysis {
  texture: "straight" | "wavy" | "curly" | "coily";
  density: "thin" | "medium" | "thick";
  health: "dry" | "oily" | "damaged" | "healthy";
  color: string;
  faceShapeCompatibility: string;
  recommendations: string[];
}

export interface SkinAnalysis {
  type: "dry" | "oily" | "combination" | "sensitive" | "normal";
  tone: "warm" | "cool" | "neutral";
  conditions: string[];
  hydration: "dehydrated" | "normal" | "well-hydrated";
  recommendations: string[];
}

export interface NailAnalysis {
  shape: "almond" | "square" | "round" | "coffin" | "oval";
  health: "brittle" | "discolored" | "ridged" | "healthy";
  recommendations: string[];
  colorSuggestions: string[];
}

export interface GroomingAnalysis {
  faceShape: string;
  facialFeatures: string[];
  recommendations: string[];
  overallCoherence: string;
}

export interface AnalysisResult {
  styleScore: number;
  hair: HairAnalysis | null;
  skin: SkinAnalysis | null;
  nails: NailAnalysis | null;
  grooming: GroomingAnalysis | null;
  recommendations: RecommendationItem[];
}

export interface RecommendationItem {
  category: "hair" | "skin" | "nails" | "grooming" | "spa";
  title: string;
  description: string;
  priority: "quick_win" | "major_impact" | "maintenance";
  expectedOutcome: string;
}
