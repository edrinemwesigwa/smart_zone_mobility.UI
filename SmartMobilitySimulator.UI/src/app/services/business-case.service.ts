import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { getApiBase } from "./api-base";

export interface BusinessCaseDto {
  pilotCost: number;
  year1Revenue: number;
  year5Revenue: number;
  total5YearRevenue: number;
  npv: number;
  irr: number;
  paybackPeriod: number;
  breakEvenMonth: number;
  cashFlows: number[];
  sensitivityAnalysis: {
    bestCase: number;
    worstCase: number;
    baseCase: number;
  };
  directRevenue?: number;
  metroRidershipIncreaseValue?: number;
  tourismRetentionValue?: number;
  smartCityFundingEligibility?: number;
  implementationCost?: number;
  annualMaintenance?: number;
  supportsDubai2040?: boolean;
  enhancesTourismExperience?: boolean;
  increasesMetroRevenue?: boolean;
  industrialProductivityGain?: number;
  safetyCostSavings?: number;
  environmentalComplianceValue?: number;
  supportsAbuDhabi2030?: boolean;
  improvesIndustrialEfficiency?: boolean;
  enhancesSafety?: boolean;
  supportsNetZero2050?: boolean;
  commuterProductivityGain?: number;
  affordableHousingValue?: number;
  crossBorderEfficiency?: number;
  supportsSharjah2040?: boolean;
  improvesAffordableHousing?: boolean;
  reducesCrossBorderCongestion?: boolean;
  supportsIndustrialWorkers?: boolean;
  roi?: number;
}

@Injectable({
  providedIn: "root",
})
export class BusinessCaseService {
  private apiUrl = `${getApiBase()}/api/business-case`;

  constructor(private http: HttpClient) {}

  getBusinessCase(
    simulationId: string,
    years: number,
  ): Observable<BusinessCaseDto> {
    return this.http.get<BusinessCaseDto>(
      `${this.apiUrl}/${simulationId}?years=${years}`,
    );
  }
}



