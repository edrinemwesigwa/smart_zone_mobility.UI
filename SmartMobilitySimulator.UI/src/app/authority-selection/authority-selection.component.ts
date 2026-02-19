import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { forkJoin } from "rxjs";
import { AuthorityDataService } from "../services/authority-data.service";
import {
  AuthorityDataSource,
  AuthorityZoneRecommendation,
} from "../models/authority-data.model";

interface AuthorityKpi {
  name: string;
  target: string;
  importance: number;
}

interface AuthorityDetail {
  id: string;
  name: string;
  fullName: string;
  color: string;
  emirate: string;
  logo: string;
  stats: {
    congestionCost: string;
    vehicles: string;
    transitShare: string;
    roads: string;
    employees: string;
    budget: string;
  };
  focusAreas: string[];
  smartMobilityReadiness: number;
}

@Component({
  selector: "app-authority-selection",
  template: `
    <div class="authority-selection">
      <!-- Header -->
      <div class="page-header">
        <div class="header-content">
          <div class="header-icon">🏛️</div>
          <div>
            <h1>Transport Authority Selection</h1>
            <p class="subtitle">
              Select an authority to view analysis and recommendations
            </p>
          </div>
        </div>
      </div>

      <!-- Authority Cards -->
      <div class="authority-cards">
        <!-- RTA Dubai Card -->
        <div
          class="authority-card"
          [class.selected]="selectedAuthority === 'RTA'"
          (click)="selectAuthority('RTA')"
        >
          <div class="card-header" style="--accent: #CE1126;">
            <img
              src="/assets/images/rta-dubai.jpg"
              alt="Dubai RTA"
              class="authority-logo"
            />
            <div class="authority-info">
              <h3>Dubai RTA</h3>
              <span class="badge">Dubai Emirate</span>
            </div>
            <div
              class="readiness-meter"
              [style.--score]="authorities['RTA'].smartMobilityReadiness"
            >
              <span class="score"
                >{{ authorities["RTA"].smartMobilityReadiness }}%</span
              >
              <span class="label">Smart Mobility Ready</span>
            </div>
          </div>

          <div class="stats-grid">
            <div class="stat-item">
              <span class="stat-icon">🚗</span>
              <div>
                <div class="stat-value">
                  {{ authorities["RTA"].stats.vehicles }}
                </div>
                <div class="stat-label">Registered Vehicles</div>
              </div>
            </div>
            <div class="stat-item">
              <span class="stat-icon">💰</span>
              <div>
                <div class="stat-value">
                  {{ authorities["RTA"].stats.congestionCost }}
                </div>
                <div class="stat-label">Congestion Cost/Year</div>
              </div>
            </div>
            <div class="stat-item">
              <span class="stat-icon">🚌</span>
              <div>
                <div class="stat-value">
                  {{ authorities["RTA"].stats.transitShare }}
                </div>
                <div class="stat-label">Transit Modal Share</div>
              </div>
            </div>
            <div class="stat-item">
              <span class="stat-icon">🛣️</span>
              <div>
                <div class="stat-value">
                  {{ authorities["RTA"].stats.roads }}
                </div>
                <div class="stat-label">Road Network</div>
              </div>
            </div>
          </div>

          <div class="focus-section">
            <h4>🎯 Focus Areas</h4>
            <div class="focus-tags">
              <span
                *ngFor="let focus of authorities['RTA'].focusAreas"
                class="focus-tag"
              >
                {{ focus }}
              </span>
            </div>
          </div>

          <button
            class="select-btn"
            [class.active]="selectedAuthority === 'RTA'"
          >
            {{
              selectedAuthority === "RTA" ? "✓ Selected" : "Select Authority"
            }}
          </button>
        </div>

        <!-- ITC Abu Dhabi Card -->
        <div
          class="authority-card"
          [class.selected]="selectedAuthority === 'ITC'"
          (click)="selectAuthority('ITC')"
        >
          <div class="card-header" style="--accent: #000000;">
            <img
              src="/assets/images/itc.png"
              alt="Abu Dhabi ITC"
              class="authority-logo"
            />
            <div class="authority-info">
              <h3>Abu Dhabi ITC</h3>
              <span class="badge">Abu Dhabi Emirate</span>
            </div>
            <div
              class="readiness-meter"
              [style.--score]="authorities['ITC'].smartMobilityReadiness"
            >
              <span class="score"
                >{{ authorities["ITC"].smartMobilityReadiness }}%</span
              >
              <span class="label">Smart Mobility Ready</span>
            </div>
          </div>

          <div class="stats-grid">
            <div class="stat-item">
              <span class="stat-icon">🚗</span>
              <div>
                <div class="stat-value">
                  {{ authorities["ITC"].stats.vehicles }}
                </div>
                <div class="stat-label">Registered Vehicles</div>
              </div>
            </div>
            <div class="stat-item">
              <span class="stat-icon">💰</span>
              <div>
                <div class="stat-value">
                  {{ authorities["ITC"].stats.congestionCost }}
                </div>
                <div class="stat-label">Congestion Cost/Year</div>
              </div>
            </div>
            <div class="stat-item">
              <span class="stat-icon">🚌</span>
              <div>
                <div class="stat-value">
                  {{ authorities["ITC"].stats.transitShare }}
                </div>
                <div class="stat-label">Transit Modal Share</div>
              </div>
            </div>
            <div class="stat-item">
              <span class="stat-icon">🛣️</span>
              <div>
                <div class="stat-value">
                  {{ authorities["ITC"].stats.roads }}
                </div>
                <div class="stat-label">Road Network</div>
              </div>
            </div>
          </div>

          <div class="focus-section">
            <h4>🎯 Focus Areas</h4>
            <div class="focus-tags">
              <span
                *ngFor="let focus of authorities['ITC'].focusAreas"
                class="focus-tag"
              >
                {{ focus }}
              </span>
            </div>
          </div>

          <button
            class="select-btn"
            [class.active]="selectedAuthority === 'ITC'"
          >
            {{
              selectedAuthority === "ITC" ? "✓ Selected" : "Select Authority"
            }}
          </button>
        </div>

        <!-- SRTA Sharjah Card -->
        <div
          class="authority-card"
          [class.selected]="selectedAuthority === 'SRTA'"
          (click)="selectAuthority('SRTA')"
        >
          <div class="card-header" style="--accent: #003366;">
            <img
              src="/assets/images/srta.png"
              alt="Sharjah SRTA"
              class="authority-logo"
            />
            <div class="authority-info">
              <h3>Sharjah SRTA</h3>
              <span class="badge">Sharjah Emirate</span>
            </div>
            <div
              class="readiness-meter"
              [style.--score]="authorities['SRTA'].smartMobilityReadiness"
            >
              <span class="score"
                >{{ authorities["SRTA"].smartMobilityReadiness }}%</span
              >
              <span class="label">Smart Mobility Ready</span>
            </div>
          </div>

          <div class="stats-grid">
            <div class="stat-item">
              <span class="stat-icon">🚗</span>
              <div>
                <div class="stat-value">
                  {{ authorities["SRTA"].stats.vehicles }}
                </div>
                <div class="stat-label">Registered Vehicles</div>
              </div>
            </div>
            <div class="stat-item">
              <span class="stat-icon">💰</span>
              <div>
                <div class="stat-value">
                  {{ authorities["SRTA"].stats.congestionCost }}
                </div>
                <div class="stat-label">Congestion Cost/Year</div>
              </div>
            </div>
            <div class="stat-item">
              <span class="stat-icon">🚌</span>
              <div>
                <div class="stat-value">
                  {{ authorities["SRTA"].stats.transitShare }}
                </div>
                <div class="stat-label">Transit Modal Share</div>
              </div>
            </div>
            <div class="stat-item">
              <span class="stat-icon">🛣️</span>
              <div>
                <div class="stat-value">
                  {{ authorities["SRTA"].stats.roads }}
                </div>
                <div class="stat-label">Road Network</div>
              </div>
            </div>
          </div>

          <div class="focus-section">
            <h4>🎯 Focus Areas</h4>
            <div class="focus-tags">
              <span
                *ngFor="let focus of authorities['SRTA'].focusAreas"
                class="focus-tag"
              >
                {{ focus }}
              </span>
            </div>
          </div>

          <button
            class="select-btn"
            [class.active]="selectedAuthority === 'SRTA'"
          >
            {{
              selectedAuthority === "SRTA" ? "✓ Selected" : "Select Authority"
            }}
          </button>
        </div>
      </div>

      <!-- Authority Analysis Section -->
      <div class="analysis-section" *ngIf="selectedAuthority">
        <div class="section-header">
          <h2>📊 {{ getAuthorityName(selectedAuthority) }} Analysis</h2>
        </div>

        <!-- Recommended Zones -->
        <div class="recommendations-panel">
          <h3>🚀 Recommended Pilot Zones</h3>
          <div class="zone-grid">
            <div
              class="zone-card"
              *ngFor="let zone of getRecommendedZones(selectedAuthority)"
            >
              <div class="zone-header">
                <h4>{{ zone.name }}</h4>
                <span
                  class="priority-badge"
                  [attr.data-priority]="zone.priority"
                >
                  Priority {{ zone.priority }}/10
                </span>
              </div>
              <div class="zone-metrics">
                <div class="metric">
                  <span class="metric-value">{{ zone.peakVolume }}</span>
                  <span class="metric-label">vehicles/hr peak</span>
                </div>
                <div class="metric">
                  <span class="metric-value">{{ zone.congestion }}%</span>
                  <span class="metric-label">congestion level</span>
                </div>
              </div>
              <button
                class="analyze-btn"
                (click)="selectZoneForSimulation(zone)"
              >
                📈 Analyze This Zone
              </button>
            </div>
          </div>
        </div>

        <!-- KPIs -->
        <div class="kpis-panel">
          <h3>📈 Authority KPIs</h3>
          <div class="kpi-grid">
            <div
              class="kpi-card"
              *ngFor="let kpi of getAuthorityKPIs(selectedAuthority)"
            >
              <div class="kpi-header">
                <span class="kpi-name">{{ kpi.name }}</span>
                <span
                  class="priority-indicator"
                  [attr.data-priority]="kpi.importance"
                >
                  {{ kpi.importance }}/10
                </span>
              </div>
              <div class="kpi-target">Target: {{ kpi.target }}</div>
              <div class="kpi-bar">
                <div
                  class="kpi-fill"
                  [style.width.%]="kpi.importance * 10"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Data Sources -->
        <div class="sources-panel">
          <h3>📚 Available Data Sources</h3>
          <div class="sources-grid">
            <div
              class="source-card"
              *ngFor="let source of getDataSources(selectedAuthority)"
            >
              <a [href]="source.url" target="_blank" class="source-link">
                <span class="source-icon">🔗</span>
                <span>{{ source.name }}</span>
              </a>
              <div class="quality-badge" [attr.data-quality]="source.quality">
                Quality: {{ source.quality }}/10
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="action-buttons">
          <button class="primary-btn" (click)="generateAuthorityReport()">
            📄 Generate {{ getAuthorityName(selectedAuthority) }} Report
          </button>
          <button class="secondary-btn" (click)="generatePitchDeck()">
            📊 Create {{ getAuthorityName(selectedAuthority) }} Pitch Deck
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .authority-selection {
        padding: 20px;
        max-width: 1400px;
        margin: 0 auto;
      }

      /* Header */
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

      .header-icon {
        font-size: 2.5rem;
        background: rgba(255, 255, 255, 0.15);
        width: 60px;
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 12px;
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

      /* Authority Cards */
      .authority-cards {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
        gap: 20px;
        margin-bottom: 28px;
      }

      .authority-card {
        background: white;
        border-radius: 16px;
        padding: 0;
        cursor: pointer;
        transition: all 0.3s ease;
        border: 2px solid transparent;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
        overflow: hidden;
      }

      .authority-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
      }

      .authority-card.selected {
        border-color: var(--accent, #0ea5e9);
        box-shadow: 0 8px 32px rgba(14, 165, 233, 0.25);
      }

      .card-header {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 20px;
        background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
        border-bottom: 3px solid var(--accent, #0ea5e9);
        flex-wrap: wrap;
      }

      .authority-logo {
        width: 50px;
        height: 50px;
        border-radius: 10px;
        object-fit: contain;
      }

      .authority-info h3 {
        margin: 0;
        font-size: 1.1rem;
        color: #1e3a5f;
      }

      .badge {
        font-size: 0.75rem;
        color: #64748b;
        background: #e2e8f0;
        padding: 3px 8px;
        border-radius: 6px;
      }

      .readiness-meter {
        margin-left: auto;
        text-align: center;
        background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
        padding: 8px 14px;
        border-radius: 10px;
      }

      .readiness-meter .score {
        display: block;
        font-size: 1.25rem;
        font-weight: 700;
        color: #1d4ed8;
      }

      .readiness-meter .label {
        font-size: 0.65rem;
        color: #64748b;
        text-transform: uppercase;
      }

      /* Stats Grid */
      .stats-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
        padding: 16px 20px;
        border-bottom: 1px solid #f1f5f9;
      }

      .stat-item {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .stat-icon {
        font-size: 1.5rem;
      }

      .stat-value {
        font-size: 1rem;
        font-weight: 700;
        color: #1e3a5f;
      }

      .stat-label {
        font-size: 0.7rem;
        color: #64748b;
        display: block;
      }

      /* Focus Section */
      .focus-section {
        padding: 16px 20px;
      }

      .focus-section h4 {
        margin: 0 0 10px 0;
        font-size: 0.9rem;
        color: #334155;
      }

      .focus-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }

      .focus-tag {
        font-size: 0.75rem;
        padding: 5px 10px;
        background: #f1f5f9;
        color: #475569;
        border-radius: 6px;
      }

      /* Select Button */
      .select-btn {
        width: calc(100% - 40px);
        margin: 0 20px 20px;
        padding: 12px;
        border: 2px solid #e2e8f0;
        border-radius: 10px;
        background: white;
        color: #475569;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .select-btn:hover {
        border-color: #0ea5e9;
        color: #0ea5e9;
      }

      .select-btn.active {
        background: #0ea5e9;
        border-color: #0ea5e9;
        color: white;
      }

      /* Analysis Section */
      .analysis-section {
        background: white;
        border-radius: 16px;
        padding: 24px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
      }

      .section-header h2 {
        margin: 0 0 20px 0;
        color: #1e3a5f;
        font-size: 1.4rem;
      }

      /* Recommendations */
      .recommendations-panel {
        margin-bottom: 24px;
      }

      .recommendations-panel h3,
      .kpis-panel h3,
      .sources-panel h3 {
        margin: 0 0 16px 0;
        font-size: 1.1rem;
        color: #334155;
      }

      .zone-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 16px;
      }

      .zone-card {
        background: #f8fafc;
        border-radius: 12px;
        padding: 16px;
        border: 1px solid #e2e8f0;
      }

      .zone-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
      }

      .zone-header h4 {
        margin: 0;
        color: #1e3a5f;
      }

      .priority-badge {
        font-size: 0.7rem;
        padding: 3px 8px;
        border-radius: 6px;
        font-weight: 600;
      }

      .priority-badge[data-priority="10"] {
        background: #fef3c7;
        color: #b45309;
      }
      .priority-badge[data-priority="9"] {
        background: #dbeafe;
        color: #1d4ed8;
      }
      .priority-badge[data-priority="8"] {
        background: #d1fae5;
        color: #059669;
      }
      .priority-badge[data-priority="7"] {
        background: #e2e8f0;
        color: #475569;
      }

      .zone-metrics {
        display: flex;
        gap: 20px;
        margin-bottom: 12px;
      }

      .metric {
        display: flex;
        flex-direction: column;
      }

      .metric-value {
        font-size: 1.25rem;
        font-weight: 700;
        color: #059669;
      }

      .metric-label {
        font-size: 0.7rem;
        color: #64748b;
      }

      .analyze-btn {
        width: 100%;
        padding: 10px;
        background: #0ea5e9;
        color: white;
        border: none;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.2s;
      }

      .analyze-btn:hover {
        background: #0284c7;
      }

      /* KPIs */
      .kpi-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 12px;
        margin-bottom: 24px;
      }

      .kpi-card {
        background: #f8fafc;
        border-radius: 10px;
        padding: 14px;
        border: 1px solid #e2e8f0;
      }

      .kpi-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 6px;
      }

      .kpi-name {
        font-weight: 600;
        color: #334155;
        font-size: 0.9rem;
      }

      .priority-indicator {
        font-size: 0.7rem;
        padding: 2px 6px;
        border-radius: 4px;
        font-weight: 600;
      }

      .priority-indicator[data-priority="10"] {
        background: #fef3c7;
        color: #b45309;
      }
      .priority-indicator[data-priority="9"] {
        background: #dbeafe;
        color: #1d4ed8;
      }
      .priority-indicator[data-priority="8"] {
        background: #d1fae5;
        color: #059669;
      }
      .priority-indicator[data-priority="7"] {
        background: #e2e8f0;
        color: #475569;
      }

      .kpi-target {
        font-size: 0.8rem;
        color: #64748b;
        margin-bottom: 8px;
      }

      .kpi-bar {
        height: 6px;
        background: #e2e8f0;
        border-radius: 3px;
        overflow: hidden;
      }

      .kpi-fill {
        height: 100%;
        background: linear-gradient(90deg, #0ea5e9, #059669);
        border-radius: 3px;
      }

      /* Sources */
      .sources-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 12px;
        margin-bottom: 24px;
      }

      .source-card {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px;
        background: #f8fafc;
        border-radius: 10px;
        border: 1px solid #e2e8f0;
      }

      .source-link {
        display: flex;
        align-items: center;
        gap: 8px;
        color: #1d4ed8;
        text-decoration: none;
        font-size: 0.85rem;
        font-weight: 500;
      }

      .source-link:hover {
        text-decoration: underline;
      }

      .quality-badge {
        font-size: 0.7rem;
        padding: 3px 6px;
        border-radius: 4px;
        font-weight: 600;
      }

      .quality-badge[data-quality="9"] {
        background: #d1fae5;
        color: #059669;
      }
      .quality-badge[data-quality="8"] {
        background: #dbeafe;
        color: #1d4ed8;
      }
      .quality-badge[data-quality="7"] {
        background: #fef3c7;
        color: #b45309;
      }
      .quality-badge[data-quality="6"] {
        background: #e2e8f0;
        color: #475569;
      }

      /* Action Buttons */
      .action-buttons {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
      }

      .primary-btn,
      .secondary-btn {
        padding: 14px 24px;
        border-radius: 10px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
        flex: 1;
        min-width: 250px;
      }

      .primary-btn {
        background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
        color: white;
        border: none;
      }

      .primary-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(14, 165, 233, 0.4);
      }

      .secondary-btn {
        background: white;
        color: #475569;
        border: 2px solid #e2e8f0;
      }

      .secondary-btn:hover {
        border-color: #0ea5e9;
        color: #0ea5e9;
      }

      /* Responsive */
      @media (max-width: 768px) {
        .authority-cards {
          grid-template-columns: 1fr;
        }

        .action-buttons {
          flex-direction: column;
        }

        .primary-btn,
        .secondary-btn {
          min-width: 100%;
        }
      }
    `,
  ],
})
export class AuthoritySelectionComponent implements OnInit {
  selectedAuthority = "";
  isLoading = false;
  private authorityDataSources: Record<string, AuthorityDataSource[]> = {};
  private authorityRecommendations: Record<
    string,
    AuthorityZoneRecommendation[]
  > = {};

