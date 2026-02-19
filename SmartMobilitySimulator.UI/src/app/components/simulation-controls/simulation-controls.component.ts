import { Component, OnInit } from "@angular/core";
import html2canvas from "html2canvas";
import { SimulationService } from "../../services/simulation.service";
import { ZoneService } from "../../services/zone.service";
import { Zone } from "../../models/zone.model";
import {
  SimulationRequest,
  SimulationResult,
} from "../../models/simulation.model";

@Component({
  selector: "app-simulation-controls",
  templateUrl: "./simulation-controls.component.html",
  styleUrls: ["./simulation-controls.component.css"],
})
export class SimulationControlsComponent implements OnInit {
  zones: Zone[] = [];
  selectedZoneId: string = "";
  simulationDate: string = new Date().toISOString().split("T")[0];
  simulationDateTime: Date = new Date();

  // Zone rules
  peakMultiplier: number = 1.5;
  diversionThreshold: number = 60;
  exemptionsEnabled: boolean = true;
  freeHours: number = 0;
  customChargePerHour: number | null = null;
  scenarioExemptions: string[] | null = null;

  isRunning = false;
  result: SimulationResult | null = null;
  economicImpact: any | null = null;
  isEconomicLoading = false;
  error: string | null = null;

  presentationMode = false;
  presentationStep = 0;
  presentationScript = [
    {
      title: "UAE Congestion Challenge",
      text: "UAE cities lose billions of dirhams each year to congestion and delays.",
      duration: 5500,
    },
    {
      title: "Smart Mobility Pricing",
      text: "Pricing targets the worst bottlenecks with fair exemptions and guardrails.",
      duration: 5500,
    },
    {
      title: "Pilot Scenario",
      text: "Mussafah pilot reduces congestion while generating sustainable revenue.",
      duration: 6000,
    },
    {
      title: "Economic Impact",
      text: "Productivity gains and a positive equity balance support wider adoption.",
      duration: 6000,
    },
    {
      title: "Nationwide Rollout",
      text: "Phased expansion delivers strong ROI and measurable mobility gains.",
      duration: 6000,
    },
  ];
  presentationScenarioQueue = [
    "Demo Scenario",
    "Solve School Run Chaos",
    "Weekend Marina Gridlock",
    "Sharjah-Dubai Commuter Solution",
  ];
  currentScenarioLabel = "";
  autoRunScenarios = true;
  isFullScreen = false;
  private presentationTimer: number | null = null;
  private scenarioTimer: number | null = null;

  scenarios = [
    {
      name: "Demo Scenario",
      zoneName: "Musaffah Industrial",
      freeHours: 2,
      chargePerHour: 30,
      exemptions: ["Commercial", "Emergency"],
      description: "Pilot congestion pricing in Mussafah industrial zone.",
    },
    {
      name: "Solve School Run Chaos",
      zoneName: "Academic City",
      freeHours: 1,
      chargePerHour: 20,
      exemptions: ["Public Transport", "Emergency"],
      description: "Target school commute peaks with mild pricing.",
    },
    {
      name: "Weekend Marina Gridlock",
      zoneName: "Dubai Marina",
      freeHours: 1,
      chargePerHour: 35,
      exemptions: ["Public Transport", "Emergency"],
      description: "Weekend surcharge to reduce marina congestion.",
    },
    {
      name: "Sharjah-Dubai Commuter Solution",
      zoneName: "Al Qusais",
      freeHours: 2,
      chargePerHour: 25,
      exemptions: ["Public Transport", "Commercial", "Emergency"],
      description: "Shift commuter demand with targeted pricing.",
    },
  ];

  constructor(
    private simulationService: SimulationService,
    private zoneService: ZoneService,
  ) {}

  ngOnInit(): void {
    this.loadZones();
  }

  get equityDisplay() {
    return this.normalizeEquity(this.result?.equityImpact);
  }

  get warnings(): string[] {
    if (!this.result) return [];
    const direct = Array.isArray(this.result.warnings)
      ? this.result.warnings
      : [];
    const fromResults = Array.isArray(this.result.results?.warnings)
      ? this.result.results.warnings
      : [];
    return [...new Set([...direct, ...fromResults])];
  }

  get assumptions(): string[] {
    if (!this.result) return [];
    return Array.isArray(this.result.results?.assumptions)
      ? this.result.results.assumptions
      : [
          "Average trip distance assumed at 10 km.",
          "CO₂ savings estimated per minute saved.",
          "Compliance uses a heuristic (not calibrated).",
          "Diversion rules are threshold-based, not a demand model.",
        ];
  }

