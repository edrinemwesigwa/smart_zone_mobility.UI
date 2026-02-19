import { Component } from "@angular/core";
import { jsPDF } from "jspdf";

@Component({
  selector: "app-business-admin-guide",
  template: `
    <div class="doc-container">
      <!-- Header -->
      <div class="doc-header">
        <div class="header-content">
          <button class="back-btn" (click)="goBack()">
            ← Back to Dashboard
          </button>
          <h1>📋 Business & Administrative Guide</h1>
          <p class="subtitle">
            Comprehensive guide for UAE transport agencies and stakeholders
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
          <h2>🎯 Purpose</h2>
          <p>
            This guide explains the business value, governance, and
            administrative operations of Smart Mobility Simulator so non‑technical
            stakeholders can understand how the system supports decision‑making,
            budgeting, and policy rollout.
          </p>
        </section>

        <section class="doc-section">
          <h2>📊 Executive Summary</h2>
          <p>
            Smart Mobility Simulator helps UAE transport agencies model congestion
            pricing, compare policy options, and prepare stakeholder-ready
            outputs (pilot proposal, business case, pitch deck, demo scripts).
            It reduces decision risk by quantifying outcomes before rollout.
          </p>
        </section>

        <section class="doc-section">
          <h2>🎯 Key Business Objectives</h2>
          <ul>
            <li>Reduce congestion in high‑impact zones</li>
            <li>Improve equity (fairness across income brackets)</li>
            <li>Generate sustainable revenue for mobility upgrades</li>
            <li>Provide transparent, data‑driven policy justifications</li>
            <li>Support phased rollout with measurable KPIs</li>
          </ul>
        </section>

        <section class="doc-section">
          <h2>👥 Who Uses It</h2>
          <div class="stakeholder-grid">
            <div class="stakeholder-card">
              <span class="stakeholder-icon">👔</span>
              <h4>Executive Sponsors</h4>
              <p>Approve policy and budgets</p>
            </div>
            <div class="stakeholder-card">
              <span class="stakeholder-icon">⚙️</span>
              <h4>Operations & Planning</h4>
              <p>Design zone rules, exemptions</p>
            </div>
            <div class="stakeholder-card">
              <span class="stakeholder-icon">💰</span>
              <h4>Finance</h4>
              <p>Review ROI/NPV and revenue projections</p>
            </div>
            <div class="stakeholder-card">
              <span class="stakeholder-icon">📢</span>
              <h4>Public Affairs</h4>
              <p>Shape messaging and fairness narrative</p>
            </div>
            <div class="stakeholder-card">
              <span class="stakeholder-icon">💻</span>
              <h4>Technology Teams</h4>
              <p>Oversee data integrations and rollout</p>
            </div>
          </div>
        </section>

        <section class="doc-section">
          <h2>📦 Core Business Outputs</h2>
          <div class="outputs-list">
            <div class="output-item">
              <span class="output-number">1</span>
              <div>
                <h4>Simulation Results</h4>
                <p>Congestion reduction, revenue, CO₂ impact</p>
              </div>
            </div>
            <div class="output-item">
              <span class="output-number">2</span>
              <div>
                <h4>Economic Impact</h4>
                <p>
                  Equity impact, 5‑year revenue projection, productivity gains
                </p>
              </div>
            </div>
            <div class="output-item">
              <span class="output-number">3</span>
              <div>
                <h4>Pilot Proposal</h4>
                <p>Cost breakdown, timeline, risks, next steps</p>
              </div>
            </div>
            <div class="output-item">
              <span class="output-number">4</span>
              <div>
                <h4>Business Case</h4>
                <p>ROI, NPV, payback period, sensitivity analysis</p>
              </div>
            </div>
            <div class="output-item">
              <span class="output-number">5</span>
              <div>
                <h4>Pitch Deck</h4>
                <p>Executive‑ready slides for leadership and partners</p>
              </div>
            </div>
            <div class="output-item">
              <span class="output-number">6</span>
              <div>
                <h4>Demo Mode</h4>
                <p>One‑click scenarios with scripted narratives</p>
              </div>
            </div>
          </div>
        </section>

        <section class="doc-section">
          <h2>📋 Administrative Workflow</h2>
          <div class="workflow-steps">
            <div class="workflow-step">
              <div class="step-number">1</div>
              <div class="step-content">
                <h4>Define the Zone</h4>
                <ul>
                  <li>
                    Select a high‑impact zone (e.g., Marina, Mussafah, Academic
                    City)
                  </li>
                  <li>
                    Confirm boundary and zone type
                    (residential/commercial/industrial)
                  </li>
                </ul>
              </div>
            </div>
            <div class="workflow-step">
              <div class="step-number">2</div>
              <div class="step-content">
                <h4>Configure Rules & Exemptions</h4>
                <ul>
                  <li>Free hours and charge per hour</li>
                  <li>
                    Exemptions (Public Transport, Commercial, Emergency,
                    Diplomatic, etc.)
                  </li>
                  <li>Diversion thresholds</li>
                </ul>
              </div>
            </div>
            <div class="workflow-step">
              <div class="step-number">3</div>
              <div class="step-content">
                <h4>Run Simulation</h4>
                <ul>
                  <li>Choose date</li>
                  <li>
                    Generate results for congestion, revenue, equity, and
                    environmental impact
                  </li>
                </ul>
              </div>
            </div>
            <div class="workflow-step">
              <div class="step-number">4</div>
              <div class="step-content">
                <h4>Review & Approve</h4>
                <ul>
                  <li>Compare policy options</li>
                  <li>Validate fairness and operational feasibility</li>
                  <li>Approve pilot parameters</li>
                </ul>
              </div>
            </div>
            <div class="workflow-step">
              <div class="step-number">5</div>
              <div class="step-content">
                <h4>Produce Stakeholder Pack</h4>
                <ul>
                  <li>Pilot proposal (PDF)</li>
                  <li>Business case summary</li>
                  <li>Pitch deck (PPTX/PDF)</li>
                  <li>Demo script for live presentation</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section class="doc-section">
          <h2>🛡️ Governance & Compliance</h2>
          <ul>
            <li>
              <strong>Policy Alignment</strong>: rules align to Emirate
              transport policies
            </li>
            <li>
              <strong>Equity Assessment</strong>: built‑in fairness indicators
            </li>
            <li>
              <strong>Data Governance</strong>: anonymized movement data and
              privacy controls
            </li>
            <li>
              <strong>Auditability</strong>: stored simulation results and
              generated outputs
            </li>
          </ul>
        </section>

        <section class="doc-section">
          <h2>💵 Budgeting & Financial Planning</h2>
          <ul>
            <li>Pilot cost model (baseline + integrations)</li>
            <li>Revenue projections with sensitivity analysis</li>
            <li>Payback and ROI computed from simulation metrics</li>
          </ul>
        </section>

        <section class="doc-section">
          <h2>📢 Stakeholder Messaging</h2>
          <ul>
            <li>Use Pitch Deck Generator for leadership briefings</li>
            <li>Use Demo Mode for public consultations</li>
            <li>Emphasize equity exemptions and reinvestment in mobility</li>
          </ul>
        </section>

        <section class="doc-section">
          <h2>📈 Recommended KPIs</h2>
          <div class="kpi-grid">
            <div class="kpi-item">🚗 Congestion reduction %</div>
            <div class="kpi-item">💰 Revenue (daily/monthly/annual)</div>
            <div class="kpi-item">⚖️ Equity burden ratio</div>
            <div class="kpi-item">🌿 CO₂ reduction</div>
            <div class="kpi-item">😊 Public sentiment improvement</div>
          </div>
        </section>

        <section class="doc-section">
          <h2>🚀 Deployment Phases</h2>
          <div class="phases-list">
            <div class="phase-item">
              <span class="phase-badge">Phase 1</span>
              <h4>Pilot</h4>
              <p>3–6 months</p>
            </div>
            <div class="phase-item">
              <span class="phase-badge">Phase 2</span>
              <h4>Evaluation</h4>
              <p>1–2 months</p>
            </div>
            <div class="phase-item">
              <span class="phase-badge">Phase 3</span>
              <h4>Scaled Rollout</h4>
              <p>6–12 months</p>
            </div>
          </div>
        </section>

        <section class="doc-section">
          <h2>👥 Operational Roles & Responsibilities</h2>
          <div class="roles-grid">
            <div class="role-card">
              <h4>Program Owner</h4>
              <p>Overall governance</p>
            </div>
            <div class="role-card">
              <h4>Policy Lead</h4>
              <p>Exemptions and pricing policy</p>
            </div>
            <div class="role-card">
              <h4>Finance Lead</h4>
              <p>ROI and budget approvals</p>
            </div>
            <div class="role-card">
              <h4>Data Lead</h4>
              <p>Movement data validation</p>
            </div>
            <div class="role-card">
              <h4>Communications Lead</h4>
              <p>Public messaging</p>
            </div>
          </div>
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

      /* Stakeholder Grid */
      .stakeholder-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 16px;
      }

      .stakeholder-card {
        background: #f8fafc;
        border-radius: 12px;
        padding: 20px;
        text-align: center;
      }

      .stakeholder-icon {
        font-size: 2rem;
        display: block;
        margin-bottom: 8px;
      }

      .stakeholder-card h4 {
        margin: 0 0 4px;
        color: #1e3a5f;
        font-size: 0.95rem;
      }

      .stakeholder-card p {
        margin: 0;
        font-size: 0.8rem;
        color: #64748b;
      }

      /* Outputs List */
      .outputs-list {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .output-item {
        display: flex;
        align-items: flex-start;
        gap: 16px;
        padding: 16px;
        background: #f8fafc;
        border-radius: 10px;
      }

      .output-number {
        width: 32px;
        height: 32px;
        background: #1e3a5f;
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        flex-shrink: 0;
      }

      .output-item h4 {
        margin: 0 0 4px;
        color: #1e3a5f;
      }

      .output-item p {
        margin: 0;
        font-size: 0.9rem;
      }

      /* Workflow Steps */
      .workflow-steps {
        display: flex;
        flex-direction: column;
        gap: 20px;
      }

      .workflow-step {
        display: flex;
        gap: 16px;
      }

      .step-number {
        width: 40px;
        height: 40px;
        background: linear-gradient(135deg, #1e3a5f, #0ea5e9);
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        flex-shrink: 0;
      }

      .step-content {
        flex: 1;
        background: #f8fafc;
        border-radius: 12px;
        padding: 20px;
      }

      .step-content h4 {
        margin: 0 0 12px;
        color: #1e3a5f;
      }

      .step-content ul {
        margin: 0;
        padding-left: 20px;
      }

      /* KPI Grid */
      .kpi-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 12px;
      }

      .kpi-item {
        background: #eff6ff;
        color: #1e40af;
        padding: 12px 16px;
        border-radius: 8px;
        font-weight: 500;
        text-align: center;
      }

      /* Phases */
      .phases-list {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 16px;
      }

      .phase-item {
        background: #f8fafc;
        border-radius: 12px;
        padding: 20px;
        text-align: center;
      }

      .phase-badge {
        display: inline-block;
        background: #1e3a5f;
        color: white;
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 0.75rem;
        font-weight: 600;
        margin-bottom: 8px;
      }

      .phase-item h4 {
        margin: 0 0 4px;
        color: #1e3a5f;
      }

      .phase-item p {
        margin: 0;
        color: #64748b;
      }

      /* Roles */
      .roles-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 16px;
      }

      .role-card {
        background: #f8fafc;
        border-radius: 12px;
        padding: 20px;
        border-left: 3px solid #1e3a5f;
      }

      .role-card h4 {
        margin: 0 0 4px;
        color: #1e3a5f;
        font-size: 0.95rem;
      }

      .role-card p {
        margin: 0;
        font-size: 0.85rem;
        color: #64748b;
      }
    `,
  ],
})
export class BusinessAdminGuideComponent {
  goBack(): void {
    window.history.back();
  }

