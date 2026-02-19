import { Component, OnInit } from "@angular/core";
import { SimulationService } from "../../services/simulation.service";
import { SimulationResult } from "../../models/simulation.model";
import { jsPDF } from "jspdf";

interface CashFlowPoint {
  x: number;
  y: number;
}

@Component({
  selector: "app-business-case",
  template: `
    <div class="business-container">
      <!-- Header -->
      <div class="page-header">
        <div class="header-content">
          <div class="header-icon">💼</div>
          <div>
            <h1>Smart Mobility Business Case</h1>
            <p class="subtitle">
              Comprehensive financial analysis for UAE government stakeholders
            </p>
          </div>
        </div>
        <div class="header-badges">
          <span class="badge">📊 Financial Model</span>
          <span class="badge">🎯 ROI Analysis</span>
        </div>
      </div>

      <!-- Main Grid -->
      <div class="content-grid">
        <!-- Configuration Panel -->
        <div class="config-panel">
          <div class="panel-card">
            <h3>📐 Model Parameters</h3>

            <div class="form-group">
              <label>Select Simulation Baseline</label>
              <select
                [(ngModel)]="selectedSimulationId"
                (change)="onInputsChanged()"
                class="form-select"
              >
                <option value="">Choose simulation...</option>
                <option *ngFor="let sim of simulations" [value]="sim.id">
                  {{ sim.name }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label>Pilot Investment (AED)</label>
              <div class="range-input">
                <input
                  type="range"
                  min="500000"
                  max="15000000"
                  step="100000"
                  [(ngModel)]="pilotCost"
                  (input)="onInputsChanged()"
                />
                <span class="range-value"
                  >AED {{ pilotCost / 1000000 | number: "1.1-1" }}M</span
                >
              </div>
              <div class="range-labels">
                <span>0.5M</span>
                <span>5M</span>
                <span>10M</span>
                <span>15M</span>
              </div>
            </div>

            <div class="form-group">
              <label>Annual Revenue Growth Rate</label>
              <div class="range-input">
                <input
                  type="range"
                  min="3"
                  max="20"
                  step="1"
                  [(ngModel)]="growthRate"
                  (input)="onInputsChanged()"
                />
                <span class="range-value">{{ growthRate }}%</span>
              </div>
            </div>

            <div class="form-group">
              <label>Discount Rate (WACC)</label>
              <div class="range-input">
                <input
                  type="range"
                  min="5"
                  max="15"
                  step="0.5"
                  [(ngModel)]="discountRate"
                  (input)="onInputsChanged()"
                />
                <span class="range-value">{{ discountRate }}%</span>
              </div>
            </div>

            <div class="form-group">
              <label>Projection Period</label>
              <select
                [(ngModel)]="years"
                (change)="onInputsChanged()"
                class="form-select"
              >
                <option [value]="3">3 Years</option>
                <option [value]="5">5 Years</option>
                <option [value]="7">7 Years</option>
                <option [value]="10">10 Years</option>
              </select>
            </div>

            <button class="btn-export" (click)="exportInvestmentMemo()">
              📥 Export Investment Memo (PDF)
            </button>
          </div>
        </div>

        <!-- Results Panel -->
        <div class="results-panel">
          <!-- KPI Cards -->
          <div class="kpi-grid">
            <div class="kpi-card primary">
              <div class="kpi-icon">💰</div>
              <div class="kpi-content">
                <span class="kpi-value"
                  >AED {{ npv / 1000000 | number: "1.1-1" }}M</span
                >
                <span class="kpi-label">Net Present Value</span>
              </div>
              <div class="kpi-badge positive">Value Creating</div>
            </div>
            <div class="kpi-card success">
              <div class="kpi-icon">📈</div>
              <div class="kpi-content">
                <span class="kpi-value">{{ irr | number: "1.0-0" }}%</span>
                <span class="kpi-label">Internal Rate of Return</span>
              </div>
              <div
                class="kpi-badge"
                [class.positive]="irr > discountRate"
                [class.negative]="irr < discountRate"
              >
                {{ irr > discountRate ? "Above WACC" : "Below WACC" }}
              </div>
            </div>
            <div class="kpi-card warning">
              <div class="kpi-icon">⏱️</div>
              <div class="kpi-content">
                <span class="kpi-value" *ngIf="paybackPeriod >= 0"
                  >Year {{ paybackPeriod }}</span
                >
                <span class="kpi-value" *ngIf="paybackPeriod < 0"
                  >{{ years }}+</span
                >
                <span class="kpi-label">Payback Period</span>
              </div>
            </div>
            <div class="kpi-card info">
              <div class="kpi-icon">📊</div>
              <div class="kpi-content">
                <span class="kpi-value"
                  >AED
                  {{ getTotalRevenue() / 1000000 | number: "1.1-1" }}M</span
                >
                <span class="kpi-label">{{ years }}-Year Revenue</span>
              </div>
            </div>
          </div>

          <!-- Charts Section -->
          <div class="charts-grid">
            <!-- Cash Flow Chart -->
            <div class="chart-card">
              <h4>💵 Cumulative Cash Flow</h4>
              <div class="cashflow-chart">
                <svg viewBox="0 0 400 180">
                  <!-- Grid lines -->
                  <line
                    x1="40"
                    y1="20"
                    x2="40"
                    y2="150"
                    stroke="#e2e8f0"
                    stroke-width="1"
                  />
                  <line
                    x1="40"
                    y1="150"
                    x2="380"
                    y2="150"
                    stroke="#e2e8f0"
                    stroke-width="1"
                  />

                  <!-- Zero line -->
                  <line
                    x1="40"
                    y1="85"
                    x2="380"
                    y2="85"
                    stroke="#94a3b8"
                    stroke-width="1"
                    stroke-dasharray="4"
                  />

                  <!-- Cash flow line -->
                  <polyline
                    [attr.points]="getCashFlowPoints(340, 130)"
                    fill="none"
                    stroke="#3b82f6"
                    stroke-width="3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />

                  <!-- Data points -->
                  <circle
                    *ngFor="
                      let point of getCashFlowSvgPoints(340, 130);
                      let i = index
                    "
                    [attr.cx]="point.x"
                    [attr.cy]="point.y"
                    r="4"
                    fill="#3b82f6"
                  />

                  <!-- Labels -->
                  <text x="10" y="25" font-size="10" fill="#64748b">AED M</text>
                  <text
                    *ngFor="let label of getYearLabels(); let i = index"
                    [attr.x]="40 + i * (340 / years)"
                    y="170"
                    font-size="10"
                    fill="#64748b"
                    text-anchor="middle"
                  >
                    Y{{ i }}
                  </text>
                </svg>
              </div>
            </div>

            <!-- Sensitivity Analysis -->
            <div class="chart-card">
              <h4>🎯 Sensitivity Analysis (NPV Impact)</h4>
              <div class="sensitivity-bars">
                <div
                  class="sensitivity-row"
                  *ngFor="let bar of getSensitivityBars()"
                >
                  <span class="sensitivity-label">{{ bar.label }}</span>
                  <div class="sensitivity-bar-track">
                    <div
                      class="sensitivity-bar"
                      [class.positive]="bar.value >= 0"
                      [class.negative]="bar.value < 0"
                      [style.width.%]="getSensitivityWidth(bar.value)"
                      [style.margin-left]="bar.value < 0 ? 'auto' : '0'"
                    ></div>
                  </div>
                  <span
                    class="sensitivity-value"
                    [class.positive]="bar.value >= 0"
                    [class.negative]="bar.value < 0"
                  >
                    {{ bar.value >= 0 ? "+" : ""
                    }}{{ bar.value / 1000 | number: "1.0-0" }}K
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- SROI Section -->
          <div class="sroi-section">
            <h4>🌱 Social Return on Investment (SROI)</h4>
            <div class="sroi-grid">
              <div class="sroi-card">
                <div class="sroi-icon">🌿</div>
                <div class="sroi-content">
                  <span class="sroi-value"
                    >{{ getSroiValue() | number: "1.1-1" }}x</span
                  >
                  <span class="sroi-label">SROI Ratio</span>
                </div>
              </div>
              <div class="sroi-card">
                <div class="sroi-icon">🏭</div>
                <div class="sroi-content">
                  <span class="sroi-value"
                    >AED {{ getCo2Value() / 1000 | number: "1.0-0" }}K</span
                  >
                  <span class="sroi-label">CO₂ Reduction Value</span>
                </div>
              </div>
              <div class="sroi-card">
                <div class="sroi-icon">⏰</div>
                <div class="sroi-content">
                  <span class="sroi-value"
                    >AED
                    {{
                      getProductivityGainValue() / 1000000 | number: "1.1-1"
                    }}M</span
                  >
                  <span class="sroi-label">Productivity Gains</span>
                </div>
              </div>
              <div class="sroi-card">
                <div class="sroi-icon">🏥</div>
                <div class="sroi-content">
                  <span class="sroi-value"
                    >AED
                    {{
                      getHealthcareReductionValue() / 1000 | number: "1.0-0"
                    }}K</span
                  >
                  <span class="sroi-label">Healthcare Savings</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Financial Summary -->
          <div class="summary-section">
            <h4>📋 Financial Summary</h4>
            <div class="summary-table">
              <div class="summary-row">
                <span class="summary-label">Initial Investment</span>
                <span class="summary-value"
                  >AED {{ pilotCost | number: "1.0-0" }}</span
                >
              </div>
              <div class="summary-row">
                <span class="summary-label">Annual Revenue (Year 1)</span>
                <span class="summary-value"
                  >AED {{ getAnnualRevenue() | number: "1.0-0" }}</span
                >
              </div>
              <div class="summary-row">
                <span class="summary-label">Operating Costs (Annual)</span>
                <span class="summary-value"
                  >AED {{ getOperatingCosts() | number: "1.0-0" }}</span
                >
              </div>
              <div class="summary-row highlight">
                <span class="summary-label">Net Cash Flow (Year 1)</span>
                <span class="summary-value positive"
                  >AED {{ getYear1CashFlow() | number: "1.0-0" }}</span
                >
              </div>
              <div class="summary-row">
                <span class="summary-label"
                  >{{ years }}-Year Total Revenue</span
                >
                <span class="summary-value"
                  >AED
                  {{ getTotalRevenue() / 1000000 | number: "1.1-1" }}M</span
                >
              </div>
              <div class="summary-row">
                <span class="summary-label">{{ years }}-Year Total Profit</span>
                <span class="summary-value positive"
                  >AED {{ getTotalProfit() / 1000000 | number: "1.1-1" }}M</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .business-container {
        padding: 20px;
        max-width: 1400px;
        margin: 0 auto;
      }

      /* Header */
      .page-header {
        background: linear-gradient(135deg, #1e3a5f 0%, #0ea5e9 100%);
        border-radius: 16px;
        padding: 24px;
        margin-bottom: 24px;
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
      }

      .subtitle {
        margin: 4px 0 0;
        color: rgba(255, 255, 255, 0.85);
      }

      .header-badges {
        display: flex;
        gap: 12px;
        margin-top: 16px;
      }

      .badge {
        background: rgba(255, 255, 255, 0.15);
        padding: 6px 12px;
        border-radius: 20px;
        font-size: 0.75rem;
        color: white;
      }

      /* Grid */
      .content-grid {
        display: grid;
        grid-template-columns: 340px 1fr;
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
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
        border: 1px solid #e2e8f0;
      }

      .panel-card h3 {
        margin: 0 0 20px;
        color: #1e3a5f;
        font-size: 1.1rem;
      }

      .form-group {
        margin-bottom: 20px;
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
        padding: 12px;
        border: 2px solid #e2e8f0;
        border-radius: 10px;
        font-size: 14px;
      }

      .range-input {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .range-input input[type="range"] {
        flex: 1;
        height: 8px;
        -webkit-appearance: none;
        background: #e2e8f0;
        border-radius: 4px;
      }

      .range-input input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 20px;
        height: 20px;
        background: #3b82f6;
        border-radius: 50%;
        cursor: pointer;
      }

      .range-value {
        min-width: 80px;
        text-align: right;
        font-weight: 600;
        color: #1e3a5f;
      }

      .range-labels {
        display: flex;
        justify-content: space-between;
        margin-top: 6px;
        font-size: 0.7rem;
        color: #94a3b8;
      }

      .btn-export {
        width: 100%;
        padding: 14px;
        background: linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%);
        color: white;
        border: none;
        border-radius: 10px;
        font-weight: 600;
        cursor: pointer;
        margin-top: 10px;
      }

      .btn-export:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(30, 58, 95, 0.3);
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
        font-size: 1.4rem;
        font-weight: 700;
        color: #1e3a5f;
      }

      .kpi-label {
        font-size: 0.8rem;
        color: #64748b;
      }

      .kpi-badge {
        display: inline-block;
        margin-top: 8px;
        padding: 4px 10px;
        border-radius: 6px;
        font-size: 0.7rem;
        font-weight: 600;
      }

      .kpi-badge.positive {
        background: #d1fae5;
        color: #059669;
      }

      .kpi-badge.negative {
        background: #fee2e2;
        color: #dc2626;
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
        margin: 0 0 16px;
        color: #1e3a5f;
        font-size: 1rem;
      }

      /* Cash Flow Chart */
      .cashflow-chart {
        height: 180px;
      }

      .cashflow-chart svg {
        width: 100%;
        height: 100%;
      }

      /* Sensitivity Bars */
      .sensitivity-bars {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .sensitivity-row {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .sensitivity-label {
        min-width: 100px;
        font-size: 0.8rem;
        color: #475569;
      }

      .sensitivity-bar-track {
        flex: 1;
        height: 20px;
        background: #f1f5f9;
        border-radius: 10px;
        overflow: hidden;
      }

      .sensitivity-bar {
        height: 100%;
        border-radius: 10px;
        transition: width 0.3s;
      }

      .sensitivity-bar.positive {
        background: linear-gradient(90deg, #10b981, #34d399);
      }

      .sensitivity-bar.negative {
        background: linear-gradient(90deg, #f87171, #ef4444);
      }

      .sensitivity-value {
        min-width: 60px;
        text-align: right;
        font-size: 0.8rem;
        font-weight: 600;
      }

      .sensitivity-value.positive {
        color: #10b981;
      }
      .sensitivity-value.negative {
        color: #ef4444;
      }

      /* SROI Section */
      .sroi-section {
        background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
        border-radius: 14px;
        padding: 24px;
        border: 1px solid #a7f3d0;
      }

      .sroi-section h4 {
        margin: 0 0 16px;
        color: #065f46;
        font-size: 1rem;
      }

      .sroi-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 16px;
      }

      @media (max-width: 768px) {
        .sroi-grid {
          grid-template-columns: repeat(2, 1fr);
        }
      }

      .sroi-card {
        background: white;
        border-radius: 12px;
        padding: 16px;
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .sroi-icon {
        font-size: 1.5rem;
      }

      .sroi-value {
        display: block;
        font-size: 1.1rem;
        font-weight: 700;
        color: #059669;
      }

      .sroi-label {
        font-size: 0.7rem;
        color: #64748b;
      }

      /* Summary Section */
      .summary-section {
        background: white;
        border-radius: 14px;
        padding: 24px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        border: 1px solid #e2e8f0;
      }

      .summary-section h4 {
        margin: 0 0 16px;
        color: #1e3a5f;
        font-size: 1rem;
      }

      .summary-table {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .summary-row {
        display: flex;
        justify-content: space-between;
        padding: 12px;
        border-radius: 8px;
      }

      .summary-row:nth-child(odd) {
        background: #f8fafc;
      }

      .summary-row.highlight {
        background: #eff6ff;
        border: 1px solid #bfdbfe;
      }

      .summary-label {
        color: #475569;
      }

      .summary-value {
        font-weight: 600;
        color: #1e3a5f;
      }

      .summary-value.positive {
        color: #059669;
      }
    `,
  ],
})
export class BusinessCaseComponent implements OnInit {
  simulations: SimulationResult[] = [];
  selectedSimulationId = "";
  error: string | null = null;

