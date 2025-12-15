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
    latitude: number;
    longitude: number;
    altitude: number;
    prefecture_subprefecture: string;
    long_name: string;
    address: string;
  }
>;
