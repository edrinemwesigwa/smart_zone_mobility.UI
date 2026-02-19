import { Component } from "@angular/core";
import { jsPDF } from "jspdf";

@Component({
  selector: "app-technical-architecture-guide",
  template: `
    <div class="doc-container">
      <!-- Header -->
      <div class="doc-header">
        <div class="header-content">
          <button class="back-btn" (click)="goBack()">
            ← Back to Dashboard
          </button>
          <h1>🔧 Technical Architecture Guide</h1>
          <p class="subtitle">
            System design, components, and integration details for technical
            teams
          </p>
        </div>
        <div class="header-actions">
          <button class="download-btn" (click)="downloadPdf()">
            📥 Download PDF
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="doc-content">
        <section class="doc-section">
          <h2>📐 Overview</h2>
          <p>Smart Mobility Simulator is a two‑tier system:</p>
          <div class="architecture-diagram">
            <div class="arch-box frontend">
              <span class="arch-icon">🖥️</span>
              <strong>Frontend</strong>
              <span>Angular SPA</span>
            </div>
            <div class="arch-arrow">→</div>
            <div class="arch-box backend">
              <span class="arch-icon">⚙️</span>
              <strong>Backend</strong>
              <span>ASP.NET Core API</span>
            </div>
            <div class="arch-arrow">→</div>
            <div class="arch-box database">
              <span class="arch-icon">🗄️</span>
              <strong>Database</strong>
              <span>SQL Server</span>
            </div>
          </div>
          <p>
            It runs congestion simulations, stores results, and produces
            executive outputs (PDF/PPTX/JSON).
          </p>
        </section>

        <section class="doc-section">
          <h2>🧩 System Components</h2>

          <h3>Backend (SmartMobilitySimulator.Backend)</h3>
          <div class="component-list">
            <div class="component-card">
              <h4>SmartMobilitySimulator.API</h4>
              <ul>
                <li>
                  <strong>Controllers</strong>: Zones, Simulations, RTA, Pitch
                  Deck, Pilot Proposal, Business Case, Demo
                </li>
                <li>
                  <strong>Services</strong>: SimulationEngine,
                  EconomicImpactService, PdfReportService, PitchDeckService,
                  DemoModeService
                </li>
                <li><strong>Data</strong>: AppDbContext, EF Core migrations</li>
              </ul>
            </div>
          </div>

          <h3>Frontend (SmartMobilitySimulator.UI)</h3>
          <div class="component-list">
            <div class="component-card">
              <ul>
                <li>
                  <strong>Components</strong>: zone‑map, simulation‑controls,
                  results‑dashboard, pilot‑proposal, business‑case, pitch‑deck,
                  demo‑mode
                </li>
                <li>
                  <strong>Services</strong>: zone, simulation, rta,
                  pilot‑proposal, business‑case, demo‑mode
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section class="doc-section">
          <h2>🗃️ Data Model (Key Entities)</h2>
          <div class="entities-grid">
            <div class="entity-card">
              <h4>Zone</h4>
              <p>name, emirate, type, pricing rules, peak hours</p>
            </div>
            <div class="entity-card">
              <h4>VehicleMovement</h4>
              <p>entry/exit, duration, exemptions</p>
            </div>
            <div class="entity-card">
              <h4>UserProfile</h4>
              <p>vehicle type, income bracket</p>
            </div>
            <div class="entity-card">
              <h4>SimulationResult</h4>
              <p>metrics, serialized rules, investor summary/PDF</p>
            </div>
          </div>
        </section>

        <section class="doc-section">
          <h2>🔄 Simulation Flow</h2>
          <div class="flow-diagram">
            <div class="flow-step">
              <span class="flow-number">1</span>
              <div class="flow-content">
                <h4>UI Request</h4>
                <p>UI posts simulation request (zoneId, date, rules)</p>
              </div>
            </div>
            <div class="flow-arrow">↓</div>
            <div class="flow-step">
              <span class="flow-number">2</span>
              <div class="flow-content">
                <h4>Data Retrieval</h4>
                <p>Backend retrieves movement data</p>
              </div>
            </div>
            <div class="flow-arrow">↓</div>
            <div class="flow-step">
              <span class="flow-number">3</span>
              <div class="flow-content">
                <h4>Simulation Engine</h4>
                <p>
                  Applies exemptions, diversion thresholds, UAE context
                  (prayer/holiday/salik factors)
                </p>
              </div>
            </div>
            <div class="flow-arrow">↓</div>
            <div class="flow-step">
              <span class="flow-number">4</span>
              <div class="flow-content">
                <h4>Metrics Computation</h4>
                <p>Congestion, revenue, CO₂ calculated</p>
              </div>
            </div>
            <div class="flow-arrow">↓</div>
            <div class="flow-step">
              <span class="flow-number">5</span>
              <div class="flow-content">
                <h4>Results</h4>
                <p>Results saved and returned to UI</p>
              </div>
            </div>
          </div>
        </section>

        <section class="doc-section">
          <h2>💰 Economic Impact</h2>
          <ul>
            <li>Equity impact by income bracket</li>
            <li>5‑year revenue projection and NPV</li>
            <li>Productivity gains from congestion reduction</li>
          </ul>
        </section>

        <section class="doc-section">
          <h2>📤 Export Outputs</h2>
          <div class="exports-grid">
            <div class="export-card">
              <h4>📄 Simulation Report</h4>
              <p>PDF / CSV / JSON</p>
            </div>
            <div class="export-card">
              <h4>📊 Investor Report</h4>
              <p>QuestPDF (PDF)</p>
            </div>
            <div class="export-card">
              <h4>📽️ Pitch Deck</h4>
              <p>JSON / PDF / PPTX</p>
            </div>
            <div class="export-card">
              <h4>📦 Demo ZIP</h4>
              <p>PDF + PPTX + Business Case JSON</p>
            </div>
          </div>
        </section>

        <section class="doc-section">
          <h2>🔌 APIs (Core)</h2>
          <div class="api-list">
            <div class="api-item">
              <code>GET /api/zones</code>
              <span>List all zones</span>
            </div>
            <div class="api-item">
              <code>POST /api/simulations</code>
              <span>Run new simulation</span>
            </div>
            <div class="api-item">
              <code
                >GET /api/simulations/{{ "{" }}id{{ "}" }}/economic-impact</code
              >
              <span>Economic impact data</span>
            </div>
            <div class="api-item">
              <code
                >GET /api/simulations/{{ "{" }}id{{ "}" }}/investor-report</code
              >
              <span>Investor report PDF</span>
            </div>
            <div class="api-item">
              <code>GET /api/pitch-deck/{{ "{" }}simulationId{{ "}" }}</code>
              <span>Pitch deck data</span>
            </div>
            <div class="api-item">
              <code
                >POST /api/pilot/generate-proposal/{{ "{" }}simulationId{{
                  "}"
                }}</code
              >
              <span>Generate pilot proposal</span>
            </div>
            <div class="api-item">
              <code>GET /api/business-case/{{ "{" }}simulationId{{ "}" }}</code>
              <span>Business case analysis</span>
            </div>
            <div class="api-item">
              <code>GET /api/demo/scenarios</code>
              <span>List demo scenarios</span>
            </div>
          </div>
        </section>

        <section class="doc-section">
          <h2>🔗 Integration & Dependencies</h2>
          <div class="dependencies-grid">
            <div class="dep-card">
              <span class="dep-icon">📄</span>
              <h4>QuestPDF</h4>
              <p>PDF generation</p>
            </div>
            <div class="dep-card">
              <span class="dep-icon">📊</span>
              <h4>OpenXML SDK</h4>
              <p>PPTX creation</p>
            </div>
            <div class="dep-card">
              <span class="dep-icon">🗺️</span>
              <h4>Leaflet</h4>
              <p>Maps and polygons</p>
            </div>
            <div class="dep-card">
              <span class="dep-icon">🖼️</span>
              <h4>html2canvas / jsPDF</h4>
              <p>UI exports</p>
            </div>
            <div class="dep-card">
              <span class="dep-icon">📽️</span>
              <h4>html-to-pptx</h4>
              <p>Browser PPTX export</p>
            </div>
          </div>
        </section>

        <section class="doc-section">
          <h2>⚙️ Configuration</h2>
          <ul>
            <li>
              <strong>Backend</strong>: SmartMobilitySimulator.API/appsettings.json
            </li>
            <li><strong>Frontend</strong>: API base URL in src/app/services</li>
            <li><strong>CORS</strong>: enabled for local Angular dev</li>
          </ul>
        </section>

        <section class="doc-section">
          <h2>🔒 Security & Governance</h2>
          <ul>
            <li>Data anonymization in movement records</li>
            <li>Policy‑driven exemptions</li>
            <li>Auditability via stored simulation results</li>
          </ul>
        </section>

        <section class="doc-section">
          <h2>💻 Local Run</h2>
          <div class="run-commands">
            <div class="command-card">
              <h4>Backend</h4>
              <code>dotnet run</code>
              <p>Run SmartMobilitySimulator.API</p>
            </div>
            <div class="command-card">
              <h4>Frontend</h4>
              <code>npm start</code>
              <p>Run SmartMobilitySimulator.UI</p>
            </div>
          </div>
        </section>

        <section class="doc-section">
          <h2>🔧 Troubleshooting</h2>
          <ul>
            <li>Ensure backend runs at <code>http://localhost:5000</code></li>
            <li>Ensure frontend runs at <code>http://localhost:4200</code></li>
            <li>
              If PPTX export fails in UI, confirm CDN script is loaded in
              index.html
            </li>
          </ul>
        </section>
      </div>
    </div>
  `,
  styles: [
    `
      .doc-container {
        padding: 20px;
        max-width: 1200px;
        margin: 0 auto;
      }

      .doc-header {
        background: linear-gradient(135deg, #1e3a5f 0%, #0ea5e9 100%);
        border-radius: 16px;
        padding: 32px;
        margin-bottom: 24px;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
      }

      .back-btn {
        background: rgba(255, 255, 255, 0.2);
        border: none;
        color: white;
        padding: 8px 16px;
        border-radius: 8px;
        cursor: pointer;
        margin-bottom: 16px;
      }

      .back-btn:hover {
        background: rgba(255, 255, 255, 0.3);
      }

      .doc-header h1 {
        margin: 0;
        color: white;
        font-size: 1.8rem;
      }

      .subtitle {
        margin: 8px 0 0;
        color: rgba(255, 255, 255, 0.9);
      }

      .download-btn {
        background: white;
        color: #1e3a5f;
        border: none;
        padding: 12px 24px;
        border-radius: 10px;
        font-weight: 600;
        cursor: pointer;
      }

      .download-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      }

      .doc-content {
        background: white;
        border-radius: 16px;
        padding: 32px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
      }

      .doc-section {
        margin-bottom: 32px;
        padding-bottom: 24px;
        border-bottom: 1px solid #e2e8f0;
      }

      .doc-section:last-child {
        border-bottom: none;
        margin-bottom: 0;
      }

      .doc-section h2 {
        color: #1e3a5f;
        font-size: 1.3rem;
        margin: 0 0 16px;
      }

      .doc-section h3 {
        color: #334155;
        font-size: 1.1rem;
        margin: 20px 0 12px;
      }

      .doc-section p {
        color: #475569;
        line-height: 1.7;
      }

      .doc-section ul {
        color: #475569;
        line-height: 1.8;
        padding-left: 20px;
      }

      .doc-section li {
        margin-bottom: 8px;
      }

      .doc-section code {
        background: #f1f5f9;
        padding: 2px 8px;
        border-radius: 4px;
        font-family: monospace;
        color: #1e3a5f;
      }

      /* Architecture Diagram */
      .architecture-diagram {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 16px;
        margin: 24px 0;
        flex-wrap: wrap;
      }

      .arch-box {
        background: #f8fafc;
        border-radius: 12px;
        padding: 20px;
        text-align: center;
        min-width: 120px;
        border: 2px solid #e2e8f0;
      }

      .arch-box.frontend {
        border-color: #3b82f6;
      }
      .arch-box.backend {
        border-color: #8b5cf6;
      }
      .arch-box.database {
        border-color: #10b981;
      }

      .arch-icon {
        font-size: 2rem;
        display: block;
        margin-bottom: 8px;
      }

      .arch-box strong {
        display: block;
        color: #1e3a5f;
      }

      .arch-box span {
        font-size: 0.8rem;
        color: #64748b;
      }

      .arch-arrow {
        font-size: 1.5rem;
        color: #94a3b8;
      }

      /* Component List */
      .component-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .component-card {
        background: #f8fafc;
        border-radius: 12px;
        padding: 20px;
      }

      .component-card h4 {
        margin: 0 0 12px;
        color: #1e3a5f;
      }

      .component-card ul {
        margin: 0;
        padding-left: 20px;
      }

      /* Entities Grid */
      .entities-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 16px;
      }

      .entity-card {
        background: #f8fafc;
        border-radius: 12px;
        padding: 20px;
        border-left: 3px solid #1e3a5f;
      }

      .entity-card h4 {
        margin: 0 0 8px;
        color: #1e3a5f;
      }

      .entity-card p {
        margin: 0;
        font-size: 0.9rem;
        color: #64748b;
      }

      /* Flow Diagram */
      .flow-diagram {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        margin: 20px 0;
      }

      .flow-step {
        display: flex;
        align-items: center;
        gap: 16px;
        width: 100%;
        max-width: 500px;
      }

      .flow-number {
        width: 36px;
        height: 36px;
        background: #1e3a5f;
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        flex-shrink: 0;
      }

      .flow-content {
        flex: 1;
        background: #f8fafc;
        border-radius: 10px;
        padding: 16px;
      }

      .flow-content h4 {
        margin: 0 0 4px;
        color: #1e3a5f;
        font-size: 0.95rem;
      }

      .flow-content p {
        margin: 0;
        font-size: 0.85rem;
      }

      .flow-arrow {
        color: #94a3b8;
        font-size: 1.5rem;
      }

      /* Exports Grid */
      .exports-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 16px;
      }

      .export-card {
        background: #f8fafc;
        border-radius: 12px;
        padding: 20px;
        text-align: center;
      }

      .export-card h4 {
        margin: 0 0 8px;
        color: #1e3a5f;
      }

      .export-card p {
        margin: 0;
        font-size: 0.85rem;
        color: #64748b;
      }

      /* API List */
      .api-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .api-item {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 12px;
        background: #f8fafc;
        border-radius: 8px;
      }

      .api-item code {
        background: #1e3a5f;
        color: white;
        padding: 6px 12px;
        border-radius: 6px;
        font-size: 0.85rem;
        min-width: 280px;
      }

      .api-item span {
        color: #64748b;
        font-size: 0.9rem;
      }

      /* Dependencies Grid */
      .dependencies-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 16px;
      }

      .dep-card {
        background: #f8fafc;
        border-radius: 12px;
        padding: 20px;
        text-align: center;
      }

      .dep-icon {
        font-size: 1.5rem;
        display: block;
        margin-bottom: 8px;
      }

      .dep-card h4 {
        margin: 0 0 4px;
        color: #1e3a5f;
        font-size: 0.95rem;
      }

      .dep-card p {
        margin: 0;
        font-size: 0.8rem;
        color: #64748b;
      }

      /* Run Commands */
      .run-commands {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
      }

      .command-card {
        background: #f8fafc;
        border-radius: 12px;
        padding: 20px;
      }

      .command-card h4 {
        margin: 0 0 12px;
        color: #1e3a5f;
      }

      .command-card code {
        display: block;
        background: #1e3a5f;
        color: white;
        padding: 12px;
        border-radius: 8px;
        font-size: 1rem;
        margin-bottom: 8px;
      }

      .command-card p {
        margin: 0;
        font-size: 0.85rem;
      }
    `,
  ],
})
export class TechnicalArchitectureGuideComponent {
  goBack(): void {
    window.history.back();
  }

