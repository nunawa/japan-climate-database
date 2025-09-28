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

export type Normal = {
  yearly: {
    temperature: MonthlyYearlyNormal[string]["yearly"]["temperature"];
    precipitation: MonthlyYearlyNormal[string]["yearly"]["precipitation"];
  };
};

export type Wbgt = {
  yearly: MonthlyYearlyWbgt[string]["yearly"] | null;
};

export type StationIndex = Record<
  string,
  {
    station_name: string;
    latitude: number;
    longitude: number;
  }
>;

export type PageContext = {
  data: {
    station_number: string;
    station_name: StationIndex[string]["station_name"];
    coordinates: {
      latitude: StationIndex[string]["latitude"];
      longitude: StationIndex[string]["longitude"];
    };
    normal: Normal;
    wbgt: Wbgt;
  }[];
};
