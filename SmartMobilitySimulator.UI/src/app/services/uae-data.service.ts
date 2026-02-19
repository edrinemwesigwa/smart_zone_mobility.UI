import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { getApiBase } from "./api-base";

export interface UaeFactDto {
  category: string;
  fact: string;
  source: string;
  year: number;
  relevance: number;
  calculation?: string;
  breakdown?: string;
  comparison?: string;
  target?: string;
  components?: string;
  impact?: string;
  economicImpact?: string;
}

export interface InternationalBenchmarkDto {
  city: string;
  system: string;
  implemented: number;
  congestionReduction: number;
  annualRevenueMillionUSD: number;
  chargeRange: string;
  lessons?: string;
  advantages?: string;
}

@Injectable({
  providedIn: "root",
})
export class UaeDataService {
  private apiUrl = `${getApiBase()}/api/uae-data`;

  constructor(private http: HttpClient) {}

  getFacts(category?: string): Observable<UaeFactDto[]> {
    return this.http.get<UaeFactDto[]>(`${this.apiUrl}/facts`, {
      params: category ? { category } : {},
    });
  }

  getBenchmarks(): Observable<InternationalBenchmarkDto[]> {
    return this.http.get<InternationalBenchmarkDto[]>(
      `${this.apiUrl}/benchmarks`,
    );
  }
}



