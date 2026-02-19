import { AfterViewInit, Component, OnDestroy, OnInit } from "@angular/core";
import { ZoneService } from "../../services/zone.service";
import { Zone } from "../../models/zone.model";
import * as L from "leaflet";
import { TrafficLayerService } from "../../services/traffic-layer.service";

type TrafficMode = "live" | "historical" | "simulation";

@Component({
  selector: "app-zone-map",
  templateUrl: "./zone-map.component.html",
  styleUrls: ["./zone-map.component.css"],
})
export class ZoneMapComponent implements OnInit, AfterViewInit, OnDestroy {
  zones: Zone[] = [];
  selectedZone: Zone | null = null;
  mapCenter = { lat: 24.4539, lng: 54.3773 }; // UAE center
  mapZoom = 8;
  timeIndex = new Date().getHours();
  isAnimating = false;
  animationSpeed = 1500;
  isLoading = false;
  error: string | null = null;
  trafficMode: TrafficMode = "historical";
  liveTrafficAvailable = false;
  lastTrafficUpdate: Date | null = null;
  private map: L.Map | null = null;
  private markerLayer: L.LayerGroup | null = null;
  private polygonLayer: L.LayerGroup | null = null;
  private refreshHandle: number | null = null;
  private heatmapTimer: number | null = null;
  private zoneLayers = new Map<string, L.GeoJSON>();
  private zoneBounds = new Map<string, L.LatLngBounds>();

  // Get zones grouped by emirate
  get zonesByEmirate(): { emirate: string; zones: Zone[] }[] {
    const grouped = this.zones.reduce(
      (acc, zone) => {
        const emirate = zone.emirate || "Other";
        if (!acc[emirate]) {
          acc[emirate] = [];
        }
        acc[emirate].push(zone);
        return acc;
      },
      {} as Record<string, Zone[]>,
    );

    return Object.entries(grouped)
      .map(([emirate, zones]) => ({ emirate, zones }))
      .sort((a, b) => a.emirate.localeCompare(b.emirate));
  }

  constructor(
    private zoneService: ZoneService,
    private trafficLayerService: TrafficLayerService,
  ) {}

  ngOnInit(): void {
    this.loadZones();
    this.refreshHandle = window.setInterval(() => this.loadZones(false), 15000);
  }

  ngAfterViewInit(): void {
    this.initializeMap();
  }

  ngOnDestroy(): void {
    if (this.refreshHandle) {
      window.clearInterval(this.refreshHandle);
    }
    if (this.heatmapTimer) {
      window.clearInterval(this.heatmapTimer);
    }
    this.trafficLayerService.stopLiveUpdates();
    if (this.map) {
      this.map.remove();
    }
  }

  loadZones(showLoading: boolean = true): void {
    this.isLoading = showLoading;
    this.zoneService.getAllZones().subscribe({
      next: (zones: Zone[]) => {
        this.zones = zones;
        this.isLoading = false;
        this.renderZonePolygons();
      },
      error: (err: any) => {
        this.error = "Failed to load zones";
        this.isLoading = false;
        console.error(err);
      },
    });
  }

  onZoneSelected(zone: Zone): void {
    this.selectedZone = zone;
    // Center map on selected zone
    const coords = this.getZoneCoordinates(zone);
    this.mapCenter = { lat: coords[0], lng: coords[1] };
    this.mapZoom = 11;
    if (this.map) {
      this.map.setView(coords, this.mapZoom);
    }
    this.refreshTrafficLayer();
  }

  filterByEmirate(emirate: string): void {
    if (emirate === "All") {
      this.loadZones();
      this.setMapViewByEmirate(emirate);
    } else {
      this.isLoading = true;
      this.zoneService.getZonesByEmirate(emirate).subscribe({
        next: (zones: Zone[]) => {
          this.zones = zones;
          this.isLoading = false;
          this.renderZonePolygons();
          this.setMapViewByEmirate(emirate);
        },
        error: (err: any) => {
          this.error = `Failed to load zones for ${emirate}`;
          this.isLoading = false;
        },
      });
    }
  }

  onTimeChange(): void {
    this.updateHeatmapStyles();
    if (this.trafficMode === "historical" && this.selectedZone) {
      this.showHistoricalTraffic();
    }
  }

  toggleAnimation(): void {
    if (this.isAnimating) {
      this.stopAnimation();
    } else {
      this.startAnimation();
    }
  }

  startAnimation(): void {
    if (this.heatmapTimer) {
      window.clearInterval(this.heatmapTimer);
    }
    this.isAnimating = true;
    this.heatmapTimer = window.setInterval(() => {
      this.timeIndex = (this.timeIndex + 1) % 24;
      this.updateHeatmapStyles();
    }, this.animationSpeed);
  }