  authorities: Record<string, AuthorityDetail> = {
    RTA: {
      id: "RTA",
      name: "Dubai RTA",
      fullName: "Roads and Transport Authority",
      color: "#CE1126",
      emirate: "Dubai",
      logo: "/assets/images/rta-dubai.jpg",
      stats: {
        congestionCost: "AED 4.5B",
        vehicles: "1.78M",
        transitShare: "6.3%",
        roads: "13,000+ km",
        employees: "13,000+",
        budget: "AED 30B+",
      },
      focusAreas: [
        "Tourist Districts",
        "Metro Integration",
        "Smart City",
        "Dubai 2040 Plan",
        "Autonomous Transport",
      ],
      smartMobilityReadiness: 92,
    },
    ITC: {
      id: "ITC",
      name: "Abu Dhabi ITC",
      fullName: "Integrated Transport Centre",
      color: "#000000",
      emirate: "Abu Dhabi",
      logo: "/assets/images/itc.png",
      stats: {
        congestionCost: "AED 2.8B",
        vehicles: "1.2M",
        transitShare: "5.1%",
        roads: "8,500+ km",
        employees: "8,500+",
        budget: "AED 18B",
      },
      focusAreas: [
        "Industrial Corridors",
        "Mussafah Zone",
        "Net Zero 2050",
        "Masdar City",
        "Island Mobility",
      ],
      smartMobilityReadiness: 78,
    },
    SRTA: {
      id: "SRTA",
      name: "Sharjah SRTA",
      fullName: "Sharjah Roads and Transport Authority",
      color: "#003366",
      emirate: "Sharjah",
      logo: "/assets/images/srta.png",
      stats: {
        congestionCost: "AED 1.5B",
        vehicles: "0.56M",
        transitShare: "8.2%",
        roads: "5,200+ km",
        employees: "4,200+",
        budget: "AED 6B",
      },
      focusAreas: [
        "Dubai Border",
        "Industrial Areas",
        "Affordable Housing",
        "University City",
        "Border Efficiency",
      ],
      smartMobilityReadiness: 65,
    },
  };

