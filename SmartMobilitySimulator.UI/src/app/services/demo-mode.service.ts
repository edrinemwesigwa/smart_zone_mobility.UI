import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { DemoScenarioDto } from "../models/demo-scenario.model";
import { getApiBase } from "./api-base";

@Injectable({
  providedIn: "root",
})
export class DemoModeService {
  private apiUrl = `${getApiBase()}/api/demo`;

  constructor(private http: HttpClient) {}

  getScenarios(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/scenarios`);
  }

  getScenario(name: string): Observable<DemoScenarioDto> {
    return this.http.get<DemoScenarioDto>(`${this.apiUrl}/${name}`);
  }
}



