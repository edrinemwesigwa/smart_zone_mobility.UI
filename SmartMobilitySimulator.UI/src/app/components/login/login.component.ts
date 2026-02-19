import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService, LoginRequest } from "../../services/auth.service";
import { ToastService } from "../../services/toast.service";

@Component({
  selector: "app-login",
  template: `
    <!-- UAE Themed Animated Background -->
    <div class="login-container">
      <!-- Animated Sky Gradient -->
      <div class="sky-gradient"></div>

      <!-- Sun/moon -->
      <div class="sun"></div>

      <!-- Clouds -->
      <div class="cloud cloud-1"></div>
      <div class="cloud cloud-2"></div>
      <div class="cloud cloud-3"></div>

      <!-- Flying plane -->
      <div class="plane">✈️</div>

      <!-- Palm trees left -->
      <div class="palm-tree palm-left-1">🌴</div>
      <div class="palm-tree palm-left-2">🌴</div>
      <div class="palm-tree palm-left-3">🌴</div>

      <!-- Palm trees right -->
      <div class="palm-tree palm-right-1">🌴</div>
      <div class="palm-tree palm-right-2">🌴</div>
      <div class="palm-tree palm-right-3">🌴</div>

      <!-- Dubai Skyline Silhouette -->
      <div class="skyline">
        <div class="building b1"></div>
        <div class="building b2"></div>
        <div class="building b3"></div>
        <div class="building b4"></div>
        <div class="building b5 burj-khalifa"></div>
        <div class="building b6"></div>
        <div class="building b7"></div>
        <div class="building b8"></div>
        <div class="building b9"></div>
      </div>

      <!-- Water reflection -->
      <div class="water"></div>

      <!-- Floating lights -->
      <div class="light l1"></div>
      <div class="light l2"></div>
      <div class="light l3"></div>
      <div class="light l4"></div>
      <div class="light l5"></div>

      <!-- Car on road -->
      <div class="car">🚗</div>

      <!-- Login Card -->
      <div class="login-card">
        <div class="card-header">
          <div class="logo-icon">🛣️</div>
          <h1 class="title">Smart Mobility Simulator</h1>
          <p class="subtitle">UAE Congestion Pricing Analytics</p>
        </div>

        <!-- Login Form -->
        <form (ngSubmit)="onLogin()" #loginForm="ngForm">
          <div class="input-group">
            <label for="email">Email Address</label>
            <div class="input-wrapper">
              <span class="input-icon">✉️</span>
              <input
                type="email"
                id="email"
                name="email"
                [(ngModel)]="loginRequest.email"
                required
                email
                placeholder="admin@smartmobility.ae"
              />
            </div>
          </div>

          <div class="input-group">
            <label for="password">Password</label>
            <div class="input-wrapper">
              <span class="input-icon">🔒</span>
              <input
                type="password"
                id="password"
                name="password"
                [(ngModel)]="loginRequest.password"
                required
                placeholder="••••••••"
              />
            </div>
          </div>

          <div *ngIf="errorMessage" class="error-message">
            <span>⚠️</span> {{ errorMessage }}
          </div>

          <button
            type="submit"
            [disabled]="isLoading || !loginForm.valid"
            class="login-btn"
          >
            <span *ngIf="isLoading" class="loading-spinner"></span>
            <span *ngIf="!isLoading">🚀 Sign In</span>
          </button>

          <div class="card-footer">
            <p class="demo-hint">
              <span>💡</span> For access, contact your system administrator
            </p>
          </div>
        </form>

        <!-- UAE Flag decorative -->
        <div class="uae-flag">
          <div class="flag-red"></div>
          <div class="flag-green"></div>
          <div class="flag-white"></div>
          <div class="flag-black"></div>
        </div>
      </div>

      <!-- Bottom wave decoration -->
      <div class="wave"></div>
    </div>
  `,
  styles: [
    `
      .login-container {
        min-height: 100vh;
        position: relative;
        overflow: hidden;
        background: linear-gradient(
          180deg,
          #1a1a2e 0%,
          #16213e 50%,
          #0f3460 100%
        );
      }

      .sky-gradient {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 60%;
        background: linear-gradient(
          180deg,
          #0d1b2a 0%,
          #1b263b 30%,
          #415a77 60%,
          #778da9 80%,
          #e0e1dd 100%
        );
        animation: skyShift 20s ease-in-out infinite;
      }

      @keyframes skyShift {
        0%,
        100% {
          opacity: 1;
        }
        50% {
          opacity: 0.8;
        }
      }

      .sun {
        position: absolute;
        top: 8%;
        right: 15%;
        width: 80px;
        height: 80px;
        background: radial-gradient(
          circle,
          #ffd700 0%,
          #ff8c00 50%,
          transparent 70%
        );
        border-radius: 50%;
        box-shadow: 0 0 60px 30px rgba(255, 215, 0, 0.4);
        animation: sunPulse 4s ease-in-out infinite;
      }

      @keyframes sunPulse {
        0%,
        100% {
          transform: scale(1);
          box-shadow: 0 0 60px 30px rgba(255, 215, 0, 0.4);
        }
        50% {
          transform: scale(1.1);
          box-shadow: 0 0 80px 40px rgba(255, 215, 0, 0.5);
        }
      }

      .cloud {
        position: absolute;
        background: rgba(255, 255, 255, 0.8);
        border-radius: 50px;
        animation: cloudFloat 20s linear infinite;
      }

      .cloud-1 {
        width: 100px;
        height: 40px;
        top: 15%;
        left: 10%;
        animation-delay: 0s;
      }
      .cloud-2 {
        width: 80px;
        height: 30px;
        top: 20%;
        left: 60%;
        animation-delay: -5s;
      }
      .cloud-3 {
        width: 120px;
        height: 45px;
        top: 10%;
        left: 40%;
        animation-delay: -10s;
      }

      @keyframes cloudFloat {
        0% {
          transform: translateX(-100px);
        }
        100% {
          transform: translateX(calc(100vw + 100px));
        }
      }

      .plane {
        position: absolute;
        top: 25%;
        left: -50px;
        font-size: 32px;
        animation: flyPlane 15s linear infinite;
      }

      @keyframes flyPlane {
        0% {
          left: -50px;
          transform: translateY(0);
        }
        25% {
          transform: translateY(-20px);
        }
        50% {
          transform: translateY(0);
        }
        75% {
          transform: translateY(20px);
        }
        100% {
          left: calc(100% + 50px);
          transform: translateY(0);
        }
      }

      .palm-tree {
        position: absolute;
        bottom: 28%;
        font-size: 60px;
        filter: brightness(0.3);
        animation: palmSway 3s ease-in-out infinite;
      }

      .palm-left-1 {
        left: 5%;
        animation-delay: 0s;
      }
      .palm-left-2 {
        left: 12%;
        font-size: 45px;
        animation-delay: 0.5s;
      }
      .palm-left-3 {
        left: 20%;
        font-size: 35px;
        animation-delay: 1s;
      }
      .palm-right-1 {
        right: 5%;
        animation-delay: 0.3s;
      }
      .palm-right-2 {
        right: 12%;
        font-size: 50px;
        animation-delay: 0.8s;
      }
      .palm-right-3 {
        right: 18%;
        font-size: 40px;
        animation-delay: 1.3s;
      }

      @keyframes palmSway {
        0%,
        100% {
          transform: rotate(-2deg);
        }
        50% {
          transform: rotate(2deg);
        }
      }

      .skyline {
        position: absolute;
        bottom: 28%;
        left: 0;
        right: 0;
        height: 200px;
        display: flex;
        align-items: flex-end;
        justify-content: center;
        gap: 3px;
        z-index: 1;
      }

      .building {
        background: linear-gradient(180deg, #1a1a2e 0%, #0d0d1a 100%);
        width: 40px;
        position: relative;
      }

      .building::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: repeating-linear-gradient(
          0deg,
          transparent 0px,
          transparent 8px,
          rgba(255, 215, 0, 0.1) 8px,
          rgba(255, 215, 0, 0.1) 10px
        );
      }

      .b1 {
        height: 60px;
        width: 35px;
      }
      .b2 {
        height: 90px;
        width: 30px;
      }
      .b3 {
        height: 120px;
        width: 40px;
      }
      .b4 {
        height: 80px;
        width: 35px;
      }
      .burj-khalifa {
        height: 200px;
        width: 25px;
        background: linear-gradient(180deg, #1a1a2e 0%, #0d0d1a 100%);
        position: relative;
      }
      .burj-khalifa::after {
        content: "";
        position: absolute;
        top: -20px;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: 12px solid transparent;
        border-right: 12px solid transparent;
        border-bottom: 20px solid #1a1a2e;
      }
      .b6 {
        height: 100px;
        width: 35px;
      }
      .b7 {
        height: 70px;
        width: 40px;
      }
      .b8 {
        height: 85px;
        width: 30px;
      }
      .b9 {
        height: 55px;
        width: 35px;
      }

      .water {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 28%;
        background: linear-gradient(
          180deg,
          #0077b6 0%,
          #023e8a 50%,
          #03045e 100%
        );
        animation: waterWave 3s ease-in-out infinite;
      }

      @keyframes waterWave {
        0%,
        100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-5px);
        }
      }

      .light {
        position: absolute;
        width: 4px;
        height: 4px;
        background: #ffd700;
        border-radius: 50%;
        animation: lightTwinkle 2s ease-in-out infinite;
      }

      .l1 {
        bottom: 35%;
        left: 20%;
        animation-delay: 0s;
      }
      .l2 {
        bottom: 40%;
        left: 40%;
        animation-delay: 0.5s;
      }
      .l3 {
        bottom: 38%;
        left: 60%;
        animation-delay: 1s;
      }
      .l4 {
        bottom: 42%;
        right: 25%;
        animation-delay: 0.3s;
      }
      .l5 {
        bottom: 36%;
        right: 40%;
        animation-delay: 0.8s;
      }

      @keyframes lightTwinkle {
        0%,
        100% {
          opacity: 0;
          transform: scale(0.5);
        }
        50% {
          opacity: 1;
          transform: scale(1.5);
        }
      }

      .car {
        position: absolute;
        bottom: 26%;
        left: -50px;
        font-size: 24px;
        animation: driveCar 12s linear infinite;
      }

      @keyframes driveCar {
        0% {
          left: -50px;
        }
        100% {
          left: calc(100% + 50px);
        }
      }

      .login-card {
        position: relative;
        z-index: 10;
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 24px;
        padding: 48px 40px;
        width: 100%;
        max-width: 440px;
        margin: 0 auto;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
      }

      .card-header {
        text-align: center;
        margin-bottom: 32px;
      }

      .logo-icon {
        font-size: 48px;
        margin-bottom: 12px;
        display: inline-block;
        animation: logoFloat 3s ease-in-out infinite;
      }

      @keyframes logoFloat {
        0%,
        100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-8px);
        }
      }

      .title {
        font-size: 26px;
        font-weight: 700;
        color: #fff;
        margin: 0 0 8px 0;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
      }

      .subtitle {
        font-size: 14px;
        color: rgba(255, 255, 255, 0.7);
        margin: 0;
      }

      .input-group {
        margin-bottom: 20px;
      }

      .input-group label {
        display: block;
        font-size: 13px;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.9);
        margin-bottom: 8px;
      }

      .input-wrapper {
        position: relative;
      }

      .input-icon {
        position: absolute;
        left: 14px;
        top: 50%;
        transform: translateY(-50%);
        font-size: 16px;
      }

      .input-wrapper input {
        width: 100%;
        padding: 14px 14px 14px 44px;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 12px;
        color: #fff;
        font-size: 15px;
        transition: all 0.3s ease;
      }

      .input-wrapper input::placeholder {
        color: rgba(255, 255, 255, 0.4);
      }

      .input-wrapper input:focus {
        outline: none;
        border-color: #00d4ff;
        background: rgba(255, 255, 255, 0.15);
        box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.2);
      }

      .error-message {
        background: rgba(239, 68, 68, 0.2);
        border: 1px solid rgba(239, 68, 68, 0.4);
        border-radius: 10px;
        padding: 12px 16px;
        color: #fca5a5;
        font-size: 14px;
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .login-btn {
        width: 100%;
        padding: 16px;
        background: linear-gradient(135deg, #00d4ff 0%, #0077b6 100%);
        border: none;
        border-radius: 12px;
        color: #fff;
        font-size: 16px;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
      }

      .login-btn:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 10px 30px rgba(0, 212, 255, 0.4);
      }

      .login-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .loading-spinner {
        width: 20px;
        height: 20px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-top-color: #fff;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }

      .card-footer {
        margin-top: 24px;
        text-align: center;
      }

      .demo-hint {
        background: rgba(0, 212, 255, 0.1);
        border: 1px solid rgba(0, 212, 255, 0.3);
        border-radius: 8px;
        padding: 10px 14px;
        color: rgba(255, 255, 255, 0.8);
        font-size: 13px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
      }

      .register-link {
        background: none;
        border: none;
        color: rgba(255, 255, 255, 0.7);
        font-size: 14px;
        margin-top: 16px;
        cursor: pointer;
        text-decoration: underline;
      }

      .register-link .highlight {
        color: #00d4ff;
        font-weight: 600;
      }

      .register-link:hover {
        color: #fff;
      }

      .uae-flag {
        position: absolute;
        bottom: -30px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        height: 8px;
        width: 80px;
        border-radius: 4px;
        overflow: hidden;
      }

      .flag-red,
      .flag-green,
      .flag-white,
      .flag-black {
        flex: 1;
      }

      .flag-red {
        background: #e61e25;
      }
      .flag-green {
        background: #00732f;
      }
      .flag-white {
        background: #fff;
      }
      .flag-black {
        background: #000;
      }

      .wave {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 30px;
        background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120'%3E%3Cpath fill='%23023e8a' d='M0,60 C300,120 600,0 900,60 C1200,120 1200,120 1200,120 L1200,0 L0,0 Z'/%3E%3C/svg%3E");
        background-size: cover;
      }
    `,
  ],
})
export class LoginComponent {
  loginRequest: LoginRequest = {
    email: "",
    password: "",
  };

  isLoading = false;
  errorMessage = "";

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService,
  ) {}

  onLogin(): void {
    this.isLoading = true;
    this.errorMessage = "";

    this.authService.login(this.loginRequest).subscribe({
      next: () => {
        this.toastService.show(
          "Welcome to Smart Mobility Simulator!",
          "success",
        );
        this.router.navigate(["/"]);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || "Invalid email or password";
      },
    });
  }
}