  constructor(
    private authorityDataService: AuthorityDataService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.prefetchAuthorityData();
  }

  selectAuthority(authority: string): void {
    this.selectedAuthority = authority;
    this.loadAuthorityData(authority);
  }

  getAuthorityName(authority: string): string {
    return this.authorities[authority]?.name ?? authority;
  }

  getRecommendedZones(authority: string): AuthorityZoneRecommendation[] {
    const cached = this.authorityRecommendations[authority];
    if (cached?.length) return cached;

    const recommendations: Record<string, AuthorityZoneRecommendation[]> = {
      RTA: [
        { name: "Dubai Marina", peakVolume: 3800, congestion: 85, priority: 9 },
        { name: "Business Bay", peakVolume: 4200, congestion: 80, priority: 8 },
        {
          name: "Deira Commercial",
          peakVolume: 4500,
          congestion: 90,
          priority: 7,
        },
      ],
      ITC: [
        {
          name: "Mussafah Industrial",
          peakVolume: 4200,
          congestion: 90,
          priority: 10,
        },
        { name: "Khalifa City", peakVolume: 2800, congestion: 75, priority: 8 },
        {
          name: "Abu Dhabi City Center",
          peakVolume: 3500,
          congestion: 80,
          priority: 7,
        },
      ],
      SRTA: [
        {
          name: "Sharjah Industrial Area",
          peakVolume: 3200,
          congestion: 85,
          priority: 9,
        },
        {
          name: "Al Taawun Border",
          peakVolume: 4800,
          congestion: 95,
          priority: 10,
        },
        {
          name: "University City",
          peakVolume: 2200,
          congestion: 70,
          priority: 7,
        },
      ],
    };

    return recommendations[authority] ?? [];
  }

