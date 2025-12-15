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

type RegionStations = {
  id: string;
  name: string;
  prefecture: string;
}[];

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
      北海道: RegionStations;
      東北: RegionStations;
      関東: RegionStations;
      中部: RegionStations;
      近畿: RegionStations;
      中国: RegionStations;
      四国: RegionStations;
      九州: RegionStations;
    };
  };
};
