export interface FaceAnalysisResult {
  success: boolean;
  face_shape: string;
  landmarks_detected: number;
  recommendations: GlassesRecommendation[];
  analysis_details?: {
    measurements: FaceMeasurements;
    ratios: FaceRatios;
  };
  error?: string;
}

export interface GlassesRecommendation {
  style: string;
  name: string;
  description: string;
  reason: string;
  confidence: number;
}

export interface FaceMeasurements {
  face_width: number;
  face_length: number;
  jaw_width: number;
  cheekbone_width: number;
  forehead_width: number;
}

export interface FaceRatios {
  face_ratio: number;
  jaw_to_cheek: number;
  forehead_to_cheek: number;
}

export interface AnalysisState {
  isLoading: boolean;
  result: FaceAnalysisResult | null;
  error: string | null;
}