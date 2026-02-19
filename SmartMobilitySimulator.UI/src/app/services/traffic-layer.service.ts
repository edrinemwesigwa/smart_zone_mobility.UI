import { Injectable } from "@angular/core";
import * as L from "leaflet";
import {
  TrafficApiService,
  TrafficData,
  HistoricalPatternResponse,
  TrafficIncident,
  TrafficSegment,
} from "./traffic-api.service";
import { Zone } from "../models/zone.model";

@Injectable({
  providedIn: "root",
})
export class TrafficLayerService {
  private map: L.Map | null = null;
  private trafficLayer: L.LayerGroup | null = null;
  private heatmapLayer: any = null;
  private speedLayer: L.LayerGroup | null = null;
  private flowLayer: L.LayerGroup | null = null;
  private incidentLayer: L.LayerGroup | null = null;
  private overlayLayer: L.LayerGroup | null = null;
  private liveRefreshHandle: number | null = null;

  constructor(private trafficApi: TrafficApiService) {}

  isLiveAvailable(): boolean {
    return this.trafficApi.isLiveAvailable();
  }

  initialize(map: L.Map): void {
    this.map = map;
    this.trafficLayer = L.layerGroup().addTo(map);
    this.speedLayer = L.layerGroup().addTo(map);
    this.flowLayer = L.layerGroup().addTo(map);
    this.incidentLayer = L.layerGroup().addTo(map);
    this.overlayLayer = L.layerGroup().addTo(map);

    const heatLayerFactory = (L as any).heatLayer;
    if (heatLayerFactory) {
      this.heatmapLayer = heatLayerFactory([], {
        radius: 25,
        blur: 18,
        maxZoom: 13,
      }).addTo(map);
    } else {
      this.heatmapLayer = L.layerGroup().addTo(map);
    }
  }

  clear(): void {
    this.trafficLayer?.clearLayers();
    this.speedLayer?.clearLayers();
    this.flowLayer?.clearLayers();
    this.incidentLayer?.clearLayers();
    this.overlayLayer?.clearLayers();
    if (this.heatmapLayer?.setLatLngs) {
      this.heatmapLayer.setLatLngs([]);
    } else if (this.heatmapLayer?.clearLayers) {
      this.heatmapLayer.clearLayers();
    }
  }

  stopLiveUpdates(): void {
    if (this.liveRefreshHandle) {
      window.clearInterval(this.liveRefreshHandle);
      this.liveRefreshHandle = null;
    }
  }

  startLiveUpdates(zone: Zone, boundingBox?: string): void {
    this.stopLiveUpdates();
    this.showLiveTraffic(zone, boundingBox);
    this.liveRefreshHandle = window.setInterval(
      () => {
        this.showLiveTraffic(zone, boundingBox);
      },
      5 * 60 * 1000,
    );
  }

  async showLiveTraffic(zone: Zone, boundingBox?: string): Promise<void> {
    const traffic = await this.trafficApi.getLiveTraffic(zone.id);
    this.renderTraffic(traffic, zone, boundingBox);
  }

  async showHistoricalPattern(
    zone: Zone,
    time: Date,
    boundingBox?: string,
  ): Promise<void> {
    const pattern = await this.trafficApi.getHistoricalPattern(zone.id, time);
    this.renderHistorical(pattern, zone, time, boundingBox);
  }

  async showSimulationResults(
    zone: Zone,
    time: Date,
    boundingBox?: string,
  ): Promise<void> {
    const pattern = await this.trafficApi.getHistoricalPattern(zone.id, time);
    this.renderHistorical(pattern, zone, time, boundingBox, true);
  }

  private renderTraffic(
    traffic: TrafficData,
    zone: Zone,
    boundingBox?: string,
  ): void {
    this.clear();
    const center = this.getZoneCenter(zone);
    const bounds = this.getBoundingBox(boundingBox, center);

    const segments = this.inflateSegments(traffic.segments, bounds);
    const heatPoints = this.convertSegmentsToHeatmap(segments);

    this.setHeatmapPoints(heatPoints);
    this.addFlowLines(segments);
    this.addSpeedIndicators(segments);
    this.addIncidents(traffic.incidents, center, bounds);
  }

