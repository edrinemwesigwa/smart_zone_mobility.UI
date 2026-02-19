import { Component, OnInit } from "@angular/core";
import { PilotProposalService } from "../../services/pilot-proposal.service";
import { SimulationService } from "../../services/simulation.service";
import { SimulationResult } from "../../models/simulation.model";
import {
  PilotOptions,
  PilotProposalDto,
} from "../../models/pilot-proposal.model";
import { jsPDF } from "jspdf";

interface PilotPhase {
  name: string;
  duration: string;
  activities: string[];
  deliverables: string[];
}

@Component({
  selector: "app-pilot-proposal",
  template: `
    <div class="pilot-container">
      <!-- Header -->
      <div class="page-header">
        <div class="header-content">
          <div class="header-icon">📋</div>
          <div>
            <h1>Smart Mobility Pilot Implementation Proposal</h1>
            <p class="subtitle">
              UAE Government Digital Transformation Initiative • Vision 2030
              Aligned
            </p>
          </div>
        </div>
        <div class="header-badges">
          <span class="badge">🏛️ RTA Dubai</span>
          <span class="badge">📱 UAE Pass</span>
          <span class="badge">🔒 Secure</span>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="content-grid">
        <!-- Configuration Panel -->
        <div class="config-panel">
          <div class="panel-card">
            <div class="panel-header">
              <h3>⚙️ Pilot Configuration</h3>
              <p class="panel-subtitle">
                Configure your Smart Mobility pilot parameters
              </p>
            </div>

            <div class="form-group">
              <label>Select Simulation Baseline</label>
              <select [(ngModel)]="selectedSimulationId" class="form-select">
                <option value="">Choose simulation...</option>
                <option *ngFor="let sim of simulations" [value]="sim.id">
                  {{ sim.name }}
                </option>
              </select>
              <small class="form-hint"
                >Choose the zone configuration for pilot evaluation</small
              >
            </div>

            <div class="scope-section">
              <h4>📐 Implementation Scope</h4>

              <button
                class="scope-btn"
                [class.active]="selectedTemplate === 'pilot'"
                (click)="selectTemplate('pilot')"
              >
                <div class="scope-icon">🧪</div>
                <div class="scope-details">
                  <span class="scope-name">Pilot Phase</span>
                  <span class="scope-desc">Single zone, 6 months</span>
                </div>
                <div class="scope-cost">
                  <span class="cost-value">AED 1.2M</span>
                  <span class="cost-label">Est. Investment</span>
                </div>
              </button>

              <button
                class="scope-btn"
                [class.active]="selectedTemplate === 'expanded'"
                (click)="selectTemplate('expanded')"
              >
                <div class="scope-icon">🌆</div>
                <div class="scope-details">
                  <span class="scope-name">Expanded Pilot</span>
                  <span class="scope-desc">3 zones, 9 months</span>
                </div>
                <div class="scope-cost">
                  <span class="cost-value">AED 3.5M</span>
                  <span class="cost-label">Est. Investment</span>
                </div>
              </button>

              <button
                class="scope-btn"
                [class.active]="selectedTemplate === 'full'"
                (click)="selectTemplate('full')"
              >
                <div class="scope-icon">🏙️</div>
                <div class="scope-details">
                  <span class="scope-name">Full Deployment</span>
                  <span class="scope-desc">City-wide, 12 months</span>
                </div>
                <div class="scope-cost">
                  <span class="cost-value">AED 12M</span>
                  <span class="cost-label">Est. Investment</span>
                </div>
              </button>
            </div>

            <div class="options-section">
              <h4>🔧 Additional Requirements</h4>

              <label class="option-checkbox">
                <input
                  type="checkbox"
                  [(ngModel)]="options.includeUaePassIntegration"
                />
                <span class="checkbox-custom"></span>
                <div class="option-content">
                  <strong>UAE Pass Integration</strong>
                  <small
                    >Digital identity, eKYC, and payment verification</small
                  >
                </div>
                <div class="option-cost">+AED 180,000</div>
              </label>

              <label class="option-checkbox">
                <input type="checkbox" [(ngModel)]="options.includeMobileApp" />
                <span class="checkbox-custom"></span>
                <div class="option-content">
                  <strong>Smart Mobility Mobile App</strong>
                  <small>iOS, Android, Arabic/English support</small>
                </div>
                <div class="option-cost">+AED 250,000</div>
              </label>

              <label class="option-checkbox">
                <input
                  type="checkbox"
                  [(ngModel)]="options.includeHardwareIntegration"
                />
                <span class="checkbox-custom"></span>
                <div class="option-content">
                  <strong>Salik/ANPR Infrastructure</strong>
                  <small>Cameras, gantries, back-office integration</small>
                </div>
                <div class="option-cost">+AED 450,000</div>
              </label>

              <label class="option-checkbox">
                <input
                  type="checkbox"
                  [(ngModel)]="options.include24x7Support"
                />
                <span class="checkbox-custom"></span>
                <div class="option-content">
                  <strong>24/7 Operations Center</strong>
                  <small>Command center, incident response, SLA</small>
                </div>
                <div class="option-cost">+AED 350,000</div>
              </label>
            </div>

            <div class="form-group">
              <label>Pilot Duration: {{ options.durationMonths }} months</label>
              <input
                type="range"
                min="3"
                max="18"
                step="3"
                [(ngModel)]="options.durationMonths"
                class="form-range"
              />
              <div class="range-labels">
                <span>3 mo</span>
                <span>6 mo</span>
                <span>9 mo</span>
                <span>12 mo</span>
                <span>18 mo</span>
              </div>
            </div>

            <button
              class="btn-generate"
              (click)="generateProposal()"
              [disabled]="isGenerating || !selectedSimulationId"
            >
              {{
                isGenerating
                  ? "⏳ Generating Proposal..."
                  : "📄 Generate Official Proposal"
              }}
            </button>
          </div>
        </div>

        <!-- Results Panel -->
        <div class="results-panel">
          <!-- KPI Cards -->
          <div class="kpi-grid">
            <div class="kpi-card primary">
              <div class="kpi-icon">💵</div>
              <div class="kpi-content">
                <span class="kpi-value"
                  >AED {{ getTotalCost() | number: "1.0-0" }}</span
                >
                <span class="kpi-label">Total Investment</span>
              </div>
              <div class="kpi-trend">One-time</div>
            </div>
            <div class="kpi-card success">
              <div class="kpi-icon">📈</div>
              <div class="kpi-content">
                <span class="kpi-value"
                  >AED {{ getEstimatedAnnualRevenue() | number: "1.0-0" }}</span
                >
                <span class="kpi-label">Year 1 Revenue</span>
              </div>
              <div class="kpi-trend positive">+18% YoY</div>
            </div>
            <div class="kpi-card warning">
              <div class="kpi-icon">⏰</div>
              <div class="kpi-content">
                <span class="kpi-value">{{ options.durationMonths }}</span>
                <span class="kpi-label">Months Duration</span>
              </div>
              <div class="kpi-trend">Phased</div>
            </div>
            <div class="kpi-card info">
              <div class="kpi-icon">🎯</div>
              <div class="kpi-content">
                <span class="kpi-value">{{ getROI() | number: "1.0-0" }}%</span>
                <span class="kpi-label">Expected ROI</span>
              </div>
              <div class="kpi-trend">{{ getPaybackMonths() }} mo payback</div>
            </div>
          </div>

          <!-- Charts Section -->
          <div class="charts-grid">
            <!-- Cost Breakdown Chart -->
            <div class="chart-card">
              <h4>💰 Investment Allocation</h4>
              <div class="horizontal-bar-chart">
                <div class="hbar-item">
                  <div class="hbar-label">
                    <span>Platform & Software</span>
                    <span class="hbar-value"
                      >30% • AED
                      {{ getTotalCost() * 0.3 | number: "1.0-0" }}</span
                    >
                  </div>
                  <div class="hbar-track">
                    <div
                      class="hbar-fill"
                      style="width: 30%; background: #3b82f6;"
                    ></div>
                  </div>
                </div>
                <div class="hbar-item">
                  <div class="hbar-label">
                    <span>Hardware & Infrastructure</span>
                    <span class="hbar-value"
                      >25% • AED
                      {{ getTotalCost() * 0.25 | number: "1.0-0" }}</span
                    >
                  </div>
                  <div class="hbar-track">
                    <div
                      class="hbar-fill"
                      style="width: 25%; background: #8b5cf6;"
                    ></div>
                  </div>
                </div>
                <div class="hbar-item">
                  <div class="hbar-label">
                    <span>Integration & Testing</span>
                    <span class="hbar-value"
                      >20% • AED
                      {{ getTotalCost() * 0.2 | number: "1.0-0" }}</span
                    >
                  </div>
                  <div class="hbar-track">
                    <div
                      class="hbar-fill"
                      style="width: 20%; background: #06b6d4;"
                    ></div>
                  </div>
                </div>
                <div class="hbar-item">
                  <div class="hbar-label">
                    <span>Operations (Year 1)</span>
                    <span class="hbar-value"
                      >15% • AED
                      {{ getTotalCost() * 0.15 | number: "1.0-0" }}</span
                    >
                  </div>
                  <div class="hbar-track">
                    <div
                      class="hbar-fill"
                      style="width: 15%; background: #10b981;"
                    ></div>
                  </div>
                </div>
                <div class="hbar-item">
                  <div class="hbar-label">
                    <span>Contingency Reserve</span>
                    <span class="hbar-value"
                      >10% • AED
                      {{ getTotalCost() * 0.1 | number: "1.0-0" }}</span
                    >
                  </div>
                  <div class="hbar-track">
                    <div
                      class="hbar-fill"
                      style="width: 10%; background: #f59e0b;"
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Revenue & ROI Chart -->
            <div class="chart-card">
              <h4>📊 Revenue Projection (5 Year)</h4>
              <div class="revenue-chart">
                <div class="revenue-bars">
                  <div
                    class="revenue-bar-group"
                    *ngFor="let year of getRevenueProjection()"
                  >
                    <div class="revenue-bar" [style.height.%]="year.percentage">
                      <span class="revenue-value"
                        >AED {{ year.value | number: "1.0-0" }}</span
                      >
                    </div>
                    <span class="revenue-label">Y{{ year.year }}</span>
                  </div>
                </div>
                <div class="revenue-summary">
                  <div class="summary-item">
                    <span class="summary-label">5-Year Total</span>
                    <span class="summary-value"
                      >AED {{ get5YearRevenue() | number: "1.0-0" }}</span
                    >
                  </div>
                  <div class="summary-item">
                    <span class="summary-label">Net Profit</span>
                    <span class="summary-value profit"
                      >AED
                      {{
                        get5YearRevenue() - getTotalCost() * 5 | number: "1.0-0"
                      }}</span
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Implementation Timeline -->
          <div class="timeline-section">
            <h4>🗓️ Implementation Roadmap</h4>
            <div class="timeline-track">
              <div
                class="timeline-phase"
                *ngFor="let phase of getImplementationPhases(); let i = index"
              >
                <div class="phase-marker" [class.completed]="i < currentPhase">
                  {{ i + 1 }}
                </div>
                <div class="phase-content">
                  <h5>{{ phase.name }}</h5>
                  <span class="phase-duration">{{ phase.duration }}</span>
                  <ul>
                    <li *ngFor="let activity of phase.activities">
                      {{ activity }}
                    </li>
                  </ul>
                  <div class="deliverables">
                    <strong>Deliverables:</strong>
                    <span *ngFor="let del of phase.deliverables">{{
                      del
                    }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Risk & Mitigation -->
          <div class="risk-section">
            <h4>⚠️ Risk Assessment & Mitigation</h4>
            <div class="risk-grid">
              <div class="risk-card" *ngFor="let risk of getRisks()">
                <div class="risk-header">
                  <span class="risk-name">{{ risk.name }}</span>
                  <span class="risk-level" [class]="risk.level.toLowerCase()">{{
                    risk.level
                  }}</span>
                </div>
                <p class="risk-description">{{ risk.description }}</p>
                <div class="risk-mitigation">
                  <strong>Mitigation Strategy:</strong> {{ risk.mitigation }}
                </div>
              </div>
            </div>
          </div>

          <!-- Government Compliance -->
          <div class="compliance-section">
            <h4>✅ Government Compliance & Standards</h4>
            <div class="compliance-grid">
              <div class="compliance-item">
                <span class="compliance-icon">🔐</span>
                <div>
                  <strong>UAE Data Law Compliant</strong>
                  <small>Full compliance with UAE Federal Data Law</small>
                </div>
              </div>
              <div class="compliance-item">
                <span class="compliance-icon">🌐</span>
                <div>
                  <strong>UAE Pass Ready</strong>
                  <small>Integration with UAE PASS digital identity</small>
                </div>
              </div>
              <div class="compliance-item">
                <span class="compliance-icon">💳</span>
                <div>
                  <strong>UAE Central Bank Approved</strong>
                  <small>Secure payment processing standards</small>
                </div>
              </div>
              <div class="compliance-item">
                <span class="compliance-icon">♿</span>
                <div>
                  <strong>Accessibility (WCAG 2.1)</strong>
                  <small>UAE Disability Act compliance</small>
                </div>
              </div>
            </div>
          </div>

          <!-- Export Actions -->
          <div class="export-section" *ngIf="proposal">
            <button class="btn-export primary" (click)="exportPdf()">
              📥 Download Official PDF
            </button>
            <button class="btn-export secondary" (click)="exportPowerPoint()">
              📊 Export Presentation
            </button>
            <button
              class="btn-export tertiary"
              (click)="copyExecutiveSummary()"
            >
              📋 Copy Summary
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .pilot-container {
        padding: 20px;
        max-width: 1400px;
        margin: 0 auto;
      }

      /* Header */
      .page-header {
        background: linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%);
        border-radius: 16px;
        padding: 24px 32px;
        margin-bottom: 24px;
        border: 1px solid rgba(255, 255, 255, 0.1);
      }

      .header-content {
        display: flex;
        align-items: center;
        gap: 16px;
      }

      .header-icon {
        font-size: 2rem;
        background: rgba(255, 255, 255, 0.15);
        width: 56px;
        height: 56px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 12px;
      }

      .page-header h1 {
        margin: 0;
        color: white;
        font-size: 1.5rem;
        font-weight: 600;
      }

      .subtitle {
        margin: 4px 0 0;
        color: rgba(255, 255, 255, 0.8);
        font-size: 0.9rem;
      }

      .header-badges {
        display: flex;
        gap: 12px;
        margin-top: 16px;
        flex-wrap: wrap;
      }

      .badge {
        background: rgba(255, 255, 255, 0.1);
        padding: 6px 12px;
        border-radius: 20px;
        font-size: 0.75rem;
        color: white;
        border: 1px solid rgba(255, 255, 255, 0.2);
      }

      /* Grid */
      .content-grid {
        display: grid;
        grid-template-columns: 400px 1fr;
        gap: 24px;
      }

      @media (max-width: 1024px) {
        .content-grid {
          grid-template-columns: 1fr;
        }
      }

      /* Config Panel */
      .config-panel {
        position: sticky;
        top: 90px;
        height: fit-content;
      }

      .panel-card {
        background: white;
        border-radius: 16px;
        padding: 24px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        border: 1px solid #e2e8f0;
      }

      .panel-header {
        margin-bottom: 24px;
        padding-bottom: 16px;
        border-bottom: 1px solid #e2e8f0;
      }

      .panel-card h3 {
        margin: 0;
        color: #1e3a5f;
        font-size: 1.1rem;
      }

      .panel-subtitle {
        margin: 4px 0 0;
        color: #64748b;
        font-size: 0.85rem;
      }

      .form-group {
        margin-bottom: 24px;
      }

      .form-group label {
        display: block;
        font-weight: 600;
        color: #334155;
        margin-bottom: 8px;
        font-size: 0.9rem;
      }

      .form-select {
        width: 100%;
        padding: 12px 16px;
        border: 2px solid #e2e8f0;
        border-radius: 10px;
        font-size: 14px;
        background: white;
      }

      .form-select:focus {
        border-color: #3b82f6;
        outline: none;
      }

      .form-hint {
        display: block;
        margin-top: 6px;
        font-size: 0.75rem;
        color: #94a3b8;
      }

      /* Scope Section */
      .scope-section {
        margin-bottom: 24px;
      }

      .scope-section h4 {
        margin: 0 0 16px;
        color: #1e3a5f;
        font-size: 0.95rem;
      }

      .scope-btn {
        width: 100%;
        display: flex;
        align-items: center;
        gap: 14px;
        padding: 16px;
        border: 2px solid #e2e8f0;
        border-radius: 12px;
        background: white;
        cursor: pointer;
        transition: all 0.2s;
        margin-bottom: 10px;
      }

      .scope-btn:hover {
        border-color: #3b82f6;
        background: #f8fafc;
      }

      .scope-btn.active {
        border-color: #3b82f6;
        background: #eff6ff;
      }

      .scope-icon {
        font-size: 1.5rem;
      }

      .scope-details {
        flex: 1;
        text-align: left;
      }

      .scope-name {
        display: block;
        font-weight: 600;
        color: #1e293b;
      }

      .scope-desc {
        font-size: 0.8rem;
        color: #64748b;
      }

      .scope-cost {
        text-align: right;
      }

      .cost-value {
        display: block;
        font-weight: 700;
        color: #059669;
        font-size: 1.1rem;
      }

      .cost-label {
        font-size: 0.7rem;
        color: #94a3b8;
      }

      /* Options */
      .options-section h4 {
        margin: 0 0 16px;
        color: #1e3a5f;
        font-size: 0.95rem;
      }

      .option-checkbox {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        padding: 14px;
        border-radius: 10px;
        margin-bottom: 10px;
        cursor: pointer;
        transition: background 0.2s;
        border: 1px solid #f1f5f9;
      }

      .option-checkbox:hover {
        background: #f8fafc;
      }

      .option-checkbox input {
        display: none;
      }

      .checkbox-custom {
        width: 22px;
        height: 22px;
        min-width: 22px;
        border: 2px solid #cbd5e1;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 2px;
      }

      .option-checkbox input:checked + .checkbox-custom::after {
        content: "✓";
        color: white;
        font-size: 14px;
        font-weight: bold;
      }

      .option-checkbox input:checked + .checkbox-custom {
        background: #3b82f6;
        border-color: #3b82f6;
      }

      .option-content {
        flex: 1;
      }

      .option-content strong {
        display: block;
        color: #1e293b;
        font-size: 0.9rem;
      }

      .option-content small {
        color: #64748b;
        font-size: 0.75rem;
        display: block;
        margin-top: 2px;
      }

      .option-cost {
        color: #059669;
        font-weight: 600;
        font-size: 0.85rem;
        white-space: nowrap;
      }

      /* Range */
      .form-range {
        width: 100%;
        height: 8px;
        border-radius: 4px;
        background: #e2e8f0;
        -webkit-appearance: none;
      }

      .form-range::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: #3b82f6;
        cursor: pointer;
      }

      .range-labels {
        display: flex;
        justify-content: space-between;
        margin-top: 8px;
        font-size: 0.75rem;
        color: #64748b;
      }

      .btn-generate {
        width: 100%;
        padding: 16px;
        background: linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%);
        color: white;
        border: none;
        border-radius: 12px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
      }

      .btn-generate:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(30, 58, 95, 0.4);
      }

      .btn-generate:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      /* Results */
      .results-panel {
        display: flex;
        flex-direction: column;
        gap: 20px;
      }

      /* KPI Grid */
      .kpi-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 16px;
      }

      @media (max-width: 900px) {
        .kpi-grid {
          grid-template-columns: repeat(2, 1fr);
        }
      }

      .kpi-card {
        background: white;
        border-radius: 14px;
        padding: 20px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        border: 1px solid #e2e8f0;
      }

      .kpi-icon {
        font-size: 1.5rem;
        margin-bottom: 8px;
      }

      .kpi-value {
        display: block;
        font-size: 1.3rem;
        font-weight: 700;
        color: #1e3a5f;
      }

      .kpi-label {
        font-size: 0.8rem;
        color: #64748b;
      }

      .kpi-trend {
        font-size: 0.7rem;
        margin-top: 8px;
        padding: 4px 8px;
        border-radius: 6px;
        background: #f1f5f9;
        color: #64748b;
        display: inline-block;
      }

      .kpi-trend.positive {
        background: #d1fae5;
        color: #059669;
      }

      .kpi-card.primary {
        border-top: 3px solid #3b82f6;
      }
      .kpi-card.success {
        border-top: 3px solid #10b981;
      }
      .kpi-card.warning {
        border-top: 3px solid #f59e0b;
      }
      .kpi-card.info {
        border-top: 3px solid #8b5cf6;
      }

      /* Charts */
      .charts-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
      }

      @media (max-width: 900px) {
        .charts-grid {
          grid-template-columns: 1fr;
        }
      }

      .chart-card {
        background: white;
        border-radius: 14px;
        padding: 24px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        border: 1px solid #e2e8f0;
      }

      .chart-card h4 {
        margin: 0 0 20px;
        color: #1e3a5f;
        font-size: 1rem;
      }

      /* Horizontal Bar Chart */
      .horizontal-bar-chart {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .hbar-item {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .hbar-label {
        display: flex;
        justify-content: space-between;
        font-size: 0.85rem;
      }

      .hbar-value {
        font-weight: 600;
        color: #1e3a5f;
      }

      .hbar-track {
        height: 24px;
        background: #f1f5f9;
        border-radius: 6px;
        overflow: hidden;
      }

      .hbar-fill {
        height: 100%;
        border-radius: 6px;
        transition: width 0.3s;
      }

      /* Revenue Chart */
      .revenue-chart {
        display: flex;
        flex-direction: column;
        gap: 20px;
      }

      .revenue-bars {
        display: flex;
        align-items: flex-end;
        justify-content: space-around;
        height: 160px;
        padding: 0 10px;
      }

      .revenue-bar-group {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        flex: 1;
      }

      .revenue-bar {
        width: 100%;
        max-width: 50px;
        background: linear-gradient(180deg, #10b981, #059669);
        border-radius: 6px 6px 0 0;
        min-height: 20px;
        display: flex;
        align-items: flex-start;
        justify-content: center;
        padding-top: 8px;
      }

      .revenue-value {
        font-size: 0.65rem;
        font-weight: 600;
        color: white;
      }

      .revenue-label {
        font-size: 0.75rem;
        font-weight: 600;
        color: #64748b;
      }

      .revenue-summary {
        display: flex;
        gap: 20px;
        padding-top: 16px;
        border-top: 1px solid #e2e8f0;
      }

      .summary-item {
        flex: 1;
        text-align: center;
      }

      .summary-label {
        display: block;
        font-size: 0.75rem;
        color: #64748b;
      }

      .summary-value {
        display: block;
        font-size: 1.1rem;
        font-weight: 700;
        color: #1e3a5f;
      }

      .summary-value.profit {
        color: #059669;
      }

      /* Timeline */
      .timeline-section,
      .risk-section,
      .compliance-section {
        background: white;
        border-radius: 14px;
        padding: 24px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        border: 1px solid #e2e8f0;
      }

      .timeline-section h4,
      .risk-section h4,
      .compliance-section h4 {
        margin: 0 0 20px;
        color: #1e3a5f;
      }

      .timeline-track {
        display: flex;
        gap: 16px;
        overflow-x: auto;
        padding-bottom: 10px;
      }

      .timeline-phase {
        flex: 1;
        min-width: 220px;
        position: relative;
      }

      .phase-marker {
        width: 36px;
        height: 36px;
        background: #e2e8f0;
        color: #64748b;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        margin-bottom: 12px;
      }

      .phase-marker.completed {
        background: #10b981;
        color: white;
      }

      .phase-content {
        background: #f8fafc;
        border-radius: 10px;
        padding: 16px;
      }

      .phase-content h5 {
        margin: 0 0 4px;
        color: #1e3a5f;
        font-size: 0.95rem;
      }

      .phase-duration {
        font-size: 0.75rem;
        color: #3b82f6;
        font-weight: 600;
      }

      .phase-content ul {
        margin: 10px 0 0;
        padding-left: 18px;
        font-size: 0.8rem;
        color: #475569;
      }

      .deliverables {
        margin-top: 10px;
        padding-top: 10px;
        border-top: 1px solid #e2e8f0;
        font-size: 0.75rem;
      }

      .deliverables strong {
        color: #64748b;
      }

      .deliverables span {
        display: inline-block;
        background: #dbeafe;
        color: #1e40af;
        padding: 2px 8px;
        border-radius: 4px;
        margin-left: 4px;
        margin-top: 4px;
      }

      /* Risk */
      .risk-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
      }

      @media (max-width: 768px) {
        .risk-grid {
          grid-template-columns: 1fr;
        }
      }

      .risk-card {
        background: #f8fafc;
        border-radius: 10px;
        padding: 16px;
      }

      .risk-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
      }

      .risk-name {
        font-weight: 600;
        color: #1e293b;
      }

      .risk-level {
        font-size: 0.7rem;
        padding: 3px 10px;
        border-radius: 6px;
        font-weight: 600;
      }

      .risk-level.low {
        background: #d1fae5;
        color: #059669;
      }
      .risk-level.medium {
        background: #fef3c7;
        color: #b45309;
      }
      .risk-level.high {
        background: #fee2e2;
        color: #dc2626;
      }

      .risk-description {
        margin: 0 0 8px;
        font-size: 0.85rem;
        color: #475569;
      }

      .risk-mitigation {
        font-size: 0.8rem;
        color: #64748b;
        line-height: 1.5;
      }

      /* Compliance */
      .compliance-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
      }

      @media (max-width: 768px) {
        .compliance-grid {
          grid-template-columns: 1fr;
        }
      }

      .compliance-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 14px;
        background: #f0fdf4;
        border-radius: 10px;
        border: 1px solid #bbf7d0;
      }

      .compliance-icon {
        font-size: 1.3rem;
      }

      .compliance-item strong {
        display: block;
        color: #166534;
        font-size: 0.9rem;
      }

      .compliance-item small {
        color: #15803d;
        font-size: 0.75rem;
      }

      /* Export */
      .export-section {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
      }

      .btn-export {
        padding: 14px 24px;
        border-radius: 10px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
        border: none;
      }

      .btn-export.primary {
        background: #1e3a5f;
        color: white;
      }

      .btn-export.primary:hover {
        background: #0f172a;
      }

      .btn-export.secondary {
        background: #f1f5f9;
        color: #475569;
        border: 1px solid #e2e8f0;
      }

      .btn-export.tertiary {
        background: white;
        color: #475569;
        border: 1px solid #e2e8f0;
      }
    `,
  ],
})
export class PilotProposalComponent implements OnInit {
  simulations: SimulationResult[] = [];
  selectedSimulationId = "";
  proposal: PilotProposalDto | null = null;
  error: string | null = null;
  isGenerating = false;
  selectedTemplate = "pilot";
  currentPhase = 0;

