import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { firstValueFrom } from "rxjs";
import { getApiBase } from "./api-base";

export interface TrafficData {
  averageSpeed: number;
  congestionLevel: number;
  timestamp: string;
  reliability: number;
  segments: TrafficSegment[];
  incidents: TrafficIncident[];
}

export interface TrafficSegment {
  id: string;
  path: [number, number][];
  speed: number;
  congestionLevel: number;
  flowDirection: "N" | "S" | "E" | "W" | "NE" | "NW" | "SE" | "SW";
}

export interface TrafficIncident {
  id: string;
  type: "Accident" | "Roadworks" | "Closure" | "Event";
  description: string;
  severity: "Low" | "Medium" | "High";
  latitude: number;
  longitude: number;
  startTime?: string;
  endTime?: string;
}

export interface HistoricalPatternResponse {
  points: [number, number, number][];
  segments: TrafficSegment[];
  incidents: TrafficIncident[];
  baseSpeed: number;
  congestionLevel: number;
}

@Injectable({
  providedIn: "root",
})
export class TrafficApiService {
  private apiUrl = `${getApiBase()}/api/traffic`;
  private liveApiEnabled = true;

  constructor(private http: HttpClient) {}

  isLiveAvailable(): boolean {
    return this.liveApiEnabled;
  }

  async getLiveTraffic(zoneId: string): Promise<TrafficData> {
    try {
      return await firstValueFrom(
        this.http.get<TrafficData>(`${this.apiUrl}/live/${zoneId}`),
      );
    } catch {
      return this.buildMockTraffic(zoneId);
    }
  }

  async getHistoricalPattern(
    zoneId: string,
    time: Date,
  ): Promise<HistoricalPatternResponse> {
    try {
      return await firstValueFrom(
        this.http.get<HistoricalPatternResponse>(
          `${this.apiUrl}/historical/${zoneId}`,
          {
            params: { time: time.toISOString() },
          },
        ),
      );
    } catch {
      return this.buildMockHistorical(time);
    }
  }

  async getIncidents(area: string): Promise<TrafficIncident[]> {
    try {
      return await firstValueFrom(
        this.http.get<TrafficIncident[]>(`${this.apiUrl}/incidents`, {
          params: { area },
        }),
      );
    } catch {
      return [];
    }
  }

  private buildMockTraffic(zoneId: string): TrafficData {
    const segments = this.mockSegments();
    const avgSpeed =
      segments.reduce((sum, s) => sum + s.speed, 0) / (segments.length || 1);
    const congestion =
      segments.reduce((sum, s) => sum + s.congestionLevel, 0) /
      (segments.length || 1);

    return {
      averageSpeed: Math.round(avgSpeed * 10) / 10,
      congestionLevel: Math.round(congestion),
      timestamp: new Date().toISOString(),
      reliability: 0.7,
      segments,
      incidents: this.mockIncidents(),
    };
  }

  private buildMockHistorical(time: Date): HistoricalPatternResponse {
    const hour = time.getHours();
    const baseSpeed =
      hour >= 7 && hour <= 9 ? 25 : hour >= 16 && hour <= 19 ? 28 : 55;
    const congestion =
      hour >= 7 && hour <= 9 ? 75 : hour >= 16 && hour <= 19 ? 70 : 40;

    return {
      points: [],
      segments: this.mockSegments(baseSpeed),
      incidents: this.mockIncidents(),
      baseSpeed,
      congestionLevel: congestion,
    };
  }

  private mockSegments(baseSpeed: number = 40): TrafficSegment[] {
    const speeds = [baseSpeed - 5, baseSpeed, baseSpeed + 6, baseSpeed - 8];
    const congestionLevels = [60, 40, 30, 70];
    const directions: TrafficSegment["flowDirection"][] = ["N", "S", "E", "W"];

    return speeds.map((speed, index) => ({
      id: `seg-${index + 1}`,
      path: [],
      speed: Math.max(15, speed),
      congestionLevel: congestionLevels[index] ?? 50,
      flowDirection: directions[index] ?? "N",
    }));
  }

  private mockIncidents(): TrafficIncident[] {
    return [
      {
        id: "incident-1",
        type: "Roadworks",
        description: "Lane closure due to maintenance",
        severity: "Medium",
        latitude: 25.2048,
        longitude: 55.2708,
      },
      {
        id: "incident-2",
        type: "Accident",
        description: "Minor collision, expect delays",
        severity: "Low",
        latitude: 24.4539,
        longitude: 54.3773,
      },
    ];
  }
}



