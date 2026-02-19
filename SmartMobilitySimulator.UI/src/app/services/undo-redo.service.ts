import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

export interface UndoRedoState<T> {
  past: T[];
  present: T;
  future: T[];
}

@Injectable({
  providedIn: "root",
})
export class UndoRedoService {
  private historyStack = new Map<string, UndoRedoState<any>>();
  private maxHistorySize = 50;

  /**
   * Initialize a new undo/redo stack for a given key
   */
  initialize<T>(key: string, initialState: T): void {
    this.historyStack.set(key, {
      past: [],
      present: initialState,
      future: [],
    });
  }

  /**
   * Push a new state to the stack (called after making changes)
   */
  push<T>(key: string, newState: T): void {
    const state = this.historyStack.get(key) as UndoRedoState<T>;
    if (!state) {
      this.initialize(key, newState);
      return;
    }

    // Don't push if state hasn't changed
    if (JSON.stringify(state.present) === JSON.stringify(newState)) {
      return;
    }

    // Add current state to past
    const newPast = [...state.past, state.present];

    // Limit history size
    if (newPast.length > this.maxHistorySize) {
      newPast.shift();
    }

    this.historyStack.set(key, {
      past: newPast,
      present: newState,
      future: [], // Clear future on new action
    });
  }

  /**
   * Undo the last action
   */
  undo<T>(key: string): T | null {
    const state = this.historyStack.get(key) as UndoRedoState<T>;
    if (!state || state.past.length === 0) {
      return null;
    }

    const newPast = [...state.past];
    const previousState = newPast.pop()!;

    this.historyStack.set(key, {
      past: newPast,
      present: previousState,
      future: [state.present, ...state.future],
    });

    return previousState;
  }

  /**
   * Redo the last undone action
   */
  redo<T>(key: string): T | null {
    const state = this.historyStack.get(key) as UndoRedoState<T>;
    if (!state || state.future.length === 0) {
      return null;
    }

    const newFuture = [...state.future];
    const nextState = newFuture.shift()!;

    this.historyStack.set(key, {
      past: [...state.past, state.present],
      present: nextState,
      future: newFuture,
    });

    return nextState;
  }

  /**
   * Get current state
   */
  getPresent<T>(key: string): T | null {
    const state = this.historyStack.get(key) as UndoRedoState<T>;
    return state ? state.present : null;
  }

  /**
   * Check if undo is available
   */
  canUndo(key: string): boolean {
    const state = this.historyStack.get(key);
    return state ? state.past.length > 0 : false;
  }

  /**
   * Check if redo is available
   */
  canRedo(key: string): boolean {
    const state = this.historyStack.get(key);
    return state ? state.future.length > 0 : false;
  }

  /**
   * Get the number of undo steps available
   */
  getUndoCount(key: string): number {
    const state = this.historyStack.get(key);
    return state ? state.past.length : 0;
  }

  /**
   * Get the number of redo steps available
   */
  getRedoCount(key: string): number {
    const state = this.historyStack.get(key);
    return state ? state.future.length : 0;
  }

  /**
   * Clear history for a key
   */
  clear(key: string): void {
    this.historyStack.delete(key);
  }

  /**
   * Clear all history
   */
  clearAll(): void {
    this.historyStack.clear();
  }

  /**
   * Create observable for undo/redo availability
   */
  getUndoRedoState(
    key: string,
  ): Observable<{ canUndo: boolean; canRedo: boolean }> {
    return new Observable((subscriber) => {
      const checkState = () => {
        subscriber.next({
          canUndo: this.canUndo(key),
          canRedo: this.canRedo(key),
        });
      };

      checkState();

      // Subscribe to storage events for cross-tab sync
      const handler = (e: StorageEvent) => {
        if (e.key === `undo-redo-${key}`) {
          checkState();
        }
      };
      window.addEventListener("storage", handler);

      return () => {
        window.removeEventListener("storage", handler);
      };
    });
  }
}
