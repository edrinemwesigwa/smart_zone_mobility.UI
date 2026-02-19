import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { jsPDF } from "jspdf";

interface SlideData {
  id: string;
  title: string;
  subtitle?: string;
  content: SlideContent;
  notes: string;
}

interface SlideContent {
  type:
    | "title"
    | "text"
    | "bullet"
    | "split"
    | "chart"
    | "quote"
    | "stats"
    | "image";
  headline?: string;
  subtitle?: string;
  body?: string;
  bullets?: string[];
  leftText?: string;
  rightText?: string;
  stats?: { label: string; value: string; change?: string }[];
  quote?: string;
  quotee?: string;
  imageUrl?: string;
}

interface DeckTemplate {
  id: string;
  name: string;
  description: string;
  slides: SlideData[];
}

@Component({
  selector: "app-pitch-deck",
  template: `
    <div class="pitch-container">
      <!-- Header -->
      <div class="deck-header-bar">
        <div class="header-left">
          <span class="deck-logo">📊</span>
          <div class="header-title">
            <h1>Smart Mobility Simulator</h1>
            <span class="header-subtitle">Investor Pitch Deck</span>
          </div>
        </div>
        <div class="header-actions">
          <button class="btn-header" (click)="exportPdf()">
            📄 Export PDF
          </button>
          <button class="btn-header primary" (click)="startPresentation()">
            ▶ Present
          </button>
        </div>
      </div>

      <!-- Main Grid -->
      <div class="deck-main">
        <!-- Sidebar -->
        <div class="deck-sidebar">
          <div class="sidebar-section">
            <h3>📑 Deck Templates</h3>
            <div class="template-list">
              <button
                *ngFor="let t of templates"
                class="template-item"
                [class.active]="selectedTemplateId === t.id"
                (click)="selectTemplate(t.id)"
              >
                <span class="template-name">{{ t.name }}</span>
                <span class="template-desc">{{ t.description }}</span>
                <span class="template-slides"
                  >{{ t.slides.length }} slides</span
                >
              </button>
            </div>
          </div>

          <div class="sidebar-section">
            <h3>🎨 Theme</h3>
            <div class="theme-options">
              <button
                *ngFor="let t of themes"
                class="theme-btn"
                [class.active]="selectedTheme.id === t.id"
                (click)="selectTheme(t.id)"
                [style.--theme-primary]="t.colors.primary"
                [style.--theme-secondary]="t.colors.secondary"
              >
                <span class="theme-preview"></span>
                <span>{{ t.name }}</span>
              </button>
            </div>
          </div>

          <div class="sidebar-section">
            <h3>📋 Slides</h3>
            <div class="slides-nav">
              <div
                *ngFor="let slide of currentSlides; let i = index"
                class="slide-nav-item"
                [class.active]="currentSlideIndex === i"
                (click)="goToSlide(i)"
              >
                <span class="slide-number">{{ i + 1 }}</span>
                <span class="slide-title">{{ slide.title }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Preview Area -->
        <div class="deck-preview-area">
          <!-- Slide Preview -->
          <div class="slide-preview-container">
            <div
              class="slide-preview"
              [style.--primary]="selectedTheme.colors.primary"
              [style.--secondary]="selectedTheme.colors.secondary"
              [style.--accent]="selectedTheme.colors.accent"
              [style.--bg]="selectedTheme.colors.background"
            >
              <!-- Title Slide -->
              <div
                *ngIf="currentSlide.content.type === 'title'"
                class="slide-title-slide"
              >
                <div class="title-bg-pattern"></div>
                <div class="title-content">
                  <div class="title-logo">🏙️</div>
                  <h1>{{ currentSlide.title }}</h1>
                  <p class="title-subtitle">
                    {{ currentSlide.content.subtitle }}
                  </p>
                  <div class="title-meta">
                    <span>📍 {{ selectedTheme.location }}</span>
                    <span>📅 {{ selectedTheme.date }}</span>
                  </div>
                </div>
              </div>

              <!-- Text Slide -->
              <div
                *ngIf="currentSlide.content.type === 'text'"
                class="slide-text-slide"
              >
                <div class="slide-header">
                  <h2>{{ currentSlide.title }}</h2>
                </div>
                <div class="slide-body">
                  <p class="headline">{{ currentSlide.content.headline }}</p>
                  <p class="body-text">{{ currentSlide.content.body }}</p>
                </div>
              </div>

              <!-- Bullet Slide -->
              <div
                *ngIf="currentSlide.content.type === 'bullet'"
                class="slide-bullet-slide"
              >
                <div class="slide-header">
                  <h2>{{ currentSlide.title }}</h2>
                </div>
                <div class="slide-body">
                  <ul class="bullet-list">
                    <li *ngFor="let bullet of currentSlide.content.bullets">
                      <span class="bullet-icon">▸</span>
                      {{ bullet }}
                    </li>
                  </ul>
                </div>
              </div>

              <!-- Split Slide -->
              <div
                *ngIf="currentSlide.content.type === 'split'"
                class="slide-split-slide"
              >
                <div class="slide-header">
                  <h2>{{ currentSlide.title }}</h2>
                </div>
                <div class="split-content">
                  <div class="split-left">
                    <h3>{{ currentSlide.content.headline }}</h3>
                    <p>{{ currentSlide.content.leftText }}</p>
                  </div>
                  <div class="split-right">
                    <h3>Key Points</h3>
                    <ul>
                      <li *ngFor="let b of currentSlide.content.bullets">
                        {{ b }}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <!-- Stats Slide -->
              <div
                *ngIf="currentSlide.content.type === 'stats'"
                class="slide-stats-slide"
              >
                <div class="slide-header">
                  <h2>{{ currentSlide.title }}</h2>
                </div>
                <div class="stats-grid">
                  <div
                    class="stat-card"
                    *ngFor="let stat of currentSlide.content.stats"
                  >
                    <span class="stat-value">{{ stat.value }}</span>
                    <span class="stat-label">{{ stat.label }}</span>
                    <span class="stat-change" *ngIf="stat.change">{{
                      stat.change
                    }}</span>
                  </div>
                </div>
              </div>

              <!-- Quote Slide -->
              <div
                *ngIf="currentSlide.content.type === 'quote'"
                class="slide-quote-slide"
              >
                <div class="quote-mark">"</div>
                <blockquote>{{ currentSlide.content.quote }}</blockquote>
                <cite>— {{ currentSlide.content.quotee }}</cite>
              </div>
            </div>

            <!-- Navigation -->
            <div class="slide-nav">
              <button
                (click)="prevSlide()"
                [disabled]="currentSlideIndex === 0"
              >
                ← Previous
              </button>
              <span class="slide-counter"
                >{{ currentSlideIndex + 1 }} / {{ currentSlides.length }}</span
              >
              <button
                (click)="nextSlide()"
                [disabled]="currentSlideIndex === currentSlides.length - 1"
              >
                Next →
              </button>
            </div>
          </div>

          <!-- Speaker Notes -->
          <div class="speaker-notes-panel">
            <h4>📝 Speaker Notes</h4>
            <p>
              {{
                currentSlide.notes ||
                  "Click to add speaker notes for this slide."
              }}
            </p>
          </div>
        </div>
      </div>

      <!-- Presentation Mode -->
      <div class="presentation-overlay" *ngIf="isPresenting">
        <div
          class="presentation-slide"
          [style.--primary]="selectedTheme.colors.primary"
          [style.--secondary]="selectedTheme.colors.secondary"
          [style.--accent]="selectedTheme.colors.accent"
          [style.--bg]="selectedTheme.colors.background"
        >
          <!-- Title Slide -->
          <div
            *ngIf="
              presentationSlides[presentationIndex].content.type === 'title'
            "
            class="slide-title-slide pres"
          >
            <div class="title-bg-pattern"></div>
            <div class="title-content">
              <div class="title-logo">🏙️</div>
              <h1>{{ presentationSlides[presentationIndex].title }}</h1>
              <p class="title-subtitle">
                {{ presentationSlides[presentationIndex].content.subtitle }}
              </p>
              <div class="title-meta">
                <span>📍 {{ selectedTheme.location }}</span>
                <span>📅 {{ selectedTheme.date }}</span>
              </div>
            </div>
          </div>

          <!-- Text Slide -->
          <div
            *ngIf="
              presentationSlides[presentationIndex].content.type === 'text'
            "
            class="slide-text-slide pres"
          >
            <div class="slide-header">
              <h2>{{ presentationSlides[presentationIndex].title }}</h2>
            </div>
            <div class="slide-body">
              <p class="headline">
                {{ presentationSlides[presentationIndex].content.headline }}
              </p>
              <p class="body-text">
                {{ presentationSlides[presentationIndex].content.body }}
              </p>
            </div>
          </div>

          <!-- Bullet Slide -->
          <div
            *ngIf="
              presentationSlides[presentationIndex].content.type === 'bullet'
            "
            class="slide-bullet-slide pres"
          >
            <div class="slide-header">
              <h2>{{ presentationSlides[presentationIndex].title }}</h2>
            </div>
            <div class="slide-body">
              <ul class="bullet-list">
                <li
                  *ngFor="
                    let bullet of presentationSlides[presentationIndex].content
                      .bullets
                  "
                >
                  <span class="bullet-icon">▸</span>
                  {{ bullet }}
                </li>
              </ul>
            </div>
          </div>

          <!-- Stats Slide -->
          <div
            *ngIf="
              presentationSlides[presentationIndex].content.type === 'stats'
            "
            class="slide-stats-slide pres"
          >
            <div class="slide-header">
              <h2>{{ presentationSlides[presentationIndex].title }}</h2>
            </div>
            <div class="stats-grid">
              <div
                class="stat-card"
                *ngFor="
                  let stat of presentationSlides[presentationIndex].content
                    .stats
                "
              >
                <span class="stat-value">{{ stat.value }}</span>
                <span class="stat-label">{{ stat.label }}</span>
                <span class="stat-change" *ngIf="stat.change">{{
                  stat.change
                }}</span>
              </div>
            </div>
          </div>

          <!-- Quote Slide -->
          <div
            *ngIf="
              presentationSlides[presentationIndex].content.type === 'quote'
            "
            class="slide-quote-slide pres"
          >
            <div class="quote-mark">"</div>
            <blockquote>
              {{ presentationSlides[presentationIndex].content.quote }}
            </blockquote>
            <cite
              >—
              {{ presentationSlides[presentationIndex].content.quotee }}</cite
            >
          </div>

          <!-- Presentation Controls -->
          <div class="pres-controls">
            <button class="pres-btn" (click)="prevSlide()">←</button>
            <span class="pres-counter"
              >{{ presentationIndex + 1 }} /
              {{ presentationSlides.length }}</span
            >
            <button class="pres-btn" (click)="nextSlide()">→</button>
            <button class="pres-btn exit" (click)="stopPresentation()">
              ✕ Exit
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .pitch-container {
        height: 100vh;
        display: flex;
        flex-direction: column;
        background: #f1f5f9;
      }

      /* Header Bar */
      .deck-header-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 24px;
        background: white;
        border-bottom: 1px solid #e2e8f0;
      }

      .header-left {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .deck-logo {
        font-size: 1.5rem;
      }

      .header-title h1 {
        margin: 0;
        font-size: 1.1rem;
        color: #1e3a5f;
      }

      .header-subtitle {
        font-size: 0.75rem;
        color: #64748b;
      }

      .header-actions {
        display: flex;
        gap: 10px;
      }

      .btn-header {
        padding: 8px 16px;
        border-radius: 8px;
        border: 1px solid #e2e8f0;
        background: white;
        cursor: pointer;
        font-weight: 500;
      }

      .btn-header.primary {
        background: #1e3a5f;
        color: white;
        border: none;
      }

      /* Main Grid */
      .deck-main {
        display: grid;
        grid-template-columns: 280px 1fr;
        flex: 1;
        overflow: hidden;
      }

      /* Sidebar */
      .deck-sidebar {
        background: white;
        border-right: 1px solid #e2e8f0;
        padding: 20px;
        overflow-y: auto;
      }

      .sidebar-section {
        margin-bottom: 24px;
      }

      .sidebar-section h3 {
        margin: 0 0 12px;
        font-size: 0.85rem;
        color: #64748b;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .template-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .template-item {
        padding: 12px;
        border: 2px solid #e2e8f0;
        border-radius: 10px;
        background: white;
        cursor: pointer;
        text-align: left;
        transition: all 0.2s;
      }

      .template-item:hover {
        border-color: #3b82f6;
      }

      .template-item.active {
        border-color: #1e3a5f;
        background: #f8fafc;
      }

      .template-name {
        display: block;
        font-weight: 600;
        color: #1e3a5f;
      }

      .template-desc {
        display: block;
        font-size: 0.75rem;
        color: #64748b;
        margin-top: 2px;
      }

      .template-slides {
        display: block;
        font-size: 0.7rem;
        color: #94a3b8;
        margin-top: 4px;
      }

      /* Theme Options */
      .theme-options {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }

      .theme-btn {
        width: 60px;
        padding: 8px;
        border: 2px solid #e2e8f0;
        border-radius: 8px;
        background: white;
        cursor: pointer;
        font-size: 0.7rem;
      }

      .theme-btn.active {
        border-color: #1e3a5f;
      }

      .theme-preview {
        display: block;
        width: 100%;
        height: 24px;
        border-radius: 4px;
        background: linear-gradient(
          135deg,
          var(--theme-primary) 50%,
          var(--theme-secondary) 50%
        );
      }

      /* Slides Nav */
      .slides-nav {
        display: flex;
        flex-direction: column;
        gap: 4px;
        max-height: 300px;
        overflow-y: auto;
      }

      .slide-nav-item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 8px 10px;
        border-radius: 6px;
        cursor: pointer;
        transition: background 0.2s;
      }

      .slide-nav-item:hover {
        background: #f1f5f9;
      }

      .slide-nav-item.active {
        background: #e0f2fe;
      }

      .slide-number {
        width: 24px;
        height: 24px;
        background: #e2e8f0;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.75rem;
        font-weight: 600;
      }

      .slide-nav-item.active .slide-number {
        background: #1e3a5f;
        color: white;
      }

      .slide-title {
        font-size: 0.85rem;
        color: #475569;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      /* Preview Area */
      .deck-preview-area {
        padding: 24px;
        display: flex;
        flex-direction: column;
        gap: 16px;
        overflow-y: auto;
      }

      .slide-preview-container {
        flex: 1;
        display: flex;
        flex-direction: column;
        max-width: 900px;
        margin: 0 auto;
        width: 100%;
      }

      .slide-preview {
        aspect-ratio: 16/9;
        background: var(--bg);
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
      }

      /* Title Slide */
      .slide-title-slide {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        overflow: hidden;
      }

      .title-bg-pattern {
        position: absolute;
        inset: 0;
        background:
          radial-gradient(
            circle at 20% 80%,
            var(--primary) 0%,
            transparent 50%
          ),
          radial-gradient(circle at 80% 20%, var(--accent) 0%, transparent 50%),
          linear-gradient(135deg, var(--bg) 0%, var(--secondary) 100%);
        opacity: 0.15;
      }

      .title-content {
        text-align: center;
        z-index: 1;
        padding: 40px;
      }

      .title-logo {
        font-size: 4rem;
        margin-bottom: 20px;
      }

      .slide-title-slide h1 {
        font-size: 2.5rem;
        color: var(--primary);
        margin: 0 0 10px;
      }

      .title-subtitle {
        font-size: 1.2rem;
        color: #475569;
        margin: 0 0 20px;
      }

      .title-meta {
        display: flex;
        gap: 20px;
        justify-content: center;
        font-size: 0.9rem;
        color: #64748b;
      }

      /* Text Slide */
      .slide-text-slide,
      .slide-bullet-slide,
      .slide-split-slide,
      .slide-stats-slide {
        height: 100%;
        display: flex;
        flex-direction: column;
      }

      .slide-header {
        padding: 30px 40px 20px;
        border-bottom: 1px solid #e2e8f0;
      }

      .slide-header h2 {
        margin: 0;
        font-size: 1.6rem;
        color: var(--primary);
      }

      .slide-body {
        padding: 30px 40px;
        flex: 1;
      }

      .headline {
        font-size: 1.3rem;
        font-weight: 600;
        color: #1e293b;
        margin: 0 0 16px;
      }

      .body-text {
        font-size: 1rem;
        color: #475569;
        line-height: 1.7;
      }

      /* Bullet List */
      .bullet-list {
        list-style: none;
        padding: 0;
        margin: 0;
      }

      .bullet-list li {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        margin-bottom: 16px;
        font-size: 1.05rem;
        color: #334155;
      }

      .bullet-icon {
        color: var(--accent);
        font-weight: bold;
      }

      /* Split Content */
      .split-content {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 40px;
        padding: 30px 40px;
      }

      .split-left h3,
      .split-right h3 {
        color: var(--primary);
        margin: 0 0 12px;
      }

      .split-left p,
      .split-right ul {
        color: #475569;
        line-height: 1.6;
      }

      .split-right ul {
        padding-left: 20px;
      }

      .split-right li {
        margin-bottom: 8px;
      }

      /* Stats Grid */
      .stats-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;
        padding: 30px 40px;
      }

      .stat-card {
        background: white;
        border-radius: 12px;
        padding: 24px;
        text-align: center;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
      }

      .stat-value {
        display: block;
        font-size: 2rem;
        font-weight: 700;
        color: var(--primary);
      }

      .stat-label {
        display: block;
        font-size: 0.85rem;
        color: #64748b;
        margin-top: 4px;
      }

      .stat-change {
        display: inline-block;
        margin-top: 8px;
        padding: 4px 10px;
        background: #d1fae5;
        color: #059669;
        border-radius: 20px;
        font-size: 0.75rem;
        font-weight: 600;
      }

      /* Quote Slide */
      .slide-quote-slide {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 60px;
        background: linear-gradient(135deg, var(--primary) 0%, #1e3a5f 100%);
        color: white;
      }

      .quote-mark {
        font-size: 6rem;
        opacity: 0.3;
        line-height: 1;
      }

      .slide-quote-slide blockquote {
        font-size: 1.8rem;
        text-align: center;
        margin: 0;
        font-style: italic;
        line-height: 1.5;
      }

      .slide-quote-slide cite {
        margin-top: 24px;
        font-size: 1rem;
        opacity: 0.8;
        font-style: normal;
      }

      /* Slide Nav */
      .slide-nav {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 20px;
        padding: 16px;
      }

      .slide-nav button {
        padding: 10px 20px;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        background: white;
        cursor: pointer;
        font-weight: 500;
      }

      .slide-nav button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .slide-counter {
        font-size: 0.9rem;
        color: #64748b;
      }

      /* Speaker Notes */
      .speaker-notes-panel {
        background: white;
        border-radius: 10px;
        padding: 16px;
        border: 1px solid #e2e8f0;
      }

      .speaker-notes-panel h4 {
        margin: 0 0 8px;
        font-size: 0.85rem;
        color: #64748b;
      }

      .speaker-notes-panel p {
        margin: 0;
        font-size: 0.9rem;
        color: #475569;
      }

      /* Presentation Overlay */
      .presentation-overlay {
        position: fixed;
        inset: 0;
        background: #0f172a;
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .presentation-slide {
        width: 90vw;
        max-width: 1200px;
        aspect-ratio: 16/9;
        background: var(--bg);
        border-radius: 16px;
        overflow: hidden;
        position: relative;
      }

      .slide-title-slide.pres,
      .slide-text-slide.pres,
      .slide-bullet-slide.pres,
      .slide-stats-slide.pres {
        font-size: 1.2em;
      }

      .pres-controls {
        position: absolute;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        gap: 12px;
        background: rgba(0, 0, 0, 0.7);
        padding: 10px 20px;
        border-radius: 30px;
      }

      .pres-btn {
        background: transparent;
        border: none;
        color: white;
        cursor: pointer;
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 1rem;
      }

      .pres-btn:hover {
        background: rgba(255, 255, 255, 0.2);
      }

      .pres-btn.exit {
        background: #dc2626;
      }

      .pres-counter {
        color: white;
        display: flex;
        align-items: center;
        padding: 0 12px;
      }
    `,
  ],
})
export class PitchDeckComponent implements OnInit, OnDestroy {
  @ViewChild("presentationRoot") presentationRoot?: ElementRef<HTMLDivElement>;

