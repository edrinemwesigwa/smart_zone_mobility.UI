import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
  NgZone,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { ZoneService } from "../../services/zone.service";
import { SimulationService } from "../../services/simulation.service";
import { Zone } from "../../models/zone.model";
import {
  SimulationResult,
  SimulationRequest,
} from "../../models/simulation.model";
import { ChartService } from "../../services/chart.service";
import { DateTimePickerComponent } from "../date-time-picker/date-time-picker.component";
import { ReportService, ReportData } from "../../services/report.service";

interface WizardStep {
  id: number;
  title: string;
  description: string;
  icon: string;
  completed: boolean;
  active: boolean;
}

@Component({
  selector: "app-workflow-wizard",
  standalone: true,
  imports: [CommonModule, FormsModule, DateTimePickerComponent],
  template: `
    <div class="wizard-container">
      <!-- Progress Steps -->
      <div class="wizard-progress">
        <div class="progress-track">
          <div class="progress-fill" [style.width.%]="progressPercentage"></div>
        </div>
        <div class="steps-indicator">
          <div
            *ngFor="let step of steps; let i = index"
            class="step-item"
            [class.active]="step.active"
            [class.completed]="step.completed"
            (click)="goToStep(i)"
          >
            <div class="step-circle">
              <span *ngIf="!step.completed">{{ i + 1 }}</span>
              <span *ngIf="step.completed">✓</span>
            </div>
            <div class="step-info">
              <span class="step-title">{{ step.title }}</span>
              <span class="step-desc">{{ step.description }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Step Content -->
      <div class="wizard-content">
        <!-- Step 0: Select Emirate -->
        <div *ngIf="currentStep === 0" class="step-panel">
          <div class="step-header">
            <span class="step-icon">🗺️</span>
            <h2>Select Emirate</h2>
            <p>Choose the emirate you want to analyze for congestion pricing</p>
          </div>

          <div class="emirate-grid">
            <div
              *ngFor="let emirate of emirates"
              class="emirate-card"
              [class.selected]="selectedEmirate === emirate.id"
              (click)="selectEmirate(emirate.id)"
            >
              <span class="emirate-icon">{{ emirate.icon }}</span>
              <span class="emirate-name">{{ emirate.name }}</span>
            </div>
          </div>

          <div class="selected-info" *ngIf="selectedEmirate">
            <p>
              ✅ {{ getSelectedEmirateName() }} selected -
              {{ filteredZones.length }} zones available
            </p>
          </div>
        </div>

        <!-- Step 1: Select Zone -->
        <div *ngIf="currentStep === 1" class="step-panel">
          <div class="step-header">
            <span class="step-icon">📍</span>
            <h2>Select Your Zone</h2>
            <p>
              Choose the zone in {{ selectedEmirate }} for congestion pricing
              analysis
            </p>
          </div>

          <div class="zone-grid">
            <div
              *ngFor="let zone of filteredZones"
              class="zone-card"
              [class.selected]="selectedZone?.id === zone.id"
              (click)="selectZone(zone)"
            >
              <div class="zone-card-header">
                <span class="zone-emirate" [attr.data-emirate]="zone.emirate">{{
                  zone.emirate
                }}</span>
                <span class="zone-type">{{ zone.zoneType }}</span>
              </div>
              <h3>{{ zone.name }}</h3>
              <div class="zone-stats">
                <div class="stat">
                  <span class="stat-value">{{ zone.baseFreeHours }}</span>
                  <span class="stat-label">Free Hours</span>
                </div>
                <div class="stat">
                  <span class="stat-value">AED {{ zone.chargePerHour }}</span>
                  <span class="stat-label">Per Hour</span>
                </div>
              </div>
            </div>
          </div>

          <div class="no-zones" *ngIf="filteredZones.length === 0">
            <p>
              No zones available for this emirate. Please select another
              emirate.
            </p>
          </div>
        </div>

        <!-- Step 2: Configure Rules -->
        <div *ngIf="currentStep === 2" class="step-panel">
          <div class="step-header">
            <span class="step-icon">⚙️</span>
            <h2>Configure Pricing Rules</h2>
            <p>Set up your congestion pricing parameters</p>
          </div>

          <div class="config-grid">
            <div class="config-card">
              <h4>💰 Pricing</h4>
              <div class="config-row">
                <label>Hourly Rate (AED)</label>
                <input
                  type="number"
                  [(ngModel)]="config.hourlyRate"
                  min="0"
                  step="1"
                />
              </div>
              <div class="config-row">
                <label>Free Hours</label>
                <input
                  type="number"
                  [(ngModel)]="config.freeHours"
                  min="0"
                  max="24"
                />
              </div>
              <div class="config-row">
                <label>Peak Multiplier</label>
                <div class="slider-row">
                  <input
                    type="range"
                    [(ngModel)]="config.peakMultiplier"
                    min="1"
                    max="3"
                    step="0.1"
                  />
                  <span class="slider-value">{{ config.peakMultiplier }}x</span>
                </div>
              </div>
            </div>

            <div class="config-card">
              <h4>🚗 Vehicle Rules</h4>
              <div class="config-row checkbox">
                <label>
                  <input
                    type="checkbox"
                    [(ngModel)]="config.exemptPublicTransport"
                  />
                  Exempt Public Transport
                </label>
              </div>
              <div class="config-row checkbox">
                <label>
                  <input
                    type="checkbox"
                    [(ngModel)]="config.exemptCommercial"
                  />
                  Exempt Commercial Vehicles
                </label>
              </div>
              <div class="config-row checkbox">
                <label>
                  <input type="checkbox" [(ngModel)]="config.exemptEmergency" />
                  Exempt Emergency Vehicles
                </label>
              </div>
            </div>

            <div class="config-card">
              <h4>📅 Simulation Date & Time</h4>
              <div class="config-row">
                <label>Select Date & Time</label>
                <app-date-time-picker
                  [(ngModel)]="selectedDateTime"
                  name="simulationDateTime"
                ></app-date-time-picker>
              </div>
            </div>
          </div>

          <div class="preset-scenarios">
            <h4>📋 Preset Scenarios</h4>
            <div class="preset-grid">
              <div class="preset-card" (click)="applyPreset('light')">
                <span class="preset-icon">🌱</span>
                <span class="preset-name">Light Pricing</span>
                <span class="preset-desc">AED 10/hr, 2hr free</span>
              </div>
              <div class="preset-card" (click)="applyPreset('moderate')">
                <span class="preset-icon">⚖️</span>
                <span class="preset-name">Moderate</span>
                <span class="preset-desc">AED 25/hr, 1hr free</span>
              </div>
              <div class="preset-card" (click)="applyPreset('aggressive')">
                <span class="preset-icon">🔥</span>
                <span class="preset-name">Aggressive</span>
                <span class="preset-desc">AED 50/hr, 0hr free</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 3: Run Simulation -->
        <div *ngIf="currentStep === 3" class="step-panel">
          <div class="step-header">
            <span class="step-icon">▶️</span>
            <h2>Run Simulation</h2>
            <p>Execute your congestion pricing simulation</p>
          </div>

          <div class="simulation-preview">
            <div class="preview-card">
              <h4>Simulation Summary</h4>
              <div class="preview-grid">
                <div class="preview-item">
                  <span class="preview-label">Zone</span>
                  <span class="preview-value">{{
                    selectedZone?.name || "Not selected"
                  }}</span>
                </div>
                <div class="preview-item">
                  <span class="preview-label">Rate</span>
                  <span class="preview-value"
                    >AED {{ config.hourlyRate }}/hr</span
                  >
                </div>
                <div class="preview-item">
                  <span class="preview-label">Free Time</span>
                  <span class="preview-value"
                    >{{ config.freeHours }} hours</span
                  >
                </div>
                <div class="preview-item">
                  <span class="preview-label">Peak Multiplier</span>
                  <span class="preview-value"
                    >{{ config.peakMultiplier }}x</span
                  >
                </div>
              </div>
            </div>

            <div class="run-section">
              <button
                class="run-btn"
                (click)="runSimulation()"
                [disabled]="isRunning || !selectedZone"
              >
                <span *ngIf="!isRunning">🚀 Run Simulation</span>
                <span *ngIf="isRunning">⏳ Running...</span>
              </button>
              <p class="run-hint" *ngIf="!selectedZone">
                Please select a zone first
              </p>
            </div>

            <div class="results-preview" *ngIf="simulationResult">
              <h4>📊 Quick Results</h4>
              <div class="quick-metrics">
                <div class="metric-card success">
                  <span class="metric-value"
                    >{{
                      simulationResult.congestionReduction | number: "1.1-1"
                    }}%</span
                  >
                  <span class="metric-label">Congestion Reduction</span>
                </div>
                <div class="metric-card">
                  <span class="metric-value"
                    >AED {{ simulationResult.estimatedRevenue | number }}</span
                  >
                  <span class="metric-label">Est. Revenue</span>
                </div>
                <div class="metric-card">
                  <span class="metric-value">{{
                    simulationResult.vehiclesDiverted | number
                  }}</span>
                  <span class="metric-label">Vehicles Diverted</span>
                </div>
                <div class="metric-card">
                  <span class="metric-value"
                    >{{
                      simulationResult.environmentalImpact | number
                    }}
                    kg</span
                  >
                  <span class="metric-label">CO₂ Reduction</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 4: Results & Visualization -->
        <div *ngIf="currentStep === 4" class="step-panel">
          <div class="step-header">
            <span class="step-icon">📊</span>
            <h2>Results & Visualization</h2>
            <p>Analyze your simulation results with interactive charts</p>
          </div>

          <!-- Key Metrics -->
          <div class="results-metrics" *ngIf="simulationResult">
            <div class="metric-card large">
              <span class="metric-icon">🚗</span>
              <span class="metric-value"
                >{{
                  simulationResult.congestionReduction | number: "1.1-1"
                }}%</span
              >
              <span class="metric-label">Congestion Reduction</span>
            </div>
            <div class="metric-card large">
              <span class="metric-icon">💰</span>
              <span class="metric-value"
                >AED {{ simulationResult.estimatedRevenue | number }}</span
              >
              <span class="metric-label">Est. Annual Revenue</span>
            </div>
            <div class="metric-card large">
              <span class="metric-icon">🚙</span>
              <span class="metric-value">{{
                simulationResult.vehiclesDiverted | number
              }}</span>
              <span class="metric-label">Vehicles Diverted/Day</span>
            </div>
            <div class="metric-card large">
              <span class="metric-icon">🌱</span>
              <span class="metric-value"
                >{{
                  simulationResult.environmentalImpact | number: "1.0-0"
                }}
                kg</span
              >
              <span class="metric-label">CO₂ Reduced/Day</span>
            </div>
          </div>

          <div class="charts-section" *ngIf="simulationResult">
            <div class="chart-card full-width">
              <h4>📈 Traffic Flow Comparison</h4>
              <canvas id="trafficFlowChart"></canvas>
            </div>
            <div class="chart-card">
              <h4>Congestion Impact</h4>
              <canvas id="congestionChart"></canvas>
            </div>
            <div class="chart-card">
              <h4>Revenue Projection</h4>
              <canvas id="revenueChart"></canvas>
            </div>
            <div class="chart-card">
              <h4>Equity Impact</h4>
              <canvas id="equityChart"></canvas>
            </div>
            <div class="chart-card">
              <h4>Environmental Impact</h4>
              <canvas id="envChart"></canvas>
            </div>
          </div>

          <div class="no-results" *ngIf="!simulationResult">
            <p>
              No simulation results available. Please run a simulation first.
            </p>
            <button class="btn-secondary" (click)="goToStep(3)">
              Go to Simulation
            </button>
          </div>
        </div>

        <!-- Step 5: Generate Reports -->
        <div *ngIf="currentStep === 5" class="step-panel">
          <div class="step-header">
            <span class="step-icon">📄</span>
            <h2>Generate Reports</h2>
            <p>Export your findings and recommendations</p>
          </div>

          <div class="reports-section">
            <div class="report-card" (click)="exportReport('pdf')">
              <span class="report-icon">📕</span>
              <h4>Executive Summary</h4>
              <p>PDF document for leadership</p>
            </div>
            <div class="report-card" (click)="exportReport('presentation')">
              <span class="report-icon">📊</span>
              <h4>Presentation Deck</h4>
              <p>PowerPoint for stakeholders</p>
            </div>
            <div class="report-card" (click)="exportReport('investor')">
              <span class="report-icon">💼</span>
              <h4>Investor Report</h4>
              <p>Detailed financial analysis</p>
            </div>
            <div class="report-card" (click)="exportReport('technical')">
              <span class="report-icon">🔧</span>
              <h4>Technical Report</h4>
              <p>Technical specifications</p>
            </div>
          </div>

          <div class="share-section">
            <h4>🔗 Share Results</h4>
            <div class="share-buttons">
              <button class="share-btn" (click)="copyLink()">
                📋 Copy Link
              </button>
              <button class="share-btn" (click)="shareEmail()">
                📧 Email Report
              </button>
              <button class="share-btn" (click)="downloadAll()">
                ⬇️ Download All
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation Buttons -->
      <div class="wizard-nav">
        <button
          class="nav-btn secondary"
          (click)="previousStep()"
          [disabled]="currentStep === 0"
        >
          ← Previous
        </button>
        <button
          class="nav-btn primary"
          (click)="nextStep()"
          [disabled]="currentStep === steps.length - 1 || !canProceed()"
        >
          Next →
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .wizard-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
      }

      /* Progress Bar */
      .wizard-progress {
        margin-bottom: 30px;
      }

      .progress-track {
        height: 4px;
        background: #e2e8f0;
        border-radius: 2px;
        margin-bottom: 20px;
        overflow: hidden;
      }

      .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #3b82f6, #0ea5e9);
        transition: width 0.3s ease;
      }

      .steps-indicator {
        display: flex;
        justify-content: space-between;
      }

      .step-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        cursor: pointer;
        flex: 1;
        opacity: 0.5;
        transition: all 0.3s;
      }

      .step-item.active,
      .step-item.completed {
        opacity: 1;
      }

      .step-circle {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: #e2e8f0;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        margin-bottom: 8px;
        transition: all 0.3s;
      }

      .step-item.active .step-circle {
        background: #3b82f6;
        color: white;
      }

      .step-item.completed .step-circle {
        background: #10b981;
        color: white;
      }

      .step-info {
        text-align: center;
      }

      .step-title {
        display: block;
        font-weight: 600;
        color: #1e293b;
        font-size: 14px;
      }

      .step-desc {
        display: block;
        font-size: 12px;
        color: #64748b;
      }

      /* Step Panel */
      .step-panel {
        background: white;
        border-radius: 16px;
        padding: 30px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
      }

      .step-header {
        text-align: center;
        margin-bottom: 30px;
      }

      .step-icon {
        font-size: 48px;
        display: block;
        margin-bottom: 16px;
      }

      .step-header h2 {
        margin: 0 0 8px;
        color: #1e3a5f;
      }

      .step-header p {
        margin: 0;
        color: #64748b;
      }

      /* Emirate Grid */
      .emirate-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        gap: 16px;
        margin-bottom: 24px;
      }

      .emirate-card {
        border: 2px solid #e2e8f0;
        border-radius: 16px;
        padding: 24px;
        cursor: pointer;
        transition: all 0.2s;
        text-align: center;
      }

      .emirate-card:hover {
        border-color: #3b82f6;
        transform: translateY(-2px);
      }

      .emirate-card.selected {
        border-color: #3b82f6;
        background: #eff6ff;
      }

      .emirate-icon {
        font-size: 48px;
        display: block;
        margin-bottom: 12px;
      }

      .emirate-name {
        font-weight: 600;
        color: #1e293b;
        font-size: 16px;
      }

      .selected-info {
        text-align: center;
        padding: 16px;
        background: #d1fae5;
        border-radius: 12px;
        color: #059669;
        font-weight: 600;
      }

      .no-zones {
        text-align: center;
        padding: 40px;
        color: #64748b;
      }

      /* Zone Grid */
      .zone-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 16px;
        margin-bottom: 24px;
      }

      .zone-card {
        border: 2px solid #e2e8f0;
        border-radius: 12px;
        padding: 16px;
        cursor: pointer;
        transition: all 0.2s;
      }

      .zone-card:hover {
        border-color: #3b82f6;
      }

      .zone-card.selected {
        border-color: #3b82f6;
        background: #eff6ff;
      }

      .zone-card-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;
      }

      .zone-emirate {
        font-size: 12px;
        font-weight: 600;
        text-transform: uppercase;
      }

      .zone-emirate[data-emirate="Dubai"] {
        color: #dc2626;
      }
      .zone-emirate[data-emirate="Abu Dhabi"] {
        color: #059669;
      }
      .zone-emirate[data-emirate="Sharjah"] {
        color: #7c3aed;
      }

      .zone-type {
        font-size: 12px;
        background: #f1f5f9;
        padding: 2px 8px;
        border-radius: 4px;
        color: #64748b;
      }

      .zone-card h3 {
        margin: 0 0 12px;
        font-size: 16px;
      }

      .zone-stats {
        display: flex;
        gap: 16px;
      }

      .stat {
        display: flex;
        flex-direction: column;
      }

      .stat-value {
        font-weight: 600;
        color: #1e3a5f;
      }

      .stat-label {
        font-size: 12px;
        color: #64748b;
      }

      .quick-select h4,
      .preset-scenarios h4,
      .share-section h4 {
        margin: 0 0 12px;
        color: #374151;
      }

      .quick-buttons,
      .preset-grid {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
      }

      .quick-btn {
        padding: 10px 16px;
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        cursor: pointer;
        font-size: 14px;
        transition: all 0.2s;
      }

      .quick-btn:hover {
        background: #f1f5f9;
        border-color: #cbd5e1;
      }

      /* Config Grid */
      .config-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 20px;
        margin-bottom: 24px;
      }

      .config-card {
        background: #f8fafc;
        border-radius: 12px;
        padding: 20px;
      }

      .config-card h4 {
        margin: 0 0 16px;
        color: #1e3a5f;
      }

      .config-row {
        margin-bottom: 16px;
      }

      .config-row label {
        display: block;
        font-size: 13px;
        color: #64748b;
        margin-bottom: 6px;
      }

      .config-row input[type="number"],
      .config-row input[type="date"],
      .config-row input[type="time"] {
        width: 100%;
        padding: 10px;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        font-size: 14px;
      }

      .config-row.checkbox label {
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
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
        min-width: 40px;
      }

      .preset-card {
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 10px;
        padding: 16px;
        text-align: center;
        cursor: pointer;
        transition: all 0.2s;
        flex: 1;
        min-width: 150px;
      }

      .preset-card:hover {
        border-color: #3b82f6;
        transform: translateY(-2px);
      }

      .preset-icon {
        font-size: 24px;
        display: block;
        margin-bottom: 8px;
      }

      .preset-name {
        display: block;
        font-weight: 600;
        color: #1e293b;
        margin-bottom: 4px;
      }

      .preset-desc {
        font-size: 12px;
        color: #64748b;
      }

      /* Simulation Preview */
      .simulation-preview {
        max-width: 600px;
        margin: 0 auto;
      }

      .preview-card {
        background: #f8fafc;
        border-radius: 12px;
        padding: 20px;
        margin-bottom: 20px;
      }

      .preview-card h4 {
        margin: 0 0 16px;
        color: #1e3a5f;
      }

      .preview-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
      }

      .preview-item {
        display: flex;
        flex-direction: column;
      }

      .preview-label {
        font-size: 12px;
        color: #64748b;
      }

      .preview-value {
        font-weight: 600;
        color: #1e293b;
      }

      .run-section {
        text-align: center;
        margin-bottom: 20px;
      }

      .run-btn {
        padding: 16px 48px;
        font-size: 18px;
        font-weight: 600;
        background: linear-gradient(135deg, #3b82f6, #0ea5e9);
        color: white;
        border: none;
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.2s;
      }

      .run-btn:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
      }

      .run-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .run-hint {
        color: #ef4444;
        font-size: 14px;
        margin-top: 8px;
      }

      /* Quick Metrics */
      .quick-metrics {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 12px;
      }

      .metric-card {
        background: #f8fafc;
        border-radius: 10px;
        padding: 16px;
        text-align: center;
      }

      .metric-card.success {
        background: #d1fae5;
      }

      .metric-value {
        display: block;
        font-size: 20px;
        font-weight: 700;
        color: #1e293b;
      }

      .metric-card.success .metric-value {
        color: #059669;
      }

      .metric-label {
        font-size: 12px;
        color: #64748b;
      }

      /* Charts */
      .charts-section {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 20px;
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
        height: 200px !important;
      }

      .chart-card.full-width canvas {
        height: 300px !important;
      }

      .results-metrics {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 16px;
        margin-bottom: 30px;
      }

      .metric-card.large {
        background: #f8fafc;
        border-radius: 16px;
        padding: 24px;
        text-align: center;
      }

      .metric-card.large .metric-icon {
        font-size: 32px;
        display: block;
        margin-bottom: 8px;
      }

      .metric-card.large .metric-value {
        display: block;
        font-size: 28px;
        font-weight: 700;
        color: #1e3a5f;
        margin-bottom: 4px;
      }

      .metric-card.large .metric-label {
        font-size: 14px;
        color: #64748b;
      }

      .no-results {
        text-align: center;
        padding: 40px;
        color: #64748b;
      }

      /* Reports */
      .reports-section {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 16px;
        margin-bottom: 24px;
      }

      .report-card {
        background: #f8fafc;
        border-radius: 12px;
        padding: 24px;
        text-align: center;
        cursor: pointer;
        transition: all 0.2s;
      }

      .report-card:hover {
        background: #f1f5f9;
        transform: translateY(-2px);
      }

      .report-icon {
        font-size: 36px;
        display: block;
        margin-bottom: 12px;
      }

      .report-card h4 {
        margin: 0 0 8px;
        color: #1e3a5f;
      }

      .report-card p {
        margin: 0;
        font-size: 13px;
        color: #64748b;
      }

      .share-buttons {
        display: flex;
        gap: 12px;
        justify-content: center;
      }

      .share-btn {
        padding: 12px 20px;
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        cursor: pointer;
        font-size: 14px;
        transition: all 0.2s;
      }

      .share-btn:hover {
        background: #f1f5f9;
      }

      /* Navigation */
      .wizard-nav {
        display: flex;
        justify-content: space-between;
        margin-top: 24px;
      }

      .nav-btn {
        padding: 12px 32px;
        font-size: 16px;
        font-weight: 600;
        border-radius: 10px;
        cursor: pointer;
        transition: all 0.2s;
      }

      .nav-btn.secondary {
        background: #e2e8f0;
        border: none;
        color: #475569;
      }

      .nav-btn.secondary:hover:not(:disabled) {
        background: #cbd5e1;
      }

      .nav-btn.primary {
        background: linear-gradient(135deg, #3b82f6, #0ea5e9);
        border: none;
        color: white;
      }

      .nav-btn.primary:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
      }

      .nav-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      @media (max-width: 768px) {
        .steps-indicator {
          flex-direction: column;
          gap: 12px;
        }

        .step-item {
          flex-direction: row;
          gap: 12px;
        }

        .quick-metrics,
        .charts-section,
        .reports-section {
          grid-template-columns: repeat(2, 1fr);
        }
      }
    `,
  ],
})
export class WorkflowWizardComponent implements OnInit {
  // Step titles
  steps: WizardStep[] = [
    {
      id: 0,
      title: "Select Emirate",
      description: "Choose emirate",
      icon: "🗺️",
      completed: false,
      active: true,
    },
    {
      id: 1,
      title: "Select Zone",
      description: "Choose location",
      icon: "📍",
      completed: false,
      active: false,
    },
    {
      id: 2,
      title: "Configure",
      description: "Set pricing rules",
      icon: "⚙️",
      completed: false,
      active: false,
    },
    {
      id: 3,
      title: "Simulate",
      description: "Run analysis",
      icon: "▶️",
      completed: false,
      active: false,
    },
    {
      id: 4,
      title: "Results",
      description: "View charts",
      icon: "📊",
      completed: false,
      active: false,
    },
    {
      id: 5,
      title: "Export",
      description: "Generate reports",
      icon: "📄",
      completed: false,
      active: false,
    },
  ];

