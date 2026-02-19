import { Component, OnDestroy } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import * as JSZip from "jszip";
import { DemoModeService } from "../../services/demo-mode.service";
import { SimulationService } from "../../services/simulation.service";
import { BusinessCaseService } from "../../services/business-case.service";
import { DemoScenarioDto } from "../../models/demo-scenario.model";
import { getApiBase } from "../../services/api-base";
import {
  SimulationRequest,
  SimulationResult,
} from "../../models/simulation.model";
import { firstValueFrom } from "rxjs";

interface DemoStep {
  title: string;
  text: string;
  notes: string;
  durationMs: number;
}

@Component({
  selector: "app-demo-mode",
  templateUrl: "./demo-mode.component.html",
  styleUrls: ["./demo-mode.component.css"],
})
export class DemoModeComponent implements OnDestroy {
  agencyOptions = [
    "Abu Dhabi ITC",
    "Dubai RTA",
    "Smart Dubai",
    "Ministry of Energy & Infrastructure",
    "Custom",
  ];

  selectedAgency = "Abu Dhabi ITC";
  customAgency = "";
  logoDataUrl: string | null = null;

  isLoading = false;
  error: string | null = null;

  scenario: DemoScenarioDto | null = null;
  simulation: SimulationResult | null = null;

  demoSteps: DemoStep[] = [];
  activeStepIndex = 0;
  showNotes = true;
  isPresenting = false;
  private stepTimer: number | null = null;

  constructor(
    private demoService: DemoModeService,
    private simulationService: SimulationService,
    private businessCaseService: BusinessCaseService,
    private http: HttpClient,
  ) {}

  ngOnDestroy(): void {
    this.clearTimer();
  }

  get agencyName(): string {
    return this.selectedAgency === "Custom" && this.customAgency
      ? this.customAgency
      : this.selectedAgency;
  }

  launchDemo(key: "mussafah" | "marina" | "school"): void {
    this.isLoading = true;
    this.error = null;
    this.simulation = null;

    this.demoService.getScenario(key).subscribe({
      next: (scenario) => {
        this.scenario = scenario;
        this.demoSteps = this.buildSteps(scenario);
        this.activeStepIndex = 0;
        this.startStepTimer();
        this.runSimulation(scenario);
      },
      error: () => {
        this.error = "Failed to load demo scenario";
        this.isLoading = false;
      },
    });
  }

  runSimulation(scenario: DemoScenarioDto): void {
    const request: SimulationRequest = {
      zoneId: scenario.zoneId,
      date: new Date(),
      zoneRules: {
        freeHours: scenario.rules.freeHours,
        customChargePerHour: scenario.rules.chargePerHour,
        exemptions: scenario.rules.exemptions,
        diversionThreshold: 60,
        peakMultiplier: 1.4,
      },
    };

    this.simulationService.runSimulation(request).subscribe({
      next: (result) => {
        this.simulation = result;
        this.startPresentation();
        this.isLoading = false;
      },
      error: () => {
        this.error = "Simulation failed to run";
        this.isLoading = false;
      },
    });
  }

