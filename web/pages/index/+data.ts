import _monthlyYearlyNormal from "../../../data/processed/monthly_yearly_normal.json";
import _monthlyYearlyWbgt from "../../../data/processed/monthly_yearly_wbgt.json";
import _stationIndex from "../../../data/processed/station_index.json";
import type {
  MonthlyYearlyNormal,
  MonthlyYearlyWbgt,
  PageContext,
  StationIndex,
  Station,
} from "./types";

const monthlyYearlyNormal =
  _monthlyYearlyNormal as unknown as MonthlyYearlyNormal;
const monthlyYearlyWbgt = _monthlyYearlyWbgt as unknown as MonthlyYearlyWbgt;
const stationIndex = _stationIndex as unknown as StationIndex;

// 47都道府県庁所在地の観測所ID
const PREFECTURE_STATIONS = [
  { prefecture: "北海道", name: "札幌", id: "14163" },
  { prefecture: "青森県", name: "青森", id: "31312" },
  { prefecture: "岩手県", name: "盛岡", id: "33431" },
  { prefecture: "宮城県", name: "仙台", id: "34392" },
  { prefecture: "秋田県", name: "秋田", id: "32402" },
  { prefecture: "山形県", name: "山形", id: "35426" },
  { prefecture: "福島県", name: "福島", id: "36127" },
  { prefecture: "茨城県", name: "水戸", id: "40201" },
  { prefecture: "栃木県", name: "宇都宮", id: "41277" },
  { prefecture: "群馬県", name: "前橋", id: "42251" },
  { prefecture: "埼玉県", name: "さいたま", id: "43241" },
  { prefecture: "千葉県", name: "千葉", id: "45212" },
  { prefecture: "東京都", name: "東京", id: "44132" },
  { prefecture: "神奈川県", name: "横浜", id: "46106" },
  { prefecture: "新潟県", name: "新潟", id: "54232" },
  { prefecture: "富山県", name: "富山", id: "55102" },
  { prefecture: "石川県", name: "金沢", id: "56227" },
  { prefecture: "福井県", name: "福井", id: "57066" },
  { prefecture: "山梨県", name: "甲府", id: "49142" },
  { prefecture: "長野県", name: "長野", id: "48156" },
  { prefecture: "岐阜県", name: "岐阜", id: "52586" },
  { prefecture: "静岡県", name: "静岡", id: "50331" },
  { prefecture: "愛知県", name: "名古屋", id: "51106" },
  { prefecture: "三重県", name: "津", id: "53133" },
  { prefecture: "滋賀県", name: "大津", id: "60216" },
  { prefecture: "京都府", name: "京都", id: "61286" },
  { prefecture: "大阪府", name: "大阪", id: "62078" },
  { prefecture: "兵庫県", name: "神戸", id: "63518" },
  { prefecture: "奈良県", name: "奈良", id: "64036" },
  { prefecture: "和歌山県", name: "和歌山", id: "65042" },
  { prefecture: "鳥取県", name: "鳥取", id: "69122" },
  { prefecture: "島根県", name: "松江", id: "68132" },
  { prefecture: "岡山県", name: "岡山", id: "66408" },
  { prefecture: "広島県", name: "広島", id: "67437" },
  { prefecture: "山口県", name: "山口", id: "81286" },
  { prefecture: "徳島県", name: "徳島", id: "71106" },
  { prefecture: "香川県", name: "高松", id: "72086" },
  { prefecture: "愛媛県", name: "松山", id: "73166" },
  { prefecture: "高知県", name: "高知", id: "74182" },
  { prefecture: "福岡県", name: "福岡", id: "82182" },
  { prefecture: "佐賀県", name: "佐賀", id: "74436" },
  { prefecture: "長崎県", name: "長崎", id: "84496" },
  { prefecture: "熊本県", name: "熊本", id: "86141" },
  { prefecture: "大分県", name: "大分", id: "83216" },
  { prefecture: "宮崎県", name: "宮崎", id: "87376" },
  { prefecture: "鹿児島県", name: "鹿児島", id: "88317" },
  { prefecture: "沖縄県", name: "那覇", id: "91197" },
];

function calculateAverage(values: number[]) {
  const sum = values.reduce((acc, val) => acc + val, 0);
  return sum / values.length;
}

function findMaxStation(stations: Station[]) {
  return stations.reduce((max, station) =>
    station.value > max.value ? station : max,
  );
}

function findMinStation(stations: Station[]) {
  return stations.reduce((min, station) =>
    station.value < min.value ? station : min,
  );
}

export async function data(): Promise<PageContext["data"]> {
  const stations = Object.keys(monthlyYearlyNormal);

  const temperatureStations: Station[] = [];
  const precipitationStations: Station[] = [];
  const sunshineDurationStations: Station[] = [];
  const wbgtStations: Station[] = [];

  for (const id of stations) {
    const normal = monthlyYearlyNormal[id];
    const wbgt = monthlyYearlyWbgt[id];
    const station = stationIndex[id];

    if (normal.yearly.temperature !== null) {
      temperatureStations.push({
        id,
        name: station.station_name,
        value: normal.yearly.temperature,
      });
    }

    if (normal.yearly.precipitation !== null) {
      precipitationStations.push({
        id,
        name: station.station_name,
        value: normal.yearly.precipitation,
      });
    }

    if (normal.yearly.sunshine_duration !== null) {
      sunshineDurationStations.push({
        id,
        name: station.station_name,
        value: normal.yearly.sunshine_duration,
      });
    }

    if (wbgt?.yearly !== null && wbgt?.yearly !== undefined) {
      wbgtStations.push({
        id,
        name: station.station_name,
        value: wbgt.yearly,
      });
    }
  }

  return {
    averages: {
      temperature: calculateAverage(temperatureStations.map((s) => s.value)),
      precipitation: calculateAverage(
        precipitationStations.map((s) => s.value),
      ),
      sunshine_duration: calculateAverage(
        sunshineDurationStations.map((s) => s.value),
      ),
      wbgt: calculateAverage(wbgtStations.map((s) => s.value)),
    },
    max_station: {
      temperature: findMaxStation(temperatureStations),
      precipitation: findMaxStation(precipitationStations),
      sunshine_duration: findMaxStation(sunshineDurationStations),
      wbgt: findMaxStation(wbgtStations),
    },
    min_station: {
      temperature: findMinStation(temperatureStations),
      precipitation: findMinStation(precipitationStations),
      sunshine_duration: findMinStation(sunshineDurationStations),
      wbgt: findMinStation(wbgtStations),
    },
    prefectural_capital_stations: PREFECTURE_STATIONS,
  };
}