  pilotCost = 1200000;
  growthRate = 8;
  discountRate = 10;
  years = 5;

  cashFlows: number[] = [];
  npv = 0;
  irr = 0;
  paybackPeriod = -1;

  constructor(private simulationService: SimulationService) {}

  ngOnInit(): void {
    this.loadSimulations();
    this.recalculate();
  }

  loadSimulations(): void {
    this.simulationService.getAllSimulations().subscribe({
      next: (data) => {
        this.simulations = data;
        if (data.length > 0) {
          this.selectedSimulationId = data[0].id;
          this.recalculate();
        }
      },
      error: () => {
        this.error = "Failed to load simulations";
      },
    });
  }

  onInputsChanged(): void {
    this.recalculate();
  }

  getSelectedSimulation(): SimulationResult | null {
    return (
      this.simulations.find((s) => s.id === this.selectedSimulationId) || null
    );
  }

  recalculate(): void {
    const simulation = this.getSelectedSimulation();
    if (!simulation) {
      this.cashFlows = [];
      return;
    }

    const annualRevenue = simulation.estimatedRevenue * 365;
    const maintenance = annualRevenue * 0.15;
    const operational = annualRevenue * 0.1;
    const growth = this.growthRate / 100;

    let cumulative = -this.pilotCost;
    const flows = [cumulative];

    for (let year = 1; year <= this.years; year += 1) {
      const yearRevenue = annualRevenue * Math.pow(1 + growth, year - 1);
      const yearNet = yearRevenue - maintenance - operational;
      cumulative += yearNet;
      flows.push(cumulative);
    }

    this.cashFlows = flows;
    this.npv = this.calculateNPV(flows, this.discountRate / 100);
    this.irr = this.calculateIRR(flows);
    this.paybackPeriod = this.calculatePaybackPeriod(flows);
  }

