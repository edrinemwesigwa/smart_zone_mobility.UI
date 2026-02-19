import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

export interface SavedScenario {
  id: string;
  name: string;
  description: string;
  zoneId: string;
  zoneName: string;
  config: {
    hourlyRate: number;
    freeHours: number;
    peakMultiplier: number;
    exemptPublicTransport: boolean;
    exemptCommercial: boolean;
    exemptEmergency: boolean;
  };
  results?: {
    congestionReduction: number;
    estimatedRevenue: number;
    vehiclesDiverted: number;
    environmentalImpact: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface AuditLogEntry {
  id: string;
  action:
    | "simulation_run"
    | "scenario_saved"
    | "scenario_loaded"
    | "scenario_deleted"
    | "export_generated"
    | "zone_created"
    | "zone_updated"
    | "settings_changed";
  description: string;
  details: string;
  timestamp: Date;
  userId?: string;
}

@Injectable({
  providedIn: "root",
})
export class ScenarioService {
  private readonly STORAGE_KEY = "smartmobility_scenarios";
  private readonly AUDIT_KEY = "smartmobility_audit_log";

  private scenariosSubject = new BehaviorSubject<SavedScenario[]>([]);
  private auditLogSubject = new BehaviorSubject<AuditLogEntry[]>([]);

  scenarios$ = this.scenariosSubject.asObservable();
  auditLog$ = this.auditLogSubject.asObservable();

  constructor() {
    this.loadScenarios();
    this.loadAuditLog();
  }

  // Scenario Management
  saveScenario(
    scenario: Omit<SavedScenario, "id" | "createdAt" | "updatedAt">,
  ): SavedScenario {
    const scenarios = this.scenariosSubject.getValue();
    const newScenario: SavedScenario = {
      ...scenario,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    scenarios.push(newScenario);
    this.scenariosSubject.next(scenarios);
    this.saveToStorage();

    this.logAction(
      "scenario_saved",
      `Saved scenario: ${scenario.name}`,
      `Zone: ${scenario.zoneName}`,
    );

    return newScenario;
  }

  updateScenario(
    id: string,
    updates: Partial<SavedScenario>,
  ): SavedScenario | null {
    const scenarios = this.scenariosSubject.getValue();
    const index = scenarios.findIndex((s) => s.id === id);

    if (index === -1) return null;

    scenarios[index] = {
      ...scenarios[index],
      ...updates,
      updatedAt: new Date(),
    };

    this.scenariosSubject.next([...scenarios]);
    this.saveToStorage();

    this.logAction(
      "scenario_saved",
      `Updated scenario: ${scenarios[index].name}`,
      `Zone: ${scenarios[index].zoneName}`,
    );

    return scenarios[index];
  }

  deleteScenario(id: string): boolean {
    const scenarios = this.scenariosSubject.getValue();
    const index = scenarios.findIndex((s) => s.id === id);

    if (index === -1) return false;

    const deleted = scenarios[index];
    scenarios.splice(index, 1);
    this.scenariosSubject.next([...scenarios]);
    this.saveToStorage();

    this.logAction(
      "scenario_deleted",
      `Deleted scenario: ${deleted.name}`,
      `Zone: ${deleted.zoneName}`,
    );

    return true;
  }

  loadScenario(id: string): SavedScenario | null {
    const scenarios = this.scenariosSubject.getValue();
    const scenario = scenarios.find((s) => s.id === id);

    if (scenario) {
      this.logAction(
        "scenario_loaded",
        `Loaded scenario: ${scenario.name}`,
        `Zone: ${scenario.zoneName}`,
      );
    }

    return scenario || null;
  }

  getAllScenarios(): SavedScenario[] {
    return this.scenariosSubject.getValue();
  }

  // Audit Log
  logAction(
    action: AuditLogEntry["action"],
    description: string,
    details: string,
  ): void {
    const log = this.auditLogSubject.getValue();
    const newEntry: AuditLogEntry = {
      id: this.generateId(),
      action,
      description,
      details,
      timestamp: new Date(),
    };

    log.unshift(newEntry);

    // Keep only last 100 entries
    if (log.length > 100) {
      log.pop();
    }

    this.auditLogSubject.next([...log]);
    this.saveAuditLog();
  }

  getAuditLog(): AuditLogEntry[] {
    return this.auditLogSubject.getValue();
  }

  getAuditLogByAction(action: AuditLogEntry["action"]): AuditLogEntry[] {
    return this.auditLogSubject
      .getValue()
      .filter((entry) => entry.action === action);
  }

  clearAuditLog(): void {
    this.auditLogSubject.next([]);
    this.saveAuditLog();
  }

  // Export/Import
  exportScenarios(): string {
    const scenarios = this.scenariosSubject.getValue();
    return JSON.stringify(scenarios, null, 2);
  }

  importScenarios(json: string): boolean {
    try {
      const scenarios = JSON.parse(json) as SavedScenario[];
      if (Array.isArray(scenarios)) {
        this.scenariosSubject.next(scenarios);
        this.saveToStorage();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  // Private methods
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private loadScenarios(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const scenarios = JSON.parse(stored) as SavedScenario[];
        this.scenariosSubject.next(scenarios);
      }
    } catch {
      this.scenariosSubject.next([]);
    }
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(
        this.STORAGE_KEY,
        JSON.stringify(this.scenariosSubject.getValue()),
      );
    } catch {
      console.error("Failed to save scenarios to localStorage");
    }
  }

  private loadAuditLog(): void {
    try {
      const stored = localStorage.getItem(this.AUDIT_KEY);
      if (stored) {
        const log = JSON.parse(stored) as AuditLogEntry[];
        this.auditLogSubject.next(log);
      }
    } catch {
      this.auditLogSubject.next([]);
    }
  }

  private saveAuditLog(): void {
    try {
      localStorage.setItem(
        this.AUDIT_KEY,
        JSON.stringify(this.auditLogSubject.getValue()),
      );
    } catch {
      console.error("Failed to save audit log to localStorage");
    }
  }
}