  getAuthorityKPIs(authority: string): AuthorityKpi[] {
    const kpis: Record<string, AuthorityKpi[]> = {
      RTA: [
        { name: " Tourist congestion", target: "Reduce by 15%", importance: 9 },
        { name: "Metro ridership", target: "Increase to 15%", importance: 8 },
        { name: "Smart city score", target: "Top 3 globally", importance: 7 },
        {
          name: "Autonomous vehicle share",
          target: "25% by 2030",
          importance: 8,
        },
      ],
      ITC: [
        {
          name: "Industrial corridor delays",
          target: "Reduce by 12%",
          importance: 10,
        },
        { name: "Traffic fatalities", target: "Zero by 2030", importance: 9 },
        { name: "Net Zero emissions", target: "40% reduction", importance: 8 },
        {
          name: "Public transit coverage",
          target: "90% population",
          importance: 7,
        },
      ],
      SRTA: [
        {
          name: "Border crossing time",
          target: "Reduce by 20%",
          importance: 10,
        },
        {
          name: "Housing accessibility",
          target: "Increase by 12%",
          importance: 8,
        },
        {
          name: "Industrial commute cost",
          target: "Reduce by 5%",
          importance: 7,
        },
        {
          name: "Inter-emirate connectivity",
          target: "Seamless",
          importance: 9,
        },
      ],
    };

    return kpis[authority] ?? [];
  }

