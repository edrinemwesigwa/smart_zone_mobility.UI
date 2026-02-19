import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { SimulationResult } from "../models/simulation.model";
import { TransportAuthority } from "../models/transport-authority.model";
import { AuthorityDataService } from "../services/authority-data.service";
import { jsPDF } from "jspdf";

interface ExecutiveMetric {
  value: string;
  label: string;
  description: string;
}

interface AuthorityPriority {
  name: string;
  impact: number;
  evidence: string;
  recommendation: string;
}

interface ImplementationPhase {
  name: string;
  duration: string;
  budget: number;
  outcomes: string;
  tasks: string[];
}

interface AuthorityBenefit {
  name: string;
  value: string;
}

interface ReportSection {
  title: string;
  content: string;
}

@Component({
  selector: "app-authority-report",
  template: `
    <div class="report-container" id="report-content">
      <!-- Report Header -->
      <header class="report-header">
        <div class="header-content">
          <div class="logo-section">
            <img
              [src]="getLogoUrl()"
              class="authority-logo"
              [alt]="authority.name"
            />
            <div class="authority-details">
              <h1>{{ authority.name }}</h1>
              <p class="report-subtitle">
                Smart Mobility Access Implementation Analysis
              </p>
            </div>
          </div>
          <div class="report-meta">
            <div class="meta-item">
              <span class="meta-label">Report Date</span>
              <span class="meta-value">{{ today | date: "mediumDate" }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Reference</span>
              <span class="meta-value">SZS-{{ getReferenceNumber() }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Classification</span>
              <span class="meta-value classification">Official Use</span>
            </div>
          </div>
        </div>
      </header>

      <!-- Executive Summary -->
      <section class="report-section">
        <h2 class="section-title">1. Executive Summary</h2>
        <div class="executive-grid">
          <div class="exec-card" *ngFor="let metric of executiveMetrics">
            <div class="exec-value">{{ metric.value }}</div>
            <div class="exec-label">{{ metric.label }}</div>
            <div class="exec-desc">{{ metric.description }}</div>
          </div>
        </div>
        <div class="executive-text">
          <p>{{ getAuthoritySummaryText(authority.code) }}</p>
        </div>
      </section>

      <!-- Problem Statement -->
      <section class="report-section">
        <h2 class="section-title">2. Problem Statement</h2>
        <div class="problem-grid">
          <div class="problem-card">
            <div class="problem-icon">🚗</div>
            <h4>Congestion Cost</h4>
            <p>{{ getCongestionCost(authority.code) }}</p>
          </div>
          <div class="problem-card">
            <div class="problem-icon">⏱️</div>
            <h4>Commute Times</h4>
            <p>{{ getCommuteTime(authority.code) }}</p>
          </div>
          <div class="problem-card">
            <div class="problem-icon">🌱</div>
            <h4>Environmental Impact</h4>
            <p>{{ getEnvironmentalImpact(authority.code) }}</p>
          </div>
          <div class="problem-card">
            <div class="problem-icon">💰</div>
            <h4>Economic Loss</h4>
            <p>{{ getEconomicLoss(authority.code) }}</p>
          </div>
        </div>
      </section>

      <!-- Proposed Solution -->
      <section class="report-section">
        <h2 class="section-title">
          3. Proposed Solution: FAIR Smart Mobility Model
        </h2>
        <div class="solution-overview">
          <p>
            The Smart Mobility Access system uses a
            <strong>FAIR (Fair Access Incentivizing Revenue)</strong> model that
            balances revenue generation with social equity:
          </p>
        </div>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">🏠</div>
            <h4>Residents</h4>
            <p>FREE access with tenancy verification</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">💼</div>
            <h4>Workers</h4>
            <p>FREE access with employment verification</p>
          </div>
          <div class="feature-card">
            <div class="problem-icon">⏰</div>
            <h4>Visitors</h4>
            <p>20-minute grace period before charges</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🚌</div>
            <h4>Transit</h4>
            <p>Always FREE to encourage modal shift</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🌙</div>
            <h4>Off-Peak</h4>
            <p>FREE 8PM - 7AM to spread demand</p>
          </div>
        </div>
      </section>

      <!-- Impact Analysis -->
      <section class="report-section">
        <h2 class="section-title">4. Impact Analysis</h2>
        <div class="priorities-table">
          <h3>Alignment with {{ authority.jurisdiction }} Priorities</h3>
          <table>
            <thead>
              <tr>
                <th>Priority Area</th>
                <th>Impact Score</th>
                <th>Evidence</th>
                <th>Recommendation</th>
              </tr>
            </thead>
            <tbody>
              <tr
                *ngFor="let priority of getAuthorityPriorities(authority.code)"
              >
                <td>
                  <strong>{{ priority.name }}</strong>
                </td>
                <td>
                  <div class="score-cell">
                    <div class="score-bar">
                      <div
                        class="score-fill"
                        [style.width.%]="priority.impact * 10"
                      ></div>
                    </div>
                    <span>{{ priority.impact }}/10</span>
                  </div>
                </td>
                <td>{{ priority.evidence }}</td>
                <td>{{ priority.recommendation }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Implementation Plan -->
      <section class="report-section">
        <h2 class="section-title">5. Implementation Roadmap</h2>
        <div class="phases-timeline">
          <div
            class="phase-item"
            *ngFor="
              let phase of getImplementationPhases(authority.code);
              let i = index
            "
          >
            <div class="phase-marker">
              <span class="phase-num">{{ i + 1 }}</span>
            </div>
            <div class="phase-content">
              <div class="phase-header">
                <h4>{{ phase.name }}</h4>
                <span class="phase-duration">⏱️ {{ phase.duration }}</span>
              </div>
              <div class="phase-budget">
                <strong>Budget:</strong> {{ phase.budget | currency: "AED" }}
              </div>
              <ul class="phase-tasks">
                <li *ngFor="let task of phase.tasks">{{ task }}</li>
              </ul>
              <div class="phase-outcomes">
                <strong>Expected Outcomes:</strong> {{ phase.outcomes }}
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Financial Projections -->
      <section class="report-section">
        <h2 class="section-title">6. Financial Projections</h2>
        <div class="financial-summary">
          <div class="financial-highlight">
            <div class="fin-item">
              <span class="fin-label">5-Year Revenue</span>
              <span class="fin-value">{{
                calculate5YearRevenue() | currency: "AED" : "symbol" : "1.0-0"
              }}</span>
            </div>
            <div class="fin-item">
              <span class="fin-label">Implementation Cost</span>
              <span class="fin-value">{{
                getImplementationCost(authority.code)
                  | currency: "AED" : "symbol" : "1.0-0"
              }}</span>
            </div>
            <div class="fin-item">
              <span class="fin-label">Annual Operating</span>
              <span class="fin-value">{{
                getAnnualOperatingCost(authority.code)
                  | currency: "AED" : "symbol" : "1.0-0"
              }}</span>
            </div>
            <div class="fin-item highlight">
              <span class="fin-label">5-Year NPV</span>
              <span class="fin-value">{{
                calculateNPV() | currency: "AED" : "symbol" : "1.0-0"
              }}</span>
            </div>
          </div>
        </div>

        <div class="benefits-section">
          <h3>Projected Benefits</h3>
          <ul class="benefits-list">
            <li *ngFor="let benefit of getAuthorityBenefits(authority.code)">
              <strong>{{ benefit.name }}:</strong> {{ benefit.value }}
            </li>
          </ul>
        </div>
      </section>

      <!-- Risk Assessment -->
      <section class="report-section">
        <h2 class="section-title">7. Risk Assessment</h2>
        <div class="risk-table">
          <table>
            <thead>
              <tr>
                <th>Risk Category</th>
                <th>Likelihood</th>
                <th>Impact</th>
                <th>Mitigation</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Public Resistance</td>
                <td><span class="risk-medium">Medium</span></td>
                <td><span class="risk-high">High</span></td>
                <td>Extensive public consultation, resident exemptions</td>
              </tr>
              <tr>
                <td>Technical Implementation</td>
                <td><span class="risk-low">Low</span></td>
                <td><span class="risk-medium">Medium</span></td>
                <td>Phased rollout, pilot testing</td>
              </tr>
              <tr>
                <td>Legal Challenges</td>
                <td><span class="risk-low">Low</span></td>
                <td><span class="risk-high">High</span></td>
                <td>Pre-clearance with legal counsel</td>
              </tr>
              <tr>
                <td>Data Privacy</td>
                <td><span class="risk-medium">Medium</span></td>
                <td><span class="risk-medium">Medium</span></td>
                <td>UAE Data Protection compliance</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Recommendations -->
      <section class="report-section">
        <h2 class="section-title">8. Recommendations</h2>
        <div class="recommendations-list">
          <div class="rec-item">
            <span class="rec-num">1</span>
            <div class="rec-content">
              <h4>Proceed with Pilot Implementation</h4>
              <p>
                Launch a 6-month pilot in selected zone to validate projections
                and gather public feedback.
              </p>
            </div>
          </div>
          <div class="rec-item">
            <span class="rec-num">2</span>
            <div class="rec-content">
              <h4>Establish Governance Framework</h4>
              <p>
                Create oversight committee with representation from transport
                authority, municipalities, and public.
              </p>
            </div>
          </div>
          <div class="rec-item">
            <span class="rec-num">3</span>
            <div class="rec-content">
              <h4>Develop Public Communication Strategy</h4>
              <p>
                Launch awareness campaign emphasizing fair exemptions and
                environmental benefits.
              </p>
            </div>
          </div>
          <div class="rec-item">
            <span class="rec-num">4</span>
            <div class="rec-content">
              <h4>Implement Technology Infrastructure</h4>
              <p>
                Deploy sensors, enforcement systems, and payment processing
                before launch.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Appendix -->
      <section class="report-section appendix">
        <h2 class="section-title">Appendix A: Methodology</h2>
        <p>This analysis uses data from:</p>
        <ul>
          <li>
            International congestion pricing benchmarks (Singapore ERP, London
            Congestion Charge, Stockholm, Milan)
          </li>
          <li>UAE transport authority statistics and reports</li>
          <li>World Bank economic studies on congestion pricing</li>
          <li>Simulation modeling based on local traffic patterns</li>
        </ul>
        <p class="disclaimer">
          <strong>Disclaimer:</strong> Projections are estimates based on
          international benchmarks and local conditions. Actual results may
          vary. This report does not constitute financial advice.
        </p>
      </section>

      <!-- Footer -->
      <footer class="report-footer">
        <div class="footer-content">
          <p>
            Prepared by Smart Mobility Simulator | {{ today | date: "fullDate" }}
          </p>
          <p>{{ authority.name }} - Confidential</p>
        </div>
      </footer>
    </div>

    <!-- Action Buttons -->
    <div class="action-bar">
      <button class="btn-download" (click)="downloadPDF()">
        📥 Download PDF Report
      </button>
      <button class="btn-back" (click)="goBack()">
        ← Back to Authority Selection
      </button>
    </div>
  `,
  styles: [
    `
      .report-container {
        max-width: 900px;
        margin: 0 auto;
        background: white;
        padding: 40px;
        font-family: "Segoe UI", Arial, sans-serif;
        color: #1a1a1a;
        line-height: 1.6;
      }

      /* Header */
      .report-header {
        border-bottom: 3px solid #0066cc;
        padding-bottom: 20px;
        margin-bottom: 30px;
      }

      .header-content {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        flex-wrap: wrap;
        gap: 20px;
      }

      .logo-section {
        display: flex;
        align-items: center;
        gap: 20px;
      }

      .authority-logo {
        width: 80px;
        height: 80px;
        object-fit: contain;
        border-radius: 8px;
      }

      .authority-details h1 {
        margin: 0;
        font-size: 1.5rem;
        color: #1a1a1a;
      }

      .report-subtitle {
        margin: 5px 0 0;
        color: #666;
        font-size: 1rem;
      }

      .report-meta {
        display: flex;
        gap: 20px;
      }

      .meta-item {
        text-align: center;
      }

      .meta-label {
        display: block;
        font-size: 0.75rem;
        color: #666;
        text-transform: uppercase;
      }

      .meta-value {
        font-weight: 600;
        color: #1a1a1a;
      }

      .classification {
        background: #e3f2fd;
        color: #1565c0;
        padding: 2px 8px;
        border-radius: 4px;
        font-size: 0.7rem;
      }

      /* Sections */
      .report-section {
        margin-bottom: 35px;
      }

      .section-title {
        color: #0066cc;
        font-size: 1.2rem;
        border-bottom: 1px solid #e0e0e0;
        padding-bottom: 8px;
        margin-bottom: 20px;
      }

      /* Executive Summary */
      .executive-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 15px;
        margin-bottom: 20px;
      }

      .exec-card {
        background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        padding: 15px;
        border-radius: 8px;
        text-align: center;
        border-left: 4px solid #0066cc;
      }

      .exec-value {
        font-size: 1.5rem;
        font-weight: 700;
        color: #0066cc;
      }

      .exec-label {
        font-size: 0.8rem;
        font-weight: 600;
        color: #333;
      }

      .exec-desc {
        font-size: 0.7rem;
        color: #666;
      }

      .executive-text {
        background: #f8f9fa;
        padding: 20px;
        border-radius: 8px;
        font-size: 0.95rem;
      }

      /* Problem Grid */
      .problem-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 15px;
      }

      .problem-card {
        background: #fff3e0;
        padding: 20px;
        border-radius: 8px;
        border-left: 4px solid #ff9800;
      }

      .problem-icon {
        font-size: 1.5rem;
        margin-bottom: 10px;
      }

      .problem-card h4 {
        margin: 0 0 8px;
        color: #e65100;
      }

      .problem-card p {
        margin: 0;
        font-size: 0.85rem;
      }

      /* Solution */
      .solution-overview {
        background: #e8f5e9;
        padding: 20px;
        border-radius: 8px;
        margin-bottom: 20px;
      }

      .features-grid {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 10px;
      }

      .feature-card {
        background: white;
        padding: 15px 10px;
        border-radius: 8px;
        text-align: center;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .feature-icon {
        font-size: 1.5rem;
        margin-bottom: 8px;
      }

      .feature-card h4 {
        margin: 0 0 5px;
        font-size: 0.8rem;
        color: #333;
      }

      .feature-card p {
        margin: 0;
        font-size: 0.7rem;
        color: #666;
      }

      /* Priorities Table */
      .priorities-table table {
        width: 100%;
        border-collapse: collapse;
      }

      .priorities-table th,
      .priorities-table td {
        padding: 12px;
        text-align: left;
        border-bottom: 1px solid #e0e0e0;
      }

      .priorities-table th {
        background: #f5f5f5;
        font-weight: 600;
        font-size: 0.85rem;
      }

      .priorities-table td {
        font-size: 0.85rem;
      }

      .score-cell {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .score-bar {
        width: 60px;
        height: 8px;
        background: #e0e0e0;
        border-radius: 4px;
        overflow: hidden;
      }

      .score-fill {
        height: 100%;
        background: linear-gradient(90deg, #4caf50, #8bc34a);
      }

      /* Implementation */
      .phases-timeline {
        position: relative;
      }

      .phase-item {
        display: flex;
        gap: 20px;
        margin-bottom: 20px;
      }

      .phase-marker {
        width: 40px;
        height: 40px;
        background: #0066cc;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: 700;
        flex-shrink: 0;
      }

      .phase-content {
        flex: 1;
        background: #f8f9fa;
        padding: 20px;
        border-radius: 8px;
      }

      .phase-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
      }

      .phase-header h4 {
        margin: 0;
        color: #1a1a1a;
      }

      .phase-duration {
        background: #e3f2fd;
        color: #1565c0;
        padding: 3px 10px;
        border-radius: 12px;
        font-size: 0.8rem;
      }

      .phase-budget {
        font-weight: 600;
        color: #2e7d32;
        margin-bottom: 10px;
      }

      .phase-tasks {
        margin: 0 0 10px;
        padding-left: 20px;
        font-size: 0.85rem;
      }

      .phase-outcomes {
        font-size: 0.85rem;
        color: #666;
      }

      /* Financial */
      .financial-highlight {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 15px;
        margin-bottom: 20px;
      }

      .fin-item {
        background: #f8f9fa;
        padding: 15px;
        border-radius: 8px;
        text-align: center;
      }

      .fin-item.highlight {
        background: linear-gradient(135deg, #c8e6c9 0%, #a5d6a7 100%);
        border: 2px solid #4caf50;
      }

      .fin-label {
        display: block;
        font-size: 0.75rem;
        color: #666;
      }

      .fin-value {
        display: block;
        font-size: 1.1rem;
        font-weight: 700;
        color: #1a1a1a;
      }

      .fin-item.highlight .fin-value {
        color: #2e7d32;
      }

      .benefits-section {
        background: #e8f5e9;
        padding: 20px;
        border-radius: 8px;
      }

      .benefits-list {
        list-style: none;
        padding: 0;
        margin: 10px 0 0;
      }

      .benefits-list li {
        padding: 8px 0;
        border-bottom: 1px solid #c8e6c9;
        font-size: 0.9rem;
      }

      .benefits-list li:last-child {
        border-bottom: none;
      }

      /* Risk Table */
      .risk-table table {
        width: 100%;
        border-collapse: collapse;
      }

      .risk-table th,
      .risk-table td {
        padding: 12px;
        text-align: left;
        border-bottom: 1px solid #e0e0e0;
      }

      .risk-table th {
        background: #f5f5f5;
      }

      .risk-low {
        color: #4caf50;
        font-weight: 600;
      }
      .risk-medium {
        color: #ff9800;
        font-weight: 600;
      }
      .risk-high {
        color: #f44336;
        font-weight: 600;
      }

      /* Recommendations */
      .recommendations-list {
        display: flex;
        flex-direction: column;
        gap: 15px;
      }

      .rec-item {
        display: flex;
        gap: 15px;
        background: #e3f2fd;
        padding: 15px;
        border-radius: 8px;
      }

      .rec-num {
        width: 30px;
        height: 30px;
        background: #1565c0;
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        flex-shrink: 0;
      }

      .rec-content h4 {
        margin: 0 0 5px;
        color: #0d47a1;
      }

      .rec-content p {
        margin: 0;
        font-size: 0.85rem;
        color: #333;
      }

      /* Appendix */
      .appendix {
        background: #f5f5f5;
        padding: 20px;
        border-radius: 8px;
        font-size: 0.85rem;
      }

      .disclaimer {
        margin-top: 20px;
        padding: 10px;
        background: #fff3e0;
        border-left: 4px solid #ff9800;
        font-size: 0.8rem;
      }

      /* Footer */
      .report-footer {
        margin-top: 40px;
        padding-top: 20px;
        border-top: 2px solid #e0e0e0;
        text-align: center;
        color: #666;
        font-size: 0.8rem;
      }

      /* Action Bar */
      .action-bar {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: white;
        padding: 15px 20px;
        box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1);
        display: flex;
        justify-content: center;
        gap: 15px;
        z-index: 100;
      }

      .btn-download {
        background: #0066cc;
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .btn-download:hover {
        background: #0052a3;
      }

      .btn-back {
        background: #f5f5f5;
        color: #333;
        border: 1px solid #ddd;
        padding: 12px 24px;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
      }

      .btn-back:hover {
        background: #e0e0e0;
      }

      @media print {
        .action-bar {
          display: none;
        }
        .report-container {
          padding: 20px;
        }
      }

      @media (max-width: 768px) {
        .executive-grid,
        .financial-highlight,
        .features-grid {
          grid-template-columns: repeat(2, 1fr);
        }
        .problem-grid {
          grid-template-columns: 1fr;
        }
        .header-content {
          flex-direction: column;
        }
      }
    `,
  ],
})
export class AuthorityReportComponent implements OnInit {
  @Input() authority: TransportAuthority = {
    name: "Dubai Roads and Transport Authority (RTA)",
    code: "RTA",
    jurisdiction: "Dubai",
    logoUrl: "/assets/images/rta-dubai.jpg",
  };
  @Input() simulationResult: SimulationResult = {
    id: "local",
    name: "Authority Summary",
    totalVehicles: 0,
    vehiclesDiverted: 0,
    congestionReduction: 25,
    estimatedRevenue: 180000000,
    equityImpact: {
      lowIncomeBurden: 0.08,
      highIncomeBurden: 0.06,
      isRegressive: false,
      burdenRatio: 0.5,
    },
    environmentalImpact: 0,
    zoneRules: {},
    results: {},
    createdAt: new Date(),
  };