  getCashFlowPoints(width = 340, height = 130): string {
    if (this.cashFlows.length === 0) return "";
    const max = Math.max(...this.cashFlows);
    const min = Math.min(...this.cashFlows, 0);
    const range = max - min || 1;

    const points = this.cashFlows.map((value, index) => {
      const x = 40 + (index / (this.cashFlows.length - 1)) * width;
      const y = 150 - ((value - min) / range) * height;
      return `${x},${y}`;
    });

    return points.join(" ");
  }

  getCashFlowSvgPoints(width = 340, height = 130): { x: number; y: number }[] {
    if (this.cashFlows.length === 0) return [];
    const max = Math.max(...this.cashFlows);
    const min = Math.min(...this.cashFlows, 0);
    const range = max - min || 1;

    return this.cashFlows.map((value, index) => {
      const x = 40 + (index / (this.cashFlows.length - 1)) * width;
      const y = 150 - ((value - min) / range) * height;
      return { x, y };
    });
  }

  getYearLabels(): string[] {
    return Array.from({ length: this.years + 1 }, (_, i) => `Y${i}`);
  }

  getSensitivityBars(): { label: string; value: number }[] {
    const base = this.npv;
    return [
      { label: "Growth +3%", value: this.calculateScenario(3, 0, 0) - base },
      { label: "Growth -3%", value: this.calculateScenario(-3, 0, 0) - base },
      { label: "WACC +2%", value: this.calculateScenario(0, 2, 0) - base },
      { label: "WACC -2%", value: this.calculateScenario(0, -2, 0) - base },
      {
        label: "Cost +10%",
        value: this.calculateScenario(0, 0, this.pilotCost * 0.1) - base,
      },
      {
        label: "Cost -10%",
        value: this.calculateScenario(0, 0, -this.pilotCost * 0.1) - base,
      },
    ];
  }

