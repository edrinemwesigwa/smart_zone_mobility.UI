import { Injectable } from "@angular/core";

export interface ExportColumn {
  key: string;
  label: string;
}

@Injectable({
  providedIn: "root",
})
export class ExportService {
  /**
   * Export data to CSV format
   */
  exportToCsv(data: any[], columns: ExportColumn[], filename: string): void {
    if (!data || data.length === 0) {
      console.warn("No data to export");
      return;
    }

    // Get headers
    const headers = columns.map((col) => col.label);

    // Get rows
    const rows = data.map((item) =>
      columns.map((col) =>
        this.escapeCsvValue(this.getNestedValue(item, col.key)),
      ),
    );

    // Combine headers and rows
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    // Download file
    this.downloadFile(csvContent, `${filename}.csv`, "text/csv;charset=utf-8;");
  }

  /**
   * Export data to Excel format (XLSX)
   * Uses a simple HTML table approach for compatibility
   */
  exportToExcel(data: any[], columns: ExportColumn[], filename: string): void {
    if (!data || data.length === 0) {
      console.warn("No data to export");
      return;
    }

    // Create HTML table
    let tableHtml =
      '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel"><head><meta charset="UTF-8"></head><body>';
    tableHtml += '<table border="1">';

    // Header row
    tableHtml += "<tr>";
    columns.forEach((col) => {
      tableHtml += `<th style="background-color: #1f2937; color: white; font-weight: bold;">${this.escapeHtml(col.label)}</th>`;
    });
    tableHtml += "</tr>";

    // Data rows
    data.forEach((item) => {
      tableHtml += "<tr>";
      columns.forEach((col) => {
        const value = this.getNestedValue(item, col.key);
        tableHtml += `<td>${this.escapeHtml(value)}</td>`;
      });
      tableHtml += "</tr>";
    });

    tableHtml += "</table></body></html>";

    // Download file
    const blob = new Blob([tableHtml], {
      type: "application/vnd.ms-excel;charset=utf-8;",
    });
    this.downloadBlob(blob, `${filename}.xls`);
  }

  /**
   * Export data to JSON format
   */
  exportToJson(data: any[], filename: string): void {
    const jsonContent = JSON.stringify(data, null, 2);
    this.downloadFile(jsonContent, `${filename}.json`, "application/json");
  }

  /**
   * Export simulation results to CSV
   */
  exportSimulationResults(results: any): void {
    const data = [
      {
        "Total Vehicles": results.totalVehicles || 0,
        "Vehicles Diverted": results.vehiclesDiverted || 0,
        "Congestion Reduction": `${results.congestionReduction || 0}%`,
        "Estimated Revenue": `AED ${results.estimatedRevenue || 0}`,
        "Equity Impact": results.equityImpact || "N/A",
        "Environmental Impact": `${results.environmentalImpact || 0}%`,
      },
    ];

    const columns: ExportColumn[] = [
      { key: "Total Vehicles", label: "Total Vehicles" },
      { key: "Vehicles Diverted", label: "Vehicles Diverted" },
      { key: "Congestion Reduction", label: "Congestion Reduction" },
      { key: "Estimated Revenue", label: "Estimated Revenue (AED)" },
      { key: "Equity Impact", label: "Equity Impact" },
      { key: "Environmental Impact", label: "Environmental Impact" },
    ];

    this.exportToCsv(data, columns, "simulation-results");
  }

  /**
   * Export zone data to CSV
   */
  exportZones(zones: any[]): void {
    const columns: ExportColumn[] = [
      { key: "name", label: "Zone Name" },
      { key: "emirate", label: "Emirate" },
      { key: "zoneType", label: "Zone Type" },
      { key: "chargePerHour", label: "Charge per Hour (AED)" },
      { key: "peakHourStart", label: "Peak Hour Start" },
      { key: "peakHourEnd", label: "Peak Hour End" },
    ];

    this.exportToCsv(zones, columns, "traffic-zones");
  }

  /**
   * Export user data to CSV (admin function)
   */
  exportUsers(users: any[]): void {
    const columns: ExportColumn[] = [
      { key: "email", label: "Email" },
      { key: "firstName", label: "First Name" },
      { key: "lastName", label: "Last Name" },
      { key: "role", label: "Role" },
      { key: "isActive", label: "Status" },
      { key: "createdAt", label: "Created At" },
      { key: "lastLoginAt", label: "Last Login" },
    ];

    const data = users.map((u) => ({
      ...u,
      isActive: u.isActive ? "Active" : "Inactive",
      createdAt: u.createdAt
        ? new Date(u.createdAt).toLocaleDateString()
        : "N/A",
      lastLoginAt: u.lastLoginAt
        ? new Date(u.lastLoginAt).toLocaleDateString()
        : "Never",
    }));

    this.exportToCsv(data, columns, "users");
  }

  /**
   * Export audit logs to CSV
   */
  exportAuditLogs(logs: any[]): void {
    const columns: ExportColumn[] = [
      { key: "timestamp", label: "Timestamp" },
      { key: "userEmail", label: "User Email" },
      { key: "action", label: "Action" },
      { key: "entityType", label: "Entity Type" },
      { key: "entityId", label: "Entity ID" },
      { key: "details", label: "Details" },
      { key: "ipAddress", label: "IP Address" },
    ];

    const data = logs.map((l) => ({
      ...l,
      timestamp: l.timestamp ? new Date(l.timestamp).toLocaleString() : "N/A",
    }));

    this.exportToCsv(data, columns, "audit-logs");
  }

  // Helper methods
  private getNestedValue(obj: any, path: string): string {
    return path.split(".").reduce((acc, part) => acc && acc[part], obj) ?? "";
  }

  private escapeCsvValue(value: any): string {
    if (value === null || value === undefined) {
      return "";
    }
    const str = String(value);
    // If contains comma, newline, or quotes, wrap in quotes and escape existing quotes
    if (str.includes(",") || str.includes("\n") || str.includes('"')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  }

  private escapeHtml(text: any): string {
    if (text === null || text === undefined) {
      return "";
    }
    return String(text)
      .replace(/&/g, "&")
      .replace(/</g, "<")
      .replace(/>/g, ">")
      .replace(/"/g, '"')
      .replace(/'/g, "&#039;");
  }

  private downloadFile(
    content: string,
    filename: string,
    mimeType: string,
  ): void {
    const blob = new Blob([content], { type: mimeType });
    this.downloadBlob(blob, filename);
  }

  private downloadBlob(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}
