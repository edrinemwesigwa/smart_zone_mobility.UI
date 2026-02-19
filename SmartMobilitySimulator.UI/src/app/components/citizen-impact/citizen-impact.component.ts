import { Component, OnInit } from "@angular/core";
import { RTADataService } from "../../services/rta-data.service";
import { VehicleMovement, CitizenImpact } from "../../models/simulation.model";

@Component({
  selector: "app-citizen-impact",
  templateUrl: "./citizen-impact.component.html",
  styleUrls: ["./citizen-impact.component.css"],
})
export class CitizenImpactComponent implements OnInit {
  citizenImpact: CitizenImpact | null = null;
  selectedScenario: "current" | "pessimistic" | "optimistic" = "current";
  incomeBracket: string = "Medium";
  vehicleType: string = "Private";
  homeZone: string = "Dubai Marina";
  workZone: string = "Deira Business";

  scenarios: Array<{
    name: string;
    value: "current" | "pessimistic" | "optimistic";
  }> = [
    { name: "Current Proposal", value: "current" },
    { name: "Pessimistic (High Rates)", value: "pessimistic" },
    { name: "Optimistic (Fair Rates)", value: "optimistic" },
  ];

  incomeBrackets = ["Low", "Medium", "High"];
  vehicleTypes = ["Private", "Taxi", "Commercial"];

  isLoading = false;
  error: string | null = null;

  constructor(private rtaService: RTADataService) {}

  ngOnInit(): void {
    this.calculateImpact();
  }

  selectScenario(scenario: "current" | "pessimistic" | "optimistic"): void {
    this.selectedScenario = scenario;
    this.calculateImpact();
  }

  calculateImpact(): void {
    this.isLoading = true;
    this.error = null;

    // This would call the backend to calculate personalized impact
    // For now, we'll simulate it
    setTimeout(() => {
      this.citizenImpact = {
        vehicleOwner: {
          id: "USER123",
          incomeBracket: this.incomeBracket,
          homeZone: this.homeZone,
          workZone: this.workZone,
          vehicleType: this.vehicleType,
        },
        weeklyImpact: {
          estimatedCharges: this.calculateCharges(),
          chargePercentageOfIncome: this.calculatePercentage(),
          alternativeRoutes: this.getAlternativeRoutes(),
          timeSavings: this.getTimeSavings(),
        },
        affectedBy: this.getAffectedZones(),
      };
      this.isLoading = false;
    }, 500);
  }

  calculateCharges(): number {
    const baseRate = 20;
    const dailyTrips = 2;
    const workingDays = 5;
    const avgDuration = 45; // minutes

    let rate = baseRate;
    if (this.selectedScenario === "pessimistic") rate *= 1.5;
    if (this.selectedScenario === "optimistic") rate *= 0.7;

    if (this.vehicleType === "Taxi") return 0; // Exempt

    return (avgDuration / 60) * rate * dailyTrips * workingDays;
  }

  calculatePercentage(): number {
    const charges = this.calculateCharges();
    const monthlyIncome = this.getMonthlyIncome();
    return (charges / monthlyIncome) * 100;
  }

  getMonthlyIncome(): number {
    switch (this.incomeBracket) {
      case "Low":
        return 3000;
      case "Medium":
        return 8000;
      case "High":
        return 20000;
      default:
        return 8000;
    }
  }

  getAlternativeRoutes(): number {
    const routeOptions = this.selectedScenario === "optimistic" ? 3 : 1;
    return routeOptions;
  }

  getTimeSavings(): number {
    if (this.selectedScenario === "current") return 15;
    if (this.selectedScenario === "optimistic") return 25;
    return 5;
  }

  getAffectedZones(): string[] {
    return [this.homeZone, this.workZone];
  }

  getImpactMessage(): string {
    if (!this.citizenImpact) return "";

    const charges = this.citizenImpact.weeklyImpact.estimatedCharges;
    const percentage = this.citizenImpact.weeklyImpact.chargePercentageOfIncome;
    const timeSavings = this.citizenImpact.weeklyImpact.timeSavings;

    if (this.vehicleType === "Taxi") {
      return `As a Taxi driver, you're EXEMPT from congestion charges under the fairness policy.`;
    }

    if (percentage > 2) {
      return `⚠️ Your weekly charges (AED ${charges.toFixed(
        0
      )}) would be ${percentage.toFixed(
        1
      )}% of your income - considered high burden.`;
    }

    if (percentage > 1) {
      return `Your weekly charges would be AED ${charges.toFixed(
        0
      )} (${percentage.toFixed(
        1
      )}% of income). You could save ${timeSavings} minutes daily with route diversions.`;
    }

    return `Your weekly charges would be minimal at AED ${charges.toFixed(
      0
    )} (${percentage.toFixed(1)}% of income).`;
  }

  getFairnessRating(): "Fair" | "Concerning" | "Unfair" {
    const percentage =
      this.citizenImpact?.weeklyImpact.chargePercentageOfIncome || 0;
    if (percentage <= 1) return "Fair";
    if (percentage <= 2) return "Concerning";
    return "Unfair";
  }
}