  today = new Date();
  executiveMetrics: ExecutiveMetric[] = [];

  constructor(
    private route: ActivatedRoute,
    private authorityDataService: AuthorityDataService,
  ) {}

  ngOnInit(): void {
    const authorityCode = this.route.snapshot.queryParamMap.get("authority");
    if (authorityCode) {
      this.authority.code = authorityCode.toUpperCase();
      this.setAuthorityFromCode(authorityCode.toUpperCase());
    }

    this.executiveMetrics = [
      {
        value: "-25%",
        label: "Congestion Reduction",
        description: "Peak hour traffic reduction",
      },
      {
        value: "AED 180M",
        label: "Annual Revenue",
        description: "Net after exemptions",
      },
      {
        value: "15%",
        label: "Transit Shift",
        description: "Mode switch to public transport",
      },
      {
        value: "2.8B AED",
        label: "5-Year NPV",
        description: "Net present value",
      },
    ];
  }

  private setAuthorityFromCode(code: string): void {
    const authorities: Record<string, TransportAuthority> = {
      RTA: {
        name: "Dubai Roads and Transport Authority (RTA)",
        code: "RTA",
        jurisdiction: "Dubai",
        logoUrl: "/assets/images/rta-dubai.jpg",
      },
      ITC: {
        name: "Abu Dhabi Integrated Transport Centre (ITC)",
        code: "ITC",
        jurisdiction: "Abu Dhabi",
        logoUrl: "/assets/images/itc.png",
      },
      SRTA: {
        name: "Sharjah Roads & Transport Authority (SRTA)",
        code: "SRTA",
        jurisdiction: "Sharjah",
        logoUrl: "/assets/images/srta.png",
      },
    };
    if (authorities[code]) {
      this.authority = authorities[code];
    }
  }

