import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AuthorityDataService } from "../services/authority-data.service";
import {
  AuthorityComparison,
  AuthorityRoadmap,
} from "../models/authority-data.model";
import { SimulationRequest } from "../models/simulation.model";

interface ZoneRecommendation {
  name: string;
  priority: number;
  reason: string;
}

@Component({
  selector: "app-authority-comparison",
  template: `
    <div class="authority-comparison">
      <h2>🇦🇪 RTA Dubai vs ITC Abu Dhabi Analysis</h2>

      <div class="authority-tabs">
        <button
          [class.active]="activeTab === 'RTA'"
          (click)="activeTab = 'RTA'"
        >
          <img src="/assets/logos/rta-logo.png" alt="RTA" /> Dubai RTA
        </button>
        <button
          [class.active]="activeTab === 'ITC'"
          (click)="activeTab = 'ITC'"
        >
          <img src="/assets/logos/itc-logo.png" alt="ITC" /> Abu Dhabi ITC
        </button>
        <button
          [class.active]="activeTab === 'COMPARE'"
          (click)="activeTab = 'COMPARE'"
        >
          ↔️ Compare Both
        </button>
      </div>

      <div class="authority-view" *ngIf="activeTab === 'RTA'">
        <div class="authority-header rta-header">
          <h3>Dubai Roads and Transport Authority (RTA)</h3>
          <div class="authority-badges">
            <span class="badge badge-red">Tourism Focus</span>
            <span class="badge badge-green">Smart City</span>
            <span class="badge badge-gold">High Tech</span>
          </div>
        </div>

        <div class="rta-specific">
          <h4>RTA-Specific Analysis</h4>

          <div class="rta-metrics">
            <div class="metric-card">
              <div class="metric-value">{{ rtaData.tourismImpact }}%</div>
              <div class="metric-label">Tourist Experience Improvement</div>
              <div class="metric-note">Dubai Tourism Target: +15%</div>
            </div>

            <div class="metric-card">
              <div class="metric-value">
                {{ rtaData.metroRidership | number }}
              </div>
              <div class="metric-label">Additional Metro Passengers/Day</div>
              <div class="metric-note">RTA Target: +50,000 by 2025</div>
            </div>

            <div class="metric-card">
              <div class="metric-value">{{ rtaData.smartCityScore }}/100</div>
              <div class="metric-label">Smart Dubai Index Contribution</div>
              <div class="metric-note">Target: Top 5 Global Smart City</div>
            </div>
          </div>

          <div class="rta-recommendations">
            <h5>Recommended Zones for RTA Pilot:</h5>
            <div class="zone-list">
              <div class="zone-item" *ngFor="let zone of rtaZones">
                <div class="zone-name">{{ zone.name }}</div>
                <div class="zone-priority">
                  Priority: {{ zone.priority }}/10
                </div>
                <div class="zone-reason">{{ zone.reason }}</div>
                <button (click)="analyzeZone('RTA', zone)">Analyze</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="authority-view" *ngIf="activeTab === 'ITC'">
        <div class="authority-header itc-header">
          <h3>Abu Dhabi Integrated Transport Centre (ITC)</h3>
          <div class="authority-badges">
            <span class="badge badge-black">Industrial Focus</span>
            <span class="badge badge-gold">Economic Development</span>
            <span class="badge badge-green">Safety Priority</span>
          </div>
        </div>

        <div class="itc-specific">
          <h4>ITC-Specific Analysis</h4>

          <div class="rta-metrics">
            <div class="metric-card">
              <div class="metric-value">
                {{ itcData.industrialProductivity }}%
              </div>
              <div class="metric-label">Industrial Productivity Gain</div>
              <div class="metric-note">ITC Target: 25% by 2030</div>
            </div>

            <div class="metric-card">
              <div class="metric-value">{{ itcData.safetyImprovement }}%</div>
              <div class="metric-label">Road Safety Improvement</div>
              <div class="metric-note">Target: 30% reduction by 2030</div>
            </div>

            <div class="metric-card">
              <div class="metric-value">{{ itcData.economicImpact }}M</div>
              <div class="metric-label">Economic Impact (AED)</div>
              <div class="metric-note">Ghadan 21 alignment</div>
            </div>
          </div>

          <div class="rta-recommendations">
            <h5>Recommended Zones for ITC Pilot:</h5>
            <div class="zone-list">
              <div class="zone-item" *ngFor="let zone of itcZones">
                <div class="zone-name">{{ zone.name }}</div>
                <div class="zone-priority">
                  Priority: {{ zone.priority }}/10
                </div>
                <div class="zone-reason">{{ zone.reason }}</div>
                <button (click)="analyzeZone('ITC', zone)">Analyze</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="authority-view" *ngIf="activeTab === 'COMPARE'">
        <div class="compare-grid">
          <div class="compare-card">
            <h4>Implementation Cost</h4>
            <div class="compare-row">
              <span>RTA</span>
              <strong>5,000,000 AED</strong>
            </div>
            <div class="compare-row">
              <span>ITC</span>
              <strong>3,000,000 AED</strong>
            </div>
          </div>
          <div class="compare-card">
            <h4>Expected Benefits</h4>
            <div class="compare-row">
              <span>RTA</span>
              <strong>1.6B AED / year</strong>
            </div>
            <div class="compare-row">
              <span>ITC</span>
              <strong>0.95B AED / year</strong>
            </div>
          </div>
          <div class="compare-card">
            <h4>Recommended First Mover</h4>
            <p>Dubai RTA for higher ROI and tourism sensitivity.</p>
          </div>
        </div>

        <div class="compare-grid" *ngIf="comparison">
          <div
            class="compare-card"
            *ngFor="let metric of comparison.comparisonMetrics"
          >
            <h4>{{ metric.metric }}</h4>
            <div class="compare-row">
              <span>RTA</span>
              <strong>{{ metric.rtaValue | number: "1.0-2" }}</strong>
            </div>
            <div class="compare-row">
              <span>ITC</span>
              <strong>{{ metric.itcValue | number: "1.0-2" }}</strong>
            </div>
            <div class="compare-row">
              <span>Better For</span>
              <strong>{{ metric.betterFor }}</strong>
            </div>
          </div>
        </div>

        <div class="compare-card" *ngIf="roadmap">
          <h4>UAE-wide Rollout Strategy</h4>
          <p>{{ roadmap.uaeWideBenefits }}</p>
          <div class="compare-row">
            <span>Total Investment</span>
            <strong>{{ roadmap.totalInvestment | currency: "AED" }}</strong>
          </div>
          <div class="compare-row">
            <span>Total 5-Year Revenue</span>
            <strong>{{ roadmap.total5YearRevenue | currency: "AED" }}</strong>
          </div>
          <div class="compare-row">
            <span>Overall ROI</span>
            <strong>{{ roadmap.overallROI }}%</strong>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .authority-tabs {
        display: flex;
        gap: 12px;
        margin: 20px 0;
      }

      .authority-tabs button {
        border: 1px solid #ddd;
        background: #fff;
        padding: 10px 16px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
      }

      .authority-tabs button.active {
        border-color: #ce1126;
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
      }

      .authority-tabs img {
        width: 20px;
        height: 20px;
      }

      .authority-header {
        padding: 16px;
        border-radius: 10px;
        margin-bottom: 16px;
        color: #fff;
      }

      .authority-header h3 {
        color: white;
        margin: 0 0 8px 0;
      }

      .rta-header {
        background: linear-gradient(135deg, #ce1126, #00732f);
      }

      .itc-header {
        background: linear-gradient(135deg, #000000, #ffd700);
      }

      .authority-badges {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }

      .badge {
        padding: 4px 10px;
        border-radius: 999px;
        font-size: 12px;
        background: rgba(255, 255, 255, 0.2);
      }

      .rta-metrics {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 16px;
        margin-bottom: 20px;
      }

      .metric-card {
        padding: 16px;
        border-radius: 10px;
        background: #fff;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      }

      .metric-value {
        font-size: 24px;
        font-weight: 600;
      }

      .zone-list {
        display: grid;
        gap: 12px;
      }

      .zone-item {
        border: 1px solid #eee;
        border-radius: 10px;
        padding: 12px;
        background: #fafafa;
      }

      .compare-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 16px;
      }

      .compare-card {
        padding: 16px;
        border-radius: 12px;
        background: #fff;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      }

      .compare-row {
        display: flex;
        justify-content: space-between;
        margin-top: 6px;
      }
    `,
  ],
})
export class AuthorityComparisonComponent implements OnInit {
  activeTab: "RTA" | "ITC" | "COMPARE" = "RTA";