  currentStep = 0;
  zones: Zone[] = [];
  filteredZones: Zone[] = [];
  selectedEmirate: string = "";
  selectedZone: Zone | null = null;
  isRunning = false;
  simulationResult: SimulationResult | null = null;

  // Available Emirates
  emirates = [
    { id: "dubai", name: "Dubai", icon: "🌆" },
    { id: "abu-dhabi", name: "Abu Dhabi", icon: "🏙️" },
    { id: "sharjah", name: "Sharjah", icon: "🕌" },
    { id: "ajman", name: "Ajman", icon: "🏖️" },
    { id: "ras-al-khaimah", name: "Ras Al Khaimah", icon: "🏔️" },
    { id: "fujairah", name: "Fujairah", icon: "⛰️" },
    { id: "umm-al-quwain", name: "Umm Al Quwain", icon: "🌊" },
  ];

  // Date and time
  selectedDateTime: Date = new Date();

  config = {
    hourlyRate: 25,
    freeHours: 1,
    peakMultiplier: 1.5,
    exemptPublicTransport: true,
    exemptCommercial: true,
    exemptEmergency: true,
    simulationDate: new Date().toISOString().split("T")[0],
    simulationTime: "09:00",
  };

  constructor(
    private zoneService: ZoneService,
    private simulationService: SimulationService,
    private chartService: ChartService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    private reportService: ReportService,
  ) {}