  getLogoUrl(): string {
    return this.authority.logoUrl || "/assets/images/rta-dubai.jpg";
  }

  getReferenceNumber(): string {
    const year = this.today.getFullYear();
    const month = String(this.today.getMonth() + 1).padStart(2, "0");
    return `${this.authority.code}-${year}${month}-001`;
  }

  getAuthoritySummaryText(authorityCode: string): string {
    const summaries: Record<string, string> = {
      RTA: "This report presents a comprehensive analysis of implementing Smart Mobility Access pricing in Dubai. Based on international benchmarks and local traffic data, we project a 25% reduction in peak-hour congestion, generating AED 180 million in annual net revenue. The FAIR model ensures residents and workers receive free access, achieving higher public acceptance while funding Metro expansion and smart city initiatives aligned with Dubai 2040.",
      ITC: "This analysis evaluates Smart Mobility Access implementation for Abu Dhabi. Targeting industrial corridors and key arterial roads, the system projects 20% congestion reduction with AED 120 million annual revenue. The model supports Abu Dhabi's Economic Vision 2030 and Net Zero 2050 goals while providing fair exemptions for residents and workers.",
      SRTA: "This report examines Smart Mobility Access for Sharjah, focusing on cross-border efficiency with Dubai. Projections show 25% improvement in commute times and AED 60 million in annual revenue. The system addresses Sharjah's unique challenges in affordable housing accessibility and industrial worker mobility.",
    };
    return summaries[authorityCode] || summaries["RTA"];
  }

