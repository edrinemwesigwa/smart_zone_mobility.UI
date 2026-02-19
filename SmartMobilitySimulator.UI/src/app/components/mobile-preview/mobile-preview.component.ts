import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

interface MobileZone {
  id: string;
  name: string;
  status: "active" | "inactive" | "exempt";
  charge: number;
  remainingFreeTime?: number;
}

interface MobileUser {
  name: string;
  balance: number;
  tripsThisMonth: number;
  totalSaved: number;
}

@Component({
  selector: "app-mobile-preview",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="mobile-preview-container">
      <div class="preview-header">
        <span class="header-icon">📱</span>
        <h1>Mobile App Preview</h1>
        <p>
          Preview how citizens would experience congestion pricing on their
          mobile devices
        </p>
      </div>

      <div class="preview-content">
        <!-- Device Frame -->
        <div class="device-frame">
          <div class="device-notch"></div>
          <div class="device-screen">
            <!-- Status Bar -->
            <div class="status-bar">
              <span>9:41</span>
              <div class="signal-icons">
                <span>📶</span>
                <span>🔋</span>
              </div>
            </div>

            <!-- App Header -->
            <div class="app-header">
              <div class="user-avatar">👤</div>
              <div class="user-info">
                <span class="user-name">{{ currentUser.name }}</span>
                <span class="user-balance"
                  >AED {{ currentUser.balance | number: "1.2-2" }}</span
                >
              </div>
              <div class="notification-bell">🔔</div>
            </div>

            <!-- Quick Stats -->
            <div class="quick-stats">
              <div class="stat-item">
                <span class="stat-value">{{ currentUser.tripsThisMonth }}</span>
                <span class="stat-label">Trips</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">AED {{ currentUser.totalSaved }}</span>
                <span class="stat-label">Saved</span>
              </div>
              <div class="stat-item">
                <span class="stat-value"
                  >{{
                    currentUser.tripsThisMonth * 0.3 | number: "1.0-0"
                  }}
                  kg</span
                >
                <span class="stat-label">CO₂ Reduced</span>
              </div>
            </div>

            <!-- Active Zones -->
            <div class="section-title">Active Zones Near You</div>
            <div class="zones-list">
              <div
                *ngFor="let zone of activeZones"
                class="zone-card"
                [class.active]="zone.status === 'active'"
                [class.exempt]="zone.status === 'exempt'"
                [class.inactive]="zone.status === 'inactive'"
              >
                <div class="zone-info">
                  <span class="zone-name">{{ zone.name }}</span>
                  <span class="zone-status" [class]="zone.status">
                    {{
                      zone.status === "active"
                        ? "Active"
                        : zone.status === "exempt"
                          ? "Exempt"
                          : "Inactive"
                    }}
                  </span>
                </div>
                <div class="zone-charge">
                  <span *ngIf="zone.status === 'active'" class="charge-amount"
                    >AED {{ zone.charge }}</span
                  >
                  <span
                    *ngIf="zone.status === 'active' && zone.remainingFreeTime"
                    class="free-time"
                  >
                    {{ zone.remainingFreeTime }} min free
                  </span>
                </div>
              </div>
            </div>

            <!-- Quick Actions -->
            <div class="quick-actions">
              <button
                class="action-btn"
                (click)="setActiveTab('home')"
                [class.active]="activeTab === 'home'"
              >
                🏠
              </button>
              <button
                class="action-btn"
                (click)="setActiveTab('map')"
                [class.active]="activeTab === 'map'"
              >
                🗺️
              </button>
              <button
                class="action-btn primary"
                (click)="setActiveTab('pay')"
                [class.active]="activeTab === 'pay'"
              >
                💳
              </button>
              <button
                class="action-btn"
                (click)="setActiveTab('history')"
                [class.active]="activeTab === 'history'"
              >
                📊
              </button>
              <button
                class="action-btn"
                (click)="setActiveTab('settings')"
                [class.active]="activeTab === 'settings'"
              >
                ⚙️
              </button>
            </div>

            <!-- Tab Content -->
            <div class="tab-content">
              <!-- Home Tab -->
              <div *ngIf="activeTab === 'home'" class="tab-panel">
                <div class="trip-history">
                  <h4>Recent Trips</h4>
                  <div class="trip-item" *ngFor="let trip of recentTrips">
                    <div class="trip-icon">{{ trip.icon }}</div>
                    <div class="trip-details">
                      <span class="trip-zone">{{ trip.zone }}</span>
                      <span class="trip-time">{{ trip.time }}</span>
                    </div>
                    <div class="trip-charge" [class.free]="trip.charge === 0">
                      {{ trip.charge === 0 ? "FREE" : "AED " + trip.charge }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Map Tab -->
              <div *ngIf="activeTab === 'map'" class="tab-panel">
                <div class="map-placeholder">
                  <span class="map-icon">🗺️</span>
                  <p>Interactive Zone Map</p>
                  <div class="map-zones">
                    <div
                      class="map-zone"
                      *ngFor="let z of mapZones"
                      [style.left.%]="z.x"
                      [style.top.%]="z.y"
                    >
                      {{ z.name }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Payment Tab -->
              <div *ngIf="activeTab === 'pay'" class="tab-panel">
                <div class="payment-section">
                  <h4>Payment Methods</h4>
                  <div class="payment-card selected">
                    <span class="card-icon">💳</span>
                    <span class="card-number">•••• 4242</span>
                    <span class="card-default">Default</span>
                  </div>
                  <div class="payment-card">
                    <span class="card-icon">🏦</span>
                    <span class="card-number">•••• 1234</span>
                  </div>
                  <button class="add-card-btn">+ Add Payment Method</button>
                </div>
                <div class="auto-recharge">
                  <label>
                    <input type="checkbox" [(ngModel)]="autoRecharge" />
                    Auto-recharge when balance below AED 50
                  </label>
                </div>
              </div>

              <!-- History Tab -->
              <div *ngIf="activeTab === 'history'" class="tab-panel">
                <div class="history-section">
                  <h4>Trip History</h4>
                  <div class="month-selector">
                    <button class="month-btn">◀</button>
                    <span>January 2026</span>
                    <button class="month-btn">▶</button>
                  </div>
                  <div class="history-summary">
                    <div class="summary-item">
                      <span class="label">Total Trips</span>
                      <span class="value">24</span>
                    </div>
                    <div class="summary-item">
                      <span class="label">Total Spent</span>
                      <span class="value">AED 285</span>
                    </div>
                    <div class="summary-item">
                      <span class="label">Free Trips</span>
                      <span class="value">8</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Settings Tab -->
              <div *ngIf="activeTab === 'settings'" class="tab-panel">
                <div class="settings-section">
                  <h4>Settings</h4>
                  <div class="setting-item">
                    <span>🔔 Notifications</span>
                    <input type="checkbox" [(ngModel)]="notifications" />
                  </div>
                  <div class="setting-item">
                    <span>📍 Location Services</span>
                    <input type="checkbox" [(ngModel)]="locationServices" />
                  </div>
                  <div class="setting-item">
                    <span>🚗 Exempt Vehicle</span>
                    <span class="setting-value">Add Vehicle</span>
                  </div>
                  <div class="setting-item">
                    <span>👨‍👩‍👧 Family Plan</span>
                    <span class="setting-value">Manage</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Feature Explanations -->
        <div class="feature-list">
          <h3>Mobile App Features</h3>
          <div class="feature-item">
            <span class="feature-icon">📍</span>
            <div class="feature-content">
              <strong>Real-time Zone Detection</strong>
              <p>
                GPS automatically detects when you enter or exit a congestion
                zone
              </p>
            </div>
          </div>
          <div class="feature-item">
            <span class="feature-icon">💰</span>
            <div class="feature-content">
              <strong>Dynamic Pricing Display</strong>
              <p>
                See current charges, free time remaining, and peak hour
                indicators
              </p>
            </div>
          </div>
          <div class="feature-item">
            <span class="feature-icon">📊</span>
            <div class="feature-content">
              <strong>Trip History & Analytics</strong>
              <p>Track spending, carbon footprint, and see how you're saving</p>
            </div>
          </div>
          <div class="feature-item">
            <span class="feature-icon">🔔</span>
            <div class="feature-content">
              <strong>Smart Notifications</strong>
              <p>
                Get alerts for upcoming charges, exemptions, and payment
                reminders
              </p>
            </div>
          </div>
          <div class="feature-item">
            <span class="feature-icon">👨‍👩‍👧</span>
            <div class="feature-content">
              <strong>Family Accounts</strong>
              <p>
                Manage multiple vehicles and family members under one account
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .mobile-preview-container {
        max-width: 1400px;
        margin: 0 auto;
        padding: 20px;
      }

      .preview-header {
        text-align: center;
        margin-bottom: 30px;
      }

      .header-icon {
        font-size: 48px;
        display: block;
        margin-bottom: 16px;
      }

      .preview-header h1 {
        margin: 0 0 8px;
        color: #1e3a5f;
      }

      .preview-header p {
        margin: 0;
        color: #64748b;
      }

      .preview-content {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 40px;
        align-items: start;
      }

      /* Device Frame */
      .device-frame {
        width: 320px;
        height: 650px;
        background: #1a1a2e;
        border-radius: 40px;
        padding: 12px;
        margin: 0 auto;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      }

      .device-notch {
        width: 120px;
        height: 24px;
        background: #1a1a2e;
        border-radius: 20px;
        margin: 0 auto 10px;
      }

      .device-screen {
        width: 100%;
        height: 100%;
        background: linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%);
        border-radius: 30px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
      }

      .status-bar {
        display: flex;
        justify-content: space-between;
        padding: 8px 16px;
        font-size: 12px;
        font-weight: 600;
        color: #1a1a2e;
      }

      .signal-icons {
        display: flex;
        gap: 4px;
      }

      .app-header {
        display: flex;
        align-items: center;
        padding: 12px 16px;
        background: white;
        gap: 12px;
      }

      .user-avatar {
        width: 40px;
        height: 40px;
        background: #3b82f6;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
      }

      .user-info {
        flex: 1;
        display: flex;
        flex-direction: column;
      }

      .user-name {
        font-weight: 600;
        font-size: 14px;
        color: #1e293b;
      }

      .user-balance {
        font-size: 12px;
        color: #10b981;
        font-weight: 600;
      }

      .notification-bell {
        font-size: 20px;
      }

      .quick-stats {
        display: flex;
        padding: 16px;
        gap: 12px;
      }

      .stat-item {
        flex: 1;
        background: white;
        border-radius: 12px;
        padding: 12px;
        text-align: center;
      }

      .stat-value {
        display: block;
        font-size: 18px;
        font-weight: 700;
        color: #1e3a5f;
      }

      .stat-label {
        font-size: 11px;
        color: #64748b;
      }

      .section-title {
        padding: 0 16px 8px;
        font-size: 13px;
        font-weight: 600;
        color: #64748b;
      }

      .zones-list {
        padding: 0 16px;
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .zone-card {
        background: white;
        border-radius: 12px;
        padding: 12px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-right: 4px solid #94a3b8;
      }

      .zone-card.active {
        border-right-color: #3b82f6;
      }

      .zone-card.exempt {
        border-right-color: #10b981;
      }

      .zone-info {
        display: flex;
        flex-direction: column;
      }

      .zone-name {
        font-weight: 600;
        font-size: 14px;
        color: #1e293b;
      }

      .zone-status {
        font-size: 11px;
      }

      .zone-status.active {
        color: #3b82f6;
      }
      .zone-status.exempt {
        color: #10b981;
      }
      .zone-status.inactive {
        color: #94a3b8;
      }

      .zone-charge {
        text-align: right;
      }

      .charge-amount {
        display: block;
        font-weight: 700;
        color: #dc2626;
        font-size: 16px;
      }

      .free-time {
        font-size: 11px;
        color: #10b981;
      }

      .quick-actions {
        display: flex;
        justify-content: space-around;
        padding: 12px;
        background: white;
        margin-top: auto;
        border-top: 1px solid #e2e8f0;
      }

      .action-btn {
        width: 44px;
        height: 44px;
        border-radius: 12px;
        border: none;
        background: transparent;
        font-size: 20px;
        cursor: pointer;
        transition: all 0.2s;
      }

      .action-btn.active {
        background: #3b82f6;
      }

      .action-btn.primary {
        width: 56px;
        height: 56px;
        background: linear-gradient(135deg, #3b82f6, #0ea5e9);
        margin-top: -20px;
      }

      .tab-content {
        flex: 1;
        overflow-y: auto;
        padding: 12px;
      }

      .tab-panel {
        background: white;
        border-radius: 16px;
        padding: 16px;
      }

      .trip-history h4,
      .payment-section h4,
      .history-section h4,
      .settings-section h4 {
        margin: 0 0 12px;
        color: #1e3a5f;
      }

      .trip-item {
        display: flex;
        align-items: center;
        padding: 12px 0;
        border-bottom: 1px solid #e2e8f0;
      }

      .trip-icon {
        font-size: 24px;
        margin-right: 12px;
      }

      .trip-details {
        flex: 1;
        display: flex;
        flex-direction: column;
      }

      .trip-zone {
        font-weight: 600;
        font-size: 14px;
        color: #1e293b;
      }

      .trip-time {
        font-size: 12px;
        color: #64748b;
      }

      .trip-charge {
        font-weight: 600;
        color: #dc2626;
      }

      .trip-charge.free {
        color: #10b981;
      }

      .map-placeholder {
        text-align: center;
        padding: 40px 20px;
        background: #e2e8f0;
        border-radius: 12px;
        position: relative;
        height: 300px;
      }

      .map-icon {
        font-size: 48px;
        display: block;
        margin-bottom: 12px;
      }

      .map-zones {
        position: absolute;
        inset: 0;
      }

      .map-zone {
        position: absolute;
        background: #3b82f6;
        color: white;
        padding: 4px 8px;
        border-radius: 8px;
        font-size: 11px;
        transform: translate(-50%, -50%);
      }

      .payment-card {
        display: flex;
        align-items: center;
        padding: 16px;
        background: #f8fafc;
        border-radius: 12px;
        margin-bottom: 8px;
        border: 2px solid transparent;
      }

      .payment-card.selected {
        border-color: #3b82f6;
        background: #eff6ff;
      }

      .card-icon {
        font-size: 24px;
        margin-right: 12px;
      }

      .card-number {
        flex: 1;
        font-weight: 600;
      }

      .card-default {
        font-size: 11px;
        background: #10b981;
        color: white;
        padding: 2px 8px;
        border-radius: 4px;
      }

      .add-card-btn {
        width: 100%;
        padding: 12px;
        background: white;
        border: 2px dashed #e2e8f0;
        border-radius: 12px;
        color: #64748b;
        cursor: pointer;
      }

      .auto-recharge {
        margin-top: 16px;
        padding: 12px;
        background: #f8fafc;
        border-radius: 8px;
      }

      .month-selector {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
      }

      .month-btn {
        background: none;
        border: none;
        font-size: 18px;
        cursor: pointer;
      }

      .history-summary {
        display: flex;
        gap: 12px;
      }

      .summary-item {
        flex: 1;
        background: #f8fafc;
        padding: 12px;
        border-radius: 8px;
        text-align: center;
      }

      .summary-item .label {
        display: block;
        font-size: 11px;
        color: #64748b;
      }

      .summary-item .value {
        display: block;
        font-weight: 700;
        color: #1e3a5f;
      }

      .setting-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px 0;
        border-bottom: 1px solid #e2e8f0;
      }

      .setting-value {
        color: #3b82f6;
        font-size: 14px;
      }

      /* Feature List */
      .feature-list h3 {
        margin: 0 0 20px;
        color: #1e3a5f;
      }

      .feature-item {
        display: flex;
        gap: 16px;
        padding: 16px;
        background: white;
        border-radius: 12px;
        margin-bottom: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      }

      .feature-icon {
        font-size: 32px;
      }

      .feature-content strong {
        display: block;
        color: #1e293b;
        margin-bottom: 4px;
      }

      .feature-content p {
        margin: 0;
        font-size: 13px;
        color: #64748b;
      }

      @media (max-width: 900px) {
        .preview-content {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class MobilePreviewComponent implements OnInit {
  currentUser: MobileUser = {
    name: "Ahmed Al Mansouri",
    balance: 125.5,
    tripsThisMonth: 24,
    totalSaved: 45,
  };

  activeZones: MobileZone[] = [
    {
      id: "1",
      name: "Dubai Marina",
      status: "active",
      charge: 15,
      remainingFreeTime: 30,
    },
    { id: "2", name: "Business Bay", status: "exempt", charge: 0 },
    {
      id: "3",
      name: "Downtown Dubai",
      status: "active",
      charge: 25,
      remainingFreeTime: 0,
    },
    { id: "4", name: "Deira", status: "inactive", charge: 0 },
  ];

  recentTrips = [
    { icon: "🚗", zone: "Dubai Marina", time: "Today, 9:15 AM", charge: 0 },
    {
      icon: "🚗",
      zone: "Business Bay",
      time: "Yesterday, 6:30 PM",
      charge: 12,
    },
    {
      icon: "🚗",
      zone: "Downtown Dubai",
      time: "Yesterday, 8:45 AM",
      charge: 25,
    },
    { icon: "🚗", zone: "Al Barsha", time: "Jan 13, 5:00 PM", charge: 0 },
  ];

  mapZones = [
    { name: "Marina", x: 30, y: 40 },
    { name: "Business Bay", x: 50, y: 60 },
    { name: "Downtown", x: 45, y: 35 },
  ];

  activeTab = "home";
  autoRecharge = true;
  notifications = true;
  locationServices = true;

  ngOnInit(): void {}

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}