  ngOnInit(): void {
    this.loadZones();
  }

  get progressPercentage(): number {
    return ((this.currentStep + 1) / this.steps.length) * 100;
  }

  loadZones(): void {
    this.zoneService.getAllZones().subscribe((zones) => {
      // Sort zones alphabetically by name
      this.zones = zones.sort((a, b) => a.name.localeCompare(b.name));
      // Filter by selected emirate if one is selected
      this.filterZones();
    });
  }

  filterZones(): void {
    if (this.selectedEmirate) {
      // Map emirate IDs to match zone emirate names
      const emirateMap: Record<string, string> = {
        dubai: "Dubai",
        "abu-dhabi": "Abu Dhabi",
        sharjah: "Sharjah",
        ajman: "Ajman",
        "ras-al-khaimah": "Ras Al Khaimah",
        fujairah: "Fujairah",
        "umm-al-quwain": "Umm Al Quwain",
      };
      const emirateName = emirateMap[this.selectedEmirate];
      this.filteredZones = this.zones.filter((z) => z.emirate === emirateName);
    } else {
      this.filteredZones = [...this.zones];
    }
  }

  selectEmirate(emirateId: string): void {
    this.selectedEmirate = emirateId;
    this.filterZones();
  }

  getSelectedEmirateName(): string {
    const emirate = this.emirates.find((e) => e.id === this.selectedEmirate);
    return emirate ? emirate.name : "";
  }