  options: PilotOptions = {
    includeUaePassIntegration: false,
    includeMobileApp: false,
    includeHardwareIntegration: false,
    include24x7Support: false,
    durationMonths: 6,
    customIntegrationCost: 0,
  };

  constructor(
    private pilotService: PilotProposalService,
    private simulationService: SimulationService,
  ) {}

  ngOnInit(): void {
    this.loadSimulations();
  }

  loadSimulations(): void {
    this.simulationService.getAllSimulations().subscribe({
      next: (data) => {
        this.simulations = data;
        if (data.length > 0) {
          this.selectedSimulationId = data[0].id;
        }
      },
      error: () => {
        this.error = "Failed to load simulations";
      },
    });
  }

  selectTemplate(template: string): void {
    this.selectedTemplate = template;
    if (template === "pilot") {
      this.options = {
        includeUaePassIntegration: false,
        includeMobileApp: false,
        includeHardwareIntegration: false,
        include24x7Support: false,
        durationMonths: 6,
        customIntegrationCost: 0,
      };
    } else if (template === "expanded") {
      this.options = {
        includeUaePassIntegration: true,
        includeMobileApp: true,
        includeHardwareIntegration: false,
        include24x7Support: true,
        durationMonths: 9,
        customIntegrationCost: 0,
      };
    } else {
      this.options = {
        includeUaePassIntegration: true,
        includeMobileApp: true,
        includeHardwareIntegration: true,
        include24x7Support: true,
        durationMonths: 12,
        customIntegrationCost: 0,
      };
    }
  }