  private renderHistorical(
    pattern: HistoricalPatternResponse,
    zone: Zone,
    time: Date,
    boundingBox?: string,
    isSimulation = false,
  ): void {
    this.clear();
    const center = this.getZoneCenter(zone);
    const bounds = this.getBoundingBox(boundingBox, center);

    const segments = this.inflateSegments(pattern.segments, bounds);
    const heatPoints = this.convertSegmentsToHeatmap(segments);

    this.setHeatmapPoints(heatPoints);
    this.addFlowLines(segments, isSimulation);
    this.addSpeedIndicators(segments);
    this.addIncidents(pattern.incidents, center, bounds);

    if (this.isPrayerTime(time)) {
      this.addPrayerTimeOverlay(center);
    }

    if (this.isSchoolTime(time)) {
      this.highlightSchoolZones(center);
    }

    if (this.isConstructionSeason(time)) {
      this.addConstructionWarnings(center);
    }
  }

  private setHeatmapPoints(points: [number, number, number][]): void {
    if (this.heatmapLayer?.setLatLngs) {
      this.heatmapLayer.setLatLngs(points);
      return;
    }

    if (this.heatmapLayer?.clearLayers) {
      this.heatmapLayer.clearLayers();
      points.forEach(([lat, lng, intensity]) => {
        const circle = L.circleMarker([lat, lng], {
          radius: 8 + intensity * 8,
          fillColor: "#F44336",
          fillOpacity: Math.min(0.7, 0.2 + intensity * 0.5),
          stroke: false,
        });
        circle.addTo(this.heatmapLayer);
      });
    }
  }

  private convertSegmentsToHeatmap(
    segments: TrafficSegment[],
  ): [number, number, number][] {
    return segments.flatMap((segment) => {
      const intensity = Math.min(
        1,
        Math.max(0.1, segment.congestionLevel / 100),
      );
      return segment.path.map((point): [number, number, number] => [
        point[0],
        point[1],
        intensity,
      ]);
    });
  }

  private addSpeedIndicators(segments: TrafficSegment[]): void {
    if (!this.speedLayer) return;

    segments.forEach((segment) => {
      const mid = this.getSegmentMidpoint(segment.path);
      if (!mid) return;

      const marker = L.marker([mid[0], mid[1]], {
        icon: L.divIcon({
          className: "speed-indicator",
          html: `<span>${Math.round(segment.speed)} km/h</span>`,
        }),
      });
      marker.addTo(this.speedLayer!);
    });
  }

  private addFlowLines(segments: TrafficSegment[], isSimulation = false): void {
    if (!this.flowLayer) return;

    segments.forEach((segment) => {
      const color = this.getCongestionColor(segment.congestionLevel);
      const polyline = L.polyline(segment.path, {
        color,
        weight: 4,
        opacity: isSimulation ? 0.7 : 0.9,
        dashArray: "8 10",
        className: "traffic-flow",
      });
      polyline.addTo(this.flowLayer!);
    });
  }

  private addIncidents(
    incidents: TrafficIncident[],
    center: L.LatLng,
    bounds: L.LatLngBounds,
  ): void {
    if (!this.incidentLayer) return;

    const seeded =
      incidents.length > 0 ? incidents : this.generateIncidents(center, bounds);
    seeded.forEach((incident) => {
      const marker = L.marker([incident.latitude, incident.longitude], {
        icon: L.divIcon({
          className: `incident-marker ${incident.severity.toLowerCase()}`,
          html: `<span>${incident.type}</span>`,
        }),
      });
      marker.bindPopup(
        `<strong>${incident.type}</strong><br/>${incident.description}`,
      );
      marker.addTo(this.incidentLayer!);
    });
  }

  private addPrayerTimeOverlay(center: L.LatLng): void {
    if (!this.overlayLayer) return;
    const circle = L.circle(center, {
      radius: 2200,
      color: "#5C6BC0",
      weight: 2,
      fillOpacity: 0.08,
      dashArray: "6 6",
    });
    circle.bindTooltip("Prayer time: reduced traffic", { permanent: false });
    circle.addTo(this.overlayLayer);
  }

  private highlightSchoolZones(center: L.LatLng): void {
    if (!this.overlayLayer) return;
    const offsets = [0.01, -0.012, 0.014];
    offsets.forEach((offset, index) => {
      const marker = L.marker([center.lat + offset, center.lng - offset], {
        icon: L.divIcon({
          className: "school-zone-marker",
          html: `<span>School ${index + 1}</span>`,
        }),
      });
      marker.addTo(this.overlayLayer!);
    });
  }