  getCongestionCost(code: string): string {
    const costs: Record<string, string> = {
      RTA: "AED 4.5 billion annually in lost productivity, fuel, and environmental costs",
      ITC: "AED 2.8 billion annually in industrial delays and logistics inefficiencies",
      SRTA: "AED 1.5 billion annually in commuter delays and border crossing congestion",
    };
    return costs[code] || costs["RTA"];
  }

  getCommuteTime(code: string): string {
    const times: Record<string, string> = {
      RTA: "Average 45 minutes peak, up to 90 minutes for cross-emirate commuters",
      ITC: "30-60 minutes average, 2+ hours for Mussafah corridor",
      SRTA: "25-40 minutes to Dubai, up to 75 minutes during peak",
    };
    return times[code] || times["RTA"];
  }

  getEnvironmentalImpact(code: string): string {
    const impacts: Record<string, string> = {
      RTA: "Transport = 23% of UAE CO2; 25% reduction saves 150,000 tons CO2/year",
      ITC: "Heavy vehicles = 40% of emissions; smoother flow cuts idling by 30%",
      SRTA: "Border queuing = 50 tons CO2/day; reduced idle = significant cut",
    };
    return impacts[code] || impacts["RTA"];
  }

  getEconomicLoss(code: string): string {
    const losses: Record<string, string> = {
      RTA: "AED 1,200 per vehicle annually in wasted time and fuel",
      ITC: "AED 2,400 per truck annually in delays",
      SRTA: "AED 800 per commuter annually in excess fuel/time",
    };
    return losses[code] || losses["RTA"];
  }

