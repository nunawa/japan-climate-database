export type MonthlyYearlyNormal = Record<
  string,
  {
    yearly: {
      temperature: number | null;
      precipitation: number | null;
      sunshine_duration: number | null;
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

export type Station = {
  id: string;
  name: string;
  value: number;
};

export type PageContext = {
  data: {
    averages: {
      temperature: number;
      precipitation: number;
      sunshine_duration: number;
      wbgt: number;
    };
    max_station: {
      temperature: Station;
      precipitation: Station;
      sunshine_duration: Station;
      wbgt: Station;
    };
    min_station: {
      temperature: Station;
      precipitation: Station;
      sunshine_duration: Station;
      wbgt: Station;
    };
    prefectural_capital_stations: {
      prefecture: string;
      name: string;
      id: string;
    }[];
  };
};
