import json
from pathlib import Path

import duckdb
from duckdb import (
    CaseExpression,
    ColumnExpression,
    ConstantExpression,
    DuckDBPyRelation,
    SQLExpression,
)

data_dir = Path(__file__).parents[1].joinpath("data")
processed_dir = data_dir.joinpath("processed")
moe_wbgt_dir = data_dir.joinpath("raw", "moe-wbgt")
jma_normal_dir = data_dir.joinpath("raw", "jma-normal")
jma_station_dir = data_dir.joinpath("raw", "jma-station")


def build_case_expression(prefix, index=None, alias=None, scale=10):
    column_name_base = f"{prefix}{index}" if index is not None else prefix
    return (
        CaseExpression(
            condition=ColumnExpression(f"{column_name_base}_remark")
            == ConstantExpression(0),
            value=ConstantExpression(None),
        )
        .otherwise(ColumnExpression(f"{column_name_base}_value") / scale)
        .alias(alias or column_name_base)
    )


def query_daily(relation: DuckDBPyRelation, element_number):
    case_list = [build_case_expression("day", i) for i in range(1, 32)]

    return relation.select(
        "element_number",
        "month",
        *case_list,
    ).filter(f"element_number == {element_number}")


def query_monthly_yearly(relation: DuckDBPyRelation, element_number):
    case_list = [build_case_expression("month", i) for i in range(1, 13)]
    case_list.append(build_case_expression("year"))

    return relation.select(
        "element_number",
        *case_list,
    ).filter(f"element_number == {element_number}")


def convert_all_none_to_none(x: tuple | list):
    if set(x) == {None}:
        return None
    else:
        return x


def create_daily_normal_object():
    csv_files = jma_normal_dir.joinpath("daily").glob("nml_amd_d_*.csv")

    column_names = [
        "period_type",
        "station_number",
        "element_number",
        "data_years",
        "start_year",
        "end_year",
        "month",
    ]

    for day in range(1, 32):
        column_names.append(f"day{day}_value")
        column_names.append(f"day{day}_remark")

    normal_data = {}

    for csv in csv_files:
        daily = duckdb.read_csv(csv, names=column_names).set_alias("daily")

        temperature = {}
        result = query_daily(daily, "0500").fetchall()
        for month in result:
            temperature[month[1]] = convert_all_none_to_none(month[2:])
        if set(temperature.values()) == {None}:
            temperature = None

        precipitation = {}
        result = query_daily(daily, "4000").fetchall()
        for month in result:
            precipitation[month[1]] = convert_all_none_to_none(month[2:])
        if set(precipitation.values()) == {None}:
            precipitation = None

        sunshine_duration = {}
        result = query_daily(daily, "3500").fetchall()
        for month in result:
            sunshine_duration[month[1]] = convert_all_none_to_none(month[2:])
        if set(sunshine_duration.values()) == {None}:
            sunshine_duration = None

        station_number = csv.stem.split("_")[-1]
        normal_data[station_number] = {
            "temperature": temperature,
            "precipitation": precipitation,
            "sunshine_duration": sunshine_duration,
        }
        print(f"Loaded station {station_number}")

    return normal_data


def create_monthly_yearly_normal_object():
    csv_files = jma_normal_dir.joinpath("monthly").glob("nml_amd_m_*.csv")

    column_names = [
        "period_type",
        "station_number",
        "element_number",
        "data_years",
        "start_year",
        "end_year",
    ]

    for month in range(1, 13):
        column_names.append(f"month{month}_value")
        column_names.append(f"month{month}_remark")

    column_names.append("year_value")
    column_names.append("year_remark")

    normal_data = {}

    for csv in csv_files:
        monthly = duckdb.read_csv(csv, names=column_names).set_alias("monthly")

        raw_temperature = query_monthly_yearly(monthly, "0500").fetchall()
        raw_precipitation = query_monthly_yearly(monthly, "4000").fetchall()
        raw_sunshine_duration = query_monthly_yearly(monthly, "3500").fetchall()

        station_number = csv.stem.split("_")[-1]
        normal_data[station_number] = {
            "monthly": {
                "temperature": convert_all_none_to_none(raw_temperature[0][1:-1]),
                "precipitation": convert_all_none_to_none(raw_precipitation[0][1:-1]),
                "sunshine_duration": convert_all_none_to_none(
                    raw_sunshine_duration[0][1:-1]
                ),
            },
            "yearly": {
                "temperature": raw_temperature[0][-1],
                "precipitation": raw_precipitation[0][-1],
                "sunshine_duration": raw_sunshine_duration[0][-1],
            },
        }
        print(f"Loaded station {station_number}")

    return normal_data


def create_daily_wbgt_object():
    dirs = [x for x in moe_wbgt_dir.glob("*") if x.is_dir()]

    wbgt_data = {}
    for dir in dirs:
        # 5年 * 7ヶ月 = 35ファイルあるはず
        if len(list(dir.glob("final_wbgt_*.csv"))) != 35:
            continue

        hourly = duckdb.read_csv(dir.joinpath("final_wbgt_*.csv")).set_alias("hourly")

        min_max_by_date = (
            hourly.select(
                "Date",
                "WBGT",
            )
            .aggregate(
                aggr_expr=[
                    "Date",
                    SQLExpression("min(WBGT)").alias("min_wbgt"),
                    SQLExpression("max(WBGT)").alias("max_wbgt"),
                ],
                group_expr="Date",
            )
            .order("Date")
            .set_alias("min_max_by_date")
        )

        daily = (
            hourly.join(min_max_by_date, condition="Date")
            .select(
                SQLExpression("month(Date)").alias("month"),
                SQLExpression("day(Date)").alias("day"),
                "WBGT",
                "min_wbgt",
                "max_wbgt",
            )
            .aggregate(
                aggr_expr=[
                    "month",
                    "day",
                    SQLExpression("round_even(avg(min_wbgt), 1)").alias("min_wbgt"),
                    SQLExpression("round_even(avg(max_wbgt), 1)").alias("max_wbgt"),
                    SQLExpression("round_even(avg(WBGT), 1)").alias("avg_wbgt"),
                ],
                group_expr="month, day",
            )
            .order("month, day")
            .fetchall()
        )

        station_number = dir.stem
        wbgt_data[station_number] = {
            f"{d[0]}/{d[1]}": {
                "min": d[2],
                "max": d[3],
                "avg": d[4],
            }
            for d in daily
        }
        print(f"Loaded station {station_number}")

    return wbgt_data