  getAuthorityPriorities(authorityCode: string): AuthorityPriority[] {
    const priorities: Record<string, AuthorityPriority[]> = {
      RTA: [
        {
          name: "Dubai 2040 Urban Plan",
          impact: 9.2,
          evidence: "25% congestion reduction aligns with 30% target",
          recommendation: "Prioritize tourist corridors",
        },
        {
          name: "Metro Integration",
          impact: 8.4,
          evidence: "15% shift to public transit expected",
          recommendation: "Expand park-and-ride",
        },
        {
          name: "Smart City Vision",
          impact: 8.0,
          evidence: "Real-time pricing with AI analytics",
          recommendation: "Deploy smart sensors",
        },
      ],
      ITC: [
        {
          name: "Industrial Productivity",
          impact: 8.7,
          evidence: "20% time savings in Mussafah",
          recommendation: "Target freight peaks",
        },
        {
          name: "Net Zero 2050",
          impact: 7.9,
          evidence: "CO2 reduction from smoother flow",
          recommendation: "Incentivize clean fleets",
        },
        {
          name: "Safety",
          impact: 7.5,
          evidence: "30% fewer accidents in pricing zones",
          recommendation: "Enhanced enforcement",
        },
      ],
      SRTA: [
        {
          name: "Cross-border Efficiency",
          impact: 9.1,
          evidence: "25% time savings for commuters",
          recommendation: "Coordinate with Dubai RTA",
        },
        {
          name: "Affordable Housing",
          impact: 7.8,
          evidence: "Reduced commute costs for workers",
          recommendation: "Subsidize passes",
        },
        {
          name: "Industrial Mobility",
          impact: 7.2,
          evidence: "Better access to workforce",
          recommendation: "Worker transit programs",
        },
      ],
    };
    return priorities[authorityCode] || priorities["RTA"];
  }

