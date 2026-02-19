import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import {
  SimulationRequest,
  SimulationResult,
} from "../models/simulation.model";
import { getApiBase } from "./api-base";

export interface SaveSimulationRequest {
  id?: string;
  name?: string;
  description?: string;
  zoneRules?: string;
  results?: string;
  totalVehicles: number;
  vehiclesDiverted: number;
  congestionReduction: number;
  estimatedRevenue: number;
  equityImpact: number;
  environmentalImpact: number;
  isPublic: boolean;
}

@Injectable({
  providedIn: "root",
})
export class SimulationService {
  private apiUrl = `${getApiBase()}/api/simulations`;

  constructor(private http: HttpClient) {}

  runSimulation(request: SimulationRequest): Observable<SimulationResult> {
    return this.http.post<SimulationResult>(`${this.apiUrl}/run`, request);
  }

  getSimulationResult(id: string): Observable<SimulationResult> {
    return this.http.get<SimulationResult>(`${this.apiUrl}/${id}`);
  }

  getAllSimulations(): Observable<SimulationResult[]> {
    return this.http.get<SimulationResult[]>(this.apiUrl);
  }

  // Get current user's saved simulations
  getMySimulations(): Observable<SimulationResult[]> {
    return this.http.get<SimulationResult[]>(`${this.apiUrl}/my`);
  }

  // Save simulation for current user
  saveSimulation(request: SaveSimulationRequest): Observable<SimulationResult> {
    const dto = {
      ...request,
      id: request.id ? request.id : undefined,
    };
    return this.http.post<SimulationResult>(`${this.apiUrl}/save`, dto);
  }

  // Share simulation publicly (admin only)
  shareSimulation(id: string, isPublic: boolean): Observable<SimulationResult> {
    return this.http.post<SimulationResult>(`${this.apiUrl}/${id}/share`, {
      isPublic,
    });
  }

  compareSimulations(ids: string[]): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/compare`, {
      simulationIds: ids,
    });
  }

  deleteSimulation(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  exportSimulationReport(
    id: string,
    format: "pdf" | "csv" | "json",
  ): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}/export`, {
      params: { format },
      responseType: "blob",
    });
  }

  getEconomicImpact(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}/economic-impact`);
  }

  getInvestorReport(id: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/investor-report`, {
      responseType: "blob",
    });
  }

  // Generate authority/government report
  getAuthorityReport(
    id: string,
    authorityName: string = "RTA Dubai",
    jurisdiction: string = "Dubai, UAE",
  ): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/authority-report`, {
      params: { authorityName, jurisdiction },
      responseType: "blob",
    });
  }
}



