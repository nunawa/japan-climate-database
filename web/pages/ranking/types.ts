export type MonthlyYearlyNormal = Record<
  string,
  {
    yearly: {
      temperature: number | null;
      precipitation: number | null;
      sunshine_duration: number | null;
    };
    monthly: {
      temperature: number[] | null;
      precipitation: number[] | null;
      sunshine_duration: number[] | null;
    };
  }
>;

export type MonthlyYearlyWbgt = Record<
  string,
  { yearly: number; monthly: Record<string, number> }
>;

export type StationIndex = Record<
  string,
  {
    station_name: string;
  }
>;

export type PageContext = {
  data: {
    station_number: number;
    station_name: StationIndex[string]["station_name"];
    yearly_temperature: MonthlyYearlyNormal[string]["yearly"]["temperature"];
    yearly_precipitation: MonthlyYearlyNormal[string]["yearly"]["precipitation"];
    yearly_wbgt: MonthlyYearlyWbgt[string]["yearly"] | null;
  }[];
};