  getImplementationPhases(authorityCode: string): ImplementationPhase[] {
    const phases: Record<string, ImplementationPhase[]> = {
      RTA: [
        {
          name: "Phase 1: Pilot - Business Bay & Marina",
          duration: "6 months",
          budget: 5000000,
          outcomes: "Validate projections, refine pricing",
          tasks: [
            "Deploy sensors",
            "Launch app",
            "Monitor KPIs",
            "Public feedback",
          ],
        },
        {
          name: "Phase 2: CBD Expansion",
          duration: "9 months",
          budget: 8000000,
          outcomes: "Full downtown coverage",
          tasks: ["Expand zones", "Integrate parking", "Transit coordination"],
        },
        {
          name: "Phase 3: Full Rollout",
          duration: "12 months",
          budget: 12000000,
          outcomes: "City-wide implementation",
          tasks: ["Complete network", "Full enforcement", "Public launch"],
        },
      ],
      ITC: [
        {
          name: "Phase 1: Mussafah Pilot",
          duration: "6 months",
          budget: 3500000,
          outcomes: "Industrial corridor test",
          tasks: ["Engage operators", "Deploy monitoring", "Measure impact"],
        },
        {
          name: "Phase 2: City Access",
          duration: "9 months",
          budget: 6000000,
          outcomes: "Core city coverage",
          tasks: ["CBD pricing", "Signage", "Transit support"],
        },
      ],
      SRTA: [
        {
          name: "Phase 1: Border Optimization",
          duration: "5 months",
          budget: 2000000,
          outcomes: "Reduce crossing delays",
          tasks: ["Coordinate with RTA", "Deploy monitoring", "Public info"],
        },
        {
          name: "Phase 2: Industrial Zones",
          duration: "6 months",
          budget: 3000000,
          outcomes: "Worker mobility",
          tasks: ["Exemption system", "Transit links", "Evaluation"],
        },
      ],
    };
    return phases[authorityCode] || phases["RTA"];
  }

