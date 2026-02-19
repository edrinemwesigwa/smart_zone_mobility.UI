import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "./components/home/home.component";
import { PilotProposalComponent } from "./components/pilot-proposal/pilot-proposal.component";
import { BusinessCaseComponent } from "./components/business-case/business-case.component";
import { PitchDeckComponent } from "./components/pitch-deck/pitch-deck.component";
import { UaeFactsDashboardComponent } from "./components/uae-facts-dashboard/uae-facts-dashboard.component";
import { AuthoritySelectionComponent } from "./authority-selection/authority-selection.component";
import { AuthorityReportComponent } from "./authority-report/authority-report.component";
import { AuthorityComparisonComponent } from "./authority-comparison/authority-comparison.component";
import { ZoneEditorComponent } from "./components/zone-editor/zone-editor.component";
import { BusinessAdminGuideComponent } from "./components/business-admin-guide/business-admin-guide.component";
import { TechnicalArchitectureGuideComponent } from "./components/technical-architecture-guide/technical-architecture-guide.component";
import { WorkflowWizardComponent } from "./components/workflow-wizard/workflow-wizard.component";
import { ScenarioComparisonComponent } from "./components/scenario-comparison/scenario-comparison.component";
import { RoiCalculatorComponent } from "./components/roi-calculator/roi-calculator.component";
import { MobilePreviewComponent } from "./components/mobile-preview/mobile-preview.component";
import { AuditTrailComponent } from "./components/audit-trail/audit-trail.component";
import { LoginComponent } from "./components/login/login.component";
import { UserManagementComponent } from "./components/user-management/user-management.component";
import { AuthGuard } from "./guards/auth.guard";

const routes: Routes = [
  { path: "", component: HomeComponent, canActivate: [AuthGuard] },
  { path: "login", component: LoginComponent },
  {
    path: "uae-facts",
    component: UaeFactsDashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "authority-selection",
    component: AuthoritySelectionComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "authority-report",
    component: AuthorityReportComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "authority-comparison",
    component: AuthorityComparisonComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "zone-editor",
    component: ZoneEditorComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "pilot-proposal",
    component: PilotProposalComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "business-case",
    component: BusinessCaseComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "pitch-deck",
    component: PitchDeckComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "business-admin-guide",
    component: BusinessAdminGuideComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "technical-architecture-guide",
    component: TechnicalArchitectureGuideComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "wizard",
    component: WorkflowWizardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "comparison",
    component: ScenarioComparisonComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "roi-calculator",
    component: RoiCalculatorComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "mobile-preview",
    component: MobilePreviewComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "audit-trail",
    component: AuditTrailComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "user-management",
    component: UserManagementComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