  applyTemplate(template: "quick" | "full" | "enterprise"): void {
    if (template === "quick") this.selectTemplate("pilot");
    else if (template === "full") this.selectTemplate("expanded");
    else this.selectTemplate("full");
  }

  generateProposal(): void {
    if (!this.selectedSimulationId) {
      this.error = "Select a simulation first";
      return;
    }

    this.isGenerating = true;
    this.error = null;

    this.pilotService
      .generateProposal(this.selectedSimulationId, this.options)
      .subscribe({
        next: (proposal) => {
          this.proposal = proposal;
          this.isGenerating = false;
        },
        error: () => {
          this.error = "Failed to generate proposal";
          this.isGenerating = false;
        },
      });
  }

  getSelectedSimulation(): SimulationResult | null {
    return (
      this.simulations.find((s) => s.id === this.selectedSimulationId) || null
    );
  }

  getTotalCost(): number {
    // Base costs based on template (more realistic UAE government project costs)
    let total = 1200000; // Pilot phase baseline
    if (this.selectedTemplate === "expanded") total = 3500000;
    if (this.selectedTemplate === "full") total = 12000000;

    // Add-ons
    if (this.options.includeUaePassIntegration) total += 180000;
    if (this.options.includeMobileApp) total += 250000;
    if (this.options.includeHardwareIntegration) total += 450000;
    if (this.options.include24x7Support) total += 350000;
    if (this.options.customIntegrationCost > 0)
      total += this.options.customIntegrationCost;
    return total;
  }

