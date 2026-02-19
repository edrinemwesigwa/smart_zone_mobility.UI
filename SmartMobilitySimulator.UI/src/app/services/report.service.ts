import { Injectable } from "@angular/core";
import { SimulationResult } from "../models/simulation.model";
import { Zone } from "../models/zone.model";

export interface ReportData {
  zone: Zone | null;
  simulationResult: SimulationResult | null;
  config: {
    hourlyRate: number;
    freeHours: number;
    peakMultiplier: number;
    exemptPublicTransport: boolean;
    exemptCommercial: boolean;
    exemptEmergency: boolean;
  };
  generatedAt: Date;
}

@Injectable({
  providedIn: "root",
})
export class ReportService {
  generateExecutiveSummary(data: ReportData): void {
    const reportHtml = this.createExecutiveSummaryHtml(data);
    this.printReport(reportHtml, "Executive_Summary");
  }

  generatePresentationDeck(data: ReportData): void {
    const reportHtml = this.createPresentationDeckHtml(data);
    this.printReport(reportHtml, "Presentation_Deck");
  }

  generateInvestorReport(data: ReportData): void {
    const reportHtml = this.createInvestorReportHtml(data);
    this.printReport(reportHtml, "Investor_Report");
  }

  generateTechnicalReport(data: ReportData): void {
    const reportHtml = this.createTechnicalReportHtml(data);
    this.printReport(reportHtml, "Technical_Report");
  }

  private createExecutiveSummaryHtml(data: ReportData): string {
    const sr = data.simulationResult;
    const zone = data.zone;

    return `
<!DOCTYPE html>
<html>
<head>
  <title>Executive Summary - Smart Mobility Simulator</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
    .header { background: linear-gradient(135deg, #1e3a5f, #0ea5e9); color: white; padding: 40px; }
    .header h1 { font-size: 32px; margin-bottom: 10px; }
    .header p { font-size: 16px; opacity: 0.9; }
    .content { padding: 40px; max-width: 900px; margin: 0 auto; }
    .section { margin-bottom: 30px; }
    .section h2 { color: #1e3a5f; border-bottom: 2px solid #0ea5e9; padding-bottom: 10px; margin-bottom: 20px; }
    .metrics-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
    .metric-card { background: #f8fafc; padding: 20px; border-radius: 10px; border-left: 4px solid #0ea5e9; }
    .metric-card.success { border-left-color: #10b981; background: #d1fae5; }
    .metric-value { font-size: 28px; font-weight: bold; color: #1e3a5f; }
    .metric-label { color: #64748b; font-size: 14px; }
    .zone-info { background: #f8fafc; padding: 20px; border-radius: 10px; }
    .zone-info h3 { color: #1e3a5f; margin-bottom: 10px; }
    .findings { background: #fffbeb; padding: 20px; border-radius: 10px; border-left: 4px solid #f59e0b; }
    .findings ul { margin-left: 20px; }
    .findings li { margin-bottom: 8px; }
    .recommendations { background: #dbeafe; padding: 20px; border-radius: 10px; }
    .recommendations ul { margin-left: 20px; }
    .recommendations li { margin-bottom: 8px; }
    .footer { text-align: center; padding: 20px; color: #64748b; font-size: 12px; border-top: 1px solid #e2e8f0; margin-top: 40px; }
    @media print { body { -webkit-print-color-adjust: exact; } }
  </style>
</head>
<body>
  <div class="header">
    <h1>🚗 Smart Mobility Congestion Pricing</h1>
    <h2>Executive Summary Report</h2>
    <p>Generated: ${data.generatedAt.toLocaleDateString()} | Zone: ${zone?.name || "Not selected"}</p>
  </div>
  
  <div class="content">
    <div class="section">
      <h2>📊 Key Performance Indicators</h2>
      <div class="metrics-grid">
        <div class="metric-card success">
          <div class="metric-value">${sr?.congestionReduction?.toFixed(1) || 0}%</div>
          <div class="metric-label">Congestion Reduction</div>
        </div>
        <div class="metric-card">
          <div class="metric-value">AED ${(sr?.estimatedRevenue || 0).toLocaleString()}</div>
          <div class="metric-label">Annual Revenue</div>
        </div>
        <div class="metric-card">
          <div class="metric-value">${(sr?.vehiclesDiverted || 0).toLocaleString()}</div>
          <div class="metric-label">Vehicles Diverted/Day</div>
        </div>
        <div class="metric-card">
          <div class="metric-value">${(sr?.environmentalImpact || 0).toLocaleString()} kg</div>
          <div class="metric-label">CO₂ Reduced/Day</div>
        </div>
      </div>
    </div>

    <div class="section">
      <h2>📍 Zone Analysis</h2>
      <div class="zone-info">
        <h3>${zone?.name || "Not selected"} - ${zone?.emirate || ""}</h3>
        <p><strong>Zone Type:</strong> ${zone?.zoneType || "N/A"}</p>
        <p><strong>Hourly Rate:</strong> AED ${zone?.chargePerHour || data.config.hourlyRate}/hr</p>
        <p><strong>Free Hours:</strong> ${zone?.baseFreeHours || data.config.freeHours} hours</p>
        <p><strong>Peak Multiplier:</strong> ${data.config.peakMultiplier}x</p>
      </div>
    </div>

    <div class="section">
      <h2>💡 Key Findings</h2>
      <div class="findings">
        <ul>
          <li>Implementation of congestion pricing could reduce traffic by <strong>${sr?.congestionReduction?.toFixed(1) || 0}%</strong> during peak hours</li>
          <li>Estimated annual revenue of <strong>AED ${(sr?.estimatedRevenue || 0).toLocaleString()}</strong> for infrastructure improvements</li>
          <li>Environmental impact: <strong>${(sr?.environmentalImpact || 0).toLocaleString()} kg</strong> CO₂ reduction daily</li>
          <li>Equity analysis shows ${sr?.equityImpact?.isRegressive ? "potential regressive impact" : "minimal regressive impact"} requiring mitigation measures</li>
        </ul>
      </div>
    </div>

    <div class="section">
      <h2>✅ Recommendations</h2>
      <div class="recommendations">
        <ul>
          <li>Implement graduated pricing structure to minimize equity concerns</li>
          <li>Introduce exemption programs for low-income commuters</li>
          <li>Reinvest revenue into public transportation improvements</li>
          <li>Launch public awareness campaign before implementation</li>
          <li>Establish monitoring system for continuous optimization</li>
        </ul>
      </div>
    </div>
  </div>

  <div class="footer">
    <p>Smart Mobility Simulator | UAE Ministry of Transport | Generated on ${data.generatedAt.toLocaleString()}</p>
  </div>
</body>
</html>
    `;
  }

