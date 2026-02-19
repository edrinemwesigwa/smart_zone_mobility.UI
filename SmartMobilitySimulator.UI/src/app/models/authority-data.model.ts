export interface AuthorityDataSource {
  name: string;
  url: string;
  quality: number;
}

export interface AuthorityZoneRecommendation {
  name: string;
  peakVolume: number;
  congestion: number;
  priority: number;
}

export interface AuthorityZoneMetric {
  name: string;
  value: number;
  unit: string;
  confidence: number;
}

export interface AuthorityZoneData {
  authorityCode: string;
  zoneId: string;
  dataCharacteristics: string;
  updateFrequency: string;
  coverage: string;
  metrics: AuthorityZoneMetric[];
  lastUpdated: string;
}

export interface ComparisonMetric {
  metric: string;
  rtaValue: number;
  itcValue: number;
  difference: number;
  betterFor: string;
}

export interface AuthorityRecommendations {
  recommendedAuthority: string;
  reason: string;
  quickWins: string[];
  implementationPath: string[];
}

export interface AuthorityComparison {
  rtaResults?: unknown;
  itcResults?: unknown;
  comparisonMetrics: ComparisonMetric[];
  recommendations: AuthorityRecommendations;
}

export interface RoadmapPhase {
  authority: string;
  duration: string;
  zones: string[];
  budget: number;
  expectedOutcomes: string;
  successMetrics: string;
}

export interface AuthorityRoadmap {
  phase1: RoadmapPhase;
  phase2: RoadmapPhase;
  phase3: RoadmapPhase;
  totalInvestment: number;
  total5YearRevenue: number;
  overallROI: number;
  uaeWideBenefits: string;
}



