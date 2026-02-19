import { Component, OnInit, Input } from "@angular/core";
import { SimulationResult } from "../../models/simulation.model";

@Component({
  selector: "app-results-dashboard",
  templateUrl: "./results-dashboard.component.html",
  styleUrls: ["./results-dashboard.component.css"],
})
export class ResultsDashboardComponent implements OnInit {
  @Input() results: SimulationResult | null = null;

  chartData: any;
  equityChartData: any;
  selectedTab: "overview" | "detailed" | "equity" = "overview";

  ngOnInit(): void {
    if (this.results) {
      this.prepareChartData();
    }
  }

  ngOnChanges(): void {
    if (this.results) {
      this.prepareChartData();
    }
  }

  get equityDisplay() {
    return this.normalizeEquity(this.results?.equityImpact);
  }

  prepareChartData(): void {
    // Prepare chart data for visualization
    // This would integrate with Chart.js or similar library
    this.chartData = {
      vehicleDistribution: {
        diverted: this.results?.vehiclesDiverted || 0,
        notDiverted:
          (this.results?.totalVehicles || 0) -
          (this.results?.vehiclesDiverted || 0),
      },
      impactMetrics: {
        congestion: this.results?.congestionReduction || 0,
        revenue: this.results?.estimatedRevenue || 0,
        environmental: this.results?.environmentalImpact || 0,
      },
    };

    this.equityChartData = {
      lowIncomeBurden: this.equityDisplay.lowIncomeBurden || 0,
      highIncomeBurden: this.equityDisplay.highIncomeBurden || 0,
    };
  }

  getImpactSummary(): string {
    if (!this.results) return "";

    const congestion = this.results.congestionReduction.toFixed(1);
    const revenue = (this.results.estimatedRevenue / 1000).toFixed(1);
    const co2 = this.results.environmentalImpact.toFixed(0);

    return `Reducing congestion by ${congestion}%, generating AED ${revenue}K in revenue, and saving ${co2}kg of CO2`;
  }

  getEquityStatus(): string {
    if (!this.equityDisplay.isRegressive) {
      return "Fair distribution - pricing burden is proportional across income levels";
    }
    return "WARNING: Regressive pricing detected - lower income groups bear disproportionate burden";
  }

  private normalizeEquity(equity: any): {
    lowIncomeBurden: number;
    highIncomeBurden: number;
    burdenRatio: number;
    isRegressive: boolean;
  } {
    if (equity && typeof equity === "object") {
      return {
        lowIncomeBurden: Number(equity.lowIncomeBurden ?? 0),
        highIncomeBurden: Number(equity.highIncomeBurden ?? 0),
        burdenRatio: Number(equity.burdenRatio ?? 0),
        isRegressive: Boolean(equity.isRegressive ?? false),
      };
    }

    if (typeof equity === "number") {
      return {
        lowIncomeBurden: 0,
        highIncomeBurden: 0,
        burdenRatio: equity,
        isRegressive: false,
      };
    }

    return {
      lowIncomeBurden: 0,
      highIncomeBurden: 0,
      burdenRatio: 0,
      isRegressive: false,
    };
  }

  downloadReport(): void {
    // Implement report download
  }
}



