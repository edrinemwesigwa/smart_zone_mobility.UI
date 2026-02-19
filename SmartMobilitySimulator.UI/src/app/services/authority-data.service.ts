import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { getApiBase } from "./api-base";
import { TransportAuthority } from "../models/transport-authority.model";
import {
  AuthorityComparison,
  AuthorityDataSource,
  AuthorityRoadmap,
  AuthorityZoneData,
  AuthorityZoneRecommendation,
} from "../models/authority-data.model";
import {
  SimulationRequest,
  SimulationResult,
} from "../models/simulation.model";
import { BusinessCaseDto } from "./business-case.service";

@Injectable({
  providedIn: "root",
})
export class AuthorityDataService {
  private apiUrl = `${getApiBase()}/api/authority-data`;

  constructor(private http: HttpClient) {}

  getAuthorities(): Observable<TransportAuthority[]> {
    return this.http.get<TransportAuthority[]>(`${this.apiUrl}/authorities`);
  }

  getDataSources(authorityCode: string): Observable<AuthorityDataSource[]> {
    return this.http.get<AuthorityDataSource[]>(
      `${this.apiUrl}/${authorityCode}/data-sources`,
    );
  }

  getRecommendations(
    authorityCode: string,
  ): Observable<AuthorityZoneRecommendation[]> {
    return this.http.get<AuthorityZoneRecommendation[]>(
      `${this.apiUrl}/${authorityCode}/recommendations`,
    );
  }

  getZoneData(
    authorityCode: string,
    zoneId: string,
  ): Observable<AuthorityZoneData> {
    return this.http.get<AuthorityZoneData>(
      `${this.apiUrl}/${authorityCode}/zone-data/${zoneId}`,
    );
  }

  runAuthoritySimulation(
    authorityCode: string,
    request: SimulationRequest,
  ): Observable<SimulationResult> {
    return this.http.post<SimulationResult>(
      `${this.apiUrl}/${authorityCode}/simulate`,
      request,
    );
  }

  getAuthorityReport(
    authorityCode: string,
    simulationId: string,
  ): Observable<Blob> {
    return this.http.get(
      `${this.apiUrl}/${authorityCode}/report/${simulationId}`,
      {
        responseType: "blob",
      },
    );
  }

  getAuthorityPitchDeck(
    authorityCode: string,
    simulationId: string,
  ): Observable<Blob> {
    return this.http.get(
      `${this.apiUrl}/${authorityCode}/pitch-deck/${simulationId}`,
      { responseType: "blob" },
    );
  }

  getAuthorityBusinessCase(
    authorityCode: string,
    simulationId: string,
  ): Observable<BusinessCaseDto> {
    return this.http.get<BusinessCaseDto>(
      `${this.apiUrl}/${authorityCode}/business-case/${simulationId}`,
    );
  }

  compareRtaVsItc(request: SimulationRequest): Observable<AuthorityComparison> {
    return this.http.post<AuthorityComparison>(
      `${this.apiUrl}/compare/rta-itc`,
      request,
    );
  }

  getUaeRoadmap(): Observable<AuthorityRoadmap> {
    return this.http.get<AuthorityRoadmap>(`${this.apiUrl}/roadmap`);
  }
}



