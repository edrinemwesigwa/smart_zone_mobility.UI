import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, BehaviorSubject } from "rxjs";
import { VehicleMovement } from "../models/simulation.model";
import { getApiBase } from "./api-base";

@Injectable({
  providedIn: "root",
})
export class RTADataService {
  private apiUrl = `${getApiBase()}/api/rta`;
  private mockDataSubject = new BehaviorSubject<VehicleMovement[]>([]);
  public mockData$ = this.mockDataSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Generate mock RTA vehicle movement data
   */
  generateMockData(
    zoneId: string,
    date: Date,
    vehicleCount: number = 100,
  ): Observable<VehicleMovement[]> {
    return this.http.post<VehicleMovement[]>(`${this.apiUrl}/generate-mock`, {
      zoneId,
      date,
      vehicleCount,
    });
  }

  /**
   * Get vehicle movements for a zone on a specific date
   */
  getVehicleMovements(
    zoneId: string,
    startDate: Date,
    endDate: Date,
  ): Observable<VehicleMovement[]> {
    return this.http.get<VehicleMovement[]>(`${this.apiUrl}/movements`, {
      params: {
        zoneId,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      },
    });
  }

  /**
   * Get aggregated vehicle statistics
   */
  getVehicleStatistics(zoneId: string, date: Date): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/statistics`, {
      params: {
        zoneId,
        date: date.toISOString(),
      },
    });
  }

  /**
   * Simulate Dubai traffic patterns
   */
  generateDubaiTraffic(date: Date): Observable<VehicleMovement[]> {
    return this.http.post<VehicleMovement[]>(`${this.apiUrl}/dubai-traffic`, {
      date,
    });
  }

  /**
   * Simulate Abu Dhabi traffic patterns
   */
  generateAbuDhabiTraffic(date: Date): Observable<VehicleMovement[]> {
    return this.http.post<VehicleMovement[]>(
      `${this.apiUrl}/abudhabi-traffic`,
      { date },
    );
  }

  /**
   * Get real-time traffic feed (mock)
   */
  getRealTimeTrafficFeed(zoneId: string): Observable<VehicleMovement[]> {
    return this.http.get<VehicleMovement[]>(
      `${this.apiUrl}/realtime/${zoneId}`,
    );
  }
}