  get confidenceLabel(): string {
    return this.getConfidenceLabel(this.result?.confidenceScore);
  }

  get dataProvenance(): string {
    if (!this.result) return "Not available";
    const warningText = this.warnings.join(" ").toLowerCase();
    if (warningText.includes("no vehicle movements"))
      return "Insufficient data (no movements for date).";
    if (warningText.includes("fallback"))
      return "Fallback baseline window used.";
    if (this.result.totalVehicles > 0)
      return "Replayed from stored movements (not real-time).";
    return "Not provided by backend.";
  }

  get movementCount(): number {
    return this.result?.totalVehicles ?? 0;
  }

  get baselinePolicy(): {
    baseline: any;
    policy: any;
    delta: any;
  } {
    if (!this.result) {
      return { baseline: null, policy: null, delta: null };
    }

    const baseline = this.result.results?.baseline ?? {
      averageSpeed: this.result.baselineAverageSpeed,
      congestionLevel: this.result.baselineCongestionLevel,
    };

    const policy = this.result.results?.policy ?? {
      averageSpeed: this.result.projectedAverageSpeed,
      congestionLevel: this.result.projectedCongestionLevel,
    };

    const delta = this.result.results?.delta ?? null;

    return { baseline, policy, delta };
  }

  loadZones(): void {
    this.zoneService.getAllZones().subscribe({
      next: (zones: Zone[]) => {
        this.zones = zones;
        if (zones.length > 0) {
          this.selectedZoneId = zones[0].id;
        }
      },
      error: (err: any) => {
        this.error = "Failed to load zones";
      },
    });
  }

  runSimulation(): void {
    if (!this.selectedZoneId) {
      this.error = "Please select a zone";
      return;
    }

    this.isRunning = true;
    this.error = null;

    const exemptions =
      this.scenarioExemptions ??
      (this.exemptionsEnabled
        ? ["Public Transport", "Commercial", "Emergency", "Diplomatic"]
        : []);

    const request: SimulationRequest = {
      zoneId: this.selectedZoneId,
      date: this.simulationDateTime,
      zoneRules: {
        peakMultiplier: this.peakMultiplier,
        diversionThreshold: this.diversionThreshold,
        exemptions,
        freeHours: this.freeHours,
        customChargePerHour: this.customChargePerHour ?? undefined,
      },
    };

    this.simulationService.runSimulation(request).subscribe({
      next: (result: SimulationResult) => {
        this.result = result;
        this.loadEconomicImpact(result.id);
        this.isRunning = false;
      },
      error: (err: any) => {
        this.error = "Failed to run simulation";
        this.isRunning = false;
        console.error(err);
      },
    });
  }

  getConfidenceLabel(score?: number): string {
    if (score === null || score === undefined) return "Not provided";
    if (score < 0.4) return "Low";
    if (score < 0.7) return "Medium";
    return "High";
  }

  formatDelta(value: number | null | undefined, unit: string = ""): string {
    if (value === null || value === undefined || Number.isNaN(value))
      return "—";
    const arrow = value > 0 ? "↑" : value < 0 ? "↓" : "→";
    const abs = Math.abs(value);
    return `${arrow} ${abs.toFixed(2)}${unit}`;
  }

  getWarningCategory(text: string): "Info" | "Caution" {
    const lower = text.toLowerCase();
    if (
      lower.includes("no vehicle movements") ||
      lower.includes("fallback") ||
      lower.includes("out of range") ||
      lower.includes("clamped")
    ) {
      return "Caution";
    }
    return "Info";
  }