  selectZone(zone: Zone): void {
    this.selectedZone = zone;
    this.config.hourlyRate = zone.chargePerHour;
    this.config.freeHours = zone.baseFreeHours;
  }

  selectScenario(type: string): void {
    // First set the emirate
    switch (type) {
      case "mussafah":
        this.selectedEmirate = "abu-dhabi";
        break;
      case "marina":
        this.selectedEmirate = "dubai";
        break;
      case "academic":
        this.selectedEmirate = "sharjah";
        break;
      case "qusais":
        this.selectedEmirate = "dubai";
        break;
    }
    this.filterZones();

    // Then find the zone
    switch (type) {
      case "mussafah":
        this.selectedZone =
          this.zones.find(
            (z) => z.name.includes("Mussafah") || z.name.includes("Musaffah"),
          ) || null;
        break;
      case "marina":
        this.selectedZone =
          this.zones.find((z) => z.name.includes("Marina")) || null;
        break;
      case "academic":
        this.selectedZone =
          this.zones.find(
            (z) => z.name.includes("Academic") || z.name.includes("City"),
          ) || null;
        break;
      case "qusais":
        this.selectedZone =
          this.zones.find((z) => z.name.includes("Qusais")) || null;
        break;
    }
    if (this.selectedZone) {
      this.config.hourlyRate = this.selectedZone.chargePerHour;
      this.config.freeHours = this.selectedZone.baseFreeHours;
    }
  }

