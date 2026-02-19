export interface SimulationRequest {
  zoneId: string;
  zoneName?: string;
  date: Date;
  zoneRules: {
    exemptions?: string[];
    diversionThreshold?: number;
    peakMultiplier?: number;
    [key: string]: any;
  };
}

export interface SimulationResult {
  id: string;
  name: string;
  description?: string;
  totalVehicles: number;
  vehiclesDiverted: number;
  congestionReduction: number; // percentage
  estimatedRevenue: number;
  equityImpact: any;
  environmentalImpact: number; // CO2 reduction in kg
  zoneRules: any;
  results: any;
  createdAt: Date;
  warnings?: string[];
  confidenceScore?: number;
  baselineAverageSpeed?: number;
  baselineCongestionLevel?: number;
  projectedAverageSpeed?: number;
  projectedCongestionLevel?: number;
  congestionReductionPercentage?: number;
  complianceRate?: number;
}

export interface VehicleMovement {
  id: number;
  vehicleId: string;
  userId: string;
  entryZoneId: string;
  exitZoneId: string;
  entryTime: Date;
  exitTime?: Date;
  durationMinutes?: number;
  chargeApplied?: number;
  isExempt: boolean;
  exemptionReason?: string;
  wasDiverted: boolean;
  originalEstimatedDuration?: number;
  actualDuration?: number;
  chargePercentageOfIncome?: number;
  vehicleType: "Private" | "Taxi" | "Commercial";
  userIncomeBracket?: "Low" | "Medium" | "High";
}

export interface CitizenImpact {
  vehicleOwner: {
    id: string;
    incomeBracket: string;
    homeZone: string;
    workZone: string;
    vehicleType: string;
  };
  weeklyImpact: {
    estimatedCharges: number;
    chargePercentageOfIncome: number;
    alternativeRoutes: number;
    timeSavings: number;
  };
  affectedBy: string[];
}



