import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subject, timer } from "rxjs";
import { webSocket, WebSocketSubject } from "rxjs/webSocket";
import { catchError, retry, tap, switchMap, takeUntil } from "rxjs/operators";
import { of } from "rxjs";

export interface WebSocketMessage {
  type: string;
  payload: any;
  timestamp: string;
}

export interface SimulationProgress {
  simulationId: string;
  progress: number;
  status: "running" | "completed" | "failed" | "cancelled";
  message?: string;
  results?: any;
}

export interface SystemNotification {
  id: string;
  type: "info" | "warning" | "error" | "success";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

@Injectable({
  providedIn: "root",
})
export class WebSocketService {
  private socket$: WebSocketSubject<WebSocketMessage> | null = null;
  private reconnectInterval = 5000;
  private destroy$ = new Subject<void>();

  // Connection status
  private connectionStatus = new BehaviorSubject<
    "connected" | "disconnected" | "connecting"
  >("disconnected");

  // Messages by type
  private simulationProgress = new Subject<SimulationProgress>();
  private systemNotifications = new Subject<SystemNotification>();
  private generalMessages = new Subject<WebSocketMessage>();

  // Auto-reconnect management
  private shouldReconnect = true;

  constructor() {}

  /**
   * Connect to WebSocket server
   */
  connect(url: string = "ws://localhost:5000/ws"): void {
    if (this.socket$) {
      return;
    }

    this.connectionStatus.next("connecting");

    this.socket$ = webSocket<WebSocketMessage>({
      url,
      openObserver: {
        next: () => {
          console.log("[WebSocket] Connected");
          this.connectionStatus.next("connected");
        },
      },
      closeObserver: {
        next: () => {
          console.log("[WebSocket] Disconnected");
          this.connectionStatus.next("disconnected");
          this.socket$ = null;
          if (this.shouldReconnect) {
            this.scheduleReconnect(url);
          }
        },
      },
    });

    this.socket$
      .pipe(
        catchError((error) => {
          console.error("[WebSocket] Error:", error);
          return of(null);
        }),
        takeUntil(this.destroy$),
      )
      .subscribe((message) => {
        if (message) {
          this.handleMessage(message);
        }
      });
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect(): void {
    this.shouldReconnect = false;
    if (this.socket$) {
      this.socket$.complete();
      this.socket$ = null;
    }
    this.connectionStatus.next("disconnected");
    this.destroy$.next();
  }

  /**
   * Send a message through WebSocket
   */
  send(type: string, payload: any): void {
    if (this.socket$) {
      this.socket$.next({
        type,
        payload,
        timestamp: new Date().toISOString(),
      });
    } else {
      console.warn("[WebSocket] Not connected, cannot send message");
    }
  }

  /**
   * Subscribe to simulation progress updates
   */
  onSimulationProgress(): Observable<SimulationProgress> {
    return this.simulationProgress.asObservable();
  }

  /**
   * Subscribe to system notifications
   */
  onNotifications(): Observable<SystemNotification> {
    return this.systemNotifications.asObservable();
  }

  /**
   * Get connection status
   */
  getConnectionStatus(): Observable<
    "connected" | "disconnected" | "connecting"
  > {
    return this.connectionStatus.asObservable();
  }

  /**
   * Request simulation progress updates for a specific simulation
   */
  subscribeToSimulation(simulationId: string): void {
    this.send("subscribe_simulation", { simulationId });
  }

  /**
   * Unsubscribe from simulation updates
   */
  unsubscribeFromSimulation(simulationId: string): void {
    this.send("unsubscribe_simulation", { simulationId });
  }

  /**
   * Handle incoming WebSocket messages
   */
  private handleMessage(message: WebSocketMessage): void {
    switch (message.type) {
      case "simulation_progress":
        this.simulationProgress.next(message.payload);
        break;

      case "notification":
        this.systemNotifications.next(message.payload);
        break;

      default:
        this.generalMessages.next(message);
    }
  }

  /**
   * Schedule reconnection attempt
   */
  private scheduleReconnect(url: string): void {
    timer(this.reconnectInterval)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (this.shouldReconnect) {
          console.log("[WebSocket] Attempting to reconnect...");
          this.connect(url);
        }
      });
  }
}

/**
 * SignalR service as an alternative to native WebSocket
 * For production, consider using Microsoft.AspNetCore.SignalR
 */
@Injectable({
  providedIn: "root",
})
export class SignalRService {
  private hubConnection: any = null;
  private connectionStatus = new BehaviorSubject<
    "connected" | "disconnected" | "connecting"
  >("disconnected");

  private simulationProgress = new Subject<SimulationProgress>();
  private notifications = new Subject<SystemNotification>();

  constructor() {}

  /**
   * Connect to SignalR hub
   */
  async connect(hubUrl: string = "http://localhost:5000/hub"): Promise<void> {
    // Note: This requires @microsoft/signalr package
    // For now, this is a placeholder for future implementation
    console.log("[SignalR] Connecting to:", hubUrl);
    this.connectionStatus.next("connecting");

    // Placeholder - would use:
    // this.hubConnection = new HubConnectionBuilder()
    //   .withUrl(hubUrl)
    //   .withAutomaticReconnect()
    //   .build();
    //
    // await this.hubConnection.start();
  }

  /**
   * Disconnect from SignalR hub
   */
  async disconnect(): Promise<void> {
    if (this.hubConnection) {
      await this.hubConnection.stop();
      this.hubConnection = null;
    }
    this.connectionStatus.next("disconnected");
  }

  /**
   * On simulation progress
   */
  onSimulationProgress(): Observable<SimulationProgress> {
    return this.simulationProgress.asObservable();
  }

  /**
   * On notifications
   */
  onNotifications(): Observable<SystemNotification> {
    return this.notifications.asObservable();
  }

  /**
   * Get connection status
   */
  getConnectionStatus(): Observable<
    "connected" | "disconnected" | "connecting"
  > {
    return this.connectionStatus.asObservable();
  }
}
