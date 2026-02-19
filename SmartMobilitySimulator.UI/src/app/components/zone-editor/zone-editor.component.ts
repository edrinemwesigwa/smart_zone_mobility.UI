import { Component, OnInit } from "@angular/core";
import { ZoneService } from "../../services/zone.service";
import { Zone, ZoneUpsertRequest } from "../../models/zone.model";

@Component({
  selector: "app-zone-editor",
  templateUrl: "./zone-editor.component.html",
  styleUrls: ["./zone-editor.component.css"],
})
export class ZoneEditorComponent implements OnInit {
  zones: Zone[] = [];
  selectedZone: Zone | null = null;
  isEditing = false;
  isCreating = false;
  formData: Partial<Zone> = {};
  isLoading = false;
  error: string | null = null;
  success: string | null = null;

  // Time range for peak hours
  peakStartTime: Date = new Date();
  peakEndTime: Date = new Date();

  zoneTypes = ["Residential", "Commercial", "Industrial", "Mixed"];
  emirates = ["Dubai", "Abu Dhabi", "Sharjah"];

  constructor(private zoneService: ZoneService) {}

  ngOnInit(): void {
    this.loadZones();
  }

  loadZones(): void {
    this.isLoading = true;
    this.zoneService.getAllZones().subscribe({
      next: (zones: Zone[]) => {
        this.zones = zones;
        this.isLoading = false;
      },
      error: (err: any) => {
        this.error = "Failed to load zones";
        this.isLoading = false;
      },
    });
  }

  startCreate(): void {
    this.isCreating = true;
    this.isEditing = false;
    this.selectedZone = null;
    this.formData = {
      baseFreeHours: 2,
      chargePerHour: 20,
      peakHours: "",
    };
  }

  editZone(zone: Zone): void {
    this.selectedZone = zone;
    this.isEditing = true;
    this.isCreating = false;
    this.formData = { ...zone };
  }

  saveZone(): void {
    if (
      !this.formData.name ||
      !this.formData.emirate ||
      !this.formData.zoneType
    ) {
      this.error = "Please fill in all required fields";
      return;
    }

    const payload: ZoneUpsertRequest = {
      name: this.formData.name?.trim() ?? "",
      emirate: this.formData.emirate as ZoneUpsertRequest["emirate"],
      zoneType: this.formData.zoneType as ZoneUpsertRequest["zoneType"],
      baseFreeHours: this.formData.baseFreeHours ?? 2,
      peakHours:
        this.formData.peakHours && this.formData.peakHours.trim().length > 0
          ? this.formData.peakHours.trim()
          : "[]",
      chargePerHour: this.formData.chargePerHour ?? 20,
    };

    this.isLoading = true;
    if (this.isCreating) {
      this.zoneService.createZone(payload).subscribe({
        next: (newZone: Zone) => {
          this.zones.push(newZone);
          this.success = "Zone created successfully";
          this.resetForm();
          this.isLoading = false;
        },
        error: (err: any) => {
          this.error = "Failed to create zone";
          this.isLoading = false;
        },
      });
    } else if (this.selectedZone) {
      this.zoneService.updateZone(this.selectedZone.id, payload).subscribe({
        next: (updatedZone: Zone) => {
          const index = this.zones.findIndex((z) => z.id === updatedZone.id);
          if (index > -1) {
            this.zones[index] = updatedZone;
          }
          this.success = "Zone updated successfully";
          this.resetForm();
          this.isLoading = false;
        },
        error: (err: any) => {
          this.error = "Failed to update zone";
          this.isLoading = false;
        },
      });
    }
  }

  deleteZone(zoneId: string): void {
    if (!confirm("Are you sure you want to delete this zone?")) return;

    this.isLoading = true;
    this.zoneService.deleteZone(zoneId).subscribe({
      next: () => {
        this.zones = this.zones.filter((z) => z.id !== zoneId);
        this.success = "Zone deleted successfully";
        this.resetForm();
        this.isLoading = false;
      },
      error: (err: any) => {
        this.error = "Failed to delete zone";
        this.isLoading = false;
      },
    });
  }

  get groupedZones(): { emirate: string; zones: Zone[] }[] {
    const groups = new Map<string, Zone[]>();
    for (const zone of this.zones) {
      const key = zone.emirate || "Unknown";
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key)?.push(zone);
    }

    const orderedEmirates = this.emirates.filter((e) => groups.has(e));
    const otherEmirates = Array.from(groups.keys())
      .filter((e) => !orderedEmirates.includes(e))
      .sort((a, b) => a.localeCompare(b));

    const emirateOrder = [...orderedEmirates, ...otherEmirates];
    return emirateOrder.map((emirate) => ({
      emirate,
      zones: (groups.get(emirate) ?? []).sort((a, b) =>
        a.name.localeCompare(b.name),
      ),
    }));
  }

  resetForm(): void {
    this.isEditing = false;
    this.isCreating = false;
    this.selectedZone = null;
    this.formData = {};
    this.error = null;
    setTimeout(() => (this.success = null), 3000);
  }

  cancel(): void {
    this.resetForm();
  }

  setPeakHours(type: "morning" | "evening" | "both"): void {
    switch (type) {
      case "morning":
        this.formData.peakHours = "07:00-09:00";
        break;
      case "evening":
        this.formData.peakHours = "16:00-19:00";
        break;
      case "both":
        this.formData.peakHours = "07:00-09:00, 16:00-19:00";
        break;
    }
  }
}