  calculate5YearRevenue(): number {
    return 180000000 * 5;
  }

  getImplementationCost(authorityCode: string): number {
    const costs: Record<string, number> = {
      RTA: 25000000,
      ITC: 15000000,
      SRTA: 8000000,
    };
    return costs[authorityCode] || 25000000;
  }

  getAnnualOperatingCost(authorityCode: string): number {
    const costs: Record<string, number> = {
      RTA: 1500000,
      ITC: 1000000,
      SRTA: 600000,
    };
    return costs[authorityCode] || 1500000;
  }

  calculateNPV(): number {
    const revenue = this.calculate5YearRevenue();
    const cost = this.getImplementationCost(this.authority.code);
    const operating = this.getAnnualOperatingCost(this.authority.code) * 5;
    return revenue - cost - operating;
  }

  getAuthorityBenefits(authorityCode: string): AuthorityBenefit[] {
    const benefits: Record<string, AuthorityBenefit[]> = {
      RTA: [
        {
          name: "Metro Funding",
          value: "+AED 180M/year for transit expansion",
        },
        { name: "Tourism Experience", value: "+15% visitor satisfaction" },
        { name: "Resident Value", value: "AED 400/year saved per resident" },
        { name: "Environmental", value: "150,000 tons CO2 reduction/year" },
      ],
      ITC: [
        { name: "Industrial Efficiency", value: "+AED 150M/year productivity" },
        { name: "Safety", value: "AED 60M/year accident cost savings" },
        { name: "Net Zero", value: "25% emission reduction in zones" },
      ],
      SRTA: [
        { name: "Commuter Savings", value: "AED 800/year per commuter" },
        { name: "Housing Access", value: "+6% affordable housing reach" },
        { name: "Border Flow", value: "30% faster crossing times" },
      ],
    };
    return benefits[authorityCode] || benefits["RTA"];
  }

