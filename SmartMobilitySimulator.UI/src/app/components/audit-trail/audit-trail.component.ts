import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import {
  ScenarioService,
  AuditLogEntry,
  SavedScenario,
} from "../../services/scenario.service";

@Component({
  selector: "app-audit-trail",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="audit-container">
      <div class="audit-header">
        <span class="header-icon">📋</span>
        <h1>Audit Trail & Saved Scenarios</h1>
        <p>View history of all operations and manage saved scenarios</p>
      </div>

      <div class="audit-content">
        <!-- Tabs -->
        <div class="tabs">
          <button
            class="tab-btn"
            [class.active]="activeTab === 'audit'"
            (click)="activeTab = 'audit'"
          >
            📋 Audit Log
          </button>
          <button
            class="tab-btn"
            [class.active]="activeTab === 'scenarios'"
            (click)="activeTab = 'scenarios'"
          >
            💾 Saved Scenarios
          </button>
          <button
            class="tab-btn"
            [class.active]="activeTab === 'export'"
            (click)="activeTab = 'export'"
          >
            📤 Export/Import
          </button>
        </div>

        <!-- Audit Log Tab -->
        <div *ngIf="activeTab === 'audit'" class="tab-content">
          <div class="tab-header">
            <h3>Activity Log</h3>
            <div class="tab-actions">
              <select [(ngModel)]="filterAction" (change)="applyFilter()">
                <option value="">All Actions</option>
                <option value="simulation_run">Simulation Runs</option>
                <option value="scenario_saved">Scenario Saved</option>
                <option value="scenario_loaded">Scenario Loaded</option>
                <option value="scenario_deleted">Scenario Deleted</option>
                <option value="export_generated">Export Generated</option>
              </select>
              <button class="btn-secondary" (click)="clearAuditLog()">
                Clear Log
              </button>
            </div>
          </div>

          <div class="audit-list">
            <div class="audit-item" *ngFor="let entry of filteredAuditLog">
              <div class="audit-icon" [class]="getActionClass(entry.action)">
                {{ getActionIcon(entry.action) }}
              </div>
              <div class="audit-info">
                <div class="audit-description">{{ entry.description }}</div>
                <div class="audit-details">{{ entry.details }}</div>
              </div>
              <div class="audit-time">
                <span class="time">{{ formatTime(entry.timestamp) }}</span>
                <span class="date">{{ formatDate(entry.timestamp) }}</span>
              </div>
            </div>

            <div class="empty-state" *ngIf="filteredAuditLog.length === 0">
              <span class="empty-icon">📭</span>
              <p>No audit entries found</p>
            </div>
          </div>
        </div>

        <!-- Saved Scenarios Tab -->
        <div *ngIf="activeTab === 'scenarios'" class="tab-content">
          <div class="tab-header">
            <h3>Saved Scenarios</h3>
            <button class="btn-primary" (click)="showSaveModal = true">
              + Save Current Scenario
            </button>
          </div>

          <div class="scenarios-grid">
            <div class="scenario-card" *ngFor="let scenario of scenarios">
              <div class="scenario-header">
                <span class="scenario-icon">📊</span>
                <div class="scenario-title">
                  <h4>{{ scenario.name }}</h4>
                  <span class="scenario-zone">{{ scenario.zoneName }}</span>
                </div>
              </div>
              <p class="scenario-description">{{ scenario.description }}</p>

              <div class="scenario-config">
                <div class="config-item">
                  <span class="config-label">Rate</span>
                  <span class="config-value"
                    >AED {{ scenario.config.hourlyRate }}/hr</span
                  >
                </div>
                <div class="config-item">
                  <span class="config-label">Free Hours</span>
                  <span class="config-value"
                    >{{ scenario.config.freeHours }} hrs</span
                  >
                </div>
                <div class="config-item">
                  <span class="config-label">Peak</span>
                  <span class="config-value"
                    >{{ scenario.config.peakMultiplier }}x</span
                  >
                </div>
              </div>

              <div class="scenario-results" *ngIf="scenario.results">
                <div class="result-item">
                  <span class="result-value"
                    >{{ scenario.results.congestionReduction }}%</span
                  >
                  <span class="result-label">Congestion</span>
                </div>
                <div class="result-item">
                  <span class="result-value"
                    >AED {{ scenario.results.estimatedRevenue | number }}</span
                  >
                  <span class="result-label">Revenue</span>
                </div>
              </div>

              <div class="scenario-actions">
                <button
                  class="action-btn load"
                  (click)="loadScenario(scenario.id)"
                >
                  📂 Load
                </button>
                <button
                  class="action-btn duplicate"
                  (click)="duplicateScenario(scenario)"
                >
                  📋 Duplicate
                </button>
                <button
                  class="action-btn delete"
                  (click)="deleteScenario(scenario.id)"
                >
                  🗑️
                </button>
              </div>

              <div class="scenario-meta">
                Created: {{ formatDate(scenario.createdAt) }}
              </div>
            </div>

            <div class="empty-state" *ngIf="scenarios.length === 0">
              <span class="empty-icon">📭</span>
              <p>No saved scenarios yet</p>
              <button class="btn-primary" (click)="showSaveModal = true">
                Save Your First Scenario
              </button>
            </div>
          </div>
        </div>

        <!-- Export/Import Tab -->
        <div *ngIf="activeTab === 'export'" class="tab-content">
          <div class="tab-header">
            <h3>Export & Import</h3>
          </div>

          <div class="export-section">
            <div class="export-card">
              <span class="export-icon">📤</span>
              <h4>Export Data</h4>
              <p>Download all scenarios and audit log</p>
              <div class="export-buttons">
                <button class="export-btn" (click)="exportScenarios()">
                  💾 Export Scenarios (JSON)
                </button>
                <button class="export-btn" (click)="exportAuditLog()">
                  📋 Export Audit Log
                </button>
                <button class="export-btn" (click)="exportAll()">
                  📦 Export All
                </button>
              </div>
            </div>

            <div class="import-card">
              <span class="export-icon">📥</span>
              <h4>Import Data</h4>
              <p>Import scenarios from a JSON file</p>
              <div class="import-area">
                <input
                  type="file"
                  (change)="onFileSelected($event)"
                  accept=".json"
                  #fileInput
                />
                <button class="import-btn" (click)="fileInput.click()">
                  📂 Select File
                </button>
                <span class="file-name" *ngIf="selectedFile">{{
                  selectedFile.name
                }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Danger Zone -->
        <div class="danger-zone">
          <h4>⚠️ Danger Zone</h4>
          <p>
            This will permanently delete all saved data including scenarios and
            audit logs.
          </p>
          <button class="btn-danger" (click)="clearAllData()">
            🗑️ Clear All Data
          </button>
        </div>
      </div>

      <!-- Save Scenario Modal -->
      <div
        class="modal-overlay"
        *ngIf="showSaveModal"
        (click)="showSaveModal = false"
      >
        <div class="modal" (click)="$event.stopPropagation()">
          <h3>Save Current Scenario</h3>
          <div class="form-group">
            <label>Scenario Name</label>
            <input
              type="text"
              [(ngModel)]="newScenario.name"
              placeholder="My Custom Scenario"
            />
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea
              [(ngModel)]="newScenario.description"
              placeholder="Describe this scenario..."
            ></textarea>
          </div>
          <div class="form-group">
            <label>Zone</label>
            <select [(ngModel)]="newScenario.zoneId">
              <option value="">Select a zone</option>
              <option value="dubai-marina">Dubai Marina</option>
              <option value="business-bay">Business Bay</option>
              <option value="downtown">Downtown Dubai</option>
              <option value="mussafah">Mussafah</option>
            </select>
          </div>
          <div class="modal-actions">
            <button class="btn-secondary" (click)="showSaveModal = false">
              Cancel
            </button>
            <button class="btn-primary" (click)="saveNewScenario()">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .audit-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
      }

      .audit-header {
        text-align: center;
        margin-bottom: 30px;
      }

      .header-icon {
        font-size: 48px;
        display: block;
        margin-bottom: 16px;
      }

      .audit-header h1 {
        margin: 0 0 8px;
        color: #1e3a5f;
      }

      .audit-header p {
        margin: 0;
        color: #64748b;
      }

      .audit-content {
        background: white;
        border-radius: 16px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
        overflow: hidden;
      }

      .tabs {
        display: flex;
        background: #f8fafc;
        border-bottom: 1px solid #e2e8f0;
      }

      .tab-btn {
        flex: 1;
        padding: 16px;
        background: none;
        border: none;
        cursor: pointer;
        font-size: 14px;
        font-weight: 600;
        color: #64748b;
        transition: all 0.2s;
      }

      .tab-btn.active {
        background: white;
        color: #3b82f6;
        border-bottom: 2px solid #3b82f6;
      }

      .tab-content {
        padding: 24px;
      }

      .tab-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
      }

      .tab-header h3 {
        margin: 0;
        color: #1e3a5f;
      }

      .tab-actions {
        display: flex;
        gap: 12px;
      }

      .tab-actions select {
        padding: 8px 12px;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        font-size: 14px;
      }

      .btn-primary {
        padding: 10px 20px;
        background: #3b82f6;
        color: white;
        border: none;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
      }

      .btn-secondary {
        padding: 10px 20px;
        background: #f1f5f9;
        color: #475569;
        border: none;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
      }

      /* Audit List */
      .audit-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .audit-item {
        display: flex;
        align-items: center;
        padding: 16px;
        background: #f8fafc;
        border-radius: 12px;
        gap: 16px;
      }

      .audit-icon {
        width: 48px;
        height: 48px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        background: #e2e8f0;
      }

      .audit-icon.simulation {
        background: #dbeafe;
      }
      .audit-icon.save {
        background: #d1fae5;
      }
      .audit-icon.load {
        background: #fef3c7;
      }
      .audit-icon.delete {
        background: #fee2e2;
      }
      .audit-icon.export {
        background: #e0e7ff;
      }

      .audit-info {
        flex: 1;
      }

      .audit-description {
        font-weight: 600;
        color: #1e293b;
        margin-bottom: 4px;
      }

      .audit-details {
        font-size: 13px;
        color: #64748b;
      }

      .audit-time {
        text-align: right;
      }

      .audit-time .time {
        display: block;
        font-weight: 600;
        color: #1e293b;
      }

      .audit-time .date {
        font-size: 12px;
        color: #64748b;
      }

      /* Scenarios Grid */
      .scenarios-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
        gap: 20px;
      }

      .scenario-card {
        background: #f8fafc;
        border-radius: 16px;
        padding: 20px;
      }

      .scenario-header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 12px;
      }

      .scenario-icon {
        font-size: 32px;
      }

      .scenario-title h4 {
        margin: 0;
        color: #1e3a5f;
      }

      .scenario-zone {
        font-size: 13px;
        color: #64748b;
      }

      .scenario-description {
        margin: 0 0 16px;
        font-size: 14px;
        color: #64748b;
      }

      .scenario-config {
        display: flex;
        gap: 12px;
        margin-bottom: 16px;
        padding-bottom: 16px;
        border-bottom: 1px solid #e2e8f0;
      }

      .config-item {
        flex: 1;
        text-align: center;
      }

      .config-label {
        display: block;
        font-size: 11px;
        color: #64748b;
        margin-bottom: 4px;
      }

      .config-value {
        font-weight: 600;
        color: #1e293b;
        font-size: 13px;
      }

      .scenario-results {
        display: flex;
        gap: 12px;
        margin-bottom: 16px;
      }

      .result-item {
        flex: 1;
        background: white;
        padding: 12px;
        border-radius: 8px;
        text-align: center;
      }

      .result-value {
        display: block;
        font-weight: 700;
        color: #10b981;
      }

      .result-label {
        font-size: 11px;
        color: #64748b;
      }

      .scenario-actions {
        display: flex;
        gap: 8px;
        margin-bottom: 12px;
      }

      .action-btn {
        flex: 1;
        padding: 8px;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 12px;
        font-weight: 600;
      }

      .action-btn.load {
        background: #dbeafe;
        color: #1d4ed8;
      }
      .action-btn.duplicate {
        background: #fef3c7;
        color: #b45309;
      }
      .action-btn.delete {
        background: #fee2e2;
        color: #dc2626;
      }

      .scenario-meta {
        font-size: 11px;
        color: #94a3b8;
      }

      /* Export Section */
      .export-section {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 20px;
      }

      .export-card,
      .import-card {
        background: #f8fafc;
        border-radius: 16px;
        padding: 24px;
        text-align: center;
      }

      .export-icon {
        font-size: 48px;
        display: block;
        margin-bottom: 16px;
      }

      .export-card h4,
      .import-card h4 {
        margin: 0 0 8px;
        color: #1e3a5f;
      }

      .export-card p,
      .import-card p {
        margin: 0 0 20px;
        color: #64748b;
      }

      .export-buttons {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .export-btn,
      .import-btn {
        padding: 12px;
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 600;
        color: #1e293b;
      }

      .export-btn:hover,
      .import-btn:hover {
        background: #f1f5f9;
      }

      .import-area {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .import-area input[type="file"] {
        display: none;
      }

      .file-name {
        font-size: 13px;
        color: #64748b;
      }

      /* Empty State */
      .empty-state {
        text-align: center;
        padding: 60px 20px;
        color: #64748b;
      }

      .empty-icon {
        font-size: 48px;
        display: block;
        margin-bottom: 16px;
      }

      /* Modal */
      .modal-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
      }

      .modal {
        background: white;
        border-radius: 16px;
        padding: 24px;
        width: 400px;
        max-width: 90%;
      }

      .modal h3 {
        margin: 0 0 20px;
        color: #1e3a5f;
      }

      .form-group {
        margin-bottom: 16px;
      }

      .form-group label {
        display: block;
        font-size: 13px;
        color: #64748b;
        margin-bottom: 6px;
      }

      .form-group input,
      .form-group textarea,
      .form-group select {
        width: 100%;
        padding: 10px;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        font-size: 14px;
      }

      .modal-actions {
        display: flex;
        gap: 12px;
        justify-content: flex-end;
        margin-top: 20px;
      }

      /* Danger Zone */
      .danger-zone {
        margin-top: 30px;
        padding: 20px;
        background: #fef2f2;
        border: 2px solid #fecaca;
        border-radius: 12px;
        text-align: center;
      }

      .danger-zone h4 {
        margin: 0 0 8px;
        color: #dc2626;
      }

      .danger-zone p {
        margin: 0 0 16px;
        color: #64748b;
        font-size: 14px;
      }

      .btn-danger {
        padding: 12px 24px;
        background: #dc2626;
        color: white;
        border: none;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
      }

      .btn-danger:hover {
        background: #b91c1c;
      }
    `,
  ],
})
export class AuditTrailComponent implements OnInit {
  activeTab = "audit";
  filterAction = "";
  scenarios: SavedScenario[] = [];
  auditLog: AuditLogEntry[] = [];
  filteredAuditLog: AuditLogEntry[] = [];
  showSaveModal = false;
  selectedFile: File | null = null;

  newScenario = {
    name: "",
    description: "",
    zoneId: "",
    zoneName: "",
  };

  constructor(private scenarioService: ScenarioService) {}

  ngOnInit(): void {
    this.scenarioService.scenarios$.subscribe((scenarios) => {
      this.scenarios = scenarios;
    });

    this.scenarioService.auditLog$.subscribe((log) => {
      this.auditLog = log;
      this.applyFilter();
    });
  }

  getActionIcon(action: string): string {
    const icons: Record<string, string> = {
      simulation_run: "🧪",
      scenario_saved: "💾",
      scenario_loaded: "📂",
      scenario_deleted: "🗑️",
      export_generated: "📤",
      zone_created: "🗺️",
      zone_updated: "✏️",
      settings_changed: "⚙️",
    };
    return icons[action] || "📋";
  }

  getActionClass(action: string): string {
    const classes: Record<string, string> = {
      simulation_run: "simulation",
      scenario_saved: "save",
      scenario_loaded: "load",
      scenario_deleted: "delete",
      export_generated: "export",
    };
    return classes[action] || "";
  }

  formatTime(date: Date): string {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  applyFilter(): void {
    if (this.filterAction) {
      this.filteredAuditLog = this.auditLog.filter(
        (entry) => entry.action === this.filterAction,
      );
    } else {
      this.filteredAuditLog = [...this.auditLog];
    }
  }

  clearAuditLog(): void {
    if (confirm("Are you sure you want to clear the audit log?")) {
      this.scenarioService.clearAuditLog();
    }
  }

  loadScenario(id: string): void {
    const scenario = this.scenarioService.loadScenario(id);
    if (scenario) {
      alert(`Scenario "${scenario.name}" loaded!`);
    }
  }

  duplicateScenario(scenario: SavedScenario): void {
    this.scenarioService.saveScenario({
      name: `${scenario.name} (Copy)`,
      description: scenario.description,
      zoneId: scenario.zoneId,
      zoneName: scenario.zoneName,
      config: { ...scenario.config },
      results: scenario.results ? { ...scenario.results } : undefined,
    });
  }

  deleteScenario(id: string): void {
    if (confirm("Are you sure you want to delete this scenario?")) {
      this.scenarioService.deleteScenario(id);
    }
  }

  saveNewScenario(): void {
    if (!this.newScenario.name || !this.newScenario.zoneId) {
      alert("Please fill in required fields");
      return;
    }

    const zoneNames: Record<string, string> = {
      "dubai-marina": "Dubai Marina",
      "business-bay": "Business Bay",
      downtown: "Downtown Dubai",
      mussafah: "Mussafah",
    };

    this.scenarioService.saveScenario({
      name: this.newScenario.name,
      description: this.newScenario.description,
      zoneId: this.newScenario.zoneId,
      zoneName: zoneNames[this.newScenario.zoneId] || "Unknown",
      config: {
        hourlyRate: 25,
        freeHours: 1,
        peakMultiplier: 1.5,
        exemptPublicTransport: true,
        exemptCommercial: true,
        exemptEmergency: true,
      },
    });

    this.showSaveModal = false;
    this.newScenario = { name: "", description: "", zoneId: "", zoneName: "" };
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
    }
  }

  exportScenarios(): void {
    const data = this.scenarioService.exportScenarios();
    this.downloadFile(data, "scenarios.json", "application/json");
  }

  exportAuditLog(): void {
    const data = JSON.stringify(this.auditLog, null, 2);
    this.downloadFile(data, "audit-log.json", "application/json");
  }

  exportAll(): void {
    const data = JSON.stringify(
      {
        scenarios: this.scenarios,
        auditLog: this.auditLog,
        exportedAt: new Date().toISOString(),
      },
      null,
      2,
    );
    this.downloadFile(data, "smartmobility-export.json", "application/json");
  }

  private downloadFile(data: string, filename: string, type: string): void {
    const blob = new Blob([data], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  clearAllData(): void {
    if (
      confirm(
        "⚠️ WARNING: This will delete ALL saved scenarios and clear the audit log. This cannot be undone!\n\nAre you sure you want to continue?",
      )
    ) {
      localStorage.clear();
      window.location.reload();
    }
  }
}



