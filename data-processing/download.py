import itertools
import json
import os
import re
import shutil
import time
import zipfile
from pathlib import Path

import requests
from requests.adapters import HTTPAdapter, Retry

raw_dir = Path(__file__).parents[1].joinpath("data", "raw")
moe_wbgt_dir = raw_dir.joinpath("moe-wbgt")
jma_normal_dir = raw_dir.joinpath("jma-normal")


def prepare_directory():
    moe_wbgt_dir.mkdir(parents=True, exist_ok=True)
    jma_normal_dir.joinpath("daily").mkdir(parents=True, exist_ok=True)
    jma_normal_dir.joinpath("monthly").mkdir(parents=True, exist_ok=True)
    jma_normal_dir.joinpath("station").mkdir(parents=True, exist_ok=True)


def flatten_directory(source_dir, target_dir=None):
    source_dir = Path(source_dir)

    if target_dir is None:
        target_dir = source_dir
    else:
        target_dir = Path(target_dir)
        target_dir.mkdir(parents=True, exist_ok=True)

    file_list = [x for x in source_dir.glob("**/*") if x.is_file()]
    for file in file_list:
        # 同名ファイルが存在する場合は上書き
        shutil.move(file, target_dir.joinpath(file.name))

    # 階層の深いディレクトリから削除していく
    dir_list = sorted(list(source_dir.glob("**")), reverse=True)
    for dir in dir_list:
        if len([x for x in dir.glob("**/*") if x.is_file()]) == 0:
            dir.rmdir()


def download_jma_normal():
    save_dir = jma_normal_dir

    jma_normal_url = {
        "daily": "https://www.data.jma.go.jp/stats/data/mdrr/normal/2020/data/normal_amedas_daily.zip",
        "monthly": "https://www.data.jma.go.jp/stats/data/mdrr/normal/2020/data/normal_amedas_monthly.zip",
        "station": "https://www.data.jma.go.jp/stats/data/mdrr/normal/2020/data/amedas_station_index.zip",
    }

    for key, url in jma_normal_url.items():
        r = requests.get(url, timeout=5)

        zip_filename = os.path.basename(url)
        zip_file = save_dir.joinpath(zip_filename)
        with zip_file.open("wb") as f:
            f.write(r.content)

        with zipfile.ZipFile(zip_file) as zf:
            zf.extractall(save_dir.joinpath(key))

        os.remove(zip_file)

        flatten_directory(save_dir.joinpath(key))


def download_moe_wbgt(start_year=2020, end_year=2024):
    save_dir = moe_wbgt_dir
    # 連続アクセスを避けるための待機時間（秒）
    download_delay = 3

    point_url = "https://www.wbgt.env.go.jp/js/point.js"
    r = requests.get(point_url, timeout=5)

    point_raw = re.search(
        r"^var point = ({.*^});", r.text, flags=re.MULTILINE | re.DOTALL
    ).group(1)
    point_json = json.loads(point_raw)

    # 2025年9月時点で地点数は844
    point_list = itertools.chain.from_iterable(point_json.values())
    point_list = [x[0] for x in point_list]

    # デフォルトの場合ペアの数は35
    year_month_pairs = [
        (y, m) for y in range(start_year, end_year + 1) for m in range(4, 11)
    ]

    session = requests.Session()
    retry = Retry(
        total=3,
        connect=3,
        read=3,
        backoff_factor=1,
        status_forcelist=[429, 500, 502, 503, 504],
    )
    session.mount("https://", HTTPAdapter(max_retries=retry))

    for point in point_list:
        save_dir.joinpath(point).mkdir(parents=True, exist_ok=True)

        for year, month in year_month_pairs:
            url = f"https://www.wbgt.env.go.jp/mntr/final/{year}/wbgt_{year}/final_wbgt_{point}_{year}{month:02d}.csv"
            filename = os.path.basename(url)
            save_path = save_dir.joinpath(point, filename)

            if save_path.is_file():
                print(f"Already exists: {save_path}")
                continue

            try:
                r = session.get(url, timeout=5)
            except requests.exceptions.RetryError:
                print(f"Failed to download after retries: {url}")
                time.sleep(download_delay)
                continue

            if r.status_code == 404:
                print(f"Not found: {url}")
                time.sleep(download_delay)
                continue

            if r.status_code == 403:
                print(f"Access forbidden: {url}")
                time.sleep(download_delay)
                continue

            if r.text.startswith('<?xml version="1.0" encoding="UTF-8"?>'):
                print(f"Invalid file: {url}")
                time.sleep(download_delay)
                continue

            with save_path.open("wb") as f:
                f.write(r.content)

            print(f"Downloaded: {save_path}")
            time.sleep(download_delay)


def main():
    prepare_directory()
    download_jma_normal()
    download_moe_wbgt()


if __name__ == "__main__":
    main()