  getSensitivityWidth(value: number): number {
    const maxImpact = 500000;
    return Math.min(100, (Math.abs(value) / maxImpact) * 100);
  }

  getSroiValue(): number {
    const socialBenefit =
      this.getProductivityGainValue() +
      this.getCo2Value() +
      this.getHealthcareReductionValue();
    if (this.pilotCost === 0) return 0;
    return socialBenefit / this.pilotCost;
  }

  getCo2Value(): number {
    const simulation = this.getSelectedSimulation();
    if (!simulation) return 0;
    const tons = simulation.environmentalImpact / 1000;
    return tons * 250;
  }

  getProductivityGainValue(): number {
    const simulation = this.getSelectedSimulation();
    if (!simulation) return 0;
    const avgWage = 45;
    const hoursSaved = (simulation.congestionReduction / 100) * 0.5;
    const dailyValue = simulation.totalVehicles * hoursSaved * avgWage;
    return dailyValue * 365;
  }

  getHealthcareReductionValue(): number {
    const simulation = this.getSelectedSimulation();
    if (!simulation) return 0;
    const tons = simulation.environmentalImpact / 1000;
    return tons * 120;
  }

  getAnnualRevenue(): number {
    const simulation = this.getSelectedSimulation();
    if (!simulation) return 0;
    return simulation.estimatedRevenue * 365;
  }