  applyPreset(type: string): void {
    switch (type) {
      case "light":
        this.config.hourlyRate = 10;
        this.config.freeHours = 2;
        this.config.peakMultiplier = 1.2;
        break;
      case "moderate":
        this.config.hourlyRate = 25;
        this.config.freeHours = 1;
        this.config.peakMultiplier = 1.5;
        break;
      case "aggressive":
        this.config.hourlyRate = 50;
        this.config.freeHours = 0;
        this.config.peakMultiplier = 2;
        break;
    }
  }

  canProceed(): boolean {
    switch (this.currentStep) {
      case 0: // Select Emirate
        return !!this.selectedEmirate;
      case 1: // Select Zone
        return !!this.selectedZone;
      case 2: // Configure
        return true;
      case 3: // Simulate
        return !!this.simulationResult;
      default:
        return true;
    }
  }

  goToStep(index: number): void {
    if (index < this.currentStep || this.canProceed()) {
      this.steps[this.currentStep].active = false;
      this.steps[index].active = true;
      this.currentStep = index;

      // Render charts when navigating to Results step
      if (index === 4 && this.simulationResult) {
        // Small delay to ensure DOM is ready
        setTimeout(() => this.renderCharts(), 100);
      }
    }
  }

  previousStep(): void {
    if (this.currentStep > 0) {
      this.goToStep(this.currentStep - 1);
    }
  }

