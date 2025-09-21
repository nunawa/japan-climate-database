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
env_wbgt_dir = data_dir.joinpath("raw", "env-wbgt")
jma_normal_dir = data_dir.joinpath("raw", "jma-normal")


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


def create_daily_weather_object():
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

    weather_data = {}

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
        weather_data[station_number] = {
            "temperature": temperature,
            "precipitation": precipitation,
            "sunshine_duration": sunshine_duration,
        }
        print(f"Loaded station {station_number}")

    return weather_data


def create_monthly_yearly_weather_object():
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

    weather_data = {}

    for csv in csv_files:
        monthly = duckdb.read_csv(csv, names=column_names).set_alias("monthly")

        raw_temperature = query_monthly_yearly(monthly, "0500").fetchall()
        raw_precipitation = query_monthly_yearly(monthly, "4000").fetchall()
        raw_sunshine_duration = query_monthly_yearly(monthly, "3500").fetchall()

        station_number = csv.stem.split("_")[-1]
        weather_data[station_number] = {
            "monthly": {
                "temperature": convert_all_none_to_none(raw_temperature[0][1:-2]),
                "precipitation": convert_all_none_to_none(raw_precipitation[0][1:-2]),
                "sunshine_duration": convert_all_none_to_none(
                    raw_sunshine_duration[0][1:-2]
                ),
            },
            "yearly": {
                "temperature": raw_temperature[0][-1],
                "precipitation": raw_precipitation[0][-1],
                "sunshine_duration": raw_sunshine_duration[0][-1],
            },
        }
        print(f"Loaded station {station_number}")

    return weather_data


def create_daily_wbgt_object():
    dirs = [x for x in env_wbgt_dir.glob("*") if x.is_dir()]

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
    dirs = [x for x in env_wbgt_dir.glob("*") if x.is_dir()]

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


def main():
    with open(processed_dir.joinpath("daily_weather.json"), "w") as f:
        json.dump(create_daily_weather_object(), f, indent=2)

    with open(processed_dir.joinpath("monthly_yearly_weather.json"), "w") as f:
        json.dump(create_monthly_yearly_weather_object(), f, indent=2)

    with open(processed_dir.joinpath("daily_wbgt.json"), "w") as f:
        json.dump(create_daily_wbgt_object(), f, indent=2)

    with open(processed_dir.joinpath("monthly_yearly_wbgt.json"), "w") as f:
        json.dump(create_monthly_yearly_wbgt_object(), f, indent=2)


if __name__ == "__main__":
    main()