  getEstimatedAnnualRevenue(): number {
    const sim = this.getSelectedSimulation();
    if (!sim) return 0;
    return sim.estimatedRevenue * 365;
  }

  getEstimatedMonthlyRevenue(): number {
    const sim = this.getSelectedSimulation();
    if (!sim) return 0;
    return (sim.estimatedRevenue * 365) / 12;
  }

  getROI(): number {
    const cost = this.getTotalCost();
    const revenue = this.getEstimatedAnnualRevenue();
    if (cost === 0) return 0;
    return ((revenue - cost) / cost) * 100;
  }

  getPaybackMonths(): number {
    const cost = this.getTotalCost();
    const monthlyRevenue = this.getEstimatedMonthlyRevenue();
    if (monthlyRevenue === 0) return 0;
    return Math.ceil(cost / monthlyRevenue);
  }

  getRevenueProjection(): {
    year: number;
    value: number;
    percentage: number;
  }[] {
    const baseAnnual = this.getEstimatedAnnualRevenue();
    // Conservative growth: Year 1 (partial), Years 2-5 with growth
    const projections = [
      { year: 1, value: baseAnnual * 0.7, percentage: 70 },
      { year: 2, value: baseAnnual * 1.1, percentage: 80 },
      { year: 3, value: baseAnnual * 1.2, percentage: 90 },
      { year: 4, value: baseAnnual * 1.3, percentage: 95 },
      { year: 5, value: baseAnnual * 1.4, percentage: 100 },
    ];
    return projections;
  }

