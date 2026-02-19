import { Component, OnInit } from "@angular/core";
import {
  UaeDataService,
  UaeFactDto,
  InternationalBenchmarkDto,
} from "../../services/uae-data.service";

interface KeyMetric {
  value: string;
  label: string;
  source: string;
  icon: string;
}

interface BenchmarkView {
  city: string;
  system: string;
  reduction: number;
  revenue: number;
  chargeRange: string;
  lessons: string;
}

interface PolicyView {
  name: string;
  alignment: number;
  target: string;
  contribution: string;
  evidence: string;
}

@Component({
  selector: "app-uae-facts-dashboard",
  template: `
    <div class="uae-facts-container">
      <!-- Header -->
      <div class="page-header">
        <div class="header-content">
          <div class="uae-flag-mini">
            <div class="red"></div>
            <div class="green"></div>
            <div class="white"></div>
            <div class="black"></div>
          </div>
          <div>
            <h1>🇦🇪 UAE Transport Intelligence</h1>
            <p class="subtitle">
              Data-driven insights for smart mobility planning
            </p>
          </div>
        </div>
      </div>

      <!-- Key Metrics Cards -->
      <section class="metrics-section">
        <h2 class="section-title">
          <span class="icon">📊</span> Key Statistics
        </h2>
        <div class="metrics-grid">
          <div
            class="metric-card"
            *ngFor="let metric of keyMetrics"
            [class.highlight]="metric.label === 'Congestion'"
          >
            <div class="metric-icon">{{ metric.icon }}</div>
            <div class="metric-content">
              <div class="metric-value">{{ metric.value }}</div>
              <div class="metric-label">{{ metric.label }}</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Quick Facts Grid -->
      <section class="facts-section">
        <h2 class="section-title">
          <span class="icon">💡</span> Quick Facts by Category
        </h2>
        <div class="facts-grid">
          <div class="fact-category-card" *ngFor="let category of categories">
            <div class="category-header">
              <span class="category-icon">{{
                getCategoryIcon(category.name)
              }}</span>
              <h3>{{ category.name }}</h3>
            </div>
            <div class="fact-list">
              <div class="fact-item" *ngFor="let fact of category.facts">
                <p>{{ fact.text }}</p>
                <span class="fact-source">📑 {{ fact.source }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Benchmarks Section -->
      <section class="benchmarks-section">
        <h2 class="section-title">
          <span class="icon">🌍</span> International Benchmarks
        </h2>

        <div class="disclaimer-banner">
          <span class="disclaimer-icon">⚠️</span>
          <span class="disclaimer-text">
            <strong>Note:</strong> Dubai projections are conservative estimates
            based on international benchmarks. Our FAIR model (Residents FREE,
            Workers FREE, 20-min grace, Transit FREE, Off-peak FREE) ensures
            higher compliance than models without exemptions.
          </span>
        </div>

        <div class="benchmarks-grid">
          <div
            class="benchmark-card"
            *ngFor="let benchmark of benchmarks"
            [class.projected]="benchmark.city.includes('Dubai')"
          >
            <div class="benchmark-header">
              <span class="city">{{ benchmark.city }}</span>
              <span class="system">{{ benchmark.system }}</span>
            </div>
            <div class="benchmark-stats">
              <div class="stat">
                <span class="stat-value">{{ benchmark.reduction }}%</span>
                <span class="stat-label">Congestion Reduction</span>
              </div>
              <div class="stat">
                <span class="stat-value">\${{ benchmark.revenue }}M</span>
                <span class="stat-label">Annual Revenue</span>
              </div>
            </div>
            <div class="benchmark-charge">
              <span class="charge-label">Charge:</span>
              <span class="charge-value">{{ benchmark.chargeRange }}</span>
            </div>
            <div class="benchmark-lessons">
              <strong>{{
                benchmark.city.includes("Dubai")
                  ? "🎯 Our Advantage:"
                  : "📖 Lessons:"
              }}</strong>
              {{ benchmark.lessons }}
            </div>
          </div>
        </div>
      </section>

      <!-- Policy Alignment -->
      <section class="policy-section">
        <h2 class="section-title">
          <span class="icon">📜</span> UAE Government Policy Alignment
        </h2>
        <div class="policy-grid">
          <div class="policy-card" *ngFor="let policy of policies">
            <div class="policy-header">
              <h4>{{ policy.name }}</h4>
              <div
                class="alignment-ring"
                [attr.data-percent]="policy.alignment"
              >
                <span>{{ policy.alignment }}%</span>
              </div>
            </div>
            <div class="policy-body">
              <div class="policy-target">
                <span class="label">Target:</span>
                <span class="value">{{ policy.target }}</span>
              </div>
              <div class="policy-contribution">
                <span class="label">Our Contribution:</span>
                <span class="value">{{ policy.contribution }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Economic Calculator -->
      <section class="calculator-section">
        <h2 class="section-title">
          <span class="icon">💰</span> Economic Impact Calculator
        </h2>

        <div class="calculator-card">
          <div class="calculator-inputs">
            <div class="input-group">
              <label>
                <span class="input-icon">📉</span> Congestion Reduction
              </label>
              <div class="slider-container">
                <input
                  type="range"
                  [(ngModel)]="congestionReduction"
                  min="5"
                  max="50"
                  step="1"
                />
                <div class="slider-labels">
                  <span>5%</span>
                  <span class="current-value">{{ congestionReduction }}%</span>
                  <span>50%</span>
                </div>
              </div>
            </div>
            <div class="input-group">
              <label>
                <span class="input-icon">🚗</span> Daily Vehicles Affected
              </label>
              <div class="number-input-container">
                <button class="btn-adjust" (click)="adjustVehicles(-5000)">
                  -
                </button>
                <input
                  type="number"
                  [(ngModel)]="dailyVehicles"
                  min="5000"
                  max="100000"
                  step="5000"
                />
                <button class="btn-adjust" (click)="adjustVehicles(5000)">
                  +
                </button>
              </div>
              <span class="input-hint"
                >{{ dailyVehicles | number }} vehicles/day</span
              >
            </div>
          </div>

          <div class="calculator-results">
            <div class="result-row">
              <div class="result-card">
                <div class="result-icon">⚡</div>
                <div class="result-content">
                  <div class="result-label">Productivity Gains</div>
                  <div class="result-value">
                    {{
                      calculateProductivity()
                        | currency: "AED" : "symbol" : "1.0-0"
                    }}
                  </div>
                  <div class="result-explanation">
                    ≈ {{ calculateJobs() }} full-time jobs
                  </div>
                </div>
              </div>
              <div class="result-card">
                <div class="result-icon">⛽</div>
                <div class="result-content">
                  <div class="result-label">Fuel Savings</div>
                  <div class="result-value">
                    {{
                      calculateFuelSavings()
                        | currency: "AED" : "symbol" : "1.0-0"
                    }}
                  </div>
                  <div class="result-explanation">
                    ≈ {{ calculateHomes() }} homes powered/year
                  </div>
                </div>
              </div>
            </div>
            <div class="result-row">
              <div class="result-card">
                <div class="result-icon">🌱</div>
                <div class="result-content">
                  <div class="result-label">CO2 Reduction Value</div>
                  <div class="result-value">
                    {{
                      calculateCO2Value() | currency: "AED" : "symbol" : "1.0-0"
                    }}
                  </div>
                  <div class="result-explanation">
                    ≈ {{ calculateTrees() }} trees planted
                  </div>
                </div>
              </div>
              <div class="result-card total">
                <div class="result-icon">📈</div>
                <div class="result-content">
                  <div class="result-label">Total Annual Impact</div>
                  <div class="result-value">
                    {{
                      calculateTotalImpact()
                        | currency: "AED" : "symbol" : "1.0-0"
                    }}
                  </div>
                  <div class="result-explanation">{{ calculateROI() }} ROI</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [
    `
      .uae-facts-container {
        padding: 20px;
        max-width: 1400px;
        margin: 0 auto;
        background: linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%);
        min-height: 100vh;
      }

      .page-header {
        background: linear-gradient(135deg, #1e3a5f 0%, #0ea5e9 100%);
        border-radius: 16px;
        padding: 24px;
        margin-bottom: 24px;
        color: white;
      }

      .header-content {
        display: flex;
        align-items: center;
        gap: 16px;
      }

      .uae-flag-mini {
        display: flex;
        width: 60px;
        height: 40px;
        border-radius: 4px;
        overflow: hidden;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      }

      .uae-flag-mini .red {
        flex: 1;
        background: #ce1126;
      }
      .uae-flag-mini .green {
        flex: 1;
        background: #00732f;
      }
      .uae-flag-mini .white {
        flex: 1;
        background: white;
      }
      .uae-flag-mini .black {
        flex: 1;
        background: #000;
      }

      .page-header h1 {
        margin: 0;
        font-size: 1.75rem;
        font-weight: 700;
        color: white;
      }

      .subtitle {
        margin: 4px 0 0 0;
        opacity: 0.9;
        font-size: 0.95rem;
        color: white;
      }

      .section-title {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 1.25rem;
        font-weight: 600;
        color: #1e3a5f;
        margin: 0 0 16px 0;
      }

      .section-title .icon {
        font-size: 1.4rem;
      }

      .metrics-section,
      .facts-section,
      .benchmarks-section,
      .policy-section,
      .calculator-section {
        margin-bottom: 28px;
      }

      /* Metrics Grid */
      .metrics-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 12px;
      }

      .metric-card {
        background: white;
        border-radius: 12px;
        padding: 16px;
        display: flex;
        align-items: center;
        gap: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        border: 1px solid #e2e8f0;
        transition:
          transform 0.2s,
          box-shadow 0.2s;
      }

      .metric-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }

      .metric-card.highlight {
        background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
        border-color: #f59e0b;
      }

      .metric-icon {
        font-size: 2rem;
      }

      .metric-value {
        font-size: 1.25rem;
        font-weight: 700;
        color: #1e3a5f;
      }

      .metric-label {
        font-size: 0.8rem;
        color: #64748b;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      /* Facts Grid */
      .facts-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 16px;
      }

      .fact-category-card {
        background: white;
        border-radius: 12px;
        padding: 16px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        border: 1px solid #e2e8f0;
      }

      .category-header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 12px;
        padding-bottom: 8px;
        border-bottom: 2px solid #e2e8f0;
      }

      .category-icon {
        font-size: 1.25rem;
      }

      .category-header h3 {
        margin: 0;
        font-size: 1rem;
        color: #1e3a5f;
      }

      .fact-item {
        padding: 8px 0;
        border-bottom: 1px dashed #e2e8f0;
      }

      .fact-item:last-child {
        border-bottom: none;
      }

      .fact-item p {
        margin: 0 0 4px 0;
        font-size: 0.9rem;
        color: #334155;
        line-height: 1.4;
      }

      .fact-source {
        font-size: 0.75rem;
        color: #94a3b8;
      }

      /* Benchmarks Grid */
      .benchmarks-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
        gap: 16px;
      }

      .benchmark-card {
        background: white;
        border-radius: 12px;
        padding: 16px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        border: 1px solid #e2e8f0;
      }

      .benchmark-card.projected {
        background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
        border: 2px solid #3b82f6;
      }

      .benchmark-header {
        margin-bottom: 12px;
      }

      .benchmark-header .city {
        display: block;
        font-size: 1.1rem;
        font-weight: 700;
        color: #1e3a5f;
      }

      .benchmark-header .system {
        font-size: 0.8rem;
        color: #64748b;
      }

      .benchmark-stats {
        display: flex;
        gap: 16px;
        margin-bottom: 12px;
      }

      .stat {
        flex: 1;
        text-align: center;
        padding: 8px;
        background: #f8fafc;
        border-radius: 8px;
      }

      .stat-value {
        display: block;
        font-size: 1.25rem;
        font-weight: 700;
        color: #059669;
      }

      .stat-label {
        font-size: 0.7rem;
        color: #64748b;
        text-transform: uppercase;
      }

      .benchmark-charge {
        font-size: 0.85rem;
        margin-bottom: 8px;
        padding: 6px 10px;
        background: #fef3c7;
        border-radius: 6px;
      }

      .charge-label {
        font-weight: 600;
        color: #92400e;
      }

      .charge-value {
        color: #b45309;
        margin-left: 6px;
      }

      .benchmark-lessons {
        font-size: 0.8rem;
        color: #475569;
        line-height: 1.4;
        padding-top: 8px;
        border-top: 1px solid #e2e8f0;
      }

      /* Policy Grid */
      .policy-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 16px;
      }

      .policy-card {
        background: white;
        border-radius: 12px;
        padding: 16px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        border: 1px solid #e2e8f0;
      }

      .policy-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
      }

      .policy-header h4 {
        margin: 0;
        font-size: 1rem;
        color: #1e3a5f;
      }

      .alignment-ring {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: conic-gradient(
          #059669 calc(var(--data-percent) * 3.6deg),
          #e2e8f0 0
        );
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
      }

      .alignment-ring::before {
        content: "";
        position: absolute;
        width: 40px;
        height: 40px;
        background: white;
        border-radius: 50%;
      }

      .alignment-ring span {
        position: relative;
        font-size: 0.7rem;
        font-weight: 700;
        color: #059669;
      }

      .policy-body .label {
        font-size: 0.75rem;
        color: #64748b;
        display: block;
        margin-bottom: 2px;
      }

      .policy-body .value {
        font-size: 0.85rem;
        color: #334155;
        display: block;
        margin-bottom: 8px;
      }

      /* Calculator */
      .calculator-card {
        background: white;
        border-radius: 16px;
        padding: 24px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
        border: 1px solid #e2e8f0;
      }

      .calculator-inputs {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 24px;
        margin-bottom: 24px;
        padding-bottom: 24px;
        border-bottom: 1px solid #e2e8f0;
      }

      .input-group label {
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 600;
        color: #1e3a5f;
        margin-bottom: 12px;
      }

      .input-icon {
        font-size: 1.2rem;
      }

      .slider-container input[type="range"] {
        width: 100%;
        height: 8px;
        border-radius: 4px;
        background: #e2e8f0;
        outline: none;
        -webkit-appearance: none;
      }

      .slider-container input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: #0ea5e9;
        cursor: pointer;
        box-shadow: 0 2px 6px rgba(14, 165, 233, 0.4);
      }

      .slider-labels {
        display: flex;
        justify-content: space-between;
        margin-top: 8px;
        font-size: 0.8rem;
        color: #64748b;
      }

      .current-value {
        font-weight: 700;
        color: #0ea5e9;
        font-size: 1rem;
      }

      .number-input-container {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .btn-adjust {
        width: 36px;
        height: 36px;
        border: none;
        border-radius: 8px;
        background: #e2e8f0;
        color: #1e3a5f;
        font-size: 1.2rem;
        cursor: pointer;
        transition: background 0.2s;
      }

      .btn-adjust:hover {
        background: #cbd5e1;
      }

      .number-input-container input {
        width: 120px;
        padding: 8px 12px;
        border: 2px solid #e2e8f0;
        border-radius: 8px;
        font-size: 1rem;
        text-align: center;
      }

      .input-hint {
        display: block;
        margin-top: 6px;
        font-size: 0.8rem;
        color: #64748b;
      }

      .calculator-results {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .result-row {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 12px;
      }

      .result-card {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 16px;
        background: #f8fafc;
        border-radius: 12px;
        border: 1px solid #e2e8f0;
      }

      .result-card.total {
        background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
        border-color: #6ee7b7;
      }

      .result-icon {
        font-size: 1.75rem;
      }

      .result-label {
        font-size: 0.8rem;
        color: #64748b;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .result-value {
        font-size: 1.25rem;
        font-weight: 700;
        color: #1e3a5f;
      }

      .result-card.total .result-value {
        color: #059669;
      }

      .result-explanation {
        font-size: 0.75rem;
        color: #94a3b8;
      }

      /* Disclaimer */
      .disclaimer-banner {
        background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
        border: 1px solid #f59e0b;
        border-radius: 10px;
        padding: 12px 16px;
        margin-bottom: 20px;
        display: flex;
        align-items: flex-start;
        gap: 10px;
      }

      .disclaimer-icon {
        font-size: 1.25rem;
      }

      .disclaimer-text {
        font-size: 0.85rem;
        color: #92400e;
        line-height: 1.5;
      }
    `,
  ],
})
export class UaeFactsDashboardComponent implements OnInit {
  keyMetrics: KeyMetric[] = [];
  categories: {
    name: string;
    facts: Array<{ text: string; source: string; relevance: number }>;
  }[] = [];
  benchmarks: BenchmarkView[] = [];
  policies: PolicyView[] = [];

  congestionReduction = 25;
  dailyVehicles = 35000;

  constructor(private uaeDataService: UaeDataService) {}

  ngOnInit(): void {
    this.loadUaeFacts();
    this.loadBenchmarks();
    this.loadPolicies();
  }

  loadUaeFacts(): void {
    this.uaeDataService.getFacts().subscribe((facts) => {
      this.keyMetrics = facts
        .filter((f) => f.relevance >= 9)
        .slice(0, 4)
        .map((fact) => ({
          value: this.extractMetricValue(fact),
          label: fact.category,
          source: fact.source,
          icon: this.getMetricIcon(fact.category),
        }));

      const categories = Array.from(new Set(facts.map((f) => f.category)));
      this.categories = categories.map((cat) => ({
        name: cat,
        facts: facts
          .filter((f) => f.category === cat)
          .slice(0, 2)
          .map((fact) => ({
            text: fact.fact,
            source: fact.source,
            relevance: fact.relevance,
          })),
      }));
    });
  }

  loadBenchmarks(): void {
    this.uaeDataService.getBenchmarks().subscribe((benchmarks) => {
      this.benchmarks = benchmarks.map((benchmark) => ({
        city: benchmark.city,
        system: benchmark.system,
        reduction: benchmark.congestionReduction,
        revenue: benchmark.annualRevenueMillionUSD,
        chargeRange: benchmark.chargeRange,
        lessons: benchmark.lessons ?? benchmark.advantages ?? "",
      }));
    });
  }

  loadPolicies(): void {
    this.policies = [
      {
        name: "UAE Vision 2030",
        alignment: 92,
        target: "Reduce commute times by 30%",
        contribution: "Projected 25% congestion reduction",
        evidence: "Based on international benchmarks",
      },
      {
        name: "UAE Net Zero 2050",
        alignment: 85,
        target: "Reduce transport emissions by 40%",
        contribution: "25% reduction = significant emissions drop",
        evidence: "Less idling = lower CO2 per trip",
      },
      {
        name: "Dubai Urban Mobility",
        alignment: 88,
        target: "Increase public transport to 30%",
        contribution: "Pricing incentives shift modal share",
        evidence: "Transit remains FREE in our model",
      },
    ];
  }

  getMetricIcon(category: string): string {
    const icons: { [key: string]: string } = {
      Congestion: "🚗",
      Vehicles: "🏎️",
      Commute: "⏱️",
      "Public Transport": "🚌",
      Environmental: "🌱",
      Economic: "💵",
      Safety: "🛡️",
      "Road Infrastructure": "🛣️",
    };
    return icons[category] || "📊";
  }

  getCategoryIcon(category: string): string {
    return this.getMetricIcon(category);
  }

  adjustVehicles(amount: number): void {
    this.dailyVehicles = Math.max(
      5000,
      Math.min(100000, this.dailyVehicles + amount),
    );
  }

  calculateProductivity(): number {
    const hoursSavedPerVehicle = (this.congestionReduction / 100) * 0.5;
    const dailyProductivity = this.dailyVehicles * hoursSavedPerVehicle * 150;
    return dailyProductivity * 365;
  }

  calculateFuelSavings(): number {
    const litersSavedPerVehicle = (this.congestionReduction / 100) * 0.5;
    const dailyFuelSavings = this.dailyVehicles * litersSavedPerVehicle * 3.25;
    return dailyFuelSavings * 365;
  }

  calculateCO2Value(): number {
    const litersSavedPerVehicle = (this.congestionReduction / 100) * 0.5;
    const dailyLitersSaved = this.dailyVehicles * litersSavedPerVehicle;
    const kgCo2Saved = dailyLitersSaved * 2.31;
    const tonsCo2Saved = (kgCo2Saved * 365) / 1000;
    return tonsCo2Saved * 250;
  }

  calculateJobs(): number {
    const annualWage = 150 * 8 * 260;
    return Math.max(1, Math.round(this.calculateProductivity() / annualWage));
  }

  calculateHomes(): number {
    return Math.max(1, Math.round(this.calculateFuelSavings() / 3000));
  }

  calculateTrees(): number {
    return Math.max(1, Math.round(this.calculateCO2Value() / 50));
  }

  calculateTotalImpact(): number {
    return (
      this.calculateProductivity() +
      this.calculateFuelSavings() +
      this.calculateCO2Value()
    );
  }

  calculateROI(): string {
    const totalImpact = this.calculateTotalImpact();
    const baseInvestment = 1_000_000;
    const roi = totalImpact / baseInvestment;
    return `${roi.toFixed(1)}x`;
  }

  private extractMetricValue(fact: UaeFactDto): string {
    const numberMatch = fact.fact.match(/([\d.]+\s*(?:billion|million|M|%)?)/i);
    if (numberMatch) return numberMatch[0];
    return `${fact.year}`;
  }
}



