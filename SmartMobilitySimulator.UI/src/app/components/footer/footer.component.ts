import { Component, OnInit } from "@angular/core";
import { RouterLink } from "@angular/router";
import { AsyncPipe } from "@angular/common";
import { ThemeService } from "../../services/theme.service";

@Component({
  selector: "app-footer",
  template: `
    <footer class="main-footer" [class.dark]="isDark$ | async">
      <div class="footer-content">
        <div class="footer-brand">
          <div class="brand-text">
            <span class="brand-name">Smart Mobility Simulator</span>
            <span class="brand-tagline"
              >UAE Congestion Pricing Decision Support</span
            >
          </div>
        </div>

        <div class="footer-links">
          <div class="link-group">
            <h4>Navigation</h4>
            <a routerLink="/home">Home</a>
            <a routerLink="/zone-map">Zone Map</a>
            <a routerLink="/simulation-controls">Simulation</a>
            <a routerLink="/results-dashboard">Results</a>
          </div>

          <div class="link-group">
            <h4>Reports</h4>
            <a routerLink="/pilot-proposal">Pilot Proposal</a>
            <a routerLink="/pitch-deck">Pitch Deck</a>
            <a routerLink="/business-case">Business Case</a>
            <a routerLink="/authority-report">Authority Report</a>
          </div>

          <div class="link-group">
            <h4>Resources</h4>
            <a routerLink="/uae-facts-dashboard">UAE Facts</a>
            <a routerLink="/demo-mode">Demo Mode</a>
            <a routerLink="/zone-editor">Zone Editor</a>
            <a routerLink="/authority-selection">Authorities</a>
          </div>

          <div class="link-group">
            <h4>Documentation</h4>
            <a
              href="/assets/docs/technical-architecture-guide.pdf"
              target="_blank"
              >Technical Guide</a
            >
            <a
              href="/assets/docs/business-administrative-guide.pdf"
              target="_blank"
              >Business Guide</a
            >
          </div>
        </div>

        <div class="footer-bottom">
          <div class="disclaimer">
            <p>
              <strong>Disclaimer:</strong> This is a decision-support simulator.
              Outputs are estimates intended for planning purposes; real-world
              outcomes require pilot validation and official modeling.
            </p>
          </div>
          <div class="footer-info">
            <span class="version">Version 1.0</span>
            <span class="separator">|</span>
            <span class="copyright">© 2026 Smart Mobility Simulator</span>
            <span class="separator">|</span>
            <span class="uae-themed">UAE 🇦🇪</span>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [
    `
      .main-footer {
        background: linear-gradient(
          180deg,
          rgba(13, 71, 161, 0.05) 0%,
          rgba(13, 71, 161, 0.1) 100%
        );
        border-top: 1px solid rgba(13, 71, 161, 0.1);
        padding: 3rem 2rem 1.5rem;
        margin-top: auto;
      }

      :host-context(.dark) .main-footer {
        background: linear-gradient(
          180deg,
          rgba(15, 23, 42, 0.8) 0%,
          rgba(15, 23, 42, 0.9) 100%
        );
        border-top-color: rgba(255, 255, 255, 0.08);
      }

      .footer-content {
        max-width: 1400px;
        margin: 0 auto;
      }

      .footer-brand {
        margin-bottom: 2rem;
      }

      .brand-text {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }

      .brand-name {
        font-size: 1.5rem;
        font-weight: 800;
        background: linear-gradient(135deg, #0d47a1 0%, #f59e0b 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .brand-tagline {
        font-size: 0.875rem;
        color: #64748b;
      }

      :host-context(.dark) .brand-tagline {
        color: #94a3b8;
      }

      .footer-links {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 2rem;
        margin-bottom: 2rem;
        padding-bottom: 2rem;
        border-bottom: 1px solid rgba(13, 71, 161, 0.1);
      }

      :host-context(.dark) .footer-links {
        border-bottom-color: rgba(255, 255, 255, 0.08);
      }

      .link-group h4 {
        font-size: 0.875rem;
        font-weight: 600;
        color: #0d47a1;
        margin-bottom: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      :host-context(.dark) .link-group h4 {
        color: #60a5fa;
      }

      .link-group a {
        display: block;
        font-size: 0.875rem;
        color: #475569;
        text-decoration: none;
        padding: 0.25rem 0;
        transition: color 0.2s ease;
      }

      :host-context(.dark) .link-group a {
        color: #94a3b8;
      }

      .link-group a:hover {
        color: #f59e0b;
      }

      .footer-bottom {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .disclaimer {
        padding: 1rem;
        background: rgba(245, 158, 11, 0.1);
        border-radius: 8px;
        border-left: 3px solid #f59e0b;
      }

      :host-context(.dark) .disclaimer {
        background: rgba(245, 158, 11, 0.05);
      }

      .disclaimer p {
        font-size: 0.75rem;
        color: #64748b;
        margin: 0;
        line-height: 1.5;
      }

      :host-context(.dark) .disclaimer p {
        color: #94a3b8;
      }

      .footer-info {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.75rem;
        font-size: 0.75rem;
        color: #94a3b8;
      }

      .separator {
        color: #cbd5e1;
      }

      .version {
        font-weight: 600;
        color: #0d47a1;
      }

      :host-context(.dark) .version {
        color: #60a5fa;
      }

      .uae-themed {
        color: #f59e0b;
      }

      @media (max-width: 768px) {
        .footer-links {
          grid-template-columns: repeat(2, 1fr);
        }

        .footer-info {
          flex-wrap: wrap;
          justify-content: center;
          text-align: center;
        }
      }
    `,
  ],
})
export class FooterComponent implements OnInit {
  isDark$ = this.themeService.darkMode$;

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {}
}



