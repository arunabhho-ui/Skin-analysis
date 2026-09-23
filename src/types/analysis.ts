export type SkinTypeLabel = "dry" | "normal" | "oily" | "combination";

export type ConcernId =
  | "pores"
  | "wrinkles"
  | "blackheads"
  | "whiteheads"
  | "inflammatory_acne";

export interface Point2D {
  x: number; // Fraction 0.0 - 1.0 of image width
  y: number; // Fraction 0.0 - 1.0 of image height
}

export interface MaskData {
  regions: Point2D[][]; // Array of polygon vertex rings
}

export interface FaceMaskData {
  regions: Point2D[][];
}

export interface ConcernItem {
  id: ConcernId;
  label: string;
  confidence: number; // 0.0 - 1.0
  mask: MaskData;
  color: string; // On-brand hex code
}

export interface AgingSignal {
  id: "wrinkles" | "puffy_eyes";
  label: string;
  confidence: number; // 0.0 - 1.0
}

export interface RecommendationItem {
  concernId: string;
  ingredient: string;
  rationale: string;
}

export interface SkinAnalysisReport {
  faceMask?: FaceMaskData;
  skinType: {
    label: SkinTypeLabel;
    confidence: number;
  };
  concerns: ConcernItem[];
  aging: AgingSignal[];
  recommendations: RecommendationItem[];
  timestamp?: string;
}