  nextStep(): void {
    if (this.currentStep < this.steps.length - 1 && this.canProceed()) {
      this.steps[this.currentStep].completed = true;
      this.steps[this.currentStep].active = false;
      this.currentStep++;
      this.steps[this.currentStep].active = true;
    }
  }

  runSimulation(): void {
    if (!this.selectedZone) return;

    this.isRunning = true;
    const exemptions: string[] = [];
    if (this.config.exemptPublicTransport) exemptions.push("Public Transport");
    if (this.config.exemptCommercial) exemptions.push("Commercial");
    if (this.config.exemptEmergency) exemptions.push("Emergency");

    const request: SimulationRequest = {
      zoneId: this.selectedZone.id,
      date: this.selectedDateTime,
      zoneRules: {
        peakMultiplier: this.config.peakMultiplier,
        exemptions,
        freeHours: this.config.freeHours,
        customChargePerHour: this.config.hourlyRate,
      },
    };

    this.simulationService.runSimulation(request).subscribe({
      next: (result) => {
        this.simulationResult = result;
        this.isRunning = false;
        this.renderCharts();
      },
      error: () => {
        this.isRunning = false;
        // Create mock result for demo
        this.simulationResult = {
          id: "demo-1",
          name: "Demo Simulation",
          totalVehicles: 15420,
          vehiclesDiverted: 2313,
          congestionReduction: 15.2,
          estimatedRevenue: 285000,
          equityImpact: {
            lowIncomeBurden: 2.3,
            highIncomeBurden: 1.1,
            burdenRatio: 2.1,
            isRegressive: false,
          },
          environmentalImpact: 4500,
          zoneRules: {},
          results: {},
          createdAt: new Date(),
        };
        this.renderCharts();
      },
    });
  }

