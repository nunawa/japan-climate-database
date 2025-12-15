import _monthlyYearlyNormal from "../../../data/processed/monthly_yearly_normal.json";
import _monthlyYearlyWbgt from "../../../data/processed/monthly_yearly_wbgt.json";
import _stationIndex from "../../../data/processed/station_index.json";
import type {
  MonthlyYearlyNormal,
  MonthlyYearlyWbgt,
  StationIndex,
} from "./types";

const monthlyYearlyNormal =
  _monthlyYearlyNormal as unknown as MonthlyYearlyNormal;
const monthlyYearlyWbgt = _monthlyYearlyWbgt as unknown as MonthlyYearlyWbgt;
const stationIndex = _stationIndex as unknown as StationIndex;

// 都道府県から地域へのマッピング
const REGION_MAP: Record<string, string> = {
  宗谷: "北海道",
  上川: "北海道",
  留萌: "北海道",
  石狩: "北海道",
  空知: "北海道",
  後志: "北海道",
  ｵﾎｰﾂｸ: "北海道",
  根室: "北海道",
  釧路: "北海道",
  十勝: "北海道",
  胆振: "北海道",
  日高: "北海道",
  渡島: "北海道",
  檜山: "北海道",
  青森: "東北",
  岩手: "東北",
  宮城: "東北",
  秋田: "東北",
  山形: "東北",
  福島: "東北",
  茨城: "関東",
  栃木: "関東",
  群馬: "関東",
  埼玉: "関東",
  千葉: "関東",
  東京: "関東",
  神奈川: "関東",
  新潟: "中部",
  富山: "中部",
  石川: "中部",
  福井: "中部",
  山梨: "中部",
  長野: "中部",
  岐阜: "中部",
  静岡: "中部",
  愛知: "中部",
  三重: "近畿",
  滋賀: "近畿",
  京都: "近畿",
  大阪: "近畿",
  兵庫: "近畿",
  奈良: "近畿",
  和歌山: "近畿",
  鳥取: "中国",
  島根: "中国",
  岡山: "中国",
  広島: "中国",
  山口: "中国",
  徳島: "四国",
  香川: "四国",
  愛媛: "四国",
  高知: "四国",
  福岡: "九州",
  佐賀: "九州",
  長崎: "九州",
  熊本: "九州",
  大分: "九州",
  宮崎: "九州",
  鹿児島: "九州",
  沖縄: "九州",
};

function calculateAverage(values: number[]): number {
  if (values.length === 0) return 0;
  const sum = values.reduce((acc, val) => acc + val, 0);
  return sum / values.length;
}

export type Data = Awaited<ReturnType<typeof data>>;

export async function data() {
  const normalStationList = Object.keys(monthlyYearlyNormal);
  const wbgtStationList = Object.keys(monthlyYearlyWbgt);

  const stationList = Array.from(
    new Set([...normalStationList, ...wbgtStationList]),
  ).sort();

  // 全観測所のデータを構築
  const stations = stationList.map((stationNumber) => {
    const station = stationIndex[stationNumber];
    const prefecture = station.prefecture_subprefecture || "不明";
    const region = REGION_MAP[prefecture] || "その他";

    return {
      station_number: stationNumber,
      station_name: station.station_name,
      prefecture,
      region,
      yearly: {
        temperature:
          monthlyYearlyNormal[stationNumber]?.yearly.temperature ?? null,
        precipitation:
          monthlyYearlyNormal[stationNumber]?.yearly.precipitation ?? null,
        sunshine_duration:
          monthlyYearlyNormal[stationNumber]?.yearly.sunshine_duration ?? null,
        wbgt: monthlyYearlyWbgt[stationNumber]?.yearly ?? null,
      },
    };
  });

  // 各指標の有効な値を持つ観測所のみで平均と極値を計算
  const validTemp = stations.filter((s) => s.yearly.temperature !== null);
  const validPrec = stations.filter((s) => s.yearly.precipitation !== null);
  const validSun = stations.filter((s) => s.yearly.sunshine_duration !== null);
  const validWbgt = stations.filter((s) => s.yearly.wbgt !== null);

  // 全国平均
  const averages = {
    temperature: calculateAverage(
      validTemp.map((s) => s.yearly.temperature as number),
    ),
    precipitation: calculateAverage(
      validPrec.map((s) => s.yearly.precipitation as number),
    ),
    sunshine_duration: calculateAverage(
      validSun.map((s) => s.yearly.sunshine_duration as number),
    ),
    wbgt: calculateAverage(validWbgt.map((s) => s.yearly.wbgt as number)),
  };

  // 最後に各指標のランキングデータとしてまとめる
  const temperatureStations = validTemp
    .map((s) => ({
      station_number: s.station_number,
      station_name: s.station_name,
      prefecture: s.prefecture,
      region: s.region,
      value: s.yearly.temperature as number,
      difference: (s.yearly.temperature as number) - averages.temperature,
    }))
    .sort((a, b) => b.value - a.value);

  const precipitationStations = validPrec
    .map((s) => ({
      station_number: s.station_number,
      station_name: s.station_name,
      prefecture: s.prefecture,
      region: s.region,
      value: s.yearly.precipitation as number,
      difference: (s.yearly.precipitation as number) - averages.precipitation,
    }))
    .sort((a, b) => b.value - a.value);

  const sunshineDurationStations = validSun
    .map((s) => ({
      station_number: s.station_number,
      station_name: s.station_name,
      prefecture: s.prefecture,
      region: s.region,
      value: s.yearly.sunshine_duration as number,
      difference:
        (s.yearly.sunshine_duration as number) - averages.sunshine_duration,
    }))
    .sort((a, b) => b.value - a.value);

  const wbgtStations = validWbgt
    .map((s) => ({
      station_number: s.station_number,
      station_name: s.station_name,
      prefecture: s.prefecture,
      region: s.region,
      value: s.yearly.wbgt as number,
      difference: (s.yearly.wbgt as number) - averages.wbgt,
    }))
    .sort((a, b) => b.value - a.value);

  // テーブルのフィルタ機能の選択候補で使う都道府県と地域のリスト
  const prefectures = [...Object.keys(REGION_MAP), "不明"];
  const regions = [...new Set(Object.values(REGION_MAP)), "その他"];

  return {
    temperatureStations,
    precipitationStations,
    sunshineDurationStations,
    wbgtStations,
    prefectures,
    regions,
  };
}
