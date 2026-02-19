import { Injectable } from "@angular/core";
import { Chart, ChartConfiguration, ChartType, registerables } from "chart.js";

@Injectable({
  providedIn: "root",
})
export class ChartService {
  private charts: Map<string, Chart> = new Map();
  private isDarkMode = false;

  // Dark mode compatible colors
  private colors = {
    primary: "#3b82f6",
    secondary: "#10b981",
    warning: "#f59e0b",
    danger: "#ef4444",
    purple: "#8b5cf6",
    pink: "#ec4899",
    cyan: "#06b6d4",
    // Dark mode variants
    darkPrimary: "#60a5fa",
    darkSecondary: "#34d399",
    darkBackground: "#1e293b",
    darkText: "#f1f5f9",
  };

  constructor() {
    Chart.register(...registerables);
    this.detectDarkMode();
  }

  private detectDarkMode(): void {
    this.isDarkMode = document.documentElement.classList.contains("dark");
    // Listen for theme changes
    const observer = new MutationObserver(() => {
      this.isDarkMode = document.documentElement.classList.contains("dark");
      this.updateAllChartThemes();
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
  }

  private getThemeColors() {
    return this.isDarkMode
      ? {
          text: "#f1f5f9",
          grid: "#334155",
          background: "transparent",
        }
      : {
          text: "#1e293b",
          grid: "#e2e8f0",
          background: "transparent",
        };
  }

  private getDefaultColors(): string[] {
    return this.isDarkMode
      ? [
          this.colors.darkPrimary,
          this.colors.darkSecondary,
          this.colors.warning,
          this.colors.danger,
          this.colors.purple,
          this.colors.pink,
          this.colors.cyan,
        ]
      : [
          this.colors.primary,
          this.colors.secondary,
          this.colors.warning,
          this.colors.danger,
          this.colors.purple,
          this.colors.pink,
          this.colors.cyan,
        ];
  }

  private applyThemeOptions(options: any): any {
    const theme = this.getThemeColors();
    return {
      ...options,
      color: theme.text,
      scales: {
        x: {
          ...options?.scales?.x,
          grid: { color: theme.grid },
          ticks: { color: theme.text },
        },
        y: {
          ...options?.scales?.y,
          grid: { color: theme.grid },
          ticks: { color: theme.text },
        },
      },
      plugins: {
        ...options?.plugins,
        legend: {
          ...options?.plugins?.legend,
          labels: { color: theme.text },
        },
      },
    };
  }

  updateAllChartThemes(): void {
    this.charts.forEach((chart) => {
      const theme = this.getThemeColors();
      const options = chart.options as any;
      if (options?.scales?.x) {
        if (options.scales.x.grid) options.scales.x.grid.color = theme.grid;
        if (options.scales.x.ticks) options.scales.x.ticks.color = theme.text;
      }
      if (options?.scales?.y) {
        if (options.scales.y.grid) options.scales.y.grid.color = theme.grid;
        if (options.scales.y.ticks) options.scales.y.ticks.color = theme.text;
      }
      chart.update();
    });
  }

  /**
   * Create a new chart
   */
  createChart(
    canvasId: string,
    config: ChartConfiguration,
    chartId?: string,
  ): Chart {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!canvas) {
      throw new Error(`Canvas element with id '${canvasId}' not found`);
    }

    // Destroy existing chart if any
    if (this.charts.has(chartId || canvasId)) {
      this.charts.get(chartId || canvasId)?.destroy();
    }

    // Apply theme to config
    config = this.applyThemeToConfig(config);

    const chart = new Chart(canvas, config);
    this.charts.set(chartId || canvasId, chart);
    return chart;
  }

  private applyThemeToConfig(config: ChartConfiguration): ChartConfiguration {
    const theme = this.getThemeColors();
    const colors = this.getDefaultColors();

    if (config.data.datasets) {
      config.data.datasets = config.data.datasets.map(
        (ds: any, index: number) => ({
          ...ds,
          borderColor: ds.borderColor || colors[index % colors.length],
          backgroundColor: ds.backgroundColor || colors[index % colors.length],
          pointBackgroundColor: colors[index % colors.length],
          pointBorderColor: theme.text,
        }),
      );
    }

    return config;
  }

  /**
   * Create a bar chart with improved styling
   */
  createBarChart(
    canvasId: string,
    labels: string[],
    datasets: {
      label: string;
      data: number[];
      backgroundColor?: string | string[];
    }[],
    options?: any,
    chartId?: string,
  ): Chart {
    const colors = this.getDefaultColors();
    const config: ChartConfiguration = {
      type: "bar",
      data: {
        labels,
        datasets: datasets.map((ds, index) => ({
          ...ds,
          backgroundColor: ds.backgroundColor || colors[index % colors.length],
          borderColor: ds.backgroundColor
            ? Array.isArray(ds.backgroundColor)
              ? ds.backgroundColor[0]
              : ds.backgroundColor
            : colors[index % colors.length],
          borderWidth: 1,
          borderRadius: 6,
          barPercentage: 0.8,
        })),
      },
      options: this.applyThemeOptions({
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
          },
          title: {
            display: false,
          },
          tooltip: {
            backgroundColor: this.isDarkMode ? "#334155" : "#1e293b",
            titleColor: "#f1f5f9",
            bodyColor: "#f1f5f9",
            padding: 12,
            cornerRadius: 8,
          },
        },
        ...options,
      }),
    };
    return this.createChart(canvasId, config, chartId);
  }

  /**
   * Create a line chart with improved styling
   */
  createLineChart(
    canvasId: string,
    labels: string[],
    datasets: {
      label: string;
      data: number[];
      borderColor?: string;
      backgroundColor?: string;
      fill?: boolean;
    }[],
    options?: any,
    chartId?: string,
  ): Chart {
    const colors = this.getDefaultColors();
    const config: ChartConfiguration = {
      type: "line",
      data: {
        labels,
        datasets: datasets.map((ds, index) => ({
          ...ds,
          borderColor: ds.borderColor || colors[index % colors.length],
          backgroundColor:
            ds.backgroundColor || `${colors[index % colors.length]}20`,
          fill: ds.fill !== undefined ? ds.fill : true,
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6,
          borderWidth: 2,
        })),
      },
      options: this.applyThemeOptions({
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
          },
          tooltip: {
            backgroundColor: this.isDarkMode ? "#334155" : "#1e293b",
            titleColor: "#f1f5f9",
            bodyColor: "#f1f5f9",
            padding: 12,
            cornerRadius: 8,
          },
        },
        ...options,
      }),
    };
    return this.createChart(canvasId, config, chartId);
  }

  /**
   * Create a doughnut chart with improved styling
   */
  createDoughnutChart(
    canvasId: string,
    labels: string[],
    datasets: { label: string; data: number[]; backgroundColor?: string[] }[],
    options?: any,
    chartId?: string,
  ): Chart {
    const config: ChartConfiguration = {
      type: "doughnut",
      data: {
        labels,
        datasets: datasets.map((ds) => ({
          ...ds,
          backgroundColor: ds.backgroundColor || this.getDefaultColors(),
          borderWidth: 2,
          borderColor: this.isDarkMode ? "#1e293b" : "#ffffff",
          hoverOffset: 8,
        })),
      },
      options: this.applyThemeOptions({
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "right",
            labels: {
              padding: 16,
              usePointStyle: true,
            },
          },
          tooltip: {
            backgroundColor: this.isDarkMode ? "#334155" : "#1e293b",
            titleColor: "#f1f5f9",
            bodyColor: "#f1f5f9",
            padding: 12,
            cornerRadius: 8,
          },
        },
        cutout: "65%",
        ...options,
      }),
    };
    return this.createChart(canvasId, config, chartId);
  }

  /**
   * Create a pie chart
   */
  createPieChart(
    canvasId: string,
    labels: string[],
    datasets: { label: string; data: number[]; backgroundColor?: string[] }[],
    options?: any,
    chartId?: string,
  ): Chart {
    const config: ChartConfiguration = {
      type: "pie",
      data: {
        labels,
        datasets: datasets.map((ds) => ({
          ...ds,
          backgroundColor: ds.backgroundColor || this.getDefaultColors(),
          borderWidth: 2,
          borderColor: this.isDarkMode ? "#1e293b" : "#ffffff",
          hoverOffset: 8,
        })),
      },
      options: this.applyThemeOptions({
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "right",
            labels: {
              padding: 16,
              usePointStyle: true,
            },
          },
          tooltip: {
            backgroundColor: this.isDarkMode ? "#334155" : "#1e293b",
            titleColor: "#f1f5f9",
            bodyColor: "#f1f5f9",
            padding: 12,
            cornerRadius: 8,
          },
        },
        ...options,
      }),
    };
    return this.createChart(canvasId, config, chartId);
  }

  /**
   * Create a radar chart (new)
   */
  createRadarChart(
    canvasId: string,
    labels: string[],
    datasets: {
      label: string;
      data: number[];
      borderColor?: string;
      backgroundColor?: string;
    }[],
    options?: any,
    chartId?: string,
  ): Chart {
    const colors = this.getDefaultColors();
    const config: ChartConfiguration = {
      type: "radar",
      data: {
        labels,
        datasets: datasets.map((ds, index) => ({
          ...ds,
          borderColor: ds.borderColor || colors[index % colors.length],
          backgroundColor:
            ds.backgroundColor || `${colors[index % colors.length]}40`,
          borderWidth: 2,
          pointBackgroundColor: colors[index % colors.length],
        })),
      },
      options: this.applyThemeOptions({
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "top" },
        },
        scales: {
          r: {
            grid: { color: this.getThemeColors().grid },
            pointLabels: { color: this.getThemeColors().text },
            ticks: { display: false },
          },
        },
        ...options,
      }),
    };
    return this.createChart(canvasId, config, chartId);
  }

  /**
   * Get a chart by ID
   */
  getChart(chartId: string): Chart | undefined {
    return this.charts.get(chartId);
  }

  /**
   * Update chart data
   */
  updateChartData(chartId: string, labels: string[], datasets: any[]): void {
    const chart = this.charts.get(chartId);
    if (chart) {
      chart.data.labels = labels;
      chart.data.datasets = datasets;
      chart.update();
    }
  }

  /**
   * Destroy a chart
   */
  destroyChart(chartId: string): void {
    const chart = this.charts.get(chartId);
    if (chart) {
      chart.destroy();
      this.charts.delete(chartId);
    }
  }

  /**
   * Destroy all charts
   */
  destroyAllCharts(): void {
    this.charts.forEach((chart) => chart.destroy());
    this.charts.clear();
  }

  /**
   * Export chart as image
   */
  exportChartAsImage(chartId: string, filename: string = "chart.png"): void {
    const chart = this.charts.get(chartId);
    if (chart) {
      const link = document.createElement("a");
      link.download = filename;
      link.href = chart.toBase64Image();
      link.click();
    }
  }
}