  private addConstructionWarnings(center: L.LatLng): void {
    if (!this.overlayLayer) return;
    const marker = L.marker([center.lat - 0.015, center.lng + 0.012], {
      icon: L.divIcon({
        className: "construction-marker",
        html: "<span>Construction</span>",
      }),
    });
    marker.addTo(this.overlayLayer!);
  }

  private inflateSegments(
    segments: TrafficSegment[],
    bounds: L.LatLngBounds,
  ): TrafficSegment[] {
    if (segments.length === 0) {
      return this.generateSegments(bounds);
    }

    return segments.map((segment) => ({
      ...segment,
      path: segment.path.length > 1 ? segment.path : this.randomPath(bounds),
    }));
  }

  private generateSegments(bounds: L.LatLngBounds): TrafficSegment[] {
    const directions: TrafficSegment["flowDirection"][] = ["N", "S", "E", "W"];
    return directions.map((direction, index) => ({
      id: `auto-${index}`,
      path: this.randomPath(bounds),
      speed: 25 + index * 6,
      congestionLevel: 40 + index * 10,
      flowDirection: direction,
    }));
  }

  private randomPath(bounds: L.LatLngBounds): [number, number][] {
    const start = this.randomPoint(bounds);
    const end = this.randomPoint(bounds);
    return [start, end];
  }

  private randomPoint(bounds: L.LatLngBounds): [number, number] {
    const lat =
      bounds.getSouth() +
      Math.random() * (bounds.getNorth() - bounds.getSouth());
    const lng =
      bounds.getWest() + Math.random() * (bounds.getEast() - bounds.getWest());
    return [lat, lng];
  }

  private getSegmentMidpoint(
    path: [number, number][],
  ): [number, number] | null {
    if (path.length === 0) return null;
    const midIndex = Math.floor(path.length / 2);
    return path[midIndex];
  }

  private getZoneCenter(zone: Zone): L.LatLng {
    if (
      typeof zone.latitude === "number" &&
      typeof zone.longitude === "number"
    ) {
      return L.latLng(zone.latitude, zone.longitude);
    }

    return this.map?.getCenter() ?? L.latLng(24.4539, 54.3773);
  }

  private getBoundingBox(
    boundingBox: string | undefined,
    center: L.LatLng,
  ): L.LatLngBounds {
    if (boundingBox) {
      const parts = boundingBox.split(",").map((p) => Number(p));
      if (parts.length === 4 && parts.every((p) => !Number.isNaN(p))) {
        return L.latLngBounds([parts[1], parts[0]], [parts[3], parts[2]]);
      }
    }

    const delta = 0.05;
    return L.latLngBounds(
      [center.lat - delta, center.lng - delta],
      [center.lat + delta, center.lng + delta],
    );
  }

  private getCongestionColor(congestion: number): string {
    if (congestion < 35) return "#4CAF50";
    if (congestion < 70) return "#FFC107";
    return "#F44336";
  }

  private generateIncidents(
    center: L.LatLng,
    bounds: L.LatLngBounds,
  ): TrafficIncident[] {
    return [
      {
        id: "mock-incident-1",
        type: "Accident",
        description: "Minor collision, right lane blocked",
        severity: "Medium",
        latitude: center.lat + 0.01,
        longitude: center.lng - 0.012,
      },
      {
        id: "mock-incident-2",
        type: "Roadworks",
        description: "Road maintenance - expect delays",
        severity: "Low",
        latitude:
          bounds.getSouth() + (bounds.getNorth() - bounds.getSouth()) * 0.3,
        longitude:
          bounds.getWest() + (bounds.getEast() - bounds.getWest()) * 0.6,
      },
    ];
  }

  private isPrayerTime(time: Date): boolean {
    const hour = time.getHours();
    const day = time.getDay();

    if (day === 5) {
      return hour >= 12 && hour < 13;
    }

    return (hour >= 12 && hour < 13) || (hour >= 15 && hour < 16);
  }

  private isSchoolTime(time: Date): boolean {
    const hour = time.getHours();
    const day = time.getDay();

    if (day === 5 || day === 6) return false;
    return hour >= 7 && hour <= 9;
  }

  private isConstructionSeason(time: Date): boolean {
    return time.getMonth() >= 6 && time.getMonth() <= 9;
  }
}