  downloadPDF(): void {
    const doc = new jsPDF();
    const authorityName = this.authority.name || "Transport Authority";
    const authorityCode = this.authority.code || "SZS";

    // Header
    doc.setFontSize(20);
    doc.setTextColor(0, 51, 102);
    doc.text("Smart Mobility Access Implementation Analysis", 20, 20);

    doc.setFontSize(12);
    doc.setTextColor(60);
    doc.text(authorityName, 20, 30);
    doc.text("Reference: " + this.getReferenceNumber(), 20, 38);
    doc.text("Date: " + this.today.toLocaleDateString(), 20, 45);

    // Executive Summary
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text("1. Executive Summary", 20, 60);
    doc.setFontSize(10);
    doc.setTextColor(60);
    const summary = this.getAuthoritySummaryText(this.authority.code);
    const summaryLines = doc.splitTextToSize(summary, 170);
    doc.text(summaryLines, 20, 68);

    let yPos = 85;

    // Key Metrics
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text("Key Metrics", 20, yPos);
    doc.setFontSize(10);
    doc.setTextColor(60);
    yPos += 10;

    const metrics = [
      "• Congestion Reduction: 25% (peak hour traffic)",
      "• Annual Revenue: AED 180 Million (net after exemptions)",
      "• Transit Shift: 15% (mode switch to public transport)",
      "• 5-Year NPV: AED 2.8 Billion",
    ];
    metrics.forEach((m) => {
      doc.text(m, 25, yPos);
      yPos += 7;
    });

    yPos += 5;

    // Problem Statement
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text("2. Problem Statement", 20, yPos);
    doc.setFontSize(10);
    doc.setTextColor(60);
    yPos += 10;

    const problems = [
      "• Congestion Cost: " + this.getCongestionCost(this.authority.code),
      "• Commute Times: " + this.getCommuteTime(this.authority.code),
      "• Environmental Impact: " +
        this.getEnvironmentalImpact(this.authority.code),
      "• Economic Loss: " + this.getEconomicLoss(this.authority.code),
    ];
    problems.forEach((p) => {
      doc.text(p, 25, yPos);
      yPos += 7;
    });

    yPos += 5;

    // FAIR Model
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text("3. Proposed Solution: FAIR Smart Mobility Model", 20, yPos);
    doc.setFontSize(10);
    doc.setTextColor(60);
    yPos += 10;

    const fairModel = [
      "• Residents: FREE access with tenancy verification",
      "• Workers: FREE access with employment verification",
      "• Visitors: 20-minute grace period before charges",
      "• Transit: Always FREE to encourage modal shift",
      "• Off-Peak: FREE 8PM - 7AM to spread demand",
    ];
    fairModel.forEach((f) => {
      doc.text(f, 25, yPos);
      yPos += 7;
    });

    yPos += 5;

    // Implementation Phases
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text("4. Implementation Roadmap", 20, yPos);
    doc.setFontSize(10);
    doc.setTextColor(60);
    yPos += 10;

    const phases = this.getImplementationPhases(this.authority.code);
    phases.forEach((phase, i) => {
      doc.setFontSize(11);
      doc.setTextColor(0, 51, 102);
      doc.text(`Phase ${i + 1}: ${phase.name}`, 25, yPos);
      yPos += 6;
      doc.setFontSize(9);
      doc.setTextColor(60);
      doc.text(
        `Duration: ${phase.duration} | Budget: AED ${(phase.budget / 1000000).toFixed(1)}M`,
        30,
        yPos,
      );
      yPos += 6;
      doc.text(`Expected Outcomes: ${phase.outcomes}`, 30, yPos);
      yPos += 10;
    });

    // Financial Projections
    if (yPos < 230) {
      doc.setFontSize(14);
      doc.setTextColor(0);
      doc.text("5. Financial Projections", 20, yPos);
      doc.setFontSize(10);
      doc.setTextColor(60);
      yPos += 10;

      doc.text(
        `5-Year Revenue: AED ${(this.calculate5YearRevenue() / 1000000000).toFixed(1)}B`,
        25,
        yPos,
      );
      yPos += 7;
      doc.text(
        `Implementation Cost: AED ${(this.getImplementationCost(this.authority.code) / 1000000).toFixed(0)}M`,
        25,
        yPos,
      );
      yPos += 7;
      doc.text(
        `Annual Operating: AED ${(this.getAnnualOperatingCost(this.authority.code) / 1000000).toFixed(1)}M`,
        25,
        yPos,
      );
      yPos += 7;
      doc.setFontSize(11);
      doc.setTextColor(0, 100, 0);
      doc.text(
        `5-Year NPV: AED ${(this.calculateNPV() / 1000000000).toFixed(1)}B`,
        25,
        yPos,
      );
      yPos += 10;
    }

    // Risk Assessment
    if (yPos < 250) {
      doc.setFontSize(14);
      doc.setTextColor(0);
      doc.text("6. Risk Assessment", 20, yPos);
      doc.setFontSize(10);
      doc.setTextColor(60);
      yPos += 10;

      const risks = [
        "• Public Resistance (Medium Likelihood, High Impact) - Mitigation: Extensive public consultation, resident exemptions",
        "• Technical Implementation (Low Likelihood, Medium Impact) - Mitigation: Phased rollout, pilot testing",
        "• Legal Challenges (Low Likelihood, High Impact) - Mitigation: Pre-clearance with legal counsel",
        "• Data Privacy (Medium Likelihood, Medium Impact) - Mitigation: UAE Data Protection compliance",
      ];
      risks.forEach((r) => {
        const lines = doc.splitTextToSize(r, 160);
        doc.text(lines, 25, yPos);
        yPos += 10;
      });
    }

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(
      "Prepared by Smart Mobility Simulator | " + authorityName + " - Confidential",
      20,
      280,
    );
    doc.text(
      "Disclaimer: Projections are estimates based on international benchmarks. Actual results may vary.",
      20,
      286,
    );

    doc.save(`${authorityCode}-Smart-Zone-Report.pdf`);
  }

  goBack(): void {
    window.history.back();
  }
}