  private createPresentationDeckHtml(data: ReportData): string {
    const sr = data.simulationResult;
    const zone = data.zone;

    return `
<!DOCTYPE html>
<html>
<head>
  <title>Presentation Deck - Smart Mobility Simulator</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
    .slide { page-break-after: always; min-height: 100vh; padding: 60px; display: flex; flex-direction: column; justify-content: center; }
    .slide-1 { background: linear-gradient(135deg, #1e3a5f, #0ea5e9); color: white; text-align: center; }
    .slide-1 h1 { font-size: 48px; margin-bottom: 20px; }
    .slide-1 p { font-size: 24px; opacity: 0.9; }
    .slide-2 { background: #fff; }
    .slide-2 h2 { font-size: 36px; color: #1e3a5f; margin-bottom: 40px; }
    .slide-content { max-width: 800px; margin: 0 auto; }
    .stat-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 40px; }
    .stat { text-align: center; padding: 40px; background: #f8fafc; border-radius: 20px; }
    .stat-value { font-size: 48px; font-weight: bold; color: #0ea5e9; }
    .stat-label { font-size: 18px; color: #64748b; margin-top: 10px; }
    .slide-3 { background: #f8fafc; }
    .slide-3 h2 { font-size: 36px; color: #1e3a5f; text-align: center; margin-bottom: 40px; }
    .benefits { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; }
    .benefit { background: white; padding: 30px; border-radius: 15px; text-align: center; }
    .benefit-icon { font-size: 48px; margin-bottom: 15px; }
    .benefit h3 { color: #1e3a5f; margin-bottom: 10px; }
    .footer { position: fixed; bottom: 20px; left: 60px; color: #64748b; font-size: 14px; }
    @media print { body { -webkit-print-color-adjust: exact; } }
  </style>
</head>
<body>
  <div class="slide slide-1">
    <h1>🚗 Smart Mobility Simulator</h1>
    <h2>Congestion Pricing Analysis</h2>
    <p>${zone?.name || "Zone Analysis"} | ${data.generatedAt.toLocaleDateString()}</p>
  </div>
  
  <div class="slide slide-2">
    <div class="slide-content">
      <h2>📊 Projected Impact</h2>
      <div class="stat-grid">
        <div class="stat">
          <div class="stat-value">${sr?.congestionReduction?.toFixed(0) || 0}%</div>
          <div class="stat-label">Traffic Reduction</div>
        </div>
        <div class="stat">
          <div class="stat-value">AED ${((sr?.estimatedRevenue || 0) / 1000).toFixed(0)}K</div>
          <div class="stat-label">Annual Revenue</div>
        </div>
        <div class="stat">
          <div class="stat-value">${(sr?.vehiclesDiverted || 0).toLocaleString()}</div>
          <div class="stat-label">Vehicles/Day</div>
        </div>
        <div class="stat">
          <div class="stat-value">${(sr?.environmentalImpact || 0).toLocaleString()}</div>
          <div class="stat-label">kg CO₂ Saved</div>
        </div>
      </div>
    </div>
  </div>
  
  <div class="slide slide-3">
    <h2>✨ Key Benefits</h2>
    <div class="benefits">
      <div class="benefit">
        <div class="benefit-icon">🚗</div>
        <h3>Reduced Congestion</h3>
        <p>Fewer vehicles on roads during peak hours</p>
      </div>
      <div class="benefit">
        <div class="benefit-icon">🌱</div>
        <h3>Environmental</h3>
        <p>Lower emissions and better air quality</p>
      </div>
      <div class="benefit">
        <div class="benefit-icon">💰</div>
        <h3>Revenue</h3>
        <p>Funds for public transport improvements</p>
      </div>
    </div>
  </div>

  <div class="footer">Smart Mobility Simulator | UAE Ministry of Transport</div>
</body>
</html>
    `;
  }