  private normalizeEquity(equity: any): {
    lowIncomeBurden: number;
    highIncomeBurden: number;
    burdenRatio: number;
    isRegressive: boolean;
    note?: string;
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
        note: "Equity detail not provided; showing aggregate score only.",
      };
    }

    return {
      lowIncomeBurden: 0,
      highIncomeBurden: 0,
      burdenRatio: 0,
      isRegressive: false,
      note: "Equity detail not available.",
    };
  }

  exportResult(format: "pdf" | "csv" | "json"): void {
    if (!this.result) return;

    this.simulationService
      .exportSimulationReport(this.result.id, format)
      .subscribe({
        next: (blob: Blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `simulation-${this.result?.id}.${format}`;
          a.click();
          window.URL.revokeObjectURL(url);
        },
        error: (err: any) => {
          this.error = `Failed to export ${format.toUpperCase()}`;
        },
      });
  }

  downloadInvestorReport(): void {
    if (!this.result) return;

    this.simulationService.getInvestorReport(this.result.id).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `investor-report-${this.result?.id}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => {
        this.error = "Failed to download investor report";
      },
    });
  }

  private loadEconomicImpact(simulationId: string): void {
    this.isEconomicLoading = true;
    this.economicImpact = null;

    this.simulationService.getEconomicImpact(simulationId).subscribe({
      next: (impact: any) => {
        this.economicImpact = impact;
        this.isEconomicLoading = false;
      },
      error: () => {
        this.isEconomicLoading = false;
      },
    });
  }

  applyScenario(scenarioName: string, runNow: boolean = true): void {
    const scenario = this.scenarios.find((s) => s.name === scenarioName);
    if (!scenario) return;

    const zone = this.zones.find((z) => z.name === scenario.zoneName);
    if (zone) {
      this.selectedZoneId = zone.id;
    }

    this.freeHours = scenario.freeHours;
    this.customChargePerHour = scenario.chargePerHour;
    this.scenarioExemptions = scenario.exemptions;

    if (runNow) {
      this.runSimulation();
    }
  }

  startPresentation(): void {
    this.presentationMode = true;
    this.presentationStep = 0;
    this.currentScenarioLabel = this.presentationScenarioQueue[0] ?? "";
    this.applyScenario(this.currentScenarioLabel, true);
    this.startAutoPlay();
    this.runScenarioSequence();
  }

  stopPresentation(): void {
    this.presentationMode = false;
    this.presentationStep = 0;
    if (this.presentationTimer) {
      window.clearTimeout(this.presentationTimer);
      this.presentationTimer = null;
    }
    if (this.scenarioTimer) {
      window.clearTimeout(this.scenarioTimer);
      this.scenarioTimer = null;
    }
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    this.exitFullScreen();
  }

  startAutoPlay(): void {
    const playStep = (index: number) => {
      this.presentationStep = index;
      const entry = this.presentationScript[index];
      if (entry?.text) {
        this.speak(entry.text);
      }
      if (index < this.presentationScript.length - 1) {
        const duration = entry?.duration ?? 6000;
        this.presentationTimer = window.setTimeout(
          () => playStep(index + 1),
          duration,
        );
      }
    };

    playStep(0);
  }

  nextPresentationStep(): void {
    const next = Math.min(
      this.presentationStep + 1,
      this.presentationScript.length - 1,
    );
    this.presentationStep = next;
    const entry = this.presentationScript[next];
    if (entry?.text) {
      this.speak(entry.text);
    }
  }

  previousPresentationStep(): void {
    const prev = Math.max(this.presentationStep - 1, 0);
    this.presentationStep = prev;
    const entry = this.presentationScript[prev];
    if (entry?.text) {
      this.speak(entry.text);
    }
  }

  toggleScenarioAutoRun(): void {
    this.autoRunScenarios = !this.autoRunScenarios;
    if (this.autoRunScenarios) {
      this.runScenarioSequence();
    } else if (this.scenarioTimer) {
      window.clearTimeout(this.scenarioTimer);
      this.scenarioTimer = null;
    }
  }

  toggleFullScreen(): void {
    if (document.fullscreenElement) {
      this.exitFullScreen();
    } else {
      this.enterFullScreen();
    }
  }

  private enterFullScreen(): void {
    const root = document.getElementById("presentation-root");
    if (root?.requestFullscreen) {
      root.requestFullscreen();
      this.isFullScreen = true;
    }
  }

  private exitFullScreen(): void {
    if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen();
    }
    this.isFullScreen = false;
  }

  private runScenarioSequence(): void {
    if (!this.autoRunScenarios || this.presentationScenarioQueue.length === 0) {
      return;
    }

    const runScenarioAt = (index: number) => {
      if (!this.autoRunScenarios) return;

      const scenarioName = this.presentationScenarioQueue[index];
      this.currentScenarioLabel = scenarioName;
      this.applyScenario(scenarioName, true);

      if (index < this.presentationScenarioQueue.length - 1) {
        this.scenarioTimer = window.setTimeout(
          () => runScenarioAt(index + 1),
          12000,
        );
      }
    };

    runScenarioAt(0);
  }

  exportPresentationVideo(): void {
    const target = document.getElementById("presentation-root");
    if (!target) return;

    html2canvas(target).then((canvas) => {
      const stream = canvas.captureStream(30);
      const recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunks.push(event.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "presentation.webm";
        a.click();
        URL.revokeObjectURL(url);
      };

      recorder.start();
      window.setTimeout(() => recorder.stop(), 5000);
    });
  }

  private speak(text: string): void {
    if (!window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }
}



