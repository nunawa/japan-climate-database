export type DailyNormal = Record<
  string,
  {
    temperature: Record<string, number[] | null> | null;
    precipitation: Record<string, number[] | null> | null;
    sunshine_duration: Record<string, number[] | null> | null;
  }
>;

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

export type DailyWbgt = Record<
  string,
  Record<
    string,
    {
      min: number;
      max: number;
      avg: number;
    }
  >
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