  getOperatingCosts(): number {
    return this.getAnnualRevenue() * 0.25;
  }

  getYear1CashFlow(): number {
    return this.getAnnualRevenue() - this.getOperatingCosts();
  }

  getTotalRevenue(): number {
    let total = 0;
    const growth = this.growthRate / 100;
    const annualRevenue = this.getAnnualRevenue();
    for (let year = 0; year < this.years; year++) {
      total += annualRevenue * Math.pow(1 + growth, year);
    }
    return total;
  }

  getTotalProfit(): number {
    return (
      this.getTotalRevenue() -
      this.getOperatingCosts() * this.years -
      this.pilotCost
    );
  }

  exportInvestmentMemo(): void {
    const sim = this.getSelectedSimulation();
    if (!sim) return;

    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.setTextColor(30, 58, 95);
    doc.text("Smart Mobility Investment Memo", 20, 25);

    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text("UAE Government Stakeholder Report", 20, 35);
    doc.text("Generated: " + new Date().toLocaleDateString(), 20, 42);

    doc.setFontSize(14);
    doc.setTextColor(30);
    doc.text("Executive Summary", 20, 58);

    doc.setFontSize(11);
    doc.setTextColor(60);
    const summaryText = `This business case presents the financial analysis for implementing Smart Mobility congestion pricing in ${sim.name}. The analysis projects significant returns with an NPV of AED ${(this.npv / 1000000).toFixed(1)}M and IRR of ${this.irr.toFixed(0)}%.`;
    const lines = doc.splitTextToSize(summaryText, 170);
    doc.text(lines, 20, 68);

    doc.setFontSize(14);
    doc.setTextColor(30);
    doc.text("Key Financial Metrics", 20, 100);

    doc.setFontSize(11);
    doc.setTextColor(60);
    doc.text(
      `• Initial Investment: AED ${this.pilotCost.toLocaleString()}`,
      25,
      112,
    );
    doc.text(
      `• Net Present Value (NPV): AED ${this.npv.toLocaleString()}`,
      25,
      120,
    );
    doc.text(
      `• Internal Rate of Return (IRR): ${this.irr.toFixed(1)}%`,
      25,
      128,
    );
    doc.text(`• Payback Period: Year ${this.paybackPeriod}`, 25, 136);
    doc.text(
      `• {{ years }}-Year Revenue: AED ${(this.getTotalRevenue() / 1000000).toFixed(1)}M`,
      25,
      144,
    );

    doc.setFontSize(14);
    doc.setTextColor(30);
    doc.text("Risk Assessment", 20, 162);

    doc.setFontSize(11);
    doc.setTextColor(60);
    doc.text("• Regulatory alignment and government approval", 25, 174);
    doc.text("• Public acceptance and behavioral change", 25, 182);
    doc.text("• Technical integration with existing infrastructure", 25, 190);

    doc.setFontSize(14);
    doc.setTextColor(30);
    doc.text("Recommendation", 20, 210);

    doc.setFontSize(11);
    doc.setTextColor(60);
    const recText =
      "Based on the strong financial metrics and alignment with UAE Vision 2030, we recommend proceeding with the pilot implementation.";
    const recLines = doc.splitTextToSize(recText, 170);
    doc.text(recLines, 20, 220);

    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text(
      "Generated by Smart Mobility Simulator - Business Case Calculator",
      20,
      280,
    );

    doc.save("smart-mobility-investment-memo.pdf");
  }