  private createInvestorReportHtml(data: ReportData): string {
    const sr = data.simulationResult;
    const zone = data.zone;
    const roi = (((sr?.estimatedRevenue || 0) / 1000000) * 100).toFixed(1);

    return `
<!DOCTYPE html>
<html>
<head>
  <title>Investor Report - Smart Mobility Simulator</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; }
    .header { background: #1e3a5f; color: white; padding: 40px; }
    .header h1 { font-size: 28px; }
    .header p { opacity: 0.8; }
    .content { padding: 40px; max-width: 900px; margin: 0 auto; }
    .section { margin-bottom: 30px; }
    .section h2 { color: #1e3a5f; border-bottom: 2px solid #1e3a5f; padding-bottom: 8px; margin-bottom: 20px; }
    .financial-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
    .financial-card { background: #f0fdf4; padding: 25px; border-radius: 10px; text-align: center; }
    .financial-card.highlight { background: #dbeafe; }
    .financial-value { font-size: 24px; font-weight: bold; color: #166534; }
    .financial-value.highlight { color: #1e40af; }
    .financial-label { font-size: 14px; color: #64748b; }
    .roi-section { background: linear-gradient(135deg, #1e3a5f, #0ea5e9); color: white; padding: 30px; border-radius: 15px; text-align: center; margin: 30px 0; }
    .roi-value { font-size: 48px; font-weight: bold; }
    .timeline { background: #f8fafc; padding: 20px; border-radius: 10px; }
    .timeline-item { display: flex; align-items: center; margin-bottom: 15px; }
    .timeline-marker { width: 30px; height: 30px; background: #0ea5e9; border-radius: 50%; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 15px; }
    .risk-table { width: 100%; border-collapse: collapse; }
    .risk-table th, .risk-table td { padding: 12px; text-align: left; border-bottom: 1px solid #e2e8f0; }
    .risk-table th { background: #f8fafc; font-weight: 600; }
    .risk-low { color: #16a34a; }
    .risk-medium { color: #ca8a04; }
  </style>
</head>
<body>
  <div class="header">
    <h1>💼 Investment Analysis Report</h1>
    <p>Smart Mobility Congestion Pricing | ${zone?.name || "Zone Analysis"}</p>
    <p>Generated: ${data.generatedAt.toLocaleDateString()}</p>
  </div>
  
  <div class="content">
    <div class="section">
      <h2>💰 Financial Projections</h2>
      <div class="financial-grid">
        <div class="financial-card">
          <div class="financial-value">AED ${(sr?.estimatedRevenue || 0).toLocaleString()}</div>
          <div class="financial-label">Annual Revenue</div>
        </div>
        <div class="financial-card">
          <div class="financial-value">${(sr?.vehiclesDiverted || 0).toLocaleString()}</div>
          <div class="financial-label">Daily Vehicles Impacted</div>
        </div>
        <div class="financial-card highlight">
          <div class="financial-value highlight">${roi}%</div>
          <div class="financial-label">Projected ROI</div>
        </div>
      </div>
    </div>

    <div class="roi-section">
      <div class="roi-value">${roi}% Return on Investment</div>
      <p>Based on conservative revenue projections and implementation costs</p>
    </div>

    <div class="section">
      <h2>📅 Implementation Timeline</h2>
      <div class="timeline">
        <div class="timeline-item">
          <div class="timeline-marker">1</div>
          <div><strong>Phase 1 (Months 1-3):</strong> Infrastructure setup and system integration</div>
        </div>
        <div class="timeline-item">
          <div class="timeline-marker">2</div>
          <div><strong>Phase 2 (Months 4-6):</strong> Public awareness and soft launch</div>
        </div>
        <div class="timeline-item">
          <div class="timeline-marker">3</div>
          <div><strong>Phase 3 (Months 7-12):</strong> Full implementation and optimization</div>
        </div>
      </div>
    </div>

    <div class="section">
      <h2>⚠️ Risk Assessment</h2>
      <table class="risk-table">
        <tr><th>Risk Factor</th><th>Probability</th><th>Impact</th></tr>
        <tr><td>Public Resistance</td><td class="risk-medium">Medium</td><td>Medium</td></tr>
        <tr><td>Technical Challenges</td><td class="risk-low">Low</td><td>Medium</td></tr>
        <tr><td>Revenue Shortfall</td><td class="risk-medium">Medium</td><td>High</td></tr>
        <tr><td>Regulatory Changes</td><td class="risk-low">Low</td><td>Low</td></tr>
      </table>
    </div>
  </div>
</body>
</html>
    `;
  }

