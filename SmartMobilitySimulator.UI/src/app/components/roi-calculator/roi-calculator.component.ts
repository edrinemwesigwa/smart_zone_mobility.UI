import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ChartService } from "../../services/chart.service";

interface ROIMetrics {
  implementationCost: number;
  annualOperatingCost: number;
  annualRevenue: number;
  annualOperatingSavings: number;
  vehiclesPerDay: number;
  averageTripCost: number;
  complianceRate: number;
  yearsToROI: number;
}

interface ROIResult {
  totalInvestment: number;
  yearlyRevenue: number[];
  yearlyCosts: number[];
  cumulativeNetBenefit: number;
  roiPercentage: number;
  paybackPeriod: number;
  npv: number;
}

@Component({
  selector: "app-roi-calculator",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="roi-container">
      <div class="roi-header">
        <span class="header-icon">💰</span>
        <h1>ROI Calculator</h1>
        <p>
          Calculate the return on investment for congestion pricing
          implementation
        </p>
      </div>

      <div class="roi-content">
        <!-- Input Section -->
        <div class="input-section">
          <h3>📊 Investment Parameters</h3>

          <div class="input-grid">
            <div class="input-card">
              <h4>💵 Costs</h4>
              <div class="input-row">
                <label>Initial Implementation Cost (AED)</label>
                <input
                  type="number"
                  [(ngModel)]="inputs.implementationCost"
                  min="0"
                  step="100000"
                />
                <span class="hint">Infrastructure, technology, setup</span>
              </div>
              <div class="input-row">
                <label>Annual Operating Cost (AED)</label>
                <input
                  type="number"
                  [(ngModel)]="inputs.annualOperatingCost"
                  min="0"
                  step="50000"
                />
                <span class="hint">Maintenance, staffing, operations</span>
              </div>
            </div>

            <div class="input-card">
              <h4>📈 Revenue & Traffic</h4>
              <div class="input-row">
                <label>Daily Vehicle Entries</label>
                <input
                  type="number"
                  [(ngModel)]="inputs.vehiclesPerDay"
                  min="0"
                  step="1000"
                />
              </div>
              <div class="input-row">
                <label>Average Trip Charge (AED)</label>
                <input
                  type="number"
                  [(ngModel)]="inputs.averageTripCost"
                  min="0"
                  step="1"
                />
              </div>
              <div class="input-row">
                <label>Compliance Rate (%)</label>
                <div class="slider-row">
                  <input
                    type="range"
                    [(ngModel)]="inputs.complianceRate"
                    min="50"
                    max="100"
                    step="1"
                  />
                  <span class="slider-value">{{ inputs.complianceRate }}%</span>
                </div>
              </div>
            </div>

            <div class="input-card">
              <h4>⚙️ Additional Parameters</h4>
              <div class="input-row">
                <label>Annual Operating Savings (AED)</label>
                <input
                  type="number"
                  [(ngModel)]="inputs.annualOperatingSavings"
                  min="0"
                  step="50000"
                />
                <span class="hint"
                  >Reduced congestion costs, environmental benefits</span
                >
              </div>
              <div class="input-row">
                <label>Analysis Period (Years)</label>
                <input
                  type="number"
                  [(ngModel)]="analysisYears"
                  min="1"
                  max="10"
                />
              </div>
              <div class="input-row">
                <label>Discount Rate (%)</label>
                <div class="slider-row">
                  <input
                    type="range"
                    [(ngModel)]="discountRate"
                    min="0"
                    max="20"
                    step="0.5"
                  />
                  <span class="slider-value">{{ discountRate }}%</span>
                </div>
              </div>
            </div>
          </div>

          <button class="calculate-btn" (click)="calculateROI()">
            🧮 Calculate ROI
          </button>
        </div>

        <!-- Results Section -->
        <div class="results-section" *ngIf="results">
          <h3>📊 Results</h3>

          <!-- Key Metrics -->
          <div class="metrics-grid">
            <div class="metric-card primary">
              <span class="metric-icon">📈</span>
              <span class="metric-value"
                >{{ results.roiPercentage | number: "1.0-0" }}%</span
              >
              <span class="metric-label">Total ROI</span>
            </div>
            <div class="metric-card">
              <span class="metric-icon">⏱️</span>
              <span class="metric-value">{{
                results.paybackPeriod | number: "1.1-1"
              }}</span>
              <span class="metric-label">Payback Period (Years)</span>
            </div>
            <div class="metric-card">
              <span class="metric-icon">💵</span>
              <span class="metric-value"
                >AED {{ results.cumulativeNetBenefit | number: "1.0-0" }}</span
              >
              <span class="metric-label">Net Benefit (10 Years)</span>
            </div>
            <div class="metric-card">
              <span class="metric-icon">📉</span>
              <span class="metric-value"
                >AED {{ results.npv | number: "1.0-0" }}</span
              >
              <span class="metric-label">Net Present Value</span>
            </div>
          </div>

          <!-- Charts -->
          <div class="charts-grid">
            <div class="chart-card">
              <h4>Revenue vs Costs Over Time</h4>
              <canvas id="roiRevenueChart"></canvas>
            </div>
            <div class="chart-card">
              <h4>Cumulative Net Benefit</h4>
              <canvas id="roiCumulativeChart"></canvas>
            </div>
          </div>

          <!-- Breakdown Table -->
          <div class="breakdown-section">
            <h4>📋 Year-by-Year Breakdown</h4>
            <table class="breakdown-table">
              <thead>
                <tr>
                  <th>Year</th>
                  <th>Revenue</th>
                  <th>Operating Cost</th>
                  <th>Savings</th>
                  <th>Net Benefit</th>
                  <th>Cumulative</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let i of yearsArray">
                  <td>Year {{ i }}</td>
                  <td>
                    AED {{ results.yearlyRevenue[i - 1] | number: "1.0-0" }}
                  </td>
                  <td>
                    AED {{ results.yearlyCosts[i - 1] | number: "1.0-0" }}
                  </td>
                  <td>
                    AED {{ inputs.annualOperatingSavings | number: "1.0-0" }}
                  </td>
                  <td
                    [class.positive]="
                      results.yearlyRevenue[i - 1] -
                        results.yearlyCosts[i - 1] +
                        inputs.annualOperatingSavings >
                      0
                    "
                    [class.negative]="
                      results.yearlyRevenue[i - 1] -
                        results.yearlyCosts[i - 1] +
                        inputs.annualOperatingSavings <=
                      0
                    "
                  >
                    AED
                    {{
                      results.yearlyRevenue[i - 1] -
                        results.yearlyCosts[i - 1] +
                        inputs.annualOperatingSavings | number: "1.0-0"
                    }}
                  </td>
                  <td
                    [class.positive]="cumulativeSum(i) > 0"
                    [class.negative]="cumulativeSum(i) <= 0"
                  >
                    AED {{ cumulativeSum(i) | number: "1.0-0" }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Recommendations -->
          <div class="recommendations">
            <h4>💡 Recommendations</h4>
            <div class="recommendation-cards">
              <div
                class="rec-card"
                [class.positive]="results.paybackPeriod <= 3"
              >
                <span class="rec-icon">{{
                  results.paybackPeriod <= 3 ? "✅" : "⚠️"
                }}</span>
                <div class="rec-content">
                  <strong
                    >Payback Period:
                    {{ results.paybackPeriod | number: "1.1-1" }} years</strong
                  >
                  <p>
                    {{
                      results.paybackPeriod <= 3
                        ? "Excellent! The investment pays back quickly."
                        : "Consider optimizing costs or increasing compliance rate."
                    }}
                  </p>
                </div>
              </div>
              <div
                class="rec-card"
                [class.positive]="results.roiPercentage >= 100"
              >
                <span class="rec-icon">{{
                  results.roiPercentage >= 100 ? "✅" : "⚠️"
                }}</span>
                <div class="rec-content">
                  <strong
                    >ROI: {{ results.roiPercentage | number: "1.0-0" }}%</strong
                  >
                  <p>
                    {{
                      results.roiPercentage >= 100
                        ? "Strong return on investment!"
                        : "Consider adjusting pricing strategy."
                    }}
                  </p>
                </div>
              </div>
              <div class="rec-card" [class.positive]="results.npv > 0">
                <span class="rec-icon">{{
                  results.npv > 0 ? "✅" : "❌"
                }}</span>
                <div class="rec-content">
                  <strong>NPV: AED {{ results.npv | number: "1.0-0" }}</strong>
                  <p>
                    {{
                      results.npv > 0
                        ? "Positive net present value - investment is worthwhile."
                        : "Negative NPV - reconsider investment."
                    }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Preset Scenarios -->
        <div class="presets-section">
          <h4>📋 Quick Scenarios</h4>
          <div class="preset-buttons">
            <button class="preset-btn" (click)="applyPreset('small')">
              🏙️ Small City
              <span>AED 5M setup</span>
            </button>
            <button class="preset-btn" (click)="applyPreset('medium')">
              🌆 Medium City
              <span>AED 15M setup</span>
            </button>
            <button class="preset-btn" (click)="applyPreset('large')">
              🏙️ Large City
              <span>AED 50M setup</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .roi-container {
        max-width: 1400px;
        margin: 0 auto;
        padding: 20px;
      }

      .roi-header {
        text-align: center;
        margin-bottom: 30px;
      }

      .header-icon {
        font-size: 48px;
        display: block;
        margin-bottom: 16px;
      }

      .roi-header h1 {
        margin: 0 0 8px;
        color: #1e3a5f;
      }

      .roi-header p {
        margin: 0;
        color: #64748b;
      }

      .roi-content {
        display: flex;
        flex-direction: column;
        gap: 24px;
      }

      .input-section,
      .results-section,
      .presets-section {
        background: white;
        border-radius: 16px;
        padding: 24px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
      }

      .input-section h3,
      .results-section h3,
      .presets-section h3 {
        margin: 0 0 20px;
        color: #1e3a5f;
      }

      .input-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 20px;
        margin-bottom: 24px;
      }

      .input-card {
        background: #f8fafc;
        border-radius: 12px;
        padding: 20px;
      }

      .input-card h4 {
        margin: 0 0 16px;
        color: #1e3a5f;
        font-size: 16px;
      }

      .input-row {
        margin-bottom: 16px;
      }

      .input-row label {
        display: block;
        font-size: 13px;
        color: #64748b;
        margin-bottom: 6px;
      }

      .input-row input[type="number"] {
        width: 100%;
        padding: 10px;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        font-size: 14px;
      }

      .hint {
        display: block;
        font-size: 11px;
        color: #94a3b8;
        margin-top: 4px;
      }

      .slider-row {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .slider-row input[type="range"] {
        flex: 1;
      }

      .slider-value {
        font-weight: 600;
        color: #3b82f6;
        min-width: 50px;
      }

      .calculate-btn {
        width: 100%;
        padding: 16px;
        background: linear-gradient(135deg, #10b981, #059669);
        color: white;
        border: none;
        border-radius: 12px;
        font-size: 18px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
      }

      .calculate-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(16, 185, 129, 0.4);
      }

      .metrics-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 16px;
        margin-bottom: 24px;
      }

      .metric-card {
        background: #f8fafc;
        border-radius: 12px;
        padding: 20px;
        text-align: center;
      }

      .metric-card.primary {
        background: linear-gradient(135deg, #10b981, #059669);
        color: white;
      }

      .metric-icon {
        font-size: 24px;
        display: block;
        margin-bottom: 8px;
      }

      .metric-value {
        display: block;
        font-size: 24px;
        font-weight: 700;
      }

      .metric-card.primary .metric-value {
        color: white;
      }

      .metric-label {
        font-size: 13px;
        color: #64748b;
      }

      .metric-card.primary .metric-label {
        color: rgba(255, 255, 255, 0.8);
      }

      .charts-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 20px;
        margin-bottom: 24px;
      }

      .chart-card {
        background: #f8fafc;
        border-radius: 12px;
        padding: 20px;
      }

      .chart-card h4 {
        margin: 0 0 16px;
        color: #1e3a5f;
      }

      .chart-card canvas {
        width: 100% !important;
        height: 250px !important;
      }

      .breakdown-section {
        margin-bottom: 24px;
      }

      .breakdown-section h4 {
        margin: 0 0 16px;
        color: #1e3a5f;
      }

      .breakdown-table {
        width: 100%;
        border-collapse: collapse;
        background: #f8fafc;
        border-radius: 12px;
        overflow: hidden;
      }

      .breakdown-table th,
      .breakdown-table td {
        padding: 12px 16px;
        text-align: right;
        border-bottom: 1px solid #e2e8f0;
      }

      .breakdown-table th {
        background: #1e3a5f;
        color: white;
        font-weight: 600;
      }

      .breakdown-table td.positive {
        color: #059669;
        font-weight: 600;
      }

      .breakdown-table td.negative {
        color: #dc2626;
      }

      .recommendations h4 {
        margin: 0 0 16px;
        color: #1e3a5f;
      }

      .recommendation-cards {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 16px;
      }

      .rec-card {
        display: flex;
        gap: 12px;
        background: #f8fafc;
        border-radius: 12px;
        padding: 16px;
        border-right: 4px solid #94a3b8;
      }

      .rec-card.positive {
        border-right-color: #10b981;
      }

      .rec-icon {
        font-size: 24px;
      }

      .rec-content strong {
        display: block;
        margin-bottom: 4px;
        color: #1e293b;
      }

      .rec-content p {
        margin: 0;
        font-size: 13px;
        color: #64748b;
      }

      .preset-buttons {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
      }

      .preset-btn {
        flex: 1;
        min-width: 150px;
        padding: 16px;
        background: #f8fafc;
        border: 2px solid #e2e8f0;
        border-radius: 12px;
        cursor: pointer;
        text-align: center;
        transition: all 0.2s;
      }

      .preset-btn:hover {
        border-color: #3b82f6;
        background: #eff6ff;
      }

      .preset-btn strong {
        display: block;
        font-size: 16px;
        color: #1e293b;
        margin-bottom: 4px;
      }

      .preset-btn span {
        font-size: 13px;
        color: #64748b;
      }

      @media (max-width: 768px) {
        .metrics-grid,
        .charts-grid {
          grid-template-columns: repeat(2, 1fr);
        }
      }
    `,
  ],
})
export class RoiCalculatorComponent implements OnInit {
  inputs: ROIMetrics = {
    implementationCost: 15000000,
    annualOperatingCost: 2000000,
    annualRevenue: 0,
    annualOperatingSavings: 500000,
    vehiclesPerDay: 50000,
    averageTripCost: 15,
    complianceRate: 85,
    yearsToROI: 0,
  };

  analysisYears = 5;
  discountRate = 8;
  results: ROIResult | null = null;
  yearsArray: number[] = [];

  constructor(private chartService: ChartService) {}

  ngOnInit(): void {
    this.calculateROI();
  }

  calculateROI(): void {
    // Calculate annual revenue based on inputs
    const dailyRevenue =
      this.inputs.vehiclesPerDay *
      this.inputs.averageTripCost *
      (this.inputs.complianceRate / 100);
    const annualRevenue = dailyRevenue * 365;
    this.inputs.annualRevenue = annualRevenue;

    // Generate yearly projections
    const yearlyRevenue: number[] = [];
    const yearlyCosts: number[] = [];
    let cumulative = -this.inputs.implementationCost;

    for (let i = 1; i <= this.analysisYears; i++) {
      // Revenue grows slightly each year as awareness increases
      const yearRevenue = annualRevenue * (1 + (i - 1) * 0.05);
      yearlyRevenue.push(yearRevenue);

      // Operating cost grows with inflation
      const yearCost = this.inputs.annualOperatingCost * Math.pow(1.03, i - 1);
      yearlyCosts.push(yearCost);

      cumulative += yearRevenue - yearCost + this.inputs.annualOperatingSavings;
    }

    // Calculate payback period
    let paybackPeriod = 0;
    let cumCashFlow = -this.inputs.implementationCost;
    for (let i = 0; i < yearlyRevenue.length; i++) {
      const netCashFlow =
        yearlyRevenue[i] - yearlyCosts[i] + this.inputs.annualOperatingSavings;
      cumCashFlow += netCashFlow;
      if (cumCashFlow >= 0 && paybackPeriod === 0) {
        const prevCashFlow = cumCashFlow - netCashFlow;
        paybackPeriod = i + Math.abs(prevCashFlow) / netCashFlow;
      }
    }

    if (paybackPeriod === 0) {
      paybackPeriod = this.analysisYears + 1;
    }

    // Calculate NPV
    let npv = -this.inputs.implementationCost;
    for (let i = 0; i < yearlyRevenue.length; i++) {
      const netCashFlow =
        yearlyRevenue[i] - yearlyCosts[i] + this.inputs.annualOperatingSavings;
      npv += netCashFlow / Math.pow(1 + this.discountRate / 100, i + 1);
    }

    // Calculate total ROI
    const totalBenefits =
      yearlyRevenue.reduce((a, b) => a + b, 0) +
      this.inputs.annualOperatingSavings * this.analysisYears;
    const totalCosts =
      this.inputs.implementationCost + yearlyCosts.reduce((a, b) => a + b, 0);
    const roiPercentage = ((totalBenefits - totalCosts) / totalCosts) * 100;

    this.results = {
      totalInvestment: this.inputs.implementationCost,
      yearlyRevenue,
      yearlyCosts,
      cumulativeNetBenefit: cumulative,
      roiPercentage,
      paybackPeriod,
      npv,
    };

    this.yearsArray = Array.from(
      { length: this.analysisYears },
      (_, i) => i + 1,
    );

    setTimeout(() => this.renderCharts(), 100);
  }

  cumulativeSum(year: number): number {
    if (!this.results) return 0;
    let sum = -this.inputs.implementationCost;
    for (let i = 0; i < year; i++) {
      sum +=
        this.results.yearlyRevenue[i] -
        this.results.yearlyCosts[i] +
        this.inputs.annualOperatingSavings;
    }
    return sum;
  }

  renderCharts(): void {
    if (!this.results) return;

    // Revenue vs Costs Chart
    this.chartService.createLineChart(
      "roiRevenueChart",
      this.yearsArray.map((y) => `Year ${y}`),
      [
        {
          label: "Revenue (AED)",
          data: this.results.yearlyRevenue,
          borderColor: "#10b981",
          backgroundColor: "rgba(16, 185, 129, 0.1)",
          fill: true,
        },
        {
          label: "Costs (AED)",
          data: this.results.yearlyCosts,
          borderColor: "#ef4444",
          backgroundColor: "rgba(239, 68, 68, 0.1)",
          fill: true,
        },
      ],
    );

    // Cumulative Benefit Chart
    const cumulativeData: number[] = [];
    let cum = -this.inputs.implementationCost;
    for (let i = 0; i < this.results.yearlyRevenue.length; i++) {
      cum +=
        this.results.yearlyRevenue[i] -
        this.results.yearlyCosts[i] +
        this.inputs.annualOperatingSavings;
      cumulativeData.push(cum);
    }

    this.chartService.createBarChart(
      "roiCumulativeChart",
      this.yearsArray.map((y) => `Year ${y}`),
      [
        {
          label: "Cumulative Net Benefit (AED)",
          data: cumulativeData,
          backgroundColor: cumulativeData.map((v) =>
            v >= 0 ? "#10b981" : "#ef4444",
          ),
        },
      ],
    );
  }

  applyPreset(type: string): void {
    switch (type) {
      case "small":
        this.inputs.implementationCost = 5000000;
        this.inputs.annualOperatingCost = 1000000;
        this.inputs.vehiclesPerDay = 20000;
        this.inputs.averageTripCost = 10;
        this.inputs.annualOperatingSavings = 200000;
        this.analysisYears = 5;
        break;
      case "medium":
        this.inputs.implementationCost = 15000000;
        this.inputs.annualOperatingCost = 2000000;
        this.inputs.vehiclesPerDay = 50000;
        this.inputs.averageTripCost = 15;
        this.inputs.annualOperatingSavings = 500000;
        this.analysisYears = 5;
        break;
      case "large":
        this.inputs.implementationCost = 50000000;
        this.inputs.annualOperatingCost = 5000000;
        this.inputs.vehiclesPerDay = 150000;
        this.inputs.averageTripCost = 20;
        this.inputs.annualOperatingSavings = 1500000;
        this.analysisYears = 5;
        break;
    }
    this.calculateROI();
  }
}