  comparison?: AuthorityComparison;
  roadmap?: AuthorityRoadmap;

  rtaData = {
    tourismImpact: 14,
    metroRidership: 52000,
    smartCityScore: 82,
  };

  itcData = {
    industrialProductivity: 22,
    safetyImprovement: 18,
    economicImpact: 310,
  };

  rtaZones: ZoneRecommendation[] = [
    {
      name: "Dubai Marina",
      priority: 9,
      reason: "Tourist-heavy congestion and metro access",
    },
    {
      name: "Business Bay",
      priority: 8,
      reason: "CBD demand management and smart city pilots",
    },
    {
      name: "Deira",
      priority: 7,
      reason: "Legacy network with high weekday demand",
    },
  ];

  itcZones: ZoneRecommendation[] = [
    {
      name: "Mussafah Industrial",
      priority: 10,
      reason: "Industrial freight peak congestion",
    },
    {
      name: "Khalifa City",
      priority: 8,
      reason: "Commuter-heavy corridor with safety focus",
    },
    {
      name: "Reem Island",
      priority: 7,
      reason: "Mixed residential and commercial access",
    },
  ];

  analyzeZone(authority: "RTA" | "ITC", zone: ZoneRecommendation): void {
    console.log(`Analyze ${authority} zone`, zone);
  }

  constructor(
    private route: ActivatedRoute,
    private authorityDataService: AuthorityDataService,
  ) {}

  ngOnInit(): void {
    const zoneId = this.route.snapshot.queryParamMap.get("zoneId");
    const zoneName = this.route.snapshot.queryParamMap.get("zoneName");

    if (zoneId) {
      const request: SimulationRequest = {
        zoneId,
        zoneName: zoneName ?? undefined,
        date: new Date(),
        zoneRules: {},
      };

      this.authorityDataService.compareRtaVsItc(request).subscribe({
        next: (comparison) => {
          this.comparison = comparison;
        },
        error: () => null,
      });
    }

    this.authorityDataService.getUaeRoadmap().subscribe({
      next: (roadmap) => {
        this.roadmap = roadmap;
      },
      error: () => null,
    });
  }
}