  get5YearRevenue(): number {
    return this.getRevenueProjection().reduce((sum, y) => sum + y.value, 0);
  }

  getImplementationPhases(): any[] {
    const phases = [
      {
        name: "Phase 1: Initiation",
        duration: "Months 1-2",
        activities: [
          "Stakeholder alignment",
          "Requirements finalization",
          "Project governance setup",
        ],
        deliverables: ["Project Charter", "Requirements Document"],
      },
      {
        name: "Phase 2: Development",
        duration: "Months 3-5",
        activities: [
          "Platform development",
          "Mobile app build",
          "API development",
        ],
        deliverables: ["Core Platform", "Mobile Apps", "API Suite"],
      },
      {
        name: "Phase 3: Integration",
        duration: "Months 4-6",
        activities: [
          "ANPR/Salik integration",
          "UAE Pass integration",
          "Payment gateway setup",
        ],
        deliverables: ["Integration Tests", "Security Audit"],
      },
      {
        name: "Phase 4: Pilot Launch",
        duration: "Months 6-9",
        activities: ["Go-live", "User onboarding", "Performance monitoring"],
        deliverables: ["Live Pilot", "KPI Report", "Optimization Plan"],
      },
    ];
    return phases;
  }

  getRisks(): any[] {
    return [
      {
        name: "Stakeholder Alignment",
        level: "Medium",
        description:
          "Coordination between multiple government entities (RTA, TCA, Police)",
        mitigation: "Weekly steering committee meetings, clear RACI matrix",
      },
      {
        name: "Technical Integration",
        level: "Medium",
        description: "Legacy system compatibility with Salik/ANPR",
        mitigation: "Phased integration approach with fallback mechanisms",
      },
      {
        name: "Public Adoption",
        level: "High",
        description: "User registration and behavioral change adoption",
        mitigation: "Marketing campaign, grace period, multi-language support",
      },
      {
        name: "Regulatory Approval",
        level: "Medium",
        description: "Final approval from transportation authorities",
        mitigation:
          "Early engagement with regulatory bodies, compliance-first approach",
      },
    ];
  }

