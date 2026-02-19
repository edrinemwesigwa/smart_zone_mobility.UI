import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { I18nService } from "../../services/i18n.service";

@Component({
  selector: "app-language-switcher",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="language-switcher">
      <select
        [value]="currentLanguage"
        (change)="onLanguageChange($event)"
        aria-label="Select language"
        class="language-select"
      >
        <option *ngFor="let lang of languages" [value]="lang.code">
          {{ lang.name }}
        </option>
      </select>
    </div>
  `,
  styles: [
    `
      .language-switcher {
        display: inline-flex;
        align-items: center;
      }

      .language-select {
        background: rgba(13, 71, 161, 0.08);
        border: 1px solid rgba(13, 71, 161, 0.2);
        color: #0d47a1;
        padding: 0.5rem 1rem;
        border-radius: 8px;
        cursor: pointer;
        font-size: 0.875rem;
        font-weight: 500;
        transition: all 0.2s ease;
        min-width: 100px;
      }

      .language-select:hover {
        background: rgba(13, 71, 161, 0.12);
        border-color: rgba(13, 71, 161, 0.4);
      }

      .language-select:focus {
        outline: none;
        border-color: #0d47a1;
        box-shadow: 0 0 0 2px rgba(13, 71, 161, 0.2);
      }

      .language-select option {
        background: white;
        color: #1e293b;
        padding: 0.5rem;
      }
    `,
  ],
})
export class LanguageSwitcherComponent implements OnInit {
  currentLanguage = "en";
  languages: { code: string; name: string }[] = [];

  constructor(private i18n: I18nService) {}

  ngOnInit(): void {
    this.languages = this.i18n.getAvailableLanguages();
    this.i18n.getLanguage().subscribe((lang) => {
      this.currentLanguage = lang;
    });
  }

  onLanguageChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.i18n.setLanguage(select.value);
  }
}