  private createTechnicalReportHtml(data: ReportData): string {
    const zone = data.zone;

    return `
<!DOCTYPE html>
<html>
<head>
  <title>Technical Report - Smart Mobility Simulator</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Courier New', monospace; line-height: 1.6; }
    .header { background: #1e293b; color: white; padding: 30px; }
    .content { padding: 30px; max-width: 900px; margin: 0 auto; }
    .section { margin-bottom: 25px; }
    .section h2 { color: #1e293b; border-bottom: 1px solid #cbd5e1; padding-bottom: 5px; margin-bottom: 15px; }
    .code-block { background: #f1f5f9; padding: 15px; border-radius: 5px; overflow-x: auto; font-size: 12px; }
    .config-table { width: 100%; border-collapse: collapse; }
    .config-table th, .config-table td { padding: 8px; text-align: left; border: 1px solid #cbd5e1; }
    .config-table th { background: #f8fafc; }
    .tech-stack { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; }
    .tech-item { background: #f8fafc; padding: 15px; border-radius: 5px; }
    .tech-item strong { color: #1e293b; }
  </style>
</head>
<body>
  <div class="header">
    <h1>🔧 Technical Specifications</h1>
    <p>Smart Mobility Congestion Pricing System</p>
  </div>
  
  <div class="content">
    <div class="section">
      <h2>Zone Configuration</h2>
      <table class="config-table">
        <tr><th>Parameter</th><th>Value</th></tr>
        <tr><td>Zone ID</td><td>${zone?.id || "N/A"}</td></tr>
        <tr><td>Zone Name</td><td>${zone?.name || "N/A"}</td></tr>
        <tr><td>Emirate</td><td>${zone?.emirate || "N/A"}</td></tr>
        <tr><td>Zone Type</td><td>${zone?.zoneType || "N/A"}</td></tr>
        <tr><td>Hourly Rate</td><td>AED ${zone?.chargePerHour || data.config.hourlyRate}</td></tr>
        <tr><td>Free Hours</td><td>${zone?.baseFreeHours || data.config.freeHours}</td></tr>
        <tr><td>Peak Multiplier</td><td>${data.config.peakMultiplier}x</td></tr>
      </table>
    </div>

    <div class="section">
      <h2>API Endpoints</h2>
      <div class="code-block">
POST /api/simulation/run<br>
{<br>
  "zoneId": "${zone?.id || "string"}",<br>
  "date": "ISO8601 Date",<br>
  "zoneRules": {<br>
    "peakMultiplier": ${data.config.peakMultiplier},<br>
    "exemptions": ["Public Transport", "Commercial", "Emergency"],<br>
    "freeHours": ${data.config.freeHours},<br>
    "customChargePerHour": ${data.config.hourlyRate}<br>
  }<br>
}
      </div>
    </div>

    <div class="section">
      <h2>Technology Stack</h2>
      <div class="tech-stack">
        <div class="tech-item"><strong>Frontend:</strong> Angular 17</div>
        <div class="tech-item"><strong>Charts:</strong> Chart.js</div>
        <div class="tech-item"><strong>Styling:</strong> Tailwind CSS</div>
        <div class="tech-item"><strong>Maps:</strong> Leaflet.js</div>
      </div>
    </div>

    <div class="section">
      <h2>Data Models</h2>
      <div class="code-block">
interface SimulationResult {<br>
  id: string;<br>
  name: string;<br>
  totalVehicles: number;<br>
  vehiclesDiverted: number;<br>
  congestionReduction: number;<br>
  estimatedRevenue: number;<br>
  equityImpact: EquityImpact;<br>
  environmentalImpact: number;<br>
  createdAt: Date;<br>
}
      </div>
    </div>
  </div>
</body>
</html>
    `;
  }

  private printReport(html: string, filename: string): void {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  }
}



