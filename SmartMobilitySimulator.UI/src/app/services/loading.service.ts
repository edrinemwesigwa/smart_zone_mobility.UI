import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$: Observable<boolean> = this.loadingSubject.asObservable();

  private loadingCount = 0;
  private requests: Set<string> = new Set();

  show(requestId?: string): void {
    if (requestId) {
      this.requests.add(requestId);
    }
    this.loadingCount++;
    this.loadingSubject.next(true);
  }

  hide(requestId?: string): void {
    if (requestId) {
      this.requests.delete(requestId);
    }
    this.loadingCount = Math.max(0, this.loadingCount - 1);
    if (this.loadingCount === 0) {
      this.loadingSubject.next(false);
    }
  }

  hideAll(): void {
    this.loadingCount = 0;
    this.requests.clear();
    this.loadingSubject.next(false);
  }

  isLoading(): boolean {
    return this.loadingSubject.value;
  }
}