  private calculateScenario(
    growthDelta: number,
    discountDelta: number,
    costDelta: number,
  ): number {
    const simulation = this.getSelectedSimulation();
    if (!simulation) return 0;

    const annualRevenue = simulation.estimatedRevenue * 365;
    const maintenance = annualRevenue * 0.15;
    const operational = annualRevenue * 0.1;
    const growth = (this.growthRate + growthDelta) / 100;
    const pilotCost = this.pilotCost + costDelta;
    const discount = (this.discountRate + discountDelta) / 100;

    let cumulative = -pilotCost;
    const flows = [cumulative];

    for (let year = 1; year <= this.years; year += 1) {
      const yearRevenue = annualRevenue * Math.pow(1 + growth, year - 1);
      const yearNet = yearRevenue - maintenance - operational;
      cumulative += yearNet;
      flows.push(cumulative);
    }

    return this.calculateNPV(flows, discount);
  }

  private calculateNPV(cashFlows: number[], discountRate: number): number {
    return cashFlows.reduce((acc, flow, index) => {
      return acc + flow / Math.pow(1 + discountRate, index);
    }, 0);
  }

  private calculateIRR(cashFlows: number[]): number {
    let guess = 0.1;
    for (let i = 0; i < 50; i += 1) {
      let npv = 0;
      let derivative = 0;
      for (let t = 0; t < cashFlows.length; t += 1) {
        npv += cashFlows[t] / Math.pow(1 + guess, t);
        if (t > 0) {
          derivative -= (t * cashFlows[t]) / Math.pow(1 + guess, t + 1);
        }
      }
      if (Math.abs(derivative) < 1e-6) break;
      const next = guess - npv / derivative;
      if (!isFinite(next)) break;
      if (Math.abs(next - guess) < 1e-6) {
        guess = next;
        break;
      }
      guess = next;
    }
    return guess * 100;
  }

  private calculatePaybackPeriod(cashFlows: number[]): number {
    for (let i = 0; i < cashFlows.length; i += 1) {
      if (cashFlows[i] >= 0) return i;
    }
    return -1;
  }
}
