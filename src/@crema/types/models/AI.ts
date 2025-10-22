export enum AnalysisType {
  VideoAnalysis = 'Phân tích Video',
  VideoComparator = 'So sánh Video',
}

export interface CombinedAnalysisResult {
  shotType: string;
  confidence: number;
  pose: {
    summary: string;
    feedback: string;
  };
  movement: {
    preparation: string;
    contact: string;
    followThrough: string;
  };
  recommendations: string[];
  tags: string[];
  description: string;
}

export interface ComparisonDetail {
  analysis: string;
  strengths: string[];
  weaknesses: string[];
  timestamp: number;
}

export interface KeyDifference {
  aspect: string;
  player1_technique: string;
  player2_technique: string;
  impact: string;
}

export interface Drill {
  title: string;
  description: string;
  practice_sets: string;
}

export interface RecommendationWithDrill {
  recommendation: string;
  drill: Drill;
}

export interface VideoComparisonResult {
  comparison: {
    preparation: {
      player1: ComparisonDetail;
      player2: ComparisonDetail;
      advantage: string;
    };
    swingAndContact: {
      player1: ComparisonDetail;
      player2: ComparisonDetail;
      advantage: string;
    };
    followThrough: {
      player1: ComparisonDetail;
      player2: ComparisonDetail;
      advantage: string;
    };
  };
  keyDifferences: KeyDifference[];
  summary: string;
  recommendationsForPlayer2: RecommendationWithDrill[];
  overallScoreForPlayer2: number;
}

// FIX: Add TranscriptionMessage type for LiveCoach feature.
export interface TranscriptionMessage {
  speaker: 'user' | 'coach';
  text: string;
}
