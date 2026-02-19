import { Component, OnInit, NgZone } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { SimulationService } from "../../services/simulation.service";
import { SimulationResult } from "../../models/simulation.model";
import { ChartService } from "../../services/chart.service";
import { ReportService, ReportData } from "../../services/report.service";

interface Scenario {
  id: string;
  name: string;
  description: string;
  color: string;
  result?: SimulationResult;
}

@Component({
  selector: "app-scenario-comparison",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="comparison-container">
      <div class="page-header">
        <h1>🔍 Scenario Comparison</h1>
        <p>Compare different pricing scenarios side-by-side</p>
      </div>

      <!-- Scenario Selection -->
      <div class="scenario-selection">
        <h3>Select Scenarios to Compare</h3>
        <div class="scenario-cards">
          <div
            *ngFor="let scenario of availableScenarios"
            class="scenario-card"
            [class.selected]="isSelected(scenario)"
            [style.border-color]="scenario.color"
            (click)="toggleScenario(scenario)"
          >
            <div
              class="scenario-color"
              [style.background]="scenario.color"
            ></div>
            <h4>{{ scenario.name }}</h4>
            <p>{{ scenario.description }}</p>
            <div class="scenario-check" *ngIf="isSelected(scenario)">
              ✓ Selected
            </div>
          </div>
        </div>

        <div class="action-row">
          <button
            class="run-btn"
            (click)="runAllScenarios()"
            [disabled]="selectedScenarios.length < 2 || isRunning"
          >
            {{ isRunning ? "⏳ Running..." : "▶️ Run All Scenarios" }}
          </button>
          <button
            class="add-custom-btn"
            (click)="showCustomForm = !showCustomForm"
          >
            ➕ Add Custom Scenario
          </button>
        </div>

        <!-- Custom Scenario Form -->
        <div class="custom-form" *ngIf="showCustomForm">
          <h4>Create Custom Scenario</h4>
          <div class="form-grid">
            <div class="form-group">
              <label>Scenario Name</label>
              <input
                type="text"
                [(ngModel)]="customScenario.name"
                placeholder="e.g., High Pricing"
              />
            </div>
            <div class="form-group">
              <label>Description</label>
              <input
                type="text"
                [(ngModel)]="customScenario.description"
                placeholder="Brief description"
              />
            </div>
            <div class="form-group">
              <label>Hourly Rate (AED)</label>
              <input type="number" [(ngModel)]="customScenario.rate" />
            </div>
            <div class="form-group">
              <label>Free Hours</label>
              <input type="number" [(ngModel)]="customScenario.freeHours" />
            </div>
            <div class="form-group">
              <label>Peak Multiplier</label>
              <input
                type="number"
                [(ngModel)]="customScenario.multiplier"
                step="0.1"
              />
            </div>
            <div class="form-group">
              <label>Color</label>
              <input type="color" [(ngModel)]="customScenario.color" />
            </div>
          </div>
          <button class="create-btn" (click)="addCustomScenario()">
            Add Scenario
          </button>
        </div>
      </div>

      <!-- Results Comparison -->
      <div class="results-section" *ngIf="hasResults">
        <!-- Summary Cards -->
        <div class="summary-section">
          <h3>📊 Comparison Summary</h3>
          <div class="metrics-compare">
            <div class="metric-header">
              <span>Metric</span>
              <span
                *ngFor="let s of selectedScenarios"
                [style.color]="s.color"
                >{{ s.name }}</span
              >
            </div>
            <div class="metric-row">
              <span class="metric-label">Congestion Reduction</span>
              <span *ngFor="let s of selectedScenarios" class="metric-value">
                {{ s.result?.congestionReduction | number: "1.1-1" }}%
              </span>
            </div>
            <div class="metric-row">
              <span class="metric-label">Revenue (AED)</span>
              <span *ngFor="let s of selectedScenarios" class="metric-value">
                {{ s.result?.estimatedRevenue | number }}
              </span>
            </div>
            <div class="metric-row">
              <span class="metric-label">Vehicles Diverted</span>
              <span *ngFor="let s of selectedScenarios" class="metric-value">
                {{ s.result?.vehiclesDiverted | number }}
              </span>
            </div>
            <div class="metric-row">
              <span class="metric-label">CO₂ Reduction (kg)</span>
              <span *ngFor="let s of selectedScenarios" class="metric-value">
                {{ s.result?.environmentalImpact | number }}
              </span>
            </div>
            <div class="metric-row">
              <span class="metric-label">Equity Impact</span>
              <span *ngFor="let s of selectedScenarios" class="metric-value">
                {{
                  s.result?.equityImpact?.isRegressive
                    ? "⚠️ Regressive"
                    : "✓ Fair"
                }}
              </span>
            </div>
          </div>
        </div>

        <!-- Charts -->
        <div class="charts-compare">
          <div class="chart-panel">
            <h4>📉 Congestion Reduction Comparison</h4>
            <canvas id="compareCongestionChart"></canvas>
          </div>
          <div class="chart-panel">
            <h4>💰 Revenue Comparison</h4>
            <canvas id="compareRevenueChart"></canvas>
          </div>
          <div class="chart-panel full-width">
            <h4>📊 Multi-Metric Comparison</h4>
            <canvas id="compareMultiChart"></canvas>
          </div>
        </div>

        <!-- Winner Analysis -->
        <div class="winner-section">
          <h3>🏆 Analysis & Recommendations</h3>
          <div class="winner-cards">
            <div class="winner-card best">
              <span class="winner-icon">⭐</span>
              <h4>Best for Revenue</h4>
              <p>{{ revenueWinner?.name }}</p>
              <span class="winner-value"
                >AED
                {{ revenueWinner?.result?.estimatedRevenue | number }}</span
              >
            </div>
            <div class="winner-card best">
              <span class="winner-icon">🌿</span>
              <h4>Best for Environment</h4>
              <p>{{ envWinner?.name }}</p>
              <span class="winner-value"
                >{{ envWinner?.result?.environmentalImpact | number }} kg
                CO₂</span
              >
            </div>
            <div class="winner-card best">
              <span class="winner-icon">⚖️</span>
              <h4>Most Equitable</h4>
              <p>{{ equityWinner?.name }}</p>
              <span class="winner-value">{{
                equityWinner?.result?.equityImpact?.isRegressive
                  ? "Regressive"
                  : "Fair"
              }}</span>
            </div>
            <div class="winner-card recommendation">
              <span class="winner-icon">💡</span>
              <h4>Recommendation</h4>
              <p>{{ recommendation }}</p>
            </div>
          </div>
        </div>

        <!-- Export -->
        <div class="export-section">
          <button class="export-btn" (click)="exportComparison()">
            📥 Export Comparison Report
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div class="empty-state" *ngIf="!hasResults">
        <div class="empty-icon">📊</div>
        <h3>Select at least 2 scenarios to compare</h3>
        <p>Choose scenarios from the list above or create custom ones</p>
      </div>
    </div>
  `,
  styles: [
    `
      .comparison-container {
        max-width: 1400px;
        margin: 0 auto;
        padding: 20px;
      }

      .page-header {
        text-align: center;
        margin-bottom: 30px;
      }

      .page-header h1 {
        color: #1e3a5f;
        margin: 0 0 8px;
      }

      .page-header p {
        color: #64748b;
        margin: 0;
      }

      /* Scenario Selection */
      .scenario-selection {
        background: white;
        border-radius: 16px;
        padding: 24px;
        margin-bottom: 24px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
      }

      .scenario-selection h3 {
        margin: 0 0 16px;
        color: #1e3a5f;
      }

      .scenario-cards {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
        gap: 16px;
        margin-bottom: 20px;
      }

      .scenario-card {
        border: 2px solid #e2e8f0;
        border-radius: 12px;
        padding: 16px;
        cursor: pointer;
        transition: all 0.2s;
        position: relative;
      }

      .scenario-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }

      .scenario-card.selected {
        background: #f8fafc;
      }

      .scenario-color {
        width: 40px;
        height: 6px;
        border-radius: 3px;
        margin-bottom: 12px;
      }

      .scenario-card h4 {
        margin: 0 0 8px;
        color: #1e293b;
      }

      .scenario-card p {
        margin: 0;
        font-size: 13px;
        color: #64748b;
      }

      .scenario-check {
        margin-top: 12px;
        color: #10b981;
        font-weight: 600;
        font-size: 13px;
      }

      .action-row {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
      }

      .run-btn,
      .add-custom-btn {
        padding: 12px 24px;
        border-radius: 10px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
      }

      .run-btn {
        background: linear-gradient(135deg, #3b82f6, #0ea5e9);
        color: white;
        border: none;
      }

      .run-btn:hover:not(:disabled) {
        transform: translateY(-2px);
      }

      .run-btn:disabled {
        opacity: 0.6;
      }

      .add-custom-btn {
        background: white;
        border: 1px solid #e2e8f0;
        color: #475569;
      }

      .add-custom-btn:hover {
        background: #f8fafc;
      }

      /* Custom Form */
      .custom-form {
        margin-top: 20px;
        padding: 20px;
        background: #f8fafc;
        border-radius: 12px;
      }

      .custom-form h4 {
        margin: 0 0 16px;
        color: #1e3a5f;
      }

      .form-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 16px;
        margin-bottom: 16px;
      }

      .form-group label {
        display: block;
        font-size: 13px;
        color: #64748b;
        margin-bottom: 6px;
      }

      .form-group input {
        width: 100%;
        padding: 10px;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
      }

      .create-btn {
        padding: 10px 20px;
        background: #10b981;
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
      }

      /* Results Section */
      .results-section {
        background: white;
        border-radius: 16px;
        padding: 24px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
      }

      .summary-section h3,
      .winner-section h3 {
        margin: 0 0 16px;
        color: #1e3a5f;
      }

      /* Metrics Compare */
      .metrics-compare {
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        overflow: hidden;
        margin-bottom: 24px;
      }

      .metric-header,
      .metric-row {
        display: grid;
        grid-template-columns: 200px repeat(auto-fit, minmax(120px, 1fr));
        padding: 12px 16px;
      }

      .metric-header {
        background: #f8fafc;
        font-weight: 600;
        color: #64748b;
        font-size: 13px;
      }

      .metric-row {
        border-top: 1px solid #e2e8f0;
      }

      .metric-label {
        color: #475569;
      }

      .metric-value {
        font-weight: 600;
        color: #1e293b;
      }

      /* Charts */
      .charts-compare {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 20px;
        margin-bottom: 24px;
      }

      .chart-panel {
        background: #f8fafc;
        border-radius: 12px;
        padding: 20px;
      }

      .chart-panel.full-width {
        grid-column: span 2;
      }

      .chart-panel h4 {
        margin: 0 0 16px;
        color: #1e3a5f;
        font-size: 14px;
      }

      .chart-panel canvas {
        width: 100% !important;
        height: 250px !important;
      }

      /* Winner Section */
      .winner-cards {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 16px;
      }

      .winner-card {
        background: #f8fafc;
        border-radius: 12px;
        padding: 20px;
        text-align: center;
      }

      .winner-card.best {
        background: #d1fae5;
      }

      .winner-card.recommendation {
        background: #dbeafe;
      }

      .winner-icon {
        font-size: 32px;
        display: block;
        margin-bottom: 12px;
      }

      .winner-card h4 {
        margin: 0 0 8px;
        font-size: 14px;
        color: #1e3a5f;
      }

      .winner-card p {
        margin: 0;
        font-weight: 600;
        color: #1e293b;
      }

      .winner-value {
        display: block;
        margin-top: 8px;
        font-size: 13px;
        color: #64748b;
      }

      /* Export */
      .export-section {
        text-align: center;
        margin-top: 24px;
        padding-top: 24px;
        border-top: 1px solid #e2e8f0;
      }

      .export-btn {
        padding: 14px 32px;
        background: #1e3a5f;
        color: white;
        border: none;
        border-radius: 10px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
      }

      .export-btn:hover {
        background: #0f172a;
      }

      /* Empty State */
      .empty-state {
        text-align: center;
        padding: 60px 20px;
        background: white;
        border-radius: 16px;
      }

      .empty-icon {
        font-size: 64px;
        margin-bottom: 16px;
      }

      .empty-state h3 {
        margin: 0 0 8px;
        color: #1e3a5f;
      }

      .empty-state p {
        color: #64748b;
      }

      @media (max-width: 768px) {
        .scenario-cards,
        .charts-compare,
        .winner-cards {
          grid-template-columns: 1fr;
        }

        .chart-panel.full-width {
          grid-column: span 1;
        }

        .form-grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class ScenarioComparisonComponent implements OnInit {
  availableScenarios: Scenario[] = [
    {
      id: "1",
      name: "Baseline",
      description: "No pricing (current state)",
      color: "#94a3b8",
    },
    {
      id: "2",
      name: "Light Pricing",
      description: "AED 10/hr, 2hr free",
      color: "#10b981",
    },
    {
      id: "3",
      name: "Moderate",
      description: "AED 25/hr, 1hr free",
      color: "#3b82f6",
    },
    {
      id: "4",
      name: "Aggressive",
      description: "AED 50/hr, no free hours",
      color: "#ef4444",
    },
  ];

  selectedScenarios: Scenario[] = [];
  isRunning = false;
  showCustomForm = false;
  customScenario = {
    name: "",
    description: "",
    rate: 20,
    freeHours: 1,
    multiplier: 1.5,
    color: "#8b5cf6",
  };

  revenueWinner: Scenario | null = null;
  envWinner: Scenario | null = null;
  equityWinner: Scenario | null = null;
  recommendation = "";

  constructor(
    private simulationService: SimulationService,
    private chartService: ChartService,
    private ngZone: NgZone,
    private reportService: ReportService,
  ) {}

  ngOnInit(): void {}

  get hasResults(): boolean {
    return (
      this.selectedScenarios.length >= 2 &&
      this.selectedScenarios.every((s) => s.result)
    );
  }

  isSelected(scenario: Scenario): boolean {
    return this.selectedScenarios.some((s) => s.id === scenario.id);
  }

  toggleScenario(scenario: Scenario): void {
    if (this.isSelected(scenario)) {
      this.selectedScenarios = this.selectedScenarios.filter(
        (s) => s.id !== scenario.id,
      );
    } else {
      if (this.selectedScenarios.length < 4) {
        this.selectedScenarios.push({ ...scenario });
      }
    }
  }

  addCustomScenario(): void {
    const newScenario: Scenario = {
      id: `custom-${Date.now()}`,
      name: this.customScenario.name,
      description:
        this.customScenario.description || `AED ${this.customScenario.rate}/hr`,
      color: this.customScenario.color,
    };
    this.availableScenarios.push(newScenario);
    this.showCustomForm = false;
    this.customScenario = {
      name: "",
      description: "",
      rate: 20,
      freeHours: 1,
      multiplier: 1.5,
      color: "#8b5cf6",
    };
  }

  runAllScenarios(): void {
    if (this.selectedScenarios.length < 2) return;

    this.isRunning = true;

    // Run simulation for each selected scenario
    this.selectedScenarios.forEach((scenario, index) => {
      this.runSimulationForScenario(scenario, index);
    });
  }

  runSimulationForScenario(scenario: Scenario, index: number): void {
    // Get rate from scenario name/description
    let rate = 25;
    let freeHours = 1;

    if (scenario.name.includes("Light")) {
      rate = 10;
      freeHours = 2;
    } else if (scenario.name.includes("Moderate")) {
      rate = 25;
      freeHours = 1;
    } else if (scenario.name.includes("Aggressive")) {
      rate = 50;
      freeHours = 0;
    } else if (scenario.name === "Baseline") {
      rate = 0;
      freeHours = 0;
    }

    // Create mock results for demo
    const mockResult: SimulationResult = {
      id: scenario.id,
      name: scenario.name,
      description: scenario.description,
      totalVehicles: 15000 + index * 1000,
      vehiclesDiverted: Math.floor(1500 * (rate / 25) * (index + 1) * 0.3),
      congestionReduction: 5 + (rate / 10) * (index + 1),
      estimatedRevenue: rate * 800 * (index + 1),
      equityImpact: {
        lowIncomeBurden: 1.5 + index * 0.5,
        highIncomeBurden: 1 + index * 0.2,
        burdenRatio: 1.5 + index * 0.3,
        isRegressive: rate > 40,
      },
      environmentalImpact: 3000 + index * 800,
      zoneRules: {},
      results: {},
      createdAt: new Date(),
    };

    scenario.result = mockResult;

    // Check if all done
    if (this.selectedScenarios.every((s) => s.result)) {
      this.isRunning = false;
      this.analyzeResults();
      this.renderCharts();
    }
  }

  analyzeResults(): void {
    // Find winners
    this.revenueWinner = [...this.selectedScenarios]
      .filter((s) => s.result)
      .sort(
        (a, b) =>
          (b.result?.estimatedRevenue || 0) - (a.result?.estimatedRevenue || 0),
      )[0];

    this.envWinner = [...this.selectedScenarios]
      .filter((s) => s.result)
      .sort(
        (a, b) =>
          (b.result?.environmentalImpact || 0) -
          (a.result?.environmentalImpact || 0),
      )[0];

    this.equityWinner =
      [...this.selectedScenarios]
        .filter((s) => s.result && !s.result.equityImpact?.isRegressive)
        .sort(
          (a, b) =>
            (a.result?.equityImpact?.burdenRatio || 0) -
            (b.result?.equityImpact?.burdenRatio || 0),
        )[0] || this.selectedScenarios[0];

    // Generate recommendation
    if (this.revenueWinner && this.envWinner && this.equityWinner) {
      if (this.revenueWinner.name === this.envWinner.name) {
        this.recommendation = `${this.revenueWinner.name} offers the best balance of revenue and environmental impact.`;
      } else {
        this.recommendation = `Consider ${this.revenueWinner.name} for revenue or ${this.envWinner.name} for environmental goals. ${this.equityWinner.name} provides the most equitable outcome.`;
      }
    }
  }

  renderCharts(): void {
    const labels = this.selectedScenarios.map((s) => s.name);
    const congestionData = this.selectedScenarios.map(
      (s) => s.result?.congestionReduction || 0,
    );
    const revenueData = this.selectedScenarios.map(
      (s) => s.result?.estimatedRevenue || 0,
    );
    const colors = this.selectedScenarios.map((s) => s.color);

    // Use NgZone to run after Angular change detection
    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => {
        this.chartService.destroyAllCharts();

        // Create charts with retry logic
        this.createChartWithRetry("compareCongestionChart", () =>
          this.chartService.createBarChart("compareCongestionChart", labels, [
            {
              label: "Congestion Reduction %",
              data: congestionData,
              backgroundColor: colors,
            },
          ]),
        );

        this.createChartWithRetry("compareRevenueChart", () =>
          this.chartService.createBarChart("compareRevenueChart", labels, [
            {
              label: "Revenue (AED)",
              data: revenueData,
              backgroundColor: colors,
            },
          ]),
        );

        this.createChartWithRetry("compareMultiChart", () =>
          this.chartService.createBarChart("compareMultiChart", labels, [
            {
              label: "Congestion Reduction",
              data: congestionData,
              backgroundColor: colors[0] || "#3b82f6",
            },
            {
              label: "Revenue (÷1000)",
              data: revenueData.map((v) => v / 1000),
              backgroundColor: colors[1] || "#10b981",
            },
          ]),
        );
      }, 500);
    });
  }

  private createChartWithRetry(
    canvasId: string,
    createChartFn: () => void,
    retryCount = 0,
  ): void {
    const maxRetries = 10;
    const canvas = document.getElementById(canvasId);

    if (canvas) {
      createChartFn();
    } else if (retryCount < maxRetries) {
      setTimeout(() => {
        this.createChartWithRetry(canvasId, createChartFn, retryCount + 1);
      }, 200);
    } else {
      console.warn(
        `Canvas element '${canvasId}' not found after ${maxRetries} retries`,
      );
    }
  }

  exportComparison(): void {
    if (!this.hasResults) {
      alert("Please run simulations first before exporting.");
      return;
    }

    // Generate comparison report
    const scenariosData = this.selectedScenarios
      .map((s) => s.result)
      .filter((r): r is SimulationResult => r !== undefined);

    // Create a summary report
    const reportHtml = `
<!DOCTYPE html>
<html>
<head>
  <title>Scenario Comparison Report</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; }
    h1 { color: #1e3a5f; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
    th { background: #f8fafc; font-weight: 600; }
    .winner { color: #10b981; font-weight: bold; }
    .section { margin: 30px 0; }
  </style>
</head>
<body>
  <h1>📊 Scenario Comparison Report</h1>
  <p>Generated: ${new Date().toLocaleString()}</p>
  
  <div class="section">
    <h2>Selected Scenarios</h2>
    <ul>
      ${this.selectedScenarios.map((s) => `<li>${s.name}: ${s.description}</li>`).join("")}
    </ul>
  </div>

  <div class="section">
    <h2>Results Comparison</h2>
    <table>
      <tr>
        <th>Scenario</th>
        <th>Congestion Reduction</th>
        <th>Revenue</th>
        <th>Vehicles Diverted</th>
        <th>CO₂ Impact</th>
        <th>Equity</th>
      </tr>
      ${this.selectedScenarios
        .map(
          (s) => `
      <tr>
        <td><strong>${s.name}</strong></td>
        <td>${s.result?.congestionReduction?.toFixed(1) || 0}%</td>
        <td>AED ${(s.result?.estimatedRevenue || 0).toLocaleString()}</td>
        <td>${(s.result?.vehiclesDiverted || 0).toLocaleString()}</td>
        <td>${(s.result?.environmentalImpact || 0).toLocaleString()} kg</td>
        <td>${s.result?.equityImpact?.isRegressive ? "⚠️ Regressive" : "✓ Fair"}</td>
      </tr>
      `,
        )
        .join("")}
    </table>
  </div>

  <div class="section">
    <h2>🏆 Winners</h2>
    <p><strong>Best for Revenue:</strong> ${this.revenueWinner?.name || "N/A"}</p>
    <p><strong>Best for Environment:</strong> ${this.envWinner?.name || "N/A"}</p>
    <p><strong>Most Equitable:</strong> ${this.equityWinner?.name || "N/A"}</p>
  </div>

  <div class="section">
    <h2>💡 Recommendation</h2>
    <p>${this.recommendation}</p>
  </div>
</body>
</html>
    `;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(reportHtml);
      printWindow.document.close();
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  }
}