  getDataSources(authority: string): AuthorityDataSource[] {
    const cached = this.authorityDataSources[authority];
    if (cached?.length) return cached;

    const sources: Record<string, AuthorityDataSource[]> = {
      RTA: [
        {
          name: "RTA Open Data Portal",
          url: "https://www.rta.ae/wps/portal/rta/ae/home/about-rta/open-data",
          quality: 9,
        },
        {
          name: "Dubai Data Platform",
          url: "https://www.dubaidata.gov.ae",
          quality: 8,
        },
        {
          name: "Smart Dubai Portal",
          url: "https://www.smartdubai.ae",
          quality: 9,
        },
      ],
      ITC: [
        {
          name: "Abu Dhabi Open Data",
          url: "https://addata.gov.ae",
          quality: 7,
        },
        {
          name: "ITC Official Reports",
          url: "https://www.itc.gov.ae",
          quality: 8,
        },
        {
          name: "Abu Dhabi Vision 2030",
          url: "https://www.ad2021.ae",
          quality: 8,
        },
      ],
      SRTA: [
        {
          name: "SRTA Data Portal",
          url: "https://data.srta.gov.ae",
          quality: 6,
        },
        {
          name: "Sharjah Statistics",
          url: "https://www.sharjahstatistics.gov.ae",
          quality: 7,
        },
        {
          name: "Emirates SDG Center",
          url: "https://sdgcenter.gov.ae",
          quality: 7,
        },
      ],
    };

    return sources[authority] ?? [];
  }

  selectZoneForSimulation(zone: AuthorityZoneRecommendation): void {
    console.log("Selected zone for analysis", zone);
  }

  generateAuthorityReport(): void {
    if (this.selectedAuthority) {
      this.router.navigate(["/authority-report"], {
        queryParams: { authority: this.selectedAuthority },
      });
    }
  }

  generatePitchDeck(): void {
    if (this.selectedAuthority) {
      this.router.navigate(["/pitch-deck"], {
        queryParams: { authority: this.selectedAuthority },
      });
    }
  }

  private loadAuthorityData(authority: string): void {
    this.isLoading = true;
    forkJoin({
      sources: this.authorityDataService.getDataSources(authority),
      recommendations: this.authorityDataService.getRecommendations(authority),
    }).subscribe({
      next: ({ sources, recommendations }) => {
        this.authorityDataSources[authority] = sources;
        this.authorityRecommendations[authority] = recommendations;
      },
      error: () => null,
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  private prefetchAuthorityData(): void {
    ["RTA", "ITC", "SRTA"].forEach((authority) =>
      this.loadAuthorityData(authority),
    );
  }
}