  downloadPdf(): void {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(20);
    doc.setTextColor(30, 58, 95);
    doc.text("Smart Mobility Simulator - Technical Architecture Guide", 20, 20);

    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text("System Design & Integration Documentation", 20, 30);
    doc.text("Generated: " + new Date().toLocaleDateString(), 20, 38);

    // Overview
    doc.setFontSize(14);
    doc.setTextColor(30);
    doc.text("Overview", 20, 52);
    doc.setFontSize(10);
    doc.setTextColor(60);
    const overviewText =
      "Smart Mobility Simulator is a two-tier system with Angular SPA frontend and ASP.NET Core API backend, using SQL Server for data storage. It runs congestion simulations, stores results, and produces executive outputs.";
    const overviewLines = doc.splitTextToSize(overviewText, 170);
    doc.text(overviewLines, 20, 60);

    // System Components
    doc.setFontSize(14);
    doc.setTextColor(30);
    doc.text("System Components", 20, 85);
    doc.setFontSize(10);
    doc.setTextColor(60);
    const components = [
      "Backend: SmartMobilitySimulator.API",
      "  - Controllers: Zones, Simulations, RTA, Pitch Deck, Pilot Proposal",
      "  - Services: SimulationEngine, EconomicImpactService, PdfReportService",
      "  - Data: AppDbContext, EF Core migrations",
      "",
      "Frontend: Angular SPA",
      "  - Components: zone-map, simulation-controls, results-dashboard",
      "  - Services: zone, simulation, rta, pilot-proposal",
    ];
    let yPos = 93;
    components.forEach((c) => {
      doc.text(c, 20, yPos);
      yPos += 6;
    });

    // Simulation Flow
    doc.setFontSize(14);
    doc.setTextColor(30);
    doc.text("Simulation Flow", 20, yPos + 10);
    doc.setFontSize(10);
    doc.setTextColor(60);
    const flow = [
      "1. UI Request - Post simulation request (zoneId, date, rules)",
      "2. Data Retrieval - Backend retrieves movement data",
      "3. Simulation Engine - Apply exemptions, diversion thresholds",
      "4. Metrics Computation - Congestion, revenue, CO2 calculated",
      "5. Results - Save and return to UI",
    ];
    yPos += 18;
    flow.forEach((f) => {
      doc.text(f, 25, yPos);
      yPos += 6;
    });

    // APIs
    doc.setFontSize(14);
    doc.setTextColor(30);
    doc.text("Core APIs", 20, yPos + 10);
    doc.setFontSize(10);
    doc.setTextColor(60);
    const apis = [
      "GET /api/zones - List all zones",
      "POST /api/simulations - Run new simulation",
      "GET /api/simulations/{id}/economic-impact - Economic data",
      "GET /api/simulations/{id}/investor-report - PDF report",
      "GET /api/pitch-deck/{simulationId} - Pitch deck data",
      "POST /api/pilot/generate-proposal/{simulationId} - Pilot proposal",
    ];
    yPos += 18;
    apis.forEach((a) => {
      doc.text(a, 25, yPos);
      yPos += 6;
    });

    // Dependencies
    doc.setFontSize(14);
    doc.setTextColor(30);
    doc.text("Key Dependencies", 20, yPos + 10);
    doc.setFontSize(10);
    doc.setTextColor(60);
    const deps = [
      "Backend: QuestPDF (PDF), OpenXML SDK (PPTX), EF Core",
      "Frontend: Leaflet (Maps), jsPDF (PDF exports), html2canvas",
    ];
    yPos += 18;
    deps.forEach((d) => {
      doc.text(d, 25, yPos);
      yPos += 6;
    });

    // Local Run
    doc.setFontSize(14);
    doc.setTextColor(30);
    doc.text("Local Run", 20, yPos + 10);
    doc.setFontSize(10);
    doc.setTextColor(60);
    doc.text("Backend: dotnet run (localhost:5000)", 25, yPos + 18);
    doc.text("Frontend: npm start (localhost:4200)", 25, yPos + 24);

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(
      "Generated by Smart Mobility Simulator - UAE Transport Innovation",
      20,
      280,
    );

    doc.save("Smart-Zone-Technical-Architecture-Guide.pdf");
  }
}