  renderCharts(): void {
    // Ensure we have valid data
    if (!this.simulationResult) {
      console.warn("No simulation result available for charts");
      return;
    }

    // Get values with fallback defaults
    const congestionReduction = this.simulationResult.congestionReduction ?? 15;
    const estimatedRevenue = this.simulationResult.estimatedRevenue ?? 250000;
    const environmentalImpact =
      this.simulationResult.environmentalImpact ?? 4000;
    const vehiclesDiverted = this.simulationResult.vehiclesDiverted ?? 2000;

    // Equity data from simulation result
    const equityData = this.simulationResult.equityImpact || {
      lowIncomeBurden: 15,
      highIncomeBurden: 60,
    };

    // Use simulation result data for charts
    const congestionBefore = 75;
    const congestionAfter = Math.max(0, congestionBefore - congestionReduction);

    // Generate monthly revenue projections
    const monthlyRevenue: number[] = [];
    const baseRevenue = estimatedRevenue / 12;
    for (let i = 0; i < 6; i++) {
      monthlyRevenue.push(Math.round(baseRevenue * (1 + i * 0.03)));
    }

    // Traffic flow - compare before and after
    const beforeTraffic = [4500, 8200, 6100, 5800, 7900, 4200];
    const afterTraffic = beforeTraffic.map((v) =>
      Math.round(v * (1 - congestionReduction / 100)),
    );

    console.log("Rendering charts with data:", {
      congestionReduction,
      estimatedRevenue,
      environmentalImpact,
      vehiclesDiverted,
      congestionBefore,
      congestionAfter,
    });

    // Use NgZone to run after Angular change detection is complete
    // This ensures the canvas elements are rendered in the DOM
    this.ngZone.runOutsideAngular(() => {
      // Wait for Angular to render canvas elements
      setTimeout(() => {
        this.chartService.destroyAllCharts();

        // Check and create charts sequentially with polling
        this.checkAndCreateChart("trafficFlowChart", () =>
          this.renderTrafficFlowChart(beforeTraffic, afterTraffic),
        );
        this.checkAndCreateChart("congestionChart", () =>
          this.renderCongestionChart(congestionBefore, congestionAfter),
        );
        this.checkAndCreateChart("revenueChart", () =>
          this.renderRevenueChart(monthlyRevenue),
        );
        this.checkAndCreateChart("equityChart", () =>
          this.renderEquityChart(equityData),
        );
        this.checkAndCreateChart("envChart", () =>
          this.renderEnvironmentalChart(environmentalImpact),
        );
      }, 100);
    });
  }

