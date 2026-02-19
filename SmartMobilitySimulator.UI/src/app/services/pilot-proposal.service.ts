import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { PilotOptions, PilotProposalDto } from "../models/pilot-proposal.model";
import { getApiBase } from "./api-base";

@Injectable({
  providedIn: "root",
})
export class PilotProposalService {
  private apiUrl = `${getApiBase()}/api/pilot`;

  constructor(private http: HttpClient) {}

  generateProposal(
    simulationId: string,
    options: PilotOptions,
  ): Observable<PilotProposalDto> {
    return this.http.post<PilotProposalDto>(
      `${this.apiUrl}/generate-proposal/${simulationId}`,
      options,
    );
  }
}



