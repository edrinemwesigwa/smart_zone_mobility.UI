import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ThemeService {
  private darkModeSubject = new BehaviorSubject<boolean>(false);
  darkMode$ = this.darkModeSubject.asObservable();

  constructor() {
    // Check for saved preference
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      this.darkModeSubject.next(savedTheme === "dark");
    } else {
      // Check system preference
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      this.darkModeSubject.next(prefersDark);
    }
    this.applyTheme(this.darkModeSubject.value);
  }

  toggle(): void {
    const newValue = !this.darkModeSubject.value;
    this.darkModeSubject.next(newValue);
    this.applyTheme(newValue);
    localStorage.setItem("theme", newValue ? "dark" : "light");
  }

  private applyTheme(isDark: boolean): void {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }

  isDarkMode(): boolean {
    return this.darkModeSubject.value;
  }
}



