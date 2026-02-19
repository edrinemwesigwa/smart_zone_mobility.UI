import { Component, OnInit, HostListener } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";
import { ThemeService } from "./services/theme.service";
import { AuthService } from "./services/auth.service";
import { UndoRedoService } from "./services/undo-redo.service";
import { filter } from "rxjs/operators";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  title = "Smart Mobility Simulator";
  activeDropdown: string | null = null;
  isLoggedIn = false;
  canUndo = false;
  canRedo = false;

  constructor(
    public themeService: ThemeService,
    private router: Router,
    public authService: AuthService,
    private undoRedoService: UndoRedoService,
  ) {}

  ngOnInit(): void {
    // Check authentication status
    this.isLoggedIn = this.authService.isLoggedIn();

    // Listen to auth changes via currentUser
    this.authService.currentUser$.subscribe((user) => {
      this.isLoggedIn = !!user;
    });

    // Scroll to top on navigation
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
      });

    // Initialize undo/redo for simulation
    this.undoRedoService.initialize("simulation", {});

    // Listen to undo/redo state changes
    this.undoRedoService.getUndoRedoState("simulation").subscribe((state) => {
      this.canUndo = state.canUndo;
      this.canRedo = state.canRedo;
    });
  }

  @HostListener("window:keydown", ["$event"])
  handleKeyboardEvent(event: KeyboardEvent): void {
    // Don't trigger shortcuts when typing in inputs
    const target = event.target as HTMLElement;
    if (
      target.tagName === "INPUT" ||
      target.tagName === "TEXTAREA" ||
      target.tagName === "SELECT"
    ) {
      return;
    }

    // Ctrl/Cmd + Z: Undo
    if (
      (event.ctrlKey || event.metaKey) &&
      event.key === "z" &&
      !event.shiftKey
    ) {
      event.preventDefault();
      this.performUndo();
    }
    // Ctrl/Cmd + Y or Ctrl/Cmd + Shift + Z: Redo
    if (
      (event.ctrlKey || event.metaKey) &&
      (event.key === "y" || (event.key === "z" && event.shiftKey))
    ) {
      event.preventDefault();
      this.performRedo();
    }
    // Ctrl/Cmd + D: Toggle dark mode
    if ((event.ctrlKey || event.metaKey) && event.key === "d") {
      event.preventDefault();
      this.themeService.toggle();
    }
    // Ctrl/Cmd + /: Show keyboard shortcuts help
    if ((event.ctrlKey || event.metaKey) && event.key === "/") {
      event.preventDefault();
      this.showKeyboardShortcuts();
    }
    // Escape: Close dropdowns
    if (event.key === "Escape") {
      this.activeDropdown = null;
    }
    // Ctrl/Cmd + H: Go to home
    if ((event.ctrlKey || event.metaKey) && event.key === "h") {
      event.preventDefault();
      this.router.navigate(["/"]);
    }
    // Ctrl/Cmd + S: Start simulation (if on simulation page)
    if ((event.ctrlKey || event.metaKey) && event.key === "s") {
      event.preventDefault();
      console.log("Keyboard shortcut: Save/Simulate");
    }
  }

  performUndo(): void {
    const previousState = this.undoRedoService.undo("simulation");
    if (previousState) {
      console.log("Undo performed:", previousState);
      // Emit event for components to handle
      window.dispatchEvent(new CustomEvent("undo", { detail: previousState }));
    }
  }

  performRedo(): void {
    const nextState = this.undoRedoService.redo("simulation");
    if (nextState) {
      console.log("Redo performed:", nextState);
      // Emit event for components to handle
      window.dispatchEvent(new CustomEvent("redo", { detail: nextState }));
    }
  }

  private showKeyboardShortcuts(): void {
    const shortcuts = `⌨️  Keyboard Shortcuts
━━━━━━━━━━━━━━━━━━━━
Ctrl+D  : Toggle dark mode
Ctrl+H  : Go to home
Ctrl+S  : Save/Simulate
Ctrl+Z  : Undo
Ctrl+Y  : Redo
Ctrl+/  : Show this help
Esc     : Close menus`;
    alert(shortcuts);
  }

  toggleDropdown(name: string): void {
    if (this.activeDropdown === name) {
      this.activeDropdown = null;
    } else {
      this.activeDropdown = name;
    }
  }

  openDropdown(name: string): void {
    this.activeDropdown = name;
  }

  closeDropdown(name: string): void {
    if (this.activeDropdown === name) {
      this.activeDropdown = null;
    }
  }

  clearLocalStorage(): void {
    localStorage.clear();
    window.location.reload();
  }
}