  downloadPdf(): void {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(20);
    doc.setTextColor(30, 58, 95);
    doc.text("Smart Mobility Simulator - Business & Administrative Guide", 20, 20);

    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text("UAE Government Stakeholder Report", 20, 30);
    doc.text("Generated: " + new Date().toLocaleDateString(), 20, 38);

    // Content
    doc.setFontSize(14);
    doc.setTextColor(30);
    doc.text("Purpose", 20, 52);
    doc.setFontSize(10);
    doc.setTextColor(60);
    const purposeText =
      "This guide explains the business value, governance, and administrative operations of Smart Mobility Simulator so non-technical stakeholders can understand how the system supports decision-making, budgeting, and policy rollout.";
    const purposeLines = doc.splitTextToSize(purposeText, 170);
    doc.text(purposeLines, 20, 60);

    // Executive Summary
    doc.setFontSize(14);
    doc.setTextColor(30);
    doc.text("Executive Summary", 20, 85);
    doc.setFontSize(10);
    doc.setTextColor(60);
    const execText =
      "Smart Mobility Simulator helps UAE transport agencies model congestion pricing, compare policy options, and prepare stakeholder-ready outputs (pilot proposal, business case, pitch deck, demo scripts). It reduces decision risk by quantifying outcomes before rollout.";
    const execLines = doc.splitTextToSize(execText, 170);
    doc.text(execLines, 20, 93);

    // Key Business Objectives
    doc.setFontSize(14);
    doc.setTextColor(30);
    doc.text("Key Business Objectives", 20, 118);
    doc.setFontSize(10);
    doc.setTextColor(60);
    const objectives = [
      "• Reduce congestion in high-impact zones",
      "• Improve equity (fairness across income brackets)",
      "• Generate sustainable revenue for mobility upgrades",
      "• Provide transparent, data-driven policy justifications",
      "• Support phased rollout with measurable KPIs",
    ];
    let yPos = 126;
    objectives.forEach((obj) => {
      doc.text(obj, 25, yPos);
      yPos += 7;
    });

    // Core Business Outputs
    doc.setFontSize(14);
    doc.setTextColor(30);
    doc.text("Core Business Outputs", 20, yPos + 10);
    doc.setFontSize(10);
    doc.setTextColor(60);
    const outputs = [
      "1. Simulation Results - Congestion reduction, revenue, CO2 impact",
      "2. Economic Impact - Equity impact, 5-year revenue projection",
      "3. Pilot Proposal - Cost breakdown, timeline, risks",
      "4. Business Case - ROI, NPV, payback period",
      "5. Pitch Deck - Executive-ready slides",
      "6. Demo Mode - One-click scenarios",
    ];
    yPos += 18;
    outputs.forEach((out) => {
      doc.text(out, 25, yPos);
      yPos += 7;
    });

    // Deployment Phases
    doc.setFontSize(14);
    doc.setTextColor(30);
    doc.text("Deployment Phases", 20, yPos + 10);
    doc.setFontSize(10);
    doc.setTextColor(60);
    const phases = [
      "Phase 1: Pilot (3-6 months)",
      "Phase 2: Evaluation (1-2 months)",
      "Phase 3: Scaled Rollout (6-12 months)",
    ];
    yPos += 18;
    phases.forEach((phase) => {
      doc.text(phase, 25, yPos);
      yPos += 7;
    });

    // Governance
    doc.setFontSize(14);
    doc.setTextColor(30);
    doc.text("Governance & Compliance", 20, yPos + 10);
    doc.setFontSize(10);
    doc.setTextColor(60);
    const governance = [
      "• Policy Alignment with Emirate transport policies",
      "• Equity Assessment with built-in fairness indicators",
      "• Data Governance with anonymized movement data",
      "• Auditability with stored simulation results",
    ];
    yPos += 18;
    governance.forEach((g) => {
      doc.text(g, 25, yPos);
      yPos += 7;
    });

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(
      "Generated by Smart Mobility Simulator - UAE Transport Innovation",
      20,
      280,
    );

    doc.save("Smart-Zone-Business-Admin-Guide.pdf");
  }
}