  // Template definitions
  templates: DeckTemplate[] = [];
  selectedTemplateId = "investor";
  currentSlides: SlideData[] = [];
  currentSlideIndex = 0;

  // Theme definitions
  themes = [
    {
      id: "default",
      name: "UAE",
      location: "Dubai, UAE",
      date: "2026",
      colors: {
        primary: "#1e3a5f",
        secondary: "#ffffff",
        accent: "#0ea5e9",
        background: "#ffffff",
      },
    },
    {
      id: "emerald",
      name: "Growth",
      location: "UAE",
      date: "2026",
      colors: {
        primary: "#059669",
        secondary: "#ecfdf5",
        accent: "#10b981",
        background: "#ffffff",
      },
    },
    {
      id: "royal",
      name: "Premium",
      location: "UAE",
      date: "2026",
      colors: {
        primary: "#7c3aed",
        secondary: "#f5f3ff",
        accent: "#a78bfa",
        background: "#ffffff",
      },
    },
    {
      id: "dark",
      name: "Modern",
      location: "UAE",
      date: "2026",
      colors: {
        primary: "#f8fafc",
        secondary: "#1e293b",
        accent: "#38bdf8",
        background: "#0f172a",
      },
    },
  ];
  selectedTheme = this.themes[0];

  // Presentation state
  isPresenting = false;
  presentationIndex = 0;
  presentationSlides: SlideData[] = [];

