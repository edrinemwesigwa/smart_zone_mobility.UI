import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Zone, ZoneStatistics, ZoneUpsertRequest } from "../models/zone.model";
import { getApiBase } from "./api-base";

@Injectable({
  providedIn: "root",
})
export class ZoneService {
  private apiUrl = `${getApiBase()}/api/zones`;

  constructor(private http: HttpClient) {}

  getAllZones(): Observable<Zone[]> {
    return this.http.get<Zone[]>(this.apiUrl);
  }

  getZoneById(id: string): Observable<Zone> {
    return this.http.get<Zone>(`${this.apiUrl}/${id}`);
  }

  getZonesByEmirate(emirate: string): Observable<Zone[]> {
    return this.http.get<Zone[]>(`${this.apiUrl}/emirate/${emirate}`);
  }

  getZonesByType(zoneType: string): Observable<Zone[]> {
    return this.http.get<Zone[]>(`${this.apiUrl}/type/${zoneType}`);
  }

  getZoneBoundary(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}/boundary`);
  }

  createZone(zone: ZoneUpsertRequest): Observable<Zone> {
    return this.http.post<Zone>(this.apiUrl, zone);
  }

  updateZone(id: string, zone: ZoneUpsertRequest): Observable<Zone> {
    return this.http.put<Zone>(`${this.apiUrl}/${id}`, zone);
  }

  deleteZone(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getZoneStatistics(zoneId: string, date: Date): Observable<ZoneStatistics> {
    return this.http.get<ZoneStatistics>(
      `${this.apiUrl}/${zoneId}/statistics`,
      {
        params: { date: date.toISOString() },
      },
    );
  }
}



