export interface ZoneRulesDto {
  freeHours: number;
  chargePerHour: number;
  exemptions: string[];
}

export interface DemoScenarioDto {
  name: string;
  zoneId: string;
  rules: ZoneRulesDto;
  expectedResults: string;
  demoScript: string;
}



