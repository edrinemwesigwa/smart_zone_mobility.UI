export interface PilotOptions {
  includeUaePassIntegration: boolean;
  includeMobileApp: boolean;
  includeHardwareIntegration: boolean;
  include24x7Support: boolean;
  durationMonths: number;
  customIntegrationCost: number;
}

export interface PilotProposalDto {
  executiveSummary: string;
  problemStatement: string;
  proposedSolution: string;
  pilotDetails: PilotDetailsDto;
  financials: FinancialsDto;
  riskAssessment: RiskAssessmentDto;
  nextSteps: string[];
  pdfBase64?: string | null;
}

export interface PilotDetailsDto {
  durationMonths: number;
  totalCostAED: number;
  timeline: string[];
  successMetrics: string[];
}

export interface FinancialsDto {
  pilotCostBreakdown: Record<string, number>;
  year1RevenueProjection: number;
  year1ROI: number;
  breakEvenMonth: number;
  estimatedMonthlyRevenue: number;
}

export interface RiskAssessmentDto {
  technicalRisks: string[];
  politicalRisks: string[];
  publicAcceptanceRisks: string[];
  mitigationStrategies: string[];
}



