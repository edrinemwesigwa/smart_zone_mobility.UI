import { Injectable, NgZone } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable, tap, throwError, timer } from "rxjs";
import { getApiBase } from "./api-base";
import { Router } from "@angular/router";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: "Admin" | "Editor" | "Viewer";
  createdAt: string;
  lastLoginAt?: string;
  isActive: boolean;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  expiresIn: number; // seconds
  user: User;
}

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private apiUrl = `${getApiBase()}/api/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  // Auto-logout settings
  private readonly INACTIVITY_TIMEOUT = 15 * 60 * 1000; // 15 minutes
  private readonly TOKEN_REFRESH_INTERVAL = 55 * 60 * 1000; // 55 minutes (refresh before expiry)
  private inactivityTimer: any;
  private refreshTimer: any;
  private lastActivity = Date.now();

  constructor(
    private http: HttpClient,
    private router: Router,
    private ngZone: NgZone,
  ) {
    this.loadStoredUser();
    this.setupInactivityTracking();
  }

  private loadStoredUser(): void {
    const token = this.getToken();
    const userJson = localStorage.getItem("smartmobility_user");
    if (token && userJson) {
      try {
        const user = JSON.parse(userJson) as User;
        this.currentUserSubject.next(user);
        this.startRefreshTimer();
      } catch {
        this.logout();
      }
    }
  }

  private setupInactivityTracking(): void {
    // Track user activity
    if (typeof window !== "undefined") {
      ["mousedown", "keydown", "touchstart", "scroll"].forEach((event) => {
        window.addEventListener(event, () => this.resetInactivityTimer());
      });
    }
  }

  private resetInactivityTimer(): void {
    this.lastActivity = Date.now();
    if (this.isLoggedIn()) {
      this.stopInactivityTimer();
      this.startInactivityTimer();
    }
  }

  private startInactivityTimer(): void {
    this.ngZone.runOutsideAngular(() => {
      this.inactivityTimer = setTimeout(() => {
        this.ngZone.run(() => {
          // Check if still inactive
          if (Date.now() - this.lastActivity >= this.INACTIVITY_TIMEOUT) {
            this.logout(true);
          }
        });
      }, this.INACTIVITY_TIMEOUT);
    });
  }

  private stopInactivityTimer(): void {
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
      this.inactivityTimer = null;
    }
  }

  private startRefreshTimer(): void {
    this.stopRefreshTimer();
    this.ngZone.runOutsideAngular(() => {
      this.refreshTimer = setInterval(() => {
        this.ngZone.run(() => {
          this.refreshToken();
        });
      }, this.TOKEN_REFRESH_INTERVAL);
    });
  }

  private stopRefreshTimer(): void {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  private refreshToken(): void {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) return;

    this.http
      .post<AuthResponse>(`${this.apiUrl}/refresh`, { refreshToken })
      .subscribe({
        next: (response) => {
          this.storeAuth(response);
        },
        error: () => {
          this.logout();
        },
      });
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, request).pipe(
      tap((response) => {
        this.storeAuth(response);
        this.startInactivityTimer();
        this.startRefreshTimer();
      }),
    );
  }

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/register`, request)
      .pipe(
        tap((response) => {
          this.storeAuth(response);
          this.startInactivityTimer();
          this.startRefreshTimer();
        }),
      );
  }

  logout(autoLogout = false): void {
    const token = this.getToken();
    if (token) {
      // Call logout endpoint to revoke refresh token
      this.http.post(`${this.apiUrl}/logout`, {}).subscribe();
    }

    localStorage.removeItem("smartmobility_token");
    localStorage.removeItem("smartmobility_refresh_token");
    localStorage.removeItem("smartmobility_user");
    this.currentUserSubject.next(null);
    this.stopInactivityTimer();
    this.stopRefreshTimer();

    if (autoLogout) {
      alert("You have been logged out due to inactivity.");
    }
    this.router.navigate(["/login"]);
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/me`);
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }

  updateUserRole(userId: number, role: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/${userId}/role`, { role });
  }

  updateUserStatus(userId: number, isActive: boolean): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/${userId}/status`, {
      isActive,
    });
  }

  getToken(): string | null {
    return localStorage.getItem("smartmobility_token");
  }

  getRefreshToken(): string | null {
    return localStorage.getItem("smartmobility_refresh_token");
  }

  getCurrentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    const user = this.getCurrentUserValue();
    return user?.role === "Admin";
  }

  isEditor(): boolean {
    const user = this.getCurrentUserValue();
    return user?.role === "Admin" || user?.role === "Editor";
  }

  hasRole(roles: string[]): boolean {
    const user = this.getCurrentUserValue();
    return user ? roles.includes(user.role) : false;
  }

  private storeAuth(response: AuthResponse): void {
    localStorage.setItem("smartmobility_token", response.token);
    localStorage.setItem("smartmobility_refresh_token", response.refreshToken);
    localStorage.setItem("smartmobility_user", JSON.stringify(response.user));
    this.currentUserSubject.next(response.user);
  }
}



