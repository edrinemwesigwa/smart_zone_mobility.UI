export interface Zone {
  id: string;
  name: string;
  emirate: "Dubai" | "Abu Dhabi" | "Sharjah";
  zoneType: "Residential" | "Commercial" | "Industrial" | "Mixed";
  geometry?: any; // GeoJSON polygon
  latitude?: number;
  longitude?: number;
  baseFreeHours: number;
  peakHours?: string;
  chargePerHour: number;
  createdAt: Date;
}

export interface ZoneUpsertRequest {
  name: string;
  emirate: "Dubai" | "Abu Dhabi" | "Sharjah";
  zoneType: "Residential" | "Commercial" | "Industrial" | "Mixed";
  baseFreeHours: number;
  peakHours?: string;
  chargePerHour: number;
}

export interface ZoneStatistics {
  totalVehicles: number;
  averageDuration: number;
  totalRevenue: number;
  exemptVehicles: number;
  peakHour: number;
  congestionLevel: "Low" | "Medium" | "High";
}