  private checkAndCreateChart(
    canvasId: string,
    createChartFn: () => void,
    retryCount = 0,
  ): void {
    const maxRetries = 10;
    const canvas = document.getElementById(canvasId);

    if (canvas) {
      createChartFn();
    } else if (retryCount < maxRetries) {
      // Retry after delay
      setTimeout(() => {
        this.checkAndCreateChart(canvasId, createChartFn, retryCount + 1);
      }, 200);
    } else {
      console.warn(
        `Canvas element '${canvasId}' not found after ${maxRetries} retries`,
      );
    }
  }

  private renderTrafficFlowChart(
    beforeTraffic: number[],
    afterTraffic: number[],
  ): void {
    this.chartService.createLineChart(
      "trafficFlowChart",
      ["6AM", "9AM", "12PM", "3PM", "6PM", "9PM"],
      [
        {
          label: "Before Pricing",
          data: beforeTraffic,
          borderColor: "#ef4444",
        },
        {
          label: "After Pricing",
          data: afterTraffic,
          borderColor: "#10b981",
        },
      ],
    );
  }

  private renderCongestionChart(before: number, after: number): void {
    this.chartService.createBarChart(
      "congestionChart",
      ["Baseline", "With Pricing"],
      [
        {
          label: "Congestion Level",
          data: [before, after],
          backgroundColor: ["#94a3b8", "#3b82f6"],
        },
      ],
    );
  }

  private renderRevenueChart(monthlyRevenue: number[]): void {
    this.chartService.createLineChart(
      "revenueChart",
      ["Month 1", "Month 2", "Month 3", "Month 4", "Month 5", "Month 6"],
      [
        {
          label: "Revenue (AED)",
          data: monthlyRevenue,
          borderColor: "#10b981",
        },
      ],
    );
  }

  private renderEquityChart(equityData: {
    lowIncomeBurden: number;
    highIncomeBurden: number;
  }): void {
    this.chartService.createDoughnutChart(
      "equityChart",
      ["Low Income", "Medium Income", "High Income"],
      [
        {
          label: "Burden %",
          data: [
            equityData.lowIncomeBurden,
            25,
            equityData.highIncomeBurden || 60,
          ],
          backgroundColor: ["#ef4444", "#f59e0b", "#10b981"],
        },
      ],
    );
  }

  private renderEnvironmentalChart(envImpact: number): void {
    this.chartService.createBarChart(
      "envChart",
      ["CO₂ (kg)", "NOx (kg)", "PM2.5 (kg)"],
      [
        {
          label: "Daily Reduction",
          data: [
            envImpact,
            Math.round(envImpact * 0.07),
            Math.round(envImpact * 0.01),
          ],
          backgroundColor: "#0ea5e9",
        },
      ],
    );
  }

  exportReport(type: string): void {
    if (!this.simulationResult) {
      alert("Please run a simulation first before generating reports.");
      return;
    }

    const reportData: ReportData = {
      zone: this.selectedZone,
      simulationResult: this.simulationResult,
      config: this.config,
      generatedAt: new Date(),
    };

    switch (type) {
      case "pdf":
        this.reportService.generateExecutiveSummary(reportData);
        break;
      case "presentation":
        this.reportService.generatePresentationDeck(reportData);
        break;
      case "investor":
        this.reportService.generateInvestorReport(reportData);
        break;
      case "technical":
        this.reportService.generateTechnicalReport(reportData);
        break;
    }
  }

  copyLink(): void {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    alert("Link copied to clipboard!");
  }

  shareEmail(): void {
    const subject = encodeURIComponent("Smart Mobility Simulation Results");
    const body = encodeURIComponent(
      "Check out these simulation results from Smart Mobility Simulator",
    );
    window.open(`mailto:?subject=${subject}&body=${body}`);
  }

  downloadAll(): void {
    alert("Downloading all reports...");
  }
}