  exportPdf(): void {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(20);
    doc.setTextColor(30, 58, 95);
    doc.text("Smart Mobility Pilot Implementation Proposal", 20, 20);

    doc.setFontSize(12);
    doc.setTextColor(60);
    doc.text(
      "UAE Government Digital Transformation Initiative | Vision 2030 Aligned",
      20,
      30,
    );
    doc.text("Generated: " + new Date().toLocaleDateString(), 20, 38);

    // Key Metrics
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text("Executive Summary", 20, 52);
    doc.setFontSize(10);
    doc.setTextColor(60);

    const totalCost = this.getTotalCost();
    const annualRevenue = this.getEstimatedAnnualRevenue();
    const roi = this.getROI();
    const templateNames: Record<string, string> = {
      pilot: "Pilot Phase (Single zone, 6 months)",
      expanded: "Expanded Pilot (3 zones, 9 months)",
      full: "Full Deployment (City-wide, 12 months)",
    };

    const summary = [
      `Implementation Scope: ${templateNames[this.selectedTemplate] || "Pilot Phase"}`,
      `Total Investment: AED ${(totalCost / 1000000).toFixed(1)}M`,
      `Estimated Year 1 Revenue: AED ${(annualRevenue / 1000000).toFixed(0)}M`,
      `Expected ROI: ${roi.toFixed(0)}%`,
      `Payback Period: ${this.getPaybackMonths()} months`,
      `Duration: ${this.options.durationMonths} months`,
    ];

    let yPos = 60;
    summary.forEach((s) => {
      doc.text(s, 25, yPos);
      yPos += 7;
    });

    yPos += 10;

    // Implementation Phases
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text("Implementation Phases", 20, yPos);
    doc.setFontSize(10);
    doc.setTextColor(60);
    yPos += 10;

    const phases = this.getImplementationPhases();
    phases.forEach((phase: any, i: number) => {
      doc.setFontSize(11);
      doc.setTextColor(0, 51, 102);
      doc.text(`${phase.name}`, 25, yPos);
      yPos += 6;
      doc.setFontSize(9);
      doc.setTextColor(60);
      doc.text(`Duration: ${phase.duration}`, 30, yPos);
      yPos += 10;

      phase.activities.forEach((activity: string) => {
        doc.text(`• ${activity}`, 30, yPos);
        yPos += 5;
      });
      yPos += 5;
    });

    // Risk Assessment
    if (yPos < 230) {
      doc.setFontSize(14);
      doc.setTextColor(0);
      doc.text("Risk Assessment", 20, yPos);
      yPos += 10;

      const risks = this.getRisks();
      risks.forEach((risk: any) => {
        doc.setFontSize(10);
        doc.setTextColor(0);
        doc.text(`${risk.name} (${risk.level} Risk)`, 25, yPos);
        yPos += 5;
        doc.setFontSize(9);
        doc.setTextColor(80);
        const desc = doc.splitTextToSize(risk.description, 150);
        doc.text(desc, 30, yPos);
        yPos += 8;
      });
    }

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text("Smart Mobility Simulator - UAE Transport Innovation", 20, 280);

    doc.save("Smart-Zone-Pilot-Proposal.pdf");
  }

  exportPowerPoint(): void {
    alert("PowerPoint export would generate a .pptx file");
  }

  copyExecutiveSummary(): void {
    if (!this.proposal?.executiveSummary) return;
    navigator.clipboard.writeText(this.proposal.executiveSummary);
    alert("Executive summary copied to clipboard!");
  }
}