  private keydownHandler = (event: KeyboardEvent) => this.handleKeydown(event);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.initTemplates();
  }

  ngOnInit(): void {
    this.selectTemplate("investor");

    this.route.queryParams.subscribe((params) => {
      if (params["template"]) {
        this.selectTemplate(params["template"]);
      }
      if (params["theme"]) {
        this.selectTheme(params["theme"]);
      }
    });
  }

  ngOnDestroy(): void {
    window.removeEventListener("keydown", this.keydownHandler);
  }

  get currentSlide(): SlideData {
    return this.currentSlides[this.currentSlideIndex];
  }

  initTemplates(): void {
    this.templates = [
      {
        id: "investor",
        name: "Investor Deck",
        description: "VC/Angel ready",
        slides: this.getInvestorSlides(),
      },
      {
        id: "government",
        name: "Government",
        description: "RTA/ITC proposal",
        slides: this.getGovernmentSlides(),
      },
      {
        id: "quick",
        name: "Quick Pitch",
        description: "5 min overview",
        slides: this.getQuickSlides(),
      },
    ];
  }

  getInvestorSlides(): SlideData[] {
    return [
      {
        id: "1",
        title: "Smart Mobility Simulator",
        content: {
          type: "title",
          subtitle: "Transforming Urban Mobility in the Middle East",
        },
        notes:
          "Welcome everyone. Today I'm presenting Smart Mobility Simulator - a revolutionary platform for urban congestion pricing in UAE cities.",
      },
      {
        id: "2",
        title: "The Problem",
        content: {
          type: "bullet",
          headline: "UAE cities face critical transportation challenges",
          bullets: [
            "Dubai loses AED 6.5 billion annually to congestion (WSP Report)",
            "Average commute times increased 23% since 2019",
            "Carbon emissions from transport growing at 4% per year",
            "Current toll systems (Salik) lack dynamic pricing capability",
          ],
        },
        notes:
          "The problem is clear - UAE cities are growing faster than their infrastructure can handle. Traffic congestion costs the economy billions annually.",
      },
      {
        id: "3",
        title: "Market Opportunity",
        content: {
          type: "stats",
          stats: [
            { label: "UAE Population", value: "10.2M", change: "+5% YoY" },
            { label: "Vehicles Registered", value: "2.4M", change: "+8% YoY" },
            { label: "Smart City Budget", value: "$35B", change: "2024-2026" },
            { label: "Transport Apps", value: "12M+", change: "Active users" },
          ],
        },
        notes:
          "The market opportunity is massive. UAE is investing heavily in smart city infrastructure, and there's a clear gap in intelligent transportation pricing.",
      },
      {
        id: "4",
        title: "Our Solution",
        content: {
          type: "split",
          headline: "FAIR Pricing Model",
          leftText:
            "Smart Mobility Simulator provides dynamic congestion pricing that is Fair, Accessible, Incentivizing, and Revenue-generating. Unlike traditional toll systems, our model exempts residents and workers while encouraging public transit use.",
          bullets: [
            "Real-time zone-based pricing",
            "Automated exemption verification",
            "Integration with Salik & UAE Pass",
            "Arabic & English mobile app",
          ],
        },
        notes:
          "Our solution addresses all stakeholders - government, residents, workers, and businesses. The FAIR model ensures equity while generating revenue.",
      },
      {
        id: "5",
        title: "How It Works",
        content: {
          type: "bullet",
          bullets: [
            "Geofenced zones with ANPR cameras",
            "Vehicle classification (resident/worker/visitor)",
            "Dynamic pricing based on time & congestion",
            "Free grace period (20 min) for visitors",
            "Off-peak discounts after 8PM",
            "Seamless payment via UAE Pass",
          ],
        },
        notes:
          "The system is elegant in its simplicity. Zones are managed automatically, with minimal human intervention needed.",
      },
      {
        id: "6",
        title: "Competitive Advantage",
        content: {
          type: "bullet",
          bullets: [
            "First mover in UAE congestion pricing",
            "Proprietary simulation engine",
            "Integration-ready with RTA systems",
            "Aligns with Vision 2030 sustainability goals",
            "Proven results: 25% congestion reduction (based on Stockholm/London benchmarks)",
          ],
        },
        notes:
          "We have first-mover advantage in this market. Our simulation engine allows cities to test scenarios before implementation.",
      },
      {
        id: "7",
        title: "Business Model",
        content: {
          type: "text",
          headline: "Multi-stream revenue generation",
          body: "We generate revenue through: (1) Implementation fees for city deployment, (2) Annual licensing & support, (3) Transaction fees on payments, (4) Data analytics services for government planning. Projected Year 3 EBITDA margin: 45%.",
        },
        notes:
          "Our business model combines upfront implementation revenue with recurring licensing - creating a sustainable, growing business.",
      },
      {
        id: "8",
        title: "Traction & Validation",
        content: {
          type: "stats",
          stats: [
            { label: "Simulation Runs", value: "2,500+", change: "Completed" },
            { label: "Partner Interest", value: "3", change: "Govt entities" },
            { label: "Revenue (MVP)", value: "AED 180K", change: "Pilot" },
            { label: "Tech Readiness", value: "TL 7", change: "Scale" },
          ],
        },
        notes:
          "We've already completed over 2,500 simulations and have interest from 3 government entities.",
      },
      {
        id: "9",
        title: "Financial Projections",
        content: {
          type: "stats",
          stats: [
            { label: "Year 1 Revenue", value: "AED 2.5M" },
            { label: "Year 3 Revenue", value: "AED 12M" },
            { label: "Year 5 Revenue", value: "AED 35M" },
            { label: "Break-even", value: "18 months" },
          ],
        },
        notes:
          "Conservative projections show break-even within 18 months, with significant growth as we expand to other emirates.",
      },
      {
        id: "10",
        title: "The Ask",
        content: {
          type: "text",
          headline: "Raising AED 3M Seed Round",
          body: "Funds will be used for: Team expansion (30%), Technology development (25%), Government partnerships (25%), Operations (20%). Seeking strategic investors with government connections.",
        },
        notes:
          "We're raising AED 3 million to accelerate our growth. This will allow us to secure our first government contract and expand the team.",
      },
      {
        id: "11",
        title: "Our Team",
        content: {
          type: "bullet",
          bullets: [
            "CEO - Former RTA Strategy Director",
            "CTO - 15 years, ex-Careem/Uber",
            "COO - Operations expert, M.Sc. Transport",
            "Advisors: Former ITC Director, Dubai Smart City Lead",
          ],
        },
        notes:
          "Our team combines deep government relationships with top-tier technical expertise. We know this market inside out.",
      },
      {
        id: "12",
        title: "Vision",
        content: {
          type: "quote",
          quote:
            "Making UAE cities more livable, sustainable, and efficient through intelligent pricing.",
          quotee: "Smart Mobility Team",
        },
        notes:
          "Thank you for your time. We're excited to partner with investors who share our vision for a better UAE.",
      },
    ];
  }

  getGovernmentSlides(): SlideData[] {
    return [
      {
        id: "1",
        title: "Smart Mobility Pricing Initiative",
        content: {
          type: "title",
          subtitle:
            "Strategic Solution for Traffic Management & Sustainability",
        },
        notes:
          "Honorable officials, thank you for this opportunity to present our solution for improving urban mobility.",
      },
      {
        id: "2",
        title: "Executive Summary",
        content: {
          type: "bullet",
          headline: "A comprehensive congestion management system",
          bullets: [
            "Dynamic pricing based on time and congestion levels",
            "Equitable model protecting residents and workers",
            "Aligns with Vision 2030 and Net Zero 2050",
            "Proven effectiveness in 40+ global cities",
          ],
        },
        notes:
          "This initiative addresses multiple government objectives - from traffic management to environmental sustainability.",
      },
      {
        id: "3",
        title: "Current Challenges",
        content: {
          type: "bullet",
          bullets: [
            "Peak hour congestion increasing 8% annually",
            "Air quality index impacted by traffic",
            "Public transit utilization below target (35%)",
            "Need for sustainable transport funding",
          ],
        },
        notes:
          "These challenges require innovative solutions. Traditional infrastructure alone cannot solve this problem.",
      },
      {
        id: "4",
        title: "Our Solution",
        content: {
          type: "text",
          headline:
            "FAIR Model: Fair, Accessible, Incentivizing, Revenue-generating",
          body: "The system automatically identifies residents (via tenancy/employment records) and workers (via employer registration) for free or discounted access. Visitors receive 20 minutes free, then pay dynamic rates. Public transit users are always free. Off-peak (8PM-7AM) is free for all.",
        },
        notes:
          "Our model is uniquely designed for UAE - it respects the needs of residents while creating behavioral change.",
      },
      {
        id: "5",
        title: "Technology Platform",
        content: {
          type: "bullet",
          bullets: [
            "ANPR camera integration with existing Salik infrastructure",
            "UAE Pass for seamless digital identity and payments",
            "Real-time analytics dashboard for operations",
            "API-ready for future smart city integration",
          ],
        },
        notes:
          "We leverage existing infrastructure where possible, minimizing implementation cost and complexity.",
      },
      {
        id: "6",
        title: "International Benchmarks",
        content: {
          type: "stats",
          stats: [
            {
              label: "Singapore ERP",
              value: "22%",
              change: "Congestion reduction",
            },
            { label: "London CC", value: "15%", change: "Traffic reduction" },
            { label: "Stockholm", value: "20%", change: "Emissions drop" },
            {
              label: "Milan Area C",
              value: "30%",
              change: "City center traffic",
            },
          ],
        },
        notes:
          "These results are proven across multiple global cities. Our conservative estimate for Dubai: 20-25% congestion reduction.",
      },
      {
        id: "7",
        title: "Projected Impact",
        content: {
          type: "stats",
          stats: [
            { label: "Congestion Reduction", value: "20-25%" },
            { label: "CO₂ Reduction", value: "15%" },
            { label: "Public Transit Use", value: "+40%" },
            { label: "Annual Revenue", value: "AED 180M" },
          ],
        },
        notes:
          "Conservative projections based on international benchmarks, adjusted for UAE traffic patterns.",
      },
      {
        id: "8",
        title: "Implementation Timeline",
        content: {
          type: "bullet",
          bullets: [
            "Phase 1 (Months 1-3): Pilot zone selection & stakeholder alignment",
            "Phase 2 (Months 4-9): System development & integration",
            "Phase 3 (Months 10-12): Pilot launch with selected zone",
            "Phase 4 (Year 2): Evaluation & expansion planning",
          ],
        },
        notes:
          "We propose a phased approach, starting with a pilot zone before city-wide rollout.",
      },
      {
        id: "9",
        title: "Investment Required",
        content: {
          type: "stats",
          stats: [
            { label: "Pilot Phase", value: "AED 1.2M" },
            { label: "Expanded Rollout", value: "AED 3.5M" },
            { label: "Full Deployment", value: "AED 12M" },
            { label: "ROI Period", value: "18 months" },
          ],
        },
        notes:
          "Investment levels are flexible based on scope. The pilot phase can begin with minimal investment.",
      },
      {
        id: "10",
        title: "Risk Mitigation",
        content: {
          type: "bullet",
          bullets: [
            "Phased rollout reduces implementation risk",
            "Strong public communication campaign",
            "Graceful period for behavioral change",
            "Emergency protocols for exemptions",
          ],
        },
        notes:
          "We have comprehensive risk mitigation strategies for each potential challenge.",
      },
      {
        id: "11",
        title: "Next Steps",
        content: {
          type: "text",
          headline: "Request for Approval",
          body: "We respectfully request: (1) Approval to proceed with pilot zone selection, (2) Access to relevant data for detailed planning, (3) Introduction to key stakeholders for alignment.",
        },
        notes:
          "Thank you for your consideration. We are ready to begin immediately upon approval.",
      },
    ];
  }

  getQuickSlides(): SlideData[] {
    return [
      {
        id: "1",
        title: "Smart Mobility Simulator",
        content: {
          type: "title",
          subtitle: "Intelligent Congestion Pricing for UAE Cities",
        },
        notes: "Quick overview of our solution.",
      },
      {
        id: "2",
        title: "Problem & Solution",
        content: {
          type: "split",
          headline: "The Challenge",
          leftText:
            "UAE cities face severe congestion, costing billions annually in lost productivity and increased emissions.",
          bullets: [
            "Dynamic congestion pricing",
            "Fair exemptions for residents",
            "Integrates with Salik & UAE Pass",
          ],
        },
        notes: "",
      },
      {
        id: "3",
        title: "Results",
        content: {
          type: "stats",
          stats: [
            { label: "Reduction", value: "25%", change: "Congestion" },
            { label: "Revenue", value: "AED 180M", change: "Annual" },
            { label: "ROI", value: "18 mo", change: "Break-even" },
          ],
        },
        notes: "",
      },
      {
        id: "4",
        title: "Ask",
        content: {
          type: "text",
          headline: "AED 3M Seed Round",
          body: "Seeking partners for pilot implementation in Dubai. Team has deep RTA/ITC experience.",
        },
        notes: "",
      },
    ];
  }

  selectTemplate(id: string): void {
    this.selectedTemplateId = id;
    const template = this.templates.find((t) => t.id === id);
    if (template) {
      this.currentSlides = [...template.slides];
      this.currentSlideIndex = 0;
    }
  }

  selectTheme(id: string): void {
    const theme = this.themes.find((t) => t.id === id);
    if (theme) {
      this.selectedTheme = theme;
    }
  }

  goToSlide(index: number): void {
    this.currentSlideIndex = index;
  }

  nextSlide(): void {
    if (this.isPresenting) {
      if (this.presentationIndex < this.presentationSlides.length - 1) {
        this.presentationIndex++;
      }
    } else {
      if (this.currentSlideIndex < this.currentSlides.length - 1) {
        this.currentSlideIndex++;
      }
    }
  }

  prevSlide(): void {
    if (this.isPresenting) {
      if (this.presentationIndex > 0) {
        this.presentationIndex--;
      }
    } else {
      if (this.currentSlideIndex > 0) {
        this.currentSlideIndex--;
      }
    }
  }

  startPresentation(): void {
    this.isPresenting = true;
    this.presentationIndex = this.currentSlideIndex;
    this.presentationSlides = [...this.currentSlides];
    window.addEventListener("keydown", this.keydownHandler);

    if (this.presentationRoot?.nativeElement.requestFullscreen) {
      this.presentationRoot.nativeElement.requestFullscreen().catch(() => null);
    }
  }

  stopPresentation(): void {
    this.isPresenting = false;
    window.removeEventListener("keydown", this.keydownHandler);

    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => null);
    }
  }

  private handleKeydown(event: KeyboardEvent): void {
    if (!this.isPresenting) return;
    if (event.key === "ArrowRight" || event.key === " ") {
      this.nextSlide();
    }
    if (event.key === "ArrowLeft") {
      this.prevSlide();
    }
    if (event.key === "Escape") {
      this.stopPresentation();
    }
  }

  exportPdf(): void {
    const doc = new jsPDF();
    const template = this.templates.find(
      (t) => t.id === this.selectedTemplateId,
    );
    const templateName = template?.name || "Pitch Deck";

    // Title
    doc.setFontSize(20);
    doc.setTextColor(30, 58, 95);
    doc.text("Smart Mobility Simulator - " + templateName, 20, 20);

    doc.setFontSize(12);
    doc.setTextColor(60);
    doc.text("Investor/Government Presentation", 20, 30);
    doc.text("Generated: " + new Date().toLocaleDateString(), 20, 38);

    let yPos = 55;

    // Iterate through all slides and add content
    this.currentSlides.forEach((slide, index) => {
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }

      doc.setFontSize(14);
      doc.setTextColor(0, 51, 102);
      doc.text(`Slide ${index + 1}: ${slide.title}`, 20, yPos);
      yPos += 10;

      if (slide.content.type === "bullet" && slide.content.bullets) {
        doc.setFontSize(10);
        doc.setTextColor(60);
        slide.content.bullets.forEach((bullet) => {
          if (yPos > 270) {
            doc.addPage();
            yPos = 20;
          }
          const lines = doc.splitTextToSize("• " + bullet, 170);
          doc.text(lines, 25, yPos);
          yPos += lines.length * 5;
        });
      } else if (slide.content.type === "text" && slide.content.body) {
        doc.setFontSize(10);
        doc.setTextColor(60);
        const lines = doc.splitTextToSize(slide.content.body, 170);
        doc.text(lines, 25, yPos);
        yPos += lines.length * 5;
      } else if (slide.content.type === "stats" && slide.content.stats) {
        doc.setFontSize(10);
        doc.setTextColor(60);
        slide.content.stats.forEach((stat) => {
          const statText = `${stat.label}: ${stat.value}${stat.change ? " (" + stat.change + ")" : ""}`;
          doc.text(statText, 25, yPos);
          yPos += 6;
        });
      }

      yPos += 10;
    });

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text("Smart Mobility Simulator - Transforming Urban Mobility", 20, 280);

    doc.save("Smart-Zone-Pitch-Deck.pdf");
  }
}