  startPresentation(): void {
    this.isPresenting = true;
    this.activeStepIndex = 0;
    this.startStepTimer();
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => null);
    }
  }

  stopPresentation(): void {
    this.isPresenting = false;
    this.clearTimer();
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => null);
    }
  }

  nextStep(): void {
    if (this.activeStepIndex < this.demoSteps.length - 1) {
      this.activeStepIndex += 1;
      this.startStepTimer();
    }
  }

  prevStep(): void {
    if (this.activeStepIndex > 0) {
      this.activeStepIndex -= 1;
      this.startStepTimer();
    }
  }

  toggleNotes(): void {
    this.showNotes = !this.showNotes;
  }

  onLogoUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      this.logoDataUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  async downloadPackage(): Promise<void> {
    if (!this.simulation || !this.scenario) return;

    try {
      const zip = new JSZip();
      const agencyName = this.agencyName;

      const investorReport = await firstValueFrom(
        this.simulationService.getInvestorReport(this.simulation.id),
      );

      if (investorReport) {
        zip.file("demo-report.pdf", investorReport);
      }

      const pitchDeck = await firstValueFrom(
        this.http.get(
          `${getApiBase()}/api/pitch-deck/${this.simulation.id}?agency=${encodeURIComponent(agencyName)}&format=pptx`,
          { responseType: "blob" },
        ),
      );

      if (pitchDeck) {
        zip.file("pitch-deck.pptx", pitchDeck);
      }

      const businessCase = await firstValueFrom(
        this.businessCaseService.getBusinessCase(this.simulation.id, 5),
      );

      if (businessCase) {
        zip.file("business-case.json", JSON.stringify(businessCase, null, 2));
      }

      const summary = {
        agency: agencyName,
        scenario: this.scenario.name,
        expectedResults: this.scenario.expectedResults,
        rules: this.scenario.rules,
        generatedAt: new Date().toISOString(),
      };
      zip.file("demo-summary.json", JSON.stringify(summary, null, 2));
      zip.file("agency.txt", `Agency: ${agencyName}`);

      if (this.logoDataUrl) {
        const logoBlob = this.dataUrlToBlob(this.logoDataUrl);
        zip.file("agency-logo.png", logoBlob);
      }

      const content = await zip.generateAsync({ type: "blob" });
      const url = window.URL.createObjectURL(content);
      const link = document.createElement("a");
      link.href = url;
      link.download = `demo-package-${this.simulation.id}.zip`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      this.error = "Failed to generate demo package";
    }
  }

  private buildSteps(scenario: DemoScenarioDto): DemoStep[] {
    const lines = scenario.demoScript
      .split("\n")
      .map((line) => line.replace(/^\d+\.\s*/, "").trim())
      .filter(Boolean);

    const notesMap: Record<string, string[]> = {
      mussafah: [
        "Highlight industrial logistics delays and economic cost.",
        "Show proposed boundary aligning with freight routes.",
        "Explain free hours to protect supply chains.",
        "Call out emergency/commercial exemptions.",
        "Narrate live simulation execution.",
        "Summarize traffic relief and revenue impact.",
      ],
      marina: [
        "Show peak weekend tourism pain points.",
        "Connect congestion to visitor sentiment.",
        "Introduce weekend pricing lever.",
        "Mention exemptions for residents/hotel guests.",
        "Explain reinvestment into tourism services.",
      ],
      school: [
        "Use safety framing to build urgency.",
        "Emphasize cluster coverage for consistency.",
        "Clarify parent permit free window.",
        "Explain deterrence for non-permit vehicles.",
        "Show projected safety and flow gains.",
      ],
    };

    const key = scenario.name.toLowerCase().includes("mussafah")
      ? "mussafah"
      : scenario.name.toLowerCase().includes("marina")
        ? "marina"
        : "school";

    return [
      ...lines.map((line, index) => ({
        title: `Step ${index + 1}`,
        text: line,
        notes: notesMap[key][index] ?? "",
        durationMs: 6000,
      })),
      {
        title: "Results",
        text: scenario.expectedResults,
        notes: "Compare expected vs actual metrics with the audience.",
        durationMs: 8000,
      },
    ];
  }

  private startStepTimer(): void {
    this.clearTimer();
    const step = this.demoSteps[this.activeStepIndex];
    if (!step) return;
    this.stepTimer = window.setTimeout(() => {
      if (this.activeStepIndex < this.demoSteps.length - 1) {
        this.activeStepIndex += 1;
        this.startStepTimer();
      }
    }, step.durationMs);
  }

  private clearTimer(): void {
    if (this.stepTimer) {
      window.clearTimeout(this.stepTimer);
      this.stepTimer = null;
    }
  }

  private dataUrlToBlob(dataUrl: string): Blob {
    const [header, data] = dataUrl.split(",");
    const mime = header.match(/:(.*?);/)?.[1] ?? "image/png";
    const binary = atob(data);
    const array = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) {
      array[i] = binary.charCodeAt(i);
    }
    return new Blob([array], { type: mime });
  }
}