  stopAnimation(): void {
    if (this.heatmapTimer) {
      window.clearInterval(this.heatmapTimer);
      this.heatmapTimer = null;
    }
    this.isAnimating = false;
  }

  onSpeedChange(): void {
    if (this.isAnimating) {
      this.startAnimation();
    }
  }

  formatHour(hour: number): string {
    const normalized = ((hour % 24) + 24) % 24;
    const suffix = normalized >= 12 ? "PM" : "AM";
    const display = normalized % 12 === 0 ? 12 : normalized % 12;
    return `${display}:00 ${suffix}`;
  }

  getZoneColor(zoneType: string): string {
    switch (zoneType) {
      case "Residential":
        return "#4CAF50";
      case "Commercial":
        return "#FF9800";
      case "Industrial":
        return "#9C27B0";
      case "Mixed":
        return "#2196F3";
      default:
        return "#757575";
    }
  }

  private initializeMap(): void {
    const defaultIcon = L.icon({
      iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    L.Marker.prototype.options.icon = defaultIcon;

    this.map = L.map("zone-map", {
      center: [this.mapCenter.lat, this.mapCenter.lng],
      zoom: this.mapZoom,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(this.map);

    this.markerLayer = L.layerGroup().addTo(this.map);
    this.polygonLayer = L.layerGroup().addTo(this.map);
    this.trafficLayerService.initialize(this.map);
    this.liveTrafficAvailable = this.trafficLayerService.isLiveAvailable();
    this.renderZonePolygons();
  }

  private renderZonePolygons(): void {
    if (!this.map || !this.polygonLayer) {
      return;
    }

    this.polygonLayer.clearLayers();
    this.zoneLayers.clear();

    this.zones.forEach((zone) => {
      this.zoneService.getZoneBoundary(zone.id).subscribe({
        next: (geoJson) => {
          const congestion = this.getCongestionLevel(zone, this.timeIndex);
          const color = this.getCongestionColor(congestion);

          const layer = L.geoJSON(geoJson, {
            style: {
              color,
              fillColor: color,
              weight: 2,
              fillOpacity: 0.35,
            },
          });

          const bounds = (layer as any).getBounds?.();
          if (bounds) {
            this.zoneBounds.set(zone.id, bounds as L.LatLngBounds);
          }

          layer.eachLayer((featureLayer) => {
            featureLayer.on("mouseover", () => {
              (featureLayer as L.Path).setStyle({ fillOpacity: 0.55 });
            });
            featureLayer.on("mouseout", () => {
              (featureLayer as L.Path).setStyle({ fillOpacity: 0.35 });
            });
            featureLayer.on("click", () => {
              this.onZoneSelected(zone);
            });
          });

          this.updateLayerPopup(layer, zone, congestion);
          this.zoneLayers.set(zone.id, layer);
          layer.addTo(this.polygonLayer!);
          this.updateHeatmapStyles();
          if (this.selectedZone?.id === zone.id) {
            this.refreshTrafficLayer();
          }
        },
      });
    });
  }

  setTrafficMode(mode: TrafficMode): void {
    this.trafficMode = mode;
    if (mode === "live") {
      this.stopAnimation();
    }
    this.refreshTrafficLayer();
  }

  private refreshTrafficLayer(): void {
    if (!this.selectedZone || !this.map) {
      return;
    }

    const boundingBox = this.getZoneBoundingBox(this.selectedZone.id);

    if (this.trafficMode === "live") {
      if (!this.liveTrafficAvailable) {
        this.trafficMode = "historical";
        this.showHistoricalTraffic();
        return;
      }
      this.trafficLayerService.startLiveUpdates(this.selectedZone, boundingBox);
      this.lastTrafficUpdate = new Date();
      return;
    }

    this.trafficLayerService.stopLiveUpdates();

    if (this.trafficMode === "simulation") {
      this.showSimulationTraffic();
      return;
    }

    this.showHistoricalTraffic();
  }

  private showHistoricalTraffic(): void {
    if (!this.selectedZone) return;
    const time = this.getTimeForSlider();
    this.trafficLayerService.showHistoricalPattern(
      this.selectedZone,
      time,
      this.getZoneBoundingBox(this.selectedZone.id),
    );
  }

  private showSimulationTraffic(): void {
    if (!this.selectedZone) return;
    const time = this.getTimeForSlider();
    this.trafficLayerService.showSimulationResults(
      this.selectedZone,
      time,
      this.getZoneBoundingBox(this.selectedZone.id),
    );
  }

  private getTimeForSlider(): Date {
    const time = new Date();
    time.setHours(this.timeIndex, 0, 0, 0);
    return time;
  }

  private getZoneBoundingBox(zoneId: string): string | undefined {
    const bounds = this.zoneBounds.get(zoneId);
    if (!bounds) return undefined;
    return `${bounds.getWest()},${bounds.getSouth()},${bounds.getEast()},${bounds.getNorth()}`;
  }

  private getCongestionLevel(zone: Zone, hour: number): number {
    const base = (() => {
      switch (zone.zoneType) {
        case "Commercial":
          return 60;
        case "Industrial":
          return 55;
        case "Mixed":
          return 50;
        case "Residential":
        default:
          return 40;
      }
    })();

    const morningPeak = hour >= 7 && hour <= 9 ? 18 : 0;
    const midday = hour >= 12 && hour <= 14 ? 8 : 0;
    const eveningPeak = hour >= 16 && hour <= 19 ? 22 : 0;
    const nightRelief = hour >= 21 || hour <= 5 ? -12 : 0;
    const jitter = this.getZoneJitter(zone.name);

    const raw =
      base + morningPeak + midday + eveningPeak + nightRelief + jitter;
    return Math.max(15, Math.min(95, Math.round(raw)));
  }

  private getCongestionColor(congestion: number): string {
    if (congestion < 30) return "#4CAF50";
    if (congestion <= 70) return "#FFC107";
    return "#F44336";
  }

  private getZoneStats(
    zone: Zone,
    congestion: number,
  ): {
    vehiclesPerHour: number;
    avgSpeed: number;
    congestion: number;
  } {
    const vehiclesPerHour = Math.round(500 + (zone.chargePerHour || 20) * 8);
    const avgSpeed = Math.max(20, Math.round(60 - congestion * 0.4));
    return { vehiclesPerHour, avgSpeed, congestion };
  }

  private updateHeatmapStyles(): void {
    if (!this.map || this.zoneLayers.size === 0) {
      return;
    }

    this.zones.forEach((zone) => {
      const layer = this.zoneLayers.get(zone.id);
      if (!layer) return;

      const congestion = this.getCongestionLevel(zone, this.timeIndex);
      const color = this.getCongestionColor(congestion);
      layer.setStyle({ color, fillColor: color, fillOpacity: 0.4 });
      this.updateLayerPopup(layer, zone, congestion);
    });
  }

  private updateLayerPopup(
    layer: L.GeoJSON,
    zone: Zone,
    congestion: number,
  ): void {
    const stats = this.getZoneStats(zone, congestion);
    layer.bindPopup(
      `<strong>${zone.name}</strong><br/>${zone.emirate} • ${zone.zoneType}` +
        `<br/>Time: ${this.formatHour(this.timeIndex)}` +
        `<br/>Vehicles/hr: ${stats.vehiclesPerHour}` +
        `<br/>Avg speed: ${stats.avgSpeed} km/h` +
        `<br/>Congestion: ${stats.congestion}%`,
    );
  }

  private getZoneJitter(seed: string): number {
    let hash = 0;
    for (let i = 0; i < seed.length; i += 1) {
      hash = (hash << 5) - hash + seed.charCodeAt(i);
      hash |= 0;
    }
    return (Math.abs(hash) % 7) - 3;
  }

  private getZoneCoordinates(zone: Zone): [number, number] {
    const fallback: Record<string, [number, number]> = {
      "Dubai Marina": [25.0809, 55.1405],
      "Dubai Downtown": [25.1972, 55.2744],
      "Deira Business": [25.2753, 55.3089],
      "Al Qusais": [25.2847, 55.3764],
      Satwa: [25.2354, 55.2771],
      "Al Quoz": [25.126, 55.2361],
      "Sharjah Residential": [25.3463, 55.4209],
      "Abu Dhabi City": [24.4667, 54.3667],
      "Khalifa City": [24.4259, 54.5644],
      "Reem Island": [24.4957, 54.4125],
      "Musaffah Industrial": [24.3525, 54.5126],
      "Musaffah Residential": [24.3744, 54.5375],
    };

    const lat = (zone as any).latitude;
    const lng = (zone as any).longitude;

    if (typeof lat === "number" && typeof lng === "number") {
      return [lat, lng];
    }

    return fallback[zone.name] ?? [this.mapCenter.lat, this.mapCenter.lng];
  }

  private setMapViewByEmirate(emirate: string): void {
    const views: Record<string, { center: [number, number]; zoom: number }> = {
      All: { center: [24.4539, 54.3773], zoom: 8 },
      Dubai: { center: [25.2048, 55.2708], zoom: 10 },
      "Abu Dhabi": { center: [24.4539, 54.3773], zoom: 11 },
      Sharjah: { center: [25.3463, 55.4209], zoom: 11 },
    };

    const view = views[emirate] ?? views["All"];
    this.mapCenter = { lat: view.center[0], lng: view.center[1] };
    this.mapZoom = view.zoom;

    if (this.map) {
      this.map.setView(view.center, view.zoom);
    }
  }
}