def create_monthly_yearly_wbgt_object():
    dirs = [x for x in moe_wbgt_dir.glob("*") if x.is_dir()]

    wbgt_data = {}
    for dir in dirs:
        # 5年 * 7ヶ月 = 35ファイルあるはず
        if len(list(dir.glob("final_wbgt_*.csv"))) != 35:
            continue

        hourly = duckdb.read_csv(dir.joinpath("final_wbgt_*.csv")).set_alias("hourly")

        yearly = (
            hourly.select("WBGT")
            .aggregate([SQLExpression("round_even(avg(WBGT), 1)").alias("avg_wbgt")])
            .fetchone()
        )

        monthly = (
            hourly.select(
                SQLExpression("month(Date)").alias("month"),
                "WBGT",
            )
            .aggregate(
                aggr_expr=[
                    "month",
                    SQLExpression("round_even(avg(WBGT), 1)").alias("avg_wbgt"),
                ],
                group_expr="month",
            )
            .order("month")
            .fetchall()
        )

        station_number = dir.stem
        wbgt_data[station_number] = {
            "yearly": yearly[0],
            "monthly": {m[0]: m[1] for m in monthly},
        }
        print(f"Loaded station {station_number}")

    return wbgt_data


# amdmaster.index4.csvの2行目が列の単位を示す行になっており、
# DuckDBで読み込むときに邪魔になるので削除する。
def ensure_cleaned_amdmaster_index():
    src = jma_station_dir.joinpath("amdmaster.index4.csv")
    dst = jma_station_dir.joinpath("amdmaster.index4.cleaned.csv")

    if dst.exists():
        return dst

    with open(src, encoding="utf-8") as old, open(dst, "w", encoding="utf-8") as new:
        for i, line in enumerate(old):
            if i == 1:
                continue
            new.write(line)

    return dst


def create_station_index_object():
    amdmaster_index = ensure_cleaned_amdmaster_index()
    amdmaster_index = duckdb.read_csv(amdmaster_index, normalize_names=True).set_alias(
        "amdmaster_index"
    )

    station_list = (
        amdmaster_index.select(
            "station_number",
            SQLExpression("trim(station_name)").alias("station_name"),
            SQLExpression("trim(Latitude_Precipitation)").alias(
                "Latitude_Precipitation"
            ),
            SQLExpression("trim(Longitude_Precipitation)").alias(
                "Longitude_Precipitation"
            ),
            SQLExpression("trim(Latitude_Snow)").alias("Latitude_Snow"),
            SQLExpression("trim(Longitude_Snow)").alias("Longitude_Snow"),
            "end_date",
        )
        .select(
            "station_number",
            "station_name",
            CaseExpression(
                condition=(
                    SQLExpression("Latitude_Precipitation") == ConstantExpression("")
                ),
                value=ColumnExpression("Latitude_Snow"),
            )
            .otherwise(ColumnExpression("Latitude_Precipitation"))
            .alias("latitude"),
            CaseExpression(
                condition=(
                    SQLExpression("Longitude_Precipitation") == ConstantExpression("")
                ),
                value=ColumnExpression("Longitude_Snow"),
            )
            .otherwise(ColumnExpression("Longitude_Precipitation"))
            .alias("longitude"),
            "end_date",
        )
        .aggregate(
            aggr_expr=[
                "station_number",
                SQLExpression("max_by(station_name, end_date)").alias("station_name"),
                SQLExpression("cast(max_by(latitude, end_date) as float)").alias(
                    "latitude"
                ),
                SQLExpression("cast(max_by(longitude, end_date) as float)").alias(
                    "longitude"
                ),
                SQLExpression("max(end_date)").alias("end_date"),
            ],
            group_expr="station_number",
        )
        .order("station_number")
        .fetchall()
    )

    station_index = {}
    for station in station_list:
        station_index[station[0]] = {
            "station_name": str(station[1]).strip(),
            "latitude": station[2],
            "longitude": station[3],
        }

    return station_index


def main():
    with open(processed_dir.joinpath("daily_normal.json"), "w") as f:
        json.dump(create_daily_normal_object(), f, indent=2)

    with open(processed_dir.joinpath("monthly_yearly_normal.json"), "w") as f:
        json.dump(create_monthly_yearly_normal_object(), f, indent=2)

    with open(processed_dir.joinpath("daily_wbgt.json"), "w") as f:
        json.dump(create_daily_wbgt_object(), f, indent=2)

    with open(processed_dir.joinpath("monthly_yearly_wbgt.json"), "w") as f:
        json.dump(create_monthly_yearly_wbgt_object(), f, indent=2)

    with open(processed_dir.joinpath("station_index.json"), "w") as f:
        json.dump(create_station_index_object(), f, indent=2, ensure_ascii=False)


if __name__ == "__main__":
    main()
