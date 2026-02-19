import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";

import { ZoneMapComponent } from "./components/zone-map/zone-map.component";
import { ZoneEditorComponent } from "./components/zone-editor/zone-editor.component";
import { SimulationControlsComponent } from "./components/simulation-controls/simulation-controls.component";
import { ResultsDashboardComponent } from "./components/results-dashboard/results-dashboard.component";
import { CitizenImpactComponent } from "./components/citizen-impact/citizen-impact.component";
import { PilotProposalComponent } from "./components/pilot-proposal/pilot-proposal.component";
import { HomeComponent } from "./components/home/home.component";
import { BusinessCaseComponent } from "./components/business-case/business-case.component";
import { PitchDeckComponent } from "./components/pitch-deck/pitch-deck.component";
import { DemoModeComponent } from "./components/demo-mode/demo-mode.component";
import { UaeFactsDashboardComponent } from "./components/uae-facts-dashboard/uae-facts-dashboard.component";
import { AuthoritySelectionComponent } from "./authority-selection/authority-selection.component";
import { AuthorityReportComponent } from "./authority-report/authority-report.component";
import { AuthorityComparisonComponent } from "./authority-comparison/authority-comparison.component";
import { FooterComponent } from "./components/footer/footer.component";
import { BusinessAdminGuideComponent } from "./components/business-admin-guide/business-admin-guide.component";
import { TechnicalArchitectureGuideComponent } from "./components/technical-architecture-guide/technical-architecture-guide.component";
import { ToastComponent } from "./components/toast/toast.component";
import { LoadingSpinnerComponent } from "./components/loading-spinner/loading-spinner.component";
import { DateTimePickerComponent } from "./components/date-time-picker/date-time-picker.component";
import { WorkflowWizardComponent } from "./components/workflow-wizard/workflow-wizard.component";
import { ScenarioComparisonComponent } from "./components/scenario-comparison/scenario-comparison.component";
import { RoiCalculatorComponent } from "./components/roi-calculator/roi-calculator.component";
import { MobilePreviewComponent } from "./components/mobile-preview/mobile-preview.component";
import { AuditTrailComponent } from "./components/audit-trail/audit-trail.component";
import { HttpErrorInterceptor } from "./services/http-error.interceptor";
import { JwtInterceptor } from "./services/jwt.interceptor";
import { LoginComponent } from "./components/login/login.component";
import { LanguageSwitcherComponent } from "./components/language-switcher/language-switcher.component";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ZoneMapComponent,
    ZoneEditorComponent,
    SimulationControlsComponent,
    ResultsDashboardComponent,
    CitizenImpactComponent,
    PilotProposalComponent,
    BusinessCaseComponent,
    PitchDeckComponent,
    DemoModeComponent,
    UaeFactsDashboardComponent,
    AuthoritySelectionComponent,
    AuthorityReportComponent,
    AuthorityComparisonComponent,
    FooterComponent,
    BusinessAdminGuideComponent,
    TechnicalArchitectureGuideComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ToastComponent,
    LoadingSpinnerComponent,
    DateTimePickerComponent,
    WorkflowWizardComponent,
    ScenarioComparisonComponent,
    RoiCalculatorComponent,
    MobilePreviewComponent,
    AuditTrailComponent,
    LanguageSwitcherComponent,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
